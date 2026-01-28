"use client"

import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'

export function CookieConsent() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('monforfait_cookie_consent')
        if (!consent) {
            // Delay slightly to not annoy immediately
            setTimeout(() => setShow(true), 1000)
        }
    }, [])

    function accept() {
        localStorage.setItem('monforfait_cookie_consent', 'accepted')
        setShow(false)
    }

    if (!show) return null

    return (
        <div className="fixed bottom-20 md:bottom-24 left-4 right-4 md:left-auto md:right-4 max-w-sm z-40 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative">
                <button
                    onClick={() => setShow(false)}
                    className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                        <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Cookies 🍪</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                            Nous utilisons des cookies pour analyser le trafic et personnaliser votre expérience.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={accept}
                                className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Accepter
                            </button>
                            <button
                                onClick={() => setShow(false)}
                                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm font-bold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Refuser
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
