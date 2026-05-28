import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import OfferDetailsContent from './OfferDetailsContent'

// This would ideally come from a slugified database lookup
// but since we're generating on the fly, we'll try to find by ID or Name
async function getOffer(slug: string) {
    const { data: offers, error } = await supabase
        .from('scraped_offers')
        .select('*')
    
    if (error || !offers) return null
    return offers.find(o => 
        o.id === slug || 
        o.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    ) || offers[0] // Fallback for demo purposes
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const offer = await getOffer(slug)

    if (!offer) {
        return {
            title: 'Offre Introuvable - MonForfait.ma',
            description: 'Cette offre internet ou mobile n\'existe plus.'
        }
    }

    const title = `Forfait ${offer.name} de ${offer.provider} | MonForfait.ma`
    const description = `Découvrez l'offre ${offer.name} proposée par ${offer.provider} au prix de ${offer.price} DH/mois. Comparez et trouvez le meilleur forfait au Maroc.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            images: [
                {
                    url: '/branding/logo-light.png',
                    width: 1200,
                    height: 630,
                    alt: `Forfait ${offer.name} - ${offer.provider}`,
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    }
}

export default async function OfferDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const offer = await getOffer(slug)

    if (!offer) {
        notFound()
    }

    return <OfferDetailsContent offer={offer} slug={slug} />
}
