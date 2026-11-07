'use client'
import Link from 'next/link'
export function LeadShareConsent({checked,onChange}:{checked:boolean;onChange:(value:boolean)=>void}) {
 return <label className="flex items-start gap-3 rounded-xl border border-blue-300/30 bg-blue-50/80 dark:bg-blue-950/20 p-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-200">
   <input type="checkbox" required checked={checked} onChange={e=>onChange(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-blue-600"/>
   <span>Je souhaite être recontacté pour une offre télécom et j'autorise MonForfait.ma à communiquer mes coordonnées et ma demande à un opérateur ou distributeur partenaire adapté. Je peux retirer mon accord. <Link href="/legal/privacy" className="underline font-semibold">Confidentialité</Link>.</span>
 </label>
}
