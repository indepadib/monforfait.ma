"use client"

import { useState, useEffect } from 'react'
import { X, Gift, Clock } from 'lucide-react'

export function ExitIntentPopup() {
    const [showPopup, setShowPopup] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        let hasShown = sessionStorage.getItem('exit_popup_shown')

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) {
                setShowPopup(true)
                sessionStorage.setItem('exit_popup_shown', 'true')
            }
        }

        document.addEventListener('mouseleave', handleMouseLeave)

        return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        // Save email for retargeting
        // Could send to email marketing service here
        console.log('Exit intent email captured:', email)

        // Download guide (dummy action)
        alert('Guide envoyé à ' + email)
        setShowPopup(false)
    }

    if (!showPopup) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 border-2 border-yellow-400">
                <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                        <Gift className="w-10 h-10" />
                    </div>

                    <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
                        ⏰ Attendez !
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Téléchargez notre <b>guide gratuit</b> :<br />
                        "Comment choisir la meilleure offre internet au Maroc"
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Votre email"
                            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all font-medium"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            Télécharger le guide gratuit
                        </button>
                    </form>

                    <p className="text-xs text-zinc-400 mt-4">
                        PDF de 12 pages • 100% gratuit • Sans engagement
                    </p>
                </div>
            </div>
        </div>
    )
}
