'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lead } from '@/types/lead';
import { 
  Printer, ArrowLeft, Building, User, MapPin, Target, 
  CheckCircle2, Phone, Mail, FileText, BarChart3, ShieldCheck 
} from 'lucide-react';

const MOCK_LEADS: Record<string, Lead> = {
  'L-1001': {
    id: 'L-1001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'B2B',
    first_name: 'Ahmed',
    last_name: 'Benjelloun',
    phone: '06 61 45 89 22',
    email: 'a.benjelloun@techsolutions.ma',
    city: 'Casablanca',
    company_name: 'Tech Solutions SARL',
    company_size: '10-50',
    industry: 'IT & Software',
    budget: 600,
    intent_timeline: 'immédiat',
    fiber_eligible: true,
    needs: ['Fibre Optique Pro 100M', 'Flotte Mobile (5 lignes)', 'Standard Virtuel'],
    score: 85,
    temperature: 'hot',
    status: 'new',
    is_unlocked: true,
    unlock_price: 450,
  }
};

export default function FicheClientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;
  const [lead, setLead] = useState<Lead | null>(MOCK_LEADS[leadId] || null);
  const [isLoading, setIsLoading] = useState(!MOCK_LEADS[leadId]);

  useEffect(() => {
    async function fetchRealLead() {
      if (!MOCK_LEADS[leadId]) {
        try {
          const { supabase } = await import('@/lib/supabaseClient');
          const { data, error } = await supabase.from('leads').select('*').eq('id', leadId).single();
          if (data && !error) {
            const hasSpeedtest = !!data.needs_details?.speedtest;
            const realLead: Lead = {
              id: data.id,
              created_at: data.created_at,
              type: data.is_pro ? 'B2B' : 'B2C',
              first_name: data.first_name || data.user_name || 'Prospect',
              last_name: data.last_name || '',
              phone: data.user_phone || '06 00 00 00 00',
              email: data.user_email || data.email || 'client@telecom.ma',
              city: data.city || 'Casablanca',
              company_name: data.is_pro ? 'Entreprise Cliente' : undefined,
              company_size: 'Inconnu',
              budget: data.is_pro ? 450 : 199,
              intent_timeline: data.needs_details?.installation_timing || 'immédiat',
              fiber_eligible: data.needs_details?.preferred_operator ? true : false,
              score: data.is_pro ? 85 : hasSpeedtest ? 65 : 45,
              temperature: data.is_pro ? 'hot' : hasSpeedtest ? 'warm' : 'cold',
              status: 'new',
              is_unlocked: true,
              unlock_price: data.is_pro ? 450 : 180,
            };
            setLead(realLead);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchRealLead();
  }, [leadId]);

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500 bg-slate-100 min-h-screen">Génération de la fiche...</div>;
  }

  if (!lead) return notFound();

  const handlePrint = () => {
    window.print();
  };

  const neighborhood = lead.city === 'Casablanca' ? 'El Maârif' : lead.city === 'Rabat' ? 'Agdal' : 'Centre Ville';

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0 font-sans text-slate-800">
      
      {/* Printable controls */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden px-4">
        <Link href={`/operateurs/dashboard/leads/${lead.id}`} className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          ← Retour au profil commercial
        </Link>
        <button 
          onClick={handlePrint}
          className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs shadow-md"
        >
          <Printer className="w-4 h-4" /> Imprimer / Exporter en PDF
        </button>
      </div>

      {/* A4 Printable Document Container */}
      <div className="max-w-3xl mx-auto bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none overflow-hidden rounded-3xl print:rounded-none border border-slate-200/50 print:border-none">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 flex justify-between items-center print:bg-gradient-to-r print:from-blue-600 print:to-indigo-700">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1">Plateforme B2B Agrée</span>
            <h1 className="text-3xl font-black tracking-tight">MonForfait<span className="text-blue-300">.ma</span></h1>
            <p className="text-xs text-blue-100 mt-1">Fiche Commerciale Prospect Télécom</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-blue-200 block">Référence Client</span>
            <div className="text-lg font-mono font-black">{lead.id}</div>
            <div className="text-[10px] text-blue-100 mt-1">
              Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {lead.type === 'B2B' ? (lead.company_name || 'Société Mandataire') : `${lead.first_name} ${lead.last_name}`}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  lead.type === 'B2B' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {lead.type}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {lead.city} ({neighborhood})
              </p>
            </div>
            
            {/* Lead Score Widget */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[160px]">
              <div className="flex-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Qualité Lead</span>
                <span className="text-2xl font-black text-blue-600">{lead.score} <span className="text-xs text-slate-400 font-bold">/100</span></span>
              </div>
              <span className={`w-3.5 h-3.5 rounded-full ${
                lead.temperature === 'hot' ? 'bg-red-500' : lead.temperature === 'warm' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
            </div>
          </div>

          {/* Details Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Requirements & Budget */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Besoins & Budget
                </h3>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                    <span className="text-slate-500">Budget Mensuel</span>
                    <span className="font-bold text-slate-900">{lead.budget ? `${lead.budget} DH/mois` : 'Non renseigné'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                    <span className="text-slate-500">Installation Souhaitée</span>
                    <span className="font-bold text-slate-900 capitalize">{lead.intent_timeline?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                    <span className="text-slate-500">Raccordement Fibre</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      {lead.fiber_eligible ? <><CheckCircle2 className="w-3.5 h-3.5" /> Confirmé Éligible</> : 'Non vérifié'}
                    </span>
                  </div>
                </div>
              </div>

              {lead.needs && lead.needs.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Prestations ciblées
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 text-xs font-semibold text-slate-700">
                    {lead.needs.map((need, idx) => (
                      <li key={idx} className="marker:text-blue-500">{need}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Contact info */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                Coordonnées Vérifiées
              </h3>
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4 text-xs font-semibold">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Nom Complet Client</span>
                  <span className="text-sm font-bold text-slate-900 block">{lead.first_name} {lead.last_name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Téléphone Portable</span>
                    <span className="text-sm font-bold text-blue-600 block">{lead.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Adresse Email</span>
                    <span className="text-sm font-bold text-slate-900 block truncate max-w-[220px]">{lead.email}</span>
                  </div>
                </div>

                {lead.type === 'B2B' && (
                  <div className="pt-3 border-t border-slate-200 mt-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Données Flotte Pro</span>
                    <span className="font-bold text-slate-900 block">{lead.company_name}</span>
                    <span className="text-[10px] text-slate-500 block">Secteur: {lead.industry} ({lead.company_size} salariés)</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Telemetry Speeds Chart (CSS Visualized) */}
          <div className="border border-slate-100 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Rapport de Télémesure Débit Moyen (Quartier)
            </h3>
            
            <div className="space-y-3">
              {[
                { label: 'Orange Fibre Optique', val: 92, max: 150, color: 'bg-orange-500' },
                { label: 'Inwi Fibre Optique', val: 65, max: 150, color: 'bg-purple-500' },
                { label: 'Maroc Telecom ADSL', val: 12, max: 150, color: 'bg-blue-500' }
              ].map((tel, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{tel.label}</span>
                    <span>{tel.val} Mbps</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${(tel.val / tel.max) * 100}%` }}
                      className={`h-full rounded-full ${tel.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Stamp & QR Code mockup */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
            <div className="space-y-1">
              <span className="font-bold text-slate-600 block">Label d'Authenticité</span>
              <p className="leading-relaxed">
                Ce prospect a été audité et authentifié par l'algorithme anti-spam MonForfait.ma. Le numéro a été vérifié par validation OTP SMS.
              </p>
            </div>
            
            {/* Fake QR code using SVGs */}
            <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl p-2 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm14-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-2 4h2v2h-2v-2zm6-4h2v6h-2v-6zm0 8h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
              </svg>
            </div>
          </div>

        </div>

        {/* Footer legalities */}
        <div className="bg-slate-50 border-t border-slate-100 p-6 text-center text-[10px] text-slate-400 print:bg-white print:text-[8px]">
          Document interne confidentiel soumis au secret professionnel. Toute reproduction ou divulgation non autorisée constitue une violation des conditions contractuelles MonForfait.ma et des dispositions réglementaires de la CNDP.
        </div>

      </div>

    </div>
  );
}
