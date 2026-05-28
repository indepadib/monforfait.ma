"use client"

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Sparkles, Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/LocaleContext'

type Offer = {
    id: string
    provider: string
    name: string
    price: number
    type: string
    features?: string[]
}

export default function OfferDetailsContent({ offer, slug }: { offer: Offer; slug: string }) {
    const { t, isRtl } = useTranslation()

    // Generate JSON-LD Structured Data for Better SEO Google Shopping/Rich Results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${offer.name} - ${offer.provider}`,
        description: `Forfait ${offer.type} proposé par ${offer.provider} avec ${offer.features?.join(', ')}.`,
        brand: {
            '@type': 'Brand',
            name: offer.provider
        },
        offers: {
            '@type': 'Offer',
            url: `https://monforfait.ma/offres/${slug}`,
            priceCurrency: 'MAD',
            price: offer.price,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: offer.provider
            }
        }
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-start" dir={isRtl ? 'rtl' : 'ltr'}>
            <Navigation />
            
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="pt-24 pb-8 max-w-6xl mx-auto px-4">
               {/* Breadcrumbs for SEO */}
               <nav className="flex items-center text-sm text-zinc-500 mb-8" aria-label="Breadcrumb">
                  <ol className={`flex items-center space-x-2 ${isRtl ? 'space-x-reverse' : ''}`}>
                    <li>
                      <Link href="/" className="hover:text-blue-600 transition-colors">{t('detail_home')}</Link>
                    </li>
                    <li><ChevronRight className={`w-4 h-4 mx-1 ${isRtl ? 'rotate-180' : ''}`} /></li>
                    <li>
                      <Link href="/offres" className="hover:text-blue-600 transition-colors">{t('detail_offers')}</Link>
                    </li>
                    <li><ChevronRight className={`w-4 h-4 mx-1 ${isRtl ? 'rotate-180' : ''}`} /></li>
                    <li className="text-zinc-900 dark:text-white font-medium truncate max-w-[200px]" aria-current="page">
                      {offer.name}
                    </li>
                  </ol>
                </nav>

                <div className={`flex flex-col lg:flex-row gap-8 items-start ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Main Content */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm w-full">
                        <div className={`flex items-start justify-between mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div>
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                    {offer.type} • {offer.provider}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black mb-4 dark:text-white leading-tight">
                                    {offer.name}
                                </h1>
                            </div>
                           
                            {/* Operator Logo Placeholder */}
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-bold text-zinc-400 shadow-inner shrink-0">
                                {offer.provider[0]}
                            </div>
                        </div>

                        <div className="prose prose-zinc dark:prose-invert max-w-none mb-8">
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {t('detail_desc').replace('{name}', offer.name).replace('{provider}', offer.provider)}
                            </p>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
                            <h2 className={`text-xl font-bold mb-4 dark:text-white flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                {t('detail_advantages')}
                            </h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {offer.features?.map((feature: string, idx: number) => (
                                    <li key={idx} className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <div className="mt-0.5 bg-green-100 text-green-600 dark:bg-green-900/30 p-1 rounded-full shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar CTA */}
                    <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 border-blue-500 shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Sparkles className="w-24 h-24 text-blue-500" />
                             </div>
                             
                             <div className="relative z-10 text-center">
                                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">{t('detail_price_label')}</p>
                                <div className={`text-5xl font-black text-zinc-900 dark:text-white mb-6 flex items-center justify-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <span>{offer.price}</span> <span className="text-xl text-zinc-500 font-medium">{isRtl ? 'درهم' : 'DH'}</span>
                                </div>
                                
                                <Link 
                                    href="/quiz"
                                    className="block w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-all mb-4"
                                >
                                    {t('detail_verify_btn')}
                                </Link>
                                
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {t('detail_free_note')}
                                </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </main>
    )
}
