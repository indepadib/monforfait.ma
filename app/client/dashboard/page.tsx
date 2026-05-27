import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
      
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Bonjour, voici votre suivi</h1>
        <p className="text-zinc-500 mt-2">Suivez l'état d'avancement de vos demandes et découvrez vos recommandations.</p>
      </div>

      {/* Status Alert */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Votre demande est en cours d'analyse</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              Notre algorithme sélectionne actuellement les meilleurs opérateurs pour votre besoin en Fibre Optique (Budget: 300 DH).
            </p>
          </div>
        </div>
        <button className="whitespace-nowrap px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          Compléter mon profil
        </button>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-bold mb-6">Avancement de votre dossier</h2>
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800"></div>
          
          <div className="space-y-6 relative">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-zinc-900">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="pt-1">
                <h4 className="font-semibold text-zinc-900 dark:text-white">Demande reçue</h4>
                <p className="text-sm text-zinc-500">Vos coordonnées ont été vérifiées avec succès.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-zinc-900 shadow-lg shadow-blue-500/20">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="pt-1">
                <h4 className="font-semibold text-zinc-900 dark:text-white">Analyse des offres (En cours)</h4>
                <p className="text-sm text-zinc-500">Mise en concurrence des opérateurs de votre région (Casablanca).</p>
              </div>
            </div>

            <div className="flex gap-4 opacity-50">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-zinc-900">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span>
              </div>
              <div className="pt-1">
                <h4 className="font-semibold text-zinc-900 dark:text-white">Mise en relation</h4>
                <p className="text-sm text-zinc-500">Un conseiller vous appellera prochainement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">Vos données sont protégées</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Vos informations de contact ne sont partagées qu'avec les opérateurs sélectionnés qui peuvent répondre à votre besoin. Nous ne revendons pas vos données à des tiers.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
