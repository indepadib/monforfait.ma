import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="font-black text-xl tracking-tight flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                MonForfait.ma
                            </span>
                        </Link>
                        <p className="text-zinc-500 text-sm max-w-sm mb-6">
                            Le comparateur telecom N°1 au Maroc. Nous analysons quotidiennement les offres de Orange, Inwi et Maroc Telecom pour vous faire économiser.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Navigation</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            <li><Link href="/offers" className="hover:text-blue-600 transition-colors">Toutes les offres</Link></li>
                            <li><Link href="/quiz" className="hover:text-blue-600 transition-colors">Quiz personnalisé</Link></li>
                            <li><Link href="/compare" className="hover:text-blue-600 transition-colors">Comparateur</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog & Actualités</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            <li><Link href="/legal/mentions" className="hover:text-blue-600 transition-colors">Mentions Légales</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-blue-600 transition-colors">Confidentialité</Link></li>
                            <li><Link href="/legal/cgu" className="hover:text-blue-600 transition-colors">Conditions Générales</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-zinc-400 text-sm">
                        &copy; {new Date().getFullYear()} MonForfait.ma • Fait avec ❤️ au Maroc
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Social links could go here */}
                    </div>
                </div>
            </div>
        </footer>
    )
}
