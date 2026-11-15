import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {Navigation} from '@/components/Navigation'
import {OfferCard,type OfferProps} from '@/components/OfferCard'
import {supabase} from '@/lib/supabaseClient'
import {ShieldCheck,ExternalLink,ArrowLeft,Wifi,Smartphone} from 'lucide-react'
export const dynamic='force-dynamic'
const OPERATORS:Record<string,{name:string;dbName:string;description:string}>={
 inwi:{name:'inwi',dbName:'Inwi',description:'Découvrez les tarifs publics des forfaits inwi référencés et sourcés.'},
 orange:{name:'Orange Maroc',dbName:'Orange Morocco',description:'Comparez les forfaits Orange Maroc figurant dans notre catalogue sourcé.'},
 iam:{name:'Maroc Telecom',dbName:'Maroc Telecom',description:'Retrouvez les offres Maroc Telecom disponibles dans le référentiel MonForfait.'}
}
type Props={params:Promise<{slug:string}>}
export function generateStaticParams(){return Object.keys(OPERATORS).map(slug=>({slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params
 const op=OPERATORS[slug?.toLowerCase()]
 if(!op)return{title:'Opérateur introuvable'}
 return{
  title:`Offres Internet et Mobile ${op.name} — Tarifs publics au Maroc`,
  description:`Comparez les prix publics internet et mobile ${op.name}, les caractéristiques et les sources officielles. Disponibilité et raccordement à confirmer.`,
  alternates:{canonical:`https://monforfait.ma/operateurs/${slug.toLowerCase()}`}
 }
}
export default async function OperatorPage({params}:Props){
 const {slug}=await params
 const config=OPERATORS[slug?.toLowerCase()]
 if(!config)notFound()
 const {data,error}=await supabase.from('plans')
  .select('id,title,category,price_dh,download_speed_mbps,upload_speed_mbps,mobile_data_gb,voice_minutes,technology,target_audience,source_url,source_checked_at,operators!inner(name)')
  .eq('is_active',true).eq('operators.name',config.dbName)
  .order('price_dh',{ascending:true})
 const offers:OfferProps[]=(data||[]).map((o:any)=>({
  id:o.id,title:o.title,operator_name:config.name,
  category:o.category,price_dh:Number(o.price_dh),
  download_speed:o.download_speed_mbps,upload_speed:o.upload_speed_mbps,
  mobile_data_gb:o.mobile_data_gb,voice_minutes:o.voice_minutes,technology:o.technology,
  target_audience:o.target_audience||'individual',
  source_url:o.source_url,source_checked_at:o.source_checked_at
 }))
 const fibre=offers.filter(o=>o.category==='internet').length
 const mobile=offers.filter(o=>o.category==='mobile').length
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
  <Navigation/>
  <header className="bg-zinc-950 text-white pt-28 pb-16 px-5">
   <div className="max-w-6xl mx-auto">
    <Link href="/offers" className="text-blue-300 text-sm inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Toutes les offres</Link>
    <p className="mt-9 text-sm uppercase font-bold tracking-widest text-blue-300">Comparaison indépendante</p>
    <h1 className="mt-4 text-4xl md:text-6xl font-black">Forfaits {config.name}</h1>
    <p className="mt-5 max-w-2xl text-zinc-300 text-lg">{config.description} MonForfait.ma ne représente pas officiellement cet opérateur et ne garantit pas de tarifs exclusifs.</p>
    <div className="flex flex-wrap gap-3 mt-7">
     <span className="inline-flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 text-sm"><Wifi className="w-4 h-4"/>{fibre} offre(s) internet</span>
     <span className="inline-flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 text-sm"><Smartphone className="w-4 h-4"/>{mobile} offre(s) mobile</span>
    </div>
   </div>
  </header>
  <div className="max-w-6xl mx-auto px-5 py-12 space-y-7">
   <div className="flex flex-wrap gap-4 justify-between items-center">
    <div><h2 className="text-2xl font-bold">Tarifs publics référencés</h2><p className="text-sm text-zinc-500 mt-2">Triés par prix mensuel croissant. Source et date de vérification sur chaque fiche.</p></div>
    <Link href="/offers" className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-5 py-3 font-semibold text-sm">Comparer tous les opérateurs</Link>
   </div>
   {error?<p role="alert" className="rounded-xl bg-red-50 text-red-700 p-5">Impossible de charger les offres de cet opérateur actuellement.</p>:
    offers.length===0?<div className="rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-10 text-center">
     <p className="font-bold">Aucune offre vérifiée disponible pour le moment.</p>
     <p className="text-zinc-500 text-sm mt-3">Consultez les autres opérateurs ou réessayez après la prochaine révision du catalogue.</p>
     <Link href="/offers" className="text-blue-600 underline inline-block mt-4">Voir le comparateur complet</Link>
    </div>:
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
     {offers.map(o=><div key={o.id} className="space-y-2"><OfferCard offer={o}/>
      <Link href={`/offres/${o.id}`} className="text-xs text-blue-600 underline inline-flex items-center gap-2">Fiche complète et conditions <ExternalLink className="w-3 h-3"/></Link>
     </div>)}
    </div>}
   <aside className="rounded-2xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex gap-4 items-start">
    <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0"/>
    <p className="text-sm text-zinc-600 dark:text-zinc-400">La couverture, l'éligibilité technique, les frais d'installation, les éventuels engagements et le prix final dépendent de l'opérateur et de l'adresse de raccordement. Vérifiez toujours la source officielle avant une souscription.</p>
   </aside>
  </div>
 </main>
}
