'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  Briefcase,
  Wallet,
  Menu,
  X
} from 'lucide-react';

export default function OperatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState<number>(5000);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Auth gate check
  useEffect(() => {
    const isLogged = localStorage.getItem('operator_logged_in') === 'true';
    if (!isLogged) {
      router.push('/login?tab=operator');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // Sync wallet balance
  useEffect(() => {
    const updateBalance = () => {
      const savedBalance = localStorage.getItem('operator_wallet_balance');
      if (savedBalance) {
        setWalletBalance(parseFloat(savedBalance));
      } else {
        localStorage.setItem('operator_wallet_balance', '5000');
        setWalletBalance(5000);
      }
    };

    updateBalance();
    
    // Listen to changes in localStorage from other components
    window.addEventListener('storage', updateBalance);
    // Listen to custom local balance update events
    window.addEventListener('balance_updated', updateBalance);

    return () => {
      window.removeEventListener('storage', updateBalance);
      window.removeEventListener('balance_updated', updateBalance);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('operator_logged_in');
    router.push('/login?tab=operator');
  };

  const navItems = [
    { href: '/operateurs/dashboard', label: "Vue d'ensemble", icon: LayoutDashboard },
    { href: '/operateurs/dashboard/leads', label: 'Marketplace Leads', icon: Users },
    { href: '/operateurs/dashboard/billing', label: 'Facturation & Solde', icon: CreditCard },
    { href: '/operateurs/dashboard/settings', label: 'Configuration & Alertes', icon: Settings },
  ];

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm font-semibold">Vérification de la session opérateur...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-100">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col shrink-0 shadow-2xl hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80">
          <Link href="/operateurs/dashboard" className="flex items-center gap-3 font-black text-xl text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="tracking-tight">LeadCenter <span className="text-blue-500 font-bold">Pro</span></span>
          </Link>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to Site Link */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Retour au site public
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg hover:bg-slate-800/50 text-left text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion B2B
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-64 bg-slate-900 h-full border-r border-slate-800 flex flex-col p-6 space-y-6 animate-in slide-in-from-left duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <Link href="/operateurs/dashboard" className="flex items-center gap-2 font-black text-lg text-white">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span>LeadCenter Pro</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link href="/" className="block text-xs font-bold text-slate-500 hover:text-slate-300">
                ← Retour au site public
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left text-xs font-bold text-red-400"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-slate-950">
        
        {/* Header */}
        <header className="h-20 bg-slate-900 border-b border-slate-800/60 flex items-center justify-between px-6 z-20 shadow-lg">
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <span className="font-black text-white text-md">LeadCenter Pro</span>
          </div>

          <div className="hidden md:flex"></div>
          
          <div className="flex items-center gap-4">
            
            {/* Wallet Balance Badge */}
            <Link 
              href="/operateurs/dashboard/billing"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/20 hover:border-blue-500/40 px-4 py-2 rounded-2xl transition-all shadow-lg shadow-blue-500/5"
            >
              <Wallet className="w-4 h-4 text-blue-400" />
              <div className="text-right">
                <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest leading-none">Mon Solde</span>
                <span className="text-sm font-black text-white">{walletBalance.toLocaleString('fr-FR')} DH</span>
              </div>
            </Link>

            <button className="relative p-2 rounded-xl hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5 text-slate-400 hover:text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
            </button>

            {/* User Account */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">Orange Maroc B2B</p>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Abonné Premium</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                OM
              </div>
            </div>

          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  );
}
