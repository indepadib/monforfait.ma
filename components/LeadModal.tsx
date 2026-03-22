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
    const [timing, setTiming] = useState('asap')
    const [preferredOperator, setPreferredOperator] = useState(offer.operator_name || '')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const isPro = offer.target_audience === 'professional'

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            await supabase.from('leads').insert({
                user_name: name,
                user_email: email || `${phone}@lead.local`,
                user_phone: phone,
                city: city,
                selected_plan_id: offer.id,
                status: isPro ? 'new_pro' : 'new_qualified',
                is_pro: isPro,
                needs_details: {
                    source: 'web_v2',
                    installation_timing: timing,
                    preferred_operator: preferredOperator,
                    captured_at: new Date().toISOString()
                }
            })
        } catch (err) {
            console.error("Lead save failed", err)
        }

        // WhatsApp Redirect Message
        const timingLabel = timing === 'asap' ? 'Dès que possible' : timing === '1_month' ? 'D\'ici 1 mois' : 'En comparaison'
        let message = `Bonjour, je souhaite finaliser ma demande pour l'offre ${offer.operator_name} ${offer.title}.\n\n`
        message += `📍 Ville: ${city}\n`
        message += `⏳ Installation: ${timingLabel}\n`
        if (preferredOperator && preferredOperator !== offer.operator_name) {
            message += `💡 Préférence alternative: ${preferredOperator}`
        }

        // Track Event
        trackEvent({
            action: 'lead_submitted_intent',
            category: 'lead',
            label: `${offer.operator_name} - ${offer.title} (${timing})`,
            value: offer.price_dh
        })

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
                    <h3 className="text-xl font-bold mb-2">Demande enregistrée</h3>
                    <p className="text-zinc-500">Ouverture de WhatsApp pour finaliser avec un conseiller.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-black dark:hover:text-white transition-colors z-10">
                    <X className="w-6 h-6" />
                </button>

                <h3 className="text-2xl md:text-3xl font-black mb-2 text-zinc-900 dark:text-white leading-tight">
                    {isPro ? 'Finaliser votre demande Pro' : 'Finaliser votre demande fibre'}
                </h3>
                <p className="text-zinc-500 mb-6 font-medium text-sm md:text-base">
                    Un conseiller spécialisé vous contactera pour valider l'éligibilité et l'installation.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-6 flex items-center gap-4 border border-blue-100 dark:border-blue-800/50">
                    <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                         <img src={`https://ui-avatars.com/api/?name=${offer.operator_name}&background=random&color=fff&bold=true`} alt={offer.operator_name} className="w-8 h-8 rounded" />
                    </div>
                    <div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-black tracking-widest">Offre sélectionnée</div>
                        <div className="font-bold text-base leading-tight dark:text-white">{offer.operator_name} {offer.title}</div>
                    </div>
                    <div className="ml-auto font-black text-zinc-900 dark:text-white text-xl">{offer.price_dh} <span className="text-xs text-zinc-400">DH</span></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider ml-1">Nom complet</label>
                            <input
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 font-bold"
                                placeholder={isPro ? "Nom de l'entreprise" : "Ex: Ahmed Alaoui"}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider ml-1">Téléphone</label>
                            <input
                                required
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 font-bold"
                                placeholder="06 00 00 00 00"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider ml-1">Ville</label>
                        <input
                            required
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 font-bold"
                            placeholder="Ex: Casablanca, Rabat..."
                        />
                    </div>

                    {/* NEW: Intent - Timing */}
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider ml-1">Délai d'installation souhaité</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'asap', label: 'Immédiat', icon: '🔥' },
                                { id: '1_month', label: '< 1 mois', icon: '📅' },
                                { id: 'compare', label: 'Prix Only', icon: '🔍' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setTiming(opt.id)}
                                    className={`py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1
                                        ${timing === opt.id 
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold' 
                                            : 'border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'}`}
                                >
                                    <span className="text-xl">{opt.icon}</span>
                                    <span className="text-[10px] uppercase font-black">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* NEW: Intent - Preferred Operator */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider ml-1">Opérateur préféré (Optionnel)</label>
                        <select
                            value={preferredOperator}
                            onChange={e => setPreferredOperator(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                        >
                            <option value="">Aucune préférence</option>
                            <option value="Orange">Orange</option>
                            <option value="IAM">Maroc Telecom</option>
                            <option value="inwi">inwi</option>
                        </select>
                    </div>

                    {isPro && (
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-zinc-500 uppercase tracking-wider ml-1">Email Pro</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 font-bold"
                                placeholder="contact@entreprise.ma"
                            />
                        </div>
                    )}

                    <div className="pt-2">
                        <button disabled={loading} className="w-full py-4 bg-zinc-900 dark:bg-white dark:text-black text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" /> : 'Finaliser ma demande'}
                        </button>
                        <p className="text-[10px] text-center text-zinc-400 mt-3 px-4">
                            En envoyant cette demande, vous acceptez d'être recontacté par nos équipes ou nos opérateurs partenaires pour finaliser votre installation.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
