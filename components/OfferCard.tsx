import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Wifi, Smartphone, Phone, MessageSquare, Briefcase, User, Star, GitCompare, Check } from 'lucide-react';

export interface OfferProps {
    id?: string;
    operator_name: string;
    title: string;
    price_dh: number;
    // Internet specific
    download_speed?: number;
    upload_speed?: number;
    technology?: string;
    // Mobile specific
    mobile_data_gb?: number;
    voice_minutes?: number; // -1 = Unlimited
    sms_count?: number;
    // Common
    category: 'internet' | 'mobile';
    target_audience: 'individual' | 'professional';
    features?: any;
    is_sponsored?: boolean;
    highlight_badge?: string;
}

export function OfferCard({ offer, onSelect }: { offer: OfferProps, onSelect: () => void }) {
    const [isInComparison, setIsInComparison] = useState(false)

    useEffect(() => {
        // Check if this offer is in comparison
        const saved = localStorage.getItem('compare_offers')
        if (saved && offer.id) {
            const offers = JSON.parse(saved)
            setIsInComparison(offers.includes(offer.id))
        }

        // Listen for comparison updates
        const handleUpdate = () => {
            const saved = localStorage.getItem('compare_offers')
            if (saved && offer.id) {
                const offers = JSON.parse(saved)
                setIsInComparison(offers.includes(offer.id))
            } else {
                setIsInComparison(false)
            }
        }

        window.addEventListener('compare-updated', handleUpdate)
        return () => window.removeEventListener('compare-updated', handleUpdate)
    }, [offer.id])

    function toggleComparison(e: React.MouseEvent) {
        e.stopPropagation()
        if (!offer.id) return

        const saved = localStorage.getItem('compare_offers')
        const current = saved ? JSON.parse(saved) : []

        if (isInComparison) {
            // Remove from comparison
            const updated = current.filter((id: string) => id !== offer.id)
            localStorage.setItem('compare_offers', JSON.stringify(updated))
            setIsInComparison(false)
        } else {
            // Add to comparison
            if (current.length >= 3) {
                alert('Maximum 3 offres pour la comparaison')
                return
            }
            const updated = [...current, offer.id]
            localStorage.setItem('compare_offers', JSON.stringify(updated))
            setIsInComparison(true)
        }

        window.dispatchEvent(new Event('compare-updated'))
    }

    const isOrange = offer.operator_name.toLowerCase().includes('orange');
    const isInwi = offer.operator_name.toLowerCase().includes('inwi');
    const isIam = offer.operator_name.toLowerCase().includes('maroc telecom') || offer.operator_name.toLowerCase().includes('iam');

    let borderColor = 'border-gray-200';
    if (isOrange) borderColor = 'hover:border-orange-500';
    if (isInwi) borderColor = 'hover:border-purple-500';
    if (isIam) borderColor = 'hover:border-blue-500';

    if (offer.is_sponsored) {
        borderColor = 'border-yellow-400 ring-1 ring-yellow-400';
    }

    const isPro = offer.target_audience === 'professional';

    return (
        <div className={`group border-2 border-transparent ${borderColor} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-950 relative overflow-hidden`}>
            {/* Badges */}
            <div className="absolute top-0 right-0 flex flex-col items-end">
                <div className={`text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider
                ${isOrange ? 'bg-orange-500' : ''}
                ${isInwi ? 'bg-purple-600' : ''}
                ${isIam ? 'bg-blue-600' : ''}
                ${!isOrange && !isInwi && !isIam ? 'bg-zinc-800' : ''}
            `}>
                    {offer.operator_name}
                </div>
                {offer.highlight_badge && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-md uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> {offer.highlight_badge}
                    </div>
                )}
                {isPro && (
                    <div className="bg-zinc-800 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> PRO
                    </div>
                )}
            </div>

            <div className="flex flex-col h-full mt-4">
                <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-100 pr-8 line-clamp-2 min-h-[3.5rem]">{offer.title}</h3>

                <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{offer.price_dh}</span>
                    <span className="text-sm font-medium text-zinc-500 ml-2">DH {isPro ? 'HT' : ''} / mois</span>
                </div>

                {/* Dynamic Specs Grid based on Category */}
                <div className="grid grid-cols-2 gap-3 mb-8 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50">

                    {offer.category === 'internet' && (
                        <>
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="flex items-center text-green-600 mb-1 gap-1">
                                    <ArrowDown className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Download</span>
                                </div>
                                <span className="font-bold text-lg leading-none">{offer.download_speed} <span className="text-xs font-normal text-zinc-400">Mbps</span></span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center border-l border-zinc-200 dark:border-zinc-800">
                                <div className="flex items-center text-blue-600 mb-1 gap-1">
                                    <Wifi className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Techno</span>
                                </div>
                                <span className="font-bold text-lg leading-none">{offer.technology}</span>
                            </div>
                        </>
                    )}

                    {offer.category === 'mobile' && (
                        <>
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="flex items-center text-green-600 mb-1 gap-1">
                                    <Smartphone className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Data</span>
                                </div>
                                <span className="font-bold text-lg leading-none">{offer.mobile_data_gb} <span className="text-xs font-normal text-zinc-400">Go</span></span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center border-l border-zinc-200 dark:border-zinc-800">
                                <div className="flex items-center text-blue-600 mb-1 gap-1">
                                    <Phone className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Appels</span>
                                </div>
                                <span className="font-bold text-lg leading-none">
                                    {offer.voice_minutes === -1 ? 'Illimité' : `${offer.voice_minutes}h`}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-auto space-y-2">
                    <button
                        onClick={onSelect}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-md transform transition-all group-hover:-translate-y-0.5
                    ${isOrange ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : ''}
                    ${isInwi ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' : ''}
                    ${isIam ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : ''}
                    ${!isOrange && !isInwi && !isIam ? 'bg-zinc-900 hover:bg-zinc-800' : ''}
                `}>
                        {isPro ? 'Demander un devis' : 'Commander'}
                    </button>

                    {/* Compare Button */}
                    {offer.id && (
                        <button
                            onClick={toggleComparison}
                            className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all border-2 flex items-center justify-center gap-2
                                ${isInComparison
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-600 hover:text-blue-600'
                                }
                            `}
                        >
                            {isInComparison ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Ajouté à la comparaison</span>
                                </>
                            ) : (
                                <>
                                    <GitCompare className="w-4 h-4" />
                                    <span>Comparer</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
