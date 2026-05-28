import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const status = searchParams.get('status') || null
    const operator = searchParams.get('operator') || null
    const service = searchParams.get('service') || null
    const dateFrom = searchParams.get('date_from') || null
    
    const limit = 50
    const fromRange = (page - 1) * limit
    const toRange = fromRange + limit - 1
    
    // Build Supabase query
    let query = supabase
      .from('voice_calls')
      .select('*, lead:leads(*)', { count: 'exact' })
      
    if (status) {
      query = query.eq('status', status)
    }
    if (operator) {
      query = query.eq('q1_operator_norm', operator)
    }
    if (service) {
      query = query.eq('q2_service', service)
    }
    if (dateFrom) {
      query = query.gte('created_at', `${dateFrom}T00:00:00.000Z`)
    }
    
    // Sort and Paginate
    const { data: rows, count, error } = await query
      .order('created_at', { ascending: false })
      .range(fromRange, toRange)
      
    if (error) {
      console.error('[voice/leads] Database error:', error)
      return NextResponse.json({ error: 'Failed to query voice leads history' }, { status: 500 })
    }
    
    const total = count || 0
    
    // Format rows to match the dashboard expected fields
    const formattedRows = (rows || []).map(r => {
      const leadInfo = (r as any).lead || {}
      return {
        id: leadInfo.id || r.lead_id,
        prenom: leadInfo.user_name || 'Prospect',
        telephone: leadInfo.user_phone || '',
        email: leadInfo.user_email || '',
        voice_status: leadInfo.voice_status || 'PENDING',
        call_status: r.status,
        q1_operator_norm: r.q1_operator_norm,
        q2_service: r.q2_service,
        target_operator_1: r.target_operator_1,
        target_operator_2: r.target_operator_2,
        lead_value: r.lead_value,
        recording_url: r.recording_url,
        transcript_url: r.transcript_url,
        duration_seconds: r.duration_seconds,
        summary: r.summary,
        called_at: r.created_at
      }
    })
    
    return NextResponse.json({
      data: formattedRows,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
    
  } catch (error: any) {
    console.error('[voice/leads server error]', error)
    return NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 })
  }
}
