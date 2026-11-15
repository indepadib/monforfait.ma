'use client'
import {useEffect,useState} from 'react'
import {Cookie,ShieldCheck} from 'lucide-react'
import Link from 'next/link'
import {useTranslation} from '@/lib/LocaleContext'

export function CookieConsent(){
 const {isRtl}=useTranslation()
 const [show,setShow]=useState(false)
 useEffect(()=>{
  const previous=window.localStorage.getItem('monforfait_cookie_consent')
  if(previous!=='accepted'&&previous!=='refused')setShow(true)
  const open=()=>setShow(true)
  window.addEventListener('monforfait:open-cookie-settings',open)
  return()=>window.removeEventListener('monforfait:open-cookie-settings',open)
 },[])
 function choose(value:'accepted'|'refused'){
  const before=window.localStorage.getItem('monforfait_cookie_consent')
  window.localStorage.setItem('monforfait_cookie_consent',value)
  window.dispatchEvent(new Event('monforfait:analytics-consent-changed'))
  setShow(false)
  if(before==='accepted'&&value==='refused')window.location.reload()
 }
 if(!show)return null
 return <aside aria-label="Préférences de confidentialité" className={`fixed bottom-20 ${isRtl?'left-3':'right-3'} z-[95] w-[calc(100%-1.5rem)] sm:max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-2xl`} dir={isRtl?'rtl':'ltr'}>
  <div className="flex items-center gap-3"><Cookie className="w-7 h-7 text-blue-600"/><h2 className="font-bold text-lg text-zinc-900 dark:text-white">Vos choix de confidentialité</h2></div>
  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 leading-relaxed">Les cookies strictement nécessaires permettent le fonctionnement du site. Avec votre accord, nous pouvons activer les statistiques de fréquentation et les services publicitaires tiers. Le refus n'empêche pas de comparer les offres.</p>
  <p className="flex gap-2 items-start text-xs text-zinc-500 mt-3"><ShieldCheck className="w-4 h-4 shrink-0"/>Vous pouvez modifier votre choix dans le pied de page. <Link href="/legal/privacy" className="underline text-blue-600">Confidentialité</Link>.</p>
  <div className="mt-5 grid grid-cols-2 gap-3">
   <button type="button" onClick={()=>choose('refused')} className="rounded-xl border border-zinc-300 dark:border-zinc-600 px-3 py-3 text-sm font-semibold text-zinc-900 dark:text-white">Tout refuser</button>
   <button type="button" onClick={()=>choose('accepted')} className="rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white">Tout accepter</button>
  </div>
 </aside>
}
