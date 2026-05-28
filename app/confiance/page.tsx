import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ShieldCheck, Scale, Leaf, HeartHandshake, Eye } from 'lucide-react'
import { CONFIG } from '@/lib/config'

export const metadata: Metadata = {
    title: 'Pourquoi nous faire confiance ? | MonForfait.ma',
    description: 'Découvrez notre mission, notre méthodologie de comparaison et notre modèle économique transparent. Nous sommes votre allié face aux opérateurs.',
}

export default function ConfiancePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 pt-8">
                <Breadcrumbs items={[{ label: 'Confiance', href: '/confiance' }]} />
            </div>

            <main className="max-w-4xl mx-auto px-4 py-16">
                <header className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-zinc-900 dark:text-white">
                        Votre Allié Telecom Indépendant
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">
                        Chez MonForfait.ma, notre mission est simple : aider chaque Marocain à payer le juste prix pour sa connexion.
                    </p>
                </header>

                <div className="space-y-16">
                    {/* Section 1: Independence */}
                    <section className="bg-zinc-50 dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Indépendance Totale</h2>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            Contrairement aux sites d'opérateurs, nous ne sommes pas là pour vous vendre un forfait spécifique. Nous sommes un média indépendant. Notre algorithme de comparaison classe les offres selon des critères objectifs : prix, volume data, durée d'engagement et qualité réseau.
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            <strong>Nous n'appartenons à aucun opérateur.</strong> Ni IAM, ni Orange, ni Inwi ne dictent nos classements.
                        </p>
                    </section>

                    {/* Section 2: Revenue Model */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                                <Leaf className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Notre Modèle Économique</h2>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            Pour maintenir ce service gratuit pour vous, nous utilisons l'affiliation. Lorsqu'un utilisateur souscrit à un abonnement après avoir cliqué sur un lien de notre site, l'opérateur nous verse parfois une commission. 
                        </p>
                        <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-white/10 italic text-sm">
                            "Cette commission n'augmente jamais le prix de votre forfait. Au contraire, nous négocions souvent des offres exclusives pour nos lecteurs."
                        </div>
                    </section>

                    {/* Section 3: Methodology */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <Scale className="w-10 h-10 text-purple-600 mb-6" />
                            <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Objectivité</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                Nous listons TOUS les forfaits disponibles sur le marché, même ceux pour lesquels nous ne touchons aucune commission.
                            </p>
                        </div>
                        <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <Eye className="w-10 h-10 text-orange-600 mb-6" />
                            <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Transparence</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                Si une offre est sponsorisée, elle est clairement identifiée par un label "Annonce". Elle n'influence pas les résultats de vos recherches personnalisées.
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Contact/Advocacy */}
                    <section className="text-center py-12 border-t border-zinc-200 dark:border-zinc-800">
                        <HeartHandshake className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">On se bat pour vous</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
                            Un problème avec un opérateur ? Un doute sur vos frais de résiliation ? Nos experts surveillent le marché quotidiennement pour dénoncer les abus.
                        </p>
                        <a 
                            href={`https://wa.me/${CONFIG.SUPPORT_WHATSAPP}`} 
                            className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-bold rounded-2xl hover:scale-105 transition-transform"
                        >
                            Besoin d'aide ? Contactez un expert sur WhatsApp
                        </a>
                    </section>
                </div>
            </main>
        </div>
    )
}
