import { supabase } from './supabaseClient'

/**
 * Lead Dispatcher Logic
 * Matches leads to partners based on filters and delivers them via webhooks.
 */

export async function dispatchToPartners(leadId: string, leadData: any, score: number, thermal_status: string) {
    try {
        // 1. Fetch active partners
        const { data: partners, error } = await supabase
            .from('partners')
            .select('*')
            .eq('is_active', true)

        if (error || !partners || partners.length === 0) {
            console.log('[Dispatcher] No active partners found for delivery.')
            return []
        }

        const deliveryResults = []

        // 2. Filter and Deliver
        for (const partner of partners) {
            // Basic Filter Logic
            const filters = partner.filters || {}
            
            // Score Filter
            if (filters.min_score && score < filters.min_score) continue

            // City Filter (if specified)
            if (filters.cities && filters.cities.length > 0) {
                const leadCity = leadData.city || ''
                if (!filters.cities.some((c: string) => leadCity.toLowerCase().includes(c.toLowerCase()))) {
                    continue
                }
            }

            // 3. Send Webhook
            if (partner.webhook_url) {
                try {
                    const response = await fetch(partner.webhook_url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            event: 'lead.qualified',
                            lead_id: leadId,
                            score: score,
                            thermal_status: thermal_status,
                            data: {
                                name: leadData.user_name || leadData.name,
                                phone: leadData.user_phone || leadData.phone,
                                city: leadData.city,
                                address: leadData.address,
                                intent: leadData.needs_details || {}
                            },
                            timestamp: new Date().toISOString()
                        })
                    })

                    if (response.ok) {
                        deliveryResults.push(partner.name)
                        console.log(`[Dispatcher] Delivered lead ${leadId} to ${partner.name}`)
                    }
                } catch (deliveryError) {
                    console.error(`[Dispatcher] Failed delivery to ${partner.name}:`, deliveryError)
                }
            }
        }

        return deliveryResults
    } catch (err) {
        console.error('[Dispatcher] Critical error during dispatch:', err)
        return []
    }
}
