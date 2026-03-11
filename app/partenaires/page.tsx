import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Handshake, Mail, Code, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
    title: "Partenaires et Échange de Liens | MonForfait.ma",
    description: "Devenez partenaire de MonForfait.ma. Découvrez notre programme d'échange de visibilité (backlinks) pour les blogs tech, médias et influenceurs marocains.",
};

export default function PartenairesPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20">
            <Navigation />
            
            <div className="bg-blue-600 dark:bg-zinc-900 text-white pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Handshake className="w-16 h-16 mx-auto mb-6 text-blue-300" />
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                        Programme Partenaires & Médias
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        MonForfait.ma collabore avec les créateurs de contenu, les médias spécialisés et les blogs marocains pour rendre le marché des télécoms plus transparent.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Option 1 */}
                    <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Code className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white mb-4">Intégration du Widget (Dofollow)</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            Vous gérez un blog tech ou un site d'actualité marocaine ? Intégrez notre widget "Test d'éligibilité" sur vos pages. En échange, le widget contient un lien Dofollow naturel vers notre site, ce qui renforce nos SEO respectifs.
                        </p>
                        <a href="/widget" className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:underline">
                            Voir le widget <ExternalLink className="w-4 h-4"/>
                        </a>
                    </div>

                    {/* Option 2 */}
                    <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <Handshake className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white mb-4">Échange d'Articles & Backlinks</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            Nous sommes ouverts aux articles invités (Guest Blogging) et aux échanges d'articles de qualité (DR > 20). Nous publions sur le thème des télécoms, de l'internet et des technologies au Maroc.
                        </p>
                        <a href="mailto:contact@monforfait.ma" className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-zinc-800 transition-colors">
                            <Mail className="w-4 h-4"/> Proposer un échange
                        </a>
                    </div>
                </div>

                {/* API & Data */}
                <div className="bg-zinc-100 dark:bg-zinc-900/50 p-8 rounded-2xl text-center border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-2xl font-black dark:text-white mb-4">Données de l'Observatoire</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-6">
                        Journalistes et analystes : vous pouvez utiliser librement les données de notre <a href="/observatoire" className="text-blue-600 font-bold hover:underline">Observatoire des Prix</a> dans vos publications, à condition de citer MonForfait.ma avec un lien hypertexte direct.
                    </p>
                </div>
            </div>
        </main>
    );
}
