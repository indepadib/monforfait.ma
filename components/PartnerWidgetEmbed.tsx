'use client'
import {useState} from 'react'
import {Code2,Copy,CheckCircle2,ShieldCheck} from 'lucide-react'
const snippet='<iframe src="https://monforfait.ma/widget" title="Comparateur telecom MonForfait.ma" width="100%" height="750" loading="lazy" style="border:0;border-radius:18px"></iframe>'
export function PartnerWidgetEmbed(){
 const [copied,setCopied]=useState(false)
 const [error,setError]=useState('')
 async function copy(){
  try{await navigator.clipboard.writeText(snippet);setCopied(true);setError('')}
  catch{setError('Copie non disponible : sélectionnez le code ci-dessous et copiez-le manuellement.')}
 }
 return <section className="max-w-5xl mx-auto px-4 py-12">
  <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-10 grid lg:grid-cols-[1fr_0.8fr] gap-8">
   <div>
    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
     <Code2 className="w-6 h-6"/>
    </div>
    <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mt-6">Widget d'information</p>
    <h2 className="text-3xl font-black mt-3 text-zinc-900 dark:text-white">Affichez des offres sourcées sur votre site</h2>
    <p className="text-sm leading-relaxed text-zinc-500 mt-4">Intégrez gratuitement un mini-comparateur public et sans formulaire. Les visiteurs ouvrent directement les fiches détaillées sur MonForfait.ma. Ce widget ne suppose aucun partenariat commercial ni garantie de couverture.</p>
    <ul className="mt-5 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
     <li className="flex gap-2"><ShieldCheck className="w-5 h-5 shrink-0 text-blue-600"/>Catalogue actif, tarifs et sources datés</li>
     <li className="flex gap-2"><ShieldCheck className="w-5 h-5 shrink-0 text-blue-600"/>Aucune donnée client collectée dans l'iframe</li>
     <li className="flex gap-2"><ShieldCheck className="w-5 h-5 shrink-0 text-blue-600"/>Résultat indicatif, sans abonnement automatique</li>
    </ul>
    <h3 className="text-sm font-bold mt-7 mb-2 text-zinc-900 dark:text-white">Code HTML à intégrer</h3>
    <pre className="text-xs overflow-x-auto bg-zinc-950 text-blue-200 p-4 rounded-xl whitespace-pre-wrap break-all select-all">{snippet}</pre>
    <button type="button" onClick={()=>void copy()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-5 py-3">
     {copied?<CheckCircle2 className="w-4 h-4"/>:<Copy className="w-4 h-4"/>}{copied?'Code copié':'Copier le code'}
    </button>
    {error&&<p role="alert" className="mt-3 text-red-700 text-sm">{error}</p>}
   </div>
   <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-2 border border-zinc-200 dark:border-zinc-800">
    <iframe src="/widget" title="Aperçu du comparateur intégré" loading="lazy"
      className="block w-full rounded-xl border-0 bg-zinc-950 h-[650px]"/>
   </div>
  </div>
 </section>
}
