import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { RequestTracker } from '@/components/RequestTracker'
export const metadata:Metadata={
 title:'Suivre ma demande — MonForfait.ma',
 description:'Consultez uniquement le statut de votre demande avec une référence privée.',
 robots:{index:false,follow:false}
}
export default function TrackingPage(){
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
  <Navigation/>
  <section className="px-5 pt-28 pb-14 bg-zinc-950 text-white">
   <div className="max-w-3xl mx-auto">
    <p className="text-sm uppercase tracking-widest font-bold text-blue-300">Espace personnel</p>
    <h1 className="text-4xl md:text-5xl font-black mt-4">Suivre ma demande</h1>
    <p className="mt-4 text-zinc-300 max-w-2xl">Consultez les étapes de traitement sans créer de compte. Votre référence ne donne jamais accès aux coordonnées ni aux informations commerciales confidentielles.</p>
   </div>
  </section>
  <RequestTracker/>
 </main>
}
