'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lead } from '@/types/lead';
import { Printer, ArrowLeft, Building, User, MapPin, Target, CheckCircle2, Phone, Mail, FileText } from 'lucide-react';

// Using mock data. In production, this would be fetched from Supabase.
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
    is_unlocked: true, // Assuming this fiche is generated for a sold/unlocked lead or as a teaser
    unlock_price: 450,
  }
};

export default function FicheClientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;
  const [lead, setLead] = React.useState<Lead | null>(MOCK_LEADS[leadId] || null);
  const [isLoading, setIsLoading] = React.useState(!MOCK_LEADS[leadId]);

  React.useEffect(() => {
    async function fetchRealLead() {
      if (!MOCK_LEADS[leadId]) {
        try {
          const { supabase } = await import('@/lib/supabaseClient');
          const { data, error } = await supabase.from('leads').select('*').eq('id', leadId).single();
          if (data) {
            const realLead: Lead = {
              id: data.id,
              created_at: data.created_at,
              type: data.is_pro ? 'B2B' : 'B2C',
              first_name: data.first_name || data.user_name || 'Prospect',
              last_name: data.last_name || '',
              phone: data.user_phone || '',
              email: data.user_email || data.email || '',
              city: data.city || 'Non spécifiée',
              company_name: data.is_pro ? 'Entreprise Cliente' : undefined,
              company_size: 'Inconnu',
              budget: 0,
              score: 50,
              temperature: 'warm',
              status: 'new',
              is_unlocked: true, // Auto unlocked for Fiche
              unlock_price: data.is_pro ? 300 : 100,
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
    return <div className="p-10 text-center text-slate-500">Génération de la fiche en cours...</div>;
  }

  if (!lead) return notFound();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      
      {/* Non-printable controls */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden px-4">
        <Link href={`/operateurs/dashboard/leads/${lead.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour au profil
        </Link>
        <button 
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Printer className="w-4 h-4" /> Générer PDF / Imprimer
        </button>
      </div>

      {/* Printable Area */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl print:shadow-none print:w-full print:max-w-none overflow-hidden">
        
        {/* Header - Brand */}
        <div className="bg-blue-600 text-white p-8 flex justify-between items-center print:bg-blue-600 print:-webkit-print-color-adjust-exact">
          <div>
            <h1 className="text-3xl font-black tracking-tight">MonForfait<span className="text-blue-200">.ma</span></h1>
            <p className="text-blue-100 font-medium tracking-widest uppercase text-xs mt-1">Fiche Prospect Qualifié</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Réf. Dossier</p>
            <p className="text-xl font-bold font-mono">{lead.id}</p>
            <p className="text-xs text-blue-200 mt-1">{new Date(lead.created_at).toLocaleDateString('fr-FR')} - {new Date(lead.created_at).toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="flex gap-6">
            <div className="flex-1 space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {lead.type === 'B2B' ? lead.company_name : `${lead.first_name} ${lead.last_name}`}
              </h2>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" /> {lead.city} 
                <span className="text-slate-300">|</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${lead.type === 'B2B' ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-800'} print:-webkit-print-color-adjust-exact`}>
                  Profil {lead.type === 'B2B' ? 'Premium B2B' : 'Particulier'}
                </span>
              </div>
            </div>
            <div className="text-right p-4 bg-slate-50 rounded-xl border border-slate-100 shrink-0 min-w-[150px]">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Score Qualité</p>
              <p className="text-3xl font-black text-blue-600">{lead.score}<span className="text-lg text-slate-400">/100</span></p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-8">
            
            {/* Left Col: Project */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <Target className="w-4 h-4" /> Projet & Budget
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Budget estimé</span>
                    <span className="font-bold text-slate-900">{lead.budget ? `${lead.budget} DH/mois` : 'Non défini'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Intention d'achat</span>
                    <span className="font-bold text-slate-900 capitalize">{lead.intent_timeline?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Éligibilité Fibre</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      {lead.fiber_eligible ? <><CheckCircle2 className="w-4 h-4" /> Confirmée</> : 'Non confirmée'}
                    </span>
                  </div>
                </div>
              </div>

              {lead.needs && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                    <FileText className="w-4 h-4" /> Besoins exprimés
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                    {lead.needs.map((need, i) => (
                      <li key={i}>{need}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Col: Contact (Protected) */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                <User className="w-4 h-4" /> Coordonnées Client
              </h3>
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Nom Complet</p>
                  <p className="font-bold text-slate-900 text-lg">{lead.first_name} {lead.last_name}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Téléphone Vérifié</p>
                    <p className="font-bold text-blue-600 text-lg">{lead.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Email Personnel</p>
                    <p className="font-medium text-slate-900">{lead.email}</p>
                  </div>
                </div>

                {lead.type === 'B2B' && (
                  <div className="pt-4 border-t border-slate-200 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      <p className="text-xs text-slate-500 uppercase font-semibold">Informations Société</p>
                    </div>
                    <p className="font-bold text-slate-900">{lead.company_name}</p>
                    <p className="text-sm text-slate-600 mt-0.5">Secteur: {lead.industry}</p>
                    <p className="text-sm text-slate-600">Effectif: {lead.company_size} employés</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 p-6 text-center text-xs text-slate-400 border-t border-slate-100 print:bg-white">
          <p>Document confidentiel généré par la plateforme MonForfait.ma. Ces informations sont strictement personnelles et destinées à un usage commercial exclusif par l'opérateur agréé.</p>
        </div>

      </div>
    </div>
  );
}
