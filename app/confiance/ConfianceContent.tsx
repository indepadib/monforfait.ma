"use client"

import { Navigation } from '@/components/Navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ShieldCheck, Scale, Leaf, HeartHandshake, Eye } from 'lucide-react'
import { CONFIG } from '@/lib/config'
import { useTranslation } from '@/lib/LocaleContext'

export default function ConfianceContent() {
    const { t, isRtl } = useTranslation()

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 pt-8">
                <Breadcrumbs items={[{ label: t('nav_offers'), href: '/offres' }, { label: t('conf_title'), href: '/confiance' }]} />
            </div>

            <main className="max-w-4xl mx-auto px-4 py-16">
                <header className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-zinc-900 dark:text-white leading-tight">
                        {t('conf_title')}
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">
                        {t('conf_desc')}
                    </p>
                </header>

                <div className="space-y-16">
                    {/* Section 1: Independence */}
                    <section className="bg-zinc-50 dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-start">
                        <div className={`flex items-center gap-4 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl shrink-0">
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('conf_sec1_title')}</h2>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            {t('conf_sec1_p1')}
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {t('conf_sec1_p2')}
                        </p>
                    </section>

                    {/* Section 2: Revenue Model */}
                    <section className="text-start">
                        <div className={`flex items-center gap-4 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl shrink-0">
                                <Leaf className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('conf_sec2_title')}</h2>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            {t('conf_sec2_p1')}
                        </p>
                        <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-white/10 italic text-sm text-center">
                            "{t('conf_sec2_quote')}"
                        </div>
                    </section>

                    {/* Section 3: Methodology */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
                        <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <Scale className="w-10 h-10 text-purple-600 mb-6" />
                            <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">{t('conf_sec3_title_obj')}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                {t('conf_sec3_desc_obj')}
                            </p>
                        </div>
                        <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <Eye className="w-10 h-10 text-orange-600 mb-6" />
                            <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">{t('conf_sec3_title_trans')}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                {t('conf_sec3_desc_trans')}
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Contact/Advocacy */}
                    <section className="text-center py-12 border-t border-zinc-200 dark:border-zinc-800">
                        <HeartHandshake className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">{t('conf_sec4_title')}</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
                            {t('conf_sec4_desc')}
                        </p>
                        <a 
                            href={`https://wa.me/${CONFIG.SUPPORT_WHATSAPP}`} 
                            className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-bold rounded-2xl hover:scale-105 transition-transform"
                        >
                            {t('conf_sec4_btn')}
                        </a>
                    </section>
                </div>
            </main>
        </div>
    )
}
