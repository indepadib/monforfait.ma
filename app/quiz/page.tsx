"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Wifi, Smartphone, Users, Zap, DollarSign, TrendingUp, MapPin, User, Mail, Phone, Home, Lock, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Navigation } from '@/components/Navigation'
import { event as trackEvent } from '@/lib/analytics'

type QuizAnswers = {
    category?: 'internet' | 'mobile' | 'both'
    userType?: 'solo' | 'family' | 'small_office' | 'enterprise'
    priority?: 'cheapest' | 'fastest' | 'best_value'
    city?: string
}

type LeadData = {
    name: string
    phone: string
    email: string
    address: string
}

const QUESTIONS = [
    {
        id: 'category',
        question: 'De quoi avez-vous besoin ?',
        options: [
            { value: 'internet', label: 'Internet (Fibre/Box)', icon: Wifi, desc: 'Pour la maison ou le bureau' },
            { value: 'mobile', label: 'Forfait Mobile', icon: Smartphone, desc: 'Appels, SMS, Data' },
            { value: 'both', label: 'Les deux', icon: TrendingUp, desc: 'Pack complet' }
        ]
    },
    {
        id: 'userType',
        question: 'Qui va utiliser le service ?',
        options: [
            { value: 'solo', label: 'Juste moi', icon: Users, desc: '1 personne' },
            { value: 'family', label: 'Ma famille', icon: Users, desc: '2-5 personnes' },
            { value: 'small_office', label: 'Petit bureau', icon: Users, desc: '5-20 employés' },
            { value: 'enterprise', label: 'Entreprise', icon: Users, desc: '+20 employés' }
        ]
    },
    {
        id: 'priority',
        question: 'Quelle est votre priorité ?',
        options: [
            { value: 'cheapest', label: 'Le moins cher', icon: DollarSign, desc: 'Budget serré' },
            { value: 'fastest', label: 'Le plus rapide', icon: Zap, desc: 'Performance max' },
            { value: 'best_value', label: 'Meilleur rapport qualité/prix', icon: TrendingUp, desc: 'Équilibre' }
        ]
    }
]

export default function QuizPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<QuizAnswers>({})
    const [city, setCity] = useState('')
    const [leadData, setLeadData] = useState<LeadData>({ name: '', phone: '', email: '', address: '' })
    const [loading, setLoading] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)

    const currentQuestion = QUESTIONS[step]
    const totalSteps = QUESTIONS.length + 2 // +2 for city and lead capture
    const progress = ((step + 1) / totalSteps) * 100

    function handleAnswer(value: string) {
        const newAnswers = { ...answers, [currentQuestion.id]: value }
        setAnswers(newAnswers)

        // Track step
        trackEvent({
            action: 'quiz_step_completed',
            category: 'quiz',
            label: `${currentQuestion.id}:${value}`,
            value: step + 1
        })

        // Save to session storage for retargeting
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('quiz_answers', JSON.stringify(newAnswers))
        }

        if (step < QUESTIONS.length - 1) {
            setTimeout(() => setStep(step + 1), 300)
        } else {
            setTimeout(() => setStep(step + 1), 300) // Go to city input
        }
    }

    function handleCitySubmit() {
        if (!city.trim()) return
        setAnswers({ ...answers, city })
        setTimeout(() => setStep(step + 1), 300) // Go to lead capture
    }

    async function handleLeadSubmit(e: React.FormEvent) {
        e.preventDefault()

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(leadData.email)) {
            alert('Veuillez entrer une adresse email valide')
            return
        }

        setLoading(true)

        try {
            const isPro = answers.userType === 'small_office' || answers.userType === 'enterprise'

            // Save lead to database
            const { data, error } = await supabase.from('leads').insert({
                user_phone: leadData.phone,
                city: city,
                status: isPro ? 'new_pro' : 'new_qualified', // High quality lead
                is_pro: isPro,
                needs_details: {
                    name: leadData.name,
                    email: leadData.email,
                    address: leadData.address,
                    quiz_answers: answers,
                    captured_at: new Date().toISOString(),
                    lead_source: 'quiz_pre_results'
                }
            }).select()

            // Save full context to session for results page
            const fullContext = {
                ...answers,
                city,
                leadData,
                leadId: data?.[0]?.id
            }
            sessionStorage.setItem('quiz_answers', JSON.stringify(fullContext))

            // Small delay to simulate "processing"
            setTimeout(() => {
                setLoading(false)
                router.push('/results')
            }, 1000)

        } catch (err) {
            console.error('Lead capture error:', err)
            setLoading(false)
            // Continue anyway to show results
            router.push('/results')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            <Navigation />

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 z-50">
                <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="max-w-3xl mx-auto px-4 py-16 pt-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        Étape {step + 1} sur {totalSteps}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900 dark:text-white">
                        {step < QUESTIONS.length ? currentQuestion.question :
                            step === QUESTIONS.length ? 'Dernière étape !' :
                                'Accédez à vos résultats'}
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        {step < QUESTIONS.length ? 'Sélectionnez une option pour continuer' :
                            step === QUESTIONS.length ? 'Où êtes-vous situé ?' :
                                'Pour voir vos offres personnalisées'}
                    </p>
                </div>

                {/* Question Content */}
                {step < QUESTIONS.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-300">
                        {currentQuestion.options.map((option) => {
                            const Icon = option.icon
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className="group relative p-8 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl hover:-translate-y-1 text-left"
                                >
                                    <div className="mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 text-zinc-900 dark:text-white">{option.label}</h3>
                                    <p className="text-sm text-zinc-500">{option.desc}</p>

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-5 h-5 text-blue-600" />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                ) : step === QUESTIONS.length ? (
                    // City Input
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border-2 border-zinc-200 dark:border-zinc-800">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 text-center">
                                    Dans quelle ville êtes-vous situé ?
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Ex: Casablanca, Rabat, Marrakech..."
                                    className="w-full px-6 py-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-medium text-center"
                                    autoFocus
                                    onKeyPress={(e) => e.key === 'Enter' && handleCitySubmit()}
                                />
                            </div>

                            <button
                                onClick={handleCitySubmit}
                                disabled={!city.trim()}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Continuer
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    // Lead Capture Form
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-10 border-2 border-blue-200 dark:border-blue-900/50 shadow-2xl">
                            {/* Trust Badge */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Lock className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="font-bold text-green-600">100% sécurisé</span> • Vos données sont protégées
                                </span>
                            </div>

                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
                                    Vos offres sont prêtes !
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    Pour accéder à vos recommandations personnalisées, complétez ces informations
                                </p>
                            </div>

                            <form onSubmit={handleLeadSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                                        <User className="w-4 h-4" />
                                        Nom complet *
                                    </label>
                                    <input
                                        required
                                        value={leadData.name}
                                        onChange={e => setLeadData({ ...leadData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium"
                                        placeholder="Votre nom"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                                            <Phone className="w-4 h-4" />
                                            Téléphone *
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            value={leadData.phone}
                                            onChange={e => setLeadData({ ...leadData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium"
                                            placeholder="06 00 00 00 00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                                            <Mail className="w-4 h-4" />
                                            Email *
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            value={leadData.email}
                                            onChange={e => setLeadData({ ...leadData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                                        <Home className="w-4 h-4" />
                                        Adresse complète *
                                    </label>
                                    <input
                                        required
                                        value={leadData.address}
                                        onChange={e => setLeadData({ ...leadData, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium"
                                        placeholder="Numéro, rue, quartier, ville"
                                    />
                                </div>

                                {/* Consent */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50">
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        En continuant, j'accepte de recevoir des offres personnalisées par email, SMS ou téléphone.
                                        Je peux me désinscrire à tout moment.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !leadData.name || !leadData.phone || !leadData.email || !leadData.address}
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Préparation de vos offres...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Voir mes offres personnalisées
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Skip Option (only on quiz questions) */}
                {step < QUESTIONS.length && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => router.push('/')}
                            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm font-medium transition-colors"
                        >
                            Passer et parcourir toutes les offres →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
