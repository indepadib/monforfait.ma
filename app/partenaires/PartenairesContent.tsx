"use client"

import { Navigation } from '@/components/Navigation'
import { Handshake, Mail, Code, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/lib/LocaleContext'

export default function PartenairesContent() {
    const { t, isRtl } = useTranslation()

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20 text-start" dir={isRtl ? 'rtl' : 'ltr'}>
            <Navigation />
            
            <div className="bg-blue-600 dark:bg-zinc-900 text-white pt-24 pb-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <Handshake className="w-16 h-16 mx-auto mb-6 text-blue-300" />
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                        {t('part_title')}
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        {t('part_desc')}
                    </p>
                </div>
            </div>


            <section className="max-w-4xl mx-auto px-4 pt-14 text-zinc-900 dark:text-white">
              <div className="bg-white dark:bg-zinc-950 border border-blue-200 dark:border-blue-900 rounded-3xl p-7 md:p-10">
                <p className="uppercase text-xs font-bold tracking-widest text-blue-600">Acquisition télécoms à la performance</p>
                <h2 className="text-2xl md:text-3xl font-black mt-3">Testez des demandes fibre avec une intention réelle</h2>
                <p className="text-zinc-600 dark:text-zinc-300 mt-4">MonForfait.ma recueille des demandes de comparaison, principalement sur la fibre résidentielle. Nous recherchons des partenaires de distribution et des opérateurs pour un pilote mesuré : qualification, accord de mise en relation, suivi des contacts et validation des abonnements activés. Aucun volume minimum ni taux de transformation n'est garanti.</p>
                <div className="grid md:grid-cols-3 gap-3 mt-6 text-sm">
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4"><strong>1. Ciblage</strong><p className="text-zinc-500 mt-1">Ville, technologie, délai de raccordement</p></div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4"><strong>2. Pilote</strong><p className="text-zinc-500 mt-1">Leads vérifiés et consentis sous accord</p></div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4"><strong>3. Facturation</strong><p className="text-zinc-500 mt-1">Modèle CPL ou activation selon contrat</p></div>
                </div>
                <a href="mailto:contact@monforfait.ma?subject=Pilote%20acquisition%20Fibre%20MonForfait" className="inline-flex rounded-xl bg-blue-600 text-white font-bold px-6 py-4 mt-6">Demander une proposition de pilote</a>
              </div>
            </section>
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Option 1 */}
                    <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Code className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold dark:text-white mb-4">{t('part_sec1_title')}</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                {t('part_sec1_desc')}
                            </p>
                        </div>
                        <a href="mailto:contact@monforfait.ma" className={`px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 self-start ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Mail className="w-5 h-5" />
                            {t('part_sec1_btn')}
                        </a>
                    </div>

                    {/* Option 2 */}
                    <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <Handshake className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold dark:text-white mb-4">{t('part_sec2_title')}</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                {t('part_sec2_desc')}
                            </p>
                        </div>
                        <a href="mailto:contact@monforfait.ma" className={`bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors self-start ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Mail className="w-4 h-4"/> 
                            {t('part_sec2_btn')}
                        </a>
                    </div>
                </div>

                {/* API & Data */}
                <div className="bg-zinc-100 dark:bg-zinc-900/50 p-8 rounded-2xl text-center border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-2xl font-black dark:text-white mb-4">{t('part_sec3_title')}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-6 leading-relaxed">
                        {t('part_sec3_desc')}
                    </p>
                </div>
            </div>
        </main>
    )
}
