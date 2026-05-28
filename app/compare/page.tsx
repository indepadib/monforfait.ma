"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, ArrowRight, Check, X, Zap, Download, Upload, DollarSign, Calendar, Award } from 'lucide-react'
import Link from 'next/link'
import { CONFIG } from '@/lib/config'
import { useTranslation } from '@/lib/LocaleContext'

// Force dynamic rendering - this page uses URL params
export const dynamic = 'force-dynamic'

type Offer = {
    id: string
    operator_name: string
    title: string
    category: string
    price_dh: number
    download_speed_mbps?: number
    upload_speed_mbps?: number
    mobile_data_gb?: number
    voice_minutes?: number
    technology?: string
    setup_fee_dh?: number
    commitment_months?: number
    highlight_badge?: string
}

function CompareContent() {
    const { t, isRtl, locale } = useTranslation()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []
        if (ids.length === 0) {
            router.push('/offers')
            return
        }
        loadOffers(ids)
    }, [searchParams])

    async function loadOffers(ids: string[]) {
        setLoading(true)

        const { data, error } = await supabase
            .from('plans')
            .select(`
        id,
        title,
        category,
        price_dh,
        download_speed_mbps,
        upload_speed_mbps,
        mobile_data_gb,
        voice_minutes,
        technology,
        setup_fee_dh,
        commitment_months,
        highlight_badge,
        operators (name)
      `)
            .in('id', ids)
            .eq('is_active', true)

        if (error) {
            console.error('Error loading offers:', error)
            setLoading(false)
            return
        }

        if (data) {
            const formatted = data.map((offer: any) => ({
                id: offer.id,
                operator_name: offer.operators?.name || 'Unknown',
                title: offer.title,
                category: offer.category,
                price_dh: offer.price_dh,
                download_speed_mbps: offer.download_speed_mbps,
                upload_speed_mbps: offer.upload_speed_mbps,
                mobile_data_gb: offer.mobile_data_gb,
                voice_minutes: offer.voice_minutes,
                technology: offer.technology,
                setup_fee_dh: offer.setup_fee_dh,
                commitment_months: offer.commitment_months,
                highlight_badge: offer.highlight_badge,
            }))
            setOffers(formatted)
        }

        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">{t('compare_loading')}</p>
                </div>
            </div>
        )
    }

    const isMobile = offers.some(o => o.category === 'mobile')
    const isInternet = offers.some(o => o.category === 'internet')

    return (
        <div className={`min-h-screen bg-white dark:bg-black ${isRtl ? 'text-right' : 'text-left'}`}>
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className={`mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <Link href="/offers" className={`inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                        {t('compare_back')}
                    </Link>

                    <h1 className="text-4xl font-black mb-2 text-zinc-900 dark:text-white">
                        {t('compare_title')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {t('compare_subtitle')}
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
                            <thead>
                                <tr className="border-b-2 border-zinc-200 dark:border-zinc-800">
                                    <th className={`px-6 py-6 bg-white dark:bg-zinc-950 sticky z-10 ${isRtl ? 'right-0 text-right border-l dark:border-zinc-800' : 'left-0 text-left border-r dark:border-zinc-800'}`}>
                                        <span className="text-sm font-bold text-zinc-500 uppercase">{t('compare_criterion')}</span>
                                    </th>
                                    {offers.map((offer) => {
                                        const opName = offer.operator_name === 'Orange Morocco' || offer.operator_name === 'Orange' ? (locale === 'ar' ? 'أورنج' : offer.operator_name) : offer.operator_name === 'Inwi' ? (locale === 'ar' ? 'إنوي' : 'Inwi') : offer.operator_name === 'Maroc Telecom' || offer.operator_name === 'IAM' ? (locale === 'ar' ? 'اتصالات المغرب' : 'Maroc Telecom') : offer.operator_name;
                                        return (
                                            <th key={offer.id} className="px-6 py-6 min-w-[280px]">
                                                <div className={isRtl ? 'text-right' : 'text-left'}>
                                                    <div className="text-xs font-bold text-zinc-500 mb-1">{opName}</div>
                                                    <div className="text-lg font-black text-zinc-900 dark:text-white mb-2">{offer.title}</div>
                                                    {offer.highlight_badge && (
                                                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold">
                                                            {offer.highlight_badge}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {/* Price */}
                                <tr className="bg-white dark:bg-zinc-950">
                                    <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <DollarSign className="w-4 h-4 text-blue-600" />
                                            {t('compare_price')}
                                        </div>
                                    </td>
                                    {offers.map((offer) => (
                                        <td key={offer.id} className="px-6 py-4">
                                            <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {offer.price_dh} DH
                                            </div>
                                            <div className="text-xs text-zinc-500">{t('card_per_month')}</div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Category */}
                                <tr>
                                    <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                        {t('compare_category')}
                                    </td>
                                    {offers.map((offer) => (
                                        <td key={offer.id} className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {offer.category === 'mobile' ? `📱 ${t('offers_mobile_only')}` : `🌐 ${t('offers_internet_only')}`}
                                        </td>
                                    ))}
                                </tr>

                                {/* Internet-specific fields */}
                                {isInternet && (
                                    <>
                                        <tr>
                                            <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                    <Download className="w-4 h-4 text-green-600" />
                                                    {t('compare_download')}
                                                </div>
                                            </td>
                                            {offers.map((offer) => (
                                                <td key={offer.id} className="px-6 py-4">
                                                    {offer.download_speed_mbps ? (
                                                        <div className="font-bold text-zinc-900 dark:text-white">
                                                            {offer.download_speed_mbps} Mbps
                                                        </div>
                                                    ) : (
                                                        <span className="text-zinc-400">-</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                    <Upload className="w-4 h-4 text-purple-600" />
                                                    {t('compare_upload')}
                                                </div>
                                            </td>
                                            {offers.map((offer) => (
                                                <td key={offer.id} className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                                    {offer.upload_speed_mbps ? `${offer.upload_speed_mbps} Mbps` : '-'}
                                                </td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                    <Zap className="w-4 h-4 text-yellow-600" />
                                                    {t('compare_tech')}
                                                </div>
                                            </td>
                                            {offers.map((offer) => (
                                                <td key={offer.id} className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                                    {offer.technology || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    </>
                                )}

                                {/* Mobile-specific fields */}
                                {isMobile && (
                                    <>
                                        <tr>
                                            <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                                📊 {t('compare_data')}
                                            </td>
                                            {offers.map((offer) => (
                                                <td key={offer.id} className="px-6 py-4">
                                                    {offer.mobile_data_gb ? (
                                                        <div className="font-bold text-zinc-900 dark:text-white">
                                                            {offer.mobile_data_gb} {locale === 'ar' ? 'جيجا' : 'Go'}
                                                        </div>
                                                    ) : (
                                                        <span className="text-zinc-400">-</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                                📞 {t('compare_calls')}
                                            </td>
                                            {offers.map((offer) => (
                                                <td key={offer.id} className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                                    {offer.voice_minutes === -1 ? t('card_unlimited') : offer.voice_minutes ? `${offer.voice_minutes} ${locale === 'ar' ? 'دقيقة' : 'min'}` : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    </>
                                )}

                                {/* Setup Fee */}
                                <tr>
                                    <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                        💰 {t('compare_setup')}
                                    </td>
                                    {offers.map((offer) => (
                                        <td key={offer.id} className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {offer.setup_fee_dh === 0 ? (
                                                <span className={`text-green-600 dark:text-green-400 font-bold flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                    <Check className="w-4 h-4" /> {locale === 'ar' ? 'مجاني' : 'Gratuit'}
                                                </span>
                                            ) : offer.setup_fee_dh ? (
                                                `${offer.setup_fee_dh} DH`
                                            ) : '-'}
                                        </td>
                                    ))}
                                </tr>

                                {/* Commitment */}
                                <tr>
                                    <td className={`px-6 py-4 font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}>
                                        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <Calendar className="w-4 h-4 text-orange-600" />
                                            {t('compare_commitment')}
                                        </div>
                                    </td>
                                    {offers.map((offer) => (
                                        <td key={offer.id} className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {offer.commitment_months === 0 ? (
                                                <span className={`text-green-600 dark:text-green-400 font-bold flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                    <Check className="w-4 h-4" /> {locale === 'ar' ? 'بدون التزام' : 'Sans engagement'}
                                                </span>
                                            ) : offer.commitment_months ? (
                                                `${offer.commitment_months} ${locale === 'ar' ? 'شهراً' : 'mois'}`
                                            ) : '-'}
                                        </td>
                                    ))}
                                </tr>

                                {/* CTA Row */}
                                <tr className="bg-white dark:bg-zinc-950">
                                    <td className={`px-6 py-6 bg-white dark:bg-zinc-950 sticky ${isRtl ? 'right-0 border-l dark:border-zinc-800' : 'left-0 border-r dark:border-zinc-800'}`}></td>
                                    {offers.map((offer) => {
                                        const opName = offer.operator_name === 'Orange Morocco' || offer.operator_name === 'Orange' ? (locale === 'ar' ? 'أورنج' : offer.operator_name) : offer.operator_name === 'Inwi' ? (locale === 'ar' ? 'إنوي' : 'Inwi') : offer.operator_name === 'Maroc Telecom' || offer.operator_name === 'IAM' ? (locale === 'ar' ? 'اتصالات المغرب' : 'Maroc Telecom') : offer.operator_name;
                                        const whatsappMsg = locale === 'ar' ? `أنا مهتم بعرض ${opName} ${offer.title}` : `Je suis intéressé par l'offre ${opName} ${offer.title}`;
                                        return (
                                            <td key={offer.id} className="px-6 py-6">
                                                <a
                                                    href={`https://wa.me/${CONFIG.SUPPORT_WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-center hover:shadow-lg transition-all hover:scale-[1.02]"
                                                >
                                                    {t('compare_subscribe')}
                                                </a>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <Link href="/offers" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        {t('compare_add_more')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function ComparePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        }>
            <CompareContent />
        </Suspense>
    )
}
