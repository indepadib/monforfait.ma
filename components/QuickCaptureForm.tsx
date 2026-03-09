'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { trackEvent } from '@/lib/analytics'

export function QuickCaptureForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    need: 'fibre',
    phone: '',
  })

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
            user_phone: formData.phone,
            status: 'new',
            needs_details: {
              interest: formData.need,
              source: 'hero_quick_capture'
            }
          }
        ])

      if (submitError) throw submitError

      // Trigger B2B Notification Pipeline
      fetch('/api/leads/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              phone: formData.phone,
              needs_details: { interest: formData.need },
              source: 'hero_quick_capture'
          })
      }).catch(err => console.error("Webhook trigger failed", err))

      trackEvent('quick_lead_submitted', { interest: formData.need })
      setSuccess(true)
      
      // Delay before routing to results so the user can see the success message
      setTimeout(() => {
        router.push(`/offers?type=${formData.need}`)
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-green-800 dark:text-green-300 font-bold mb-1">C'est noté !</h3>
        <p className="text-green-600 dark:text-green-400 text-sm">Nous vous redirigeons vers les meilleures offres...</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 dark:border-zinc-800 text-left max-w-lg mx-auto transform transition-all hover:scale-[1.01]">
      <div className="mb-4">
        <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          ⚡ Je sais déjà ce que je veux
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Laissez votre numéro, on s'occupe de trouver la meilleure offre pour vous.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="need" className="sr-only">Ce que vous cherchez</label>
            <select
              id="need"
              value={formData.need}
              onChange={(e) => setFormData({ ...formData, need: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
            >
              <option value="fibre">Fibre Optique</option>
              <option value="adsl">ADSL</option>
              <option value="mobile">Forfait Mobile</option>
              <option value="box">Box 4G/5G</option>
            </select>
          </div>

          <div className="flex-[2] relative">
            <label htmlFor="phone" className="sr-only">Numéro de téléphone</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="06 XX XX XX XX"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Voir les offres <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
