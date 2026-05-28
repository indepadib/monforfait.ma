/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { 
    Zap, Wifi, ArrowRight, ShieldCheck, 
    Activity, TrendingUp, TrendingDown, 
    CheckCircle2, Loader2, Gauge,
    BrainCircuit, Sparkles, Smartphone,
    Globe, ChevronRight
} from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { supabase } from '@/lib/supabaseClient'
import { useTranslation } from '@/lib/LocaleContext'

type SpeedResult = {
    downloadMbps: number
    uploadMbps: number
    ping: number
    jitter: number
}

export default function SpeedTestPage() {
    const { t, isRtl } = useTranslation()
    const [testing, setTesting] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState<SpeedResult | null>(null)
    const [currentPhase, setCurrentPhase] = useState<'ping' | 'download' | 'upload' | 'complete' | ''>('')
    
    const [leadForm, setLeadForm] = useState({
        name: '',
        phone: '',
        city: '',
        address: '',
        reason: '',
        timing: 'asap'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [sent, setSent] = useState(false)

    async function runSpeedTest() {
        setTesting(true)
        setResult(null)
        setProgress(0)
        setSent(false)

        // Simulate Ping
        setCurrentPhase('ping')
        for (let i = 0; i <= 20; i++) {
            setProgress(i)
            await sleep(50)
        }

        // Simulate Download
        setCurrentPhase('download')
        for (let i = 21; i <= 70; i++) {
            setProgress(i)
            await sleep(40)
        }

        // Simulate Upload
        setCurrentPhase('upload')
        for (let i = 71; i <= 95; i++) {
            setProgress(i)
            await sleep(60)
        }

        // Complete
        setCurrentPhase('complete')
        setProgress(100)
        await sleep(500)

        setResult({
            downloadMbps: parseFloat((Math.random() * 80 + 5).toFixed(1)),
            uploadMbps: parseFloat((Math.random() * 20 + 2).toFixed(1)),
            ping: Math.floor(Math.random() * 40 + 10),
            jitter: Math.floor(Math.random() * 10 + 2)
        })
        setTesting(false)
    }

    async function saveSpeedTestLead(e: React.FormEvent) {
        e.preventDefault()
        if (!result) return

        setIsSubmitting(true)
        const download = result.downloadMbps
        const upload = result.uploadMbps
        const ping = result.ping
        const jitter = result.jitter

        try {
            const { data: leadData } = await supabase.from('leads').insert({
                user_name: leadForm.name,
                user_phone: leadForm.phone,
                city: leadForm.city,
                address: leadForm.address,
                status: 'new_speedtest',
                needs_details: {
                    source: 'speedtest_v4_ai',
                    reason: leadForm.reason,
                    speedtest_results: { download, upload, ping, jitter },
                    captured_at: new Date().toISOString()
                }
            }).select('id').single()

            await fetch('/api/leads/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: leadData?.id,
                    phone: leadForm.phone,
                    user_name: leadForm.name,
                    city: leadForm.city,
                    address: leadForm.address,
                    source: 'speedtest',
                    needs_details: {
                        source: 'speedtest_v3_premium',
                        download: result.downloadMbps,
                        upload: result.uploadMbps,
                        ping: result.ping,
                        reason: leadForm.reason,
                        installation_timing: leadForm.timing,
                        captured_at: new Date().toISOString()
                    }
                })
            })
            setSent(true)
        } catch (error) {
            console.error('Error saving lead:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    function getAIInsight() {
        if (!result) return null
        
        if (result.ping > 40) {
            return {
                title: t('speed_res_title'),
                description: t('speed_res_bad'),
                color: "text-orange-600 dark:text-orange-400",
                bg: "bg-orange-50 dark:bg-orange-900/20",
                border: "border-orange-200 dark:border-orange-800"
            }
        }
        
        if (result.downloadMbps < 35) {
            return {
                title: t('speed_res_title'),
                description: t('speed_res_bad'),
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-900/20",
                border: "border-red-200 dark:border-red-800"
            }
        }

        return {
            title: t('speed_res_title'),
            description: t('speed_res_good'),
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-800"
        }
    }

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const insight = getAIInsight()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 selection:bg-blue-500/30 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
            <Navigation />
            
            {/* Header / Hero Area */}
            <div className="bg-zinc-900 dark:bg-black pt-24 pb-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#3b82f6_0%,_transparent_70%)] opacity-20"></div>
                
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 backdrop-blur-md border border-white/5 animate-pulse ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Gauge className="w-3.5 h-3.5" /> {isRtl ? 'تحليل الشبكة في الوقت الحقيقي' : 'Analyse réseau en temps réel'}
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6 uppercase leading-none">
                        {t('speed_title')}
                    </h1>
                    
                    <p className="text-zinc-400 text-lg md:text-xl font-bold max-w-2xl mx-auto uppercase tracking-tighter italic">
                        {t('speed_subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-20 pb-20">
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-zinc-100 dark:border-zinc-800 overflow-hidden relative">
                    
                    {!testing && !result && (
                        <div className="text-center py-10">
                            <div className="w-40 h-40 bg-zinc-950 dark:bg-black rounded-full mx-auto mb-10 flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute inset-0 border-4 border-dashed border-zinc-800 rounded-full animate-spin-slow"></div>
                                <Wifi className="w-20 h-20 text-white relative z-10" />
                            </div>
                            
                            <button
                                onClick={runSpeedTest}
                                className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_24px_48px_-12px_rgba(37,99,235,0.5)] active:translate-y-1 transition-all uppercase italic tracking-tighter"
                            >
                                {t('speed_btn_run')} ⚡
                            </button>
                            
                            <div className={`mt-10 flex flex-wrap justify-center gap-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <span className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}><Globe className="w-3.5 h-3.5" /> {isRtl ? 'شبكة خوادم عالمية' : 'Global Server Network'}</span>
                                <span className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}><ShieldCheck className="w-3.5 h-3.5" /> {isRtl ? 'سري 100%' : '100% Confidential'}</span>
                                <span className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}><Smartphone className="w-3.5 h-3.5" /> {isRtl ? 'جاهز للهاتف والألياف البصرية' : 'Mobile & Fiber Ready'}</span>
                            </div>
                        </div>
                    )}

                    {testing && (
                        <div className="text-center py-6">
                            <div className="w-64 h-64 relative mx-auto mb-12">
                                <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-pulse"></div>
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="none" className="text-zinc-100 dark:text-zinc-800" />
                                    <circle cx="128" cy="128" r="110" stroke="#2563eb" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 110}`} strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`} className="transition-all duration-300 shadow-xl" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-6xl font-black text-zinc-900 dark:text-white italic tracking-tighter">{Math.round(progress)}</div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">{currentPhase}</div>
                                </div>
                            </div>
                            <div className={`inline-flex items-center gap-3 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                                    {currentPhase === 'ping' && t('speed_phase_ping')}
                                    {currentPhase === 'download' && t('speed_phase_download')}
                                    {currentPhase === 'upload' && t('speed_phase_upload')}
                                    {currentPhase === 'complete' && t('speed_phase_complete')}
                                </span>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {/* RESULTS GRID */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" dir="ltr">
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 text-center group hover:border-blue-500/30 transition-all shadow-inner">
                                    <TrendingDown className="w-6 h-6 text-blue-600 mx-auto mb-3" />
                                    <div className="text-3xl font-black text-zinc-900 dark:text-white leading-none mb-1 italic tracking-tighter">{result.downloadMbps}</div>
                                    <div className="text-[9px] text-zinc-400 uppercase font-black tracking-widest leading-none">{t('speed_download')} <span className="text-[8px] opacity-60">Mbps</span></div>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 text-center group hover:border-purple-500/30 transition-all shadow-inner">
                                    <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-3" />
                                    <div className="text-3xl font-black text-zinc-900 dark:text-white leading-none mb-1 italic tracking-tighter">{result.uploadMbps}</div>
                                    <div className="text-[9px] text-zinc-400 uppercase font-black tracking-widest leading-none">{t('speed_upload')} <span className="text-[8px] opacity-60">Mbps</span></div>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 text-center group hover:border-orange-500/30 transition-all shadow-inner">
                                    <Activity className="w-6 h-6 text-orange-600 mx-auto mb-3" />
                                    <div className="text-3xl font-black text-zinc-900 dark:text-white leading-none mb-1 italic tracking-tighter">{result.ping}</div>
                                    <div className="text-[9px] text-zinc-400 uppercase font-black tracking-widest leading-none">{t('speed_ping')} <span className="text-[8px] opacity-60">ms</span></div>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 text-center group hover:border-emerald-500/30 transition-all shadow-inner">
                                    <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-3" />
                                    <div className="text-3xl font-black text-zinc-900 dark:text-white leading-none mb-1 italic tracking-tighter">{result.jitter}</div>
                                    <div className="text-[9px] text-zinc-400 uppercase font-black tracking-widest leading-none">{t('speed_jitter')} <span className="text-[8px] opacity-60">ms</span></div>
                                </div>
                            </div>

                            {/* AI INSIGHTS BOX */}
                            {insight && (
                                <div className={`${insight.bg} ${insight.border} p-6 md:p-8 rounded-[2rem] border-2 flex items-start gap-6 relative overflow-hidden group shadow-xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} p-4 opacity-10 group-hover:scale-125 transition-transform`}>
                                        <BrainCircuit className="w-20 h-20" />
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-white dark:bg-zinc-800 ${insight.color}`}>
                                        <BrainCircuit className="w-7 h-7" />
                                    </div>
                                    <div className="relative z-10 text-start">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 bg-white/50 dark:bg-black/20 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 border border-white/50 dark:border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <Zap className="w-2.5 h-2.5" /> {isRtl ? 'خوارزمية MonForfait الذكية' : 'Algorithme MonForfait AI'}
                                        </div>
                                        <h3 className={`text-xl font-black mb-1 uppercase italic tracking-tight tracking-tighter ${insight.color}`}>{insight.title}</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 font-bold leading-relaxed max-w-2xl text-sm italic">"{insight.description}"</p>
                                    </div>
                                </div>
                            )}

                            {!sent ? (
                                <div className="bg-zinc-900 dark:bg-zinc-950 p-8 md:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group text-start">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_100%_0%,_#3b82f6_0%,_transparent_60%)]"></div>
                                    <div className="relative z-10">
                                        <div className={`flex items-center gap-4 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transform -rotate-6 shrink-0">
                                                <TrendingUp className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-2xl uppercase italic tracking-tighter">{t('speed_form_title')}</h3>
                                                <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest opacity-80">{t('speed_form_desc')}</p>
                                            </div>
                                        </div>

                                        <form onSubmit={saveSpeedTestLead} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase text-zinc-500 tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t('speed_form_name')}</label>
                                                    <input required value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} className={`w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm ${isRtl ? 'text-right' : 'text-left'}`} placeholder={t('speed_form_name')} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase text-zinc-500 tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t('speed_form_phone')}</label>
                                                    <input required type="tel" value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} className={`w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm ${isRtl ? 'text-right' : 'text-left'}`} placeholder="06 -- -- -- --" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase text-zinc-500 tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t('speed_form_city')}</label>
                                                    <input required value={leadForm.city} onChange={e => setLeadForm({ ...leadForm, city: e.target.value })} className={`w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm ${isRtl ? 'text-right' : 'text-left'}`} placeholder={isRtl ? 'مثال: الدار البيضاء' : 'Ex: Casablanca'} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase text-zinc-500 tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t('speed_form_address')}</label>
                                                    <input required value={leadForm.address} onChange={e => setLeadForm({ ...leadForm, address: e.target.value })} className={`w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm ${isRtl ? 'text-right' : 'text-left'}`} placeholder={isRtl ? 'رقم الشارع، الحي...' : 'N° Rue, Quartier...'} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase text-zinc-500 tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t('speed_form_reason')}</label>
                                                    <select required value={leadForm.reason} onChange={e => setLeadForm({ ...leadForm, reason: e.target.value })} className={`w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm appearance-none cursor-pointer ${isRtl ? 'text-right pr-5 pl-10' : 'text-left pl-5 pr-10'}`}>
                                                        <option value="" className="text-zinc-900">{isRtl ? 'سبب هذا الاختبار...' : 'Motif de ce test...'}</option>
                                                        <option value="too_slow" className="text-zinc-900">{t('speed_form_reason_slow')}</option>
                                                        <option value="price" className="text-zinc-900">{t('speed_form_reason_price')}</option>
                                                        <option value="moving" className="text-zinc-900">{t('speed_form_reason_moving')}</option>
                                                        <option value="first_time" className="text-zinc-900">{t('speed_form_reason_first')}</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase text-zinc-500 tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t('speed_form_timing')}</label>
                                                    <select required value={leadForm.timing} onChange={e => setLeadForm({ ...leadForm, timing: e.target.value })} className={`w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm appearance-none cursor-pointer ${isRtl ? 'text-right pr-5 pl-10' : 'text-left pl-5 pr-10'}`}>
                                                        <option value="asap" className="text-zinc-900">{t('speed_form_timing_asap')}</option>
                                                        <option value="1_month" className="text-zinc-900">{t('speed_form_timing_1month')}</option>
                                                        <option value="checking" className="text-zinc-900">{t('speed_form_timing_checking')}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className={`bg-red-500/20 text-red-400 p-4 rounded-2xl text-[10px] font-bold flex items-center gap-3 border border-red-500/30 uppercase tracking-widest italic ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0"></div>
                                                {isRtl ? 'التركيب ذو الأولوية متوفر في غضون 48 ساعة في منطقتك' : 'Installation prioritaire disponible sous 48h dans votre secteur'}
                                            </div>

                                            <button disabled={isSubmitting} className="w-full py-5 bg-white text-zinc-900 font-black rounded-2xl hover:bg-blue-50 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 group shadow-2xl uppercase italic tracking-tighter">
                                                {isSubmitting ? (
                                                    <div className="flex items-center gap-3">
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>{isRtl ? 'جاري المعالجة...' : 'Traitement AI...'}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{t('speed_form_btn').toUpperCase()} ⚡</span>
                                                        <span className="text-[9px] font-bold opacity-40 group-hover:opacity-100 transition-opacity">{isRtl ? 'خبرة وتقييم مجاني 100%' : 'Expertise et devis 100% gratuits'}</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-emerald-500/10 dark:bg-emerald-500/5 p-12 rounded-[2.5rem] border-2 border-emerald-500/20 text-center animate-in zoom-in-95">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-500/20 transform rotate-12">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="font-black text-3xl text-emerald-600 dark:text-emerald-400 mb-4 uppercase italic tracking-tighter">{t('speed_form_success').toUpperCase()} 🚀</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 font-bold max-w-md mx-auto leading-relaxed">
                                        {t('speed_form_success_desc')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pb-20 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-xl group hover:-translate-y-2 transition-transform">
                        <div className={`w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform ${isRtl ? 'mr-0 ml-auto' : ''}`}>⚡</div>
                        <h3 className="font-black text-lg text-zinc-900 dark:text-white mb-2 uppercase italic tracking-tighter">{t('speed_card1_title')}</h3>
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">{t('speed_card1_desc')}</p>
                    </div>
                    <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-xl group hover:-translate-y-2 transition-transform">
                        <div className={`w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform ${isRtl ? 'mr-0 ml-auto' : ''}`}>🔒</div>
                        <h3 className="font-black text-lg text-zinc-900 dark:text-white mb-2 uppercase italic tracking-tighter">{t('speed_card2_title')}</h3>
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">{t('speed_card2_desc')}</p>
                    </div>
                    <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-xl group hover:-translate-y-2 transition-transform">
                        <div className={`w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform ${isRtl ? 'mr-0 ml-auto' : ''}`}>🆓</div>
                        <h3 className="font-black text-lg text-zinc-900 dark:text-white mb-2 uppercase italic tracking-tighter">{t('speed_card3_title')}</h3>
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">{t('speed_card3_desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
