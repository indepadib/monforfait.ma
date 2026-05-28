"use client"

import { useState, useEffect, Suspense } from 'react'
import { Navigation } from '@/components/Navigation'
import { HeroQuickFilter } from '@/components/HeroQuickFilter'
import { OfferCard, OfferProps } from '@/components/OfferCard'
import { supabase } from '@/lib/supabaseClient'
import { Filter, Search, ArrowUpDown, ChevronDown } from 'lucide-react'
import { event as trackEvent } from '@/lib/analytics'
import { useTranslation } from '@/lib/LocaleContext'
import { useSearchParams, useRouter } from 'next/navigation'


function OffersContent() {
    const { locale, t, isRtl } = useTranslation()
    const searchParams = useSearchParams()
    const router = useRouter()

    const initialCategory = searchParams.get('category') || 'all'
    const initialSort = searchParams.get('sort') || 'recommended'

    const [offers, setOffers] = useState<OfferProps[]>([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState(initialCategory)
    const [sort, setSort] = useState(initialSort)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadOffers()
    }, [])

    useEffect(() => {
        const params = new URLSearchParams()
        if (category !== 'all') params.set('category', category)
        if (sort !== 'recommended') params.set('sort', sort)

        const newPath = `/offers${params.toString() ? `?${params.toString()}` : ''}`
        router.push(newPath, { scroll: false })
    }, [category, sort, router])

    async function loadOffers() {
        setLoading(true)
        const { data, error } = await supabase
            .from('plans')
            .select(`
        id,
        title,
        category,
        price_dh,
        download_speed_mbps,
        mobile_data_gb,
        voice_minutes,
        technology,
        highlight_badge,
        target_audience,
        operators (name)
      `)
            .eq('is_active', true)

        if (error) {
            console.error('Error loading offers:', error)
        } else if (data) {
            const formatted = data.map((offer: any) => ({
                id: offer.id,
                operator_name: offer.operators?.name || 'Unknown',
                title: offer.title,
                category: offer.category as 'internet' | 'mobile',
                price_dh: offer.price_dh,
                download_speed: offer.download_speed_mbps,
                mobile_data_gb: offer.mobile_data_gb,
                voice_minutes: offer.voice_minutes,
                technology: offer.technology,
                highlight_badge: offer.highlight_badge,
                target_audience: offer.target_audience || 'individual',
            }))
            setOffers(formatted)
        }
        setLoading(false)
    }

    // Filter and Sort
    const filteredOffers = offers
        .filter(offer => {
            if (category !== 'all' && offer.category !== category) return false
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                return offer.title.toLowerCase().includes(query) ||
                    offer.operator_name.toLowerCase().includes(query)
            }
            return true
        })
        .sort((a, b) => {
            if (sort === 'price_asc') return a.price_dh - b.price_dh
            if (sort === 'price_desc') return b.price_dh - a.price_dh
            if (sort === 'data_desc') return (b.mobile_data_gb || 0) - (a.mobile_data_gb || 0)
            if (sort === 'speed_desc') return (b.download_speed_mbps || 0) - (a.download_speed_mbps || 0)
            return 0 // Recommended (default DB order or custom score logic)
        })

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans ${isRtl ? 'text-right' : 'text-left'}`}>
            <Navigation />

            {/* Header & Quick Filter */}
            <div className="bg-[#0A0F1C] pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            {t('offers_title_all')}
                        </h1>
                        <p className="text-xl text-zinc-400">
                            {t('offers_subtitle')}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <HeroQuickFilter onFilter={(filters) => {
                            if (filters.category) setCategory(filters.category)
                            if (filters.maxPrice) {
                                // Add price filter logic if needed, currently not implemented in backend fetch
                            }
                        }} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 shrink-0">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 sticky top-24">
                            <div className={`flex items-center gap-2 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <Filter className="w-5 h-5 text-blue-600" />
                                <h2 className="font-bold text-lg text-zinc-900 dark:text-white">{t('offers_filters')}</h2>
                            </div>

                            {/* Search */}
                            <div className="mb-6 relative">
                                <Search className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} w-4 h-4 text-zinc-400`} />
                                <input
                                    type="text"
                                    placeholder={t('offers_search_placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className={`text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('offers_category')}
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { id: 'all', label: t('offers_all') },
                                        { id: 'mobile', label: t('offers_mobile_only') },
                                        { id: 'internet', label: t('offers_internet_only') }
                                    ].map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.id
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                } ${isRtl ? 'flex-row-reverse' : ''}`}
                                        >
                                            <span>{cat.label}</span>
                                            {category === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                            <div className="text-zinc-600 dark:text-zinc-400">
                                {t('offers_results_count').replace('{count}', filteredOffers.length.toString())}
                            </div>

                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <ArrowUpDown className="w-4 h-4 text-zinc-400" />
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer ${isRtl ? 'pr-4 pl-8' : 'pl-4 pr-8'}`}
                                >
                                    <option value="recommended">{t('offers_sort_recommended')}</option>
                                    <option value="price_asc">{t('offers_sort_price_asc')}</option>
                                    <option value="price_desc">{t('offers_sort_price_desc')}</option>
                                    <option value="data_desc">{t('offers_sort_data_desc')}</option>
                                    <option value="speed_desc">{t('offers_sort_speed_desc')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Loading / Grid */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredOffers.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t('offers_no_results')}</h3>
                                <p className="text-zinc-500 mb-6">{t('offers_adjust_filters')}</p>
                                <button
                                    onClick={() => { setCategory('all'); setSearchQuery(''); }}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    {t('offers_reset_filters')}
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredOffers.map(offer => (
                                    <OfferCard key={offer.id} offer={offer} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function OffersClient() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <OffersContent />
        </Suspense>
    )
}
