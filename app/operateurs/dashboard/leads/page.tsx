'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lead, LeadTemperature } from '@/types/lead';
import { LeadScoreBadge } from '@/components/operateurs/LeadScoreBadge';
import { Search, Filter, Lock, Unlock, MapPin, Building, User, ArrowRight } from 'lucide-react';

// Mock Data
const MOCK_LEADS: Lead[] = [
  {
    id: 'L-1001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'B2B',
    first_name: 'Ahmed',
    last_name: 'B.',
    phone: '06 61 ** ** **',
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
    phone: '06 72 ** ** **',
    city: 'Rabat',
    budget: 200,
    intent_timeline: 'dans_le_mois',
    fiber_eligible: true,
    score: 55,
    temperature: 'warm',
    status: 'new',
    is_unlocked: false,
    unlock_price: 100,
  },
  {
    id: 'L-1003',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    type: 'B2C',
    first_name: 'Youssef',
    last_name: 'K.',
    phone: '06 00 12 34 56', // Unlocked example
    city: 'Marrakech',
    budget: 150,
    intent_timeline: 'plus_tard',
    fiber_eligible: false,
    score: 25,
    temperature: 'cold',
    status: 'contacted',
    is_unlocked: true,
    unlock_price: 50,
  }
];

export default function LeadsMarketplacePage() {
  const [filterType, setFilterType] = useState<'ALL' | 'B2B' | 'B2C'>('ALL');

  const filteredLeads = MOCK_LEADS.filter(lead => {
    if (filterType === 'ALL') return true;
    return lead.type === filterType;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Marketplace Leads</h1>
          <p className="text-slate-500 mt-2">Découvrez, filtrez et achetez les prospects qui correspondent à vos offres.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterType === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Tous les leads
          </button>
          <button 
            onClick={() => setFilterType('B2B')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${filterType === 'B2B' ? 'bg-slate-900 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Building className="w-4 h-4" /> B2B Premium
          </button>
          <button 
            onClick={() => setFilterType('B2C')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${filterType === 'B2C' ? 'bg-blue-600 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User className="w-4 h-4" /> B2C Particulier
          </button>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher par ville..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filtres
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-500">
                <th className="px-6 py-4">Client / Entreprise</th>
                <th className="px-6 py-4">Localisation</th>
                <th className="px-6 py-4">Intention & Budget</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${lead.type === 'B2B' ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-600'}`}>
                        {lead.type === 'B2B' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {lead.type === 'B2B' ? lead.company_name : `${lead.first_name} ${lead.last_name}`}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {lead.is_unlocked ? (
                            <Unlock className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Lock className="w-3 h-3 text-slate-400" />
                          )}
                          <span className={`text-xs ${lead.is_unlocked ? 'text-slate-700' : 'text-slate-400 font-mono'}`}>
                            {lead.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {lead.city}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{lead.budget ? `${lead.budget} DH/mois` : 'Non précisé'}</p>
                    <p className="text-xs text-slate-500 mt-0.5 capitalize">{lead.intent_timeline?.replace(/_/g, ' ')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <LeadScoreBadge score={lead.score} temperature={lead.temperature} />
                  </td>
                  <td className="px-6 py-4">
                    {lead.is_unlocked ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                        Débloqué
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 ring-1 ring-slate-600/20">
                        Disponible
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/operateurs/dashboard/leads/${lead.id}`}>
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm">
                        Voir détails <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
