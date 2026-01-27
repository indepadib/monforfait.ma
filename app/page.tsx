import { ComparisonSection } from '@/components/ComparisonSection';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { FAQ } from '@/components/FAQ';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
import { Sparkles, Target, Shield, Clock } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black font-sans">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Funnel Optimized */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 py-24 md:py-32 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Mise à jour 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Trouvez l'offre parfaite<br />
            <span className="text-white/90">en 60 secondes</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Comparez <b>Mobile</b>, <b>Fibre</b> et <b>ADSL</b> au Maroc.<br />
            Orange, Inwi, Maroc Telecom. 100% gratuit, sans engagement.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12">
            <Link
              href="/quiz"
              className="flex-1 px-8 py-5 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Démarrer le quiz
            </Link>
            <a
              href="#comparateur"
              className="flex-1 px-8 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              Parcourir toutes les offres
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white"></div>
              </div>
              <span className="font-medium">+1 200 utilisateurs ce mois-ci</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium">4.8/5 satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Value Props - Trust Signals */}
      <div className="max-w-6xl mx-auto px-4 py-16 border-b border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white">Recommandations personnalisées</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Notre quiz intelligent trouve les offres adaptées à VOS besoins en 60 secondes.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white">100% gratuit et sans engagement</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Aucun frais caché. Comparez librement, sans obligation d'achat.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white">Prix vérifiés quotidiennement</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Nos données sont mises à jour chaque jour pour garantir les meilleurs tarifs.</p>
          </div>
        </div>
      </div>

      {/* Comparison Engine */}
      <ComparisonSection />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Banner Before Footer */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Prêt à économiser sur votre facture ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Répondez à 3 questions et découvrez vos offres personnalisées
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-2xl transform hover:-translate-y-1 text-lg"
          >
            <Sparkles className="w-6 h-6" />
            Commencer maintenant (60 sec)
          </Link>
        </div>
      </div>

      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <div className="text-zinc-500 text-sm font-medium">
          &copy; 2026 MonForfait.ma • Comparateur indépendant de forfaits au Maroc
        </div>
      </footer>

      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </main>
  );
}
