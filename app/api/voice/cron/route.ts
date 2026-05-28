import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { isCallingHour } from '@/lib/voiceUtils'

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3', 10)
const BATCH_SIZE = 5

export async function GET(req: Request) {
  try {
    // 1. Check Calling Hours
    if (!isCallingHour()) {
      return NextResponse.json({ 
        status: 'skipped', 
        reason: 'Outside Moroccan calling hours (08:00 - 20:00, avoiding Friday afternoons).' 
      })
    }
    
    // 2. Fetch pending queue items
    const nowStr = new Date().toISOString()
    const { data: queueItems, error: queueError } = await supabase
      .from('voice_queue')
      .select('id, lead_id, priority, attempts')
      .lte('scheduled_at', nowStr)
      .or(`locked_until.is.null,locked_until.lt.${nowStr}`)
      .order('priority', { ascending: true })
      .order('scheduled_at', { ascending: true })
      .limit(BATCH_SIZE)
      
    if (queueError) {
      console.error('[voice/cron] Fetch queue error:', queueError)
      return NextResponse.json({ error: 'Failed to fetch queue items' }, { status: 500 })
    }
    
    if (!queueItems || queueItems.length === 0) {
      return NextResponse.json({ status: 'success', processed: 0, message: 'Queue is empty' })
    }
    
    let processedCount = 0
    
    // 3. Process items in batch
    for (const item of queueItems) {
      // Lock the item for 2 minutes to prevent other worker instances from grabbing it
      const lockUntil = new Date(Date.now() + 2 * 60000).toISOString()
      await supabase
        .from('voice_queue')
        .update({ locked_until: lockUntil })
        .eq('id', item.id)
        
      try {
        // Fetch lead information
        const { data: lead } = await supabase
          .from('leads')
          .select('id, consent_voice, voice_status, voice_retry_count')
          .eq('id', item.lead_id)
          .maybeSingle()
          
        if (!lead) {
          // Lead deleted, clean up queue
          await supabase.from('voice_queue').delete().eq('id', item.id)
          continue
        }
        
        // If constraints are violated (e.g. no consent, already confirmed, max retries reached), remove from queue
        if (
          !lead.consent_voice || 
          ['CONFIRMED', 'DECLINED', 'ABANDONED'].includes(lead.voice_status) ||
          (lead.voice_retry_count || 0) >= MAX_RETRIES
        ) {
          console.log(`[voice/cron] Lead ${lead.id} violates call constraints. Removing from queue.`);
          await supabase.from('voice_queue').delete().eq('id', item.id)
          continue
        }
        
        // Trigger call internally using the local /api/voice/call route
        const protocol = req.url.startsWith('https') ? 'https' : 'http'
        const host = req.headers.get('host') || 'localhost:3000'
        const callUrl = `${protocol}://${host}/api/voice/call`
        
        const callResponse = await fetch(callUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: lead.id })
        })
        
        if (callResponse.ok) {
          const callResult = await callResponse.json()
          if (callResult.success) {
            console.log(`[voice/cron] Successfully initiated call for lead ${lead.id}. Removing from queue.`);
            await supabase.from('voice_queue').delete().eq('id', item.id)
            processedCount++
          } else {
            throw new Error(callResult.error || 'Failed to trigger call')
          }
        } else {
          const errorText = await callResponse.text()
          throw new Error(`Call route returned status ${callResponse.status}: ${errorText}`)
        }
        
        // Introduce artificial spacing delay between Vapi calls to respect rates
        await new Promise(resolve => setTimeout(resolve, 6000))
        
      } catch (err: any) {
        console.error(`[voice/cron] Error processing queue item ${item.id}:`, err.message)
        // Unlock queue item and increment attempts
        await supabase
          .from('voice_queue')
          .update({
            locked_until: null,
            attempts: (item.attempts || 0) + 1
          })
          .eq('id', item.id)
      }
    }
    
    return NextResponse.json({ status: 'success', processed: processedCount })
    
  } catch (error: any) {
    console.error('[voice/cron server error]', error)
    return NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 })
  }
}
