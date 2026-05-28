"use client";

import { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Loader2, Zap } from 'lucide-react';
import { PromoUnlockerForm } from './PromoUnlockerForm';
import { event } from '@/lib/analytics';
import { useTranslation } from '@/lib/LocaleContext';

export function ScamDetector() {
    const { locale, t, isRtl } = useTranslation();
    const [step, setStep] = useState<'input' | 'scanning' | 'result'>('input');
    const [operator, setOperator] = useState('');
    const [price, setPrice] = useState('');
    const [progress, setProgress] = useState(0);
    const [showUnlocker, setShowUnlocker] = useState(false);

    useEffect(() => {
        if (step === 'scanning') {
            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        setStep('result');
                        event({ action: 'scam_scan_completed', category: 'engagement', label: operator, value: Number(price) });
                        return 100;
                    }
                    return p + Math.floor(Math.random() * 15) + 5;
                });
            }, 300);
            return () => clearInterval(interval);
        }
    }, [step, operator, price]);

    const handleScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!operator || !price) return;
        setStep('scanning');
        setProgress(0);
        event({ action: 'scam_scan_started', category: 'engagement', label: operator });
    };

    if (showUnlocker) {
        return (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-500">
                <PromoUnlockerForm />
            </div>
        );
    }

    return (
        <div className="bg-white/10 dark:bg-zinc-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-zinc-700 shadow-2xl relative overflow-hidden text-zinc-900 dark:text-white">
            
            <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} p-4 opacity-10 pointer-events-none`}>
                <ShieldAlert className="w-48 h-48" />
            </div>

            {step === 'input' && (
                <div className="relative z-10 animate-in fade-in duration-500">
                    <div className={`flex items-center justify-between mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 text-red-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Zap className="w-6 h-6 animate-pulse" />
                            <h3 className="font-black text-xl uppercase tracking-wider">{t('scam_title')}</h3>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-[10px] font-bold text-green-500 uppercase ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                            Live
                        </div>
                    </div>

                    
                    <form onSubmit={handleScan} className="space-y-4">
                        <div className={isRtl ? 'text-right' : 'text-left'}>
                            <label className="block text-sm font-bold mb-2 text-zinc-300">{t('scam_label_operator')}</label>
                            <select 
                                required
                                value={operator}
                                onChange={e => setOperator(e.target.value)}
                                className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none appearance-none ${isRtl ? 'text-right' : ''}`}
                            >
                                <option value="" disabled>{t('scam_select')}</option>
                                <option value="Orange">{locale === 'ar' ? 'أورنج (Orange)' : 'Orange'}</option>
                                <option value="Maroc Telecom">{locale === 'ar' ? 'اتصالات المغرب (IAM)' : 'Maroc Telecom (IAM)'}</option>
                                <option value="Inwi">{locale === 'ar' ? 'إنوي (Inwi)' : 'Inwi'}</option>
                            </select>
                        </div>
                        <div className={isRtl ? 'text-right' : 'text-left'}>
                            <label className="block text-sm font-bold mb-2 text-zinc-300">{t('scam_label_price')}</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                placeholder="ex: 349"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none placeholder:text-zinc-600 ${isRtl ? 'text-right' : ''}`}
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            className={`w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-wide ${isRtl ? 'flex-row-reverse' : ''}`}
                        >
                            {t('scam_btn_scan')}
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-zinc-400 mt-4">{t('scam_footer')}</p>
                </div>
            )}

            {step === 'scanning' && (
                <div className="relative z-10 py-10 text-center animate-in slide-in-from-right-4 duration-500">
                    <Loader2 className="w-16 h-16 animate-spin text-red-500 mx-auto mb-6" />
                    <h3 className="text-xl font-bold mb-2 text-white">{t('scam_scanning')}</h3>
                    <p className="text-zinc-400 text-sm mb-8 h-6">
                        {progress < 30 && t('scam_step_connect')}
                        {progress >= 30 && progress < 60 && t('scam_step_b2b')}
                        {progress >= 60 && progress < 90 && t('scam_step_margin')}
                        {progress >= 90 && t('scam_step_report')}
                    </p>
                    <div className="w-full bg-black/50 rounded-full h-3 mb-2 overflow-hidden border border-white/10">
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className={`${isRtl ? 'text-left' : 'text-right'} text-xs font-bold font-mono text-red-400`}>{progress}%</p>
                </div>
            )}

            {step === 'result' && (
                <div className="relative z-10 animate-in zoom-in-95 duration-700">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-center mb-6">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-2xl font-black text-white mb-2">{t('scam_alert_title')}</h3>
                        <p className="text-red-200">
                            {t('scam_alert_desc').replace('{price}', price).replace('{operator}', locale === 'ar' ? (operator === 'Orange' ? 'أورنج' : operator === 'Inwi' ? 'إنوي' : 'اتصالات المغرب') : operator)}
                        </p>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className={`flex items-center gap-3 text-sm text-zinc-300 bg-white/5 p-3 rounded-lg border border-white/5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <span>{t('scam_match_1')}</span>
                        </div>
                        <div className={`flex items-center gap-3 text-sm text-zinc-300 bg-white/5 p-3 rounded-lg border border-white/5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <span>{t('scam_match_2').replace('{savings}', Math.floor(Number(price) * 0.45 * 12).toString())}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowUnlocker(true)}
                        className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 uppercase animate-bounce ${isRtl ? 'flex-row-reverse' : ''}`}
                    >
                        {t('scam_btn_prove')}
                        <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                    <p className="text-center text-xs text-zinc-500 mt-4">Accès limité à la base de données privée.</p>
                </div>
            )}
        </div>
    );
}
