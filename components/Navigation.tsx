import Link from 'next/link'

export function Navigation() {
    return (
        <nav className="border-b dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
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

                <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <Link href="/offers" className="hover:text-black dark:hover:text-white transition-colors">Offres</Link>
                    <a href="/#comparateur" className="hover:text-black dark:hover:text-white transition-colors">Comparateur</a>
                    <Link href="/quiz" className="hover:text-black dark:hover:text-white transition-colors">Quiz</Link>
                    <Link href="/speedtest" className="hover:text-black dark:hover:text-white transition-colors">Speed Test</Link>
                    <a href="/#faq" className="hover:text-black dark:hover:text-white transition-colors">FAQ</a>
                </div>

                <Link href="/quiz" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg transition-shadow">
                    Trouver mon forfait
                </Link>
            </div>
        </nav>
    )
}
