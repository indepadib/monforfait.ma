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
  X,
  Bot,
  Sparkles,
  MessageSquare,
  Send,
  RefreshCw
} from 'lucide-react';

export default function OperatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState<number>(5000);
  const [companyName, setCompanyName] = useState<string>('Orange Maroc B2B');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Notification Center States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Nouveau Lead B2B qualifié', desc: 'Fibre Optique Pro à Casablanca (600 DH/mois)', time: 'À l\'instant', type: 'lead', unread: true },
    { id: '2', title: 'Recharge confirmée', desc: 'Votre portefeuille a été crédité de +2 000 DH', time: 'Il y a 1h', type: 'billing', unread: true },
    { id: '3', title: 'Lead débloqué automatiquement', desc: 'Auto-Pilote : Prospect B2C à Rabat (249 DH/mois)', time: 'Il y a 3h', type: 'autopilot', unread: false },
    { id: '4', title: 'Raccordement activé', desc: 'Dossier Karim B. (Orange Fibre) finalisé avec succès', time: 'Il y a 1 jour', type: 'system', unread: false }
  ]);
  const [activeToast, setActiveToast] = useState<{ id: string, title: string, desc: string } | null>(null);

  // Simulate real-time lead alerts
  useEffect(() => {
    const alerts = [
      { title: 'Nouveau Lead B2B à Marrakech ⚡', desc: 'Flotte Mobile 10 lignes (800 DH/mois)' },
      { title: 'Nouveau Lead Fibre à Tanger ⚡', desc: 'Abonnement Particulier (349 DH/mois)' },
      { title: 'Nouveau Lead B2B à Casablanca ⚡', desc: 'Fibre Optique Pro (1 200 DH/mois)' },
      { title: 'Nouveau Lead Fibre à Rabat ⚡', desc: 'Abonnement Particulier (249 DH/mois)' }
    ];
    let idx = 0;
    
    const interval = setInterval(() => {
      const selectedAlert = alerts[idx % alerts.length];
      const newNotification = {
        id: String(Date.now()),
        title: selectedAlert.title,
        desc: selectedAlert.desc,
        time: 'À l\'instant',
        type: 'lead',
        unread: true
      };
      
      // Update notifications list
      setNotifications(prev => [newNotification, ...prev]);
      
      // Set active toast
      setActiveToast({
        id: newNotification.id,
        title: selectedAlert.title,
        desc: selectedAlert.desc
      });
      
      // Clear toast after 6 seconds
      setTimeout(() => {
        setActiveToast(current => current?.id === newNotification.id ? null : current);
      }, 6000);
      
      idx++;
    }, 35000); // Trigger every 35s
    
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // AI Copilot States
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<{text: string, isBot: boolean}[]>([
    { text: "Bonjour ! Je suis votre copilote commercial IA. Je peux vous aider à maximiser votre taux de conversion B2B ou à rédiger des scripts d'appel pour vos prospects.\n\nChoisissez une action rapide ci-dessous ou posez-moi votre question !", isBot: true }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  const handleCopilotSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setCopilotMessages(prev => [...prev, { text, isBot: false }]);
    setCopilotInput('');
    setIsCopilotThinking(true);

    setTimeout(() => {
      let reply = "Je peux vous aider à concevoir de meilleures approches commerciales. Essayez de me demander 'script', 'ROI' ou 'villes' !";
      const q = text.toLowerCase();

      if (q.includes('script') || q.includes('appel') || q.includes('téléphone') || q.includes('parler')) {
        reply = "📞 **Trame d'appel IA suggérée (Prospect Fibre)** :\n\n1. **Accroche** : 'Bonjour [Nom], je vous contacte de la part de MonForfait.ma suite à votre demande de diagnostic Fibre.'\n2. **Valeur** : 'J'ai analysé les débits des voisins dans votre quartier. Le réseau d'Orange y est le plus stable avec 95 Mbps.'\n3. **Clôture** : 'Je peux lancer la commande pour vous aujourd'hui avec 2 mois gratuits. Vos voisins sont déjà raccordés.'";
      } else if (q.includes('roi') || q.includes('conversion') || q.includes('calcul') || q.includes('rentabilité')) {
        reply = "📊 **Analyse de Rentabilité Commerciale** :\n\n* **CPA (Coût d'Acquisition)** : 180 DH par lead qualifié.\n* **Objectif de Conversion** : 25%.\n* **Valeur Client (ARPU)** : 349 DH/mois.\n* **Revenu sur 12 mois** : 4 188 DH par client signé.\n\n👉 **Conclusion** : Pour 4 leads achetés (720 DH), vous signez 1 client (4 188 DH). Le **ROI net est de 482%** dès la première année !";
      } else if (q.includes('ville') || q.includes('région') || q.includes('casablanca') || q.includes('rabat') || q.includes('marrakech')) {
        reply = "💡 **Top Marchés cette semaine (Maroc B2B)** :\n\n1. **Casablanca** : Très forte demande sur le segment Fibre Pro (> 48 leads). Taux de transfo moyen : 28%.\n2. **Rabat** : Leads B2C à forte valeur (budget moyen 249 DH). Taux de transfo moyen : 24%.\n3. **Tanger** : Hausse des demandes de flottes mobiles B2B (Moyenne 10 lignes).";
      } else if (q.includes('merci') || q.includes('super') || q.includes('top') || q.includes('parfait')) {
        reply = "Avec plaisir ! Je reste disponible dans votre barre d'outils pour toute autre question commerciale. Bonnes ventes ! 🚀";
      }

      setCopilotMessages(prev => [...prev, { text: reply, isBot: true }]);
      setIsCopilotThinking(false);
    }, 1000);
  };

  // Auth gate check
  useEffect(() => {
    const isLogged = localStorage.getItem('operator_logged_in') === 'true';
    if (!isLogged) {
      router.push('/login?tab=operator');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // Sync wallet balance & company name
  useEffect(() => {
    const updateBalance = () => {
      const savedBalance = localStorage.getItem('operator_wallet_balance');
      if (savedBalance) {
        setWalletBalance(parseFloat(savedBalance));
      } else {
        localStorage.setItem('operator_wallet_balance', '5000');
        setWalletBalance(5000);
      }

      const savedName = localStorage.getItem('operator_company_name');
      if (savedName) {
        setCompanyName(savedName);
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

            {/* Notification Bell & Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl hover:bg-slate-800 transition-colors"
                title="Centre de notifications"
              >
                <Bell className="w-5 h-5 text-slate-400 hover:text-white" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-955 animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsNotificationsOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-slate-850 border-b border-slate-800/80 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider text-white">Notifications ({notifications.filter(n => n.unread).length})</span>
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-blue-400 hover:underline"
                      >
                        Tout marquer lu
                      </button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500 italic">Aucune notification</div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`p-3.5 text-xs transition-colors hover:bg-slate-855/50 ${n.unread ? 'bg-blue-600/5' : ''}`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className={`font-bold ${n.unread ? 'text-white font-black' : 'text-slate-300'}`}>{n.title}</span>
                              <span className="text-[9px] text-slate-500 font-bold whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal">{n.desc}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Account */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{companyName}</p>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Abonné Premium</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                {companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            </div>

          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-950 relative">
          {children}
        </div>

        {/* Floating B2B AI Copilot Chatbot */}
        <div className="fixed bottom-6 right-6 z-[100] font-sans text-slate-100">
          {/* Floating Bubble */}
          <button 
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 relative border border-blue-500/30 ${isCopilotOpen ? 'rotate-90' : ''}`}
          >
            {isCopilotOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <>
                <Bot className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-900"></span>
                </span>
              </>
            )}
          </button>

          {/* Chat Window */}
          {isCopilotOpen && (
            <div className="absolute bottom-18 right-0 w-[340px] max-w-[calc(100vw-32px)] h-[460px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-650 p-4 flex items-center gap-3 shrink-0 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white relative">
                  <Bot className="w-5 h-5" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-none text-white font-sans">Copilote IA MonForfait</h4>
                  <span className="text-[10px] text-blue-200 mt-1 block">Assistant Commercial B2B Télécom</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80">
                {copilotMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed ${
                      msg.isBot 
                        ? 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800' 
                        : 'bg-blue-600 text-white rounded-tr-none'
                    } whitespace-pre-line font-medium`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isCopilotThinking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                      <span className="text-[10px] text-slate-400">Le copilote réfléchit...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions Suggestions */}
              <div className="p-2 bg-slate-900 border-t border-slate-800 flex flex-wrap gap-1.5 shrink-0">
                {[
                  { label: '📞 Script d\'appel', q: 'Donne-moi un script d\'appel chaud' },
                  { label: '📊 Analyser ROI', q: 'Calcule ma rentabilité et mon ROI' },
                  { label: '💡 Top villes', q: 'Quelles sont les meilleures villes cette semaine ?' }
                ].map((act, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCopilotSend(act.q)}
                    className="px-2 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-350 rounded-lg text-[9px] font-black border border-slate-750 transition-colors"
                  >
                    {act.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCopilotSend(copilotInput);
                }}
                className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 shrink-0 animate-in fade-in"
              >
                <input 
                  type="text" 
                  placeholder="Posez une question commerciale..."
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-white"
                />
                <button 
                  type="submit"
                  disabled={!copilotInput.trim() || isCopilotThinking}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Real-time qualification toaster alert */}
        {activeToast && (
          <div className="fixed top-24 right-6 z-[250] w-80 bg-slate-900 border-2 border-blue-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-300 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-450 shrink-0">
              <Zap className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0 text-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider">Alerte Lead Live ⚡</span>
                <button 
                  onClick={() => setActiveToast(null)} 
                  className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h5 className="text-xs font-bold text-white mt-1.5 truncate">{activeToast.title}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{activeToast.desc}</p>
              <div className="mt-2.5 flex justify-end">
                <Link 
                  href="/operateurs/dashboard/leads" 
                  onClick={() => setActiveToast(null)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-lg text-[9px] uppercase tracking-wider shadow"
                >
                  Découvrir →
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
