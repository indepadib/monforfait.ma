'use client'

import { useState, useEffect } from 'react'
import { BellRing, Zap, TrendingDown, Star } from 'lucide-react'

// Simulated live feed of conversions to create FOMO (Fear Of Missing Out)
// These are typical examples of what users achieve on the platform
const LIVE_EVENTS = [
    {
        id: 1,
        name: 'Amine',
        city: 'Rabat',
        action: 'vient d\'économiser',
        value: '1 200 DH/an',
        icon: TrendingDown,
        color: 'text-green-500',
        bg: 'bg-green-500/10'
    },
    {
        id: 2,
        name: 'Sarah',
        city: 'Casablanca',
        action: 'a trouvé une offre Fibre à',
        value: '249 DH/mois',
        icon: Zap,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10'
    },
    {
        id: 3,
        name: 'Youssef',
        city: 'Marrakech',
        action: 'a reçu',
        value: '3 devis Pro en 5min',
        icon: BellRing,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        id: 4,
        name: 'Fatima',
        city: 'Tanger',
        action: 'note le service',
        value: '5/5 étoiles',
        icon: Star,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    }
]

export function LiveFOMOTicker() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Rotate events every 4.5 seconds
        const timer = setInterval(() => {
            setIsVisible(false) // Trigger fade out
            
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length)
                setIsVisible(true) // Trigger fade in
            }, 500) // Wait for fade out to complete before changing data

        }, 4500)

        return () => clearInterval(timer)
    }, [])

    const event = LIVE_EVENTS[currentIndex]
    const Icon = event.icon

    return (
        <div className="flex items-center justify-center lg:justify-start w-full transition-all duration-500 ease-in-out">
            <div 
                className={`
                    inline-flex items-center gap-3 px-4 py-2 rounded-full 
                    bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl
                    transition-all duration-500 transform
                    ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
                `}
            >
                {/* Pulsing indicator */}
                <div className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${event.bg.replace('/10', '')} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${event.bg.replace('/10', '')}`}></span>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="font-bold text-white">{event.name}</span>
                    <span className="hidden sm:inline text-zinc-500">de {event.city}</span>
                    <span>{event.action}</span>
                    <span className={`font-bold ${event.color}`}>{event.value}</span>
                </div>
            </div>
        </div>
    )
}
