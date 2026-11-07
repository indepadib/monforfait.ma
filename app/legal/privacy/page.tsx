import { Navigation } from '@/components/Navigation'
export default function PrivacyPage(){
 return <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">
  <Navigation/>
  <main className="max-w-3xl mx-auto px-5 py-24 space-y-5">
   <h1 className="text-4xl font-bold">Politique de confidentialité</h1>
   <p className="text-sm text-zinc-500">Mise à jour : 7 novembre 2026</p>
   <h2 className="text-xl font-semibold">Données recueillies</h2>
   <p>Lors d'une demande de mise en relation, MonForfait.ma recueille les coordonnées que vous fournissez (nom, téléphone, email facultatif, ville et adresse de raccordement) ainsi que votre besoin et votre préférence d'offre.</p>
   <h2 className="text-xl font-semibold">Finalités et partage</h2>
   <p>Ces informations servent à examiner la demande et, seulement avec votre accord explicite, à la communiquer à un opérateur ou un distributeur partenaire adapté pour qu'il puisse vous recontacter. La mise en relation peut faire l'objet d'une rémunération de MonForfait.ma par le partenaire. Aucune communication de données aux partenaires ne doit avoir lieu sans consentement vérifiable et cadre contractuel approprié.</p>
   <h2 className="text-xl font-semibold">Historique et consentement</h2>
   <p>Les demandes collectées avant la mise en place de la preuve de consentement à la transmission ne sont pas automatiquement considérées comme autorisées à être commercialisées. Vous pouvez demander le retrait de votre accord.</p>
   <h2 className="text-xl font-semibold">Conservation et sécurité</h2>
   <p>Les données sont conservées uniquement pour la durée nécessaire au traitement de la demande et aux obligations applicables. L'accès aux coordonnées est réservé aux personnes autorisées. Nous vérifions les mesures et formalités nécessaires auprès de la CNDP.</p>
   <h2 className="text-xl font-semibold">Vos droits</h2>
   <p>Conformément à la loi marocaine 09-08, vous pouvez demander l'accès, la rectification ou l'opposition au traitement de vos données en écrivant à <a className="underline" href="mailto:contact@monforfait.ma">contact@monforfait.ma</a>.</p>
  </main>
 </div>
}
