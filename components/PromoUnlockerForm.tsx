'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BellRing, Loader2, Phone, Coins, User, MapPin, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { trackEvent } from '@/lib/analytics'

export function PromoUnlockerForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    need: 'fibre',
    currentBill: '200',
    firstName: '',
    city: 'Casablanca',
    phone: '',
  })

  // Simulated dynamic savings calculation
  const getSavings = () => {
      const bill = parseInt(formData.currentBill);
      if (isNaN(bill)) return 1140; // Default
      return Math.round((bill * 0.4) * 12); // Assuming 40% savings per year
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!formData.phone || formData.phone.length < 9) {
        throw new Error('Veuillez entrer un numéro de téléphone valide')
      }

      const { error: submitError } = await supabase
        .from('leads')
        .insert([
          {
            first_name: formData.firstName,
            phone: formData.phone,
            status: 'new',
            needs_details: {
              interest: formData.need,
              current_bill: formData.currentBill,
              city: formData.city,
              source: 'hero_promo_unlocker'
            }
          }
        ])

      if (submitError) throw submitError

      // Trigger B2B Notification Pipeline
      fetch('/api/leads/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              first_name: formData.firstName,
              phone: formData.phone,
              city: formData.city,
              needs_details: { interest: formData.need, current_bill: formData.currentBill },
              source: 'hero_promo_unlocker'
          })
      }).catch(err => console.error("Webhook trigger failed", err))

      trackEvent('promo_lead_submitted', { interest: formData.need, bill: formData.currentBill })
      setSuccess(true)
      
      // Delay before routing to results so the user can see the success message
      setTimeout(() => {
        router.push(`/offers?type=${formData.need}&unlocked=true`)
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-300 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Coins className="w-32 h-32 text-green-500" />
        </div>
        <div className="relative z-10">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            </div>
            <h3 className="text-2xl text-green-800 dark:text-green-300 font-black mb-2">Promos débloquées !</h3>
            <p className="text-green-700 dark:text-green-400 font-medium text-lg">Préparation de vos offres secrètes en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] border border-white/10 text-left w-full mx-auto transform transition-all relative group mt-8 lg:mt-0">
      
      {/* Background glow effect relative to form (Removed overflow-hidden from parent so badge shows) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-500/20 transition-colors duration-500 pointer-events-none"></div>

      {/* FOMO Badge */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 whitespace-nowrap flex items-center gap-2 border border-white/20 z-20">
          <BellRing className="w-4 h-4" /> Offres Cachées Actives
      </div>

      <div className="mb-6 mt-2 text-center">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
          Calculez vos économies
        </h3>
        <div className="inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <p className="text-sm font-medium text-zinc-400">
            Jusqu'à <strong className="text-blue-400 text-lg">{getSavings()} DH</strong> d'économies par an
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        
        {/* Step 1: Services & Current Bill */}
        {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                    <label htmlFor="need" className="block text-sm font-bold text-zinc-300 mb-2">
                        1. Que recherchez-vous ?
                    </label>
                    <select
                    id="need"
                    value={formData.need}
                    onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-medium cursor-pointer transition-all hover:bg-[#0A0F1C]"
                    >
                    <option value="fibre">Internet Fibre Optique</option>
                    <option value="mobile">Forfait Mobile</option>
                    <option value="adsl">Internet ADSL</option>
                    <option value="box">Box 4G/5G</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="currentBill" className="block text-sm font-bold text-zinc-300 mb-2">
                        2. Combien payez-vous actuellement ?
                    </label>
                    <select
                        id="currentBill"
                        value={formData.currentBill}
                        onChange={(e) => setFormData({ ...formData, currentBill: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-medium text-lg cursor-pointer transition-all hover:bg-[#0A0F1C]"
                    >
                        <option value="100">Moins de 100 DH / mois</option>
                        <option value="150">Entre 100 et 199 DH / mois</option>
                        <option value="250">Entre 200 et 299 DH / mois</option>
                        <option value="350">Plus de 300 DH / mois</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                    Continuer <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        )}

        {/* Step 2: User Details */}
        {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <label htmlFor="firstName" className="sr-only">Prénom</label>
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="Votre Prénom"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-medium placeholder:font-normal transition-all hover:bg-[#0A0F1C] placeholder:text-zinc-600"
                            required
                        />
                    </div>
                    <div className="flex-1 relative">
                        <label htmlFor="city" className="sr-only">Ville</label>
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Ville (ex: Casa)"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-medium placeholder:font-normal transition-all hover:bg-[#0A0F1C] placeholder:text-zinc-600"
                            required
                        />
                    </div>
                </div>

                <div className="relative">
                    <label htmlFor="phone" className="sr-only">Numéro de téléphone</label>
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06 XX XX XX XX (Pour recevoir les offres)"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-bold placeholder:font-normal transition-all hover:bg-[#0A0F1C] placeholder:text-zinc-600"
                        required
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="p-4 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl transition-all border border-white/10"
                    >
                        Retour
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !formData.phone || !formData.firstName}
                        className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-black text-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 border border-white/10"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                            Débloquer mes promos
                            </>
                        )}
                    </button>
                </div>
                <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-4 flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Connexion chiffrée & Données sécurisées
                </p>
            </div>
        )}
      </form>
    </div>
  )
}
