'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, MapPin, Phone, User, ChevronRight, Shield, Coins, BellRing, ArrowRight, Timer } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { trackEvent } from '@/lib/analytics'
import { useTranslation } from '@/lib/LocaleContext'

export function PromoUnlockerForm({ mode = 'b2c' }: { mode?: 'b2c' | 'b2b' }) {
  const router = useRouter()
  const { locale, t, isRtl } = useTranslation()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(899) // 14 mins 59 seconds
  const [consentVoice, setConsentVoice] = useState(false)

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
        throw new Error(t('phone_error_invalid'))
      }

      // Capture UTM fields and lead source
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const utm_source = params.get('utm_source') || (typeof document !== 'undefined' && document.referrer) || 'direct';
      const utm_medium = params.get('utm_medium') || '';
      const utm_campaign = params.get('utm_campaign') || '';
      const lead_source = params.get('utm_source') ? 'paid' : (typeof document !== 'undefined' && document.referrer.includes('google') ? 'google_organic' : 'direct');

      // Attempt to save to Supabase (might fail due to RLS)
      const { data: insertedData, error: submitError } = await supabase
        .from('leads')
        .insert([
          {
            user_name: formData.firstName,
            user_phone: formData.phone,
            city: formData.city,
            status: 'new',
            consent_voice: consentVoice,
            consent_at: consentVoice ? new Date().toISOString() : null,
            needs_details: {
              interest: formData.need,
              current_bill: formData.currentBill,
              source: `hero_promo_${mode}`,
              utm_source,
              utm_medium,
              utm_campaign,
              lead_source
            }
          }
        ])
        .select('id')
        .single()

      if (submitError) {
          console.warn("Supabase insert warning (likely RLS):", submitError.message);
          // We don't throw here to ensure the webhook gets triggered and the user is not blocked!
      }

      const leadId = insertedData?.id || null;

      // Trigger B2B Notification Pipeline (This is the critical part for business)
      try {
          await fetch('/api/leads/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  leadId,
                  first_name: formData.firstName,
                  phone: formData.phone,
                  city: formData.city,
                  needs_details: { 
                    interest: formData.need, 
                    current_bill: formData.currentBill,
                    utm_source,
                    utm_medium,
                    utm_campaign,
                    lead_source
                  },
                  source: `hero_promo_${mode}`
              })
          })
      } catch(err) {
          console.error("Webhook trigger failed", err)
      }

      // Trigger Vapi Voice Queue
      if (consentVoice && leadId) {
          try {
              await fetch('/api/voice/queue', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ leadId })
              })
          } catch(err) {
              console.error("[voice] Queue trigger failed", err)
          }
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
        <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} p-4 opacity-10 pointer-events-none`}>
            <Coins className="w-32 h-32 text-green-500" />
        </div>
        <div className="relative z-10">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            </div>
            <h3 className="text-2xl text-green-800 dark:text-green-300 font-black mb-2">
                {mode === 'b2b' ? t('promo_success_title_b2b') : t('promo_success_title_b2c')}
            </h3>
            <p className="text-green-700 dark:text-green-400 font-medium text-lg">
                {mode === 'b2b' 
                    ? t('promo_success_desc_b2b') 
                    : t('promo_success_desc_b2c')}
            </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-[#111827]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] border border-white/10 w-full mx-auto transform transition-all relative group mt-8 lg:mt-0 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Background glow effect */}
      <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-500/20 transition-colors duration-500 pointer-events-none`}></div>

      {/* FOMO Badge */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 whitespace-nowrap flex items-center gap-2 border border-white/20 z-20">
          {mode === 'b2b' ? <User className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
          {mode === 'b2b' ? t('promo_badge_b2b') : t('promo_badge_b2c')}
      </div>

      <div className="mb-6 mt-2 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">
              {mode === 'b2b' ? t('promo_title_b2b') : t('promo_title_b2c')}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 font-medium text-sm sm:text-base">
              {mode === 'b2b' 
                  ? t('promo_desc_b2b') 
                  : t('promo_desc_b2c')}
            </p>
        {mode === 'b2c' && (
            <div className="flex flex-col items-center gap-3">
                <div className="inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <p className="text-sm font-medium text-zinc-400">
                    {t('promo_savings').replace('{savings}', getSavings().toString())}
                    </p>
                </div>
                {/* Scarcity Timer */}
                <div className={`flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold font-mono shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Timer className="w-4 h-4 animate-pulse" />
                    {t('promo_timer').replace('{time}', formatTime(timeLeft))}
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
                {mode === 'b2b' ? t('promo_success_title_b2b') : t('promo_success_title_b2c')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                {mode === 'b2b' 
                    ? (locale === 'ar' ? `تلقينا طلبكم. سيتصل بكم خبيرنا في غضون ساعتين على الرقم ${formData.phone}` : `Notre expert PME/GE a bien reçu votre demande. Il vous contactera d'ici 2h sur le ${formData.phone} pour auditer votre facture.`)
                    : (locale === 'ar' ? `تلقينا طلبكم. سيتصل بكم أحد مستشارينا في الساعات القادمة على الرقم ${formData.phone}` : `Nos experts ont bien reçu votre demande. Un conseiller vous contactera dans les prochaines heures sur le ${formData.phone} pour vous confirmer votre éligibilité.`)
                }
            </p>
            <div className={`bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 font-bold uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>
                {mode === 'b2b' ? (
                    <>
                        ✓ {t('promo_success_check_b2b_1')} <br/>
                        ✓ {t('promo_success_check_b2b_2')} <br/>
                        ✓ {t('promo_success_check_b2b_3')}
                    </>
                ) : (
                    <>
                        ✓ {t('promo_success_check_b2c_1')} <br/>
                        ✓ {t('promo_success_check_b2c_2')} <br/>
                        ✓ {t('promo_success_check_b2c_3')}
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
                        {t('promo_step1_label1')}
                    </label>
                    <select
                    id="need"
                    value={formData.need}
                    onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-medium cursor-pointer transition-all hover:bg-[#0A0F1C] ${isRtl ? 'text-right' : ''}`}
                    >
                    <option value="fibre">{t('promo_need_fibre')}</option>
                    <option value="mobile">{t('promo_need_mobile')}</option>
                    <option value="adsl">{t('promo_need_adsl')}</option>
                    <option value="box">{t('promo_need_box')}</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="currentBill" className="block text-sm font-bold text-zinc-300 mb-2">
                        {t('promo_step1_label2')}
                    </label>
                    <select
                        id="currentBill"
                        value={formData.currentBill}
                        onChange={(e) => setFormData({ ...formData, currentBill: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-medium text-lg cursor-pointer transition-all hover:bg-[#0A0F1C] ${isRtl ? 'text-right' : ''}`}
                    >
                        <option value="100">{t('promo_bill_less_100')}</option>
                        <option value="150">{t('promo_bill_100_199')}</option>
                        <option value="250">{t('promo_bill_200_299')}</option>
                        <option value="350">{t('promo_bill_more_300')}</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20 ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                    {t('promo_btn_continue')} <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
            </div>
        )}

        {/* Step 2: User Details */}
        {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className={`flex flex-col sm:flex-row gap-3 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                    <div className="flex-[3]">
                        <label className={`block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                            {mode === 'b2b' ? t('promo_step2_name_b2b') : t('promo_step2_name')}
                        </label>
                        <div className="relative">
                            <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400`} />
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                className={`w-full ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-3.5 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-0 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium transition-colors`}
                                placeholder={mode === 'b2b' ? t('promo_step2_name_placeholder_b2b') : t('promo_step2_name_placeholder_b2c')}
                            />
                        </div>
                    </div>
                    <div className="flex-[2]">
                        <label htmlFor="city" className={`block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t('promo_step2_city')}</label>
                        <div className="relative">
                            <MapPin className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none h-5 w-5 text-zinc-400`} />
                            <input
                                type="text"
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder={t('promo_step2_city_placeholder')}
                                className={`w-full ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} py-3.5 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-0 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium transition-colors`}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <label htmlFor="phone" className={`block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t('promo_step2_phone')}</label>
                    <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} pt-[14px] pointer-events-none`}>
                        <Phone className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t('promo_step2_phone_placeholder')}
                        className={`w-full ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} py-3.5 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-0 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium transition-colors`}
                        required
                    />
                    {mode === 'b2c' && (
                        <p className={`text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-tight ${isRtl ? 'mr-1 flex-row-reverse text-right' : 'ml-1'} flex gap-1.5 items-start`}>
                            <Shield className="w-3 h-3 shrink-0 mt-0.5 text-blue-500" />
                            <span>{t('promo_step2_phone_desc')}</span>
                        </p>
                    )}
                </div>

            {/* Consent checkbox for voice qualification */}
            <div className="voice-consent-block p-4 bg-zinc-900/50 border border-white/10 rounded-xl mt-4 text-xs">
                <label className={`flex items-start gap-2.5 cursor-pointer text-zinc-400 font-medium ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <input
                        type="checkbox"
                        checked={consentVoice}
                        onChange={(e) => setConsentVoice(e.target.checked)}
                        required
                        className="mt-1 w-4 h-4 shrink-0 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900 focus:ring-2"
                    />
                    <span className="leading-relaxed">
                        {t('consent_checkbox_label')}
                        <span className="text-red-500 ml-1">*</span>
                    </span>
                </label>
            </div>

            {error && (
              <div className={`p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium flex items-center gap-2 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
                    <div className={`flex items-center gap-3 w-full ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-5 py-4 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl transition-all border border-white/10 text-sm font-medium"
                        >
                            {t('promo_btn_back')}
                        </button>
                        <div className="flex-1 relative overflow-hidden rounded-xl">
                            {/* Button Shine Effect */}
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-[shine_2s_infinite]"></div>
                            
                            <button
                                type="submit"
                                disabled={isLoading || !formData.firstName || !formData.phone}
                                className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-blue-500/50 transform rounded-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative z-10 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t('promo_btn_submitting')}
                                    </>
                                ) : (
                                    <>
                                        {mode === 'b2b' ? t('promo_btn_submit_b2b') : t('promo_btn_submit_b2c')}
                                        <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <p className={`text-xs text-center text-zinc-500 mt-2 flex items-center justify-center gap-1 font-medium ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                        {t('promo_secure')}
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
