'use client'
import {useCallback,useEffect,useState} from 'react'
import {supabase} from '@/lib/supabaseClient'
import {Inbox,RefreshCcw,ChevronRight,ChevronLeft,MailCheck} from 'lucide-react'
type Message={
 id:string;name:string;email:string;subject:string;message:string;category:string;
 status:string;status_note:string|null;created_at:string;updated_at:string
}
const labels:Record<string,string>={new:'Nouveau',in_progress:'En cours',answered:'Répondu',closed:'Clôturé'}
function Row({message,onChange}:{message:Message;onChange:()=>void}){
 const [stage,setStage]=useState(message.status)
 const [note,setNote]=useState('')
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 async function save(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError('')
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
    body:{action:'admin.contact.update',message_id:message.id,status:stage,status_note:note}
  })
  setBusy(false)
  if(invokeError||!data?.success){setError(data?.error||'Impossible de mettre à jour le message.');return}
  setNote('');onChange()
 }
 return <article className="rounded-2xl bg-white border p-5 space-y-3">
  <header className="flex flex-wrap justify-between items-start gap-3">
   <div><p className="text-xs text-zinc-500">{new Date(message.created_at).toLocaleString('fr-MA')} · {message.category} · {message.id.slice(0,8)}</p>
     <h4 className="font-bold text-lg mt-1">{message.subject}</h4>
     <p className="text-sm text-zinc-600">{message.name} · <a href={'mailto:'+message.email} className="text-blue-700 underline">{message.email}</a></p>
   </div>
   <span className={`rounded-full px-3 py-1 text-xs font-bold ${message.status==='new'?'bg-amber-50 text-amber-700':'bg-blue-50 text-blue-700'}`}>{labels[message.status]||message.status}</span>
  </header>
  <p className="text-sm whitespace-pre-wrap text-zinc-700 border-t pt-3">{message.message}</p>
  {message.status_note&&<div className="text-xs text-zinc-600 bg-zinc-50 border rounded-xl p-3"><strong>Note précédente :</strong> {message.status_note}</div>}
  <form onSubmit={save} className="grid md:grid-cols-[1fr_2fr_auto] gap-2 items-end border-t pt-3">
   <label className="text-xs">Statut
    <select value={stage} onChange={e=>setStage(e.target.value)} className="mt-1 w-full border rounded-xl bg-white p-3 text-sm">
     {['new','in_progress','answered','closed'].map(x=><option key={x} value={x} disabled={x==='new'}>{labels[x]}</option>)}
    </select>
   </label>
   <label className="text-xs">Note de traitement (8 caractères minimum)
    <input required minLength={8} maxLength={400} value={note} onChange={e=>setNote(e.target.value)}
     className="mt-1 w-full border rounded-xl p-3 text-sm" placeholder="Date, action réalisée, référence de réponse…"/>
   </label>
   <button type="submit" disabled={busy||stage==='new'} className="rounded-xl bg-blue-600 text-white p-3 font-bold text-sm disabled:opacity-40">Enregistrer</button>
  </form>
  <p className="text-xs text-zinc-500">Le suivi interne n'envoie pas automatiquement de mail : répondez depuis la messagerie professionnelle et consignez la réponse ici.</p>
  {error&&<p role="alert" className="text-red-700 text-sm">{error}</p>}
 </article>
}
export function AdminContactInbox(){
 const [messages,setMessages]=useState<Message[]>([])
 const [total,setTotal]=useState(0)
 const [status,setStatus]=useState('')
 const [offset,setOffset]=useState(0)
 const [ready,setReady]=useState(false)
 const [error,setError]=useState('')
 const [busy,setBusy]=useState(false)
 const limit=20
 const reload=useCallback(async()=>{
  setBusy(true)
  const {data,error:e}=await supabase.functions.invoke('leads-gateway',{
   body:{action:'admin.contact.list',status,limit,offset}
  })
  setBusy(false);setReady(true)
  if(e||!data?.success){setError(data?.error||'Boîte de réception indisponible.');return}
  setMessages(data.messages||[]);setTotal(data.total||0);setError('')
 },[status,offset])
 useEffect(()=>{void reload()},[reload])
 return <section className="rounded-2xl border bg-zinc-50 p-5 md:p-7 space-y-6">
  <div className="flex flex-wrap justify-between gap-4 items-start">
   <div><p className="text-xs uppercase font-bold tracking-widest text-blue-700">Service client</p>
    <h2 className="text-2xl font-bold mt-2">Boîte de réception</h2>
    <p className="text-zinc-500 text-sm mt-2">Questions, demandes de confidentialité et réclamations : triées sans les transformer en prospects commerciaux.</p>
   </div>
   <button type="button" disabled={busy} onClick={()=>void reload()} className="rounded-xl border bg-white flex gap-2 items-center px-4 py-3 text-sm"><RefreshCcw className="w-4 h-4"/>Actualiser</button>
  </div>
  <div className="flex flex-wrap justify-between gap-3 items-center">
   <div className="flex gap-2 items-center text-sm text-zinc-600"><Inbox className="w-5 h-5"/>{total} message(s)</div>
   <select aria-label="Filtrer les messages par statut" value={status} onChange={e=>{setStatus(e.target.value);setOffset(0)}} className="rounded-xl border bg-white p-3 text-sm">
    <option value="">Tous les statuts</option>
    {Object.entries(labels).map(([value,label])=><option key={value} value={value}>{label}</option>)}
   </select>
  </div>
  {error&&<p role="alert" className="rounded-xl bg-red-50 text-red-700 p-4 text-sm">{error}</p>}
  {!ready||busy?<p className="text-zinc-500">Chargement…</p>:messages.length===0?
    <div className="rounded-2xl bg-white border p-8 text-center"><MailCheck className="w-9 h-9 text-blue-600 mx-auto"/><p className="font-bold mt-4">Aucun message à afficher</p></div>:
    <div className="grid lg:grid-cols-2 gap-4">{messages.map(m=><Row key={m.id} message={m} onChange={reload}/>)}</div>}
  <div className="flex flex-wrap justify-between gap-4 items-center">
   <p className="text-sm text-zinc-500">Page {Math.floor(offset/limit)+1}</p>
   <div className="flex gap-2">
    <button type="button" disabled={!offset} onClick={()=>setOffset(o=>Math.max(0,o-limit))} className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-40"><ChevronLeft className="inline w-4 h-4"/>Précédent</button>
    <button type="button" disabled={offset+limit>=total} onClick={()=>setOffset(o=>o+limit)} className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-40">Suivant<ChevronRight className="inline w-4 h-4"/></button>
   </div>
  </div>
 </section>
}
