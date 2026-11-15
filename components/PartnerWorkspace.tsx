'use client'
import {useCallback,useEffect,useState} from 'react'
import Link from 'next/link'
import {supabase} from '@/lib/supabaseClient'
import {Navigation} from '@/components/Navigation'
import {Building2,LockKeyhole,ShieldCheck,Users,RefreshCcw,CheckCircle2,LogOut} from 'lucide-react'

type Lead={name:string|null;phone:string|null;email:string|null;city:string|null;address:string|null;need:string|null}
type Assigned={
 id:string;lead_id:string;sales_stage:string;shared_at:string;access_expires_at:string;lead:Lead|null
}
type Partner={id:string;business_name:string;partner_type:string;sales_status:string;business_email:string|null}
const feedbackOptions=[
 {value:'received',label:'Dossier bien reçu'},
 {value:'contacted',label:'Contact établi'},
 {value:'no_answer',label:'Client injoignable'},
 {value:'not_eligible',label:'Non éligible'},
 {value:'activated',label:'Abonnement activé (à vérifier)'},
 {value:'rejected',label:'Dossier refusé'}
]
function ReferralCard({sale,onFeedback}:{sale:Assigned;onFeedback:()=>void}){
 const [outcome,setOutcome]=useState('received')
 const [notes,setNotes]=useState('')
 const [saving,setSaving]=useState(false)
 const [error,setError]=useState('')
 const [success,setSuccess]=useState('')
 async function report(e:React.FormEvent){
  e.preventDefault();setSaving(true);setError('');setSuccess('')
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
    body:{action:'partner.feedback',sale_id:sale.id,outcome,notes}
  })
  setSaving(false)
  if(invokeError||!data?.success){setError(data?.error||'Retour non enregistré.');return}
  setNotes('');setSuccess('Votre retour a été envoyé à MonForfait.ma pour vérification.');onFeedback()
 }
 const l=sale.lead
 return <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5">
  <header className="flex flex-wrap justify-between items-start gap-3">
   <div><p className="text-xs text-zinc-500 uppercase tracking-wide">Dossier confié</p><h3 className="text-xl font-bold mt-1">{l?.name||'Client'}</h3>
    <p className="text-xs text-zinc-500 mt-1">Accès autorisé jusqu'au {new Date(sale.access_expires_at).toLocaleDateString('fr-MA')}</p>
   </div>
   <span className="rounded-full bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">{sale.sales_stage}</span>
  </header>
  <div className="grid sm:grid-cols-2 gap-4 text-sm">
   <div><span className="text-zinc-500">Téléphone</span><p className="font-semibold">{l?.phone||'Non communiqué'}</p></div>
   <div><span className="text-zinc-500">Email</span><p className="font-semibold break-all">{l?.email||'Non communiqué'}</p></div>
   <div><span className="text-zinc-500">Ville</span><p>{l?.city||'À préciser'}</p></div>
   <div><span className="text-zinc-500">Besoin déclaré</span><p>{l?.need||'Demande télécom'}</p></div>
   {l?.address&&<div className="sm:col-span-2"><span className="text-zinc-500">Adresse de raccordement</span><p>{l.address}</p></div>}
  </div>
  <form onSubmit={report} className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
   <h4 className="font-bold">Retour au gestionnaire MonForfait</h4>
   <label className="block text-sm">Résultat de votre traitement
    <select value={outcome} onChange={e=>setOutcome(e.target.value)} className="mt-2 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3">
     {feedbackOptions.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}
    </select>
   </label>
   <label className="block text-sm">Note / référence de traitement (8 caractères minimum)
    <textarea value={notes} onChange={e=>setNotes(e.target.value)} minLength={8} maxLength={400} required rows={2}
     className="mt-2 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" placeholder="Date d'appel, résultat et référence vérifiable…"/>
   </label>
   <button type="submit" disabled={saving||notes.trim().length<8} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{saving?'Envoi…':'Transmettre le retour'}</button>
   {error&&<p role="alert" className="text-red-600 text-sm">{error}</p>}
   {success&&<p role="status" className="text-green-600 text-sm">{success}</p>}
  </form>
 </article>
}
export function PartnerWorkspace(){
 const [ready,setReady]=useState(false)
 const [loggedIn,setLoggedIn]=useState(false)
 const [partner,setPartner]=useState<Partner|null>(null)
 const [sales,setSales]=useState<Assigned[]>([])
 const [pending,setPending]=useState(false)
 const [error,setError]=useState('')
 const reload=useCallback(async()=>{
  const {data:{session}}=await supabase.auth.getSession()
  if(!session){setLoggedIn(false);setReady(true);return}
  setLoggedIn(true)
  const [profile,assigned]=await Promise.all([
   supabase.functions.invoke('leads-gateway',{body:{action:'partner.profile'}}),
   supabase.functions.invoke('leads-gateway',{body:{action:'partner.list'}})
  ])
  if(profile.error||!profile.data?.success){
   setPending(true);setPartner(null);setSales([])
   setError('Ce compte n’est pas encore associé à un partenaire actif. Contactez votre interlocuteur MonForfait.ma après signature du contrat.')
  }else{
   setPending(false);setPartner(profile.data.partner)
   if(assigned.error||!assigned.data?.success){setError(assigned.data?.error||'Dossiers momentanément indisponibles.');setSales([])}
   else{setSales(assigned.data.sales||[]);setError('')}
  }
  setReady(true)
 },[])
 useEffect(()=>{void reload()},[reload])
 async function logout(){await supabase.auth.signOut();window.location.href='/login?tab=partner'}
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
  <Navigation/>
  <header className="bg-zinc-950 text-white pt-28 pb-12 px-5">
   <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-5">
    <div><p className="text-xs uppercase font-bold tracking-widest text-blue-300">Accès professionnel sécurisé</p>
     <h1 className="text-4xl font-black mt-3">Espace partenaire</h1>
     <p className="text-zinc-300 mt-3">Suivez uniquement les dossiers qui vous ont été explicitement confiés.</p>
    </div>
    {loggedIn&&<button type="button" onClick={logout} className="rounded-xl border border-zinc-700 px-4 py-3 flex items-center gap-2"><LogOut className="w-4 h-4"/>Déconnexion</button>}
   </div>
  </header>
  <div className="max-w-6xl mx-auto px-5 py-10 space-y-7">
   {!ready?<div className="rounded-2xl bg-white dark:bg-zinc-900 p-8">Vérification de vos droits d'accès…</div>:
    !loggedIn?<div className="rounded-2xl border bg-white dark:bg-zinc-900 p-8 max-w-xl">
     <LockKeyhole className="w-9 h-9 text-blue-600 mb-5"/><h2 className="text-2xl font-bold">Authentification requise</h2>
     <p className="text-zinc-500 mt-3">Ce portail n’est pas public. Utilisez votre email professionnel vérifié.</p>
     <Link href="/login?tab=partner" className="inline-flex mt-6 rounded-xl bg-blue-600 px-6 py-4 text-white font-semibold">Se connecter</Link>
    </div>:
    pending?<div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 max-w-2xl text-amber-950">
     <Building2 className="w-8 h-8 mb-4"/><h2 className="text-xl font-bold">Compte en attente de validation</h2><p className="mt-3">{error}</p>
     <Link href="/partenaires" className="underline mt-5 inline-block">Informations partenariat</Link>
    </div>:
    <><section className="grid md:grid-cols-3 gap-4">
     <div className="md:col-span-2 rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6">
      <p className="text-xs uppercase tracking-widest text-zinc-500">Partenaire agréé dans MonForfait</p>
      <h2 className="text-2xl font-bold mt-2">{partner?.business_name}</h2>
      <p className="text-sm text-zinc-500 mt-2">Email de contact : {partner?.business_email}</p>
     </div>
     <div className="rounded-2xl bg-blue-600 p-6 text-white"><Users className="w-8 h-8"/>
      <p className="text-blue-100 mt-4 text-sm">Dossiers accessibles</p><p className="text-4xl font-black mt-1">{sales.length}</p>
     </div>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-2xl font-bold">Demandes attribuées</h2>
      <button type="button" onClick={()=>void reload()} className="rounded-xl border dark:border-zinc-700 px-4 py-2 inline-flex gap-2 items-center"><RefreshCcw className="w-4 h-4"/>Actualiser</button>
    </div>
    {error&&<p role="alert" className="rounded-xl bg-red-50 text-red-700 p-4">{error}</p>}
    {sales.length===0?<div className="rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-10 text-center">
      <CheckCircle2 className="mx-auto text-blue-600 w-10 h-10 mb-4"/>
      <h3 className="text-xl font-bold">Aucune demande confiée pour le moment</h3>
      <p className="text-zinc-500 mt-3">Les leads ne sont accessibles qu'après consentement, validation contractuelle et affectation explicite par un administrateur.</p>
     </div>:<div className="grid lg:grid-cols-2 gap-5">{sales.map(s=><ReferralCard key={s.id} sale={s} onFeedback={reload}/>)}</div>}
    <div className="flex items-start gap-3 rounded-xl border dark:border-zinc-800 p-5 text-sm text-zinc-500"><ShieldCheck className="w-5 h-5 text-blue-600 shrink-0"/>
      Accès limité dans le temps. N’utilisez les coordonnées que pour traiter la demande concernée et selon les termes de votre contrat. Aucune exportation globale n'est proposée.
    </div>
    </>
   }
  </div>
 </main>
}
