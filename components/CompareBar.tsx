"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, GitCompare } from 'lucide-react'
import { event } from '@/lib/analytics'
import { useTranslation } from '@/lib/LocaleContext'

export function CompareBar() {
    const { t, isRtl } = useTranslation()
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
        event({
            action: 'compare_started',
            category: 'engagement',
            label: `${selectedOffers.length} offers`,
            value: selectedOffers.length
        })
        const ids = selectedOffers.join(',')
        router.push(`/compare?ids=${ids}`)
    }

    if (selectedOffers.length === 0) {
        return null
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t-2 border-zinc-200 dark:border-zinc-800 shadow-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className={`flex items-center justify-between gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                            <GitCompare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-zinc-900 dark:text-white">
                                {t('compbar_selected').replace('{count}', selectedOffers.length.toString())}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                {selectedOffers.length < 3 
                                    ? t('compbar_add_more').replace('{count}', (3 - selectedOffers.length).toString())
                                    : t('compbar_max')
                                }
                            </div>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <button
                            onClick={clearAll}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            {t('compbar_clear')}
                        </button>
                        <button
                            onClick={goToCompare}
                            disabled={selectedOffers.length < 2}
                            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}
                        >
                            <GitCompare className="w-5 h-5" />
                            {t('compbar_btn')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
