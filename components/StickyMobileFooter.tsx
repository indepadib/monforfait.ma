"use client"

import { useEffect, useState } from 'react'
import { ArrowRight, Gift } from 'lucide-react'
import { useTranslation } from '@/lib/LocaleContext'

export function StickyMobileFooter() {
    const { t, isRtl } = useTranslation()
    const [isVisible, setIsVisible] = useState(false)
    const [isUnlocked, setIsUnlocked] = useState(false)

    useEffect(() => {
        // Check if unlocked
        if (typeof window !== 'undefined') {
            const unlocked = localStorage.getItem('monforfait_unlocked') === 'true'
            setIsUnlocked(unlocked)
            
            // Show footer after scrolling down a bit
            const handleScroll = () => {
                if (window.scrollY > 300) {
                    setIsVisible(true)
                } else {
                    setIsVisible(false)
                }
            }

            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    if (!isVisible || isUnlocked) return null

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        // Focus the phone input if it exists
        setTimeout(() => {
            const phoneInput = document.getElementById('hero-phone-input')
            if (phoneInput) phoneInput.focus()
        }, 500)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 translate-y-0" dir={isRtl ? 'rtl' : 'ltr'}>
            <button
                onClick={scrollToTop}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-between active:scale-[0.98] transition-all ${isRtl ? 'flex-row-reverse' : ''}`}
            >
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                        <Gift className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{t('sticky_btn')}</span>
                </div>
                <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
        </div>
    )
}
