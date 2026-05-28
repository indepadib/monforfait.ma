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
    phone?: string
}

export type ScoredLead = {
    score: number
    thermal_status: 'HOT' | 'WARM' | 'COLD'
}

function isDummyPhone(phone?: string): boolean {
    if (!phone) return false
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    
    // Obvious sequential or too short numbers
    if (cleanPhone.length < 9) return true
    if (/^(.)\1+$/.test(cleanPhone)) return true // e.g. "0666666666" or repeating digits
    if (cleanPhone.includes('12345678') || cleanPhone.includes('87654321')) return true
    
    // Common Morocco test placeholders
    if (cleanPhone === '0600000000' || cleanPhone === '212600000000' || cleanPhone === '0600000001') return true
    
    return false
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

    // 5. Suspect Phone check - Force COLD status
    if (isDummyPhone(data.phone)) {
        score = Math.min(score, 15) // Max 15 points if suspect
    }

    // Determine Thermal Status
    let thermal_status: 'HOT' | 'WARM' | 'COLD' = 'COLD'
    if (score >= 70) thermal_status = 'HOT'
    else if (score >= 40) thermal_status = 'WARM'

    return { score, thermal_status }
}
