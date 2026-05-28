'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, MapPin, Phone, User, ChevronRight, Shield, Coins, BellRing, ArrowRight, Timer } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { trackEvent } from '@/lib/analytics'

export function PromoUnlockerForm({ mode = 'b2c' }: { mode?: 'b2c' | 'b2b' }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(899) // 14 mins 59 seconds

  React.useEffect(() => {
     if (timeLeft <= 0) return;
     const interval = setInterval(() => {
         setTimeLeft(prev => prev - 1);
     }, 1000);
     return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
  };

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

      // Attempt to save to Supabase (might fail due to RLS)
      const { error: submitError } = await supabase
        .from('leads')
        .insert([
          {
            user_name: formData.firstName,
            user_phone: formData.phone,
            city: formData.city,
            status: 'new',
            needs_details: {
              interest: formData.need,
              current_bill: formData.currentBill,
              source: `hero_promo_${mode}`
            }
          }
        ])

      if (submitError) {
          console.warn("Supabase insert warning (likely RLS):", submitError.message);
          // We don't throw here to ensure the webhook gets triggered and the user is not blocked!
      }

      // Trigger B2B Notification Pipeline (This is the critical part for business)
      try {
          await fetch('/api/leads/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  first_name: formData.firstName,
                  phone: formData.phone,
                  city: formData.city,
                  needs_details: { interest: formData.need, current_bill: formData.currentBill },
                  source: `hero_promo_${mode}`
              })
          })
      } catch(err) {
          console.error("Webhook trigger failed", err)
      }

      trackEvent('promo_lead_submitted', { interest: formData.need, bill: formData.currentBill, mode: mode })
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
            <h3 className="text-2xl text-green-800 dark:text-green-300 font-black mb-2">
                {mode === 'b2b' ? "Demande de Devis Envoyée !" : "Promos débloquées !"}
            </h3>
            <p className="text-green-700 dark:text-green-400 font-medium text-lg">
                {mode === 'b2b' 
                    ? "Un expert B2B vous contactera sous 2h pour négocier votre flotte." 
                    : "Préparation de vos offres secrètes en cours..."}
            </p>
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
          {mode === 'b2b' ? <User className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
          {mode === 'b2b' ? 'Service Grands Comptes' : 'Offres Cachées Actives'}
      </div>

      <div className="mb-6 mt-2 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">
              {mode === 'b2b' ? "Déléguez la Négociation B2B" : "Test d'éligibilité aux promotions"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 font-medium text-sm sm:text-base">
              {mode === 'b2b' 
                  ? "Indiquez-nous vos besoins professionnels. Nos experts négocient directement avec les opérateurs pour obtenir les meilleurs tarifs flotte et fibre entreprise (-30% en moyenne)." 
                  : "Remplissez ce formulaire pour savoir si votre numéro est éligible aux réductions jusqu'à -50% et voir le classement secret."}
            </p>
        {mode === 'b2c' && (
            <div className="flex flex-col items-center gap-3">
                <div className="inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <p className="text-sm font-medium text-zinc-400">
                    Jusqu'à <strong className="text-blue-400 text-lg">{getSavings()} DH</strong> d'économies par an
                    </p>
                </div>
                {/* Scarcity Timer */}
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold font-mono shadow-sm">
                    <Timer className="w-4 h-4 animate-pulse" />
                    Offre expire dans : {formatTime(timeLeft)}
                </div>
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-8 relative z-10 space-y-5">
        
        {/* Progress Bar (Visual Psychology) */}
        {!success && (
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 mb-6 overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full w-2/3 animate-pulse"></div>
            </div>
        )}

        {/* Success State */}
        {success ? (
          <div className="text-center py-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black mb-2 dark:text-white">
                {mode === 'b2b' ? "Dossier B2B Initié" : "Le classement complet a été débloqué !"}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                {mode === 'b2b' 
                    ? `Notre expert PME/GE a bien reçu votre demande. Il vous contactera d'ici 2h sur le ${formData.phone} pour auditer votre facture.`
                    : `Nos experts ont bien reçu votre demande. Un conseiller vous contactera dans les prochaines heures sur le ${formData.phone} pour vous confirmer votre éligibilité.`
                }
            </p>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 font-bold uppercase tracking-wider">
                {mode === 'b2b' ? (
                    <>
                        ✓ Audit Facture Flotte <br/>
                        ✓ Fibre Dédiée PME <br/>
                        ✓ Tarifs Grossiste
                    </>
                ) : (
                    <>
                        ✓ Éligibilité 4G/5G <br/>
                        ✓ Fibre Optique Zone <br/>
                        ✓ Promotions cachées
                    </>
                )}
            </div>
          </div>
        ) : (
        <>
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
                    <div className="flex-[3]">
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1 ml-1">
                            {mode === 'b2b' ? "Nom de l'Entreprise / Contact" : "Nom Complet"}
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-0 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium transition-colors"
                                placeholder={mode === 'b2b' ? "ex: TechSolutions / Yassine" : "ex: Yassine B."}
                            />
                        </div>
                    </div>
                    <div className="flex-[2]">
                        <label htmlFor="city" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1 ml-1">Ville</label>
                        <div className="relative">
                            <MapPin className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none h-5 w-5 text-zinc-400" />
                            <input
                                type="text"
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="Ville (ex: Casa)"
                                className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-0 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium transition-colors"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1 ml-1">Numéro de téléphone</label>
                    <div className="absolute inset-y-0 left-0 pl-3.5 pt-[14px] pointer-events-none">
                        <Phone className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06 XX XX XX XX (Pour recevoir les offres)"
                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-0 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium transition-colors"
                        required
                    />
                    {mode === 'b2c' && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-tight ml-1 flex gap-1.5 items-start">
                            <Shield className="w-3 h-3 shrink-0 mt-0.5 text-blue-500" />
                            <span>Requis uniquement pour tester l'éligibilité technique de votre ligne avec les opérateurs (Fibre/5G).</span>
                        </p>
                    )}
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-5 py-4 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl transition-all border border-white/10 text-sm font-medium"
                        >
                            Retour
                        </button>
                        <div className="flex-1 relative overflow-hidden rounded-xl">
                            {/* Button Shine Effect */}
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-[shine_2s_infinite]"></div>
                            
                            <button
                                type="submit"
                                disabled={isLoading || !formData.firstName || !formData.phone}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-blue-500/50 transform rounded-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative z-10 text-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Vérification...
                                    </>
                                ) : (
                                    <>
                                        {mode === 'b2b' ? "Demander le devis gratuit" : "Débloquer le comparatif"}
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-center text-zinc-500 mt-2 flex items-center justify-center gap-1 font-medium">
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                        Vos données sont 100% sécurisées.
                    </p>
                </div>
            </div>
        )}
        </>
        )}
      </form>
    </div>
  )
}
