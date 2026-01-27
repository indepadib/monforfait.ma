"use client"

import { useState, useEffect } from 'react'
import { OfferCard, OfferProps } from './OfferCard'
import { LeadModal } from './LeadModal'
import { supabase } from '@/lib/supabaseClient'
import { Wifi, Smartphone, Briefcase, User, Filter } from 'lucide-react'

export function ComparisonSection() {
    const [offers, setOffers] = useState<OfferProps[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOffer, setSelectedOffer] = useState<OfferProps | null>(null)

    // Filters
    const [audience, setAudience] = useState<'individual' | 'professional'>('individual')
    const [category, setCategory] = useState<'internet' | 'mobile'>('internet')
    const [sortBy, setSortBy] = useState<'cheapest' | 'fastest'>('cheapest')

    useEffect(() => {
        async function loadOffers() {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('plans')
                    .select(`
                *,
                operator:operators(name)
            `)
                    .eq('category', category)
                    .eq('target_audience', audience)

                if (data && data.length > 0) {
                    const mapped = data.map((p: any) => ({
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
                    setOffers(mapped)
                } else {
                    console.log("No data from DB, using fallback for demo");
                    // FALLBACK DUMMY DATA FOR DEMO PURPOSES
                    const dummies: OfferProps[] = []

                    if (category === 'internet' && audience === 'individual') {
                        dummies.push(
                            { id: '1', operator_name: 'Orange', title: 'Fibre 20 Mega', price_dh: 249, download_speed: 20, technology: 'FTTH', category: 'internet', target_audience: 'individual' },
                            { id: '2', operator_name: 'Inwi', title: 'Fibre 20 Mega', price_dh: 249, download_speed: 20, technology: 'FTTH', category: 'internet', target_audience: 'individual' },
                            { id: '3', operator_name: 'Maroc Telecom', title: 'Fibre 100 Mega', price_dh: 400, download_speed: 100, technology: 'FTTH', category: 'internet', target_audience: 'individual' },
                        )
                    }
                    if (category === 'internet' && audience === 'professional') {
                        dummies.push(
                            { id: 'p1', operator_name: 'Orange', title: 'Pack Pro Fibre', price_dh: 490, download_speed: 100, technology: 'FTTH', highlight_badge: 'IP Fixe', category: 'internet', target_audience: 'professional' },
                            { id: 'p2', operator_name: 'Inwi', title: 'Business Link', price_dh: 449, download_speed: 100, technology: 'FTTH', category: 'internet', target_audience: 'professional' },
                            { id: 'p3', operator_name: 'Maroc Telecom', title: 'Fibre Optique Entreprise', price_dh: 990, download_speed: 200, technology: 'FTTH', category: 'internet', target_audience: 'professional', is_sponsored: true }
                        )
                    }
                    if (category === 'mobile' && audience === 'individual') {
                        dummies.push(
                            { id: 'm1', operator_name: 'Inwi', title: 'Forfait 11Go', price_dh: 49, mobile_data_gb: 11, voice_minutes: 1, category: 'mobile', target_audience: 'individual' },
                            { id: 'm2', operator_name: 'Orange', title: 'Forfait Yo 30Go', price_dh: 99, mobile_data_gb: 30, voice_minutes: -1, highlight_badge: 'Social Media Illimité', category: 'mobile', target_audience: 'individual' },
                            { id: 'm3', operator_name: 'Maroc Telecom', title: 'Forfait Liberté', price_dh: 99, mobile_data_gb: 25, voice_minutes: 2, category: 'mobile', target_audience: 'individual' }
                        )
                    }
                    if (category === 'mobile' && audience === 'professional') {
                        dummies.push(
                            { id: 'mp1', operator_name: 'Orange', title: 'Flotte Pro 50Go', price_dh: 150, mobile_data_gb: 50, voice_minutes: -1, category: 'mobile', target_audience: 'professional' },
                            { id: 'mp2', operator_name: 'Inwi', title: 'Business Mobile', price_dh: 120, mobile_data_gb: 40, voice_minutes: -1, category: 'mobile', target_audience: 'professional' }
                        )
                    }

                    setOffers(dummies)
                }
            } catch (e) {
                console.error("Error loading offers", e)
            } finally {
                setLoading(false)
            }
        }
        loadOffers()
    }, [category, audience])

    const sortedOffers = [...offers].sort((a, b) => {
        // Sponsored always on top
        if (a.is_sponsored && !b.is_sponsored) return -1;
        if (!a.is_sponsored && b.is_sponsored) return 1;

        if (sortBy === 'cheapest') return a.price_dh - b.price_dh
        if (sortBy === 'fastest') {
            if (category === 'internet') return (b.download_speed || 0) - (a.download_speed || 0)
            if (category === 'mobile') return (b.mobile_data_gb || 0) - (a.mobile_data_gb || 0)
        }
        return 0
    })

    return (
        <div className="max-w-6xl mx-auto px-4 py-12" id="comparator">

            {/* Main Controls - Audience & Vertical */}
            <div className="flex flex-col items-center gap-8 mb-12">

                {/* Audience Toggle (Pill) */}
                <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-full inline-flex relative">
                    <div className={`absolute inset-y-1.5 w-1/2 bg-white dark:bg-zinc-800 rounded-full shadow-sm transition-all duration-300 ease-out transform ${audience === 'individual' ? 'left-1.5' : 'left-[calc(50%-0.375rem)] translate-x-full'}`}></div>
                    <button
                        onClick={() => setAudience('individual')}
                        className={`relative z-10 px-8 py-2.5 text-sm font-bold rounded-full transition-colors flex items-center gap-2 ${audience === 'individual' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
                    >
                        <User className="w-4 h-4" /> Particulier
                    </button>
                    <button
                        onClick={() => setAudience('professional')}
                        className={`relative z-10 px-8 py-2.5 text-sm font-bold rounded-full transition-colors flex items-center gap-2 ${audience === 'professional' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
                    >
                        <Briefcase className="w-4 h-4" /> Professional
                    </button>
                </div>

                {/* Vertical Selector (Big Cards) */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                    <button
                        onClick={() => setCategory('internet')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${category === 'internet'
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 bg-white dark:bg-zinc-900 text-zinc-500'}`}
                    >
                        <Wifi className="w-8 h-8" />
                        <span className="font-bold">Internet (Fibre/Box)</span>
                    </button>
                    <button
                        onClick={() => setCategory('mobile')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${category === 'mobile'
                            ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 bg-white dark:bg-zinc-900 text-zinc-500'}`}
                    >
                        <Smartphone className="w-8 h-8" />
                        <span className="font-bold">Mobile Plans</span>
                    </button>
                </div>
            </div>

            {/* Sort & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {category === 'internet' ? 'Box & Fibre Offers' : 'Mobile Plans'}
                        <span className="text-zinc-400 font-normal ml-2 text-lg">for {audience === 'individual' ? 'Individuals' : 'Professionals'}</span>
                    </h2>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <Filter className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-500 mr-2">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent text-sm font-bold text-zinc-900 dark:text-white outline-none cursor-pointer"
                    >
                        <option value="cheapest">Price: Low to High</option>
                        <option value="fastest">{category === 'internet' ? 'Speed' : 'Data'}: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-20 animate-pulse">
                    <div className="w-12 h-12 bg-zinc-200 rounded-full mx-auto mb-4"></div>
                    <div className="text-zinc-400 font-medium">Searching best deals...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedOffers.map((offer, idx) => (
                        <OfferCard
                            key={offer.id || idx}
                            offer={offer}
                            onSelect={() => setSelectedOffer(offer)}
                        />
                    ))}
                </div>
            )}

            {selectedOffer && (
                <LeadModal
                    offer={selectedOffer}
                    onClose={() => setSelectedOffer(null)}
                />
            )}
        </div>
    )
}
