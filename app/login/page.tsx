'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabase} from '@/lib/supabaseClient'
import Link from 'next/link'

export default function PrivateLogin(){
 const router=useRouter()
 const [email,setEmail]=useState('')
 const [password,setPassword]=useState('')
 const [message,setMessage]=useState('')
 const [busy,setBusy]=useState(false)
 async function logIn(e:React.FormEvent){
  e.preventDefault();setBusy(true);setMessage('')
  const {error}=await supabase.auth.signInWithPassword({email,password})
  setBusy(false)
  if(error){setMessage('Identifiants incorrects. Essayez un lien de connexion.');return}
  router.push('/admin');router.refresh()
 }
 async function magic(){
  setBusy(true);setMessage('')
  const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin+'/admin'}})
  setBusy(false)
  setMessage(error?'Lien non envoyé. Vérifiez votre adresse et réessayez.':'Si le compte est autorisé, un lien de connexion a été envoyé.')
 }
 return <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-5 text-white">
  <div className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
   <Link href="/" className="text-blue-300 font-semibold">← MonForfait.ma</Link>
   <div><h1 className="text-3xl font-bold">Accès privé</h1><p className="mt-2 text-zinc-400">Réservé aux administrateurs autorisés. Les comptes de démonstration ont été désactivés.</p></div>
   <form onSubmit={logIn} className="space-y-4">
    <label className="block text-sm">Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl bg-zinc-800 p-3" /></label>
    <label className="block text-sm">Mot de passe<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl bg-zinc-800 p-3" /></label>
    <button disabled={busy} type="submit" className="w-full rounded-xl bg-blue-600 p-3 font-semibold disabled:opacity-50">Connexion sécurisée</button>
   </form>
   <button onClick={magic} disabled={busy||!email} className="w-full rounded-xl border border-zinc-700 p-3 font-semibold disabled:opacity-50">Recevoir un lien par email</button>
   <p role="status" className="text-sm text-amber-200">{message}</p>
   <p className="text-sm text-zinc-400">Vous souhaitez devenir partenaire ? <Link href="/partenaires" className="underline">Écrivez-nous</Link>.</p>
  </div>
 </main>
}
