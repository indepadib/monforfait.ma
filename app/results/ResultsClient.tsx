"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { OfferCard } from '@/components/OfferCard'
import { supabase } from '@/lib/supabaseClient'
import { Sparkles, ArrowRight, PhoneCall, Gift, CheckCircle, Flame, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { CONFIG } from '@/lib/config'
import { event as trackEvent } from '@/lib/analytics'
import { useTranslation } from '@/lib/LocaleContext'

type Offer = {
    id: string
    operator_name: string
    title: string
    category: string
    price_dh: number
    download_speed_mbps?: number
    upload_speed_mbps?: number
    mobile_data_gb?: number
    voice_minutes?: number
    technology?: string
    highlight_badge?: string
    setup_fee_dh?: number
    commitment_months?: number
}

function ResultsContent() {
    const { t, isRtl } = useTranslation()
    const router = useRouter()
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [context, setContext] = useState<any>(null)
    const [claiming, setClaiming] = useState<string | null>(null)
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        // Load context from session (saved by quiz)
        const stored = sessionStorage.getItem('quiz_answers')
        if (!stored) {
            router.push('/quiz')
            return
        }

        const parsed = JSON.parse(stored)
        setContext(parsed)
        loadMatches(parsed)

        // Show confetti on load
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)

        // Track page view with context
        trackEvent({
            action: 'view_results',
            category: 'funnel',
            label: parsed.category || 'unknown'
        })
    }, [router])

    async function loadMatches(ctx: any) {
        setLoading(true)
        try {
            // Build query based on answers
            let query = supabase.from('plans').select(`
                id,
                title,
                category,
                price_dh,
                download_speed_mbps,
                upload_speed_mbps,
                mobile_data_gb,
                voice_minutes,
                technology,
                setup_fee_dh,
                commitment_months,
                highlight_badge,
                operators (name)
            `).eq('is_active', true)

            // Filter by category
            if (ctx.category === 'internet') {
                query = query.eq('category', 'internet')
            } else if (ctx.category === 'mobile') {
                query = query.eq('category', 'mobile')
            }

            // Execute query
            const { data, error } = await query

            if (error) throw error

            if (data) {
                // Transform data
                let formatted = data.map((offer: any) => ({
                    ...offer,
                    operator_name: offer.operators?.name || 'Unknown'
                }))

                // Score and sort based on quiz answers
                formatted.sort((a, b) => {
                    let scoreA = 0
                    let scoreB = 0

                    if (ctx.priority === 'cheapest') {
                        scoreA -= a.price_dh
                        scoreB -= b.price_dh
                    } else if (ctx.priority === 'fastest') {
                        scoreA += (a.download_speed_mbps || 0) + (a.mobile_data_gb || 0) * 10
                        scoreB += (b.download_speed_mbps || 0) + (b.mobile_data_gb || 0) * 10
                    } else {
                        // best_value: value = features / price
                        const valA = ((a.download_speed_mbps || 0) + (a.mobile_data_gb || 0) * 10) / (a.price_dh || 1)
                        const valB = ((b.download_speed_mbps || 0) + (b.mobile_data_gb || 0) * 10) / (b.price_dh || 1)
                        scoreA += valA
                        scoreB += valB
                    }

                    // Bonus for zero setup fee or zero commitment if cheapest is selected
                    if (ctx.priority === 'cheapest') {
                        if (a.setup_fee_dh === 0) scoreA += 50
                        if (b.setup_fee_dh === 0) scoreB += 50
                    }

                    return scoreB - scoreA // Descending
                })

                // Keep top 3
                setOffers(formatted.slice(0, 3))
            }
        } catch (err) {
            console.error("Error loading matches:", err)
        } finally {
            setLoading(false)
        }
    }

    async function handleClaim(offer: Offer) {
        setClaiming(offer.id)

        try {
            // Update lead with selected offer
            if (context?.leadId) {
                await supabase.from('leads').update({
                    status: 'hot_lead',
                    needs_details: {
                        ...context.needs_details,
                        selected_offer: {
                            id: offer.id,
                            title: offer.title,
                            operator: offer.operator_name,
                            price: offer.price_dh
                        },
                        claimed_at: new Date().toISOString()
                    }
                }).eq('id', context.leadId)
                
                // Trigger B2B Notification for hot lead
                fetch('/api/leads/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadId: context.leadId,
                        phone: context.leadData?.phone,
                        needs_details: { 
                            selected_offer: offer,
                            quiz_answers: context
                        },
                        source: 'offer_claimed'
                    })
                }).catch(err => console.error("Webhook trigger failed", err))
            }

            // Track claim
            trackEvent({
                action: 'claim_offer',
                category: 'conversion',
                label: offer.title,
                value: offer.price_dh
            })

            // Redirect to WhatsApp with pre-filled message
            const message = t('results_whatsapp_msg')
                .replace('{offerTitle}', offer.title)
                .replace('{operatorName}', offer.operator_name)
                .replace('{price}', offer.price_dh.toString())
            
            const whatsappUrl = `https://wa.me/${CONFIG.SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`
            window.location.href = whatsappUrl

        } catch (err) {
            console.error("Claim error:", err)
            setClaiming(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-3xl animate-spin"></div>
                    <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('results_analyzing')}</h2>
                <p className="text-zinc-500 text-center max-w-sm">
                    {t('results_analyzing_desc')}
                </p>
                <div className="mt-8 space-y-3 w-full max-w-xs">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl animate-pulse">
                            <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
            <Navigation />

            {/* Success Confetti Effect (CSS only) */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-start justify-center">
                    <div className="w-full h-full bg-[url('/confetti.gif')] bg-cover bg-center opacity-50"></div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 pt-32">
                {/* Hero Results Section */}
                <div className="text-center mb-16 relative">
                    <div className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold rounded-full mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
                        <CheckCircle className="w-5 h-5" />
                        {t('results_success_badge')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
                        {t('results_title')} <span className="text-blue-600">{context?.leadData?.name?.split(' ')[0]}</span> !
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                        {t('results_subtitle')}
                    </p>
                </div>

                {/* Top Match - Highlighted */}
                {offers.length > 0 && (
                    <div className="mb-20 animate-in zoom-in-95 fade-in duration-700 delay-300">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Flame className="w-8 h-8 text-orange-500" />
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">{t('results_best_match')}</h2>
                        </div>
                        
                        <div className="max-w-4xl mx-auto transform hover:scale-[1.02] transition-transform duration-500 relative">
                            {/* Glow effect behind the card */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur-xl opacity-30"></div>
                            
                            <div className="relative">
                                {/* Pass a special prop or just wrap the OfferCard to make it look bigger */}
                                <div className="ring-4 ring-blue-500 rounded-[2rem] overflow-hidden shadow-2xl bg-white dark:bg-zinc-900">
                                    <OfferCard offer={offers[0]} />
                                    
                                    {/* Action Banner inside top choice */}
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="text-white">
                                            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                                                <Gift className="w-5 h-5" /> {t('results_promo_title')}
                                            </h3>
                                            <p className="text-blue-100">{t('results_promo_desc')}</p>
                                        </div>
                                        <button
                                            onClick={() => handleClaim(offers[0])}
                                            disabled={claiming === offers[0].id}
                                            className={`shrink-0 w-full md:w-auto px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-black rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 ${isRtl ? 'flex-row-reverse' : ''}`}
                                        >
                                            {claiming === offers[0].id ? (
                                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <PhoneCall className="w-5 h-5" />
                                                    {t('results_claim_btn')}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Alternatives */}
                {offers.length > 1 && (
                    <div className="animate-in slide-in-from-bottom-12 fade-in duration-700 delay-500">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t('results_alternatives')}</h2>
                            <p className="text-zinc-500">{t('results_alternatives_desc')}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {offers.slice(1).map(offer => (
                                <div key={offer.id} className="relative group">
                                    <OfferCard offer={offer} />
                                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleClaim(offer)}
                                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                                        >
                                            <PhoneCall className="w-4 h-4" />
                                            {t('results_claim_short')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Next Steps / Reassurance */}
                <div className="mt-24 max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                    <h3 className="text-2xl font-black text-center mb-10 text-zinc-900 dark:text-white">{t('results_next_steps')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2 -z-10"></div>
                        
                        <div className="text-center bg-white dark:bg-zinc-900 z-10">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 border-4 border-white dark:border-zinc-900">
                                <PhoneCall className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">{t('results_step1_title')}</h4>
                            <p className="text-sm text-zinc-500">{t('results_step1_desc')}</p>
                        </div>
                        <div className="text-center bg-white dark:bg-zinc-900 z-10">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600 border-4 border-white dark:border-zinc-900">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">{t('results_step2_title')}</h4>
                            <p className="text-sm text-zinc-500">{t('results_step2_desc')}</p>
                        </div>
                        <div className="text-center bg-white dark:bg-zinc-900 z-10">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 border-4 border-white dark:border-zinc-900">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">{t('results_step3_title')}</h4>
                            <p className="text-sm text-zinc-500">{t('results_step3_desc')}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export function ResultsClient() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
                 <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            </div>
        }>
            <ResultsContent />
        </Suspense>
    )
}
