import Link from 'next/link'
import { useTranslation } from '@/lib/LocaleContext'

export function Navigation() {
    const { locale, setLocale, t, isRtl } = useTranslation();

    return (
        <nav className="border-b dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
            <div className={`max-w-6xl mx-auto px-4 h-16 flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                    {/* Custom Comparison Icon */}
                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                        {/* Three bars representing comparison/choice with signal elements */}
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            {/* Left bar - short */}
                            <rect x="3" y="14" width="4" height="7" rx="1.5" fill="white" opacity="0.7" />
                            {/* Middle bar - tall (best choice) */}
                            <rect x="10" y="6" width="4" height="15" rx="1.5" fill="white" />
                            <circle cx="12" cy="4" r="1.5" fill="white" />
                            {/* Right bar - medium */}
                            <rect x="17" y="10" width="4" height="11" rx="1.5" fill="white" opacity="0.85" />
                        </svg>
                    </div>
                    {/* Text Logo */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                            Mon<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Forfait</span>
                        </span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">.ma</span>
                    </div>
                </Link>

                <div className={`hidden md:flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Link href="/offers" className="hover:text-black dark:hover:text-white transition-colors">{t('nav_offers')}</Link>
                    <a href="/#comparateur" className="hover:text-black dark:hover:text-white transition-colors">{t('nav_comparator')}</a>
                    <Link href="/quiz" className="hover:text-black dark:hover:text-white transition-colors">{t('nav_quiz')}</Link>
                    
                    {/* New Hub Links */}
                    <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-2"></div>
                    <Link href="/client/dashboard" className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
                        {t('nav_client_space')}
                    </Link>
                    <Link href="/login" className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                        {t('nav_pro_portal')}
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setLocale(locale === 'fr' ? 'ar' : 'fr')}
                        className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-black text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all select-none uppercase tracking-wider"
                    >
                        {locale === 'fr' ? 'العربية' : 'FR'}
                    </button>
                    <Link href="/quiz" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg transition-shadow">
                        {t('nav_btn_find')}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
