import {Navigation} from '@/components/Navigation'
import Link from 'next/link'
import type {Metadata} from 'next'
export const metadata:Metadata={title:'Protection des données personnelles | MonForfait.ma'}
export default function PrivacyPage(){
 return <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
  <Navigation/>
  <article className="max-w-3xl mx-auto px-5 pt-28 pb-20 space-y-6 leading-relaxed">
   <h1 className="text-4xl font-bold">Politique de confidentialité</h1>
   <p className="text-sm text-zinc-500">Mise à jour : 15 novembre 2026</p>
   <h2 className="text-xl font-bold">Demandes d’offres et consentement</h2>
   <p>Lorsque vous demandez une mise en relation, nous enregistrons les informations que vous avez saisies (nom, téléphone, email éventuel, ville, adresse, besoin et préférence d’offre), la date et la version de votre consentement. Les offres peuvent être comparées sans transmettre ces données.</p>
   <p>La transmission d’un dossier à un opérateur ou à un distributeur partenaire nécessite votre accord explicite et une validation contractuelle. Le partenaire peut rémunérer MonForfait.ma au titre d’une mise en relation ou d’une activation effectivement vérifiée. Un prospect non consentant ne doit pas être transmis.</p>
   <h2 className="text-xl font-bold">Retirer votre consentement</h2>
   <p>Après une nouvelle demande, vous recevez une référence confidentielle de suivi. Depuis <Link href="/suivi" className="text-blue-600 underline">Suivre ma demande</Link>, vous pouvez retirer votre accord de mise en relation. Dans notre système, cela empêche les transmissions futures et met fin aux accès partenaires encore actifs. Si un partenaire a déjà consulté votre demande, son traitement antérieur relève également de ses obligations propres ; un retrait ne signifie pas effacement automatique de ses sauvegardes légalement conservées.</p>
   <p>Si vous avez perdu votre référence, utilisez le <Link href="/contact" className="text-blue-600 underline">formulaire de contact</Link> en sélectionnant « Données personnelles », afin que l’équipe vérifie votre identité avant de traiter votre demande.</p>
   <h2 className="text-xl font-bold">Messages d’assistance</h2>
   <p>Un message envoyé via le formulaire de contact est stocké dans une boîte privée distincte du registre commercial. Il est utilisé pour traiter votre demande, sans être transformé automatiquement en prospect ou communiqué à un distributeur.</p>
   <h2 className="text-xl font-bold">Conservation et destinataires</h2>
   <p>Les données sont conservées pour le traitement des demandes et les éventuelles obligations légales ou contractuelles. Leur accès est limité aux comptes autorisés. Les durées exactes de conservation, mesures techniques, lieux de stockage et transferts éventuels doivent être formalisés avec les prestataires concernés.</p>
   <h2 className="text-xl font-bold">Cookies et mesure d’audience</h2>
   <p>Les cookies nécessaires au fonctionnement peuvent être utilisés. Les scripts de statistiques et de publicité sont conditionnés à votre accord depuis la bannière de choix. Vous pouvez modifier ce choix dans le pied de page du site.</p>
   <h2 className="text-xl font-bold">Vos droits et cadre marocain</h2>
   <p>Pour accéder à vos données, les rectifier, demander une opposition ou exercer les droits applicables, écrivez-nous via le <Link href="/contact" className="text-blue-600 underline">formulaire de confidentialité</Link>. La mise en conformité avec la loi marocaine 09-08 et les formalités auprès de la CNDP doit être confirmée ; cette politique n’est pas une déclaration de certification.</p>
  </article>
 </main>
}
