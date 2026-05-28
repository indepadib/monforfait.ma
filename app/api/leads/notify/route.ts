import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabaseClient'
import { calculateLeadScore } from '@/lib/leadScorer'
import { dispatchToPartners } from '@/lib/dispatcher'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { leadId, phone, needs_details = {}, source = 'unknown', user_name = '', city = '', address = '', is_pro = false } = body

        if (!phone) {
            return NextResponse.json(
                { error: "Phone number is required to notify partners." },
                { status: 400 }
            )
        }

        // 1. Calculate Lead Score & Thermal Status
        const { score, thermal_status } = calculateLeadScore({
            reason: needs_details?.reason,
            timing: needs_details?.installation_timing,
            speedtest_results: needs_details?.speedtest_results,
            city,
            is_pro,
            phone
        })

        // 2. Update Lead in Database with Score/Status (if leadId provided)
        if (leadId) {
            try {
                await supabase.from('leads').update({
                    score,
                    thermal_status
                }).eq('id', leadId)
            } catch (dbError) {
                console.error('[Automation] Database update failed (Check if columns exist):', dbError)
                // We continue even if DB update fails to ensure delivery still happens
            }
        }

        const consolidatedLeadData = {
            id: leadId,
            phone,
            name: user_name,
            city,
            address,
            needs_details,
            is_pro,
            score,
            thermal_status
        }

        // 3. Dispatch to Partners via Webhooks
        const notifiedPartners = await dispatchToPartners(leadId || phone, consolidatedLeadData, score, thermal_status)

        // 4. Webhook Forwarding (Legacy/B2B Pipeline)
        if (process.env.B2B_WEBHOOK_URL) {
            try {
                await fetch(process.env.B2B_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'new_lead_v4',
                        score,
                        thermal_status,
                        data: consolidatedLeadData
                    })
                })
            } catch (err) {
                console.error('[B2B Pipeline] Legacy Webhook failed:', err)
            }
        }

        // 4.5. Instant AI Voice Verification Call (via Bland.ai API)
        if (process.env.BLAND_AI_API_KEY) {
            try {
                let formattedPhone = phone.trim().replace(/\s/g, '');
                if (formattedPhone.startsWith('0')) {
                    formattedPhone = '+212' + formattedPhone.substring(1);
                } else if (!formattedPhone.startsWith('+') && !formattedPhone.startsWith('212')) {
                    formattedPhone = '+212' + formattedPhone;
                } else if (formattedPhone.startsWith('212')) {
                    formattedPhone = '+' + formattedPhone;
                }

                const response = await fetch('https://api.bland.ai/v1/calls', {
                    method: 'POST',
                    headers: {
                        'authorization': process.env.BLAND_AI_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone_number: formattedPhone,
                        task: `Bonjour, je suis l'assistant vocal intelligent de MonForfait.ma. Je vous appelle très rapidement pour valider votre numéro de téléphone et confirmer votre demande d'éligibilité fibre à ${city}. Confirmez-vous que vous souhaitez recevoir les offres ? Merci beaucoup et à très bientôt.`,
                        voice: 'Florian', // Standard French voice
                        language: 'fr',
                        reduce_latency: true
                    })
                });

                if (response.ok) {
                    console.log(`[AI Voice Verification] Call successfully triggered to ${formattedPhone}`);
                    if (leadId) {
                        // Log the call trigger event in Supabase inside needs_details without breaking constraints
                        const updatedNeeds = {
                            ...needs_details,
                            ai_verification: {
                                triggered: true,
                                provider: 'bland.ai',
                                called_at: new Date().toISOString()
                            }
                        };
                        await supabase.from('leads').update({
                            needs_details: updatedNeeds
                        }).eq('id', leadId);
                    }
                } else {
                    const errBody = await response.json();
                    console.warn('[AI Voice Verification] Bland.ai rejected call:', errBody);
                }
            } catch (callError) {
                console.error('[AI Voice Verification] Exception occurred while triggering call:', callError);
            }
        }

        // 5. Admin Email Alert (High Score Alert only)
        if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL_NOTIFICATION && score >= 70) {
            const resend = new Resend(process.env.RESEND_API_KEY)
            await resend.emails.send({
                from: 'Lead Engine <contact@maplyo.com>',
                to: process.env.ADMIN_EMAIL_NOTIFICATION.split(','),
                subject: `🔥 HOT LEAD (${score}%): ${phone} - ${city}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 4px solid #ef4444; border-radius: 12px;">
                        <h1 style="color: #ef4444;">🔥 Nouveau Lead HOT détecté !</h1>
                        <p>Ce prospect est prêt à s'abonner immédiatement.</p>
                        <table border="0" cellpadding="8" style="width: 100%;">
                            <tr><td style="font-weight:bold;">Score:</td><td style="color: #ef4444; font-weight:bold;">${score}% (${thermal_status})</td></tr>
                            <tr><td style="font-weight:bold;">Client:</td><td>${user_name || 'Prospect'}</td></tr>
                            <tr><td style="font-weight:bold;">WhatsApp:</td><td><a href="https://wa.me/${phone}">${phone}</a></td></tr>
                            <tr><td style="font-weight:bold;">Zone:</td><td>${city} - ${address}</td></tr>
                            <tr><td style="font-weight:bold;">Besoin:</td><td>${needs_details?.reason || 'Non spécifié'}</td></tr>
                        </table>
                        <hr/>
                        <p><strong>Partenaires notifiés:</strong> ${notifiedPartners.join(', ') || 'Aucun (Dispatcher actif)'}</p>
                    </div>
                `
            })
        }

        return NextResponse.json({ 
            success: true, 
            message: "Lead processed and dispatched.",
            score,
            thermal_status,
            delivered_to: notifiedPartners
        })

    } catch (error: any) {
        console.error('[Automation Engine Error]', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
