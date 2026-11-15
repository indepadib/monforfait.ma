'use client'
import { useCallback,useEffect,useMemo,useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { SaleReleaseControl } from '@/components/SaleReleaseControl'

type Lead={id:string;user_name:string|null;city:string|null;consent_to_share:boolean;sales_status?:string}
type Partner={id:string;business_name:string;sales_status:string;contract_verified_at?:string|null}
type Sale={
 id:string;lead_id:string;partner_id:string;commercial_model:string;sales_stage:string;
 agreed_amount_dh:number;invoice_reference:string|null;payment_reference:string|null;
 evidence_notes:string|null;created_at:string;activated_at:string|null;invoiced_at:string|null;paid_at:string|null;shared_at?:string|null;access_expires_at?:string|null
}
const transitions: Record<string,string[]> = {
 proposed:['accepted','rejected'],
 accepted:['activated','invoiced','rejected'],
 activated:['invoiced','rejected'],
 invoiced:['paid','rejected'],
 paid:[],rejected:[]
}
const money=(n:number)=>n.toLocaleString('fr-MA',{maximumFractionDigits:2})+' DH'

function SaleRow({sale,leads,partners,onUpdated}:{
 sale:Sale;leads:Lead[];partners:Partner[];onUpdated:()=>void
}){
 const [next,setNext]=useState('')
 const [note,setNote]=useState('')
 const [reference,setReference]=useState('')
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const available=transitions[sale.sales_stage]||[]
 const lead=leads.find(l=>l.id===sale.lead_id)
 const partner=partners.find(p=>p.id===sale.partner_id)
 async function update(e:React.FormEvent){
   e.preventDefault()
   if(!next)return
   setError('');setBusy(true)
   const payload={action:'admin.sales.update',sale_id:sale.id,sales_stage:next,evidence_notes:note,
      invoice_reference:next==='invoiced'?reference:undefined,payment_reference:next==='paid'?reference:undefined}
   const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{body:payload})
   setBusy(false)
   if(invokeError||!data?.success){setError(data?.error||'Modification non enregistrée');return}
   setNext('');setNote('');setReference('');onUpdated()
 }
 return <div className="rounded-2xl border border-zinc-200 p-4 space-y-3">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div>
    <strong>{partner?.business_name||'Partenaire'} → {lead?.user_name||'Prospect'}</strong>
    <p className="text-xs text-zinc-500">{lead?.city||'Ville non renseignée'} · {sale.commercial_model==='cpl'?'Lead accepté':'Activation'} · {sale.sales_stage}</p>
   </div>
   <div className="font-bold text-lg">{money(Number(sale.agreed_amount_dh))}</div>
  </div>
  {sale.invoice_reference&&<p className="text-xs text-zinc-600">Facture : {sale.invoice_reference}</p>}
  {sale.payment_reference&&<p className="text-xs text-zinc-600">Règlement : {sale.payment_reference}</p>}
  {available.length>0&&<form onSubmit={update} className="flex flex-wrap gap-2 items-end">
   <label className="text-xs flex-1 min-w-[150px]">Étape suivante
    <select value={next} onChange={e=>{setNext(e.target.value);setReference('');}} className="mt-1 block w-full rounded-lg border p-2" required>
     <option value="">Choisir</option>
     {available.map(x=><option key={x} value={x}>{x}</option>)}
    </select>
   </label>
   {(next==='activated'||next==='invoiced'||next==='paid'||next==='rejected')&&
     <label className="text-xs flex-[2] min-w-[160px]">Justificatif / commentaire
      <input value={note} onChange={e=>setNote(e.target.value)} className="mt-1 block w-full rounded-lg border p-2" placeholder="Référence ou preuve réelle" />
     </label>}
   {(next==='invoiced'||next==='paid')&&<label className="text-xs flex-1 min-w-[160px]">{next==='invoiced'?'Numéro de facture':'Référence de paiement'}
      <input required value={reference} onChange={e=>setReference(e.target.value)} className="mt-1 block w-full rounded-lg border p-2" placeholder="Référence vérifiable" />
   </label>}
   <button disabled={!next||busy} className="rounded-lg bg-zinc-900 text-white px-4 py-2 disabled:opacity-40">{busy?'…':'Enregistrer'}</button>
  </form>}
  <SaleReleaseControl sale={sale} partner={partner} onUpdated={onUpdated}/>
  {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
 </div>
}
export function AdminRevenuePipeline({leads,partners}: {leads:Lead[];partners:Partner[]}){
 const [sales,setSales]=useState<Sale[]>([])
 const [loaded,setLoaded]=useState(false)
 const [error,setError]=useState('')
 const [leadId,setLeadId]=useState('')
 const [partnerId,setPartnerId]=useState('')
 const [model,setModel]=useState('activation')
 const [amount,setAmount]=useState('')
 const [note,setNote]=useState('')
 const [saving,setSaving]=useState(false)
 const reload=useCallback(async()=>{
  const {data,error}=await supabase.functions.invoke('leads-gateway',{body:{action:'admin.sales.list'}})
  if(error||!data?.success){setError(data?.error||'Le suivi commercial est momentanément indisponible.')}
  else {setSales(data.sales||[]);setError('')}
  setLoaded(true)
 },[])
 useEffect(()=>{void reload()},[reload])
 const eligible=leads.filter(l=>l.consent_to_share&&["qualified","contacted","partner_proposed"].includes(l.sales_status||""))
 const approved=partners.filter(p=>['pilot','contracted','active'].includes(p.sales_status))
 const totals=useMemo(()=>({
  cash:sales.filter(s=>s.paid_at).reduce((a,s)=>a+Number(s.agreed_amount_dh),0),
  invoiced:sales.filter(s=>s.invoiced_at&&!s.paid_at).reduce((a,s)=>a+Number(s.agreed_amount_dh),0),
  activated:sales.filter(s=>s.activated_at).length,
  proposed:sales.filter(s=>s.sales_stage==='proposed').length
 }),[sales])
 async function create(e:React.FormEvent){
  e.preventDefault();setSaving(true);setError('')
  const value=Number(amount)
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
    body:{action:'admin.sales.propose',lead_id:leadId,partner_id:partnerId,
      commercial_model:model,agreed_amount_dh:value,evidence_notes:note}
  })
  setSaving(false)
  if(invokeError||!data?.success){setError(data?.error||'Proposition refusée ou déjà existante.');return}
  setAmount('');setNote('');setLeadId('');await reload()
 }
 return <section className="rounded-2xl border bg-white p-4 md:p-6 space-y-6">
  <div>
   <h2 className="text-xl font-bold">Revenus et activations — données réelles</h2>
   <p className="mt-1 text-sm text-zinc-500">Aucun paiement fictif : une facture et une référence de règlement doivent être enregistrées pour reconnaître un encaissement. Les propositions restent distinctes du CA encaissé.</p>
  </div>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
   {([['Encaissé enregistré',money(totals.cash)],['Facturé, non encaissé',money(totals.invoiced)],['Dossiers activés',String(totals.activated)],['Propositions',String(totals.proposed)]] as [string,string][]).map(([label,value])=>
    <div key={label} className="rounded-xl bg-zinc-50 border p-4"><p className="text-xs text-zinc-500">{label}</p><p className="mt-2 font-bold text-2xl">{value}</p></div>
   )}
  </div>
  <div>
   <h3 className="font-bold mb-3">Créer une proposition commerciale</h3>
   <p className="text-xs text-zinc-500 mb-3">Réservé aux leads consentis et aux partenaires marqués pilote, sous contrat ou actifs. La création d’une proposition ne partage aucune coordonnée.</p>
   {eligible.length===0||approved.length===0?<p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Pour démarrer : qualifier une demande consentie et enregistrer un partenaire pilote.</p>:
    <form className="grid md:grid-cols-2 gap-3" onSubmit={create}>
      <label className="text-sm">Prospect autorisé
       <select required value={leadId} onChange={e=>setLeadId(e.target.value)} className="block mt-1 w-full border rounded-lg p-3">
        <option value="">Sélectionner</option>{eligible.map(l=><option key={l.id} value={l.id}>{l.user_name||'Prospect'} · {l.city||'Ville à confirmer'}</option>)}
       </select>
      </label>
      <label className="text-sm">Partenaire pilote / sous contrat
       <select required value={partnerId} onChange={e=>setPartnerId(e.target.value)} className="block mt-1 w-full border rounded-lg p-3">
        <option value="">Sélectionner</option>{approved.map(p=><option key={p.id} value={p.id}>{p.business_name}</option>)}
       </select>
      </label>
      <label className="text-sm">Modèle commercial
       <select value={model} onChange={e=>setModel(e.target.value)} className="block mt-1 w-full border rounded-lg p-3">
        <option value="activation">Rémunération à l'activation</option><option value="cpl">Coût par lead accepté</option>
       </select>
      </label>
      <label className="text-sm">Montant négocié (DH)
       <input type="number" min="1" max="50000" step="0.01" required value={amount} onChange={e=>setAmount(e.target.value)} className="block mt-1 w-full border rounded-lg p-3"/>
      </label>
      <label className="md:col-span-2 text-sm">Référence du contrat pilote / note commerciale
       <input value={note} maxLength={400} onChange={e=>setNote(e.target.value)} className="block mt-1 w-full border rounded-lg p-3"/>
      </label>
      <button disabled={saving} className="md:col-span-2 rounded-xl bg-blue-600 text-white p-3 font-bold disabled:opacity-50">{saving?'Enregistrement…':'Enregistrer la proposition'}</button>
    </form>
   }
  </div>
  <div className="space-y-3">
   <h3 className="font-bold">Dossiers et justificatifs</h3>
   {!loaded?<p className="text-zinc-500 text-sm">Chargement…</p>:sales.length===0?<p className="text-zinc-500 text-sm">Aucun dossier de vente enregistré pour le moment.</p>:
     sales.map(s=><SaleRow key={s.id} sale={s} leads={leads} partners={partners} onUpdated={reload}/>)}
  </div>
  {error&&<p role="alert" className="text-red-700 text-sm">{error}</p>}
 </section>
}
