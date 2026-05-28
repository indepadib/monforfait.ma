import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { isCallingHour } from '@/lib/voiceUtils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { leadId, priority = 5 } = body
    
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 })
    }
    
    // 1. Verify that lead exists
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, user_phone, consent_voice')
      .eq('id', leadId)
      .maybeSingle()
      
    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    
    if (!lead.consent_voice) {
      return NextResponse.json({ error: 'No phone callback consent' }, { status: 400 })
    }
    
    // 2. Insert lead into the voice queue (using upsert/insert ignore fallback)
    // Check if lead is already in the queue
    const { data: existingQueue } = await supabase
      .from('voice_queue')
      .select('id')
      .eq('lead_id', leadId)
      .maybeSingle()
      
    if (!existingQueue) {
      const { error: queueError } = await supabase
        .from('voice_queue')
        .insert({
          lead_id: leadId,
          priority: priority,
          scheduled_at: new Date().toISOString()
        })
        
      if (queueError) {
        console.error('[voice/queue] Database insert error:', queueError)
        return NextResponse.json({ error: 'Failed to queue lead in database' }, { status: 500 })
      }
    }
    
    // 3. Fast feedback loop: if within calling hours, trigger the call immediately
    if (isCallingHour()) {
      console.log(`[voice/queue] Within calling hours. Triggering call immediately for lead ${leadId}`);
      
      // Make a fetch request to /api/voice/call route (internal API invocation)
      try {
        const protocol = req.url.startsWith('https') ? 'https' : 'http'
        const host = req.headers.get('host') || 'localhost:3000'
        const callUrl = `${protocol}://${host}/api/voice/call`
        
        // Non-blocking trigger: we don't wait for completion of the Vapi API request to block the client
        fetch(callUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId })
        }).then(async (res) => {
          if (res.ok) {
            const data = await res.json()
            if (data.success) {
              console.log(`[voice/queue] Instant call triggered successfully. Removing lead ${leadId} from queue.`);
              // Remove from queue since call is successfully initiated
              await supabase.from('voice_queue').delete().eq('lead_id', leadId)
            }
          } else {
            console.warn('[voice/queue] Instant call initiation failed:', res.status, await res.text());
          }
        }).catch(err => {
          console.error('[voice/queue] Fetch call route error:', err)
        })
      } catch (err) {
        console.error('[voice/queue] Failed to trigger internal call route:', err)
      }
    } else {
      console.log(`[voice/queue] Outside calling hours. Lead ${leadId} queued for worker processing.`);
    }
    
    return NextResponse.json({ success: true, status: 'queued', lead_id: leadId })
    
  } catch (error: any) {
    console.error('[voice/queue server error]', error)
    return NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 })
  }
}
