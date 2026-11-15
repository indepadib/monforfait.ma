import { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

type Props = {params: Promise<{slug:string}>}
type Listing = {title:string;price_dh:number;download_speed_mbps:number|null;source_url:string|null;source_checked_at:string|null;operators:{name:string}|null}

const operatorNames: Record<string,string> = {
  orange:'Orange Morocco',inwi:'Inwi',
  'maroc-telecom':'Maroc Telecom',maroctelecom:'Maroc Telecom',iam:'Maroc Telecom'
}
function parse(slug:string){
  const parts=slug.split('-vs-')
  if(parts.length!==2) return null
  const a=operatorNames[parts[0]],b=operatorNames[parts[1]]
  return a&&b&&a!==b?[a,b]:null
}
const label=(name:string)=>name==='Orange Morocco'?'Orange Maroc':name
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const pair=parse((await params).slug)
 if(!pair)return {title:'Comparateur fibre — MonForfait.ma'}
 return {title:`Fibre ${label(pair[0])} vs ${label(pair[1])} | Tarifs vérifiés Maroc`,
 description:'Comparaison des tarifs publics des offres fibre, d’après les pages officielles. Éligibilité et conditions à confirmer.'}
}
export default async function VersusPage({params}:Props){
 const pair=parse((await params).slug)
 if(!pair)notFound()
 const {data,error}=await supabase.from('plans')
  .select('title,price_dh,download_speed_mbps,source_url,source_checked_at,operators(name)')
  .eq('is_active',true).eq('technology','FTTH')
  .order('price_dh',{ascending:true})
 const offers=((data||[]) as unknown as Listing[]).filter(row=>pair.includes(row.operators?.name||''))
 const speeds=[20,50,100,200,500,1000]
 const grouped=pair.map(name=>offers.filter(p=>p.operators?.name===name))
 const best=(group:Listing[],speed:number)=>group.find(p=>p.download_speed_mbps===speed)
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
  <Navigation/>
  <section className="bg-zinc-950 text-white pt-28 pb-16 px-5 text-center">
   <p className="text-blue-300 text-xs tracking-widest font-bold uppercase mb-5">Comparatif factuel • Maroc</p>
   <h1 className="max-w-5xl mx-auto text-4xl md:text-5xl font-black">{label(pair[0])} vs {label(pair[1])}</h1>
   <p className="max-w-2xl mx-auto mt-5 text-zinc-300">Les tarifs fibre annoncés par les opérateurs, sans notes arbitraires ni classement fictif.</p>
  </section>
  <section className="max-w-5xl mx-auto px-4 py-12 space-y-6">
   <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-5 text-sm">
    Les tarifs sont indicatifs et ont été consultés le <strong>15 novembre 2026</strong>. Les vitesses sont les débits annoncés, non des mesures de performance réelle. La couverture, les frais et les conditions sont à confirmer auprès de l’opérateur.
   </div>
   <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
    <table className="w-full min-w-[580px] text-left">
     <thead><tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
      <th className="p-5">Débit descendant annoncé</th>
      {pair.map(n=><th key={n} className="p-5">{label(n)}</th>)}
     </tr></thead>
     <tbody>{speeds.map(speed=><tr key={speed} className="border-b border-zinc-100 dark:border-zinc-800">
       <td className="p-5 font-semibold">{speed===1000?'1 Gb/s':speed+' Mb/s'}</td>
       {grouped.map((group,i)=>{const item=best(group,speed);return <td key={pair[i]} className="p-5">
         {item?<><strong className="text-lg">{item.price_dh} DH/mois</strong>
           {item.source_url&&<a href={item.source_url} target="_blank" rel="noopener noreferrer" className="block mt-1 text-xs underline text-blue-700 dark:text-blue-300">Voir la source officielle</a>}
          </>:<span className="text-zinc-400">Offre non vérifiée</span>}
       </td>})}
      </tr>)}</tbody>
    </table>
   </div>
   {error&&<p className="text-sm text-amber-700">Données des offres momentanément indisponibles.</p>}
   <div className="flex flex-wrap gap-3">
    <Link href="/offers?category=internet" className="rounded-xl bg-blue-600 px-6 py-4 text-white font-bold">Comparer toutes les offres</Link>
    <Link href="/eligibilite" className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-6 py-4 font-bold">Demander une mise en relation</Link>
   </div>
   <p className="text-xs text-zinc-500">MonForfait.ma est un service indépendant de comparaison. La présence d’un opérateur dans ce tableau ne signifie pas qu’un partenariat commercial existe avec lui.</p>
  </section>
 </main>
}
