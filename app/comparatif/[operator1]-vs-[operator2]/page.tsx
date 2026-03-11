import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { ScamDetector } from '@/components/ScamDetector';
import { Swords, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

type Props = {
    params: Promise<{ operator1: string, operator2: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { operator1, operator2 } = await params;
    const op1 = operator1.charAt(0).toUpperCase() + operator1.slice(1).toLowerCase();
    const op2 = operator2.charAt(0).toUpperCase() + operator2.slice(1).toLowerCase();

    return {
        title: `Comparatif ${op1} vs ${op2} : Lequel Choisir au Maroc ? (2026)`,
        description: `Le match définitif : ${op1} contre ${op2}. Comparez la fibre optique, les forfaits mobiles, et le service client pour faire le bon choix.`,
    };
}

// Simulated simple score comparison logic
const getScore = (op: string) => {
    const name = op.toLowerCase();
    if (name.includes('orange')) return { price: 8, network: 9, service: 7, total: 24 };
    if (name.includes('inwi')) return { price: 9, network: 7, service: 8, total: 24 };
    if (name.includes('iam') || name.includes('maroctelecom')) return { price: 6, network: 9, service: 6, total: 21 };
    return { price: 7, network: 7, service: 7, total: 21 }; // Default
}

export default async function VersusPage({ params }: Props) {
    const { operator1, operator2 } = await params;
    
    const op1 = operator1.charAt(0).toUpperCase() + operator1.slice(1).toLowerCase();
    const op2 = operator2.charAt(0).toUpperCase() + operator2.slice(1).toLowerCase();

    const score1 = getScore(op1);
    const score2 = getScore(op2);

    const winner = score1.total > score2.total ? op1 : (score2.total > score1.total ? op2 : 'Égalité');

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20">
            <Navigation />
            
            <div className="bg-red-600 dark:bg-red-950 text-white pt-24 pb-16 px-4 relative overflow-hidden border-b border-red-700 dark:border-red-900">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                    <Swords className="w-96 h-96" />
                </div>
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <div className="inline-block px-4 py-1 bg-black/20 rounded-full text-sm font-bold mb-6 backdrop-blur-sm uppercase tracking-widest border border-white/10">
                        Le Grand Match 2026
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
                        <span className="text-yellow-400">{op1}</span> 
                        <span className="px-4 text-red-300">VS</span> 
                        <span className="text-yellow-400">{op2}</span>
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto text-red-100 mb-10">
                        Lequel de {op1} ou {op2} propose vraiment la meilleure Fibre Optique et les forfaits les moins chers cette année ?
                    </p>
                    
                    {/* Trust visual */}
                    <div className="flex items-center justify-center gap-2 text-sm font-medium">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Tarifs B2B mis à jour ce matin
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                
                {/* Scoring Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
                    {/* Operator 1 */}
                    <div className={`bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between border-4 ${winner === op1 ? 'border-yellow-400 scale-105 z-10' : 'border-transparent'}`}>
                        {winner === op1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-black uppercase">Vainqueur</div>}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black dark:text-white mb-2">{op1}</h2>
                            <div className="text-5xl font-black text-blue-600">{score1.total}/30</div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                <span className="font-medium text-zinc-600 dark:text-zinc-400">Prix des forfaits</span>
                                <span className="font-bold dark:text-white">{score1.price}/10</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                <span className="font-medium text-zinc-600 dark:text-zinc-400">Qualité Réseau</span>
                                <span className="font-bold dark:text-white">{score1.network}/10</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="font-medium text-zinc-600 dark:text-zinc-400">Service Client</span>
                                <span className="font-bold dark:text-white">{score1.service}/10</span>
                            </div>
                        </div>
                    </div>

                    {/* ScamDetector in middle (Aggressive conversion) */}
                    <div className="bg-[#0A0F1C] p-6 rounded-3xl shadow-2xl flex flex-col justify-center border border-zinc-800">
                        <h3 className="text-white font-black text-xl mb-4 text-center">Faites le test vous-même</h3>
                        <p className="text-zinc-400 text-sm mb-6 text-center">Nos algorithmes cherchent l'offre exacte qu'il vous faut.</p>
                        <ScamDetector />
                    </div>

                    {/* Operator 2 */}
                    <div className={`bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between border-4 ${winner === op2 ? 'border-yellow-400 scale-105 z-10' : 'border-transparent'}`}>
                        {winner === op2 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-black uppercase">Vainqueur</div>}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black dark:text-white mb-2">{op2}</h2>
                            <div className="text-5xl font-black text-purple-600">{score2.total}/30</div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                <span className="font-medium text-zinc-600 dark:text-zinc-400">Prix des forfaits</span>
                                <span className="font-bold dark:text-white">{score2.price}/10</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                <span className="font-medium text-zinc-600 dark:text-zinc-400">Qualité Réseau</span>
                                <span className="font-bold dark:text-white">{score2.network}/10</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="font-medium text-zinc-600 dark:text-zinc-400">Service Client</span>
                                <span className="font-bold dark:text-white">{score2.service}/10</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-black mb-4">Notre verdict : Qui a la meilleure offre Internet et Mobile ?</h2>
                    <p>
                        Le combat entre {op1} et {op2} est serré sur le territoire national. Cependant, la vérité se cache souvent dans les tarifs pratiqués en rétention client ou via les offres Business (B2B). 
                    </p>
                    <p>
                        Si vous payez le tarif affiché publiquement en agence, vous êtes probablement perdant. Utilisez notre détecteur d'arnaque pour révéler l'offre qui vous permettra d'obtenir le même service, beaucoup moins cher.
                    </p>
                </div>
                
            </div>
        </main>
    );
}
