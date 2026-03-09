'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, X } from 'lucide-react'

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show after scrolling down a bit
    const handleScroll = () => {
      if (window.scrollY > 400 && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    if (typeof window !== 'undefined') {
      // Check if previously dismissed in this session
      const dismissed = sessionStorage.getItem('sticky_cta_dismissed') === 'true'
      setIsDismissed(dismissed)
      
      if (!dismissed) {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isDismissed])

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem('sticky_cta_dismissed', 'true')
  }

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 relative flex items-center gap-4">
        <button 
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded-full p-1 shadow-sm border border-white dark:border-black"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="flex-1">
          <p className="font-bold text-zinc-900 dark:text-white leading-tight text-sm">Trouvez votre offre</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Gratuit et sans engagement</p>
        </div>
        
        <Link 
          href="/quiz"
          className="shrink-0 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all"
        >
          Go !
        </Link>
      </div>
    </div>
  )
}
