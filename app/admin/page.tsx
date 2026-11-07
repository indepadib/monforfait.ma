'use client'
import {useEffect,useState} from 'react'
import {supabase} from '@/lib/supabaseClient'
import Link from 'next/link'
type Lead={id:string;user_name:string|null;user_phone:string;user_email:string|null;city:string|null;status:string;created_at:string;consent_to_share:boolean;sales_status:string;is_pro:boolean;needs_details?:{interest?:string;need?:string;installation_timing?:string}}
type Partner={id:string;business_name:string;business_email:string|null;partner_type:string;sales_status:string}
const stages=['unreviewed','needs_verification','qualified','contacted','partner_proposed','activated','invoiced','paid','lost','invalid']
const fmt=(iso:string)=>new Date(iso).toLocaleDateString('fr-MA')
export default function AdminDashboard(){
 const [leads,setLeads]=useState<Lead[]>([])
 const [partners,setPartners]=useState<Partner[]>([])
 const [ready,setReady]=useState(false)
 const [authorized,setAuthorized]=useState(false)
 const [error,setError]=useState('')
 const [name,setName]=useState('')
 const [email,setEmail]=useState('')
 const [search,setSearch]=useState('')
 const [saving,setSaving]=useState(false)
 useEffect(()=>{(async()=>{
   const {data}=await supabase.auth.getSession()
   if(!data.session){setReady(true);return}
   await refresh()
 })()},[])
 async function refresh(){
  const [lr,pr]=await Promise.all([
   supabase.functions.invoke('leads-gateway',{body:{action:'admin.list',limit:250}}),
   supabase.functions.invoke('leads-gateway',{body:{action:'admin.partners'}})
  ])
  if(lr.error||!lr.data?.success){setAuthorized(false);setError('Compte sans accès administrateur, ou service momentanément indisponible.')}
  else {setLeads(lr.data.leads||[]);setPartners(pr.data?.partners||[]);setAuthorized(true);setError('')}
  setReady(true)
 }
 async function stage(id:string,sales_status:string){
  const r=await supabase.functions.invoke('leads-gateway',{body:{action:'admin.update',lead_id:id,sales_status}})
  if(r.error||!r.data?.success){setError('Mise à jour refusée');return}
  setLeads(current=>current.map(x=>x.id===id?{...x,sales_status}:x))
 }
 async function addPartner(e:React.FormEvent){
  e.preventDefault();setSaving(true)
  const r=await supabase.functions.invoke('leads-gateway',{body:{action:'admin.create_partner',business_name:name,business_email:email}})
  setSaving(false)
  if(r.error||!r.data?.success){setError('Partenaire non enregistré');return}
  setName('');setEmail('');await refresh()
 }
 async function logout(){await supabase.auth.signOut();window.location.href='/login?tab=admin'}
 const shown=leads.filter(l=>[l.user_name,l.city,l.user_phone,l.needs_details?.interest,l.needs_details?.need].some(v=>String(v||'').toLowerCase().includes(search.toLowerCase())))
 if(!ready) return <main className="p-8">Chargement sécurisé…</main>
 if(!authorized)return <main className="min-h-screen bg-zinc-950 text-white p-8"><h1 className="text-2xl font-bold">Espace administrateur</h1><p className="mt-3 text-amber-200">{error||'Authentification requise'}</p><Link className="underline mt-5 inline-block" href="/login?tab=admin">Connexion sécurisée</Link></main>
 return <main className="min-h-screen bg-zinc-50 p-4 md:p-8 text-zinc-900">
  <div className="mx-auto max-w-7xl space-y-7">
   <header className="flex flex-wrap justify-between gap-3 items-start">
    <div><p className="text-xs uppercase tracking-wider text-blue-700 font-semibold">MonForfait • Revenue Operations</p><h1 className="text-3xl font-bold mt-1">Centre de leads sécurisé</h1><p className="text-zinc-500 mt-1">Données réelles — aucun faux chiffre d'affaires ni achat simulé.</p></div>
    <div className="flex gap-2"><button className="rounded-xl border p-2" onClick={refresh}>Actualiser</button><button className="rounded-xl bg-zinc-900 text-white p-2" onClick={logout}>Déconnexion</button></div>
   </header>
   {error&&<p role="alert" className="text-red-700">{error}</p>}
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {([['Leads récents',leads.length],['Consentements documentés',leads.filter(l=>l.consent_to_share).length],['À vérifier',leads.filter(l=>l.sales_status==='unreviewed'||l.sales_status==='needs_verification').length],['Partenaires enregistrés',partners.length]] as [string,number][]).map(([label,n])=><div key={label} className="bg-white rounded-2xl p-5 border"><p className="text-xs text-zinc-500">{label}</p><p className="text-3xl font-bold mt-2">{n}</p></div>)}
   </div>
   <section className="rounded-2xl border bg-white p-4 md:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><h2 className="font-bold text-xl">Pipeline commercial</h2><input aria-label="Rechercher un lead" placeholder="Nom, ville, besoin…" value={search} onChange={e=>setSearch(e.target.value)} className="border rounded-xl p-3" /></div>
    <p className="text-xs text-zinc-500 mb-4">250 demandes au maximum affichées, les plus récentes en premier. Les demandes anciennes sans consentement ne sont pas vendables.</p>
    <div className="overflow-x-auto"><table className="min-w-full text-left text-sm">
     <thead><tr className="border-b text-zinc-500"><th className="p-3">Date</th><th className="p-3">Prospect</th><th className="p-3">Besoin</th><th className="p-3">Ville</th><th className="p-3">Consentement</th><th className="p-3">Suivi</th></tr></thead>
     <tbody>{shown.map(l=><tr key={l.id} className="border-b">
       <td className="p-3 whitespace-nowrap">{fmt(l.created_at)}</td><td className="p-3"><strong>{l.user_name||'Prospect'}</strong><div className="text-xs text-zinc-500">{l.user_phone}</div></td>
       <td className="p-3">{l.needs_details?.interest||l.needs_details?.need||'À qualifier'}</td>
       <td className="p-3">{l.city||'À vérifier'}</td>
       <td className="p-3">{l.consent_to_share?'Oui, à vérifier':'Non — non commercialisable'}</td>
       <td className="p-3"><select aria-label="Statut commercial" className="border rounded-lg p-2" value={l.sales_status||'unreviewed'} onChange={e=>stage(l.id,e.target.value)}>{stages.map(s=><option key={s} value={s}>{s}</option>)}</select></td>
      </tr>)}</tbody></table></div>
   </section>
   <section className="rounded-2xl border bg-white p-4 md:p-6">
    <h2 className="font-bold text-xl">Prospection des acheteurs</h2><p className="text-sm text-zinc-500 mt-1 mb-4">Enregistrer un partenaire ne lui transmet aucun numéro. Partage sous contrat et validation.</p>
    <form className="flex flex-wrap gap-3 mb-5" onSubmit={addPartner}>
      <input required placeholder="Nom du partenaire" value={name} onChange={e=>setName(e.target.value)} className="border rounded-xl p-3"/>
      <input type="email" placeholder="Email professionnel" value={email} onChange={e=>setEmail(e.target.value)} className="border rounded-xl p-3"/>
      <button disabled={saving} className="bg-blue-600 text-white px-5 rounded-xl">{saving?'…':'Ajouter'}</button>
    </form>
    <div className="flex flex-wrap gap-2">{partners.map(p=><span className="border rounded-full bg-zinc-50 px-4 py-2 text-sm" key={p.id}>{p.business_name} · {p.sales_status}</span>)}</div>
   </section>
  </div>
 </main>
}
