"use client"

import { useEffect, useState } from 'react'
import { OfferCard } from '@/components/OfferCard'
import { Navigation } from '@/components/Navigation'
import { supabase } from '@/lib/supabaseClient'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { OfferCardSkeleton } from '@/components/LoadingSkeleton'
import { RecentlyViewed } from '@/components/RecentlyViewed'

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
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'internet' | 'mobile'>('all')
    const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'speed_desc'>('price_asc')
    const [operator, setOperator] = useState<'all' | 'Orange Morocco' | 'Inwi' | 'Maroc Telecom'>('all')

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
        <div className="min-h-screen bg-white dark:bg-black">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <Breadcrumbs items={[{ label: 'Offres', href: '/offers' }]} />

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900 dark:text-white">
                        Toutes les offres au Maroc
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">
                        {offers.length} forfaits disponibles • Prix mis à jour quotidiennement
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 mb-8 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-4">
                        <SlidersHorizontal className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                        <h3 className="font-bold text-zinc-900 dark:text-white">Filtres</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                Catégorie
                            </label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="w-full px-4 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Toutes</option>
                                <option value="internet">Internet uniquement</option>
                                <option value="mobile">Mobile uniquement</option>
                            </select>
                        </div>

                        {/* Operator Filter */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                Opérateur
                            </label>
                            <select
                                value={operator}
                                onChange={(e) => setOperator(e.target.value as any)}
                                className="w-full px-4 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Tous</option>
                                <option value="Orange Morocco">Orange</option>
                                <option value="Inwi">Inwi</option>
                                <option value="Maroc Telecom">Maroc Telecom</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                Trier par
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full px-4 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="price_asc">Prix croissant</option>
                                <option value="price_desc">Prix décroissant</option>
                                <option value="speed_desc">Vitesse/Data décroissant</option>
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
                                    Aucune offre trouvée
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    Essayez de modifier vos filtres
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {offers.map((offer) => (
                                    <OfferCard key={offer.id} offer={offer as any} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <RecentlyViewed />
        </div>
    )
}
