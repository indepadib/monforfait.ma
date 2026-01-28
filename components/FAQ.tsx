"use client"

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const FAQS = [
    {
        question: "Comment fonctionne MonForfait.ma ?",
        answer: "MonForfait.ma compare automatiquement tous les forfaits disponibles chez Orange, Inwi et Maroc Telecom. Répondez à notre quiz de 60 secondes pour obtenir des recommandations personnalisées basées sur vos besoins réels."
    },
    {
        question: "Est-ce vraiment gratuit ?",
        answer: "Oui, 100% gratuit ! MonForfait.ma est un comparateur indépendant financé par des partenariats avec les opérateurs. Vous ne payez rien et n'avez aucune obligation d'achat."
    },
    {
        question: "Les prix sont-ils à jour ?",
        answer: "Nos prix sont mis à jour quotidiennement grâce à notre système automatique de scraping. Vous voyez toujours les tarifs les plus récents et les promotions en cours."
    },
    {
        question: "Puis-je changer d'opérateur facilement ?",
        answer: "Oui ! Au Maroc, vous pouvez changer d'opérateur en conservant votre numéro (portabilité). Le processus prend généralement 2-3 jours ouvrables. Nous vous guidons dans toutes les étapes."
    },
    {
        question: "Quelle différence entre Fibre et ADSL ?",
        answer: "La fibre optique (FTTH) offre des vitesses jusqu'à 1 Gbps avec une latence très faible, idéale pour le streaming 4K et le gaming. L'ADSL est limité à ~20 Mbps mais disponible partout. Notre speed test vous aide à savoir ce dont vous avez besoin."
    },
    {
        question: "Comment utiliser le speed test ?",
        answer: "Cliquez sur 'Speed Test' dans le menu. Notre outil mesure votre vitesse actuelle (download, upload, ping) et vous recommande les forfaits adaptés à vos besoins. Gratuit et illimité !"
    },
    {
        question: "Mes données sont-elles protégées ?",
        answer: "Absolument. Nous utilisons un cryptage SSL et respectons le RGPD. Vos données ne sont jamais vendues. Elles servent uniquement à personnaliser vos recommandations."
    },
    {
        question: "Proposez-vous des forfaits Pro ?",
        answer: "Oui ! Nous comparons aussi les offres professionnelles : fibre avec IP statique, flottes mobiles, solutions Cloud. Sélectionnez 'Professionnel' dans notre quiz."
    }
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="max-w-4xl mx-auto px-4 py-16" id="faq">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    Questions Fréquentes
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-zinc-900 dark:text-white">
                    Tout ce que vous devez savoir
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                    Vous avez une question ? Nous avons la réponse.
                </p>
            </div>

            <div className="space-y-4">
                {FAQS.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all hover:border-blue-500 dark:hover:border-blue-500"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
                        >
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white pr-4">
                                {faq.question}
                            </h3>
                            <ChevronDown
                                className={`w-5 h-5 text-zinc-500 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {openIndex === index && (
                            <div className="px-6 pb-5 animate-in slide-in-from-top-2 duration-200">
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-3xl border border-blue-200 dark:border-blue-900/50 text-center">
                <h3 className="font-bold text-xl mb-2 text-zinc-900 dark:text-white">
                    Vous avez une autre question ?
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    Notre équipe est là pour vous aider
                </p>
                <a
                    href="mailto:contact@monforfait.ma"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Check className="w-5 h-5" />
                    Contactez-nous
                </a>
            </div>
            {/* Structured Data for FAQ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: FAQS.map(faq => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer
                            }
                        }))
                    })
                }}
            />
        </div>
    )
}
