"use client"

import { useState, useEffect } from 'react'
import { X, Gift, Send, Loader2 } from 'lucide-react'

export function ExitIntentPopup() {
    const [showPopup, setShowPopup] = useState(false)
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('') // Added phone for B2B value

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const hasShown = localStorage.getItem('exit_popup_shown')

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) {
                setShowPopup(true)
                localStorage.setItem('exit_popup_shown', 'true')
            }
        }

        // Wait 5 seconds before enabling to avoid immediate triggers
        const timer = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave)
        }, 5000)

        return () => {
            clearTimeout(timer)
            document.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Send the guide via email (original logic)
            fetch('/api/send-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            }).catch(console.error)

            // 2. Trigger B2B Notification Pipeline with the new lead
            if (phone) {
                fetch('/api/leads/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: phone,
                        needs_details: { email: email, interest: 'free_guide' },
                        source: 'exit_intent_popup'
                    })
                }).catch(console.error)
            }

            setSuccess(true)
            setTimeout(() => {
                setShowPopup(false)
            }, 4000)
        } catch (error) {
            console.error('Failed to process exit lead', error)
        } finally {
            setLoading(false)
        }
    }

    if (!showPopup) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 border-2 border-yellow-400">
                <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    aria-label="Fermer"
                >
                    <X className="w-6 h-6" />
                </button>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 mx-auto">
                            <Send className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
                            Guide envoyé !
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Vérifiez votre boîte mail ({email}). Le guide vous a été envoyé.
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                            <Gift className="w-10 h-10" />
                        </div>

                        <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
                            🎁 Ne partez pas les mains vides !
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
                            Téléchargez notre <b>guide exclusif gratuit</b> :<br />
                            "Les 5 secrets pour payer son forfait 2x moins cher"
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Votre adresse email"
                                className="w-full px-4 py-3 text-sm rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all font-medium"
                            />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="Votre numéro (ex: 06 00 00 00 00)"
                                className="w-full px-4 py-3 text-sm rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={loading || !email || !phone}
                                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Recevoir mon guide gratuit'}
                            </button>
                        </form>

                        <p className="text-[10px] text-zinc-400 mt-4 uppercase tracking-wider font-bold">
                            PDF de 12 pages • 100% gratuit • Désinscription à tout moment
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
