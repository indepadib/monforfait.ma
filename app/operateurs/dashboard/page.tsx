'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, Users, Target, Zap, ChevronRight, 
  MapPin, TrendingUp, DollarSign, Activity, Award, CheckCircle2, RefreshCcw
} from 'lucide-react';
import { LeadVolumeChart, LeadTypeChart } from '@/components/operateurs/DashboardCharts';
import { supabase } from '@/lib/supabaseClient';

const MAP_CITIES = [
  { name: 'Casablanca', x: 250, y: 155, leads: 48, active: true },
  { name: 'Rabat', x: 280, y: 130, leads: 32, active: true },
  { name: 'Marrakech', x: 210, y: 240, leads: 24, active: true },
  { name: 'Tanger', x: 340, y: 50, leads: 15, active: true },
  { name: 'Agadir', x: 145, y: 290, leads: 11, active: true },
  { name: 'Fès', x: 330, y: 120, leads: 9, active: false }
];

interface KanbanLead {
  id: string;
  name: string;
  city: string;
  budget: number;
  stage: 'contact' | 'meeting' | 'negotiation' | 'won' | 'lost';
}

const MOCK_LEADS_SOURCE = [
  { id: 'L-1001', first_name: 'Ahmed', last_name: 'B.', company_name: 'Tech Solutions SARL', city: 'Casablanca', budget: 600 },
  { id: 'L-1002', first_name: 'Sara', last_name: 'M.', city: 'Rabat', budget: 249 },
  { id: 'L-1003', first_name: 'Youssef', last_name: 'K.', city: 'Marrakech', budget: 199 }
];

export default function OperatorDashboardPage() {
  const [dbStats, setDbStats] = useState({
    totalLeads: 119,
    b2bCount: 23,
    hotCount: 45,
    pendingCount: 18
  });
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // ROI Calculator States
  const [roiLeads, setRoiLeads] = useState(20);
  const [roiConvRate, setRoiConvRate] = useState(25);
  const [roiArpu, setRoiArpu] = useState(349);

  // Kanban Board States
  const [kanbanLeads, setKanbanLeads] = useState<KanbanLead[]>([]);

  // Activity Feed
  const initialFeed = [
    { id: 'L-1004', city: 'Casablanca', type: 'B2B', time: 'À l\'instant', action: 'Eligibilité Fibre Validée', budget: 450 },
    { id: 'L-1005', city: 'Rabat', type: 'B2C', time: 'Il y a 5 min', action: 'Quiz validé - IAM Cible', budget: 249 },
    { id: 'L-1006', city: 'Marrakech', type: 'B2C', time: 'Il y a 14 min', action: 'Speedtest: 12Mbps ADSL', budget: 199 },
    { id: 'L-1007', city: 'Tanger', type: 'B2B', time: 'Il y a 40 min', action: 'Flotte B2B 12 lignes', budget: 850 }
  ];

  const fetchRealStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*');
      if (!error && data) {
        // Map database leads to Lead interface
        const dbLeads = data.map(l => {
          const hasSpeedtest = !!l.needs_details?.speedtest;
          const score = l.is_pro ? 85 : hasSpeedtest ? 65 : 45;
          const temp = score >= 75 ? 'hot' : score >= 55 ? 'warm' : 'cold';
          return {
            id: l.id,
            type: l.is_pro ? 'B2B' : 'B2C',
            is_pro: l.is_pro,
            needs_details: l.needs_details,
            status: l.status || 'new',
            score,
            city: l.city || 'Casablanca'
          };
        });

        // Combine with MOCK_LEADS
        const combined = [...MOCK_LEADS_SOURCE];
        dbLeads.forEach(dl => {
          if (!combined.some(m => m.id === dl.id)) {
            combined.push({
              first_name: 'Prospect',
              last_name: '',
              city: dl.city || 'Casablanca',
              budget: dl.needs_details?.budget || 249,
              ...dl
            } as any);
          }
        });

        // Calculate 100% accurate statistics based on combined list
        const total = combined.length;
        const b2b = combined.filter(l => l.type === 'B2B').length;
        const hot = combined.filter(l => l.score >= 75 || l.needs_details?.installation_timing === 'asap').length;
        const pending = combined.filter(l => l.status === 'new' || l.status === 'new_qualified').length;

        setDbStats({
          totalLeads: total,
          b2bCount: b2b,
          hotCount: hot,
          pendingCount: pending
        });
      }
    } catch (e) {
      console.warn("Supabase fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealStats();

    // Sync pipeline from local storage and incorporate unlocked leads
    const savedPipeline = localStorage.getItem('operator_kanban_pipeline');
    let currentPipeline: KanbanLead[] = savedPipeline ? JSON.parse(savedPipeline) : [
      { id: 'L-1001', name: 'Tech Solutions SARL', city: 'Casablanca', budget: 600, stage: 'meeting' },
      { id: 'L-1004', name: 'Karim Bensalah', city: 'Rabat', budget: 349, stage: 'contact' },
      { id: 'L-1005', name: 'Morocco Travel Agency', city: 'Marrakech', budget: 450, stage: 'negotiation' },
      { id: 'L-1006', name: 'Yassine K.', city: 'Tanger', budget: 249, stage: 'won' }
    ];

    const savedUnlocked = localStorage.getItem('operator_unlocked_leads');
    const unlockedIds: string[] = savedUnlocked ? JSON.parse(savedUnlocked) : [];

    let updatedPipeline = [...currentPipeline];
    let changed = false;

    unlockedIds.forEach(id => {
      if (!updatedPipeline.some(l => l.id === id)) {
        const mockMatch = MOCK_LEADS_SOURCE.find(m => m.id === id);
        updatedPipeline.push({
          id: id,
          name: mockMatch 
            ? (mockMatch.company_name || `${mockMatch.first_name} ${mockMatch.last_name}`) 
            : `Lead #${id.substring(0, 5)}`,
          city: mockMatch ? mockMatch.city : 'Casablanca',
          budget: mockMatch ? mockMatch.budget : 249,
          stage: 'contact'
        });
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem('operator_kanban_pipeline', JSON.stringify(updatedPipeline));
    }
    setKanbanLeads(updatedPipeline);
  }, []);

  // Update kanban lead stage
  const moveLead = (id: string, newStage: KanbanLead['stage']) => {
    const updated = kanbanLeads.map(lead => lead.id === id ? { ...lead, stage: newStage } : lead);
    setKanbanLeads(updated);
    localStorage.setItem('operator_kanban_pipeline', JSON.stringify(updated));
  };

  // ROI Calculations
  const calculatedMrr = Math.round(roiLeads * (roiConvRate / 100) * roiArpu);
  const leadAcquisitionCost = roiLeads * 250;
  const annualRevenue = calculatedMrr * 12;
  const netProfit = annualRevenue - leadAcquisitionCost;
  const roiPercentage = leadAcquisitionCost > 0 ? Math.round((netProfit / leadAcquisitionCost) * 100) : 0;

  // Filter Kanban & Ticker based on selectedCity map filter
  const filteredKanbanLeads = selectedCity 
    ? kanbanLeads.filter(l => l.city.toLowerCase() === selectedCity.toLowerCase())
    : kanbanLeads;

  const filteredFeed = selectedCity
    ? initialFeed.filter(f => f.city.toLowerCase() === selectedCity.toLowerCase())
    : initialFeed;

  const wonLeadsCount = filteredKanbanLeads.filter(l => l.stage === 'won').length;
  const wonRevenue = filteredKanbanLeads.filter(l => l.stage === 'won').reduce((sum, l) => sum + l.budget, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 bg-slate-950 text-slate-100 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
            LeadCenter B2B Overview
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Vue consolidée en temps réel du pipeline d'acquisition télécom Maroc.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchRealStats}
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
            title="Rafraîchir les statistiques"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link 
            href="/operateurs/dashboard/leads" 
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 text-sm"
          >
            Marché des Leads B2B <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads Disponibles', val: dbStats.totalLeads, icon: Users, color: 'text-blue-500', bg: 'bg-blue-950/40 border-blue-500/20' },
          { label: 'Leads Premium B2B', val: dbStats.b2bCount, icon: Target, color: 'text-purple-500', bg: 'bg-purple-950/40 border-purple-500/20' },
          { label: 'Leads Très Chauds (70+)', val: dbStats.hotCount, icon: Zap, color: 'text-red-500', bg: 'bg-red-950/40 border-red-500/20' },
          { 
            label: selectedCity ? `Signés (${selectedCity})` : 'Abonnements Gagnés (CRM)', 
            val: `${wonLeadsCount} (${wonRevenue} DH/m)`, 
            icon: Award, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-950/40 border-emerald-500/20' 
          }
        ].map((kpi, idx) => (
          <div key={idx} className={`relative overflow-hidden bg-slate-900 border rounded-3xl p-6 shadow-xl ${kpi.bg} transition-all hover:-translate-y-1 duration-200`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
              <div className={`p-2 rounded-xl bg-slate-800 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* Interactive Map & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Map Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Zones de Demandes Actives
              </h2>
              <p className="text-xs text-slate-400 mt-1">Sélectionnez une ville pour filtrer les opportunités du CRM et du Ticker.</p>
            </div>
            {selectedCity && (
              <button 
                onClick={() => setSelectedCity(null)}
                className="text-xs font-bold text-blue-500 hover:underline"
              >
                Réinitialiser la carte
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* SVG Map of Morocco */}
            <div className="w-full max-w-[360px] h-[400px] bg-slate-950/60 rounded-2xl border border-slate-800/60 p-4 relative flex items-center justify-center">
              <svg className="w-full h-full text-slate-800" viewBox="0 0 500 500" fill="currentColor">
                <path d="M 340,50 L 370,52 L 390,58 L 410,68 L 430,72 L 425,100 L 420,140 L 435,170 L 410,200 L 390,220 L 370,240 L 340,260 L 300,290 L 260,310 L 240,330 L 240,430 L 100,430 L 100,500 L 35,500 L 38,480 L 42,450 L 50,410 L 68,380 L 90,350 L 115,330 L 130,310 L 145,290 L 160,255 L 190,220 L 220,185 L 250,155 L 280,130 L 310,95 Z" fill="#1e293b" opacity="0.5" stroke="#334155" strokeWidth="2" />
                
                {MAP_CITIES.map((c) => {
                  const isHovered = selectedCity === c.name;
                  return (
                    <g 
                      key={c.name} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedCity(c.name)}
                    >
                      {c.active && (
                        <circle cx={c.x} cy={c.y} r="12" className="fill-blue-500/20 animate-ping" />
                      )}
                      <circle 
                        cx={c.x} 
                        cy={c.y} 
                        r={isHovered ? 8 : 6} 
                        className={`transition-all ${
                          isHovered 
                            ? 'fill-blue-400 stroke-white stroke-2 shadow-2xl' 
                            : 'fill-blue-600 group-hover:fill-blue-400'
                        }`} 
                      />
                      <text 
                        x={c.x + 10} 
                        y={c.y + 4} 
                        className="text-[10px] font-black fill-slate-300 group-hover:fill-white select-none transition-colors"
                      >
                        {c.name} {c.leads > 0 && `(${c.leads})`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* City details */}
            <div className="flex-1 space-y-4 w-full">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performances par Région</h4>
              
              <div className="space-y-2">
                {MAP_CITIES.map((c) => (
                  <button 
                    key={c.name}
                    onClick={() => setSelectedCity(c.name)}
                    className={`w-full p-3 rounded-xl border flex justify-between items-center transition-all text-left text-xs ${
                      selectedCity === c.name 
                        ? 'bg-blue-600 border-blue-500 text-white font-bold' 
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${c.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                      {c.name}
                    </span>
                    <span className="font-bold">{c.leads} leads qualifiés</span>
                  </button>
                ))}
              </div>

              {selectedCity && (
                <div className="p-3.5 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-blue-300 font-semibold leading-relaxed">
                    💡 <strong>Filtre Actif : {selectedCity}</strong>. Nous affichons uniquement les leads de cette région.
                    <Link href={`/operateurs/dashboard/leads?city=${selectedCity}`} className="underline font-bold ml-1.5 inline-block text-white">
                      Voir la marketplace ({selectedCity}) →
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Lead activity feed */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Activité Temps Réel {selectedCity && `(${selectedCity})`}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Prospects récemment validés sur MonForfait.ma</p>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {filteredFeed.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-10 italic">Aucune activité récente pour cette ville.</div>
            ) : (
              filteredFeed.map((feed, i) => (
                <div key={i} className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl space-y-1.5 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      feed.type === 'B2B' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {feed.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{feed.time}</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{feed.action}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {feed.city}</span>
                    <span className="font-bold text-slate-200">{feed.budget} DH/m</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ROI Simulator */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            Simulateur de Rendement Commercial (ROI)
          </h2>
          <p className="text-xs text-slate-400 mt-1">Calculez le chiffre d'affaires additionnel récurrent généré par l'acquisition de nos leads qualifiés.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6 bg-slate-950/40 p-6 rounded-2xl border border-slate-800/60">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                <span>Leads achetés / mois</span>
                <span className="text-blue-400 font-black">{roiLeads} Leads</span>
              </div>
              <input 
                type="range" min="5" max="100" step="5" value={roiLeads} 
                onChange={(e) => setRoiLeads(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                <span>Taux de conversion estimé</span>
                <span className="text-blue-400 font-black">{roiConvRate} %</span>
              </div>
              <input 
                type="range" min="5" max="50" step="1" value={roiConvRate} 
                onChange={(e) => setRoiConvRate(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                <span>Forfait Moyen (ARPU mensuel)</span>
                <span className="text-blue-400 font-black">{roiArpu} DH / mois</span>
              </div>
              <input 
                type="range" min="150" max="800" step="10" value={roiArpu} 
                onChange={(e) => setRoiArpu(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl flex flex-col justify-between h-full min-h-[220px]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100">Chiffre d'Affaires Additionnel (Annuel)</span>
              <div className="text-4xl font-black mt-2 tracking-tight">{(annualRevenue).toLocaleString('fr-FR')} DH</div>
            </div>
            
            <div className="pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-blue-200 uppercase font-semibold text-[9px]">MRR (Mensuel)</span>
                <span className="font-bold text-sm">{calculatedMrr} DH</span>
              </div>
              <div>
                <span className="block text-blue-200 uppercase font-semibold text-[9px]">ROI estimé</span>
                <span className="font-bold text-sm text-emerald-300">+{roiPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Kanban Pipeline */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Suivi des Opportunités (CRM Kanban) {selectedCity && `(${selectedCity})`}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Glissez vos prospects achetés dans les différentes phases de votre entonnoir de vente.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { id: 'contact', title: 'À Contacter 📞', color: 'border-blue-500/20 bg-blue-950/10' },
            { id: 'meeting', title: 'Rendez-vous Planifié 📅', color: 'border-yellow-500/20 bg-yellow-950/10' },
            { id: 'negotiation', title: 'En Négociation 📑', color: 'border-purple-500/20 bg-purple-950/10' },
            { id: 'won', title: 'Gagné / Contrat Signé 🎉', color: 'border-emerald-500/20 bg-emerald-950/10' }
          ].map((col) => {
            const items = filteredKanbanLeads.filter(l => l.stage === col.id);
            return (
              <div key={col.id} className={`p-4 rounded-2xl border ${col.color} min-h-[220px] flex flex-col space-y-3`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-300">{col.title}</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-slate-800 rounded-full text-slate-400">{items.length}</span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="text-[10px] text-slate-500 italic text-center py-6">Aucun prospect</div>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl space-y-2 hover:border-slate-700 transition-colors shadow-md">
                        <div className="text-xs font-bold text-white leading-tight">{item.name}</div>
                        <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                          <span>{item.city}</span>
                          <span className="text-blue-400">{item.budget} DH</span>
                        </div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-800/60">
                          <Link href={`/operateurs/dashboard/leads/${item.id}`} className="text-[9px] text-slate-400 hover:text-blue-400 font-bold">
                            Fiche →
                          </Link>
                          <div className="flex gap-1">
                            {col.id !== 'contact' && (
                              <button 
                                onClick={() => {
                                  const stages: KanbanLead['stage'][] = ['contact', 'meeting', 'negotiation', 'won'];
                                  const prev = stages[stages.indexOf(col.id as any) - 1];
                                  moveLead(item.id, prev);
                                }}
                                className="text-[9px] font-bold text-slate-500 hover:text-white px-1 py-0.5 bg-slate-950 rounded"
                              >
                                ←
                              </button>
                            )}
                            {col.id !== 'won' && (
                              <button 
                                onClick={() => {
                                  const stages: KanbanLead['stage'][] = ['contact', 'meeting', 'negotiation', 'won'];
                                  const next = stages[stages.indexOf(col.id as any) + 1];
                                  moveLead(item.id, next);
                                }}
                                className="text-[9px] font-bold text-blue-500 hover:text-white px-1.5 py-0.5 bg-slate-950 rounded"
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800/80 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Évolution du Volume</h3>
            <p className="text-xs text-slate-400 mt-1">Historique d'acquisition sur les 7 derniers jours</p>
          </div>
          <LeadVolumeChart />
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800/80 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Répartition B2B Premium vs B2C</h3>
            <p className="text-xs text-slate-400 mt-1">Segments qualifiés</p>
          </div>
          <LeadTypeChart />
        </div>
      </div>

    </div>
  );
}
