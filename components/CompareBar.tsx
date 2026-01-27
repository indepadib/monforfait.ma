"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, GitCompare } from 'lucide-react'

export function CompareBar() {
    const router = useRouter()
    const [selectedOffers, setSelectedOffers] = useState<string[]>([])

    useEffect(() => {
        const saved = localStorage.getItem('compare_offers')
        if (saved) {
            setSelectedOffers(JSON.parse(saved))
        }

        // Listen for storage changes
        const handleStorage = () => {
            const saved = localStorage.getItem('compare_offers')
            if (saved) {
                setSelectedOffers(JSON.parse(saved))
            } else {
                setSelectedOffers([])
            }
        }

        window.addEventListener('storage', handleStorage)
        window.addEventListener('compare-updated', handleStorage)
        return () => {
            window.removeEventListener('storage', handleStorage)
            window.removeEventListener('compare-updated', handleStorage)
        }
    }, [])

    function removeOffer(id: string) {
        const updated = selectedOffers.filter(offerId => offerId !== id)
        setSelectedOffers(updated)
        localStorage.setItem('compare_offers', JSON.stringify(updated))
        window.dispatchEvent(new Event('compare-updated'))
    }

    function clearAll() {
        setSelectedOffers([])
        localStorage.removeItem('compare_offers')
        window.dispatchEvent(new Event('compare-updated'))
    }

    function goToCompare() {
        const ids = selectedOffers.join(',')
        router.push(`/compare?ids=${ids}`)
    }

    if (selectedOffers.length === 0) {
        return null
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <GitCompare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-zinc-900 dark:text-white">
                                {selectedOffers.length} offre{selectedOffers.length > 1 ? 's' : ''} sélectionnée{selectedOffers.length > 1 ? 's' : ''}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                {selectedOffers.length < 3 ? `Ajoutez jusqu'à ${3 - selectedOffers.length} offre${3 - selectedOffers.length > 1 ? 's' : ''} supplémentaire${3 - selectedOffers.length > 1 ? 's' : ''}` : 'Maximum atteint'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearAll}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            Tout effacer
                        </button>
                        <button
                            onClick={goToCompare}
                            disabled={selectedOffers.length < 2}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <GitCompare className="w-5 h-5" />
                            Comparer maintenant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
