'use client'
import {useState} from 'react'
import Link from 'next/link'
import {Navigation} from '@/components/Navigation'
import {supabase} from '@/lib/supabaseClient'
import {useTranslation} from '@/lib/LocaleContext'
import {Mail,MessageCircle,Send,ShieldCheck,CheckCircle2,ArrowRight} from 'lucide-react'

type Message={name:string;email:string;subject:string;message:string;category:string;website:string}
const initial:Message={name:'',email:'',subject:'',message:'',category:'general',website:''}
export function ContactClient(){
 const {locale,isRtl}=useTranslation()
 const ar=locale==='ar'
 const [form,setForm]=useState<Message>(initial)
 const [agree,setAgree]=useState(false)
 const [sending,setSending]=useState(false)
 const [error,setError]=useState('')
 const [reference,setReference]=useState<string|null>(null)
 const label=(fr:string,arabic:string)=>ar?arabic:fr
 async function send(e:React.FormEvent){
  e.preventDefault();setError('')
  if(!agree){setError(label('Veuillez accepter le traitement de votre message.','يرجى الموافقة على معالجة رسالتك.'));return}
  if(form.message.trim().length<10){setError(label('Détaillez votre demande.','يرجى شرح طلبك.'));return}
  setSending(true)
  const {data,error:invokeError}=await supabase.functions.invoke('leads-gateway',{
    body:{action:'contact.submit',...form,consent_to_contact:agree}
  })
  setSending(false)
  if(invokeError||!data?.success){setError(data?.error||label('Message non enregistré. Veuillez réessayer.','تعذر تسجيل الرسالة، حاول مرة أخرى.'));return}
  setReference(data.reference||'reçue')
  setForm(initial);setAgree(false)
 }
 return <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white" dir={isRtl?'rtl':'ltr'}>
  <Navigation/>
  <header className="bg-zinc-950 text-white px-5 pt-28 pb-16">
   <div className="max-w-6xl mx-auto">
    <p className="text-sm font-bold uppercase tracking-widest text-blue-300">{label('Assistance et partenariats','الدعم والشراكات')}</p>
    <h1 className="text-4xl md:text-6xl font-black mt-4">{label('Parlons de votre besoin','تواصل معنا')}</h1>
    <p className="mt-5 text-zinc-300 max-w-2xl text-lg">{label(
      'Une question sur votre forfait, une demande à suivre ou un projet commercial ? Écrivez-nous. Chaque message est enregistré dans notre espace sécurisé.',
      'هل لديك سؤال عن عرض اتصالات أو طلب قيد المتابعة أو تعاون تجاري؟ أرسل رسالتك عبر نموذجنا الآمن.'
    )}</p>
   </div>
  </header>
  <div className="max-w-6xl mx-auto px-5 py-12 grid lg:grid-cols-[0.85fr_1.15fr] gap-8">
   <aside className="space-y-5">
    <div className="rounded-3xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8">
     <Mail className="w-9 h-9 text-blue-600"/>
     <h2 className="font-bold text-xl mt-4">{label('Formulaire de contact','نموذج الاتصال')}</h2>
     <p className="mt-3 text-zinc-500 text-sm">{label(
      'Notre équipe peut traiter votre message depuis la console MonForfait. Aucun délai de réponse ni envoi d’email automatique n’est garanti.',
      'تُعالج رسالتك داخل لوحة إدارة مون فورفي. لا نعد بمدة رد أو تأكيد تلقائي عبر البريد.'
     )}</p>
    </div>
    <div className="rounded-3xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8">
     <MessageCircle className="w-9 h-9 text-blue-600"/>
     <h2 className="font-bold text-xl mt-4">{label('Vous avez déjà demandé une offre ?','هل أرسلت طلبا من قبل؟')}</h2>
     <p className="mt-3 text-zinc-500 text-sm">{label('Retrouvez le statut de votre demande avec votre référence privée.','تابع حالة طلبك باستخدام المرجع الخاص بك.')}</p>
     <Link href="/suivi" className="mt-4 inline-flex items-center gap-2 text-blue-600 font-semibold underline">{label('Suivre ma demande','تتبع طلبي')} <ArrowRight className="w-4 h-4"/></Link>
    </div>
    <div className="rounded-3xl bg-blue-600 text-white p-6 md:p-8">
     <ShieldCheck className="w-8 h-8"/>
     <h2 className="font-bold text-xl mt-4">{label('Distributeur ou opérateur ?','هل أنت موزع أو مشغل؟')}</h2>
     <p className="mt-3 text-blue-100 text-sm">{label('Présentez votre société et proposez un pilote de mise en relation.','عرّف بشركتك وقدم طلب شراكة.')}</p>
     <Link href="/partenaires" className="mt-5 inline-flex rounded-xl bg-white text-blue-700 px-5 py-3 font-bold">{label('Devenir partenaire','طلب شراكة')}</Link>
    </div>
   </aside>
   <section className="rounded-3xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-10">
    {reference?<div role="status" className="text-center py-12">
     <CheckCircle2 className="w-16 h-16 mx-auto text-green-600"/>
     <h2 className="text-3xl font-bold mt-6">{label('Message enregistré','تم تسجيل رسالتك')}</h2>
     <p className="mt-4 text-zinc-500">{label('Votre message est disponible dans notre boîte de réception interne. Nous ne prétendons pas vous avoir envoyé de confirmation par email.','رسالتك مسجلة في نظامنا الداخلي. لم يُرسل تأكيد عبر البريد الإلكتروني.')}</p>
     <p className="mt-3 text-sm text-zinc-500">{label('Référence','المرجع')} : <strong>{reference}</strong></p>
     <button onClick={()=>setReference(null)} className="mt-8 rounded-xl bg-blue-600 text-white px-6 py-3 font-bold">{label('Nouvelle demande','رسالة جديدة')}</button>
    </div>:<>
     <h2 className="font-bold text-2xl md:text-3xl">{label('Écrivez-nous','أرسل رسالتك')}</h2>
     <p className="text-sm text-zinc-500 mt-2">{label('Tous les champs marqués * sont requis.','الحقول المميزة بنجمة مطلوبة.')}</p>
     <form onSubmit={send} className="mt-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
       <label className="block text-sm font-semibold">{label('Nom *','الاسم *')}
        <input type="text" required minLength={2} maxLength={120} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
         className="mt-2 w-full rounded-xl border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3" autoComplete="name"/>
       </label>
       <label className="block text-sm font-semibold">{label('Email *','البريد الإلكتروني *')}
        <input type="email" required maxLength={200} value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
         className="mt-2 w-full rounded-xl border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3" autoComplete="email"/>
       </label>
      </div>
      <label className="block text-sm font-semibold">{label('Type de demande','نوع الطلب')}
       <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
        className="mt-2 w-full rounded-xl border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3">
        <option value="general">{label('Question générale','سؤال عام')}</option>
        <option value="technical">{label('Problème technique','مشكلة تقنية')}</option>
        <option value="privacy">{label('Données personnelles / consentement','البيانات الشخصية والموافقة')}</option>
        <option value="billing">{label('Facturation / abonnement','الفواتير والاشتراكات')}</option>
        <option value="partnership">{label('Partenariat commercial','شراكة تجارية')}</option>
       </select>
      </label>
      <label className="block text-sm font-semibold">{label('Sujet *','الموضوع *')}
       <input required minLength={3} maxLength={180} value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}
        placeholder={label('Ex : Suivi de ma demande fibre','مثال: متابعة طلب الألياف البصرية')}
        className="mt-2 w-full rounded-xl border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3"/>
      </label>
      <label className="block text-sm font-semibold">{label('Votre message *','رسالتك *')}
       <textarea required minLength={10} maxLength={5000} rows={6} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
        className="mt-2 w-full rounded-xl border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3" placeholder={label('Expliquez votre demande sans partager de mots de passe…','اشرح طلبك دون مشاركة كلمات المرور…')}/>
      </label>
      <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>setForm(p=>({...p,website:e.target.value}))}/></label></div>
      <label className="flex gap-3 items-start text-sm text-zinc-600 dark:text-zinc-300">
       <input type="checkbox" required checked={agree} onChange={e=>setAgree(e.target.checked)} className="mt-1 accent-blue-600"/>
       <span>{label('J’accepte que MonForfait.ma traite ces coordonnées pour répondre à ce message, sans autorisation de partage commercial.','أوافق على معالجة بياناتي للرد على هذه الرسالة دون السماح بمشاركتها تجاريا.')} <Link href="/legal/privacy" className="underline text-blue-600">{label('Confidentialité','الخصوصية')}</Link>.</span>
      </label>
      {error&&<p role="alert" className="rounded-xl bg-red-50 text-red-700 text-sm p-4">{error}</p>}
      <button type="submit" disabled={sending||!agree} className="w-full rounded-xl bg-blue-600 text-white font-bold p-4 flex justify-center items-center gap-2 disabled:opacity-40"><Send className="w-4 h-4"/>{sending?label('Enregistrement…','جاري الإرسال…'):label('Envoyer le message','إرسال الرسالة')}</button>
     </form>
    </>}
   </section>
  </div>
 </main>
}
