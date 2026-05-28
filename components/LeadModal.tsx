"use client"

import * as React from 'react'
import { useState } from 'react'
import { X, Loader2, CheckCircle, Flame, ShieldCheck, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { OfferProps } from './OfferCard'
import { event as trackEvent } from '@/lib/analytics'
import { CONFIG } from '@/lib/config'

export function LeadModal({ offer, onClose }: { offer: OfferProps, onClose: () => void }) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [reason, setReason] = useState('')
    const [timing, setTiming] = useState('asap')
    const [preferredOperator, setPreferredOperator] = useState(offer.operator_name || '')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const isPro = offer.target_audience === 'professional'

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: leadData, error: leadError } = await supabase.from('leads').insert({
                user_name: name,
                user_email: email || `${phone}@lead.local`,
                user_phone: phone,
                city: city,
                address: address,
                selected_plan_id: offer.id,
                status: isPro ? 'new_pro' : 'new_qualified',
                is_pro: isPro,
                needs_details: {
                    source: 'web_v4_premium',
                    installation_timing: timing,
                    preferred_operator: preferredOperator,
                    reason: reason,
                    captured_at: new Date().toISOString()
                }
            }).select('id').single()

            if (leadData) {
                // Secondary notification pipeline
                await fetch('/api/leads/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadId: leadData.id,
                        phone: phone,
                        user_name: name,
                        city: city,
                        address: address,
                        is_pro: isPro,
                        source: 'LeadModal_V3',
                        needs_details: {
                            offer: offer.title,
                            operator: offer.operator_name,
                            city,
                            address,
                            reason,
                            installation_timing: timing,
                            preferred_operator: preferredOperator
                        }
                    })
                })
            }
        } catch (err) {
            console.error("Lead save failed", err)
        }

        // WhatsApp Redirect Message
        const timingLabel = timing === 'asap' ? 'Dès que possible' : timing === '1_month' ? 'D\'ici 1 mois' : 'En comparaison'
        let message = `Bonjour, je souhaite finaliser ma demande pour l'offre ${offer.operator_name} ${offer.title}.\n\n`
        message += `📍 Ville: ${city}\n`
        message += `🏠 Adresse: ${address}\n`
        message += `🔎 Motif: ${reason}\n`
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
            const whatsappUrl = `https://wa.me/${CONFIG.SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, '_blank')
            setLoading(false)
            setSent(true)
            setTimeout(onClose, 2000)
        }, 800)
    }

    if (sent) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md transition-all duration-300">
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-sm p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] text-center animate-in zoom-in-95 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
                    <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-500 transform rotate-12">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black mb-3 dark:text-white tracking-tight italic">ENVOYÉ ! ⚡</h3>
                    <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                        Un expert MonForfait.ma va analyser votre adresse et vous contacter sous <span className="text-green-600 dark:text-green-400 font-black">2h ouvrées</span>.
                    </p>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl text-[11px] text-zinc-400 font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
                        🚀 Installation prioritaire activée
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-lg p-0 md:p-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] relative animate-in slide-in-from-bottom-4 duration-500 border border-zinc-200 dark:border-zinc-800 max-h-[92vh] overflow-y-auto overflow-x-hidden scrollbar-hide">
                
                <div className="h-32 bg-zinc-900 dark:bg-zinc-950 px-8 flex items-end pb-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,_#3b82f6_0%,_transparent_50%)]"></div>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 backdrop-blur-md border border-blue-500/30">
                            <Zap className="w-3 h-3" /> Lead Intelligence Platform
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                            {isPro ? 'Finaliser Demande PRO' : 'Demande Prioritaire'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="absolute top-6 right-8 text-zinc-400 hover:text-white transition-all bg-white/5 p-2 rounded-full backdrop-blur-xl border border-white/5 hover:scale-110 active:scale-90">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="bg-red-500/5 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-black mb-8 flex items-center gap-4 border border-red-500/20 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative">
                            <div className="w-4 h-4 bg-red-600 rounded-full animate-ping absolute opacity-20"></div>
                            <Flame className="w-5 h-5 relative z-10 animate-pulse" />
                        </div>
                        <span className="flex-1 italic tracking-tight uppercase leading-snug">
                            Attention: Les techniciens fibre sont sur-sollicités dans votre quartier. Réservez votre raccordement maintenant.
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center p-2 shadow-inner border border-zinc-200 dark:border-zinc-700">
                                <img src={`https://ui-avatars.com/api/?name=${offer.operator_name}&background=random&color=fff&bold=true`} alt={offer.operator_name} className="w-full h-full object-contain rounded-lg shadow-sm" />
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-none mb-1">Offre sélectionnée</div>
                                <div className="text-lg font-black text-zinc-900 dark:text-white leading-tight">{offer.title}</div>
                                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-blue-600">
                                    <ShieldCheck className="w-3 h-3" /> Vérifié MonForfait
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-900 dark:bg-white px-6 py-3 rounded-2xl text-center shadow-lg transform -rotate-2">
                            <div className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-black leading-none mb-0.5 tracking-tighter">Prix Exclusif</div>
                            <div className="font-black text-white dark:text-black text-2xl leading-none">{offer.price_dh} <span className="text-xs">DH</span></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Identité Client</label>
                                <input
                                    required
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-300 font-bold text-sm"
                                    placeholder={isPro ? "Raison sociale" : "Prénom et Nom"}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Numéro Mobile</label>
                                <input
                                    required
                                    type="tel"
                                    value={phone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-300 font-bold text-sm"
                                    placeholder="06 -- -- -- --"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Ville</label>
                                <input
                                    required
                                    value={city}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-300 font-bold text-sm"
                                    placeholder="Ex: Casablanca"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Adresse installation</label>
                                <input
                                    required
                                    value={address}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-300 font-bold text-sm"
                                    placeholder="N°, Rue, Appt..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Motif de raccordement</label>
                            <select
                                required
                                value={reason}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReason(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold appearance-none cursor-pointer text-sm"
                            >
                                <option value="">Choisir une option...</option>
                                <option value="moving">Déménagement (Accès urgent)</option>
                                <option value="switching">Changement (Inwi/Orange/IAM)</option>
                                <option value="speed">Booster ma vitesse actuelle</option>
                                <option value="first_time">Premier raccordement Fibre</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Niveau d'urgence</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'asap', label: 'Urgent', icon: '🔥', detail: 'Contact Immédiat' },
                                    { id: '1_month', label: '< 1 mois', icon: '📅', detail: 'Planification' },
                                    { id: 'compare', label: 'Étude', icon: '🔍', detail: 'Prix Uniquement' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setTiming(opt.id)}
                                        className={`p-4 rounded-[1.25rem] border-2 transition-all flex flex-col items-center gap-1 hover:scale-105 active:scale-95
                                            ${timing === opt.id
                                                ? 'border-zinc-900 bg-zinc-950 text-white shadow-xl dark:border-white dark:bg-white dark:text-black scale-105'
                                                : 'border-zinc-100 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                    >
                                        <span className="text-xl mb-1">{opt.icon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{opt.label}</span>
                                        <span className={`text-[8px] font-medium opacity-50 ${timing === opt.id ? 'opacity-70' : ''}`}>{opt.detail}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 relative">
                            <button 
                                type="submit"
                                disabled={loading} 
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[1.5rem] flex flex-col items-center justify-center gap-1 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_24px_48px_-12px_rgba(37,99,235,0.5)] active:translate-y-1 transition-all disabled:opacity-50 group"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        <span className="text-sm uppercase tracking-widest">Génération du Dossier...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-lg uppercase tracking-tight italic">CONFIRMER MON RACCORDEMENT 🚀</span>
                                        <span className="text-[10px] font-medium opacity-70 tracking-widest uppercase mb-0.5 group-hover:opacity-100 transition-opacity">Expertise et devis 100% gratuits</span>
                                    </>
                                )}
                            </button>
                            <div className="absolute -bottom-10 left-0 w-full text-center">
                                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest px-4 leading-relaxed">
                                    🔒 Cryptage SSL 256-bit — Vos données sont sécurisées
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="p-8 pb-12"></div>
            </div>
        </div>
    )
}
