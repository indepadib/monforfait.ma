"use client"

import { useState } from 'react'
import { Calculator, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function SavingsCalculator() {
    const [currentPrice, setCurrentPrice] = useState<number | ''>('')
    const [savings, setSavings] = useState<number | null>(null)

    const BEST_MARKET_PRICE = 49 // Starting price for mobile plans

    function calculate() {
        if (!currentPrice || typeof currentPrice !== 'number') return

        const yearlySavings = (currentPrice - BEST_MARKET_PRICE) * 12
        if (yearlySavings > 0) {
            setSavings(yearlySavings)
        } else {
            setSavings(0)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border-2 border-zinc-100 dark:border-zinc-800 shadow-xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-bl-[100px] -z-0" />

            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 text-green-600 font-bold uppercase text-xs tracking-wider mb-4">
                    <Calculator className="w-4 h-4" />
                    Simulateur d'économies
                </div>

                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
                    Payez-vous trop cher ?
                </h3>
                <p className="text-zinc-500 mb-6 text-sm">
                    Calculez combien vous pourriez économiser en changeant d'offre aujourd'hui.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                            Votre facture mensuelle actuelle (DH)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={currentPrice}
                                onChange={(e) => {
                                    setCurrentPrice(Number(e.target.value))
                                    setSavings(null)
                                }}
                                placeholder="Ex: 200"
                                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-bold text-lg outline-none focus:border-green-500 transition-colors"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                                DH
                            </div>
                        </div>
                    </div>

                    {!savings && (
                        <button
                            onClick={calculate}
                            disabled={!currentPrice}
                            className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Calculer mes économies
                        </button>
                    )}

                    {savings !== null && (
                        <div className="animate-in zoom-in-95 duration-300">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-xl p-4 text-center mb-4">
                                <div className="text-sm text-green-800 dark:text-green-300 font-medium mb-1">
                                    Économie annuelle potentielle
                                </div>
                                <div className="text-3xl font-black text-green-600 dark:text-green-400">
                                    {savings.toLocaleString()} DH
                                </div>
                            </div>

                            <Link
                                href="/quiz"
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Voir les offres à 49 DH
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
