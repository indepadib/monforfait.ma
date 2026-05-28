"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Wifi, Smartphone, Users, Zap, DollarSign, TrendingUp, MapPin, User, Mail, Phone, Home, Lock, Sparkles } from 'lucide-react'
import VoiceConsentCheckbox from '@/components/VoiceConsentCheckbox'
import { supabase } from '@/lib/supabaseClient'
import { Navigation } from '@/components/Navigation'
import { event as trackEvent } from '@/lib/analytics'
import { useTranslation } from '@/lib/LocaleContext'

type QuizAnswers = {
    category?: 'internet' | 'mobile' | 'both'
    userType?: 'solo' | 'family' | 'small_office' | 'enterprise'
    priority?: 'cheapest' | 'fastest' | 'best_value'
    city?: string
}

type LeadData = {
    name: string
    phone: string
    email: string
    address: string
}

function QuizContent() {
    const { t, isRtl } = useTranslation()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<QuizAnswers>({})
    const [city, setCity] = useState('')
    const [leadData, setLeadData] = useState<LeadData>({ name: '', phone: '', email: '', address: '' })
    const [loading, setLoading] = useState(false)
    const [consentVoice, setConsentVoice] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)

    const QUESTIONS = [
        {
            id: 'category',
            question: t('quiz_q1_question'),
            options: [
                { value: 'internet', label: t('quiz_q1_o1_label'), icon: Wifi, desc: t('quiz_q1_o1_desc') },
                { value: 'mobile', label: t('quiz_q1_o2_label'), icon: Smartphone, desc: t('quiz_q1_o2_desc') },
                { value: 'both', label: t('quiz_q1_o3_label'), icon: TrendingUp, desc: t('quiz_q1_o3_desc') }
            ]
        },
        {
            id: 'userType',
            question: t('quiz_q2_question'),
            options: [
                { value: 'solo', label: t('quiz_q2_o1_label'), icon: Users, desc: t('quiz_q2_o1_desc') },
                { value: 'family', label: t('quiz_q2_o2_label'), icon: Users, desc: t('quiz_q2_o2_desc') },
                { value: 'small_office', label: t('quiz_q2_o3_label'), icon: Users, desc: t('quiz_q2_o3_desc') },
                { value: 'enterprise', label: t('quiz_q2_o4_label'), icon: Users, desc: t('quiz_q2_o4_desc') }
            ]
        },
        {
            id: 'priority',
            question: t('quiz_q3_question'),
            options: [
                { value: 'cheapest', label: t('quiz_q3_o1_label'), icon: DollarSign, desc: t('quiz_q3_o1_desc') },
                { value: 'fastest', label: t('quiz_q3_o2_label'), icon: Zap, desc: t('quiz_q3_o2_desc') },
                { value: 'best_value', label: t('quiz_q3_o3_label'), icon: TrendingUp, desc: t('quiz_q3_o3_desc') }
            ]
        }
    ]

    useEffect(() => {
        if (searchParams.get('type') === 'pro') {
            setAnswers(prev => ({ ...prev, userType: 'enterprise' }))
        }
    }, [searchParams])

    const currentQuestion = QUESTIONS[step]
    const totalSteps = QUESTIONS.length + 2 // +2 for city and lead capture
    const progress = ((step + 1) / totalSteps) * 100

    function handleAnswer(value: string) {
        const newAnswers = { ...answers, [currentQuestion.id]: value }
        setAnswers(newAnswers)

        // Track step
        trackEvent({
            action: 'quiz_step_completed',
            category: 'quiz',
            label: `${currentQuestion.id}:${value}`,
            value: step + 1
        })

        // Save to session storage for retargeting
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('quiz_answers', JSON.stringify(newAnswers))
        }

        if (step < QUESTIONS.length - 1) {
            setTimeout(() => setStep(step + 1), 300)
        } else {
            setTimeout(() => setStep(step + 1), 300) // Go to city input
        }
    }

    function handleCitySubmit() {
        if (!city.trim()) return
        setAnswers({ ...answers, city })
        setTimeout(() => setStep(step + 1), 300) // Go to lead capture
    }

    async function handleLeadSubmit(e: React.FormEvent) {
        e.preventDefault()

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(leadData.email)) {
            alert('Veuillez entrer une adresse email valide')
            return
        }

        setLoading(true)

        try {
            const isPro = answers.userType === 'small_office' || answers.userType === 'enterprise'

            // Save lead to database
            const { data, error } = await supabase.from('leads').insert({
                user_name: leadData.name,
                user_email: leadData.email,
                user_phone: leadData.phone,
                city: city,
                address: leadData.address,
                status: isPro ? 'new_pro' : 'new_qualified', // High quality lead
                is_pro: isPro,
                needs_details: {
                    quiz_answers: answers,
                    captured_at: new Date().toISOString(),
                    lead_source: 'quiz_pre_results'
                }
            }).select();
      // Queue voice verification if consented
      if (consentVoice && data?.[0]?.id) {
        await fetch('/api/voice/queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: data[0].id, phone: leadData.phone })
        });
      }

            if (error) {
                console.error("Supabase insert error:", error);
                throw error;
            }

            // Trigger B2B Notification Pipeline
            fetch('/api/leads/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: data?.[0]?.id || null, // Best effort
                    phone: leadData.phone,
                    needs_details: { 
                        quiz_answers: answers,
                        leadData
                    },
                    source: 'quiz_completion'
                })
            }).catch(err => console.error("Webhook trigger failed", err))

            // Save full context to session for results page
            const fullContext = {
                ...answers,
                city,
                leadData,
                leadId: data?.[0]?.id
            }
            sessionStorage.setItem('quiz_answers', JSON.stringify(fullContext))

            // Small delay to simulate "processing"
            setTimeout(() => {
                setLoading(false)
                router.push('/results')
            }, 1000)

        } catch (err) {
            console.error('Lead capture error:', err)
            setLoading(false)
            // Continue anyway to show results
            router.push('/results')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            <Navigation />

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 z-50">
                <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="max-w-3xl mx-auto px-4 py-16 pt-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        {t('quiz_step_title').replace('{step}', (step + 1).toString()).replace('{total}', totalSteps.toString())}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900 dark:text-white">
                        {step < QUESTIONS.length ? currentQuestion.question :
                            step === QUESTIONS.length ? t('quiz_city_title') :
                                t('quiz_lead_title')}
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        {step < QUESTIONS.length ? t('scam_select') :
                            step === QUESTIONS.length ? t('quiz_city_question') :
                                t('quiz_lead_desc')}
                    </p>
                </div>

                {/* Question Content */}
                {step < QUESTIONS.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
                        {currentQuestion.options.map((option) => {
                            const Icon = option.icon
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className={`group relative p-8 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl hover:-translate-y-1 ${isRtl ? 'text-right' : 'text-left'}`}
                                >
                                    <div className="mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 text-zinc-900 dark:text-white">{option.label}</h3>
                                    <p className="text-sm text-zinc-500">{option.desc}</p>

                                    <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        <ChevronRight className={`w-5 h-5 text-blue-600 ${isRtl ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                ) : step === QUESTIONS.length ? (
                    // City Input
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border-2 border-zinc-200 dark:border-zinc-800">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 text-center">
                                    {t('quiz_city_question')}
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder={t('quiz_city_placeholder')}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-medium text-center"
                                    autoFocus
                                    onKeyPress={(e) => e.key === 'Enter' && handleCitySubmit()}
                                    dir="auto"
                                />
                            </div>

                            <button
                                onClick={handleCitySubmit}
                                disabled={!city.trim()}
                                className={`w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center justify-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}
                            >
                                {t('promo_btn_continue')}
                                <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                ) : (
                    // Lead Capture Form
                    <div className="animate-in fade-in zoom-in-95 duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-10 border-2 border-blue-200 dark:border-blue-900/50 shadow-2xl">
                            {/* Trust Badge */}
                            <div className={`flex items-center justify-center gap-2 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <Lock className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="font-bold text-green-600">{t('promo_secure')}</span>
                                </span>
                            </div>

                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
                                    {t('quiz_lead_title')}
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {t('quiz_lead_desc')}
                                </p>
                            </div>

                            <form onSubmit={handleLeadSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className={`flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 ${isRtl ? 'mr-1 flex-row-reverse' : 'ml-1'}`}>
                                        <User className="w-4 h-4" />
                                        {t('quiz_lead_name')}
                                    </label>
                                    <input
                                        required
                                        value={leadData.name}
                                        onChange={e => setLeadData({ ...leadData, name: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium ${isRtl ? 'text-right' : 'text-left'}`}
                                        placeholder={t('quiz_lead_name_placeholder')}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className={`flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 ${isRtl ? 'mr-1 flex-row-reverse' : 'ml-1'}`}>
                                            <Phone className="w-4 h-4" />
                                            {t('quiz_lead_phone')}
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            value={leadData.phone}
                                            onChange={e => setLeadData({ ...leadData, phone: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium ${isRtl ? 'text-right' : 'text-left'}`}
                                            placeholder={t('promo_step2_phone_placeholder')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 ${isRtl ? 'mr-1 flex-row-reverse' : 'ml-1'}`}>
                                            <Mail className="w-4 h-4" />
                                            {t('quiz_lead_email')}
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            value={leadData.email}
                                            onChange={e => setLeadData({ ...leadData, email: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium ${isRtl ? 'text-right' : 'text-left'}`}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={`flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 ${isRtl ? 'mr-1 flex-row-reverse' : 'ml-1'}`}>
                                        <Home className="w-4 h-4" />
                                        {t('quiz_lead_address')}
                                    </label>
                                    <input
                                        required
                                        value={leadData.address}
                                        onChange={e => setLeadData({ ...leadData, address: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium ${isRtl ? 'text-right' : 'text-left'}`}
                                        placeholder={t('quiz_lead_address_placeholder')}
                                    />
                                </div>

                                {/* Consent */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50">
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed text-center">
                                        {t('quiz_lead_consent')}
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !leadData.name || !leadData.phone || !leadData.email || !leadData.address}
                                    className={`w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg ${isRtl ? 'flex-row-reverse' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {t('quiz_lead_preparing')}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            {t('quiz_lead_btn')}
                                        </>
                                    )}
                                </button>
                                <VoiceConsentCheckbox consentVoice={consentVoice} setConsentVoice={setConsentVoice} />
                            </form>
                        </div>
                    </div>
                )}

                {/* Skip Option (only on quiz questions) */}
                {step < QUESTIONS.length && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => router.push('/')}
                            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm font-medium transition-colors"
                        >
                            {t('quiz_skip')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function QuizPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500">...</div>}>
            <QuizContent />
        </Suspense>
    )
}
