'use client'

/**
 * Lead Scorer Logic
 * Calculates a value score (0-100) and thermal status (HOT/WARM/COLD)
 * based on lead data capture.
 */

export type LeadData = {
    reason?: string
    timing?: string
    speedtest_results?: {
        download: number
        upload: number
        ping: number
    }
    city?: string
    is_pro?: boolean
}

export type ScoredLead = {
    score: number
    thermal_status: 'HOT' | 'WARM' | 'COLD'
}

export function calculateLeadScore(data: LeadData): ScoredLead {
    let score = 0

    // 1. Intent / Timing (Highest weight)
    if (data.timing === 'asap') score += 40
    if (data.timing === '1_month') score += 20

    // 2. Reason Trigger
    if (data.reason === 'moving') score += 30
    if (data.reason === 'too_slow' || data.reason === 'speed') score += 20
    if (data.reason === 'switching') score += 15

    // 3. Technical Necessity (Speed test)
    if (data.speedtest_results) {
        if (data.speedtest_results.download < 10) score += 30
        else if (data.speedtest_results.download < 30) score += 20
        else if (data.speedtest_results.download < 100) score += 10
    }

    // 4. Pro Status
    if (data.is_pro) score += 20

    // Cap score at 100
    score = Math.min(score, 100)

    // Determine Thermal Status
    let thermal_status: 'HOT' | 'WARM' | 'COLD' = 'COLD'
    if (score >= 70) thermal_status = 'HOT'
    else if (score >= 40) thermal_status = 'WARM'

    return { score, thermal_status }
}
