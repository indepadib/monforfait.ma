"use client"

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { OfferCard, OfferProps } from '@/components/OfferCard'

export function RecentlyViewed() {
    const [offers, setOffers] = useState<OfferProps[]>([])

    useEffect(() => {
        const saved = localStorage.getItem('recently_viewed_offers')
        if (saved) {
            try {
                // Parse and dedup by ID
                const parsed: OfferProps[] = JSON.parse(saved)
                const unique = parsed.filter((o, index, self) =>
                    index === self.findIndex((t) => t.id === o.id)
                ).slice(0, 4) // Limit to 4

                setOffers(unique)
            } catch (e) {
                console.error("Failed to parse recently viewed offers", e)
            }
        }
    }, [])

    if (offers.length === 0) return null

    return (
        <div className="py-12 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-2 mb-6 text-zinc-500">
                    <Clock className="w-5 h-5" />
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        Vu récemment
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {offers.map(offer => (
                        <div key={offer.id} className="transform scale-90 origin-top-left opacity-80 hover:scale-100 hover:opacity-100 transition-all">
                            <OfferCard offer={offer} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
