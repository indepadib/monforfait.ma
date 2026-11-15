import Link from 'next/link'
export function ObservatoireChart(){
 return <div className="p-6 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-200">
  Aucun historique de prix n'est publié tant qu'une série de données vérifiables n'a pas été constituée.
  <Link href="/offers" className="block mt-3 underline text-blue-600">Voir les offres actuellement référencées</Link>
 </div>
}
