'use client'
import {useEffect,useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabase} from '@/lib/supabaseClient'
import Link from 'next/link'
import {LockKeyhole,Building2,ShieldCheck} from 'lucide-react'
import {authCallbackUrl,privateDestination} from '@/lib/authRouting'

export default function PrivateLogin(){
 const router=useRouter()
 const [role,setRole]=useState<'admin'|'partner'>('admin')
 const [email,setEmail]=useState('')
 const [password,setPassword]=useState('')
 const [message,setMessage]=useState('')
 const [busy,setBusy]=useState(false)
 const [secondsLeft,setSecondsLeft]=useState(0)
 const [usingFallbackHost,setUsingFallbackHost]=useState(false)
 const COOLDOWN_KEY='monforfait_auth_email_retry_after'
 function beginCooldown(){
  const expiry=Date.now()+60_000
  try{window.localStorage.setItem(COOLDOWN_KEY,String(expiry))}catch{}
  setSecondsLeft(60)
 }
 useEffect(()=>{
  setUsingFallbackHost(!['monforfait.ma','www.monforfait.ma'].includes(window.location.hostname))
  function updateCooldown(){
   let expires=0
   try{expires=Number(window.localStorage.getItem(COOLDOWN_KEY))||0}catch{}
   setSecondsLeft(Math.max(0,Math.ceil((expires-Date.now())/1000)))
  }
  updateCooldown()
  const interval=window.setInterval(updateCooldown,1000)
  return()=>window.clearInterval(interval)
 },[])
 useEffect(()=>{
  const params=new URLSearchParams(window.location.search)
  if(params.get('tab')==='partner'||params.get('next')==='/espace-partenaire')setRole('partner')
 },[])
 const destination=privateDestination(role)
 async function logIn(e:React.FormEvent){
  e.preventDefault()
  if(busy)return
  setBusy(true);setMessage('')
  try{
   const {error}=await supabase.auth.signInWithPassword({email,password})
   if(error){
    setMessage(error.status===429
     ? 'Trop de tentatives de connexion. Patientez avant un nouvel essai.'
     : 'Connexion refusée. Vérifiez votre mot de passe, ou demandez un lien sécurisé lorsque le service le permet.')
    return
   }
   router.replace(destination)
   router.refresh()
  }catch{
   setMessage('Le service de connexion est momentanément inaccessible. Merci de réessayer.')
  }finally{setBusy(false)}
 }
 async function magic(){
  if(!email||busy||secondsLeft>0)return
  setBusy(true);setMessage('')
  try{
   const {error}=await supabase.auth.signInWithOtp({email:email.trim(),
     options:{
       // Supabase Auth is shared across apps. Always request MonForfait's
       // own callback, never the project-wide default Site URL.
       emailRedirectTo:authCallbackUrl(destination,window.location.origin),
       shouldCreateUser:role==='partner'
     }})
   if(error){
    if(error.status===429||error.code==='over_email_send_rate_limit'||error.code==='over_request_rate_limit'){
     beginCooldown()
     setMessage('Supabase limite temporairement les envois de liens (erreur 429). Attendez avant de réessayer et vérifiez si un lien récent est déjà arrivé. Notre délai affiché ne garantit pas que la limite Supabase aura expiré.')
    }else if(error.code==='email_address_invalid'){
     setMessage('Vérifiez le format de votre adresse email.')
    }else{
     setMessage('Le lien de connexion n’a pas pu être envoyé par Supabase. Vérifiez la configuration des redirections ou réessayez plus tard. Code : '+(error.code||String(error.status||'inconnu')))
    }
    return
   }
   beginCooldown()
   setMessage('La demande de connexion a été acceptée. Si ce compte est autorisé, ouvrez le lien le plus récent dans votre boîte email, une seule fois. La destination prévue est monforfait.ma.')
  }catch{
   setMessage('Le service de connexion ne répond pas. Vérifiez votre réseau et réessayez plus tard.')
  }finally{setBusy(false)}
 }
 return <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-5 text-white">
  <div className="w-full max-w-lg space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-7 md:p-10">
   <Link href="/" className="text-blue-300 font-semibold">← MonForfait.ma</Link>
   <div><h1 className="text-3xl font-black">Connexion sécurisée</h1><p className="mt-2 text-zinc-400">L'accès aux données des demandes exige une identité vérifiée et une autorisation explicite.</p></div>
   {usingFallbackHost&&<p role="note" className="rounded-xl border border-amber-700/50 bg-amber-900/20 text-amber-100 p-4 text-sm leading-relaxed">
    Vous utilisez l'adresse de secours Netlify. Les liens de connexion sont conçus pour revenir sur <strong>monforfait.ma</strong>. Si ce domaine affiche « Site not found », l'envoi d'un nouveau lien ne résoudra pas ce problème de domaine.
   </p>}
   <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/40 p-1" role="tablist" aria-label="Type de compte">
    <button type="button" role="tab" aria-selected={role==='admin'} onClick={()=>{setRole('admin');setMessage('')}} className={`rounded-lg p-3 font-semibold text-sm flex justify-center items-center gap-2 ${role==='admin'?'bg-blue-600 text-white':'text-zinc-400'}`}><LockKeyhole className="w-4 h-4"/> Administration</button>
    <button type="button" role="tab" aria-selected={role==='partner'} onClick={()=>{setRole('partner');setMessage('')}} className={`rounded-lg p-3 font-semibold text-sm flex justify-center items-center gap-2 ${role==='partner'?'bg-blue-600 text-white':'text-zinc-400'}`}><Building2 className="w-4 h-4"/> Partenaire</button>
   </div>
   <form onSubmit={logIn} className="space-y-4">
    <label className="block text-sm font-semibold">Email professionnel
     <input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-white" />
    </label>
    <label className="block text-sm font-semibold">Mot de passe (si vous en possédez un)
     <input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-white" />
    </label>
    <button disabled={busy||!email||!password} type="submit" className="w-full rounded-xl bg-blue-600 p-3 font-semibold disabled:opacity-50">Se connecter avec mot de passe</button>
   </form>
   <button onClick={magic} disabled={busy||!email||secondsLeft>0} className="w-full rounded-xl border border-zinc-600 p-3 font-semibold disabled:opacity-50">{secondsLeft>0?'Réessayer dans '+secondsLeft+' s':'Recevoir un lien sécurisé par email'}</button>
   <p role="status" aria-live="polite" className="text-sm text-amber-200">{message}</p>
    <p className="text-xs text-zinc-400">Les liens d'authentification sont à usage unique. Ne multipliez pas les demandes : Supabase impose des limites d'envoi communes aux applications de ce projet.</p>
   {role==='partner'?<div className="rounded-xl bg-zinc-800/80 p-4 text-sm text-zinc-300"><ShieldCheck className="inline-block w-4 h-4 text-blue-400 mr-2"/> La création d'un compte ne donne accès à aucun prospect. L'accès est activé individuellement après validation contractuelle par MonForfait.ma. <Link href="/partenaires" className="underline text-blue-300">Demander un partenariat</Link>.</div>:<p className="text-sm text-zinc-400">Réservé aux administrateurs explicitement autorisés.</p>}
  </div>
 </main>
}
