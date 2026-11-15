'use client'
import {useCallback,useEffect,useState} from 'react'
import Link from 'next/link'
import {supabase} from '@/lib/supabaseClient'
import {Building2,ShieldCheck,ExternalLink} from 'lucide-react'

export type BusinessPartner={
 id:string;business_name:string;business_email:string|null;contact_name?:string|null;contact_phone?:string|null;
 partner_type:string;regions?:string|null;services?:string|null;estimated_volume?:string|null;source?:string;
 sales_status:string;contract_reference?:string|null;contract_verified_at?:string|null
}
type Feedback={id:string;sale_id:string;partner_id:string;outcome:string;notes:string|null;created_at:string}
const stages=['prospect','inbound','contacted','pilot','contracted','active','rejected']

function PartnerCard({partner,onChanged}: {partner:BusinessPartner;onChanged:()=>void}){
 const [stage,setStage]=useState(partner.sales_status)
 const [contract,setContract]=useState(partner.contract_reference||'')
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [message,setMessage]=useState('')
 async function update(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError('');setMessage('')
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
   body:{action:'admin.update_partner',partner_id:partner.id,sales_status:stage,contract_reference:contract}
  })
  setBusy(false)
  if(invokeError||!data?.success){setError(data?.error||'Statut non enregistré.');return}
  setMessage('Statut du partenaire mis à jour.');onChanged()
 }
 async function link(){
  setBusy(true);setError('');setMessage('')
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{body:{
   action:'admin.partner.link',partner_id:partner.id
  }})
  setBusy(false)
  if(invokeError||!data?.success){setError(data?.error||'Activation du compte refusée.');return}
  setMessage('Identité du contact reliée au compte partenaire.')
 }
 return <article className="rounded-2xl border bg-zinc-50 p-5 space-y-4">
  <div className="flex gap-3 items-start">
   <Building2 className="w-7 h-7 text-blue-600 shrink-0"/>
   <div><h3 className="font-bold text-lg">{partner.business_name}</h3>
    <p className="text-sm text-zinc-500">{partner.contact_name||partner.partner_type} · {partner.sales_status}</p>
    <p className="mt-1 text-xs text-zinc-500">Provenance : {partner.source||'manuel'}</p>
   </div>
  </div>
  {partner.business_email&&<a href={`mailto:${partner.business_email}`} className="text-sm underline text-blue-700 break-all">{partner.business_email}</a>}
  {partner.contact_phone&&<p className="text-sm">{partner.contact_phone}</p>}
  <p className="text-sm text-zinc-600">Zones : {partner.regions||'Non renseignées'} · Offres : {partner.services||'À définir'} · Capacité : {partner.estimated_volume||'À évaluer'}</p>
  <form onSubmit={update} className="space-y-3 border-t pt-4">
   <label className="block text-sm">Étape relation commerciale
    <select value={stage} onChange={e=>setStage(e.target.value)} className="w-full mt-2 rounded-xl border p-3 bg-white">
     {stages.map(x=><option key={x} value={x}>{x}</option>)}
    </select>
   </label>
   {(['contracted','active'].includes(stage))&&<label className="block text-sm">Référence du contrat signé *
    <input required minLength={6} maxLength={180} value={contract} onChange={e=>setContract(e.target.value)} placeholder="Contrat signé — référence vérifiable"
     className="w-full mt-2 rounded-xl border p-3 bg-white"/>
   </label>}
   <button type="submit" disabled={busy} className="rounded-xl bg-zinc-900 text-white py-3 px-5 text-sm font-bold disabled:opacity-50">Enregistrer le statut</button>
  </form>
  {partner.contract_verified_at&&<p className="flex items-center gap-2 text-xs text-green-700"><ShieldCheck className="w-4 h-4"/>Contrat enregistré le {new Date(partner.contract_verified_at).toLocaleDateString('fr-MA')} ({partner.contract_reference})</p>}
  {partner.contract_verified_at&&(['contracted','active'].includes(partner.sales_status))&&
   <div className="rounded-xl bg-white border p-4">
    <p className="text-sm font-semibold">Associer le compte utilisateur</p>
    <p className="text-xs text-zinc-500 mt-2">Le contact doit d'abord se connecter sur <Link href="/login?tab=partner" className="underline text-blue-700">l'espace partenaire</Link> avec l'email ci-dessus et confirmer son adresse. Cette action active uniquement son accès, sans lui transmettre de dossier.</p>
    <button type="button" disabled={busy||!partner.business_email} onClick={link} className="mt-3 text-sm font-bold rounded-lg border border-blue-600 text-blue-700 px-4 py-2">Vérifier et associer le compte</button>
   </div>}
  {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
  {message&&<p role="status" className="text-sm text-green-700">{message}</p>}
 </article>
}
export function AdminPartnerManager({partners,onChanged}: {partners:BusinessPartner[];onChanged:()=>void}){
 const [name,setName]=useState('')
 const [email,setEmail]=useState('')
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [feedback,setFeedback]=useState<Feedback[]>([])
 const reload=useCallback(async()=>{
  const {data,error}=await supabase.functions.invoke('leads-gateway',{body:{action:'admin.partner.feedback'}})
  if(!error&&data?.success)setFeedback(data.feedback||[])
 },[])
 useEffect(()=>{void reload()},[reload])
 async function create(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError('')
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
    body:{action:'admin.create_partner',business_name:name,business_email:email}
  })
  setBusy(false)
  if(invokeError||!data?.success){setError(data?.error||'Partenaire non enregistré.');return}
  setName('');setEmail('');onChanged()
 }
 return <section className="rounded-2xl border bg-white p-5 md:p-7 space-y-6">
  <div><p className="text-xs uppercase tracking-wider text-blue-700 font-bold">Distribution et revenus</p>
   <h2 className="text-2xl font-bold mt-1">Partenaires commerciaux</h2>
   <p className="text-sm text-zinc-500 mt-2">La prise de contact n'est pas un contrat. L'accès aux dossiers exige un accord signé, un compte authentifié et une affectation explicite.</p>
  </div>
  <form onSubmit={create} className="grid md:grid-cols-3 gap-3">
   <label className="text-sm">Société<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full border rounded-xl p-3" placeholder="Distributeur télécom"/></label>
   <label className="text-sm">Email professionnel<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full border rounded-xl p-3"/></label>
   <button type="submit" disabled={busy} className="self-end rounded-xl bg-blue-600 text-white font-bold p-3 disabled:opacity-50">Ajouter le prospect partenaire</button>
  </form>
  {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
  <div className="grid lg:grid-cols-2 gap-4">{partners.length?partners.map(p=><PartnerCard key={p.id} partner={p} onChanged={onChanged}/>):
   <p className="text-zinc-500 text-sm">Aucun partenaire enregistré. La <Link href="/partenaires" className="underline text-blue-600">page de candidature B2B</Link> est ouverte.</p>}
  </div>
  <div className="border-t pt-5">
   <div className="flex justify-between items-center gap-3"><h3 className="text-lg font-bold">Retours transmis par les partenaires</h3>
    <button type="button" onClick={()=>void reload()} className="text-sm font-semibold text-blue-700 underline">Actualiser</button>
   </div>
   {feedback.length===0?<p className="text-sm text-zinc-500 mt-4">Aucun retour partenaire enregistré.</p>:
    <div className="mt-4 space-y-2">{feedback.slice(0,50).map(x=><div key={x.id} className="rounded-lg border p-3 text-sm">
     <p><strong>{partners.find(p=>p.id===x.partner_id)?.business_name||'Partenaire'}</strong> · {x.outcome} · {new Date(x.created_at).toLocaleString('fr-MA')}</p>
     {x.notes&&<p className="mt-1 text-zinc-500">{x.notes}</p>}
     <p className="text-xs font-mono text-zinc-400 mt-2">Dossier : {x.sale_id.slice(0,8)}</p>
    </div>)}</div>}
  </div>
 </section>
}
