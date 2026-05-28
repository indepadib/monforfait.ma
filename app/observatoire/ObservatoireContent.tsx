"use client"

import { Navigation } from '@/components/Navigation';
import { ObservatoireChart } from '@/components/ObservatoireChart';
import { ArrowUpRight, TrendingDown, Users, ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/lib/LocaleContext';

export default function ObservatoireContent() {
    const { t, isRtl } = useTranslation();

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20 text-start" dir={isRtl ? 'rtl' : 'ltr'}>
            <Navigation />
            
            {/* Header */}
            <div className="bg-blue-600 dark:bg-zinc-900 border-b border-blue-700 dark:border-zinc-800 text-white pt-24 pb-16 px-4 text-center md:text-start">
                <div className="max-w-5xl mx-auto">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-blue-200 mb-6 uppercase tracking-wider backdrop-blur-sm border border-white/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <ShieldAlert className="w-4 h-4" /> {t('obs_surtitle')}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                        {t('obs_title')}
                    </h1>
                    <p className="text-lg text-blue-100 dark:text-zinc-400 max-w-2xl leading-relaxed mx-auto md:mx-0">
                        {t('obs_desc')}
                    </p>
                </div>
            </div>

            {/* Dashboard */}
            <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
                        <div className="text-zinc-500 text-sm font-bold mb-2">{t('obs_avg_fibre')}</div>
                        <div className={`text-3xl font-black text-zinc-900 dark:text-white flex items-end gap-2 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                            215 {isRtl ? 'درهم' : 'DH'} <span className={`text-sm text-green-500 font-bold flex items-center mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}><TrendingDown className="w-4 h-4" /> -14%</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
                        <div className="text-zinc-500 text-sm font-bold mb-2">{t('obs_analyzed')}</div>
                        <div className={`text-3xl font-black text-zinc-900 dark:text-white flex items-end gap-2 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                            54,291 <span className={`text-sm text-blue-500 font-bold flex items-center mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}><ArrowUpRight className="w-4 h-4" /> {t('obs_live')}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
                        <div className="text-zinc-500 text-sm font-bold mb-2">{t('obs_overcharge')}</div>
                        <div className={`text-3xl font-black text-red-600 flex items-end gap-2 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                            1.2 {isRtl ? 'مليار درهم' : 'Milliards DH'}
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800 mb-8">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6 leading-tight">{t('obs_chart_title')}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-3xl leading-relaxed">
                        {t('obs_chart_desc')}
                    </p>
                    
                    <div className="h-[400px] w-full text-black">
                        <ObservatoireChart />
                    </div>
                </div>

                {/* Integration / Press */}
                <div className={`bg-zinc-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <div className="text-center md:text-start">
                        <h3 className="text-2xl font-black mb-2 leading-tight">{t('obs_press_title')}</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            {t('obs_press_desc')}
                        </p>
                    </div>
                    <button className="bg-white text-zinc-900 font-bold px-6 py-3 rounded-xl whitespace-nowrap hover:bg-zinc-200 transition-colors">
                        {t('obs_press_btn')}
                    </button>
                </div>
            </div>
        </main>
    );
}
