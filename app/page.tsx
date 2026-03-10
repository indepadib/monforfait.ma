import { ComparisonSection } from '@/components/ComparisonSection';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { FAQ } from '@/components/FAQ';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
import { Sparkles, Target, Shield, Clock } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';
import { TrustBadges } from '@/components/TrustBadges';
import { B2BBanner } from '@/components/B2BBanner';
import { PromoUnlockerForm } from '@/components/PromoUnlockerForm';
import { LiveFOMOTicker } from '@/components/LiveFOMOTicker';

export default function Home() {
// ... Skipped lines to the comparison engine ...
// Let's use multi_replace.
  return (
    <main className="min-h-screen bg-white dark:bg-black font-sans">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Premium 2-Column Layout */}
      <div className="relative overflow-hidden bg-[#0A0F1C] text-white">
        {/* Animated Premium Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & Hook */}
            <div className="text-center lg:text-left">
              <div className="mb-6 lg:mb-8 h-10 flex items-center justify-center lg:justify-start overflow-hidden">
                 <LiveFOMOTicker />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.15]">
                92% des marocains paient<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  leur abonnement trop cher.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal">
                Les opérateurs cachent leurs meilleures offres de rétention. <br className="hidden sm:block"/>
                Faites le test gratuitement et découvrez combien vous pouvez économiser dès aujourd'hui.
              </p>

              {/* Social Proof & Trust Badges */}
              <div className="flex flex-col gap-6 mt-8">
                {/* User Avatars Row */}
                <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img src="https://i.pravatar.cc/100?img=11" alt="User" className="w-10 h-10 rounded-full border-2 border-[#0A0F1C] shadow-lg" />
                      <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-10 h-10 rounded-full border-2 border-[#0A0F1C] shadow-lg" />
                      <img src="https://i.pravatar.cc/100?img=13" alt="User" className="w-10 h-10 rounded-full border-2 border-[#0A0F1C] shadow-lg" />
                      <div className="w-10 h-10 rounded-full border-2 border-[#0A0F1C] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
                        +5k
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-yellow-500" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-medium text-zinc-300 mt-0.5">Approuvé par >5000 Marocains</span>
                    </div>
                  </div>
                </div>

                {/* Trust Icons Row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    100% Gratuit
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-700"></div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Sans Engagement
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-700"></div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    En 60 Secondes
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Promo Unlocker Form */}
            <div className="relative z-20 mx-auto w-full max-w-lg lg:max-w-full">
               <PromoUnlockerForm />
            </div>

          </div>
        </div>
      </div>

      {/* Value Props - Trust Signals */}
      <section aria-labelledby="features-heading" className="max-w-6xl mx-auto px-4 py-16 border-b border-zinc-100 dark:border-zinc-800">
        <h2 id="features-heading" className="sr-only">Pourquoi choisir MonForfait.ma</h2>
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
      </section>

      {/* Savings Calculator */}
      <section aria-label="Calculateur d'économies" className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <SavingsCalculator />
      </section>

      {/* B2B Banner Offer */}
      <section aria-label="Offre Entreprise" className="max-w-6xl mx-auto px-4 py-8">
        <B2BBanner />
      </section>

      {/* Blog Teaser Section */}
      <section aria-labelledby="blog-heading" className="max-w-6xl mx-auto px-4 py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] my-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 px-4 sm:px-8">
          <div>
            <h2 id="blog-heading" className="text-3xl font-black mb-2 dark:text-white">Derniers Articles & Guides</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Actualités, comparatifs et astuces pour faire le bon choix.</p>
          </div>
          <Link href="/blog" className="hidden sm:inline-flex text-blue-600 font-bold hover:text-blue-700 items-center gap-1 group">
            Voir tout le blog <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-8">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="aspect-[16/9] w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-2 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold dark:text-white">{post.author.name}</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center px-4 sm:hidden">
          <Link href="/blog" className="inline-flex w-full justify-center px-6 py-4 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-bold rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-95 transition-all">
            Voir tous les articles
          </Link>
        </div>
      </section>

      {/* Comparison Engine */}
      <section aria-label="Outil de comparaison" id="comparateur">
         <ComparisonSection />
      </section>

      {/* FAQ Section */}
      <section aria-label="Questions Fréquentes">
          <FAQ />
      </section>

      {/* CTA Banner Before Footer */}
      <section aria-labelledby="cta-heading" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-black mb-4">
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
      </section>

      {/* Trust Badges */}
      <section aria-label="Nos partenaires" className="max-w-6xl mx-auto px-4">
        <TrustBadges />
      </section>



      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </main>
  );
}
