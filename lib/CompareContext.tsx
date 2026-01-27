"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type CompareContextType = {
    selectedOffers: string[]
    addOffer: (id: string) => void
    removeOffer: (id: string) => void
    clearAll: () => void
    isSelected: (id: string) => boolean
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
    const [selectedOffers, setSelectedOffers] = useState<string[]>([])

    useEffect(() => {
        const saved = localStorage.getItem('compare_offers')
        if (saved) {
            setSelectedOffers(JSON.parse(saved))
        }
    }, [])

    function addOffer(id: string) {
        if (selectedOffers.length >= 3) {
            alert('Maximum 3 offres pour la comparaison')
            return
        }
        const updated = [...selectedOffers, id]
        setSelectedOffers(updated)
        localStorage.setItem('compare_offers', JSON.stringify(updated))
    }

    function removeOffer(id: string) {
        const updated = selectedOffers.filter(offerId => offerId !== id)
        setSelectedOffers(updated)
        localStorage.setItem('compare_offers', JSON.stringify(updated))
    }

    function clearAll() {
        setSelectedOffers([])
        localStorage.removeItem('compare_offers')
    }

    function isSelected(id: string) {
        return selectedOffers.includes(id)
    }

    return (
        <CompareContext.Provider value={{ selectedOffers, addOffer, removeOffer, clearAll, isSelected }}>
            {children}
        </CompareContext.Provider>
    )
}

export function useCompare() {
    const context = useContext(CompareContext)
    if (!context) {
        throw new Error('useCompare must be used within CompareProvider')
    }
    return context
}
