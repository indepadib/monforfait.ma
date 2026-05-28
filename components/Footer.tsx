import Link from 'next/link'
import { useTranslation } from '@/lib/LocaleContext'

export function Footer() {
    const { t, isRtl } = useTranslation();

    return (
        <footer className="bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 ${isRtl ? 'text-right' : ''}`}>
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className={`font-black text-xl tracking-tight flex items-center gap-2 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                MonForfait.ma
                            </span>
                        </Link>
                        <p className="text-zinc-500 text-sm max-w-sm mb-6 leading-relaxed">
                            {t('footer_desc')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-4">{t('footer_nav')}</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            <li><Link href="/offers" className="hover:text-blue-600 transition-colors">{t('nav_offers')}</Link></li>
                            <li><Link href="/quiz" className="hover:text-blue-600 transition-colors">{t('nav_quiz')}</Link></li>
                            <li><Link href="/compare" className="hover:text-blue-600 transition-colors">{t('nav_comparator')}</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog & Actualités</Link></li>
                            <li><Link href="/confiance" className="hover:text-blue-600 transition-colors font-bold text-zinc-900 dark:text-white">Pourquoi nous faire confiance ?</Link></li>
                        </ul>
                    </div>

                    {/* SEO Hubs */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-4">{t('footer_popular')}</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            <li><Link href="/operateurs/inwi" className="hover:text-blue-600 transition-colors">Forfait Inwi Maroc</Link></li>
                            <li><Link href="/operateurs/orange" className="hover:text-blue-600 transition-colors">Offres Orange Mobile</Link></li>
                            <li><Link href="/operateurs/iam" className="hover:text-blue-600 transition-colors">Fibre Maroc Telecom</Link></li>
                            <li><Link href="/forfait-mobile-pas-cher" className="hover:text-blue-600 transition-colors">Forfait mobile pas cher</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-4">{t('footer_legal')}</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            <li><Link href="/legal/mentions" className="hover:text-blue-600 transition-colors font-sans">Mentions Légales</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-blue-600 transition-colors font-sans">Confidentialité</Link></li>
                            <li><Link href="/legal/cgu" className="hover:text-blue-600 transition-colors font-sans">Conditions Générales</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-600 transition-colors font-sans">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={`pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center flex flex-col md:flex-row justify-between items-center gap-4 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <div className="text-zinc-400 text-sm">
                        &copy; {new Date().getFullYear()} {t('footer_rights')}
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Social links */}
                    </div>
                </div>
            </div>
        </footer>
    )
}
