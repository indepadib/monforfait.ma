import { Shield, Lock, CheckCircle, Database } from 'lucide-react'

export function TrustBadges() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col items-center text-center p-4">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <div className="font-bold text-sm text-zinc-900 dark:text-white">Données sécurisées</div>
                <div className="text-xs text-zinc-500">Protection SSL 256-bit</div>
            </div>
            <div className="flex flex-col items-center text-center p-4">
                <Lock className="w-8 h-8 text-blue-600 mb-2" />
                <div className="font-bold text-sm text-zinc-900 dark:text-white">Confidentialité</div>
                <div className="text-xs text-zinc-500">Conforme RGPD / CNDP</div>
            </div>
            <div className="flex flex-col items-center text-center p-4">
                <CheckCircle className="w-8 h-8 text-purple-600 mb-2" />
                <div className="font-bold text-sm text-zinc-900 dark:text-white">Offres vérifiées</div>
                <div className="text-xs text-zinc-500">Mises à jour quotidiennes</div>
            </div>
            <div className="flex flex-col items-center text-center p-4">
                <Database className="w-8 h-8 text-orange-600 mb-2" />
                <div className="font-bold text-sm text-zinc-900 dark:text-white">Indépendant</div>
                <div className="text-xs text-zinc-500">100% neutre & sans biais</div>
            </div>
        </div>
    )
}
