"use client"

import { useEffect, useState, Suspense } from 'react'
import { OfferCard } from '@/components/OfferCard'
import { Navigation } from '@/components/Navigation'
import { supabase } from '@/lib/supabaseClient'
import { Filter, SlidersHorizontal, LockKeyhole } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { OfferCardSkeleton } from '@/components/LoadingSkeleton'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import { useSearchParams } from 'next/navigation'
import { PromoUnlockerForm } from '@/components/PromoUnlockerForm'
import { Sparkles, CheckCircle, ArrowDown } from 'lucide-react'
import { useTranslation } from '@/lib/LocaleContext'

type Offer = {
    id: string
    operator_name: string
    title: string
    category: string
    price_dh: number
    download_speed_mbps?: number
    mobile_data_gb?: number
    technology?: string
    highlight_badge?: string
}

export default function AllOffersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <AllOffersContent />
        </Suspense>
    )
}

function AllOffersContent() {
    const { locale, t, isRtl } = useTranslation()
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'internet' | 'mobile'>('all')
    const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'speed_desc'>('price_asc')
    const [operator, setOperator] = useState<'all' | 'Orange Morocco' | 'Inwi' | 'Maroc Telecom'>('all')
    const [isUnlocked, setIsUnlocked] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        // Check unlocked state
        const urlUnlocked = searchParams.get('unlocked') === 'true'
        const localUnlocked = typeof window !== 'undefined' ? localStorage.getItem('monforfait_unlocked') === 'true' : false
        
        if (urlUnlocked) {
            if (typeof window !== 'undefined') localStorage.setItem('monforfait_unlocked', 'true')
            setIsUnlocked(true)
        } else if (localUnlocked) {
            setIsUnlocked(true)
        }
    }, [searchParams])

    useEffect(() => {
        loadOffers()
    }, [filter, sortBy, operator])

    async function loadOffers() {
        setLoading(true)

        let query = supabase
            .from('plans')
            .select(`
        id,
        title,
        category,
        price_dh,
        download_speed_mbps,
        mobile_data_gb,
        technology,
        highlight_badge,
        target_audience,
        voice_minutes,
        upload_speed_mbps,
        is_sponsored,
        operators (name)
      `)
            .eq('is_active', true)
            .eq('target_audience', 'individual')

        // Filter by category
        if (filter !== 'all') {
            query = query.eq('category', filter)
        }

        // Filter by operator
        if (operator !== 'all') {
            query = query.eq('operators.name', operator)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error loading offers:', error)
            setLoading(false)
            return
        }

        if (data) {
            const formatted = data.map((offer: any) => ({
                id: offer.id,
                operator_name: offer.operators?.name || 'Unknown',
                title: offer.title,
                category: offer.category,
                price_dh: offer.price_dh,
                download_speed_mbps: offer.download_speed_mbps,
                mobile_data_gb: offer.mobile_data_gb,
                technology: offer.technology,
                highlight_badge: offer.highlight_badge,
                target_audience: offer.target_audience,
                voice_minutes: offer.voice_minutes,
                upload_speed_mbps: offer.upload_speed_mbps,
                is_sponsored: offer.is_sponsored,
            }))

            // Sort
            let sorted = [...formatted]
            if (sortBy === 'price_asc') {
                sorted.sort((a, b) => a.price_dh - b.price_dh)
            } else if (sortBy === 'price_desc') {
                sorted.sort((a, b) => b.price_dh - a.price_dh)
            } else if (sortBy === 'speed_desc') {
                sorted.sort((a, b) => (b.download_speed_mbps || b.mobile_data_gb || 0) - (a.download_speed_mbps || a.mobile_data_gb || 0))
            }

            setOffers(sorted)
        }

        setLoading(false)
    }

    return (
        <div className={`min-h-screen bg-white dark:bg-black ${isRtl ? 'text-right' : 'text-left'}`}>
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <Breadcrumbs items={[{ label: t('nav_offers'), href: '/offers' }]} />

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900 dark:text-white">
                        {t('offers_title')}
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">
                        {t('offers_subtitle').replace('{count}', offers.length.toString())}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 mb-8 border border-zinc-200 dark:border-zinc-800">
                    <div className={`flex items-center gap-2 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <SlidersHorizontal className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                        <h3 className="font-bold text-zinc-900 dark:text-white">{t('offers_filters')}</h3>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                {t('offers_category')}
                            </label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className={`w-full px-4 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500 ${isRtl ? 'text-right' : ''}`}
                            >
                                <option value="all">{t('offers_all')}</option>
                                <option value="internet">{t('offers_internet_only')}</option>
                                <option value="mobile">{t('offers_mobile_only')}</option>
                            </select>
                        </div>

                        {/* Operator Filter */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                {t('offers_operator')}
                            </label>
                            <select
                                value={operator}
                                onChange={(e) => setOperator(e.target.value as any)}
                                className={`w-full px-4 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500 ${isRtl ? 'text-right' : ''}`}
                            >
                                <option value="all">{t('offers_all_ops')}</option>
                                <option value="Orange Morocco">{locale === 'ar' ? 'أورنج' : 'Orange'}</option>
                                <option value="Inwi">{locale === 'ar' ? 'إنوي' : 'Inwi'}</option>
                                <option value="Maroc Telecom">{locale === 'ar' ? 'اتصالات المغرب' : 'Maroc Telecom'}</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                {t('offers_sort_by')}
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className={`w-full px-4 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500 ${isRtl ? 'text-right' : ''}`}
                            >
                                <option value="price_asc">{t('offers_sort_price_asc')}</option>
                                <option value="price_desc">{t('offers_sort_price_desc')}</option>
                                <option value="speed_desc">{t('offers_sort_speed_desc')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Offers Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <OfferCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {offers.length === 0 ? (
                            <div className="text-center py-20">
                                <Filter className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                    {t('offers_none_found')}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {t('offers_none_found_desc')}
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Unlocked / Visible Offers (Top 2 or all if <= 2) */}
                                    {offers.slice(0, (!isUnlocked && offers.length > 2) ? 2 : offers.length).map((offer, idx) => (
                                        <div key={offer.id || `visible-${idx}`} className="relative z-10">
                                            {/* AI Banner for top offer */}
                                            {idx === 0 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 z-20 whitespace-nowrap">
                                                    ✨ {t('offers_best_choice')}
                                                </div>
                                            )}
                                            <OfferCard offer={offer as any} />
                                        </div>
                                    ))}

                                    {/* Locked / Blurred Offers - MAX 1 to keep form high */}
                                    {!isUnlocked && offers.length > 2 && offers.slice(2, 3).map((offer, idx) => (
                                        <div key={offer.id || `locked-${idx}`} className="relative filter blur-[6px] opacity-60 select-none pointer-events-none transition-all duration-1000 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 dark:to-zinc-900/90 z-20"></div>
                                            <OfferCard offer={offer as any} />
                                        </div>
                                    ))}
                                </div>

                                {/* The Conversion Block - Renders IN FLOW directly underneath, not absolute positioned */}
                                {!isUnlocked && (
                                    <div className="w-full mt-12 bg-zinc-50/80 dark:bg-zinc-900/40 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 p-4 sm:p-8 lg:p-12 relative overflow-hidden flex flex-col items-center">
                                        <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                                        <div className="absolute bottom-[-50%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

                                        <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 w-full max-w-5xl items-center relative z-10 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
                                            {/* Left Side: Value Prop */}
                                            <div className={`flex-1 text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold mb-6 border border-blue-200 dark:border-blue-500/30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                    <Sparkles className="w-4 h-4" />
                                                    {t('offers_locked_badge')}
                                                </div>
                                                
                                                <h3 className="text-3xl md:text-4xl font-black mb-4 dark:text-white leading-tight">
                                                    {t('offers_locked_title')}
                                                </h3>
                                                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                                    {t('offers_locked_desc')}
                                                </p>
                                                
                                                <div className="flex flex-col gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                                    <div className={`flex items-center gap-2 justify-center ${isRtl ? 'lg:justify-start flex-row-reverse' : 'lg:justify-start'}`}>
                                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                        {t('offers_locked_check_1')}
                                                    </div>
                                                    <div className={`flex items-center gap-2 justify-center ${isRtl ? 'lg:justify-start flex-row-reverse' : 'lg:justify-start'}`}>
                                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                        {t('offers_locked_check_2')}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: The Form */}
                                            <div className="flex-[0.8] w-full max-w-md transform transition-all hover:-translate-y-1">
                                                <PromoUnlockerForm mode="b2c" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <RecentlyViewed />
        </div>
    )
}
