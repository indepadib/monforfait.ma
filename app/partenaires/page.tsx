import type {Metadata} from 'next'
import PartenairesContent from './PartenairesContent'
export const metadata:Metadata={
 title:'Partenariats télécoms au Maroc — Distributeurs & widget',
 description:'Distribuez des demandes télécoms sous contrat et consentement, ou intégrez gratuitement le comparateur public MonForfait.ma. Découvrez nos parcours.',
 alternates:{canonical:'https://monforfait.ma/partenaires'},
 openGraph:{
  title:'Devenir partenaire MonForfait.ma',
  description:'Un pilote commercial de mise en relation encadré, ou un widget public gratuit à intégrer sur votre site.',
  url:'https://monforfait.ma/partenaires',
  type:'website'
 }
}
export default function PartenairesPage(){return <PartenairesContent/>}
