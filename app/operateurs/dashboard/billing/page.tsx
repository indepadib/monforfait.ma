'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, Download, Plus, 
  ArrowUpRight, History, HelpCircle, Check, AlertCircle,
  X, RefreshCw 
} from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  description: string;
  type: 'exclusive' | 'shared' | 'reload';
  amount: number;
  status: 'paid' | 'pending';
}

export default function OperatorBillingPage() {
  const [walletBalance, setWalletBalance] = useState<number>(5000);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reloadAmount, setReloadAmount] = useState<number>(1000);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadSuccess, setReloadSuccess] = useState(false);

  // Secure payment form states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const handleDownloadInvoice = (invoice: Invoice) => {
    const operatorCompany = localStorage.getItem('operator_company_name') || 'Entreprise Inconnue';
    const htmlContent = `
      <html>
        <head>
          <title>Facture ${invoice.id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: 900; }
            .logo span { color: #3b82f6; }
            .title { font-size: 28px; color: #1e293b; font-weight: bold; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .box { padding: 20px; background: #f8fafc; border-radius: 8px; width: 45%; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th, td { padding: 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f1f5f9; color: #475569; font-size: 12px; text-transform: uppercase; }
            .total-row { font-weight: bold; font-size: 18px; }
            .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <div class="logo">Mon<span>Forfait</span>.ma</div>
            <div class="title">FACTURE</div>
          </div>
          <div class="details">
            <div class="box">
              <p><strong>Émetteur :</strong></p>
              <p>MonForfait.ma<br>Casablanca, Maroc<br>contact@monforfait.ma</p>
            </div>
            <div class="box">
              <p><strong>Client :</strong></p>
              <p>${operatorCompany}<br>Partenaire B2B</p>
            </div>
          </div>
          <div style="margin-bottom: 30px;">
            <p><strong>N° Facture :</strong> ${invoice.id}</p>
            <p><strong>Date :</strong> ${invoice.date}</p>
            <p><strong>Statut :</strong> Payé</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th style="text-align:right">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.description}</td>
                <td>${invoice.type === 'reload' ? 'Recharge Wallet' : 'Achat de Lead'}</td>
                <td style="text-align:right">${invoice.amount} DH</td>
              </tr>
              <tr class="total-row">
                <td colspan="2" style="text-align:right">Total Net :</td>
                <td style="text-align:right">${invoice.amount} DH</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            Merci de votre confiance. Pour toute question, contactez-nous à support@monforfait.ma.
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'width=800,height=900');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  useEffect(() => {
    // Load wallet balance from localStorage
    const savedBalance = localStorage.getItem('operator_wallet_balance');
    if (savedBalance) {
      setWalletBalance(parseFloat(savedBalance));
    } else {
      localStorage.setItem('operator_wallet_balance', '5000');
    }

    // Set up mock invoice history
    const savedUnlocked = localStorage.getItem('operator_unlocked_leads');
    const unlockedIds: string[] = savedUnlocked ? JSON.parse(savedUnlocked) : [];
    
    const initialInvoices: Invoice[] = [
      {
        id: 'FAC-2026-001',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toLocaleDateString('fr-FR'),
        description: 'Rechargement de compte - Pack Pro',
        type: 'reload',
        amount: 2500,
        status: 'paid'
      },
      {
        id: 'FAC-2026-002',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toLocaleDateString('fr-FR'),
        description: 'Achat Lead Exclusif L-1001 (Tech Solutions)',
        type: 'exclusive',
        amount: 450,
        status: 'paid'
      }
    ];

    // Add invoices for dynamically unlocked leads
    unlockedIds.forEach((id, index) => {
      if (id !== 'L-1001') { // avoid duplicate for the mock one
        initialInvoices.push({
          id: `FAC-2026-U0${index + 3}`,
          date: new Date().toLocaleDateString('fr-FR'),
          description: `Achat Lead Qualifié ${id}`,
          type: 'shared',
          amount: 180,
          status: 'paid'
        });
      }
    });

    setInvoices(initialInvoices.reverse());
  }, []);

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReloading(true);
    
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: reloadAmount,
          operatorEmail: localStorage.getItem('operator_email') || 'unknown'
        })
      });

      const result = await response.json();

      if (result.url) {
        // Redirect to real Stripe/Payment gateway
        window.location.href = result.url;
        return;
      }

      // If simulated or success returned directly
      const currentBalance = parseFloat(localStorage.getItem('operator_wallet_balance') || '5000');
      const newBalance = currentBalance + reloadAmount;
      localStorage.setItem('operator_wallet_balance', newBalance.toString());
      setWalletBalance(newBalance);
      
      const newInvoice: Invoice = {
        id: `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toLocaleDateString('fr-FR'),
        description: `Rechargement Wallet B2B - Terminison de Carte **${cardNumber.slice(-4) || 'XXXX'}`,
        type: 'reload',
        amount: reloadAmount,
        status: 'paid'
      };
      
      setInvoices([newInvoice, ...invoices]);
      window.dispatchEvent(new Event('storage'));
      
      setIsPaymentModalOpen(false);
      setReloadSuccess(true);
      
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      setCardName('');

      setTimeout(() => setReloadSuccess(false), 3000);
    } catch (err) {
      console.error("Payment failed", err);
      alert("Le paiement a échoué.");
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Gestion & Facturation B2B
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Gérez votre solde prépayé, rechargez vos crédits et téléchargez vos justificatifs fiscaux.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Wallet & Recharge */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card Solde */}
          <div className="relative overflow-hidden bg-slate-900 dark:bg-zinc-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CreditCard className="w-40 h-40" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Solde Actuel Prépayé</p>
                <h2 className="text-5xl font-black mt-2 tracking-tight flex items-baseline gap-2">
                  {walletBalance.toLocaleString('fr-FR')} <span className="text-xl text-blue-400 font-bold">DH</span>
                </h2>
                <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit">
                  <ShieldCheck className="w-4 h-4" /> Transactions cryptées & sécurisées
                </div>
              </div>

              <div className="bg-slate-800/50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400">Consommation du mois</span>
                <span className="text-lg font-bold text-slate-200">630 DH</span>
                <span className="text-xs text-slate-500">Prochain prélèvement : N/A (Prépayé)</span>
              </div>
            </div>
          </div>

          {/* Recharge Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Alimenter mon portefeuille</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sélectionnez le pack à ajouter à votre compte pour débloquer les prospects.</p>
            </div>

            {/* Quick Packages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Pack Standard', amount: 500, detail: 'Idéal petits tests' },
                { label: 'Pack Pro (Recommandé)', amount: 1500, detail: 'Bonus +100 DH inclus', isPopular: true },
                { label: 'Pack Premium', amount: 3000, detail: 'Bonus +300 DH inclus' }
              ].map((pkg, i) => (
                <button 
                  key={i}
                  onClick={() => setReloadAmount(pkg.amount)}
                  className={`p-6 rounded-2xl border text-left transition-all relative ${
                    reloadAmount === pkg.amount 
                      ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/10 ring-2 ring-blue-600/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3 left-4 px-2 py-0.5 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-wider">
                      Populaire
                    </span>
                  )}
                  <div className="text-xs font-bold text-slate-400">{pkg.label}</div>
                  <div className="text-2xl font-black mt-2 text-slate-900 dark:text-white">{pkg.amount} DH</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1">{pkg.detail}</div>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  value={reloadAmount}
                  onChange={(e) => setReloadAmount(Math.max(100, parseInt(e.target.value) || 0))}
                  placeholder="Autre montant..."
                  className="w-full pl-6 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">DH</span>
              </div>
              <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Alimenter le Solde
              </button>
            </div>

            {reloadSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-bold">Votre compte a été rechargé de {reloadAmount} DH avec succès !</span>
              </div>
            )}

            {/* Simulated Payment methods */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Moyen de Paiement actif</h4>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">VISA</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold block text-slate-900 dark:text-white">Attijariwafa Bank Commercial Card</span>
                    <span className="text-xs text-slate-500">•••• •••• •••• 8492 — Exp: 12/28</span>
                  </div>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Modifier</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Invoices & Help */}
        <div className="space-y-8">
          
          {/* Support Widget */}
          <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-950 dark:text-white">Besoin d'aide sur la facturation ?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nos conseillers commerciaux B2B sont à votre écoute pour des rechargements par virement bancaire ou bons d'achat entreprise.
              </p>
            </div>
            <a 
              href="mailto:b2b@monforfait.ma" 
              className="block text-center py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Contacter le support B2B
            </a>
          </div>

          {/* Pricing Policy Box */}
          <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-950 dark:text-white flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-blue-500" /> Règle de remboursement
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Si vous débloquez un prospect et que son numéro de téléphone est erroné ou injoignable, vous disposez de <strong>48 heures</strong> pour contester et obtenir un remboursement intégral sur votre solde.
            </p>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" /> Historique des Transactions
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-4">N° Facture</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Désignation</th>
                <th className="pb-4">Type d'opération</th>
                <th className="pb-4">Montant</th>
                <th className="pb-4 text-right">Justificatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Aucune facture enregistrée.</td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-4 font-mono font-bold text-xs">{invoice.id}</td>
                    <td className="py-4 text-xs">{invoice.date}</td>
                    <td className="py-4 font-semibold text-xs text-slate-900 dark:text-white">{invoice.description}</td>
                    <td className="py-4 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        invoice.type === 'reload' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' 
                          : invoice.type === 'exclusive'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/20'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20'
                      }`}>
                        {invoice.type === 'reload' ? 'Recharge' : invoice.type === 'exclusive' ? 'Achat Exclusif' : 'Achat Partagé'}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-xs">
                      {invoice.type === 'reload' ? `+${invoice.amount}` : `-${invoice.amount}`} DH
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secure Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 relative animate-in slide-in-from-bottom-8 duration-300">
            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-zinc-800 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Paiement Sécurisé</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Alimentation de votre solde B2B par Carte Bancaire</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl mb-6 flex justify-between items-center border border-slate-100 dark:border-zinc-800/80">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Montant de la transaction</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{reloadAmount.toLocaleString('fr-FR')} DH</span>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nom complet sur la carte</label>
                <input 
                  type="text" 
                  required
                  placeholder="EX: M. AHMED ALAMI"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-650"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Numéro de carte bancaire</label>
                <input 
                  type="text" 
                  required
                  placeholder="EX: 4123 4567 8901 2345"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setCardNumber(val);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-655"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Expiration (MM/AA)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="EX: 12/28"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim();
                      setCardExpiry(val.endsWith('/') ? val.slice(0, -1) : val);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-center text-white placeholder-slate-655"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Code CVC</label>
                  <input 
                    type="text" 
                    required
                    placeholder="EX: 382"
                    maxLength={3}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-center text-white placeholder-slate-655"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Connexion SSL 256 bits</span>
                <span>PCI-DSS Compliant</span>
              </div>

              <button
                type="submit"
                disabled={isReloading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg disabled:opacity-50"
              >
                {isReloading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  `Confirmer le Paiement de ${reloadAmount} DH`
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
