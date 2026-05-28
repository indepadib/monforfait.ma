"use client"

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useTranslation } from '@/lib/LocaleContext'

export function FAQ() {
    const { t, isRtl } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const FAQS = [
        {
            question: t('faq_q1'),
            answer: t('faq_a1')
        },
        {
            question: t('faq_q2'),
            answer: t('faq_a2')
        },
        {
            question: t('faq_q3'),
            answer: t('faq_a3')
        },
        {
            question: t('faq_q4'),
            answer: t('faq_a4')
        },
        {
            question: t('faq_q5'),
            answer: t('faq_a5')
        },
        {
            question: t('faq_q6'),
            answer: t('faq_a6')
        },
        {
            question: t('faq_q7'),
            answer: t('faq_a7')
        },
        {
            question: t('faq_q8'),
            answer: t('faq_a8')
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-16" id="faq">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    {t('faq_badge')}
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-zinc-900 dark:text-white">
                    {t('faq_title')}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                    {t('faq_desc')}
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
                            className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors ${isRtl ? 'flex-row-reverse text-right' : ''}`}
                        >
                            <h3 className={`font-bold text-lg text-zinc-900 dark:text-white pr-4 ${isRtl ? 'pl-4 pr-0' : ''}`}>
                                {faq.question}
                            </h3>
                            <ChevronDown
                                className={`w-5 h-5 text-zinc-500 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {openIndex === index && (
                            <div className="px-6 pb-5 animate-in slide-in-from-top-2 duration-200">
                                <p className={`text-zinc-600 dark:text-zinc-400 leading-relaxed ${isRtl ? 'text-right' : ''}`}>
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-3xl border border-blue-200 dark:border-blue-900/50 text-center">
                <h3 className="font-bold text-xl mb-2 text-zinc-900 dark:text-white">
                    {t('faq_box_title')}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    {t('faq_box_desc')}
                </p>
                <a
                    href="mailto:contact@monforfait.ma"
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                    <Check className="w-5 h-5" />
                    {t('faq_box_btn')}
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
