'use client'
import {useEffect,useMemo,useState} from 'react'
import Link from 'next/link'
import {Navigation} from '@/components/Navigation'
import {OfferCard, type OfferProps} from '@/components/OfferCard'
import {LeadModal} from '@/components/LeadModal'
import {selectOfferFromReceipt} from '@/lib/leadGateway'
import {supabase} from '@/lib/supabaseClient'
import {useTranslation} from '@/lib/LocaleContext'
import {ArrowRight,CheckCircle2,ShieldCheck,Wifi,Building2} from 'lucide-react'

type QuizContext={
 category?:string;priority?:string;userType?:string;city?:string;
 leadData?:{name?:string};leadId?:string
}
const readContext=():QuizContext|null=>{
 try{const raw=sessionStorage.getItem('quiz_answers');return raw?JSON.parse(raw):null}catch{return null}
}
export function ResultsClient(){
 const {isRtl,locale}=useTranslation()
 const ar=locale==='ar'
 const [context,setContext]=useState<QuizContext|null>(null)
 const [offers,setOffers]=useState<OfferProps[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [submitting,setSubmitting]=useState<string|null>(null)
 const [selected,setSelected]=useState<OfferProps|null>(null)
 const [manual,setManual]=useState<OfferProps|null>(null)
 const [isPro,setIsPro]=useState(false)
 useEffect(()=>{
  let mounted=true
  const context=readContext()
  if(!context){setLoading(false);setError(ar?'ابدأ الاستبيان أولاً.':'Commencez par le questionnaire pour afficher des résultats adaptés.');return}
  setContext(context)
  const professional=['small_office','enterprise'].includes(context.userType||'')
  setIsPro(professional)
  if(professional){setLoading(false);return}
  ;(async()=>{
   let query=supabase.from('plans').select('id,title,category,price_dh,download_speed_mbps,upload_speed_mbps,mobile_data_gb,voice_minutes,technology,target_audience,source_url,source_checked_at,operators(name)')
     .eq('is_active',true)
   if(context.category==='internet'||context.category==='mobile')query=query.eq('category',context.category)
   const {data,error:loadError}=await query
   if(!mounted)return
   if(loadError){setError('Offres momentanément indisponibles, merci de réessayer.');setLoading(false);return}
   const parsed:OfferProps[]=(data||[]).map((o:any)=>({
     id:o.id,title:o.title,operator_name:o.operators?.name||'Opérateur',
     category:o.category,price_dh:Number(o.price_dh),download_speed:o.download_speed_mbps,
     upload_speed:o.upload_speed_mbps,mobile_data_gb:o.mobile_data_gb,
     voice_minutes:o.voice_minutes,technology:o.technology,source_url:o.source_url,
     source_checked_at:o.source_checked_at,target_audience:o.target_audience||'individual'
   }))
   parsed.sort((a,b)=>{
     if(context.priority==='fastest'){
       const power=(o:OfferProps)=>o.category==='mobile'?(o.mobile_data_gb||0):(o.download_speed||0)
       return power(b)-power(a)||a.price_dh-b.price_dh
     }
     if(context.priority==='best_value'){
       const value=(o:OfferProps)=>(o.category==='mobile'?(o.mobile_data_gb||0):(o.download_speed||0))/Math.max(1,o.price_dh)
       return value(b)-value(a)||a.price_dh-b.price_dh
     }
     return a.price_dh-b.price_dh
   })
   setOffers(parsed.slice(0,9));setLoading(false)
  })()
  return()=>{mounted=false}
 },[ar])
 async function choose(offer:OfferProps){
  if(!offer.id)return
  setError('');setSubmitting(offer.id)
  try{
   await selectOfferFromReceipt(offer.id)
   setSelected(offer)
  }catch(e){
   const message=e instanceof Error?e.message:'Enregistrement impossible.'
   if(message.includes('Référence introuvable'))setManual(offer)
   else setError(message)
  }finally{setSubmitting(null)}
 }
 const title=isPro?(ar?'طلب عرض للشركة':'Votre demande entreprise'):(ar?'العروض حسب اختياراتك':'Offres selon vos critères')
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-20" dir={isRtl?'rtl':'ltr'}>
  <Navigation/>
  <header className="bg-zinc-950 text-white px-5 pt-28 pb-14">
   <div className="max-w-6xl mx-auto">
    <p className="text-xs uppercase tracking-widest font-bold text-blue-300">{ar?'نتائج المقارنة':'Comparaison indépendante'}</p>
    <h1 className="mt-4 text-4xl md:text-5xl font-black">{title}</h1>
    <p className="mt-5 max-w-3xl text-zinc-300">{ar?'هذه أسعار معلنة لدى المشغلين وليست تأكيداً للتغطية أو تخفيضاً حصرياً.':'Classement indicatif à partir des tarifs publics. Aucune offre exclusive ou couverture technique n’est garantie.'}</p>
   </div>
  </header>
  <div className="max-w-6xl mx-auto px-5 py-10 space-y-9">
   {context&&<div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5">
    <div className="flex items-center gap-3"><CheckCircle2 className="text-blue-600 w-7 h-7"/>
      <div><p className="font-bold">{ar?'تم تسجيل الطلب':'Votre demande a été enregistrée'}</p>
      <p className="text-sm text-zinc-500">{context.city||''} · {ar?'الأهلية تخضع للتأكيد':'Éligibilité à confirmer'}</p></div>
    </div>
    <Link href="/suivi" className="rounded-xl bg-blue-600 text-white px-5 py-3 font-semibold">{ar?'تتبع الطلب':'Suivre ma demande'}</Link>
   </div>}
   {error&&<div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error} <Link href="/quiz" className="underline">Recommencer</Link></div>}
   {selected&&<div role="status" className="rounded-2xl bg-green-50 border border-green-200 text-green-900 p-6">
     <h2 className="text-xl font-bold">Offre sélectionnée : {selected.operator_name} — {selected.title}</h2>
     <p className="text-sm mt-2">Votre sélection est enregistrée dans votre demande. La souscription et les conditions restent à confirmer.</p>
     <Link href="/suivi" className="mt-4 inline-flex rounded-xl bg-green-700 text-white px-5 py-3 font-semibold">Consulter mon suivi</Link>
   </div>}
   {isPro?<section className="rounded-3xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-8">
     <Building2 className="w-10 h-10 text-blue-600"/>
     <h2 className="mt-5 text-2xl font-bold">Un devis professionnel nécessite une étude personnalisée</h2>
     <p className="mt-3 text-zinc-500">Les offres résidentielles ne sont pas présentées comme des tarifs professionnels. Votre demande est enregistrée et sera étudiée si un partenaire adapté est disponible.</p>
     <Link href="/partenaires" className="underline mt-5 inline-block text-blue-600">Comment fonctionne la mise en relation ?</Link>
    </section>:loading?<div className="text-center py-20 text-zinc-500">Chargement des tarifs vérifiés…</div>:
    offers.length===0?<div className="rounded-2xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center">
     <Wifi className="w-10 h-10 text-blue-600 mx-auto"/><h2 className="font-bold text-xl mt-4">Aucun tarif vérifié pour ces critères</h2>
     <p className="text-zinc-500 mt-2">Les opérateurs peuvent proposer d’autres offres. Consultez les sources officielles.</p>
     <Link href="/offers" className="inline-flex mt-5 text-blue-600 underline">Voir toutes les offres</Link>
    </div>:<section>
      <div className="mb-6 flex flex-wrap justify-between gap-4 items-end">
       <div><h2 className="text-2xl font-bold">Votre sélection ({offers.length})</h2>
        <p className="text-zinc-500 text-sm mt-2">Tri : {context?.priority==='fastest'?'débit / volume de data':context?.priority==='best_value'?'quantité annoncée / prix':'prix croissant'}. Comparez aussi les conditions, la data et les frais.</p>
       </div>
       <Link href="/offers" className="inline-flex items-center gap-2 text-blue-600 underline">Toutes les offres <ArrowRight className="w-4 h-4"/></Link>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
       {offers.map(o=><div key={o.id}>
        <OfferCard offer={o} onSelect={()=>void choose(o)}/>
        {submitting===o.id&&<p role="status" className="text-sm text-center text-blue-600 mt-2">Enregistrement de votre sélection…</p>}
       </div>)}
      </div>
     </section>
   }
   <div className="flex items-start gap-3 rounded-2xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
    <ShieldCheck className="w-7 h-7 text-green-600 shrink-0"/>
    <p className="text-sm text-zinc-500">MonForfait.ma n’est pas un opérateur. Les prix proviennent des sources indiquées sur les fiches. Aucun abonnement n'est activé lors de cette étape et aucune mise en relation n’est assurée sans partenaire disponible.</p>
   </div>
  </div>
  {manual&&<LeadModal offer={manual} onClose={()=>setManual(null)}/>}
 </main>
}
