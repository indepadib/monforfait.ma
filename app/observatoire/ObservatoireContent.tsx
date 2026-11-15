"use client"

import { useEffect,useMemo,useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { supabase } from '@/lib/supabaseClient'
import { useTranslation } from '@/lib/LocaleContext'
import { ShieldCheck, TrendingDown, Wifi, Smartphone, ExternalLink } from 'lucide-react'

type Listing = {
 id:string;title:string;category:string;technology:string|null;
 price_dh:number;download_speed_mbps:number|null;source_url:string|null;
 source_checked_at:string|null;operators:{name:string}|null
}

export default function ObservatoireContent(){
 const {isRtl}=useTranslation()
 const [offers,setOffers]=useState<Listing[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 useEffect(()=>{
  let alive=true
  ;(async()=>{
   const {data,error:err}=await supabase.from('plans')
    .select('id,title,category,technology,price_dh,download_speed_mbps,source_url,source_checked_at,operators(name)')
    .eq('is_active',true).order('price_dh',{ascending:true}).limit(100)
   if(alive){setLoading(false);if(err)setError('Les tarifs ne sont pas disponibles actuellement.');else setOffers((data||[]) as unknown as Listing[])}
  })()
  return ()=>{alive=false}
 },[])
 const fibre=useMemo(()=>offers.filter(o=>o.technology==='FTTH'),[offers])
 const mobile=useMemo(()=>offers.filter(o=>o.category==='mobile'),[offers])
 const lowest=(list:Listing[])=>list.length?Math.min(...list.map(x=>Number(x.price_dh))):null
 const updated=offers.map(x=>x.source_checked_at).filter(Boolean).sort().at(-1)
 const checkedDate=updated?new Date(updated).toLocaleDateString('fr-FR'):'Non disponible'
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white" dir={isRtl?'rtl':'ltr'}>
  <Navigation/>
  <header className="bg-zinc-950 text-white pt-28 pb-16 px-5">
   <div className="mx-auto max-w-5xl">
    <p className="uppercase tracking-widest font-bold text-xs text-blue-300">Observatoire des prix publics</p>
    <h1 className="text-4xl md:text-5xl font-black mt-4">Tarifs télécom au Maroc</h1>
    <p className="text-zinc-300 text-lg mt-5 max-w-2xl">Une photographie des offres vérifiées auprès des opérateurs. Aucun volume de factures, chiffre de surfacturation ou historique de prix n'est inventé.</p>
   </div>
  </header>
  <div className="mx-auto max-w-6xl px-5 py-12 space-y-8">
   {error&&<p role="alert" className="bg-amber-50 rounded-xl p-4 text-amber-900">{error}</p>}
   <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5">
      <ShieldCheck className="w-7 h-7 text-blue-600"/><p className="mt-3 text-sm text-zinc-500">Offres référencées</p><p className="mt-1 text-3xl font-black">{loading?'…':offers.length}</p>
    </div>
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5">
      <Wifi className="w-7 h-7 text-blue-600"/><p className="mt-3 text-sm text-zinc-500">Offres fibre</p><p className="mt-1 text-3xl font-black">{loading?'…':fibre.length}</p>
    </div>
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5">
      <TrendingDown className="w-7 h-7 text-blue-600"/><p className="mt-3 text-sm text-zinc-500">Prix fibre le plus bas</p><p className="mt-1 text-3xl font-black">{loading?'…':lowest(fibre)===null?'—':lowest(fibre)+' DH'}</p>
    </div>
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5">
      <Smartphone className="w-7 h-7 text-blue-600"/><p className="mt-3 text-sm text-zinc-500">Prix mobile le plus bas</p><p className="mt-1 text-3xl font-black">{loading?'…':lowest(mobile)===null?'—':lowest(mobile)+' DH'}</p>
    </div>
   </div>
   <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-2xl p-5 text-sm text-blue-950 dark:text-blue-100">
    Vérification des sources : <strong>{checkedDate}</strong>. Il s'agit des tarifs affichés, non du coût total d'installation ou d'un engagement. Vérifiez la couverture, les frais, les conditions et les promotions éventuelles directement auprès de l'opérateur.
   </div>
   <section className="rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 overflow-hidden">
    <div className="p-5 border-b dark:border-zinc-800"><h2 className="text-2xl font-bold">Catalogue des tarifs publics</h2><p className="text-sm text-zinc-500 mt-2">Les prix mobiles ne sont pas directement comparables sans tenir compte de la data et des appels inclus.</p></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
      <thead className="bg-zinc-100 dark:bg-zinc-800"><tr><th className="p-4">Opérateur</th><th className="p-4">Offre</th><th className="p-4">Catégorie</th><th className="p-4">Mensualité</th><th className="p-4">Source</th></tr></thead>
      <tbody>{offers.map(o=><tr key={o.id} className="border-t border-zinc-100 dark:border-zinc-800">
        <td className="p-4 font-semibold">{o.operators?.name||'—'}</td><td className="p-4">{o.title}</td><td className="p-4">{o.technology==='FTTH'?'Fibre':o.category==='mobile'?'Mobile':'Autre'}</td>
        <td className="p-4 font-bold">{Number(o.price_dh)} DH</td>
        <td className="p-4">{o.source_url?<a href={o.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline text-blue-600 dark:text-blue-300">Offre officielle <ExternalLink className="w-3 h-3"/></a>:'Non sourcée'}</td>
       </tr>)}</tbody>
    </table></div>
   </section>
   <div className="flex flex-wrap gap-3">
    <Link href="/offers" className="rounded-xl bg-blue-600 text-white px-6 py-4 font-bold">Comparer les offres</Link>
    <Link href="/eligibilite" className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-6 py-4 font-bold">Demander une vérification</Link>
   </div>
  </div>
 </main>
}
