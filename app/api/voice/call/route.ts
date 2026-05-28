import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { normalizePhone, isCallingHour } from '@/lib/voiceUtils'

const VAPI_API_KEY = process.env.VAPI_API_KEY || ''
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || ''
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID || ''
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3', 10)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { leadId, forceCall = false } = body
    
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 })
    }
    
    // 1. Load lead from DB
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, user_name, user_phone, consent_voice, voice_status, voice_retry_count')
      .eq('id', leadId)
      .maybeSingle()
      
    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    
    // 2. Perform business constraints check (unless forceCall is true)
    if (!forceCall) {
      if (!lead.consent_voice) {
        return NextResponse.json({ error: 'No phone callback consent (consent_voice = false)' }, { status: 400 })
      }
      
      if (['CONFIRMED', 'DECLINED', 'ABANDONED'].includes(lead.voice_status)) {
        return NextResponse.json({ error: `Lead already processed with status: ${lead.voice_status}` }, { status: 400 })
      }
      
      if (lead.voice_retry_count >= MAX_RETRIES) {
        return NextResponse.json({ error: 'Maximum retry count reached' }, { status: 400 })
      }
      
      // Check Calling Hours
      if (!isCallingHour()) {
        return NextResponse.json({ 
          error: "Outside Moroccan calling hours (08:00 - 20:00, avoiding Friday afternoons). Scheduled for worker processing." 
        }, { status: 400 })
      }
    }
    
    // 3. Normalize Phone & Blacklist Check
    const phone = normalizePhone(lead.user_phone)
    if (!phone) {
      return NextResponse.json({ error: 'Invalid phone format. Only Moroccan numbers (+212) are allowed.' }, { status: 400 })
    }
    
    const { data: blacklisted } = await supabase
      .from('voice_blacklist')
      .select('id')
      .eq('phone_norm', phone)
      .maybeSingle()
      
    if (blacklisted) {
      return NextResponse.json({ error: 'Phone number is blacklisted' }, { status: 400 })
    }
    
    // 4. Trigger Outbound Vapi Call
    if (!VAPI_API_KEY || !VAPI_ASSISTANT_ID || !VAPI_PHONE_NUMBER_ID) {
      return NextResponse.json({ error: 'Vapi integration credentials are missing on the server.' }, { status: 500 })
    }
    
    const vapiPayload = {
      assistantId: VAPI_ASSISTANT_ID,
      phoneNumberId: VAPI_PHONE_NUMBER_ID,
      customer: {
        number: phone,
        name: lead.user_name || 'Client',
      },
      assistantOverrides: {
        variableValues: {
          PRENOM_LEAD: lead.user_name || 'Client',
          LEAD_ID: String(lead.id),
        }
      },
      metadata: {
        lead_id: String(lead.id),
        source: 'monforfait.ma',
      }
    }
    
    const vapiResponse = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vapiPayload)
    })
    
    if (!vapiResponse.ok) {
      const errorText = await vapiResponse.text()
      console.error('[Vapi call trigger error]', errorText);
      return NextResponse.json({ error: 'Vapi.ai API rejected the call request.', details: errorText }, { status: vapiResponse.status })
    }
    
    const vapiCall = await vapiResponse.json()
    const vapiCallId = vapiCall.id
    
    // 5. Insert voice call record in DB
    const { data: voiceCall, error: insertError } = await supabase
      .from('voice_calls')
      .insert({
        lead_id: lead.id,
        vapi_call_id: vapiCallId,
        started_at: new Date().toISOString()
      })
      .select('id')
      .single()
      
    if (insertError) {
      console.error('[voice/call] Insert voice call error:', insertError)
    }
    
    // 6. Increment retry count and set status to CALLING
    await supabase
      .from('leads')
      .update({
        voice_status: 'CALLING',
        voice_called_at: new Date().toISOString(),
        voice_retry_count: (lead.voice_retry_count || 0) + 1
      })
      .eq('id', lead.id)
      
    return NextResponse.json({
      success: true,
      vapi_call_id: vapiCallId,
      voice_call_db_id: voiceCall?.id || null,
      phone_called: phone
    })
    
  } catch (error: any) {
    console.error('[voice/call server error]', error)
    return NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 })
  }
}
