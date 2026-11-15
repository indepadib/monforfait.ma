'use client'
import {useCallback,useEffect,useMemo,useState} from 'react'
import Link from 'next/link'
import {OfferCard,type OfferProps} from './OfferCard'
import {LeadModal} from './LeadModal'
import {supabase} from '@/lib/supabaseClient'
import {useTranslation} from '@/lib/LocaleContext'
import {Wifi,Smartphone,Briefcase,UserRound,ArrowUpDown,AlertCircle,ShieldCheck,RefreshCcw,ArrowRight} from 'lucide-react'
type Audience='individual'|'professional'
type Category='internet'|'mobile'
type Sort='price'|'features'
export function ComparisonSection(){
 const {locale,isRtl}=useTranslation()
 const ar=locale==='ar'
 const tr=(fr:string,arabic:string)=>ar?arabic:fr
 const [audience,setAudience]=useState<Audience>('individual')
 const [category,setCategory]=useState<Category>('internet')
 const [sortBy,setSortBy]=useState<Sort>('price')
 const [offers,setOffers]=useState<OfferProps[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [selectedOffer,setSelectedOffer]=useState<OfferProps|null>(null)
 const load=useCallback(async()=>{
  setLoading(true);setError('')
  try{
   const {data,error:e}=await supabase.from('plans').select(
    'id,title,category,target_audience,price_dh,download_speed_mbps,upload_speed_mbps,mobile_data_gb,voice_minutes,technology,source_url,source_checked_at,operators(name)'
   ).eq('is_active',true).eq('category',category).eq('target_audience',audience)
    .not('source_url','is',null).order('price_dh',{ascending:true}).limit(100)
   if(e)throw e
   setOffers((data||[]).map((o:any)=>({
    id:o.id,title:o.title,operator_name:o.operators?.name||tr('Opérateur','مشغل'),
    category:o.category,target_audience:o.target_audience,
    price_dh:Number(o.price_dh),download_speed:o.download_speed_mbps,
    upload_speed:o.upload_speed_mbps,mobile_data_gb:o.mobile_data_gb,
    voice_minutes:o.voice_minutes,technology:o.technology,
    source_url:o.source_url,source_checked_at:o.source_checked_at
   })))
  }catch{
   setOffers([])
   setError(tr('Impossible de charger les tarifs actuellement.','تعذر تحميل العروض حاليا.'))
  }finally{setLoading(false)}
 },[audience,category,locale])
 useEffect(()=>{void load()},[load])
 useEffect(()=>{
  const pro=()=>setAudience('professional')
  window.addEventListener('switch-audience-pro',pro)
  return()=>window.removeEventListener('switch-audience-pro',pro)
 },[])
 const sorted=useMemo(()=>[...offers].sort((a,b)=>
  sortBy==='price'?a.price_dh-b.price_dh:
  category==='internet'?(b.download_speed||0)-(a.download_speed||0):
   (b.mobile_data_gb||0)-(a.mobile_data_gb||0)
 ),[offers,sortBy,category])
 return <section className="max-w-7xl mx-auto px-5 py-14 sm:py-20" id="comparateur" dir={isRtl?'rtl':'ltr'} aria-labelledby="offers-comparison-heading">
  <div className="flex flex-col md:flex-row justify-between gap-5 items-start md:items-end mb-8">
   <div className="max-w-2xl">
    <p className="text-blue-700 dark:text-blue-300 uppercase tracking-widest text-xs font-bold">{tr('Comparer librement','قارن بحرية')}</p>
    <h2 id="offers-comparison-heading" className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mt-3">
     {tr('Les offres, sans conditions cachées.','العروض دون شروط مخفية.')}
    </h2>
    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-4 leading-relaxed">
     {tr('Consultez les tarifs publics sourcés sans créer de compte. Demandez à être recontacté seulement si une offre vous intéresse.',
     'تصفح الأسعار العمومية الموثقة دون إنشاء حساب. اطلب التواصل فقط عند اهتمامك بعرض.')}
    </p>
   </div>
   <Link href="/offers" className="inline-flex gap-2 items-center text-blue-700 dark:text-blue-300 text-sm font-bold hover:underline">
    {tr('Catalogue complet','كل العروض')}<ArrowRight className="w-4 h-4"/>
   </Link>
  </div>
  <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 mb-8">
   <div className="flex flex-wrap gap-4 justify-between items-center">
    <div className="inline-flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl" role="group" aria-label={tr('Type de client','نوع العميل')}>
     <button type="button" onClick={()=>setAudience('individual')} aria-pressed={audience==='individual'}
      className={'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-colors '+(audience==='individual'?'bg-white dark:bg-zinc-800 shadow text-blue-700 dark:text-blue-300':'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300')}>
      <UserRound className="w-4 h-4"/>{tr('Particulier','أفراد')}
     </button>
     <button type="button" onClick={()=>setAudience('professional')} aria-pressed={audience==='professional'}
      className={'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-colors '+(audience==='professional'?'bg-white dark:bg-zinc-800 shadow text-blue-700 dark:text-blue-300':'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300')}>
      <Briefcase className="w-4 h-4"/>{tr('Entreprise','شركات')}
     </button>
    </div>
    <div className="inline-flex gap-2">
     <button type="button" aria-pressed={category==='internet'} onClick={()=>setCategory('internet')}
      className={'rounded-xl px-4 py-3 text-sm font-bold inline-flex gap-2 items-center border transition-colors '+(category==='internet'?'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300':'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400')}>
      <Wifi className="w-4 h-4"/>{tr('Internet','إنترنت')}
     </button>
     <button type="button" aria-pressed={category==='mobile'} onClick={()=>setCategory('mobile')}
      className={'rounded-xl px-4 py-3 text-sm font-bold inline-flex gap-2 items-center border transition-colors '+(category==='mobile'?'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300':'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400')}>
      <Smartphone className="w-4 h-4"/>{tr('Mobile','هاتف')}
     </button>
    </div>
   </div>
  </div>
  <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
   <p className="text-zinc-600 dark:text-zinc-400 text-sm">
    {loading?tr('Recherche en cours…','جاري التحميل…'):tr(sorted.length+' offre(s) sourcée(s) disponible(s)',sorted.length+' عرض متاح بمرجع رسمي')}
   </p>
   <div className="flex items-center gap-2">
    <ArrowUpDown className="w-4 h-4 text-zinc-500"/>
    <label htmlFor="home-sort" className="text-sm text-zinc-500">{tr('Trier :','الترتيب:')}</label>
    <select id="home-sort" value={sortBy} onChange={e=>setSortBy(e.target.value as Sort)}
     className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2.5 text-sm text-zinc-900 dark:text-white">
     <option value="price">{tr('Prix croissant','السعر تصاعديا')}</option>
     <option value="features">{category==='internet'?tr('Débit annoncé','سرعة الإنترنت'):tr('Volume de données','حجم الإنترنت')}</option>
    </select>
   </div>
  </div>
  {loading?<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
   {[1,2,3].map(x=><div key={x} className="h-[340px] rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"/>)}
  </div>:error?<div role="alert" className="rounded-2xl border border-red-200 bg-red-50 text-red-800 p-7 flex gap-4 items-start">
   <AlertCircle className="w-6 h-6 shrink-0"/><div><p className="font-bold">{error}</p>
    <button onClick={()=>void load()} type="button" className="mt-4 underline inline-flex items-center gap-2"><RefreshCcw className="w-4 h-4"/>{tr('Réessayer','أعد المحاولة')}</button>
   </div>
  </div>:sorted.length===0?<div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-10 text-center">
   <h3 className="font-bold text-xl">{tr('Aucune offre source disponible dans cette sélection','لا توجد عروض متاحة في هذه الفئة')}</h3>
   <p className="mt-3 text-zinc-500 text-sm">{tr('Essayez une autre catégorie ou consultez toutes les offres. Aucune offre fictive n’est affichée.','جرّب فئة أخرى أو تصفح كل العروض.')}</p>
   {audience==='professional'&&<p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mt-4">{tr(
     'Les tarifs professionnels sont souvent établis sur devis. Vous pouvez décrire votre besoin, sans garantie de devis ou de partenaire disponible.',
     'تتطلب عروض الشركات غالبا عرض سعر خاصا. يمكنك إرسال احتياجاتك دون ضمان توفر عرض أو شريك.'
    )}</p>}
   {audience==='professional'&&<Link href="/quiz" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-bold px-5 py-3 text-sm">{tr('Décrire mon besoin professionnel','تقديم طلب شركة')}<ArrowRight className="w-4 h-4"/></Link>}
   <Link href="/offers" className="mt-5 inline-block text-blue-700 dark:text-blue-300 underline font-semibold">{tr('Voir toutes les offres','عرض كل العروض')}</Link>
  </div>:<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sorted.map(offer=><OfferCard key={offer.id} offer={offer} onSelect={()=>setSelectedOffer(offer)}/>)}
   </div>}
  <div className="mt-8 flex items-start gap-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-sm text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900">
   <ShieldCheck className="w-6 h-6 shrink-0 text-blue-600"/>
   <p>{tr("Toutes les offres affichées disposent d'une source renseignée. La date de vérification figure sur leur fiche. Les conditions de couverture, d'engagement et les frais éventuels restent à confirmer avec l’opérateur.",
    'كل العروض المعروضة لها مصدر. تحقق من تاريخ مراجعة كل عرض ومن شروط التغطية والعقد والتكاليف لدى المشغل.')}</p>
  </div>
  {selectedOffer&&<LeadModal offer={selectedOffer} onClose={()=>setSelectedOffer(null)}/>}
 </section>
}
