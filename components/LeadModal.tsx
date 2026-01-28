"use client"

import React, { useState } from 'react'
import { X, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { OfferProps } from './OfferCard'
import { event as trackEvent } from '@/lib/analytics'

export function LeadModal({ offer, onClose }: { offer: OfferProps, onClose: () => void }) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [email, setEmail] = useState('') // New for Pros
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const isPro = offer.target_audience === 'professional'

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            await supabase.from('leads').insert({
                user_phone: phone,
                city: city,
                selected_plan_id: offer.id,
                status: isPro ? 'new_pro' : 'new', // Tag high value leads
                is_pro: isPro,
                needs_details: {
                    name,
                    email,
                    source: 'web_v2'
                }
            })
        } catch (err) {
            console.error("Lead save failed", err)
        }

        // WhatsApp Redirect Logic
        let message = `Bonjour, je suis intéressé par l'offre ${offer.operator_name} ${offer.title}.`
        if (isPro) {
            message += ` C'est pour une entreprise à ${city}.`
        } else {
            message += ` Je suis à ${city}.`
        }

        // Track Event
        trackEvent({
            action: 'lead_submitted_whatsapp',
            category: 'lead',
            label: `${offer.operator_name} - ${offer.title}`,
            value: offer.price_dh
        })

        // Simulate "sending" state before retracting to make it feel robust
        setTimeout(() => {
            const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, '_blank')
            setLoading(false)
            setSent(true)
            setTimeout(onClose, 2000)
        }, 800)
    }

    if (sent) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Redirection...</h3>
                    <p className="text-zinc-500">Ouverture de WhatsApp pour finaliser avec un agent.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
                <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
                    {isPro ? 'Devis Entreprise' : 'Finaliser la demande'}
                </h3>
                <p className="text-zinc-500 mb-6 font-medium">
                    {isPro ? 'Un expert B2B vous répondra en priorité.' : `Un conseiller ${offer.operator_name} vous rappellera.`}
                </p>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl mb-6 flex items-center gap-4 border border-zinc-100 dark:border-zinc-700/50">
                    <div>
                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Offre sélectionnée</div>
                        <div className="font-bold text-lg leading-tight">{offer.title}</div>
                    </div>
                    <div className="ml-auto font-bold text-blue-600 text-xl">{offer.price_dh} <span className="text-sm text-zinc-400">DH</span></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Nom {isPro ? 'de l\'entreprise' : 'complet'}</label>
                        <input
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 font-medium"
                            placeholder={isPro ? "Tech Solutions SARL" : "Votre nom"}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Téléphone</label>
                            <input
                                required
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 font-medium"
                                placeholder="06..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Ville</label>
                            <input
                                required
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 font-medium"
                                placeholder="Casa"
                            />
                        </div>
                    </div>

                    {isPro && (
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Email Pro</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 font-medium"
                                placeholder="contact@entreprise.ma"
                            />
                        </div>
                    )}

                    <button disabled={loading} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl mt-2 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transform active:scale-95 transition-all">
                        {loading ? <Loader2 className="animate-spin" /> : 'Recevoir l\'offre sur WhatsApp'}
                    </button>
                </form>
            </div>
        </div>
    )
}
