import { Shield, Lock, CheckCircle, Database } from 'lucide-react'
export function TrustBadges(){
 return <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-zinc-100 dark:border-zinc-800">
  <div className="text-center p-4"><Shield className="mx-auto w-8 h-8 text-green-600 mb-2"/><strong className="text-sm dark:text-white">Données protégées</strong><p className="text-xs text-zinc-500">Accès réservé aux personnes autorisées</p></div>
  <div className="text-center p-4"><Lock className="mx-auto w-8 h-8 text-blue-600 mb-2"/><strong className="text-sm dark:text-white">Consentement explicite</strong><p className="text-xs text-zinc-500">Partage des coordonnées uniquement sur demande</p></div>
  <div className="text-center p-4"><CheckCircle className="mx-auto w-8 h-8 text-purple-600 mb-2"/><strong className="text-sm dark:text-white">Tarifs sourcés</strong><p className="text-xs text-zinc-500">Lien et date de vérification des prix</p></div>
  <div className="text-center p-4"><Database className="mx-auto w-8 h-8 text-orange-600 mb-2"/><strong className="text-sm dark:text-white">Service indépendant</strong><p className="text-xs text-zinc-500">Présence d’un opérateur ≠ partenariat officiel</p></div>
 </div>
}
