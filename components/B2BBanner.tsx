"use client";

import { Briefcase, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { event } from "@/lib/analytics";

export function B2BBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-16 border border-zinc-800">
      {/* Abstract Background Design */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-20 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#3B82F6" d="M47.7,-57.2C59.5,-45.5,65.3,-27.2,68.9,-8.4C72.5,10.4,73.8,29.8,64.2,43.4C54.5,57.1,33.9,64.9,13.7,68.3C-6.5,71.7,-26.3,70.6,-43.3,61.4C-60.3,52.2,-74.5,34.9,-77.9,15.7C-81.3,-3.4,-73.9,-24.4,-61.2,-39.8C-48.5,-55.1,-30.5,-64.7,-13.3,-67.2C3.8,-69.6,27.1,-64.8,47.7,-57.2Z" transform="translate(100 100) scale(1.1)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-widest uppercase mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Espace Entreprise (B2B)
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Des Forfaits Sur-Mesure <br />
            <span className="text-blue-400">Pour Votre Entreprise</span>
          </h2>
          <p className="text-lg text-zinc-300 max-w-xl mb-8 leading-relaxed">
            Flotte mobile, Fibre dédiée, ou standards téléphoniques. Obtenez un devis gratuit en 2 minutes et réduisez vos coûts de télécommunication de 30% en moyenne.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/quiz?type=pro"
              onClick={() => event({ action: 'click_b2b_banner', category: 'engagement', label: 'B2B Get Quote' })}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 transform hover:-translate-y-1"
            >
              <Briefcase className="w-5 h-5" /> Obtenir un Devis Pro
            </Link>
            <a
              href="#comparateur"
              onClick={() => {
                const cmp = document.getElementById('comparateur');
                if (cmp) {
                   // Slight hack to force the audience toggle to 'professional' via a global event or just direct scroll
                   window.dispatchEvent(new CustomEvent('switch-audience-pro'));
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all"
            >
              Voir les Offres Pro <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Highlight Stats Box */}
        <div className="w-full md:w-auto bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-6">
          <div>
            <div className="text-sm text-zinc-400 mb-1 font-medium">Temps de réponse</div>
            <div className="text-2xl font-black text-white">&lt; 30 minutes</div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div>
            <div className="text-sm text-zinc-400 mb-1 font-medium">Bénéfice moyen</div>
            <div className="text-2xl font-black text-green-400">-30% sur facture</div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div>
             <div className="text-sm text-zinc-400 mb-1 font-medium">Conseillers dédiés</div>
             <div className="text-2xl font-black text-white">100% Gratuits</div>
          </div>
        </div>
      </div>
    </div>
  );
}
