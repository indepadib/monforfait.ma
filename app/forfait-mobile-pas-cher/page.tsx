import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { QuickCaptureForm } from '@/components/QuickCaptureForm'
import { Sparkles, Smartphone, CheckCircle2, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { TrustBadges } from '@/components/TrustBadges'

export const metadata: Metadata = {
    title: 'Forfait Mobile Pas Cher Maroc - Comparateur 2026 | MonForfait.ma',
    description: 'Comparez les forfaits mobiles les moins chers au Maroc (Inwi, Orange, Maroc Telecom). Forfaits sans engagement à partir de 49 DH/mois.',
    keywords: ['forfait mobile pas cher', 'forfait maroc pas cher', 'forfait inwi pas cher', 'forfait orange 49 dh', 'forfait iam 50 dh', 'comparateur forfait mobile maroc', 'forfait etudiant maroc'],
    openGraph: {
        title: 'Forfait Mobile Pas Cher : Le comparatif 2026 au Maroc',
        description: 'Économisez sur votre facture mobile. Trouvez les forfaits les moins chers (Orange, Inwi, IAM).',
    }
}

export default function ForfaitPasCherPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black font-sans">
            <Navigation />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-800 to-black text-white pt-32 pb-20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
                
                <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <TrendingDown className="w-4 h-4" /> Spécial Budget
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            Trouver un Forfait Mobile <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">Pas Cher</span>
                        </h1>
                        <p className="text-xl text-zinc-300 mb-8 max-w-2xl leading-relaxed">
                            Ne payez plus pour des gigas que vous n'utilisez pas. Découvrez notre sélection des forfaits mobiles les plus économiques au Maroc, à partir de <strong>49 DH/mois</strong>.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                Sans Engagement
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                Gardez votre numéro
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <QuickCaptureForm />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <article className="prose prose-zinc dark:prose-invert prose-lg max-w-none">
                    <h2>Comment choisir un forfait mobile pas cher au Maroc ?</h2>
                    <p>
                        Au Maroc, les trois opérateurs (Maroc Telecom, Inwi, Orange) se livrent une guerre des prix féroce, particulièrement sur <strong>les forfaits d'entrée de gamme entre 49 DH et 99 DH</strong>. 
                        Pour choisir le bon forfait, il faut d'abord analyser votre consommation.
                    </p>
                    
                    <h3>Les éléments à vérifier :</h3>
                    <ul>
                        <li><strong>Le ratio Internet / Appels</strong> : Si vous utilisez beaucoup WhatsApp, privilégiez un forfait riche en Data (ex: 11 à 15 Go pour 49 DH).</li>
                        <li><strong>L'engagement</strong> : Aujourd'hui, presque tous les forfaits pas chers sont "Sans Engagement" ou "Forfaits Bloqués" (Forfait maitrisé).</li>
                        <li><strong>Les frais cachés</strong> : Vérifiez les frais de mise en service (souvent équivalents à 1 mois d'abonnement offert).</li>
                    </ul>

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl my-10 border border-emerald-100 dark:border-emerald-900/30">
                        <h3 className="flex items-center gap-3 mt-0 text-emerald-900 dark:text-emerald-100">
                            <Smartphone className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            Trouvez le forfait idéal
                        </h3>
                        <p className="text-emerald-800 dark:text-emerald-200">
                            Notre algorithme analyse quotidiennement les offres Inwi, Orange et IAM. Faites le quiz en 60 secondes pour voir quel forfait correspond exactement à votre budget.
                        </p>
                        <Link href="/quiz" className="inline-flex mt-4 items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors">
                            Comparer tous les forfaits
                        </Link>
                    </div>
                </article>
            </div>

            <TrustBadges />
            <Footer />
        </main>
    )
}
