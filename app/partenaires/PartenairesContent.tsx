'use client'
import {useState} from 'react'
import Link from 'next/link'
import {Navigation} from '@/components/Navigation'
import {PartnerWidgetEmbed} from '@/components/PartnerWidgetEmbed'
import {supabase} from '@/lib/supabaseClient'
import {useTranslation} from '@/lib/LocaleContext'
import {
  ArrowRight,ArrowUpRight,Building2,CheckCircle2,FileCheck2,Handshake,
  ShieldCheck,Code2,UserRoundCheck,MessageSquare,BarChart3,
  LockKeyhole,Globe2,AlertCircle
} from 'lucide-react'

type Inquiry={
 business_name:string;contact_name:string;business_email:string;
 contact_phone:string;partner_type:string;regions:string;services:string;
 estimated_volume:string;consent_to_contact:boolean;website:string
}
const empty:Inquiry={
 business_name:'',contact_name:'',business_email:'',contact_phone:'',
 partner_type:'distributor',regions:'',services:'fibre',estimated_volume:'',
 consent_to_contact:false,website:''
}
export default function PartenairesContent(){
 const {locale,isRtl}=useTranslation()
 const ar=locale==='ar'
 const tr=(fr:string,arabic:string)=>ar?arabic:fr
 const [inquiry,setInquiry]=useState<Inquiry>(empty)
 const [busy,setBusy]=useState(false)
 const [success,setSuccess]=useState(false)
 const [error,setError]=useState('')
 function setField<K extends keyof Inquiry>(key:K,value:Inquiry[K]){
  setInquiry(p=>({...p,[key]:value}));if(error)setError('')
 }
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault()
  if(busy)return
  setError('');setBusy(true)
  try{
   const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
    body:{action:'partner.request',...inquiry}
   })
   if(invokeError||!data?.success){
    setError(data?.error||tr('Votre demande n’a pas pu être enregistrée. Réessayez.','تعذر تسجيل طلبك، يرجى المحاولة مرة أخرى.'))
    return
   }
   setSuccess(true);setInquiry(empty)
  }catch{
   setError(tr('Service momentanément indisponible. Réessayez plus tard.','الخدمة غير متاحة مؤقتا، حاول لاحقا.'))
  }finally{setBusy(false)}
 }
 const fieldStyle='mt-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3.5 text-zinc-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
 const labelStyle='block text-sm font-semibold text-zinc-700 dark:text-zinc-200'
 return <main className="min-h-screen bg-[#f7f9fc] dark:bg-[#090e19] text-zinc-900 dark:text-zinc-50" dir={isRtl?'rtl':'ltr'}>
  <Navigation/>
  <section className="relative overflow-hidden bg-[#0b1425] text-white">
   <div aria-hidden="true" className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_90%_10%,_#2154b8_0%,_transparent_48%)]"/>
   <div className="max-w-7xl mx-auto relative px-5 pt-20 pb-20 lg:pt-24 lg:pb-28">
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
     <div>
      <p className="inline-flex items-center gap-2 border border-blue-300/20 bg-blue-400/10 rounded-full px-4 py-2 text-xs font-bold tracking-wide text-blue-200">
       <Handshake className="w-4 h-4"/>{tr('PARTENARIATS • MONFORFAIT.MA','الشراكات • مون فورفي')}
      </p>
      <h1 className="text-4xl sm:text-5xl lg:text-[3.7rem] leading-[1.08] font-black tracking-tight mt-8 max-w-3xl">
       {tr('Transformons les demandes télécoms','لنحوّل طلبات الاتصالات')}
       <span className="block text-blue-300 mt-2">{tr('en résultats mesurables.','إلى نتائج قابلة للقياس.')}</span>
      </h1>
      <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed mt-7">
       {tr(
        'Distributeur, intégrateur ou opérateur : étudions un pilote de mise en relation encadré. Éditeur de site : intégrez gratuitement notre comparateur public. Deux opportunités distinctes, une seule plateforme.',
        'موزع أو مشغل أو مُدمِج: ادرس معنا تجربة إحالة منظمة. صاحب موقع: أضف مقارن العروض العمومي مجانا. فرصتان مختلفتان ومنصة واحدة.'
       )}
      </p>
      <div className="flex flex-wrap gap-3 mt-9">
       <a href="#devenir-partenaire" className="inline-flex gap-2 justify-center items-center rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-400 transition-colors shadow-lg shadow-blue-800/20">
        {tr('Devenir partenaire commercial','طلب شراكة تجارية')}<ArrowRight className="w-4 h-4"/>
       </a>
       <a href="#widget-gratuit" className="inline-flex gap-2 justify-center items-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
        {tr('Intégrer le comparateur','إضافة المقارن إلى موقعي')}<Code2 className="w-4 h-4"/>
       </a>
      </div>
      <p className="mt-5 text-xs text-slate-400 flex gap-2 items-start">
       <ShieldCheck className="w-4 h-4 shrink-0"/>
       {tr('Aucun volume garanti, aucune donnée client partagée sans consentement et accord contractuel.','لا يوجد حجم مضمون ولا مشاركة لبيانات العملاء دون موافقة وعقد.')}
      </p>
     </div>
     <div className="relative">
      <div aria-hidden="true" className="absolute -inset-5 bg-blue-500/10 blur-3xl rounded-full"/>
      <div className="relative rounded-3xl border border-white/15 bg-[#17243a]/90 p-5 sm:p-7 shadow-2xl">
       <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div><p className="text-xs uppercase tracking-widest text-blue-200 font-bold">{tr('Le circuit commercial','سير العمل التجاري')}</p>
         <p className="text-xl font-bold mt-2">{tr('Un processus vérifiable','عملية قابلة للتتبع')}</p></div>
        <BarChart3 className="w-8 h-8 text-blue-300"/>
       </div>
       <div className="mt-6 space-y-3">
        {[
         {num:'01',icon:<MessageSquare className="w-5 h-5"/>,a:tr('Demande entrante','طلب جديد'),b:tr('Besoin exprimé par le client','حاجة يعبّر عنها الزبون')},
         {num:'02',icon:<UserRoundCheck className="w-5 h-5"/>,a:tr('Qualification','التحقق'),b:tr('Vérification du dossier et du consentement','مراجعة الملف والموافقة')},
         {num:'03',icon:<FileCheck2 className="w-5 h-5"/>,a:tr('Transmission encadrée','إحالة منظمة'),b:tr('Partenaire autorisé, accès limité','شريك مخوّل ووصول محدود')},
         {num:'04',icon:<CheckCircle2 className="w-5 h-5"/>,a:tr('Résultat documenté','نتيجة موثقة'),b:tr('Retour, activation, facturation selon accord','رد الشريك والتفعيل والفوترة وفق الاتفاق')}
        ].map(step=><div key={step.num} className="flex items-center gap-4 rounded-2xl bg-white/[0.045] border border-white/[0.07] p-4">
         <span className="text-xs font-bold text-blue-300">{step.num}</span>
         <span className="w-10 h-10 shrink-0 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-300">{step.icon}</span>
         <div><p className="font-bold text-sm">{step.a}</p><p className="mt-1 text-xs text-slate-400">{step.b}</p></div>
        </div>)}
       </div>
       <p className="mt-5 text-xs text-slate-400">{tr('Illustration du processus, et non statistiques de production.','رسم توضيحي لسير العمل وليس إحصائيات فعلية.')}</p>
      </div>
     </div>
    </div>
   </div>
  </section>

  <section className="max-w-7xl mx-auto px-5 py-16 lg:py-20">
   <div className="max-w-3xl">
    <p className="text-xs font-bold tracking-widest text-blue-600 uppercase">{tr('Deux façons de collaborer','طريقتان للتعاون')}</p>
    <h2 className="text-3xl sm:text-4xl font-black mt-3">{tr('Choisissez le bon parcours','اختر طريقة التعاون المناسبة')}</h2>
    <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-base">{tr('L’espace commercial et le widget public répondent à des besoins différents. Rien à débloquer pour comparer les tarifs.','المسار التجاري والمقارن المجاني يخدمان احتياجات مختلفة.')} </p>
   </div>
   <div className="grid lg:grid-cols-2 gap-5 mt-9">
    <article className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-9 flex flex-col shadow-sm">
     <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex justify-center items-center"><Building2 className="w-6 h-6"/></div>
     <h3 className="mt-6 text-2xl font-black">{tr('Distribution de forfaits','توزيع اشتراكات الاتصالات')}</h3>
     <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm mt-3">{tr(
      'Recevez uniquement les dossiers autorisés et qualifiés selon les critères convenus. Faites remonter le résultat de chaque contact. Définissons ensemble le modèle de rémunération.',
      'استقبل فقط الطلبات المؤهلة والمصرح بها وفق المعايير المتفق عليها، وقدّم نتائج التواصل وحدّد نموذج التعويض.'
     )}</p>
     <div className="flex flex-wrap gap-2 mt-5 text-xs">
      {[
       tr('Ciblage géographique','توزيع جغرافي'),tr('Accès sécurisé','وصول آمن'),
       tr('Pilotage des retours','متابعة النتائج')
      ].map(s=><span key={s} className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5">{s}</span>)}
     </div>
     <a href="#devenir-partenaire" className="mt-8 inline-flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 hover:underline">{tr('Proposer un pilote commercial','اقتراح تجربة تجارية')}<ArrowUpRight className="w-4 h-4"/></a>
    </article>
    <article className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-9 flex flex-col shadow-sm">
     <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 flex justify-center items-center"><Globe2 className="w-6 h-6"/></div>
     <h3 className="mt-6 text-2xl font-black">{tr('Éditeurs et sites web','أصحاب المواقع الإلكترونية')}</h3>
     <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm mt-3">{tr(
      'Publiez notre comparateur dans votre site. Les visiteurs consultent des tarifs publics et ouvrent les détails sur MonForfait.ma, sans transmission de données depuis le widget.',
      'أضف المقارن إلى موقعك ليشاهد الزوار الأسعار العمومية ويفتحوا التفاصيل دون مشاركة بياناتهم عبر الأداة.'
     )}</p>
     <div className="flex flex-wrap gap-2 mt-5 text-xs">
      {[tr('Code HTML simple','كود HTML بسيط'),tr('Offres sourcées','عروض موثقة'),tr('Sans inscription','بدون تسجيل')].map(s=><span key={s} className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5">{s}</span>)}
     </div>
     <a href="#widget-gratuit" className="mt-8 inline-flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 hover:underline">{tr('Voir le widget et copier le code','عرض الأداة ونسخ الكود')}<ArrowUpRight className="w-4 h-4"/></a>
    </article>
   </div>
  </section>

  <section id="devenir-partenaire" className="scroll-mt-20 bg-white dark:bg-[#101827] border-y border-zinc-200 dark:border-zinc-800">
   <div className="max-w-7xl mx-auto px-5 py-16 lg:py-24 grid lg:grid-cols-[0.83fr_1.17fr] gap-12 xl:gap-20 items-start">
    <div className="lg:sticky lg:top-24">
     <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{tr('Distribution et acquisition','التوزيع واكتساب العملاء')}</p>
     <h2 className="text-3xl lg:text-4xl font-black mt-3">{tr('Construisons un pilote simple, mesurable et sécurisé.','لنطلق تجربة تجارية واضحة وآمنة.')}</h2>
     <p className="text-zinc-500 dark:text-zinc-400 mt-5 leading-relaxed">{tr(
      'Présentez votre société, votre territoire et votre capacité. Nous étudierons votre candidature avant toute proposition ou transmission de données.',
      'عرّف بشركتك ومنطقتك وقدرتك على معالجة الطلبات. ستُراجع المعلومات قبل أي اتفاق أو إحالة.'
     )}</p>
     <div className="space-y-4 mt-8 text-sm">
      {[
       tr('Aucune promesse de nombre de prospects','لا وعود بحجم محدد من الطلبات'),
       tr('Consentement client préalable','موافقة العميل مسبقا'),
       tr('Contrat vérifié avant l’accès aux demandes','التحقق من العقد قبل الوصول للطلبات'),
       tr('Tarification CPL ou activation à négocier','تحديد التعويض حسب الإحالة أو التفعيل')
      ].map(txt=><div className="flex gap-3 items-start" key={txt}><ShieldCheck className="w-5 h-5 text-blue-600 shrink-0"/><span>{txt}</span></div>)}
     </div>
     <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 p-5 mt-8">
      <p className="font-bold text-sm">{tr('Vous êtes déjà partenaire ?','هل لديك حساب شريك؟')}</p>
      <Link href="/login?tab=partner" className="inline-flex gap-2 items-center text-blue-700 dark:text-blue-300 font-bold mt-3 text-sm hover:underline"><LockKeyhole className="w-4 h-4"/>{tr('Accéder à mon espace sécurisé','الدخول إلى فضاء الشركاء')}</Link>
     </div>
    </div>
    <div className="rounded-3xl bg-[#f9fafc] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-9 shadow-sm">
     {success?<div className="py-12 text-center" role="status">
      <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-600"/>
      <h3 className="text-2xl font-black mt-6">{tr('Candidature enregistrée','تم تسجيل طلب الشراكة')}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-md mx-auto">{tr(
       'Votre demande figure dans notre suivi commercial. Une proposition de pilote dépend d’une vérification manuelle ; aucun accès à des données client n’est ouvert automatiquement.',
       'طلبك محفوظ للمراجعة. أي تعاون يعتمد على تحقق يدوي، ولا يتيح الطلب الوصول تلقائيا إلى بيانات العملاء.'
      )}</p>
      <button type="button" onClick={()=>setSuccess(false)} className="mt-8 rounded-xl border border-blue-600 text-blue-700 dark:text-blue-300 px-6 py-3 font-bold">{tr('Autre candidature','طلب جديد')}</button>
     </div>:<>
      <p className="text-xs uppercase tracking-widest text-blue-700 dark:text-blue-300 font-bold">{tr('Formulaire de candidature','نموذج طلب الشراكة')}</p>
      <h3 className="text-2xl font-black mt-3">{tr('Parlez-nous de votre activité','أخبرنا عن نشاطك')}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">{tr('Complétez les informations de votre société. Aucun abonnement ni paiement n’est déclenché.','أدخل معلومات شركتك. لا يتم تفعيل أي اشتراك أو دفع.')}</p>
      <form onSubmit={submit} className="mt-8 grid sm:grid-cols-2 gap-5">
       <label className={labelStyle}>{tr('Société *','اسم الشركة *')}
        <input className={fieldStyle} required minLength={2} maxLength={150} autoComplete="organization" value={inquiry.business_name} onChange={e=>setField('business_name',e.target.value)} placeholder={tr('Nom de votre entreprise','اسم شركتك')}/>
       </label>
       <label className={labelStyle}>{tr('Nom du contact *','الاسم الكامل *')}
        <input className={fieldStyle} required minLength={2} maxLength={120} autoComplete="name" value={inquiry.contact_name} onChange={e=>setField('contact_name',e.target.value)} placeholder={tr('Nom et prénom','الاسم الكامل')}/>
       </label>
       <label className={labelStyle}>{tr('Email professionnel *','البريد المهني *')}
        <input className={fieldStyle} type="email" required maxLength={150} autoComplete="email" value={inquiry.business_email} onChange={e=>setField('business_email',e.target.value)} placeholder="nom@entreprise.ma"/>
       </label>
       <label className={labelStyle}>{tr('Téléphone professionnel','الهاتف المهني')}
        <input className={fieldStyle} type="tel" inputMode="tel" maxLength={30} autoComplete="tel" value={inquiry.contact_phone} onChange={e=>setField('contact_phone',e.target.value)} placeholder="06…"/>
       </label>
       <label className={labelStyle}>{tr('Votre activité','نوع الشركة')}
        <select className={fieldStyle} value={inquiry.partner_type} onChange={e=>setField('partner_type',e.target.value)}>
         <option value="distributor">{tr('Distributeur télécom','موزع اتصالات')}</option>
         <option value="operator">{tr('Opérateur','مشغل الاتصالات')}</option>
         <option value="call_center">{tr('Centre d’appels','مركز اتصالات')}</option>
         <option value="integrator">{tr('Installateur / intégrateur','مُركّب أو مُدمِج')}</option>
         <option value="other">{tr('Autre activité','نشاط آخر')}</option>
        </select>
       </label>
       <label className={labelStyle}>{tr('Offres concernées','نوع العروض')}
        <select className={fieldStyle} value={inquiry.services} onChange={e=>setField('services',e.target.value)}>
         <option value="fibre">{tr('Internet fixe / fibre','الإنترنت الثابت والألياف')}</option>
         <option value="mobile">{tr('Abonnements mobiles','اشتراكات الهاتف')}</option>
         <option value="b2b">{tr('Connectivité entreprises','اتصالات الشركات')}</option>
         <option value="multi">{tr('Plusieurs catégories','عدة أنواع')}</option>
        </select>
       </label>
       <label className={labelStyle}>{tr('Villes et régions desservies','المدن والمناطق')}
        <input className={fieldStyle} maxLength={240} value={inquiry.regions} onChange={e=>setField('regions',e.target.value)} placeholder={tr('Casablanca, Rabat, Tanger…','الدار البيضاء، الرباط، طنجة…')}/>
       </label>
       <label className={labelStyle}>{tr('Capacité mensuelle indicative','القدرة الشهرية التقريبية')}
        <select className={fieldStyle} value={inquiry.estimated_volume} onChange={e=>setField('estimated_volume',e.target.value)}>
         <option value="">{tr('À discuter','تحدد لاحقا')}</option>
         <option value="10-50">{tr('10 à 50 dossiers','10 إلى 50 طلبا')}</option>
         <option value="50-200">{tr('50 à 200 dossiers','50 إلى 200 طلب')}</option>
         <option value="200+">{tr('Plus de 200 dossiers','أكثر من 200 طلب')}</option>
        </select>
       </label>
       <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" name="website" value={inquiry.website} onChange={e=>setField('website',e.target.value)}/></label>
       </div>
       <label className="flex items-start gap-3 sm:col-span-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input type="checkbox" required checked={inquiry.consent_to_contact} onChange={e=>setField('consent_to_contact',e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-blue-600"/>
        <span>{tr("Je demande à être contacté pour étudier ce partenariat. Mes données seront utilisées pour répondre à ma demande, selon la","أوافق على التواصل معي بخصوص الشراكة ومعالجة بياناتي وفقا ل")} <Link href="/legal/privacy" className="text-blue-700 dark:text-blue-300 underline">{tr('politique de confidentialité','سياسة الخصوصية')}</Link>.</span>
       </label>
       {error&&<p role="alert" className="sm:col-span-2 flex gap-2 items-start rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-4 text-sm"><AlertCircle className="w-4 h-4 shrink-0"/>{error}</p>}
       <button type="submit" disabled={busy||!inquiry.consent_to_contact}
        className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 p-4 text-white font-bold disabled:opacity-50 transition-colors">
        {busy?tr('Enregistrement…','جاري التسجيل…'):tr('Envoyer ma demande de partenariat','إرسال طلب الشراكة')}<ArrowRight className="w-5 h-5"/>
       </button>
       <p className="sm:col-span-2 text-xs text-zinc-500 text-center">{tr(
        'Un dossier de candidature n’est ni un contrat, ni une promesse de volume, ni l’ouverture automatique d’un compte partenaire.',
        'طلب الشراكة ليس عقدا أو وعدا بحجم معين ولا يمنح أي صلاحيات تلقائية.'
       )}</p>
      </form>
     </>}
    </div>
   </div>
  </section>

  <div id="widget-gratuit" className="scroll-mt-16">
   <PartnerWidgetEmbed/>
  </div>

  <section className="max-w-6xl mx-auto px-5 pt-8 pb-20">
   <div className="rounded-3xl bg-[#0b1425] text-white p-8 md:p-12 grid lg:grid-cols-[1fr_auto] items-center gap-8">
    <div>
     <p className="text-xs tracking-widest uppercase text-blue-300 font-bold">{tr('Une question avant de candidater ?','سؤال قبل التسجيل؟')}</p>
     <h2 className="mt-3 font-black text-2xl sm:text-3xl">{tr('Parlons concrètement de votre besoin.','تواصل معنا بخصوص احتياجاتك.')}</h2>
     <p className="text-sm mt-3 text-zinc-300 max-w-xl">{tr(
       'Pour une question technique, juridique ou commerciale, utilisez notre formulaire de contact sécurisé. Aucun email direct non vérifié n’est nécessaire.',
       'للأسئلة التقنية والقانونية والتجارية استخدم نموذج الاتصال الآمن.'
      )}</p>
    </div>
    <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#0b1425] font-bold px-6 py-3.5 hover:bg-blue-50">
     {tr('Nous contacter','اتصل بنا')}<ArrowUpRight className="w-4 h-4"/>
    </Link>
   </div>
  </section>
 </main>
}
