'use client'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {supabase} from '@/lib/supabaseClient'
import {allowedAuthDestination} from '@/lib/authRouting'
import {LockKeyhole,AlertCircle,LoaderCircle} from 'lucide-react'

/**
 * Explicit callback on the MonForfait origin. Never redirect to arbitrary
 * next URLs, even if the email link itself was edited by a third party.
 * Supabase auth state is initialized by the browser client (implicit magic
 * links are delivered in URL fragments; PKCE may deliver a code).
 */
export default function AuthCallback(){
 const router=useRouter()
 const [error,setError]=useState('')
 const [returnTo,setReturnTo]=useState('/login')
 useEffect(()=>{
  let active=true
  const params=new URLSearchParams(window.location.search)
  const fragment=new URLSearchParams(window.location.hash.slice(1))
  const next=allowedAuthDestination(params.get('next'))||'/admin'
  setReturnTo(next==='/espace-partenaire'?'/login?tab=partner':'/login?tab=admin')
  const authError=params.get('error')||fragment.get('error')
  if(authError){
   setError('Le lien de connexion est invalide ou a expiré. Demandez un nouveau lien depuis MonForfait.')
   return
  }
  ;(async()=>{
   try{
    // getSession awaits Supabase JS initialization, which recognizes implicit
    // #access_token fragments and may automatically exchange PKCE codes.
    const existing=await supabase.auth.getSession()
    if(!active)return
    if(existing.error)throw existing.error
    let session=existing.data.session
    const code=params.get('code')
    if(!session && code){
     const exchanged=await supabase.auth.exchangeCodeForSession(code)
     if(exchanged.error)throw exchanged.error
     session=exchanged.data.session
    }
    if(!active)return
    if(!session)throw new Error('Session absente')
    // The authenticated private route verifies the actual database role.
    router.replace(next)
    router.refresh()
   }catch{
    if(active)setError('Connexion non confirmée. Le lien a peut-être expiré, ou la configuration des URL Supabase est incorrecte.')
   }
  })()
  return()=>{active=false}
 },[router])
 return <main className="min-h-screen bg-zinc-950 text-white p-5 flex items-center justify-center">
  <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-7 sm:p-9 text-center shadow-xl">
   <LockKeyhole className="w-10 h-10 mx-auto text-blue-400"/>
   <h1 className="font-black text-2xl mt-5">Connexion MonForfait.ma</h1>
   {error?<div role="alert" className="mt-6">
    <AlertCircle className="w-7 h-7 mx-auto text-amber-400"/>
    <p className="mt-4 text-zinc-300 text-sm leading-relaxed">{error}</p>
    <Link href={returnTo} className="inline-flex justify-center mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 font-bold">
     Recevoir un nouveau lien
    </Link>
   </div>:<div role="status" aria-live="polite" className="mt-6">
    <LoaderCircle className="w-8 h-8 mx-auto animate-spin text-blue-400"/>
    <p className="mt-4 text-zinc-300 text-sm">Vérification de votre connexion sécurisée…</p>
   </div>}
   <Link href="/" className="block mt-6 text-sm text-zinc-400 hover:text-white">Retour à MonForfait.ma</Link>
  </div>
 </main>
}
