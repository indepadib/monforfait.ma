import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {supabase} from '@/lib/supabaseClient'
import OfferDetailsContent from './OfferDetailsContent'
import type {OfferProps} from '@/components/OfferCard'
export const dynamic='force-dynamic'
type Props={params:Promise<{slug:string}>}
const slugify=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
async function getOffer(slug:string):Promise<OfferProps|null>{
 if(!slug||slug.length>160)return null
 let query=supabase.from('plans')
  .select('id,title,category,price_dh,download_speed_mbps,upload_speed_mbps,mobile_data_gb,voice_minutes,technology,target_audience,source_url,source_checked_at,operators(name)')
  .eq('is_active',true)
 if(uuid.test(slug))query=query.eq('id',slug)
 else query=query.limit(200)
 const {data,error}=await query
 if(error||!data?.length)return null
 const rows=uuid.test(slug)?data:data.filter(o=>
  slugify(o.title)===slug || slugify(((o.operators as any)?.name||'')+'-'+o.title)===slug)
 const offer=rows[0] as any
 if(!offer)return null
 return{
  id:offer.id,title:offer.title,operator_name:offer.operators?.name||'Opérateur',
  category:offer.category,price_dh:Number(offer.price_dh),download_speed:offer.download_speed_mbps,
  upload_speed:offer.upload_speed_mbps,mobile_data_gb:offer.mobile_data_gb,
  voice_minutes:offer.voice_minutes,technology:offer.technology,
  target_audience:offer.target_audience||'individual',
  source_url:offer.source_url,source_checked_at:offer.source_checked_at
 }
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params
 const offer=await getOffer(slug)
 if(!offer)return{title:'Offre indisponible',robots:{index:false,follow:false}}
 return{
  title:offer.title+' | '+offer.operator_name+' — Tarif au Maroc',
  description:'Consultez le tarif public de '+offer.title+' ('+offer.operator_name+'), ses caractéristiques, sa source et sa date de vérification. Éligibilité à confirmer.',
  alternates:{canonical:'https://monforfait.ma/offres/'+offer.id},
  openGraph:{title:offer.title+' — '+offer.operator_name,
    description:'Forfait '+(offer.category==='mobile'?'mobile':'internet')+' au tarif public référencé de '+offer.price_dh+' DH/mois.'}
 }
}
export default async function OfferDetailsPage({params}:Props){
 const {slug}=await params
 const offer=await getOffer(slug)
 if(!offer)notFound()
 return <OfferDetailsContent offer={offer}/>
}
