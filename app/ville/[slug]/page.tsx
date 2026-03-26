import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { ScamDetector } from '@/components/ScamDetector';
import { MapPin, Building2, Zap } from 'lucide-react';

// Common Moroccan cities for programmatic generation
const CITIES = [
    'casablanca', 'rabat', 'marrakech', 'tanger', 'agadir', 
    'fes', 'meknes', 'oujda', 'kenitra', 'tetouan', 'safi'
];

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const formattedCity = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
    const url = `https://monforfait.ma/ville/${slug}`;

    return {
        title: `Meilleur Forfait Mobile et Fibre Optique à ${formattedCity} (2026)`,
        description: `Comparez les offres Fibre et Mobile (Orange, Inwi, IAM) spécifiquement pour la ville de ${formattedCity}. Découvrez les prix cachés et économisez avec MonForfait.ma.`,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `Meilleur Forfait à ${formattedCity} | MonForfait.ma`,
            description: `Trouvez la meilleure offre internet et mobile à ${formattedCity}. Comparatif gratuit 2026.`,
            url: url,
            siteName: 'MonForfait.ma',
            locale: 'fr_MA',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Meilleur Forfait à ${formattedCity} | MonForfait.ma`,
            description: `Trouvez la meilleure offre internet et mobile à ${formattedCity}. Comparatif gratuit 2026.`,
        }
    };
}

export default async function VillePage({ params }: Props) {
    const { slug } = await params;
    
    if (!CITIES.includes(slug.toLowerCase())) {
        // Fallback or 404 if someone types a random city not in our fast list
        // Actually, we could allow any city, but let's just title-case it
    }

    const formattedCity = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20">
            <Navigation />
            
            <div className="bg-[#0A0F1C] text-white pt-24 pb-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 font-bold mb-6">
                                <MapPin className="w-5 h-5" />
                                Données locales: {formattedCity}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                                La Fibre Optique et les Forfaits Mobiles à <span className="text-blue-400">{formattedCity}</span>
                            </h1>
                            <p className="text-xl text-zinc-300 mb-8 max-w-xl">
                                Ne vous fiez pas aux publicités nationales. Découvrez les <strong>vraies performances</strong> et les <strong>prix réels</strong> proposés par Orange, IAM et Inwi dans votre quartier à {formattedCity}.
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
                                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-green-400"/> +1,240 abonnés à {formattedCity} aidés</div>
                                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400"/> Test de débit local certifié</div>
                            </div>
                        </div>

                        <div className="w-full max-w-md mx-auto lg:ml-auto">
                            {/* Re-use the aggressive CRO tool */}
                            <ScamDetector />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                        Pourquoi comparer spécifiquement à {formattedCity} ?
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
                        La couverture réseau varie énormément d'un quartier à l'autre. Un forfait Inwi peut être excellent au centre-ville mais catastrophique en périphérie. De même pour l'éligibilité à la Fibre Orange ou Maroc Telecom.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { op: 'Orange', text: 'Couverture 4G/5G moyenne et éligibilité Fibre Optique par quartier.' },
                        { op: 'Inwi', text: 'Stabilité du réseau ADSL/Fibre et retour des abonnés locaux.' },
                        { op: 'Maroc Telecom', text: 'Déploiement de la Fibre Optique et qualité des lignes historiques.' }
                    ].map(item => (
                        <div key={item.op} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-blue-600 text-xl">
                                {item.op.charAt(0)}
                            </div>
                            <h3 className="text-xl font-bold mb-3 dark:text-white">Réseau {item.op}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
