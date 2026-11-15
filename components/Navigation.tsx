'use client'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useTranslation} from '@/lib/LocaleContext'
import {ArrowUpRight,Menu,X,Globe2,ShieldCheck} from 'lucide-react'

export function Navigation(){
 const {locale,setLocale,isRtl}=useTranslation()
 const path=usePathname()
 const ar=locale==='ar'
 const [opened,setOpened]=useState(false)
 useEffect(()=>{setOpened(false)},[path])
 useEffect(()=>{
  function onKey(e:KeyboardEvent){if(e.key==='Escape')setOpened(false)}
  window.addEventListener('keydown',onKey)
  return()=>window.removeEventListener('keydown',onKey)
 },[])
 const tr=(fr:string,arabic:string)=>ar?arabic:fr
 const navItems=[
  {href:'/offers',fr:'Toutes les offres',ar:'كل العروض'},
  {href:'/quiz',fr:'Trouver mon forfait',ar:'ابحث عن اشتراكي'},
  {href:'/suivi',fr:'Suivre ma demande',ar:'تتبع طلبي'},
  {href:'/partenaires',fr:'Partenaires',ar:'الشركاء'}
 ]
 return <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-[#0e1421]/95 backdrop-blur-xl" dir={isRtl?'rtl':'ltr'}>
  <nav className="max-w-7xl mx-auto px-4 sm:px-5 h-[68px] flex items-center justify-between gap-4" aria-label={tr('Navigation principale','القائمة الرئيسية')}>
   <Link href="/" aria-label="MonForfait.ma — Accueil" className="flex items-center gap-2 shrink-0 group">
    <span className="w-10 h-10 rounded-xl bg-[#175bd6] text-white flex items-center justify-center group-hover:bg-blue-700 transition-colors shadow-sm">
     <svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23" fill="none">
      <rect x="2.5" y="14" width="4.5" height="6" rx="1.5" fill="white" opacity=".68"/>
      <rect x="9.5" y="7" width="4.5" height="13" rx="1.5" fill="white"/>
      <rect x="16.5" y="10.5" width="4.5" height="9.5" rx="1.5" fill="white" opacity=".88"/>
      <circle cx="11.75" cy="4.6" r="1.65" fill="white"/>
     </svg>
    </span>
    <span className="font-black text-[1.23rem] sm:text-[1.42rem] tracking-[-.04em] text-zinc-900 dark:text-white">
     Mon<span className="text-[#175bd6] dark:text-blue-400">Forfait</span><span className="text-zinc-500 dark:text-zinc-300 text-sm">.ma</span>
    </span>
   </Link>
   <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13px] xl:text-sm">
    {navItems.map(l=><Link key={l.href} href={l.href}
     aria-current={path===l.href?'page':undefined}
     className={\`font-semibold transition-colors hover:text-blue-700 dark:hover:text-blue-300 \${path===l.href?'text-blue-700 dark:text-blue-300':'text-zinc-600 dark:text-zinc-300'}\`}>
      {tr(l.fr,l.ar)}
     </Link>)}
   </div>
   <div className="flex gap-2 items-center shrink-0">
    <button type="button" onClick={()=>setLocale(ar?'fr':'ar')}
     className="inline-flex gap-2 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 px-3 py-2.5 text-xs font-bold"
     aria-label={ar?'Passer en français':'التبديل إلى اللغة العربية'}>
     <Globe2 className="w-4 h-4"/>{ar?'FR':'عربي'}
    </button>
    <Link href="/quiz"
     className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-bold transition-colors">
     {tr('Comparer', 'قارن الآن')}<ArrowUpRight className="w-4 h-4"/>
    </Link>
    <button type="button" aria-label={opened?tr('Fermer le menu','إغلاق القائمة'):tr('Ouvrir le menu','فتح القائمة')}
     aria-expanded={opened} aria-controls="monforfait-mobile-menu"
     onClick={()=>setOpened(x=>!x)}
     className="lg:hidden inline-flex w-11 h-11 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
     {opened?<X className="w-6 h-6"/>:<Menu className="w-6 h-6"/>}
    </button>
   </div>
  </nav>
  {opened&&<div id="monforfait-mobile-menu" className="lg:hidden absolute left-0 right-0 top-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e1421] shadow-xl p-4 sm:px-6" role="region" aria-label={tr('Menu mobile','القائمة')}>
   <div className="flex flex-col gap-1 max-w-2xl mx-auto">
    {navItems.map(l=><Link key={l.href} href={l.href} onClick={()=>setOpened(false)}
     aria-current={path===l.href?'page':undefined}
     className={\`rounded-xl px-4 py-3.5 text-sm font-semibold \${path===l.href?'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300':'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900'}\`}>
     {tr(l.fr,l.ar)}</Link>)}
    <div className="border-t border-zinc-200 dark:border-zinc-800 my-2"/>
    <Link href="/contact" onClick={()=>setOpened(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">{tr('Contact et assistance','اتصل بنا')}</Link>
    <Link href="/login" onClick={()=>setOpened(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">{tr('Connexion administrateur / partenaire','تسجيل الدخول للإدارة والشركاء')}</Link>
    <div className="flex gap-2 items-start rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 px-4 py-3 mt-2 text-xs">
     <ShieldCheck className="w-4 h-4 shrink-0"/>{tr('Comparaison gratuite et sans engagement. Disponibilité à confirmer auprès de l’opérateur.','مقارنة مجانية دون التزام. توفر الخدمة يؤكد من قبل المشغل.')}
    </div>
   </div>
  </div>}
 </header>
}
