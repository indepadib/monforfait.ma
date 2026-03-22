"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function ContactPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.from('leads').insert({
                user_name: formData.name,
                user_email: formData.email,
                user_phone: "Formulaire Contact", // Placeholder as it's required in some views or to distinguish
                city: "N/A",
                status: 'message',
                is_pro: formData.subject.toLowerCase().includes('pro') || formData.subject.toLowerCase().includes('partenaire'),
                needs_details: {
                    type: 'contact_form',
                    subject: formData.subject,
                    message: formData.message,
                    captured_at: new Date().toISOString()
                }
            })

            if (error) throw error
            setSubmitted(true)
        } catch (err) {
            console.error("Error sending message:", err)
            alert("Une erreur est survenue. Veuillez réessayer plus tard.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
            <Navigation />
            
            <main className="max-w-7xl mx-auto px-4 py-20 pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Left Column: Info */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-5xl font-black text-zinc-900 dark:text-white mb-6">
                                Parlons de votre <span className="text-blue-600">projet</span>
                            </h1>
                            <p className="text-xl text-zinc-600 dark:text-zinc-400">
                                Une question sur un forfait ? Un projet de partenariat ? Notre équipe est à votre écoute pour vous accompagner.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Email</h4>
                                    <p className="text-zinc-500">contact@maplyo.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Siège Social</h4>
                                    <p className="text-zinc-500">Casablanca, Maroc</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl text-white">
                            <h3 className="text-2xl font-bold mb-4">Besoin d'aide immédiate ?</h3>
                            <p className="text-blue-100 mb-6">
                                Utilisez notre comparateur intelligent pour trouver la meilleure offre en moins de 2 minutes.
                            </p>
                            <a href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                                Démarrer le Quiz
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">Message envoyé !</h2>
                                <p className="text-zinc-500 mb-8 max-w-sm">
                                    Merci de nous avoir contactés. Nous reviendrons vers vous dans les plus brefs délais sur <span className="font-bold text-zinc-900 dark:text-white">{formData.email}</span>.
                                </p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-10">
                                    <MessageSquare className="w-6 h-6 text-blue-600" />
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Envoyez-nous un message</h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-zinc-500 ml-1">Nom complet</label>
                                            <input 
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-zinc-500 ml-1">Email</label>
                                            <input 
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-500 ml-1">Sujet</label>
                                        <input 
                                            required
                                            type="text"
                                            value={formData.subject}
                                            onChange={e => setFormData({...formData, subject: e.target.value})}
                                            className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Ex: Partenariat, Problème technique..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-500 ml-1">Votre message</label>
                                        <textarea 
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={e => setFormData({...formData, message: e.target.value})}
                                            className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 bg-zinc-900 dark:bg-white dark:text-black text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Envoyer mon message
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
