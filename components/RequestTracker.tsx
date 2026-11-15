'use client'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {supabase} from '@/lib/supabaseClient'
import {CheckCircle2,Copy,RefreshCcw,ShieldCheck,Search} from 'lucide-react'

type Progress={status:string;created_at:string;finished:boolean;consent_active:boolean}
export function RequestTracker(){
 const [code,setCode]=useState('')
 const [progress,setProgress]=useState<Progress|null>(null)
 const [loading,setLoading]=useState(false)
 const [error,setError]=useState('')
 const [copied,setCopied]=useState(false)
 const [withdrawing,setWithdrawing]=useState(false)
 const [notice,setNotice]=useState('')
 async function lookup(token:string){
  if(!/^[a-f0-9]{48}$/i.test(token.trim())){setError('Référence invalide : 48 caractères hexadécimaux attendus.');return}
  setError('');setLoading(true);setProgress(null)
  const {data,error:e}=await supabase.functions.invoke('leads-gateway',{body:{action:'tracking.status',tracking_token:token.trim()}})
  setLoading(false)
  if(e||!data?.success){setError(data?.error||'La référence n’a pas pu être vérifiée.');return}
  setProgress({status:data.status,created_at:data.created_at,finished:Boolean(data.finished),consent_active:Boolean(data.consent_active)})
 }
 useEffect(()=>{
  const stored=window.localStorage.getItem('monforfait_tracking_token')||''
  if(/^[a-f0-9]{48}$/i.test(stored)){setCode(stored);void lookup(stored)}
 },[])
 async function withdraw(){
  if(!window.confirm('Retirer définitivement votre accord de mise en relation ? Les futures transmissions seront bloquées et tout accès partenaire encore actif sera interrompu. Un partenaire ayant déjà consulté votre demande peut conserver des informations conformément à ses obligations légales.'))return
  setWithdrawing(true);setError('');setNotice('')
  const {data,error:e}=await supabase.functions.invoke('leads-gateway',{body:{action:'tracking.withdraw',tracking_token:code}})
  setWithdrawing(false)
  if(e||!data?.success){setError(data?.error||"Impossible de retirer l'accord.");return}
  setNotice("Votre accord de mise en relation a été retiré et la disponibilité des informations aux partenaires interrompue dans MonForfait.")
  void lookup(code)
 }
 async function copy(){
  try{await navigator.clipboard.writeText(code);setCopied(true)}catch{setError('Copie indisponible : sélectionnez la référence et copiez-la manuellement.')}
 }
 return <section className="max-w-3xl mx-auto px-5 py-12 space-y-5">
  <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8">
   <label htmlFor="tracking-code" className="text-sm font-bold text-zinc-900 dark:text-white">Référence confidentielle</label>
   <p className="mt-1 text-xs text-zinc-500">Elle est enregistrée uniquement sur cet appareil après la soumission de votre demande. Conservez-la pour un suivi sur un autre appareil.</p>
   <form onSubmit={e=>{e.preventDefault();void lookup(code)}} className="mt-5 flex flex-col sm:flex-row gap-3">
    <input id="tracking-code" value={code} onChange={e=>{setCode(e.target.value);setProgress(null);setCopied(false)}} autoComplete="off" spellCheck={false} placeholder="Votre référence privée" maxLength={48} required
     className="min-w-0 flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3 font-mono text-xs sm:text-sm text-zinc-900 dark:text-white"/>
    <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-5 py-3 disabled:opacity-50"><Search className="w-4 h-4"/>{loading?'Vérification…':'Consulter'}</button>
   </form>
   {code&&<button onClick={copy} type="button" className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300"><Copy className="w-4 h-4"/>{copied?'Référence copiée':'Copier la référence'}</button>}
   {notice&&<p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-green-800 text-sm">{notice}</p>}
   {error&&<p role="alert" className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>}
  </div>
  {progress&&<div className="rounded-3xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-6 md:p-8">
   <div className="flex gap-3 items-start"><CheckCircle2 className="w-8 h-8 text-blue-600 shrink-0"/>
    <div><p className="text-sm text-zinc-500">Statut actuel</p><h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{progress.status}</h2>
     <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-300">Demande reçue le {new Date(progress.created_at).toLocaleDateString('fr-MA')}.</p>
    </div>
   </div>
   <p className="mt-5 text-xs text-zinc-600 dark:text-zinc-300">{progress.finished?'Votre dossier a été clôturé.':'La disponibilité et les délais dépendent d’un partenaire commercial. Ce suivi n’est pas une confirmation de couverture ni de souscription.'}</p>
   <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300" onClick={()=>void lookup(code)}><RefreshCcw className="w-4 h-4"/>Actualiser</button>
   {progress.consent_active&&<div className="mt-6 border-t border-blue-200 dark:border-blue-900 pt-5">
     <h3 className="text-base font-bold text-zinc-900 dark:text-white">Contrôler mon consentement</h3>
     <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">Vous pouvez retirer votre autorisation de mise en relation. Cela interrompt les nouveaux partages et les accès actifs dans MonForfait ; les obligations de conservation de données déjà transmises peuvent subsister chez des partenaires.</p>
     <button type="button" disabled={withdrawing} onClick={()=>void withdraw()} className="mt-4 rounded-xl border border-red-300 text-red-700 dark:text-red-300 px-5 py-3 text-sm font-semibold disabled:opacity-50">{withdrawing?'Retrait en cours…':'Retirer mon accord de mise en relation'}</button>
    </div>}
  </div>}
  <div className="flex gap-3 items-start text-sm text-zinc-600 dark:text-zinc-400"><ShieldCheck className="w-5 h-5 shrink-0 text-green-600"/><p>Ce suivi ne révèle pas votre identité, votre numéro, votre adresse ou les données d’un opérateur. Si vous avez perdu votre référence, <Link href="/contact" className="underline text-blue-600">contactez-nous</Link> pour une demande d’assistance et de vérification d’identité.</p></div>
 </section>
}
