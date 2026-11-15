"use client"
import Link from 'next/link'
import { Calculator } from 'lucide-react'
export function SavingsCalculator(){
 return <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8">
  <Calculator className="w-8 h-8 text-blue-600"/>
  <h2 className="mt-4 text-2xl font-bold dark:text-white">Comparer le coût de votre abonnement</h2>
  <p className="mt-3 text-sm text-zinc-500">Une économie dépend de la catégorie d'offre, du débit, des options, des frais et des conditions contractuelles. Nous n'affichons pas de simulation fondée sur un prix unique de référence.</p>
  <Link href="/offers" className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-white font-bold">Consulter les tarifs publics</Link>
 </div>
}
