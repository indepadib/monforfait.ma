import {Navigation} from '@/components/Navigation'
import Link from 'next/link'
import type {Metadata} from 'next'
export const metadata:Metadata={title:'Mentions légales | MonForfait.ma'}
export default function MentionsPage(){
 return <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
  <Navigation/>
  <article className="max-w-3xl mx-auto px-5 pt-28 pb-16 space-y-6 leading-relaxed">
   <h1 className="text-4xl font-bold">Mentions légales</h1>
   <p className="text-sm text-zinc-500">Mise à jour le 15 novembre 2026</p>
   <h2 className="text-xl font-bold">Éditeur du service</h2>
   <p>MonForfait.ma est un service indépendant de comparaison des offres télécoms marocaines et de demandes de mise en relation. Il n’est pas un opérateur télécom et ne représente officiellement aucun opérateur sans convention commerciale appropriée.</p>
   <p>Pour toute demande relative à l’éditeur et au service, utilisez notre <Link className="text-blue-600 underline" href="/contact">formulaire de contact sécurisé</Link>. Les informations légales d’identification de l’entité exploitante (raison sociale, siège, immatriculation, le cas échéant) devront être renseignées et vérifiées avant une activité commerciale facturée.</p>
   <h2 className="text-xl font-bold">Hébergement et infrastructure</h2>
   <p>Le site web est déployé sur Netlify. Certaines données et fonctions du service reposent sur Supabase. Leur implantation, les transferts éventuels et leur conformité aux exigences marocaines doivent être vérifiés dans le cadre des formalités de protection des données applicables.</p>
   <h2 className="text-xl font-bold">Tarifs et comparaison</h2>
   <p>Les caractéristiques et prix affichés sont informatifs, issus de sources citées. Les conditions d’éligibilité, disponibilité, durée d’engagement, frais éventuels et souscription doivent être confirmées auprès de l’opérateur concerné.</p>
   <h2 className="text-xl font-bold">Propriété intellectuelle</h2>
   <p>Les marques et appellations des opérateurs appartiennent à leurs titulaires respectifs. Leur mention vise l’information du consommateur et n’implique aucun accord de partenariat officiel.</p>
  </article>
 </main>
}
