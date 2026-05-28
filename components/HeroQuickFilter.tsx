'use client'

import React, { useState } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'

interface HeroQuickFilterProps {
  onFilter?: (filters: { category?: string; maxPrice?: number }) => void;
}

export function HeroQuickFilter({ onFilter }: HeroQuickFilterProps) {
  const [need, setNeed] = useState('fibre')
  const [budget, setBudget] = useState('200')

  const handleCompareClick = () => {
    if (onFilter) {
      let cat = 'all';
      if (need === 'mobile') cat = 'mobile';
      else if (need === 'fibre' || need === 'adsl' || need === 'box') cat = 'internet';
      
      onFilter({ category: cat, maxPrice: parseInt(budget) || undefined });
      return;
    }

    // Scroll smoothly to the comparison section
    const element = document.getElementById('comparateur')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      
      // Optionally, we could dispatch an event here to auto-select these filters 
      // in the ComparisonSection down below, but for now scrolling is the main action.
      // This builds momentum without friction.
    }
  }

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] border border-white/10 text-left w-full mx-auto transform transition-all relative group mt-8 lg:mt-0">
      
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-500/20 transition-colors duration-500 pointer-events-none"></div>

      <div className="mb-8 mt-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
          Testez vos économies
        </h2>
        <p className="text-zinc-400 font-medium text-sm sm:text-base">
          Découvrez instantanément si vous payez trop cher. <strong className="text-white">100% Gratuit.</strong>
        </p>
      </div>

      <div className="space-y-5 relative z-10">
        <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
                Je recherche :
            </label>
            <select
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-bold cursor-pointer transition-all hover:bg-[#0A0F1C]"
            >
                <option value="fibre">Une offre Fibre Optique</option>
                <option value="mobile">Un forfait Mobile</option>
                <option value="box">Une Box 4G/5G</option>
                <option value="adsl">Une connexion ADSL</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
                Mon budget actuel / mois :
            </label>
            <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-[#0A0F1C]/80 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-bold text-lg cursor-pointer transition-all hover:bg-[#0A0F1C]"
            >
                <option value="100">Moins de 100 DH</option>
                <option value="150">Entre 100 et 199 DH</option>
                <option value="250">Entre 200 et 299 DH</option>
                <option value="350">Plus de 300 DH</option>
            </select>
        </div>

        <div className="pt-4">
            <button
                onClick={handleCompareClick}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 transform active:scale-95"
            >
                <Sparkles className="w-5 h-5 text-blue-200" />
                Voir mes offres secrètes
            </button>
        </div>
        
        <div className="pt-2 flex justify-center">
            <div className="animate-bounce bg-white/5 p-2 rounded-full border border-white/10">
                <ArrowDown className="w-4 h-4 text-zinc-400" />
            </div>
        </div>
      </div>
    </div>
  )
}
