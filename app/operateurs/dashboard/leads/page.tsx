'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lead } from '@/types/lead';
import { LeadScoreBadge } from '@/components/operateurs/LeadScoreBadge';
import { UnlockLeadModal } from '@/components/operateurs/UnlockLeadModal';
import { 
  Search, Filter, Lock, Unlock, MapPin, Building, 
  User, ArrowRight, CreditCard, Sparkles, AlertCircle, ShoppingCart 
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const MOCK_LEADS: Lead[] = [
  {
    id: 'L-1001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'B2B',
    first_name: 'Ahmed',
    last_name: 'B.',
    phone: '06 61 45 89 22',
    email: 'contact@techsolutions.ma',
    city: 'Casablanca',
    company_name: 'Tech Solutions SARL',
    company_size: '10-50',
    budget: 600,
    intent_timeline: 'immédiat',
    fiber_eligible: true,
    score: 85,
    temperature: 'hot',
    status: 'new',
    is_unlocked: false,
    unlock_price: 450,
  },
  {
    id: 'L-1002',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: 'B2C',
    first_name: 'Sara',
    last_name: 'M.',
    phone: '06 72 12 34 56',
    email: 'sara.m@email.com',
    city: 'Rabat',
    budget: 249,
    intent_timeline: 'dans_le_mois',
    fiber_eligible: true,
    score: 65,
    temperature: 'warm',
    status: 'new',
    is_unlocked: false,
    unlock_price: 180,
  },
  {
    id: 'L-1003',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    type: 'B2C',
    first_name: 'Youssef',
    last_name: 'K.',
    phone: '06 00 12 34 56',
    email: 'youssef.k@email.com',
    city: 'Marrakech',
    budget: 199,
    intent_timeline: 'plus_tard',
    fiber_eligible: false,
    score: 35,
    temperature: 'cold',
    status: 'contacted',
    is_unlocked: true,
    unlock_price: 100,
  }
];

function LeadsMarketplaceContent() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'B2B' | 'B2C'>('ALL');
  const [searchCity, setSearchCity] = useState(cityParam || '');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockedLeads, setUnlockedLeads] = useState<string[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(5000);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Load wallet & unlocks
  useEffect(() => {
    const savedBalance = localStorage.getItem('operator_wallet_balance');
    if (savedBalance) setWalletBalance(parseFloat(savedBalance));
    
    const savedUnlocks = localStorage.getItem('operator_unlocked_leads');
    if (savedUnlocks) {
      setUnlockedLeads(JSON.parse(savedUnlocks));
    }
  }, []);

  // Fetch real leads from Supabase and combine
  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped: Lead[] = data.map((l, index) => {
            const hasSpeedtest = !!l.needs_details?.speedtest;
            const score = l.is_pro ? 85 : hasSpeedtest ? 65 : 45;
            const temp = score >= 75 ? 'hot' : score >= 55 ? 'warm' : 'cold';
            return {
              id: l.id,
              created_at: l.created_at,
              type: l.is_pro ? 'B2B' : 'B2C',
              first_name: l.first_name || l.user_name || 'Prospect',
              last_name: l.last_name || '',
              phone: l.user_phone || '06 00 00 00 00',
              email: l.user_email || l.email || 'prospect@client.ma',
              city: l.city || 'Non spécifiée',
              company_name: l.is_pro ? 'Entreprise Marocaine' : undefined,
              company_size: l.is_pro ? '5-20' : undefined,
              budget: l.is_pro ? 450 : 249,
              intent_timeline: l.needs_details?.installation_timing || 'immédiat',
              fiber_eligible: l.needs_details?.preferred_operator ? true : false,
              score,
              temperature: temp,
              status: l.status || 'new',
              is_unlocked: false,
              unlock_price: l.is_pro ? 450 : 180
            };
          });

          // Merge: DB Leads only (no mock leads)
          const merged: Lead[] = [];
          mapped.forEach(ml => {
            if (!merged.some(el => el.id === ml.id)) {
              merged.push(ml);
            }
          });
          setLeads(merged);
        } else {
          setLeads([]);
        }
      } catch (e) {
        console.warn(e);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  // Filter logic
  const filteredLeads = leads.filter(lead => {
    const matchesType = filterType === 'ALL' || lead.type === filterType;
    const matchesCity = searchCity === '' || lead.city.toLowerCase().includes(searchCity.toLowerCase());
    return matchesType && matchesCity;
  });

  const triggerUnlock = (lead: Lead) => {
    // If already unlocked in local state, navigate directly
    const isAlreadyUnlocked = unlockedLeads.includes(lead.id) || lead.is_unlocked;
    if (isAlreadyUnlocked) {
      window.location.href = `/operateurs/dashboard/leads/${lead.id}`;
      return;
    }
    
    setSelectedLead(lead);
    setIsUnlockModalOpen(true);
  };

  const confirmUnlock = () => {
    if (!selectedLead) return;

    const price = selectedLead.unlock_price;
    if (walletBalance < price) {
      setPurchaseError(`Solde insuffisant pour acheter ce lead. Solde: ${walletBalance} DH | Requis: ${price} DH.`);
      setIsUnlockModalOpen(false);
      setTimeout(() => setPurchaseError(null), 5000);
      return;
    }

    // Deduct and update
    const newBalance = walletBalance - price;
    const newUnlocks = [...unlockedLeads, selectedLead.id];

    localStorage.setItem('operator_wallet_balance', newBalance.toString());
    localStorage.setItem('operator_unlocked_leads', JSON.stringify(newUnlocks));

    setWalletBalance(newBalance);
    setUnlockedLeads(newUnlocks);
    setIsUnlockModalOpen(false);

    // Update lead local status
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, is_unlocked: true } : l));

    // Notify header
    window.dispatchEvent(new Event('balance_updated'));

    // Redirect to detail page
    window.location.href = `/operateurs/dashboard/leads/${selectedLead.id}?unlocked=true`;
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-500" />
          Marketplace de Leads Qualifiés
        </h1>
        <p className="text-slate-400 mt-2">
          Consultez et achetez en temps réel les dossiers de prospects éligibles à la Fibre et aux offres Mobiles.
        </p>
      </div>

      {/* Error display */}
      {purchaseError && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-300 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1 text-sm font-semibold">
            {purchaseError}
            <Link href="/operateurs/dashboard/billing" className="underline font-black ml-2 text-white hover:text-red-200">
              Recharger mon compte →
            </Link>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl">
        <div className="flex bg-slate-950 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Tous les prospects
          </button>
          <button 
            onClick={() => setFilterType('B2B')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${filterType === 'B2B' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Building className="w-4 h-4" /> B2B Pro
          </button>
          <button 
            onClick={() => setFilterType('B2C')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${filterType === 'B2C' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <User className="w-4 h-4" /> B2C Particuliers
          </button>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher par ville (ex: Casablanca)..." 
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
            />
          </div>
          {searchCity && (
            <button 
              onClick={() => setSearchCity('')} 
              className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Grid of Leads cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl h-64 animate-pulse"></div>
          ))
        ) : filteredLeads.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="text-sm font-semibold">Aucun lead ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const isUnlocked = unlockedLeads.includes(lead.id) || lead.is_unlocked;
            return (
              <div 
                key={lead.id} 
                className={`bg-slate-900 border rounded-3xl p-6 shadow-xl transition-all hover:-translate-y-1 duration-200 flex flex-col justify-between ${
                  isUnlocked 
                    ? 'border-emerald-500/30 bg-gradient-to-br from-slate-900 to-emerald-950/10' 
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                
                {/* Header card info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        lead.type === 'B2B' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'
                      }`}>
                        {lead.type === 'B2B' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Identifiant</span>
                        <div className="text-xs font-mono font-bold text-white leading-none">{lead.id}</div>
                      </div>
                    </div>
                    <LeadScoreBadge score={lead.score} temperature={lead.temperature} />
                  </div>

                  {/* Customer name and main criteria */}
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {lead.type === 'B2B' 
                        ? (lead.company_name || 'Tech Solutions') 
                        : `${lead.first_name} ${isUnlocked ? lead.last_name : lead.last_name.substring(0, 1) + '.'}`
                      }
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-2 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {lead.city}</span>
                      <span>•</span>
                      <span>Budget: <strong className="text-slate-200 font-bold">{lead.budget} DH/m</strong></span>
                      <span>•</span>
                      <span className={`font-semibold ${lead.fiber_eligible ? 'text-emerald-400' : 'text-orange-400'}`}>
                        {lead.fiber_eligible ? 'Fibre Éligible' : 'ADSL/4G'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="my-5 border-t border-slate-800/80"></div>

                {/* Bottom purchasing controls */}
                <div className="flex items-center justify-between gap-4">
                  {isUnlocked ? (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <Unlock className="w-4 h-4" /> Débloqué
                      </div>
                      <Link href={`/operateurs/dashboard/leads/${lead.id}`} className="flex-1">
                        <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors">
                          Ouvrir la fiche <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Frais de déblocage</span>
                        <div className="text-base font-black text-blue-400 leading-tight">{lead.unlock_price} DH</div>
                      </div>
                      <button 
                        onClick={() => triggerUnlock(lead)}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/25"
                      >
                        <Lock className="w-3.5 h-3.5" /> Débloquer
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {selectedLead && (
        <UnlockLeadModal 
          lead={selectedLead}
          isOpen={isUnlockModalOpen}
          onClose={() => setIsUnlockModalOpen(false)}
          onConfirm={confirmUnlock}
        />
      )}

    </div>
  );
}

export default function LeadsMarketplacePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Chargement de la marketplace...</div>}>
      <LeadsMarketplaceContent />
    </Suspense>
  );
}
