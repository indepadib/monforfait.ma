import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabaseClient'
import { normalizeOperator, normalizePhone, computeRouting } from '@/lib/voiceUtils'

const VAPI_WEBHOOK_SECRET = process.env.VAPI_WEBHOOK_SECRET || ''
const RETRY_DELAY_HOURS = parseInt(process.env.RETRY_DELAY_HOURS || '4', 10)

function verifyVapiSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!secret) return true; // Skip signature check in dev if secret is not set
  if (!signatureHeader) return false;
  
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
    
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signatureHeader)
    );
  } catch (e) {
    return false;
  }
}

export async function POST(req: Request) {
  let rawBody = ''
  try {
    rawBody = await req.text()
    const signature = req.headers.get('x-vapi-signature')
    
    // 1. Signature Verification
    if (!verifyVapiSignature(rawBody, signature, VAPI_WEBHOOK_SECRET)) {
      console.warn('[Vapi Webhook] Invalid signature received.');
      return NextResponse.json({ error: 'Unauthorized signature' }, { status: 401 })
    }
    
    const payload = JSON.parse(rawBody)
    const msg = payload.message || {}
    
    const call = msg.call || {}
    const vapiCallId = call.id || null
    const eventType = msg.type || null
    
    // 2. Log Webhook Payload in Database for Audit/Debugging
    const { data: logData, error: logError } = await supabase
      .from('voice_webhook_logs')
      .insert({
        vapi_call_id: vapiCallId,
        event_type: eventType,
        payload: payload,
        processed: false
      })
      .select('id')
      .single()
      
    const logId = logData?.id
    
    // 3. Ignore all non-final events (e.g. status-update, assistant-request)
    if (eventType !== 'end-of-call-report') {
      if (logId) {
        await supabase
          .from('voice_webhook_logs')
          .update({ processed: true })
          .eq('id', logId)
      }
      return NextResponse.json({ status: 'ignored', type: eventType })
    }
    
    // Process End of Call Report
    const analysis = msg.analysis || {}
    const artifact = msg.artifact || {}
    const structured = analysis.structuredData || {}
    const leadId = call.metadata?.lead_id
    
    if (!leadId) {
      const errorMsg = 'lead_id missing from call metadata'
      console.warn(`[Vapi Webhook] ${errorMsg}`);
      if (logId) {
        await supabase
          .from('voice_webhook_logs')
          .update({ error_msg: errorMsg })
          .eq('id', logId)
      }
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }
    
    // Calculate Call Duration
    let durationSeconds = 0
    if (call.startedAt && call.endedAt) {
      durationSeconds = Math.round(
        (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000
      )
    }
    
    // Extract & Normalize structured info
    const statusVal = structured.status || 'ERROR'
    const q1Raw = structured.q1_operateur_actuel || ''
    const q2Raw = structured.q2_service_recherche || 'non_précisé'
    const callbackPref = structured.callback_preference || null
    
    const opNorm = normalizeOperator(q1Raw)
    const routing = computeRouting(opNorm, q2Raw)
    
    // 4. Update voice_calls table
    // We check if a voice call row exists first
    const { data: existingCall } = await supabase
      .from('voice_calls')
      .select('id')
      .eq('vapi_call_id', vapiCallId)
      .maybeSingle()
      
    const callData = {
      lead_id: leadId,
      vapi_call_id: vapiCallId,
      status: statusVal,
      first_name_confirmed: structured.first_name_confirmed ? true : false,
      q1_operator_raw: q1Raw,
      q1_operator_norm: opNorm,
      q2_service: q2Raw,
      callback_preference: callbackPref,
      summary: analysis.summary || null,
      target_operator_1: routing.cible1,
      target_operator_2: routing.cible2,
      lead_value: routing.lead_value,
      recording_url: artifact.recordingUrl || null,
      transcript_url: artifact.transcriptUrl || null,
      duration_seconds: durationSeconds,
      ended_at: new Date().toISOString()
    }
    
    if (existingCall) {
      await supabase
        .from('voice_calls')
        .update(callData)
        .eq('vapi_call_id', vapiCallId)
    } else {
      await supabase
        .from('voice_calls')
        .insert({
          ...callData,
          started_at: call.startedAt || new Date().toISOString()
        })
    }
    
    // 5. Update Lead Status and calculate retry logic
    const leadUpdate: Record<string, any> = {
      voice_status: statusVal,
      voice_next_retry: null
    }
    
    if (statusVal === 'CALLBACK_REQUESTED' || statusVal === 'VOICEMAIL') {
      // Schedule retry after delay
      const nextRetry = new Date(Date.now() + RETRY_DELAY_HOURS * 3600 * 1000)
      leadUpdate.voice_next_retry = nextRetry.toISOString()
    }
    
    if (statusVal === 'DECLINED') {
      // Auto-add to blacklist
      const phoneRaw = call.customer?.number
      const phoneNorm = normalizePhone(phoneRaw)
      if (phoneNorm) {
        await supabase
          .from('voice_blacklist')
          .insert({
            phone_norm: phoneNorm,
            reason: 'DECLINED sur appel IA',
            added_by: 'auto'
          })
          // Use onConflict if unique violation to prevent error
          .select()
          .catch(e => console.error('[Webhook Blacklist Add Error]', e))
      }
    }
    
    const { error: leadUpdateError } = await supabase
      .from('leads')
      .update(leadUpdate)
      .eq('id', leadId)
      
    if (leadUpdateError) {
      throw new Error(`Failed to update lead: ${leadUpdateError.message}`)
    }
    
    // 6. Mark webhook log as successfully processed
    if (logId) {
      await supabase
        .from('voice_webhook_logs')
        .update({ processed: true })
        .eq('id', logId)
    }
    
    console.log(`[Vapi Webhook] Finished processing lead ${leadId} status=${statusVal}`);
    return NextResponse.json({ success: true, lead_id: leadId, status: statusVal })
    
  } catch (error: any) {
    console.error('[Vapi Webhook Error]', error);
    return NextResponse.json({ error: 'Internal processing error', detail: error.message }, { status: 500 })
  }
}
