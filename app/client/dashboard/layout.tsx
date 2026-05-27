import React from 'react';
import Link from 'next/link';
import { User, FileText, Settings, LogOut, Activity } from 'lucide-react';

export const metadata = {
  title: 'Espace Client | MonForfait.ma',
  description: 'Suivez vos demandes et trouvez la meilleure offre.',
};

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row font-sans text-zinc-900 dark:text-zinc-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-500">
            MonForfait.ma
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/client/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium">
            <Activity className="w-5 h-5" />
            Mon Suivi
          </Link>
          <Link href="/client/dashboard/offres" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <FileText className="w-5 h-5" />
            Offres Sauvegardées
          </Link>
          <Link href="/client/dashboard/profil" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <User className="w-5 h-5" />
            Mon Profil
          </Link>
          <Link href="/client/dashboard/parametres" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left text-sm text-red-600 dark:text-red-400">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 md:justify-end">
          <div className="md:hidden font-bold text-blue-600">MonForfait</div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Bonjour, Client</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              C
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
