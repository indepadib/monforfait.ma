'use client'
import {useEffect,useMemo,useState} from 'react'
import {supabase} from '@/lib/supabaseClient'
import {ArrowUpRight,ShieldCheck,Wifi,Smartphone,RefreshCcw} from 'lucide-react'
type Plan={id:string;title:string;category:'internet'|'mobile';price_dh:number;
 download_speed_mbps:number|null;mobile_data_gb:number|null;source_url:string|null;
 source_checked_at:string|null;operators:{name:string}|null}
export default function WidgetPage(){
 const [plans,setPlans]=useState<Plan[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [category,setCategory]=useState<'internet'|'mobile'>('internet')
 const [monthly,setMonthly]=useState('')
 async function load(){
  setLoading(true);setError('')
  const {data,error:e}=await supabase.from('plans')
   .select('id,title,category,price_dh,download_speed_mbps,mobile_data_gb,source_url,source_checked_at,operators(name)')
   .eq('is_active',true).order('price_dh',{ascending:true}).limit(100)
  if(e){setError('Catalogue temporairement indisponible.');setPlans([])}
  else setPlans((data||[]) as unknown as Plan[])
  setLoading(false)
 }
 useEffect(()=>{void load()},[])
 const offers=useMemo(()=>plans.filter(p=>p.category===category).slice(0,3),[plans,category])
 const current=Number(monthly)
 return <main className="min-h-screen bg-[#0b1220] text-white font-sans p-4 sm:p-5">
  <section className="max-w-lg mx-auto rounded-3xl bg-zinc-950 border border-white/10 shadow-xl overflow-hidden">
   <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 sm:p-6">
    <a href="https://monforfait.ma" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-100 uppercase font-black tracking-widest">MonForfait.ma</a>
    <h1 className="text-2xl md:text-3xl font-black mt-3">Comparez les tarifs télécoms</h1>
    <p className="text-sm text-blue-100 mt-3">Offres publiques sourcées au Maroc. Aucun compte ni partage de données personnelles.</p>
   </header>
   <div className="p-4 sm:p-6 space-y-5">
    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Type d'abonnement">
     <button type="button" onClick={()=>setCategory('internet')}
      className={'rounded-xl flex gap-2 items-center justify-center p-3 text-sm font-bold border '+(category==='internet'?'bg-blue-600 border-blue-400':'border-white/20 bg-zinc-900')}>
      <Wifi className="w-4 h-4"/> Fibre / Internet
     </button>
     <button type="button" onClick={()=>setCategory('mobile')}
      className={'rounded-xl flex gap-2 items-center justify-center p-3 text-sm font-bold border '+(category==='mobile'?'bg-blue-600 border-blue-400':'border-white/20 bg-zinc-900')}>
      <Smartphone className="w-4 h-4"/> Mobile
     </button>
    </div>
    <label className="block text-sm font-semibold">Votre dépense mensuelle actuelle (facultatif)
     <div className="flex gap-2 mt-2 items-center">
      <input type="number" min={0} max={10000} step="1" value={monthly} onChange={e=>setMonthly(e.target.value)}
       placeholder="Ex : 299" className="w-full min-w-0 bg-zinc-900 rounded-xl border border-white/20 p-3 text-white"/>
      <span className="text-zinc-400 text-sm">DH</span>
     </div>
    </label>
    <div className="flex items-center justify-between gap-3">
     <h2 className="font-bold">Offres publiques les moins chères</h2>
     <button type="button" aria-label="Actualiser les tarifs" onClick={()=>void load()} className="text-blue-300 p-2 rounded-lg"><RefreshCcw className="w-5 h-5"/></button>
    </div>
    {loading?<p className="text-zinc-400 text-sm py-8 text-center">Chargement du catalogue…</p>:
    error?<p role="alert" className="rounded-xl p-4 bg-red-950 text-red-200 text-sm">{error}</p>:
    offers.length===0?<p className="text-zinc-400 text-sm p-4">Aucune offre vérifiée pour cette catégorie.</p>:
    <div className="space-y-3">{offers.map(o=>{
     const difference=monthly!==''&&Number.isFinite(current)?current-Number(o.price_dh):null
     return <article key={o.id} className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 space-y-3">
      <div className="flex justify-between items-start gap-3">
       <div><p className="text-xs font-semibold text-blue-300">{o.operators?.name||'Opérateur'}</p>
        <h3 className="font-bold mt-1">{o.title}</h3>
        <p className="text-xs text-zinc-400 mt-1">{o.category==='internet'?(o.download_speed_mbps?o.download_speed_mbps+' Mb/s':'Débit à confirmer'):(o.mobile_data_gb?o.mobile_data_gb+' Go':'Data à confirmer')}</p>
       </div>
       <div className="text-right shrink-0"><p className="text-xl font-black">{Number(o.price_dh)} DH</p><p className="text-xs text-zinc-400">/ mois</p></div>
      </div>
      {difference!==null&&difference>0&&<p className="text-xs text-green-300">Écart tarifaire indicatif : {difference.toLocaleString('fr-MA')} DH/mois, à conditions et éligibilité à comparer.</p>}
      <div className="flex justify-between gap-3 items-center">
       <span className="text-[11px] text-zinc-400">Vérifié : {o.source_checked_at?new Date(o.source_checked_at).toLocaleDateString('fr-MA'):'Date inconnue'}</span>
       <a href={'https://monforfait.ma/offres/'+o.id} target="_blank" rel="noopener noreferrer"
        className="inline-flex gap-1 items-center text-sm text-blue-300 font-bold underline">Détails <ArrowUpRight className="w-4 h-4"/></a>
      </div>
     </article>
    })}</div>}
    <p className="flex gap-2 items-start text-xs text-zinc-400"><ShieldCheck className="w-5 h-5 text-blue-400 shrink-0"/> Comparaison indicative uniquement : pas de test de couverture, de lecture de facture ni de remise garantie. Vérifiez la fiche officielle et les conditions de souscription.</p>
   </div>
   <footer className="bg-zinc-900 border-t border-white/10 p-4 text-center">
    <a href="https://monforfait.ma/offers" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-300 underline">Comparer toutes les offres sur MonForfait.ma</a>
   </footer>
  </section>
 </main>
}
