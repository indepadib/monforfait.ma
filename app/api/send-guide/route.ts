import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('RESEND_API_KEY is not defined in environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const resend = new Resend(apiKey);

        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Send the email with the guide link
        const data = await resend.emails.send({
            from: 'MonForfait.ma <guide@monforfait.ma>', // Ensure this domain is verified in Resend, or use onboarding@resend.dev for testing
            to: [email],
            subject: 'Votre Guide Gratuit : Comment choisir son forfait au Maroc',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h1 style="color: #2563EB;">Bonjour !</h1>
                    <p>Merci pour votre intérêt pour notre guide exclusif.</p>
                    <p>Comme promis, voici votre guide gratuit <strong>"Comment choisir la meilleure offre internet au Maroc"</strong> :</p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="https://monforfait.ma/guide-internet-maroc.pdf" style="background-color: #F59E0B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            Télécharger le Guide (PDF)
                        </a>
                    </div>
                    
                    <p>Ce guide de 12 pages vous aidera à comprendre :</p>
                    <ul>
                        <li>La différence entre l'ADSL, la Fibre et la 4G/5G</li>
                        <li>Comment évaluer vos vrais besoins en data et en appels</li>
                        <li>Les pièges à éviter lors de la souscription d'un contrat</li>
                    </ul>
                    
                    <p>Si vous avez des questions, n'hésitez pas à répondre directement à cet email. Notre équipe est là pour vous aider !</p>
                    
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #6B7280; text-align: center;">
                        L'équipe MonForfait.ma <br/>
                        Comparateur N°1 au Maroc
                    </p>
                </div>
            `
        })

        return NextResponse.json({ success: true, data })

    } catch (error) {
        console.error('Error sending guide email:', error)
        return NextResponse.json(
            { error: 'Failed to send guide email' },
            { status: 500 }
        )
    }
}
