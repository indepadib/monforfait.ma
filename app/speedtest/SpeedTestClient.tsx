"use client"
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Activity, Wifi, ShieldCheck } from 'lucide-react'
export function SpeedTestClient(){
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
  <Navigation/>
  <section className="px-5 pt-32 pb-16 bg-zinc-950 text-white">
   <div className="mx-auto max-w-4xl text-center">
    <p className="text-sm uppercase tracking-widest font-bold text-blue-300">Vérifier sa connexion</p>
    <h1 className="mt-4 text-4xl md:text-6xl font-black">Test de débit Internet</h1>
    <p className="mt-5 text-lg text-zinc-300">La vitesse de votre ligne doit être mesurée sur votre appareil. Nous ne simulons pas de chiffres : utilisez un outil de mesure réel, puis comparez les offres disponibles au Maroc.</p>
   </div>
  </section>
  <section className="mx-auto max-w-4xl px-5 py-12 grid md:grid-cols-2 gap-5">
   <article className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-7">
    <Activity className="text-blue-600 w-9 h-9"/>
    <h2 className="text-2xl font-bold mt-5">Mesurer mon débit</h2>
    <p className="text-zinc-500 mt-3">Ouvrez Cloudflare Speed Test pour obtenir une mesure réelle de votre connexion. Pour un résultat plus représentatif, coupez les téléchargements et privilégiez une liaison Ethernet.</p>
    <a href="https://speed.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-4 font-bold text-white">Ouvrir le test réel</a>
   </article>
   <article className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-7">
    <Wifi className="text-blue-600 w-9 h-9"/>
    <h2 className="text-2xl font-bold mt-5">Améliorer ma connexion</h2>
    <p className="text-zinc-500 mt-3">Comparez les tarifs publics des opérateurs puis demandez une mise en relation. La couverture et la vitesse accessible seront confirmées avant tout abonnement.</p>
    <Link href="/eligibilite" className="mt-6 inline-flex rounded-xl bg-zinc-900 dark:bg-white px-5 py-4 font-bold text-white dark:text-black">Demander une offre adaptée</Link>
   </article>
  </section>
  <p className="mx-auto max-w-4xl px-5 pb-12 text-xs text-zinc-500 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Les tests externes appliquent leur propre politique de confidentialité.</p>
 </main>
}
