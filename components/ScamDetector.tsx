"use client"

import { useEffect,useMemo,useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Search, ArrowRight, ShieldCheck } from 'lucide-react'

type Offer={
 id:string;title:string;price_dh:number;category:string;technology:string|null;
 download_speed_mbps:number|null;source_url:string|null;source_checked_at:string|null;
 operators:{name:string}|null
}
export function ScamDetector(){
 const [type,setType]=useState('fibre')
 const [speed,setSpeed]=useState('100')
 const [monthly,setMonthly]=useState('')
 const [offers,setOffers]=useState<Offer[]>([])
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading')
 const [show,setShow]=useState(false)
 useEffect(()=>{
  let mounted=true
  ;(async()=>{
   const {data,error}=await supabase.from('plans')
      .select('id,title,price_dh,category,technology,download_speed_mbps,source_url,source_checked_at,operators(name)')
      .eq('is_active',true).limit(100)
   if(mounted){setStatus(error?'error':'ready');setOffers((data||[]) as unknown as Offer[])}
  })()
  return ()=>{mounted=false}
 },[])
 const matched=useMemo(()=>offers.filter(o=>type==='fibre'
   ? o.category==='internet'&&o.technology==='FTTH'&&o.download_speed_mbps===Number(speed)
   : o.category==='mobile').sort((a,b)=>Number(a.price_dh)-Number(b.price_dh)),[offers,type,speed])
 const price=Number(monthly)
 const valid=Number.isFinite(price)&&price>0&&price<50000
 const cheap=matched[0]
 const difference=cheap&&valid?Math.max(0,price-Number(cheap.price_dh)):0
 return <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 sm:p-8 text-white shadow-xl">
  <div className="flex items-center gap-2 text-blue-300 mb-3 text-xs font-black uppercase tracking-widest">
   <Search className="w-4 h-4"/> Comparateur de prix publics
  </div>
  <h2 className="text-2xl sm:text-3xl font-black mb-3">Votre forfait actuel est-il compétitif ?</h2>
  <p className="text-zinc-300 text-sm mb-6">Comparez votre facture à des tarifs annoncés sur les sites officiels. Nous ne testons pas votre réseau et ne disposons pas de tarifs privés cachés.</p>
  <form onSubmit={e=>{e.preventDefault();setShow(true)}} className="space-y-4">
   <label className="block text-sm font-semibold">Votre type d'abonnement
    <select value={type} onChange={e=>{setType(e.target.value);setShow(false)}} className="mt-2 block w-full rounded-xl bg-zinc-800 border border-white/20 px-4 py-3">
     <option value="fibre">Fibre optique</option><option value="mobile">Forfait mobile</option>
    </select>
   </label>
   {type==='fibre'&&<label className="block text-sm font-semibold">Débit de référence
    <select value={speed} onChange={e=>{setSpeed(e.target.value);setShow(false)}} className="mt-2 block w-full rounded-xl bg-zinc-800 border border-white/20 px-4 py-3">
     {[20,50,100,200,500,1000].map(n=><option key={n} value={n}>{n===1000?'1 Gb/s':n+' Mb/s'}</option>)}
    </select>
   </label>}
   <label className="block text-sm font-semibold">Votre mensualité actuelle en DH
    <input required type="number" min={1} max={50000} step="1" value={monthly} onChange={e=>{setMonthly(e.target.value);setShow(false)}}
     placeholder="Ex : 349" className="mt-2 block w-full rounded-xl bg-zinc-800 border border-white/20 px-4 py-3 text-white"/>
   </label>
   <button type="submit" disabled={status!=='ready'||!valid} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-4 px-5 font-bold disabled:opacity-50">
    {status==='loading'?'Chargement des tarifs…':'Comparer avec les tarifs publics'}
   </button>
  </form>
  {status==='error'&&<p role="alert" className="mt-4 text-amber-300 text-sm">Catalogue temporairement indisponible. Consultez la page des offres.</p>}
  {show&&status==='ready'&&<div className="mt-6 rounded-xl border border-blue-400/20 bg-blue-950/30 p-5 space-y-3">
    <p className="text-sm text-zinc-300">Pour {type==='fibre'?speed+' Mb/s':'les forfaits mobiles'} : {matched.length} tarif(s) public(s) répertorié(s).</p>
    {cheap?<><p className="text-xl font-bold">Prix le plus bas dans cette sélection : {Number(cheap.price_dh)} DH/mois</p>
      <p className="text-sm">Écart arithmétique avec votre facture : {difference.toFixed(0)} DH/mois. {type==='mobile'?'Les volumes de data et d’appels varient selon les offres.':'Le débit annoncé ne suffit pas à démontrer une équivalence de service.'}</p>
      {cheap.source_url&&<a href={cheap.source_url} target="_blank" rel="noopener noreferrer" className="text-sm underline text-blue-300">Vérifier le tarif sur le site officiel</a>}
    </>:<p className="text-sm">Aucun tarif vérifié dans cette catégorie pour l’instant.</p>}
    <p className="text-xs text-zinc-300">Il ne s'agit pas d'une économie garantie. L'éligibilité, les frais, les options et les conditions contractuelles peuvent modifier la comparaison.</p>
  </div>}
  <div className="mt-5 flex flex-wrap gap-3 items-center">
    <Link href="/offers" className="inline-flex items-center gap-2 font-bold text-sm text-blue-300">Toutes les offres <ArrowRight className="w-4 h-4"/></Link>
    <Link href="/eligibilite" className="inline-flex items-center gap-2 text-sm text-zinc-200">Demander un rappel</Link>
  </div>
  <p className="mt-5 flex gap-2 text-xs text-zinc-400"><ShieldCheck className="w-4 h-4 shrink-0"/>Aucune donnée personnelle n'est nécessaire pour cette comparaison.</p>
 </section>
}
