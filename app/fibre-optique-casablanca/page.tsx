import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { PromoUnlockerForm } from '@/components/PromoUnlockerForm'
import { Sparkles, MapPin, Wifi, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { TrustBadges } from '@/components/TrustBadges'

export const metadata: Metadata = {
    title: 'Offres Fibre Optique Casablanca - Comparateur 2026 | MonForfait.ma',
    description: 'Comparez toutes les offres de fibre optique à Casablanca (Orange, Inwi, Maroc Telecom). Trouvez le meilleur forfait internet très haut débit pour votre adresse dès aujourd\'hui.',
    keywords: ['fibre optique casablanca', 'internet casablanca', 'orange fibre', 'inwi fibre', 'iam fibre', 'test éligibilité casablanca', 'comparateur fibre maroc'],
    openGraph: {
        title: 'Fibre Optique Casablanca : Le comparatif 2026',
        description: 'Trouvez la fibre la moins chère et la plus rapide à Casablanca.',
    }
}

export default function FibreCasablancaPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Offres Fibre Optique Casablanca - Comparateur',
        description: 'Trouvez la fibre la moins chère et la plus rapide à Casablanca.',
        url: 'https://monforfait.ma/fibre-optique-casablanca',
        publisher: {
            '@type': 'Organization',
            name: 'MonForfait.ma',
            logo: { '@type': 'ImageObject', url: 'https://monforfait.ma/branding/logo-light.png' }
        }
    }

    return (
        <main className="min-h-screen bg-white dark:bg-black font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navigation />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-900 to-black text-white pt-32 pb-20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <MapPin className="w-4 h-4" /> Spécial Casablanca
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            La Fibre Optique à <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Casablanca</span>
                        </h1>
                        <p className="text-xl text-zinc-300 mb-8 max-w-2xl leading-relaxed">
                            Bourgogne, Maarif, Sidi Maarouf, Anfa... Découvrez les meilleures offres fibre de Maroc Telecom, Orange et Inwi disponibles dans votre quartier.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                +300 quartiers couverts
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                Jusqu'à 200 Méga
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <PromoUnlockerForm />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <article className="prose prose-zinc dark:prose-invert prose-lg max-w-none">
                    <h2>Pourquoi comparer la Fibre à Casablanca ?</h2>
                    <p>
                        Casablanca est la capitale économique du Maroc, et son infrastructure internet est la plus développée du pays. Cependant, <strong>la couverture fibre varie énormément d'un quartier à l'autre</strong>. 
                        Un opérateur peut proposer du 100 Mb/s au Maarif, mais être absent à Ain Sebaa, où un autre opérateur prendra le relai.
                    </p>
                    
                    <h3>Les opérateurs présents à Casablanca</h3>
                    <ul>
                        <li><strong>Maroc Telecom (IAM)</strong> : La couverture historique la plus large.</li>
                        <li><strong>Orange Maroc</strong> : Très présent dans les nouveaux quartiers professionnels (CFC, Sidi Maarouf).</li>
                        <li><strong>Inwi</strong> : Les offres souvent les plus agressives en terme de prix pour les particuliers.</li>
                    </ul>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl my-10 border border-blue-100 dark:border-blue-900/30">
                        <h3 className="flex items-center gap-3 mt-0 text-blue-900 dark:text-blue-100">
                            <Wifi className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            Test d'éligibilité gratuit
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200">
                            Ne perdez pas de temps à appeler chaque opérateur. Remplissez notre formulaire rapide et nous vous dirons immédiatement quelle est la meilleure offre disponible à votre adresse exacte (Rue, Immeuble).
                        </p>
                        <Link href="/quiz" className="inline-flex mt-4 items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                            Vérifier mon adresse à Casablanca
                        </Link>
                    </div>
                </article>
            </div>

            <TrustBadges />
            <Footer />
        </main>
    )
}
