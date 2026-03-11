import { Suspense } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { OfferCard } from '@/components/OfferCard'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { supabase } from '@/lib/supabaseClient'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PromoUnlockerForm } from '@/components/PromoUnlockerForm'
import { CheckCircle, Shield, Sparkles } from 'lucide-react'

// Operator mappings for SEO
const OPERATORS: Record<string, {
    name: string,
    color: string,
    fullName: string,
}> = {
    'inwi': {
        name: 'Inwi',
        color: 'from-purple-500 to-pink-500',
        fullName: 'Inwi Maroc'
    },
    'orange': {
        name: 'Orange',
        color: 'from-orange-500 to-red-500',
        fullName: 'Orange Maroc'
    },
    'iam': {
        name: 'IAM',
        color: 'from-blue-600 to-indigo-600',
        fullName: 'Maroc Telecom'
    }
}

// Generate Static Params for build time
export function generateStaticParams() {
    return Object.keys(OPERATORS).map((slug) => ({
        slug: slug,
    }))
}

// Dynamic Metadata Generation
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const operator = OPERATORS[params.slug.toLowerCase()]

    if (!operator) {
        return { title: 'Opérateur non trouvé' }
    }

    return {
        title: `Forfaits ${operator.fullName} : Les Meilleures Offres (2026)`,
        description: `Comparez tous les forfaits mobile et fibre optique de ${operator.fullName}. Économisez jusqu'à -50% avec notre comparateur de forfaits au Maroc.`,
        alternates: {
            canonical: `https://monforfait.ma/operateurs/${params.slug}`
        },
        openGraph: {
            title: `Comparatif Forfaits ${operator.fullName} - MonForfait.ma`,
            description: `Découvrez les offres exclusives et remises cachées chez ${operator.fullName}. Forfaits mobiles pas cher et Fibre Optique.`,
        }
    }
}

export default async function OperatorPage({ params }: { params: { slug: string } }) {
    const slug = params.slug.toLowerCase()
    const operatorInfo = OPERATORS[slug]

    if (!operatorInfo) {
        notFound()
    }

    // Server-Side Supabase Fetching
    const { data: offers, error } = await supabase
        .from('plans')
        .select(`
            id,
            title,
            category,
            price_dh,
            download_speed_mbps,
            mobile_data_gb,
            technology,
            highlight_badge,
            target_audience,
            voice_minutes,
            upload_speed_mbps,
            is_sponsored,
            operators!inner (name)
        `)
        .eq('is_active', true)
        .ilike('operators.name', `%${operatorInfo.name}%`)
        .order('price_dh', { ascending: true })

    if (error) {
        console.error('Error fetching operator offers:', error)
    }

    // Fallback if no offers but slug is valid
    const displayOffers = offers || []

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navigation />

            {/* Programmatic JSON-LD specific to this operator hub */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        name: `Forfaits et Offres ${operatorInfo.fullName}`,
                        description: `Comparatif complet des forfaits mobile et internet fibre/ADSL proposés par ${operatorInfo.fullName}.`,
                        provider: {
                            '@type': 'Organization',
                            name: operatorInfo.fullName
                        }
                    })
                }}
            />

            <main className="pb-24">
                {/* Operator Hero Section */}
                <section className="relative overflow-hidden bg-zinc-950 text-white border-b border-zinc-800">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className={`absolute top-[-50%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br ${operatorInfo.color} rounded-full blur-[150px] pointer-events-none opacity-20`}></div>

                    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10 text-center">
                        <Breadcrumbs items={[
                            { label: 'Opérateurs', href: '#' },
                            { label: operatorInfo.name, href: `/operateurs/${slug}` },
                        ]} />

                        <div className="inline-flex items-center gap-2 mt-8 mb-6 bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-sm font-bold">
                            <Shield className="w-4 h-4 text-green-400" />
                            Comparatif {new Date().getFullYear()} Officiel
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            Les meilleurs forfaits <br />
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${operatorInfo.color}`}>
                                {operatorInfo.fullName}
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                            Comparez les {displayOffers.length} offres internet et mobile disponibles chez {operatorInfo.name}.
                            Découvrez les promotions actuelles et trouvez le forfait le moins cher adapté à vos besoins.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    {displayOffers.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
                            <h3 className="text-xl font-bold dark:text-white mb-2">Aucune offre trouvée pour le moment.</h3>
                            <p className="text-zinc-500">Nous rattachons actuellement les forfaits de cet opérateur.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Top 3 Visible */}
                                {displayOffers.slice(0, 3).map((offer, idx) => (
                                    <div key={offer.id || idx} className="relative z-10">
                                        <OfferCard offer={offer as any} />
                                    </div>
                                ))}

                                {/* The rest blurred (Gated Content Flow) */}
                                {displayOffers.length > 3 && displayOffers.slice(3, 4).map((offer, idx) => (
                                    <div key={offer.id || `locked-${idx}`} className="relative filter blur-[6px] opacity-60 select-none pointer-events-none transition-all duration-1000 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 dark:to-zinc-900/90 z-20"></div>
                                        <OfferCard offer={offer as any} />
                                    </div>
                                ))}
                            </div>

                            {/* Gated Content Smart Wall specifically for Operator Page */}
                            {displayOffers.length > 3 && (
                                <div className="w-full mt-12 bg-zinc-50/80 dark:bg-zinc-900/40 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 p-4 sm:p-8 lg:p-12 relative overflow-hidden flex flex-col items-center rounded-3xl">
                                    <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

                                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 w-full max-w-5xl items-center relative z-10">
                                        <div className="flex-1 text-center lg:text-left">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold mb-6 border border-blue-200 dark:border-blue-500/30">
                                                <Sparkles className="w-4 h-4" />
                                                Accès Exclusif
                                            </div>

                                            <h3 className="text-3xl md:text-3xl font-black mb-4 dark:text-white leading-tight">
                                                Débloquez tout le catalogue {operatorInfo.name}.
                                            </h3>
                                            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                                Les opérateurs comme {operatorInfo.name} cachent leurs meilleures réductions de rétention. Nous avons négocié jusqu'à -50%.
                                            </p>

                                            <div className="flex flex-col gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                                <div className="flex items-center gap-2 justify-center lg:justify-start">
                                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                    Gratuit et 100% Sans Engagement
                                                </div>
                                                <div className="flex items-center gap-2 justify-center lg:justify-start">
                                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                    Offres Exclusives Non Disponibles en Agence
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-[0.8] w-full max-w-md transform transition-all hover:-translate-y-1">
                                            <PromoUnlockerForm mode="b2c" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
