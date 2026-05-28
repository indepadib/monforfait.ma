import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get('date_from') || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
    const dateTo = searchParams.get('date_to') || new Date().toISOString().slice(0, 10)
    
    // Fetch all calls within date range
    const { data: calls, error: callsError } = await supabase
      .from('voice_calls')
      .select('status, duration_seconds, lead_value, q1_operator_norm, q2_service, created_at')
      .gte('created_at', `${dateFrom}T00:00:00.000Z`)
      .lte('created_at', `${dateTo}T23:59:59.999Z`)
      
    if (callsError) {
      console.error('[voice/stats] Database error:', callsError)
      return NextResponse.json({ error: 'Failed to fetch call statistics' }, { status: 500 })
    }
    
    const stats = {
      total_calls: 0,
      confirmed: 0,
      invalid: 0,
      voicemail: 0,
      callbacks: 0,
      declined: 0,
      avg_duration: 0,
      confirmed_rate: 0,
      premium_leads: 0,
      high_leads: 0
    }
    
    let totalDuration = 0
    const operatorCounts: Record<string, { total: number, confirmed: number }> = {}
    const serviceCounts: Record<string, { total: number, confirmed: number }> = {}
    
    if (calls && calls.length > 0) {
      stats.total_calls = calls.length
      
      calls.forEach(call => {
        // Status counts
        if (call.status === 'CONFIRMED') stats.confirmed++
        else if (call.status === 'INVALID') stats.invalid++
        else if (call.status === 'VOICEMAIL') stats.voicemail++
        else if (call.status === 'CALLBACK_REQUESTED') stats.callbacks++
        else if (call.status === 'DECLINED') stats.declined++
        
        // Lead values
        if (call.lead_value === 'premium') stats.premium_leads++
        else if (call.lead_value === 'élevée') stats.high_leads++
        
        // Duration
        if (call.duration_seconds) {
          totalDuration += call.duration_seconds
        }
        
        // Operator stats
        const op = call.q1_operator_norm || 'Inconnu'
        if (!operatorCounts[op]) operatorCounts[op] = { total: 0, confirmed: 0 }
        operatorCounts[op].total++
        if (call.status === 'CONFIRMED') operatorCounts[op].confirmed++
        
        // Service stats
        const svc = call.q2_service || 'non_précisé'
        if (!serviceCounts[svc]) serviceCounts[svc] = { total: 0, confirmed: 0 }
        serviceCounts[svc].total++
        if (call.status === 'CONFIRMED') serviceCounts[svc].confirmed++
      })
      
      stats.avg_duration = Math.round(totalDuration / stats.total_calls)
      stats.confirmed_rate = Math.round((stats.confirmed / stats.total_calls) * 100)
    }
    
    // Format operator list
    const byOperator = Object.entries(operatorCounts).map(([operator, counts]) => ({
      operator,
      total: counts.total,
      confirmed: counts.confirmed
    })).sort((a, b) => b.confirmed - a.confirmed)
    
    // Format service list
    const byService = Object.entries(serviceCounts).map(([service, counts]) => ({
      service,
      total: counts.total,
      confirmed: counts.confirmed
    }))
    
    return NextResponse.json({
      period: { from: dateFrom, to: dateTo },
      stats,
      byOperator,
      byService
    })
    
  } catch (error: any) {
    console.error('[voice/stats server error]', error)
    return NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 })
  }
}
