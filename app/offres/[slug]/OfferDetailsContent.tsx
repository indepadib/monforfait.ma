'use client'
import Link from 'next/link'
import {Navigation} from '@/components/Navigation'
import {OfferCard,type OfferProps} from '@/components/OfferCard'
import {useTranslation} from '@/lib/LocaleContext'
import {ArrowLeft,ExternalLink,ShieldCheck,Wifi,Smartphone,CalendarCheck,Info} from 'lucide-react'

export default function OfferDetailsContent({offer}:{offer:OfferProps}){
 const {isRtl,locale}=useTranslation()
 const ar=locale==='ar'
 const provider=offer.operator_name.toLowerCase()
 const operatorSlug=provider.includes('inwi')?'inwi':provider.includes('orange')?'orange':'iam'
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white" dir={isRtl?'rtl':'ltr'}>
  <Navigation/>
  <header className="bg-zinc-950 px-5 pt-28 pb-16 text-white">
   <div className="max-w-6xl mx-auto">
    <Link href="/offers" className="inline-flex gap-2 items-center text-blue-300 text-sm">
     <ArrowLeft className="w-4 h-4"/>{ar?'كل العروض':'Toutes les offres'}
    </Link>
    <p className="mt-8 uppercase font-bold tracking-widest text-xs text-blue-300">{ar?'عرض مرجعي':'Fiche tarifaire sourcée'}</p>
    <h1 className="mt-4 text-4xl md:text-6xl font-black">{offer.title}</h1>
    <p className="mt-4 text-zinc-300 text-lg">{offer.operator_name} · {ar?'الأسعار العمومية':'Tarif public indicatif'}</p>
    <div className="mt-7 flex flex-wrap items-end gap-4">
     <p className="text-4xl md:text-5xl font-black">{Number(offer.price_dh).toLocaleString('fr-MA')} <span className="text-lg font-semibold text-zinc-300">DH / {ar?'شهر':'mois'}</span></p>
    </div>
   </div>
  </header>
  <div className="max-w-6xl mx-auto px-5 py-12 grid lg:grid-cols-[1fr_0.8fr] gap-7">
   <div className="space-y-6">
    <section className="rounded-3xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6 md:p-8">
     <h2 className="text-2xl font-bold">{ar?'خصائص العرض':'Caractéristiques annoncées'}</h2>
     <div className="grid sm:grid-cols-2 gap-4 mt-6">
      <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 p-4">
       {offer.category==='internet'?<Wifi className="w-7 h-7 text-blue-600"/>:<Smartphone className="w-7 h-7 text-blue-600"/>}
       <p className="text-sm text-zinc-500 mt-3">{ar?'نوع العرض':'Catégorie'}</p>
       <p className="font-bold mt-1">{offer.category==='mobile'?'Mobile':'Internet'}</p>
      </div>
      <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 p-4">
       <Info className="w-7 h-7 text-blue-600"/>
       <p className="text-sm text-zinc-500 mt-3">{ar?'التقنية أو البيانات':'Technologie / données'}</p>
       <p className="font-bold mt-1">{offer.category==='mobile'?(offer.mobile_data_gb!==undefined&&offer.mobile_data_gb!==null?offer.mobile_data_gb+' Go':'À confirmer'):(offer.technology||'À confirmer')}</p>
      </div>
      {offer.category==='internet'&&<div className="rounded-xl bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 p-4">
       <Wifi className="w-7 h-7 text-blue-600"/>
       <p className="text-sm text-zinc-500 mt-3">{ar?'سرعة التحميل':'Débit descendant annoncé'}</p>
       <p className="font-bold mt-1">{offer.download_speed?offer.download_speed+' Mb/s':'À confirmer'}</p>
      </div>}
      <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 p-4">
       <CalendarCheck className="w-7 h-7 text-blue-600"/>
       <p className="text-sm text-zinc-500 mt-3">{ar?'آخر تحقق':'Dernière vérification indiquée'}</p>
       <p className="font-bold mt-1">{offer.source_checked_at?new Date(offer.source_checked_at).toLocaleDateString('fr-MA'):'Non renseignée'}</p>
      </div>
     </div>
     {offer.source_url&&<a href={offer.source_url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 mt-7 text-blue-600 font-semibold underline">
      <ExternalLink className="w-4 h-4"/>{ar?'التحقق من الموقع الرسمي':'Vérifier le tarif sur la source officielle'}
     </a>}
    </section>
    <section className="rounded-3xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6 md:p-8">
     <div className="flex gap-3 items-start">
      <ShieldCheck className="w-8 h-8 text-green-600 shrink-0"/>
      <div><h2 className="text-xl font-bold">{ar?'قبل الاشتراك':'À confirmer avant la souscription'}</h2>
       <p className="text-sm text-zinc-500 mt-3 leading-relaxed">{ar?
        'المقارنة معلوماتية ولا تؤكد التغطية التقنية أو توفر الخدمة. تحقق من رسوم التركيب ومدة الالتزام والشروط النهائية مع المشغل.':
        "Cette comparaison est informative. L'éligibilité à votre adresse, le délai de raccordement, les frais d'activation, la durée d'engagement et le prix contractuel final doivent être confirmés auprès de l'opérateur."}</p>
      </div>
     </div>
     <p className="text-sm mt-5"><Link href={'/operateurs/'+operatorSlug} className="underline text-blue-600">{ar?'مقارنة عروض نفس المشغل':'Comparer les autres offres de cet opérateur'}</Link></p>
    </section>
   </div>
   <aside className="lg:sticky lg:top-24 self-start">
    <p className="text-sm text-zinc-500 mb-4">{ar?'للتواصل بشأن هذا العرض':'Pour demander à être recontacté au sujet de cette offre :'}</p>
    <OfferCard offer={offer}/>
    <p className="text-xs text-zinc-500 mt-4 text-center">{ar?'إرسال الطلب لا يمثل اشتراكا في الخدمة.':'L’envoi du formulaire ne réalise aucun abonnement ni réservation.'}</p>
   </aside>
  </div>
 </main>
}
