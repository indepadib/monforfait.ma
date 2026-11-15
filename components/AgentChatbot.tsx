'use client'
import {useEffect,useMemo,useState} from 'react'
import Link from 'next/link'
import {MessageCircle,X,Search,ShieldCheck,ArrowRight,Send,Wifi,Smartphone} from 'lucide-react'
import {supabase} from '@/lib/supabaseClient'
import {captureLead} from '@/lib/leadGateway'
import {LeadShareConsent} from '@/components/LeadShareConsent'

type Offer={id:string;title:string;category:string;price_dh:number;download_speed_mbps:number|null;mobile_data_gb:number|null;source_url:string|null;operators:{name:string}|null}

export function AgentChatbot(){
 const [opened,setOpened]=useState(false)
 const [type,setType]=useState<'internet'|'mobile'>('internet')
 const [budget,setBudget]=useState('')
 const [city,setCity]=useState('')
 const [name,setName]=useState('')
 const [phone,setPhone]=useState('')
 const [consent,setConsent]=useState(false)
 const [offers,setOffers]=useState<Offer[]>([])
 const [selected,setSelected]=useState<Offer|null>(null)
 const [loading,setLoading]=useState(false)
 const [saving,setSaving]=useState(false)
 const [sent,setSent]=useState(false)
 const [error,setError]=useState('')
 const [searched,setSearched]=useState(false)
 useEffect(()=>{
  if(!opened||searched)return
  let live=true
  ;(async()=>{
   setLoading(true)
   const {data,error:loadError}=await supabase.from('plans')
    .select('id,title,category,price_dh,download_speed_mbps,mobile_data_gb,source_url,operators(name)')
    .eq('is_active',true).order('price_dh',{ascending:true}).limit(100)
   if(live){setOffers((data||[]) as unknown as Offer[]);setError(loadError?'Catalogue indisponible actuellement.':'');setLoading(false);setSearched(true)}
  })()
  return()=>{live=false}
 },[opened,searched])
 const results=useMemo(()=>offers.filter(o=>o.category===type&&(!budget||Number(o.price_dh)<=Number(budget))).slice(0,4),[offers,type,budget])
 async function submit(e:React.FormEvent){
  e.preventDefault()
  if(!consent){setError('Merci de confirmer votre accord pour une mise en relation.');return}
  setError('');setSaving(true)
  try{
   await captureLead({
    user_name:name,user_phone:phone,city:city.trim(),status:'new',
    consent_to_share:true,consent_voice:false,selected_plan_id:selected?.id,
    needs_details:{source:'assistant_comparateur',interest:type,budget:budget?Number(budget):null,
      selected_offer:selected?{title:selected.title,operator:selected.operators?.name}:null}
   })
   setSent(true)
  }catch(e){setError(e instanceof Error?e.message:'Impossible d’enregistrer votre demande.')}
  finally{setSaving(false)}
 }
 return <>
  {!opened&&<button type="button" onClick={()=>setOpened(true)} aria-label="Ouvrir l'assistant de comparaison"
    className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-4 text-white shadow-xl hover:bg-blue-700">
    <MessageCircle className="w-5 h-5"/><span className="text-sm font-bold hidden sm:block">Assistant offres</span>
  </button>}
  {opened&&<section role="dialog" aria-label="Assistant de comparaison MonForfait" aria-modal="false"
   className="fixed bottom-20 right-2 left-2 sm:left-auto sm:right-5 md:bottom-5 z-50 w-auto sm:w-[430px] max-h-[82vh] overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-2xl flex flex-col">
   <header className="shrink-0 flex justify-between gap-3 items-center bg-zinc-950 px-5 py-4 text-white">
    <div><p className="text-xs text-blue-300 uppercase font-bold tracking-widest">MonForfait.ma</p>
     <h2 className="font-bold text-lg">Assistant de comparaison</h2></div>
    <button type="button" onClick={()=>setOpened(false)} aria-label="Fermer l'assistant" className="rounded-lg border border-zinc-700 p-2"><X className="w-5 h-5"/></button>
   </header>
   <div className="overflow-y-auto p-5 space-y-5">
    <p className="text-sm text-zinc-500">Je vous aide à comparer les tarifs publics du catalogue. Il ne s'agit ni d'un test de couverture ni d'une promesse de remise.</p>
    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Votre besoin">
     <button type="button" onClick={()=>{setType('internet');setSelected(null)}} className={`rounded-xl border p-3 flex items-center justify-center gap-2 text-sm font-semibold ${type==='internet'?'bg-blue-50 text-blue-700 border-blue-500 dark:bg-blue-950/40':'dark:border-zinc-700'}`}><Wifi className="w-4 h-4"/> Internet</button>
     <button type="button" onClick={()=>{setType('mobile');setSelected(null)}} className={`rounded-xl border p-3 flex items-center justify-center gap-2 text-sm font-semibold ${type==='mobile'?'bg-blue-50 text-blue-700 border-blue-500 dark:bg-blue-950/40':'dark:border-zinc-700'}`}><Smartphone className="w-4 h-4"/> Mobile</button>
    </div>
    <label className="block text-sm font-semibold">Budget maximum mensuel (facultatif)
     <input type="number" min={1} max={5000} value={budget} onChange={e=>{setBudget(e.target.value);setSelected(null)}}
      placeholder="Ex : 350 DH" className="mt-2 w-full rounded-xl border dark:border-zinc-700 dark:bg-zinc-950 px-4 py-3"/>
    </label>
    <div>
     <h3 className="flex items-center gap-2 text-sm font-bold mb-3"><Search className="w-4 h-4"/> Offres publiques correspondantes</h3>
     {loading?<p className="text-sm text-zinc-500">Chargement des sources officielles…</p>:
      results.length===0?<p className="text-sm text-zinc-500">Aucune offre dans cette sélection. <Link href="/offers" className="underline text-blue-600">Voir toutes les offres</Link>.</p>:
      <div className="space-y-2">{results.map(o=><button type="button" key={o.id} onClick={()=>setSelected(o)}
        className={`w-full text-left rounded-xl border p-3 ${selected?.id===o.id?'border-blue-500 bg-blue-50 dark:bg-blue-950/30':'dark:border-zinc-700'}`}>
        <div className="flex justify-between gap-3"><span className="text-sm font-semibold">{o.operators?.name} — {o.title}</span>
         <span className="font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">{Number(o.price_dh)} DH</span></div>
        <span className="block mt-1 text-xs text-zinc-500">{o.category==='internet'?`${o.download_speed_mbps||'?'} Mb/s annoncés`:`${o.mobile_data_gb||'?'} Go de données`}</span>
       </button>)}</div>}
     {selected?.source_url&&<a href={selected.source_url} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1 underline mt-3 text-blue-600">Vérifier le tarif sur le site officiel <ArrowRight className="w-3 h-3"/></a>}
    </div>
    {!sent?<form onSubmit={submit} className="border-t dark:border-zinc-700 pt-5 space-y-3">
     <h3 className="text-lg font-bold">Demander une mise en relation</h3>
     <p className="text-xs text-zinc-500">Facultatif : votre recherche n'envoie aucune donnée personnelle tant que vous ne soumettez pas ce formulaire.</p>
     <label className="block text-sm">Nom
      <input required minLength={2} maxLength={120} value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full rounded-xl border dark:border-zinc-700 dark:bg-zinc-950 p-3"/>
     </label>
     <label className="block text-sm">Téléphone marocain
      <input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="06xxxxxxxx" className="mt-1 block w-full rounded-xl border dark:border-zinc-700 dark:bg-zinc-950 p-3"/>
     </label>
     <label className="block text-sm">Ville
      <input required minLength={2} value={city} onChange={e=>setCity(e.target.value)} className="mt-1 block w-full rounded-xl border dark:border-zinc-700 dark:bg-zinc-950 p-3"/>
     </label>
     <LeadShareConsent checked={consent} onChange={setConsent}/>
     {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}
     <button type="submit" disabled={saving||!consent} className="w-full rounded-xl bg-blue-600 text-white font-semibold py-3 flex justify-center gap-2 items-center disabled:opacity-40"><Send className="w-4 h-4"/>{saving?'Enregistrement…':'Envoyer ma demande'}</button>
    </form>:<div role="status" className="rounded-xl bg-green-50 text-green-900 p-4">
      <ShieldCheck className="w-6 h-6 text-green-600"/>
      <h3 className="mt-2 font-bold">Demande enregistrée</h3>
      <p className="text-sm mt-2">La disponibilité d'un partenaire et de l'offre doit être confirmée.</p>
      <Link href="/suivi" className="inline-block mt-3 font-bold underline">Suivre ma demande</Link>
     </div>}
    <p className="text-xs text-zinc-500">La comparaison est informative, sans garantie d’activation ou de disponibilité.</p>
   </div>
  </section>}
 </>
}
