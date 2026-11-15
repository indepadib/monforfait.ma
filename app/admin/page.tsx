'use client'
import {useCallback,useEffect,useState} from 'react'
import Link from 'next/link'
import {supabase} from '@/lib/supabaseClient'
import {AdminAnalytics} from '@/components/AdminAnalytics'
import {AdminCatalogManager} from '@/components/AdminCatalogManager'
import {AdminRevenuePipeline} from '@/components/AdminRevenuePipeline'
import {AdminPartnerManager,type BusinessPartner} from '@/components/AdminPartnerManager'
import {Search,ShieldCheck,RefreshCcw,Download,LogOut,Filter,ChevronLeft,ChevronRight} from 'lucide-react'

type Lead={
 id:string;user_name:string|null;user_phone:string;user_email:string|null;city:string|null;
 status:string;created_at:string;consent_to_share:boolean;consent_at?:string|null;
 sales_status:string;is_pro:boolean;needs_details?:{interest?:string;need?:string;source?:string;lead_source?:string}
}
type Stats={total:number;consented:number;last_30_days:number;by_stage:Record<string,number>}
type History={old_status:string;new_status:string;status_note:string|null;created_at:string}
const stages=['unreviewed','needs_verification','qualified','contacted','partner_proposed','lost','invalid']
const names:Record<string,string>={
 unreviewed:'À examiner',needs_verification:'À vérifier',qualified:'Qualifié',contacted:'Contacté',
 partner_proposed:'En étude partenaire',lost:'Perdu',invalid:'Invalide',
 activated:'Activé (ancien)',invoiced:'Facturé (ancien)',paid:'Payé (ancien)'
}
const date=(v:string)=>new Date(v).toLocaleDateString('fr-MA')
const cell=(s:unknown)=>{
 const raw=String(s??'')
 const safe=/^[=+\-@\t\r]/.test(raw)?"'"+raw:raw
 return '"'+safe.replace(/"/g,'""')+'"'
}

function LeadRow({lead,onUpdated}:{lead:Lead;onUpdated:()=>void}){
 const [stage,setStage]=useState(lead.sales_status)
 const [note,setNote]=useState('')
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [open,setOpen]=useState(false)
 const [history,setHistory]=useState<History[]>([])
 async function save(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError('')
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
   body:{action:'admin.update',lead_id:lead.id,sales_status:stage,sales_status_note:note}
  })
  setBusy(false)
  if(invokeError||!data?.success){setError(data?.error||'Statut non enregistré.');return}
  setNote('');onUpdated()
 }
 async function toggle(){
  if(open){setOpen(false);return}
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
    body:{action:'admin.lead.activity',lead_id:lead.id}
  })
  if(invokeError||!data?.success)setError(data?.error||'Historique non disponible.')
  else setHistory(data.activity||[])
  setOpen(true)
 }
 const needsNote=['contacted','partner_proposed','lost','invalid'].includes(stage)
 const consented=lead.consent_to_share&&Boolean(lead.consent_at)
 return <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3">
  <div className="flex flex-wrap justify-between gap-3">
   <div><p className="text-xs text-zinc-500">{date(lead.created_at)} · {lead.id.slice(0,8)}</p>
    <h3 className="font-bold text-lg mt-1">{lead.user_name||'Prospect sans nom'}</h3>
    <p className="text-sm text-zinc-700">{lead.user_phone}{lead.user_email?' · '+lead.user_email:''}</p>
   </div>
   <div className="text-right text-sm"><p>{lead.city||'Ville non renseignée'}</p>
    <p className="text-zinc-500">{lead.needs_details?.interest||lead.needs_details?.need||'À qualifier'} · {lead.is_pro?'B2B':'B2C'}</p>
    <p className={`mt-1 text-xs font-bold ${consented?'text-green-700':'text-amber-700'}`}>{consented?'Accord documenté':'Partage interdit / non documenté'}</p>
   </div>
  </div>
  <form onSubmit={save} className="grid md:grid-cols-[minmax(150px,1fr)_minmax(160px,2fr)_auto] gap-2 items-end border-t pt-3">
   <label className="text-xs">Étape de qualification
    <select value={stage} onChange={e=>setStage(e.target.value)} className="mt-1 w-full border rounded-xl p-3 text-sm">
     {(stages.includes(stage)?stages:[...stages,stage]).map(v=><option key={v} value={v}>{names[v]||v}</option>)}
    </select>
   </label>
   <label className="text-xs">Compte rendu {needsNote?'*':'(facultatif)'}
    <input value={note} onChange={e=>setNote(e.target.value)} minLength={needsNote?8:undefined} required={needsNote}
     placeholder="Date de contact, vérification, motif…" maxLength={400} className="mt-1 w-full border rounded-xl p-3 text-sm"/>
   </label>
   <button disabled={busy||stage===lead.sales_status} className="rounded-xl bg-blue-600 px-5 py-3 text-white text-sm font-bold disabled:opacity-40">Enregistrer</button>
  </form>
  <button type="button" onClick={()=>void toggle()} className="text-xs underline text-blue-700">
    {open?'Masquer l’historique':'Voir l’historique'}
  </button>
  {open&&<div className="rounded-xl bg-zinc-50 border p-3 text-sm space-y-2">
   {history.length?history.map((h,i)=><p key={i} className="border-b pb-2 text-zinc-600">
    {date(h.created_at)} · {names[h.old_status]||h.old_status||'Nouveau'} → {names[h.new_status]||h.new_status}
    {h.status_note&&<span className="block text-xs mt-1">{h.status_note}</span>}
   </p>):<p className="text-zinc-500">Aucun changement de statut journalisé.</p>}
  </div>}
  {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
 </div>
}
export default function AdminDashboard(){
 const [authorized,setAuthorized]=useState(false)
 const [ready,setReady]=useState(false)
 const [loading,setLoading]=useState(false)
 const [error,setError]=useState('')
 const [leads,setLeads]=useState<Lead[]>([])
 const [partners,setPartners]=useState<BusinessPartner[]>([])
 const [stats,setStats]=useState<Stats|null>(null)
 const [offset,setOffset]=useState(0)
 const [total,setTotal]=useState(0)
 const [filter,setFilter]=useState('')
 const [consentedOnly,setConsentedOnly]=useState(false)
 const [search,setSearch]=useState('')
 const [searchApplied,setSearchApplied]=useState('')
 const limit=50
 const reloadOverview=useCallback(async()=>{
  const [sr,pr]=await Promise.all([
   supabase.functions.invoke('leads-gateway',{body:{action:'admin.stats'}}),
   supabase.functions.invoke('leads-gateway',{body:{action:'admin.partners'}})
  ])
  if(sr.error||!sr.data?.success){setAuthorized(false);setError('Accès administrateur refusé ou indisponible.');setReady(true);return}
  setAuthorized(true);setStats(sr.data);setPartners(pr.data?.partners||[])
  setError(pr.error?'Impossible de charger les partenaires.':'');setReady(true)
 },[])
 const reloadLeads=useCallback(async()=>{
  setLoading(true)
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
   body:{action:'admin.list',limit,offset,sales_status:filter,consented_only:consentedOnly,search:searchApplied}
  })
  setLoading(false)
  if(invokeError||!data?.success){setError(data?.error||'Chargement des dossiers impossible.');return}
  setLeads(data.leads||[]);setTotal(data.total||0)
 },[offset,filter,consentedOnly,searchApplied])
 useEffect(()=>{
  ;(async()=>{
    const {data:{session}}=await supabase.auth.getSession()
    if(!session){setReady(true);return}
    await reloadOverview()
  })()
 },[reloadOverview])
 useEffect(()=>{if(authorized)void reloadLeads()},[authorized,reloadLeads])
 async function refresh(){await reloadOverview();await reloadLeads()}
 async function logout(){await supabase.auth.signOut();window.location.href='/login?tab=admin'}
 function exportPage(){
  const columns=['id','created_at','user_name','user_phone','user_email','city','status','sales_status','consent_to_share','consent_at','is_pro']
  const csv=[columns.join(';'),...leads.map(l=>columns.map(k=>cell(l[k as keyof Lead])).join(';'))].join('\r\n')
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'})
  const url=URL.createObjectURL(blob)
  const a=document.createElement('a');a.href=url;a.download='monforfait_leads_page_'+(offset/limit+1)+'.csv';a.click()
  URL.revokeObjectURL(url)
 }
 if(!ready)return <main className="min-h-screen bg-zinc-950 text-white p-10">Contrôle de votre session administrateur…</main>
 if(!authorized)return <main className="min-h-screen bg-zinc-950 text-white p-8 md:p-16">
  <h1 className="text-3xl font-bold">Console privée MonForfait</h1>
  <p className="mt-4 text-amber-200">{error||'Authentification administrateur nécessaire.'}</p>
  <Link href="/login?tab=admin" className="underline text-blue-300 mt-5 inline-block">Connexion sécurisée</Link>
 </main>
 return <main className="min-h-screen bg-zinc-50 p-4 md:p-8 text-zinc-900">
  <div className="max-w-7xl mx-auto space-y-7">
   <header className="flex flex-wrap justify-between gap-4 items-start border-b pb-6">
    <div><p className="text-xs uppercase tracking-widest text-blue-700 font-bold">MonForfait • Revenue Operations</p>
     <h1 className="text-3xl md:text-4xl font-black mt-2">Centre de pilotage</h1>
     <p className="text-sm text-zinc-500 mt-2">Données réelles, traitement sécurisé et transmissions commerciales sous contrat.</p>
    </div>
    <div className="flex flex-wrap gap-2">
     <Link href="/" className="rounded-xl border p-3 text-sm">Site public</Link>
     <button type="button" onClick={()=>void refresh()} className="inline-flex gap-2 items-center rounded-xl border p-3 text-sm"><RefreshCcw className="w-4 h-4"/>Actualiser</button>
     <button type="button" onClick={logout} className="inline-flex gap-2 items-center rounded-xl bg-zinc-900 text-white p-3 text-sm"><LogOut className="w-4 h-4"/>Déconnexion</button>
    </div>
   </header>
   {error&&<p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
   <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {([['Demandes historiques',stats?.total||0],['Avec accord documenté',stats?.consented||0],['Sur 30 jours',stats?.last_30_days||0],['Partenaires',partners.length]] as [string,number][]).map(([label,value])=>
     <div key={label} className="rounded-2xl bg-white p-5 border">
      <p className="text-xs text-zinc-500">{label}</p><p className="text-3xl md:text-4xl font-bold mt-2">{value}</p>
     </div>)}
   </section>
   <AdminAnalytics/>
   <AdminCatalogManager/>
   <section className="rounded-2xl bg-white border p-5 md:p-7 space-y-5">
    <div className="flex flex-wrap justify-between gap-3 items-start">
     <div><h2 className="text-2xl font-bold">Demandes et qualification</h2><p className="mt-1 text-sm text-zinc-500">{total} résultats selon filtres. Recherche sur la base entière, pas seulement la page courante.</p></div>
     <button type="button" onClick={exportPage} disabled={leads.length===0} className="inline-flex gap-2 items-center rounded-xl border px-4 py-3 text-sm disabled:opacity-40"><Download className="w-4 h-4"/>Exporter la page (CSV)</button>
    </div>
    <form onSubmit={e=>{e.preventDefault();setOffset(0);setSearchApplied(search)}} className="grid md:grid-cols-[2fr_1fr_auto] gap-3">
     <label className="text-sm">Rechercher un prospect
      <div className="flex mt-2 gap-2"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom, ville ou téléphone"
        className="w-full min-w-0 border rounded-xl p-3"/>
       <button type="submit" className="rounded-xl bg-zinc-900 text-white p-3"><Search className="w-5 h-5"/></button></div>
     </label>
     <label className="text-sm">Statut
      <select value={filter} onChange={e=>{setFilter(e.target.value);setOffset(0)}} className="block mt-2 w-full border rounded-xl p-3">
       <option value="">Tous</option>{[...stages,'activated','invoiced','paid'].map(s=><option key={s} value={s}>{names[s]||s}</option>)}
      </select>
     </label>
     <label className="self-end p-3 flex gap-2 items-center text-sm rounded-xl border cursor-pointer"><input type="checkbox" checked={consentedOnly} onChange={e=>{setConsentedOnly(e.target.checked);setOffset(0)}}/> Consentis uniquement</label>
    </form>
    <div className="flex gap-2 items-center text-xs text-zinc-500"><Filter className="w-4 h-4"/>Les anciens dossiers sans consentement ne sont pas transférables. Toute modification est journalisée.</div>
    {loading?<p className="text-zinc-500">Chargement des demandes…</p>:
      leads.length?<div className="grid lg:grid-cols-2 gap-4">{leads.map(l=><LeadRow key={l.id} lead={l} onUpdated={()=>{void reloadLeads();void reloadOverview()}}/>)}</div>:
      <p className="py-10 text-center text-zinc-500">Aucun prospect ne correspond à ces filtres.</p>}
    <div className="flex flex-wrap justify-between items-center gap-3">
     <p className="text-sm text-zinc-500">Page {Math.floor(offset/limit)+1} · {total} demandes</p>
     <div className="flex gap-2">
      <button type="button" onClick={()=>setOffset(v=>Math.max(0,v-limit))} disabled={offset===0} className="inline-flex gap-1 items-center rounded-lg border px-4 py-2 text-sm disabled:opacity-40"><ChevronLeft className="w-4 h-4"/>Précédent</button>
      <button type="button" onClick={()=>setOffset(v=>v+limit)} disabled={offset+limit>=total} className="inline-flex gap-1 items-center rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Suivant<ChevronRight className="w-4 h-4"/></button>
     </div>
    </div>
   </section>
   <AdminRevenuePipeline leads={leads} partners={partners}/>
   <AdminPartnerManager partners={partners} onChanged={()=>void reloadOverview()}/>
   <footer className="flex gap-2 text-xs text-zinc-500 items-center pb-6"><ShieldCheck className="w-4 h-4 shrink-0"/>Seuls les utilisateurs autorisés accèdent à ces données. Les chiffres d’affaires ne sont reconnus que lorsque le paiement est enregistré et justifié.</footer>
  </div>
 </main>
}
