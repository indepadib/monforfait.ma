'use client'
import {useState} from 'react'
import {supabase} from '@/lib/supabaseClient'
import {ShieldCheck,LockKeyhole} from 'lucide-react'

type Sale={id:string;sales_stage:string;shared_at?:string|null;access_expires_at?:string|null}
type Partner={sales_status:string;contract_verified_at?:string|null}
export function SaleReleaseControl({sale,partner,onUpdated}:{sale:Sale;partner?:Partner;onUpdated:()=>void}){
 const [reference,setReference]=useState('')
 const [error,setError]=useState('')
 const [message,setMessage]=useState('')
 const [busy,setBusy]=useState(false)
 const approved=partner&&['contracted','active'].includes(partner.sales_status)&&Boolean(partner.contract_verified_at)
 const eligible=sale.sales_stage==='accepted'&&!sale.shared_at&&approved
 async function release(e:React.FormEvent){
  e.preventDefault();setError('');setMessage('');setBusy(true)
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
   body:{action:'admin.sales.release',sale_id:sale.id,contract_reference:reference}
  })
  setBusy(false)
  if(invokeError||!data?.success){setError(data?.error||'Partage refusé : vérifiez le consentement, le contrat et le statut.');return}
  setMessage('Transmission autorisée et journalisée pour 30 jours.');onUpdated()
 }
 return <div className="mt-3 border-t border-zinc-200 pt-3 space-y-3">
  {sale.shared_at?<div className="flex gap-2 items-start text-xs text-green-700">
   <ShieldCheck className="w-4 h-4 shrink-0"/>
   <span>Dossier transmis le {new Date(sale.shared_at).toLocaleDateString('fr-MA')}. Accès expirant le {sale.access_expires_at?new Date(sale.access_expires_at).toLocaleDateString('fr-MA'):'date non renseignée'}.</span>
  </div>:<div className="flex gap-2 items-center text-xs text-zinc-500"><LockKeyhole className="w-4 h-4"/> Coordonnées non transmises</div>}
  {eligible&&<form onSubmit={release} className="rounded-xl bg-blue-50 border border-blue-100 p-3 grid md:grid-cols-[1fr_auto] items-end gap-2">
    <label className="text-sm text-blue-950">Référence du contrat de transmission signé
     <input required minLength={6} maxLength={180} value={reference} onChange={e=>setReference(e.target.value)}
      placeholder="Référence contractuelle" className="mt-1 block w-full border rounded-lg bg-white p-3"/>
    </label>
    <button type="submit" disabled={busy} className="rounded-lg bg-blue-600 text-white font-semibold p-3 disabled:opacity-50">{busy?'Transmission…':'Autoriser le partage'}</button>
   </form>}
  {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
  {message&&<p role="status" className="text-sm text-green-700">{message}</p>}
 </div>
}
