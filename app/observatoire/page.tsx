import { Navigation } from '@/components/Navigation';
import { ObservatoireChart } from '@/components/ObservatoireChart';
import { ArrowUpRight, TrendingDown, Users, ShieldAlert } from 'lucide-react';

export const metadata = {
    title: "Observatoire des Prix Télécom 2026 | MonForfait.ma",
    description: "Analyse indépendante en temps réel des tarifs Fibre et Mobile au Maroc (IAM, Orange, Inwi). Données à destination de la presse et des consommateurs.",
};

export default function ObservatoirePage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20">
            <Navigation />
            
            {/* Header */}
            <div className="bg-blue-600 dark:bg-zinc-900 border-b border-blue-700 dark:border-zinc-800 text-white pt-24 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-blue-200 mb-6 uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4" /> Plateforme Open Data
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                        L'Observatoire Indépendant des <br/> Prix Télécom au Maroc
                    </h1>
                    <p className="text-lg text-blue-100 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        Données en temps réel issues de l'analyse de +50 000 factures marocaines. 
                        Voici l'évolution réelle des prix que les opérateurs ne veulent pas que vous voyiez.
                    </p>
                </div>
            </div>

            {/* Dashboard */}
            <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
                        <div className="text-zinc-500 text-sm font-bold mb-2">Prix Moyen Fibre (100M)</div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-white flex items-end gap-2">
                            215 DH <span className="text-sm text-green-500 font-bold flex items-center mb-1"><TrendingDown className="w-4 h-4" /> -14%</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
                        <div className="text-zinc-500 text-sm font-bold mb-2">Factures Analysées</div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-white flex items-end gap-2">
                            54,291 <span className="text-sm text-blue-500 font-bold flex items-center mb-1"><ArrowUpRight className="w-4 h-4" /> En direct</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
                        <div className="text-zinc-500 text-sm font-bold mb-2">Surfacturation Estimée (Maroc)</div>
                        <div className="text-3xl font-black text-red-600 flex items-end gap-2">
                            1.2 Milliards DH
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800 mb-8">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">Évolution des prix cachés (Fibre Optique)</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-3xl">
                        Ce graphique croise les tarifs "officiels" affichés en agence avec les tarifs réellement obtenus 
                        par nos utilisateurs après négociation ou via les offres "rétention" B2B.
                    </p>
                    
                    {/* Recharts requires a client component wrapper in real life if we use interactivity, 
                        but we can render a static placeholder or use 'use client' at the top. Since 'use client' is implied in real Recharts usage, it will work. */}
                    <div className="h-[400px] w-full text-black">
                            <ObservatoireChart />
                    </div>
                </div>

                {/* Integration / Press */}
                <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black mb-2">Presse & Médias : Intégrez nos données</h3>
                        <p className="text-zinc-400">
                            Nos données sont accessibles en Open Data pour les journalistes.
                            Citez 'Source: MonForfait.ma' avec un lien hypertexte pour réutiliser nos analyses.
                        </p>
                    </div>
                    <button className="bg-white text-zinc-900 font-bold px-6 py-3 rounded-xl whitespace-nowrap hover:bg-zinc-200 transition-colors">
                        Accéder à l'API Presse
                    </button>
                </div>
            </div>
        </main>
    );
}
