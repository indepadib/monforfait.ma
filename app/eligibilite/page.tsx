import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { EligibilityChecker } from '@/components/EligibilityChecker';
import { ShieldCheck, Crosshair, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: "Test d'Éligibilité Fibre Optique & ADSL Maroc | MonForfait.ma",
    description: "Vérifiez instantanément la couverture réseau de votre adresse (IAM, Orange, Inwi) et accédez aux offres secrètes réservées à votre quartier.",
};

export default function EligibilityPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20 selection:bg-blue-500/30">
            <Navigation />

            {/* Hero Section */}
            <div className="bg-blue-600 dark:bg-zinc-900 text-white pt-24 pb-32 px-4 relative overflow-hidden border-b border-blue-700 dark:border-zinc-800">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,1)_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-blue-200 mb-6 uppercase tracking-wider backdrop-blur-sm border border-white/10">
                        <Crosshair className="w-4 h-4" /> Analyse en temps réel
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                        La Fibre passe-t-elle chez vous ?
                    </h1>
                    
                    <p className="text-lg md:text-xl text-blue-100 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
                        Entrez votre adresse pour scanner les raccordements IAM, Orange et Inwi présents dans votre rue. Débloquez ensuite les tarifs confidentiels.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-blue-100">
                        <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-400" /> Données 100% sécurisées</span>
                        <span className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-300" /> +4000 tests effectués aujourd'hui</span>
                    </div>
                </div>
            </div>

            {/* Negative Margin Scanner Form */}
            <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-20">
                <EligibilityChecker />
            </div>

            {/* SEO Trust Elements */}
            <div className="max-w-4xl mx-auto px-4 py-24 text-center">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">Pourquoi tester votre éligibilité ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-left">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            1
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Évitez les fausses promesses</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Ne signez pas un contrat sans vérifier techniquement si les câbles traversent votre quartier.</p>
                    </div>
                    <div className="text-left">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                            2
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Découvrez les prix cachés</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Une fois votre zone identifiée, nous forçons l'apparition des prix de "Rétention" (très inférieurs aux prix agence).</p>
                    </div>
                    <div className="text-left">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-4">
                            3
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Techniciens Rapides</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">En connaissant l'infrastructure à l'avance, nous orientons votre dossier vers l'opérateur le plus rapide à installer.</p>
                    </div>
                </div>
            </div>
            
        </main>
    );
}
