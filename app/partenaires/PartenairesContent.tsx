"use client"

import { Navigation } from '@/components/Navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Handshake, Mail, Code, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/lib/LocaleContext'

export default function PartenairesContent() {
    const { t, isRtl } = useTranslation()
    const [inquiry, setInquiry] = useState({
      business_name:'', contact_name:'', business_email:'', contact_phone:'',
      partner_type:'distributor', regions:'', services:'fibre', estimated_volume:'',
      consent_to_contact:false, website:''
    })
    const [inquiryBusy,setInquiryBusy]=useState(false)
    const [inquirySuccess,setInquirySuccess]=useState(false)
    const [inquiryError,setInquiryError]=useState('')
    async function submitInquiry(event:React.FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setInquiryBusy(true);setInquiryError('')
      const {data,error}=await supabase.functions.invoke('leads-gateway',{
        body:{action:'partner.request',...inquiry}
      })
      setInquiryBusy(false)
      if(error || !data?.success){
        setInquiryError(data?.error || "Demande non envoyée. Réessayez.")
        return
      }
      setInquirySuccess(true)
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20 text-start" dir={isRtl ? 'rtl' : 'ltr'}>
            <Navigation />
            
            <div className="bg-blue-600 dark:bg-zinc-900 text-white pt-24 pb-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <Handshake className="w-16 h-16 mx-auto mb-6 text-blue-300" />
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                        {t('part_title')}
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        {t('part_desc')}
                    </p>
                </div>
            </div>


            <section className="max-w-4xl mx-auto px-4 pt-14 text-zinc-900 dark:text-white">
              <div className="bg-white dark:bg-zinc-950 border border-blue-200 dark:border-blue-900 rounded-3xl p-7 md:p-10">
                <p className="uppercase text-xs font-bold tracking-widest text-blue-600">Acquisition télécoms à la performance</p>
                <h2 className="text-2xl md:text-3xl font-black mt-3">Testez des demandes fibre avec une intention réelle</h2>
                <p className="text-zinc-600 dark:text-zinc-300 mt-4">MonForfait.ma recueille des demandes de comparaison, principalement sur la fibre résidentielle. Nous recherchons des partenaires de distribution et des opérateurs pour un pilote mesuré : qualification, accord de mise en relation, suivi des contacts et validation des abonnements activés. Aucun volume minimum ni taux de transformation n'est garanti.</p>
                <div className="grid md:grid-cols-3 gap-3 mt-6 text-sm">
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4"><strong>1. Ciblage</strong><p className="text-zinc-500 mt-1">Ville, technologie, délai de raccordement</p></div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4"><strong>2. Pilote</strong><p className="text-zinc-500 mt-1">Leads vérifiés et consentis sous accord</p></div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4"><strong>3. Facturation</strong><p className="text-zinc-500 mt-1">Modèle CPL ou activation selon contrat</p></div>
                </div>
                <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-7">
                 <h3 className="text-xl font-bold">Demander un pilote partenaire</h3>
                 <p className="mt-1 text-sm text-zinc-500">Laissez les coordonnées de votre société. Nous reviendrons vers vous pour définir un pilote sans engagement automatique.</p>
                 {inquirySuccess ? (
                   <p role="status" className="mt-5 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-800">Demande enregistrée. Nous prendrons contact pour discuter du pilote.</p>
                 ) : (
                  <form onSubmit={submitInquiry} className="grid md:grid-cols-2 gap-4 mt-5">
                    <label className="text-sm font-semibold">Société *
                      <input required maxLength={150} value={inquiry.business_name} onChange={e=>setInquiry({...inquiry,business_name:e.target.value})} className="block w-full mt-2 rounded-xl border bg-white dark:bg-zinc-900 px-4 py-3" placeholder="Votre entreprise"/>
                    </label>
                    <label className="text-sm font-semibold">Contact *
                      <input required maxLength={120} value={inquiry.contact_name} onChange={e=>setInquiry({...inquiry,contact_name:e.target.value})} className="block w-full mt-2 rounded-xl border bg-white dark:bg-zinc-900 px-4 py-3" placeholder="Prénom et nom"/>
                    </label>
                    <label className="text-sm font-semibold">Email professionnel *
                      <input type="email" required maxLength={150} value={inquiry.business_email} onChange={e=>setInquiry({...inquiry,business_email:e.target.value})} className="block w-full mt-2 rounded-xl border bg-white dark:bg-zinc-900 px-4 py-3" placeholder="vous@entreprise.ma"/>
                    </label>
                    <label className="text-sm font-semibold">Téléphone professionnel
                      <input type="tel" value={inquiry.contact_phone} onChange={e=>setInquiry({...inquiry,contact_phone:e.target.value})} className="block w-full mt-2 rounded-xl border bg-white dark:bg-zinc-900 px-4 py-3" placeholder="06..."/>
                    </label>
                    <label className="text-sm font-semibold">Type de partenaire
                      <select value={inquiry.partner_type} onChange={e=>setInquiry({...inquiry,partner_type:e.target.value})} className="block w-full mt-2 rounded-xl border bg-white dark:bg-zinc-900 px-4 py-3">
                        <option value="distributor">Distributeur télécom</option>
                        <option value="operator">Opérateur</option>
                        <option value="call_center">Centre d'appels</option>
                        <option value="integrator">Intégrateur / installateur</option>
                        <option value="other">Autre</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold">Zones couvertes
                      <input value={inquiry.regions} maxLength={240} onChange={e=>setInquiry({...inquiry,regions:e.target.value})} className="block w-full mt-2 rounded-xl border bg-white dark:bg-zinc-900 px-4 py-3" placeholder="Casablanca, Rabat…"/>
                    </label>
                    <label className="text-sm font-semibold">Produits ciblés
                      <select value={inquiry.services} onChange={e=>setInquiry({...inquiry,services:e.target.value})} className="block w-full mt-2 rounded-xl border bg-white dark:bg-zinc-900 px-4 py-3">
                        <option value="fibre">Fibre / Internet fixe</option>
                        <option value="mobile">Forfaits mobiles</option>
                        <option value="b2b">Connectivité entreprises</option>
                        <option value="multi">Plusieurs produits</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold">Capacité de traitement mensuelle
                      <select value={inquiry.estimated_volume} onChange={e=>setInquiry({...inquiry,estimated_volume:e.target.value})} className="block w-full mt-2 rounded-xl border bg-white dark:bg-zinc-900 px-4 py-3">
                        <option value="">À préciser</option>
                        <option value="10-50">10–50 dossiers</option>
                        <option value="50-200">50–200 dossiers</option>
                        <option value="200+">Plus de 200 dossiers</option>
                      </select>
                    </label>
                    <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={inquiry.website} onChange={e=>setInquiry({...inquiry,website:e.target.value})} className="absolute left-[-9999px]" name="website"/>
                    <label className="flex items-start gap-2 md:col-span-2 text-xs text-zinc-600 dark:text-zinc-300">
                      <input type="checkbox" required checked={inquiry.consent_to_contact} onChange={e=>setInquiry({...inquiry,consent_to_contact:e.target.checked})} className="mt-1 accent-blue-600"/>
                      <span>Je demande à être contacté par MonForfait.ma au sujet d'un partenariat commercial, conformément à sa <a className="underline" href="/legal/privacy">politique de confidentialité</a>.</span>
                    </label>
                    {inquiryError && <p role="alert" className="md:col-span-2 text-sm text-red-600">{inquiryError}</p>}
                    <button type="submit" disabled={inquiryBusy} className="md:col-span-2 rounded-xl bg-blue-600 text-white font-bold p-4 disabled:opacity-50">{inquiryBusy?'Envoi…':'Demander un pilote partenaire'}</button>
                  </form>
                 )}
              </div>
              </div>
            </section>
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Option 1 */}
                    <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Code className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold dark:text-white mb-4">{t('part_sec1_title')}</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                {t('part_sec1_desc')}
                            </p>
                        </div>
                        <a href="mailto:contact@monforfait.ma" className={`px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 self-start ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Mail className="w-5 h-5" />
                            {t('part_sec1_btn')}
                        </a>
                    </div>

                    {/* Option 2 */}
                    <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <Handshake className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold dark:text-white mb-4">{t('part_sec2_title')}</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                {t('part_sec2_desc')}
                            </p>
                        </div>
                        <a href="mailto:contact@monforfait.ma" className={`bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors self-start ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Mail className="w-4 h-4"/> 
                            {t('part_sec2_btn')}
                        </a>
                    </div>
                </div>

                {/* API & Data */}
                <div className="bg-zinc-100 dark:bg-zinc-900/50 p-8 rounded-2xl text-center border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-2xl font-black dark:text-white mb-4">{t('part_sec3_title')}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-6 leading-relaxed">
                        {t('part_sec3_desc')}
                    </p>
                </div>
            </div>
        </main>
    )
}
