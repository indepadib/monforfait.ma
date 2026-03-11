"use client"

import { useState, useEffect } from 'react'
import { OfferCard, OfferProps } from './OfferCard'
import { LeadModal } from './LeadModal'
import { supabase } from '@/lib/supabaseClient'
import { ChevronDown, MapPin, Search, ArrowRight, Shield, Zap, Sparkles, AlertCircle, BarChart3, Clock, Gift, Phone, Wifi, Router, Tv, Globe2, Eye, LockKeyhole, User, Briefcase, Filter, CheckCircle, ArrowDown } from 'lucide-react'
import { PromoUnlockerForm } from './PromoUnlockerForm'
import { Smartphone } from 'lucide-react'

export function ComparisonSection() {
    const [offers, setOffers] = useState<OfferProps[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOffer, setSelectedOffer] = useState<OfferProps | null>(null)

    // Filters
    const [audience, setAudience] = useState<'individual' | 'professional'>('individual')
    const [category, setCategory] = useState<'internet' | 'mobile'>('internet')
    const [sortBy, setSortBy] = useState<'cheapest' | 'fastest'>('cheapest')
    const [isUnlocked, setIsUnlocked] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const urlUnlocked = params.get('unlocked') === 'true'
            const localUnlocked = localStorage.getItem('monforfait_unlocked') === 'true'
            
            if (urlUnlocked) {
                localStorage.setItem('monforfait_unlocked', 'true')
                setIsUnlocked(true)
            } else if (localUnlocked) {
                setIsUnlocked(true)
            }
        }
    }, [])

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
                        highlight_badge: p.highlight_badge,
                        affiliate_link: p.affiliate_link
                    }))
                    setOffers(mapped)
                } else {
                    console.log("No data from DB, using fallback for demo");
                    // FALLBACK DUMMY DATA FOR DEMO PURPOSES
                    const dummies: OfferProps[] = []

                    if (category === 'internet' && audience === 'individual') {
                        dummies.push(
                            { id: '1', operator_name: 'Orange', title: 'Fibre 20 Mega', price_dh: 249, download_speed: 20, technology: 'FTTH', category: 'internet', target_audience: 'individual', affiliate_link: 'https://orange.ma/' },
                            { id: '2', operator_name: 'Inwi', title: 'Fibre 20 Mega', price_dh: 249, download_speed: 20, technology: 'FTTH', category: 'internet', target_audience: 'individual' },
                            { id: '3', operator_name: 'Maroc Telecom', title: 'Fibre 100 Mega', price_dh: 400, download_speed: 100, technology: 'FTTH', category: 'internet', target_audience: 'individual' },
                        )
                    }
                    if (category === 'internet' && audience === 'professional') {
                        dummies.push(
                            { id: 'p1', operator_name: 'Orange', title: 'Pack Pro Fibre', price_dh: 490, download_speed: 100, technology: 'FTTH', highlight_badge: 'IP Fixe', category: 'internet', target_audience: 'professional' },
                            { id: 'p2', operator_name: 'Inwi', title: 'Business Link', price_dh: 449, download_speed: 100, technology: 'FTTH', category: 'internet', target_audience: 'professional', affiliate_link: 'https://inwi.ma/' },
                            { id: 'p3', operator_name: 'Maroc Telecom', title: 'Fibre Optique Entreprise', price_dh: 990, download_speed: 200, technology: 'FTTH', category: 'internet', target_audience: 'professional', is_sponsored: true }
                        )
                    }
                    if (category === 'mobile' && audience === 'individual') {
                        dummies.push(
                            { id: 'm1', operator_name: 'Inwi', title: 'Forfait 11Go', price_dh: 49, mobile_data_gb: 11, voice_minutes: 1, category: 'mobile', target_audience: 'individual' },
                            { id: 'm2', operator_name: 'Orange', title: 'Forfait Yo 30Go', price_dh: 99, mobile_data_gb: 30, voice_minutes: -1, highlight_badge: 'Social Media Illimité', category: 'mobile', target_audience: 'individual', affiliate_link: 'https://orange.ma/yo' },
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

    // Event listener for external triggers to switch to PRO
    useEffect(() => {
        const handleSwitchPro = () => {
            setAudience('professional');
        };
        window.addEventListener('switch-audience-pro', handleSwitchPro);
        return () => window.removeEventListener('switch-audience-pro', handleSwitchPro);
    }, []);

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
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Unlocked / Visible Offers (Top 2) */}
                        {/* Unlocked / Visible Offers (Top 2 or all if <= 2) */}
                        {sortedOffers.slice(0, (!isUnlocked && sortedOffers.length > 2) ? 2 : sortedOffers.length).map((offer, idx) => (
                            <div key={offer.id || `visible-${idx}`} className="relative z-10">
                                {/* AI Banner for top offer */}
                                {idx === 0 && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 z-20 whitespace-nowrap">
                                        ✨ Meilleur Choix
                                    </div>
                                )}
                                <OfferCard
                                    offer={offer}
                                    onSelect={() => setSelectedOffer(offer)}
                                />
                            </div>
                        ))}

                    {/* Locked / Blurred Offers - MAX 1 to keep form high */}
                    {!isUnlocked && sortedOffers.length > 2 && sortedOffers.slice(2, 3).map((offer, idx) => (
                        <div key={offer.id || `locked-${idx}`} className={`relative filter blur-[6px] opacity-60 select-none pointer-events-none transition-all duration-1000 overflow-hidden`}>
                            {/* Visual gradient mask over the blurred element to blend it into the background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 dark:to-zinc-900/90 z-20"></div>
                            <OfferCard
                                offer={offer}
                                onSelect={() => isUnlocked ? setSelectedOffer(offer) : null}
                            />
                        </div>
                    ))}
                </div>

                {/* The Conversion Block - Renders IN FLOW directly underneath, not absolute positioned */}
                {/* The Conversion Block - Renders IN FLOW directly underneath, not absolute positioned */}
                {!isUnlocked && (
                    <div className="w-full mt-12 bg-zinc-50/80 dark:bg-zinc-900/40 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 p-4 sm:p-8 lg:p-12 relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                        <div className="absolute bottom-[-50%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 w-full max-w-5xl items-center relative z-10">
                            {/* Left Side: Value Prop */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold mb-6 border border-blue-200 dark:border-blue-500/30">
                                    <Sparkles className="w-4 h-4" />
                                    Accès Réservé
                                </div>
                                
                                <h3 className="text-3xl md:text-4xl font-black mb-4 dark:text-white leading-tight">
                                    {activeTab === 'pro' 
                                        ? "Déléguez la négociation de votre flotte."
                                        : "Débloquez le reste du classement (jusqu'à -50%)."
                                    }
                                </h3>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                    {activeTab === 'pro'
                                        ? "Nos experts analysent vos factures et négocient directement avec les opérateurs pour obtenir les meilleurs tarifs PME/GE."
                                        : "Certaines offres de rétention sont trop incroyables pour être affichées publiquement. Vérifiez votre éligibilité en 10 secondes."
                                    }
                                </p>
                                
                                <div className="flex flex-col gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        {activeTab === 'pro' ? "Analyse Gratuite 100% Sans Engagement" : "Gratuit et 100% Sans Engagement"}
                                    </div>
                                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        {activeTab === 'pro' ? "Tarifs grossiste inaccessibles aux particuliers" : "Offres Exclusives Non Disponibles en Boutique"}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: The Form */}
                            <div className="flex-[0.8] w-full max-w-md transform transition-all hover:-translate-y-1">
                                <PromoUnlockerForm mode={activeTab === 'pro' ? 'b2b' : 'b2c'} />
                            </div>
                        </div>
                    </div>
                )}
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
