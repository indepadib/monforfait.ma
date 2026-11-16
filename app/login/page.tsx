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
 useEffect(()=>{
  const params=new URLSearchParams(window.location.search)
  if(params.get('tab')==='partner'||params.get('next')==='/espace-partenaire')setRole('partner')
 },[])
 const destination=privateDestination(role)
 async function logIn(e:React.FormEvent){
  e.preventDefault();setBusy(true);setMessage('')
  const {error}=await supabase.auth.signInWithPassword({email,password})
  setBusy(false)
  if(error){setMessage('Identifiants incorrects. Essayez un lien sécurisé.');return}
  router.push(destination);router.refresh()
 }
 async function magic(){
  if(!email)return
  setBusy(true);setMessage('')
  const {error}=await supabase.auth.signInWithOtp({email,
    options:{
      // Explicitly return to MonForfait, never to the shared Supabase Site URL fallback.
      emailRedirectTo:authCallbackUrl(destination,window.location.origin),
      shouldCreateUser:role==='partner'
    }})
  setBusy(false)
  setMessage(error?'Lien non envoyé. Vérifiez l’adresse et réessayez.':'Si cet email est autorisé, vérifiez votre boîte de réception. Le lien doit vous ramener sur monforfait.ma, jamais sur une autre application.')
 }
 return <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-5 text-white">
  <div className="w-full max-w-lg space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-7 md:p-10">
   <Link href="/" className="text-blue-300 font-semibold">← MonForfait.ma</Link>
   <div><h1 className="text-3xl font-black">Connexion sécurisée</h1><p className="mt-2 text-zinc-400">L'accès aux données des demandes exige une identité vérifiée et une autorisation explicite.</p></div>
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
   <button onClick={magic} disabled={busy||!email} className="w-full rounded-xl border border-zinc-600 p-3 font-semibold disabled:opacity-50">Recevoir un lien sécurisé par email</button>
   <p role="status" aria-live="polite" className="text-sm text-amber-200">{message}</p>
   {role==='partner'?<div className="rounded-xl bg-zinc-800/80 p-4 text-sm text-zinc-300"><ShieldCheck className="inline-block w-4 h-4 text-blue-400 mr-2"/> La création d'un compte ne donne accès à aucun prospect. L'accès est activé individuellement après validation contractuelle par MonForfait.ma. <Link href="/partenaires" className="underline text-blue-300">Demander un partenariat</Link>.</div>:<p className="text-sm text-zinc-400">Réservé aux administrateurs explicitement autorisés.</p>}
  </div>
 </main>
}
