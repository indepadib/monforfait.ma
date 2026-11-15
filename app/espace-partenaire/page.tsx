import type {Metadata} from 'next'
import {PartnerWorkspace} from '@/components/PartnerWorkspace'
export const metadata:Metadata={title:'Espace partenaire privé | MonForfait.ma',
 description:'Gestion sécurisée de demandes télécom confiées à un partenaire autorisé.',robots:{index:false,follow:false}}
export default function PartnerPage(){return <PartnerWorkspace/>}
