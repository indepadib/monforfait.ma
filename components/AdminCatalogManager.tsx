'use client'
import {useCallback,useEffect,useMemo,useState} from 'react'
import {supabase} from '@/lib/supabaseClient'
import {BookOpen,ExternalLink,RefreshCcw,ShieldCheck,Archive,Plus} from 'lucide-react'
type Operator={id:string;name:string}
type Offer={
 id:string;title:string;operator_id:string;category:'internet'|'mobile';
 download_speed_mbps:number|null;mobile_data_gb:number|null;price_dh:number;
 source_url:string|null;source_checked_at:string|null;is_active:boolean;
 operators:Operator|null
}
type Audit={id:number;plan_id:string;action:string;old_price_dh:number|null;new_price_dh:number|null;created_at:string}
const official:Record<string,string>={
 'Inwi':'https://inwi.ma/fr/particuliers/offres-internet/wifi-a-la-maison/fibre-optique',
 'Orange Morocco':'https://boutique.orange.ma/fibre-d-orange',
 'Maroc Telecom':'https://www.iam.ma/fr/web/iam-portal/fibre-optique'
}
const empty={id:'',operator_id:'',title:'',category:'internet' as 'internet'|'mobile',price:'',speed:'',data:'',source:''}
export function AdminCatalogManager(){
 const [offers,setOffers]=useState<Offer[]>([])
 const [operators,setOperators]=useState<Operator[]>([])
 const [audit,setAudit]=useState<Audit[]>([])
 const [ready,setReady]=useState(false)
 const [error,setError]=useState('')
 const [message,setMessage]=useState('')
 const [showArchive,setShowArchive]=useState(false)
 const [query,setQuery]=useState('')
 const [form,setForm]=useState(empty)
 const [busy,setBusy]=useState(false)
 const reload=useCallback(async()=>{
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{body:{action:'admin.catalog.list'}})
  setReady(true)
  if(invokeError||!data?.success){setError(data?.error||'Catalogue privé indisponible.');return}
  setOffers(data.plans||[]);setOperators(data.operators||[]);setAudit(data.audit||[])
  setError('')
 },[])
 useEffect(()=>{void reload()},[reload])
 const active=offers.filter(o=>o.is_active)
 const stale=active.filter(o=>!o.source_checked_at||Date.now()-new Date(o.source_checked_at).getTime()>30*86400*1000)
 const shown=useMemo(()=>offers.filter(o=>(showArchive||o.is_active)&&
    [o.title,o.operators?.name,o.category].some(v=>String(v||'').toLowerCase().includes(query.toLowerCase()))),[offers,showArchive,query])
 function edit(o:Offer){
  setForm({id:o.id,operator_id:o.operator_id,title:o.title,category:o.category,
    price:String(o.price_dh),speed:String(o.download_speed_mbps||''),
    data:String(o.mobile_data_gb||''),source:o.source_url||''})
  setMessage('');setError('')
 }
 async function save(e:React.FormEvent){
  e.preventDefault();setError('');setMessage('');setBusy(true)
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{body:{
    action:form.id?'admin.catalog.update':'admin.catalog.create',plan_id:form.id||undefined,
    operator_id:form.operator_id,title:form.title,category:form.category,
    price_dh:Number(form.price),download_speed_mbps:Number(form.speed),
    mobile_data_gb:Number(form.data),source_url:form.source
  }})
  setBusy(false)
  if(invokeError||!data?.success){setError(data?.error||'Offre non enregistrée.');return}
  setMessage('Offre mise à jour. Date et source de vérification consignées.')
  setForm(empty);await reload()
 }
 async function archive(id:string){
  if(!window.confirm('Archiver cette offre ? Elle disparaîtra du comparateur sans être supprimée de l’historique.'))return
  setError('');setMessage('');setBusy(true)
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{body:{action:'admin.catalog.archive',plan_id:id}})
  setBusy(false)
  if(invokeError||!data?.success){setError(data?.error||'Archivage non enregistré.');return}
  setMessage('Offre archivée, historique préservé.');setForm(empty);await reload()
 }
 const provider=operators.find(o=>o.id===form.operator_id)
 return <section className="rounded-2xl border bg-white p-5 md:p-7 space-y-6">
  <div className="flex flex-wrap gap-4 justify-between items-start">
   <div><p className="text-xs uppercase text-blue-700 font-bold tracking-widest">Qualité des tarifs</p>
    <h2 className="text-2xl font-bold mt-1">Administration du catalogue</h2>
    <p className="mt-2 text-sm text-zinc-500">Réviser les prix, sourcer les offres et archiver les références obsolètes. Aucune grille n'est modifiée par un robot sans contrôle.</p>
   </div>
   <button type="button" onClick={()=>void reload()} className="rounded-xl border p-3 flex gap-2 items-center text-sm"><RefreshCcw className="w-4 h-4"/>Actualiser</button>
  </div>
  {!ready?<p className="text-zinc-500">Chargement…</p>:<div className="grid sm:grid-cols-3 gap-3">
   <div className="rounded-xl border bg-zinc-50 p-4"><p className="text-xs text-zinc-500">Offres publiées</p><p className="text-3xl font-bold">{active.length}</p></div>
   <div className="rounded-xl border bg-zinc-50 p-4"><p className="text-xs text-zinc-500">À revérifier (+30 jours)</p><p className={`text-3xl font-bold ${stale.length?'text-amber-700':''}`}>{stale.length}</p></div>
   <div className="rounded-xl border bg-zinc-50 p-4"><p className="text-xs text-zinc-500">Archivées</p><p className="text-3xl font-bold">{offers.length-active.length}</p></div>
  </div>}
  {stale.length>0&&<p role="status" className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-900 text-sm">Attention : {stale.length} prix n'ont pas été revérifiés depuis plus de 30 jours. Ouvrez les sources officielles avant toute mise à jour.</p>}
  {error&&<p role="alert" className="rounded-xl bg-red-50 text-red-700 p-4 text-sm">{error}</p>}
  {message&&<p role="status" className="rounded-xl bg-green-50 text-green-700 p-4 text-sm">{message}</p>}
  <form onSubmit={save} className="border border-blue-200 bg-blue-50/50 p-5 rounded-2xl space-y-4">
   <div className="flex justify-between gap-3 items-center">
    <h3 className="text-lg font-bold flex gap-2 items-center">{form.id?<BookOpen className="w-5 h-5"/>:<Plus className="w-5 h-5"/>}{form.id?'Réviser une offre':'Créer une offre sourcée'}</h3>
    {form.id&&<button type="button" onClick={()=>setForm(empty)} className="underline text-sm">Annuler l’édition</button>}
   </div>
   <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
    <label className="text-sm">Opérateur
     <select required value={form.operator_id} disabled={Boolean(form.id)} onChange={e=>setForm(p=>({...p,operator_id:e.target.value,source:official[operators.find(o=>o.id===e.target.value)?.name||'']||''}))}
      className="mt-2 block w-full rounded-xl border bg-white p-3 disabled:opacity-70">
      <option value="">Sélectionner</option>{operators.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
     </select>
    </label>
    <label className="text-sm">Catégorie
     <select value={form.category} disabled={Boolean(form.id)} onChange={e=>setForm(p=>({...p,category:e.target.value as 'internet'|'mobile'}))}
      className="mt-2 block w-full rounded-xl border bg-white p-3 disabled:opacity-70">
      <option value="internet">Fibre</option><option value="mobile">Mobile</option>
     </select>
    </label>
    <label className="text-sm">Intitulé exact
     <input required minLength={3} maxLength={140} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}
      placeholder="Ex : Fibre 100M" className="mt-2 block w-full rounded-xl border bg-white p-3"/>
    </label>
    <label className="text-sm">Prix mensuel (DH)
     <input required type="number" min="1" max="3000" step="0.01" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}
      className="mt-2 block w-full rounded-xl border bg-white p-3"/>
    </label>
    {<label className="text-sm">{form.category==='internet'?'Débit descendant (Mb/s)':'Volume data (Go)'}
     <input type="number" min="1" max={form.category==='internet'?2000:1000} required value={form.category==='internet'?form.speed:form.data}
      onChange={e=>setForm(p=>({...p,[p.category==='internet'?'speed':'data']:e.target.value}))}
      className="mt-2 block w-full rounded-xl border bg-white p-3"/>
    </label>}
    <label className="text-sm sm:col-span-2 xl:col-span-3">URL officielle de vérification
     <input required type="url" pattern="https://.*" value={form.source} onChange={e=>setForm(p=>({...p,source:e.target.value}))}
      placeholder="https://site-officiel-operateur/..." className="mt-2 block w-full rounded-xl border bg-white p-3"/>
    </label>
   </div>
   {provider&&<a href={form.source||official[provider.name]} target="_blank" rel="noopener noreferrer"
     className="inline-flex items-center gap-1 text-xs text-blue-700 underline">Ouvrir le site officiel pour vérifier le prix <ExternalLink className="w-3 h-3"/></a>}
   <p className="text-xs text-zinc-500 flex gap-2 items-center"><ShieldCheck className="w-4 h-4 shrink-0"/>Enregistrer signifie que vous avez réellement vérifié le prix, le débit et les conditions sur la source indiquée. L'URL seule ne prouve pas la validité du tarif.</p>
   <button disabled={busy} className="rounded-xl bg-blue-600 text-white px-6 py-3 font-bold disabled:opacity-50">{busy?'Enregistrement…':form.id?'Publier la révision':'Créer et publier l’offre'}</button>
  </form>
  <div>
   <div className="flex flex-wrap justify-between items-center gap-3 mb-4"><h3 className="font-bold text-lg">Référentiel des offres</h3>
    <label className="text-sm flex gap-2 items-center"><input type="checkbox" checked={showArchive} onChange={e=>setShowArchive(e.target.checked)}/> Afficher archivées</label>
   </div>
   <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher opérateur ou offre" className="w-full sm:max-w-sm border rounded-xl p-3 mb-4"/>
   <div className="grid lg:grid-cols-2 gap-3">
    {shown.map(o=><article key={o.id} className="border rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-3">
      <div><p className="text-xs text-zinc-500">{o.operators?.name} · {o.category} · {o.is_active?'Publiée':'Archivée'}</p>
       <h4 className="font-bold mt-1">{o.title}</h4><p className="font-bold text-blue-700 mt-1">{Number(o.price_dh)} DH/mois</p>
       <p className="text-xs text-zinc-500 mt-1">Vérifiée : {o.source_checked_at?new Date(o.source_checked_at).toLocaleDateString('fr-MA'):'Non renseignée'}</p>
       {o.source_url&&<a href={o.source_url} target="_blank" rel="noopener noreferrer" className="text-xs underline text-blue-700">Voir source</a>}
      </div>
      <div className="flex sm:flex-col gap-2 shrink-0">
       <button type="button" onClick={()=>edit(o)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Réviser</button>
       {o.is_active&&<button type="button" onClick={()=>void archive(o.id)} disabled={busy} className="rounded-lg border border-red-200 text-red-700 px-4 py-2 text-sm flex gap-2 items-center"><Archive className="w-4 h-4"/>Archiver</button>}
      </div>
    </article>)}
   </div>
  </div>
  <div className="border-t pt-4">
   <h3 className="font-bold">Historique des modifications</h3>
   {audit.length===0?<p className="text-sm text-zinc-500 mt-3">Aucune modification encore enregistrée.</p>:
    <div className="mt-3 grid sm:grid-cols-2 gap-2">{audit.slice(0,14).map(a=><div key={a.id} className="rounded-lg bg-zinc-50 p-3 border text-xs">
     <strong>{a.action}</strong> · {new Date(a.created_at).toLocaleString('fr-MA')}
     <p className="text-zinc-500 mt-1">{a.old_price_dh??'—'} → {a.new_price_dh??'—'} DH</p>
    </div>)}</div>}
  </div>
 </section>
}
