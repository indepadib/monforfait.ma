import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { leadId, phone, needs_details = {}, source = 'unknown' } = body

        if (!phone) {
            return NextResponse.json(
                { error: "Phone number is required to notify partners." },
                { status: 400 }
            )
        }

        // 1. Webhook Forwarding (Zapier, Make, or custom CRM)
        // If the user configures a Webhook URL, send the data immediately!
        if (process.env.B2B_WEBHOOK_URL) {
            try {
                await fetch(process.env.B2B_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'new_lead',
                        data: { leadId, phone, needs_details, source, timestamp: new Date().toISOString() }
                    })
                })
                console.log(`[B2B Pipeline] Successfully forwarded Lead ${leadId || phone} to Webhook`)
            } catch (webhookError) {
                console.error('[B2B Pipeline] Webhook failed:', webhookError)
                // We don't throw here to ensure we still try sending the email notification if configured
            }
        }

        // 2. Email Forwarding (Internal Sales Team Alert)
        // If Resend API key and Notification Email are configured, send a rich email alert.
        if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL_NOTIFICATION) {
            const resend = new Resend(process.env.RESEND_API_KEY)
            
            await resend.emails.send({
                from: 'Lead Alert <contact@maplyo.com>',
 // Update domain when verified
                to: process.env.ADMIN_EMAIL_NOTIFICATION.split(','),
                subject: `🚨 Nouveau Lead Télecom: ${needs_details?.interest || 'Offre'} - ${phone}`,
                html: `
                    <h2>Nouveau Prospect Capturé !</h2>
                    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                        <tr>
                            <td style="background-color: #f3f4f6; font-weight: bold;">Téléphone</td>
                            <td><a href="tel:${phone}">${phone}</a></td>
                        </tr>
                        <tr>
                            <td style="background-color: #f3f4f6; font-weight: bold;">Intérêt</td>
                            <td style="text-transform: capitalize;">${needs_details?.interest || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #f3f4f6; font-weight: bold;">Source</td>
                            <td>${source}</td>
                        </tr>
                        <tr>
                            <td style="background-color: #f3f4f6; font-weight: bold;">Réponses Quiz</td>
                            <td>
                                <pre>${JSON.stringify(needs_details, null, 2)}</pre>
                            </td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
                        <em>Ce lead provient de ${source}. Connectez-vous à Supabase pour voir tout l'historique de ce prospect.</em>
                    </p>
                `
            })
            console.log(`[B2B Pipeline] Email notification sent to admin for lead ${phone}`)
        }

        return NextResponse.json({ success: true, message: "Lead processed and notified." })

    } catch (error: any) {
        console.error('[B2B Pipeline Error]', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
