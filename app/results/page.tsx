"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OfferCard, OfferProps } from '@/components/OfferCard'
import { LeadModal } from '@/components/LeadModal'
import { Navigation } from '@/components/Navigation'
import { supabase } from '@/lib/supabaseClient'
import { Sparkles, TrendingUp, CheckCircle } from 'lucide-react'
import { ShareResults } from '@/components/ShareResults'

type QuizAnswers = {
    category?: 'internet' | 'mobile' | 'both'
    userType?: 'solo' | 'family' | 'small_office' | 'enterprise'
    priority?: 'cheapest' | 'fastest' | 'best_value'
    city?: string
}

export default function ResultsPage() {
    const router = useRouter()
    const [answers, setAnswers] = useState<QuizAnswers>({})
    const [offers, setOffers] = useState<(OfferProps & { matchScore?: number })[]>([])
    const [selectedOffer, setSelectedOffer] = useState<OfferProps | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get quiz answers from session
        const stored = sessionStorage.getItem('quiz_answers')
        if (!stored) {
            router.push('/quiz')
            return
        }

        const quizAnswers: QuizAnswers = JSON.parse(stored)
        setAnswers(quizAnswers)
        loadPersonalizedOffers(quizAnswers)
    }, [])

    async function loadPersonalizedOffers(quizAnswers: QuizAnswers) {
        setLoading(true)

        try {
            // Determine filters
            const isInternet = quizAnswers.category === 'internet' || quizAnswers.category === 'both'
            const isMobile = quizAnswers.category === 'mobile' || quizAnswers.category === 'both'
            const isPro = quizAnswers.userType === 'small_office' || quizAnswers.userType === 'enterprise'

            let query = supabase.from('plans').select(`*, operator:operators(name)`)

            if (isPro) {
                query = query.eq('target_audience', 'professional')
            } else {
                query = query.eq('target_audience', 'individual')
            }

            const { data } = await query

            if (data && data.length > 0) {
                let plans = data.map((p: any) => ({
                    id: p.id,
                    operator_name: p.operator?.name || 'Unknown',
                    title: p.title,
                    price_dh: p.price_dh,
                    download_speed: p.download_speed_mbps,
                    upload_speed: p.upload_speed_mbps,
                    technology: p.technology,
                    category: p.category,
                    target_audience: p.target_audience,
                    mobile_data_gb: p.mobile_data_gb,
                    voice_minutes: p.voice_minutes,
                    is_sponsored: p.is_sponsored,
                    highlight_badge: p.highlight_badge
                }))

                // Filter by category
                if (!quizAnswers.category || quizAnswers.category !== 'both') {
                    plans = plans.filter((p: OfferProps) => p.category === quizAnswers.category)
                }

                // Score and sort
                const plansWithScores = plans.map((p) => ({
                    ...p,
                    matchScore: calculateMatchScore(p, quizAnswers)
                })).sort((a: any, b: any) => b.matchScore - a.matchScore)

                setOffers(plansWithScores.slice(0, 6)) // Top 6
            } else {
                // Fallback data
                setOffers(getFallbackOffers(quizAnswers))
            }
        } catch (e) {
            console.error('Error loading offers', e)
            setOffers(getFallbackOffers(quizAnswers))
        } finally {
            setLoading(false)
        }
    }

    function calculateMatchScore(plan: OfferProps, answers: QuizAnswers): number {
        let score = 50 // Base score

        // Sponsored gets bonus
        if (plan.is_sponsored) score += 20

        // Priority matching
        if (answers.priority === 'cheapest' && plan.price_dh < 300) score += 30
        if (answers.priority === 'fastest' && plan.download_speed && plan.download_speed >= 100) score += 30
        if (answers.priority === 'best_value' && plan.price_dh < 400 && plan.download_speed && plan.download_speed >= 50) score += 30

        // User type matching
        if (answers.userType === 'family' && plan.download_speed && plan.download_speed >= 100) score += 15
        if (answers.userType === 'solo' && plan.price_dh < 350) score += 15

        return score
    }

    function getFallbackOffers(answers: QuizAnswers): (OfferProps & { matchScore: number })[] {
        const fallback: (OfferProps & { matchScore: number })[] = []

        if (answers.category === 'internet' || answers.category === 'both') {
            fallback.push(
                { id: 'r1', operator_name: 'Orange', title: 'Fibre 100 Mega', price_dh: 349, download_speed: 100, technology: 'FTTH', category: 'internet', target_audience: 'individual', matchScore: 95 },
                { id: 'r2', operator_name: 'Inwi', title: 'Fibre 50 Mega', price_dh: 299, download_speed: 50, technology: 'FTTH', category: 'internet', target_audience: 'individual', matchScore: 88 }
            )
        }

        if (answers.category === 'mobile' || answers.category === 'both') {
            fallback.push(
                { id: 'r3', operator_name: 'Inwi', title: 'Forfait 30Go', price_dh: 99, mobile_data_gb: 30, voice_minutes: -1, category: 'mobile', target_audience: 'individual', matchScore: 92 }
            )
        }

        return fallback.slice(0, 3)
    }

    function getMatchReason(offer: OfferProps): string {
        if (answers.priority === 'cheapest') return `Prix compétitif à ${offer.price_dh} DH`
        if (answers.priority === 'fastest' && offer.download_speed) return `Vitesse ultra-rapide: ${offer.download_speed} Mbps`
        if (answers.userType === 'family') return 'Idéal pour une famille connectée'
        return 'Excellent rapport qualité/prix'
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navigation />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Résultats personnalisés
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-6">
                        Vos offres sur mesure {answers.city && `à ${answers.city}`}
                    </h1>

                    <p className="text-xl text-white/90 mb-8">
                        Basé sur vos réponses, voici les {offers.length} meilleures options pour vous
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                        {answers.category && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                                {answers.category === 'internet' ? 'Internet' : answers.category === 'mobile' ? 'Mobile' : 'Internet + Mobile'}
                            </div>
                        )}
                        {answers.priority && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <TrendingUp className="w-4 h-4" />
                                {answers.priority === 'cheapest' ? 'Meilleur prix' : answers.priority === 'fastest' ? 'Plus rapide' : 'Meilleur rapport Q/P'}
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <ShareResults />
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="text-center py-20 animate-pulse">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 animate-spin"></div>
                        <div className="text-zinc-500 font-medium">Analyse de vos besoins...</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {offers.map((offer, idx) => (
                                <div key={offer.id || idx} className="relative">
                                    {/* Match Badge */}
                                    {offer.matchScore && offer.matchScore >= 85 && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            {offer.matchScore}% de correspondance
                                        </div>
                                    )}

                                    <OfferCard
                                        offer={offer}
                                        onSelect={() => setSelectedOffer(offer)}
                                    />

                                    {/* Why This Matches */}
                                    <div className="mt-3 text-center">
                                        <p className="text-sm text-zinc-500 italic">
                                            ✨ {getMatchReason(offer)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-8 md:p-12 text-center border border-zinc-200 dark:border-zinc-700">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
                                Pas convaincu ?
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl mx-auto">
                                Parcourez toutes nos offres ou refaites le quiz pour affiner vos résultats
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-8 py-4 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl hover:border-blue-500 transition-all"
                                >
                                    Voir toutes les offres
                                </button>
                                <button
                                    onClick={() => router.push('/quiz')}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Refaire le quiz
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {
                selectedOffer && (
                    <LeadModal
                        offer={selectedOffer}
                        onClose={() => setSelectedOffer(null)}
                    />
                )
            }
        </div >
    )
}
