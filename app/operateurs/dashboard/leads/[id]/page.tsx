'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lead } from '@/types/lead';
import { LeadScoreBadge } from '@/components/operateurs/LeadScoreBadge';
import { UnlockLeadModal } from '@/components/operateurs/UnlockLeadModal';
import { 
  ArrowLeft, Building, User, MapPin, Calendar, Lock, Unlock, 
  Phone, Mail, CheckCircle2, ShieldAlert, CreditCard
} from 'lucide-react';

// Using the same mock data for consistency
const MOCK_LEADS: Record<string, Lead> = {
  'L-1001': {
    id: 'L-1001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'B2B',
    first_name: 'Ahmed',
    last_name: 'B.',
    phone: '06 61 45 89 22', // Hidden in UI if locked
    email: 'contact@techsolutions.ma', // Hidden in UI if locked
    city: 'Casablanca',
    company_name: 'Tech Solutions SARL',
    company_size: '10-50',
    industry: 'IT & Software',
    budget: 600,
    intent_timeline: 'immédiat',
    fiber_eligible: true,
    needs: ['Fibre Optique Pro', 'Flotte Mobile (5 lignes)'],
    score: 85,
    temperature: 'hot',
    status: 'new',
    is_unlocked: false,
    unlock_price: 450,
  }
};

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;
  
  // State for mocked unlocking process
  const [lead, setLead] = useState<Lead | null>(MOCK_LEADS[leadId] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!lead) {
    return notFound();
  }

  const handleUnlock = () => {
    // Simulate API call to unlock lead
    setTimeout(() => {
      setLead({ ...lead, is_unlocked: true, status: 'contacted' });
      setIsModalOpen(false);
    }, 800);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      
      {/* Back navigation */}
      <Link href="/operateurs/dashboard/leads" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la marketplace
      </Link>

      {/* Header Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 text-white">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${lead.type === 'B2B' ? 'bg-white/10' : 'bg-blue-600'}`}>
              {lead.type === 'B2B' ? <Building className="w-7 h-7" /> : <User className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {lead.type === 'B2B' ? lead.company_name : `${lead.first_name} ${lead.last_name}`}
                </h1>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${lead.type === 'B2B' ? 'bg-slate-700 text-slate-300' : 'bg-blue-900 text-blue-200'}`}>
                  {lead.type}
                </span>
              </div>
              <p className="text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {lead.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-slate-400 text-sm mb-1">Score de qualification</p>
              <LeadScoreBadge score={lead.score} temperature={lead.temperature} />
            </div>
          </div>
        </div>

        {/* Action Bar (Lock/Unlock State) */}
        <div className={`p-4 border-b ${lead.is_unlocked ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'} flex flex-col sm:flex-row justify-between items-center gap-4`}>
          <div className="flex items-center gap-3">
            {lead.is_unlocked ? (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900">Prospect Débloqué</h3>
                  <p className="text-sm text-emerald-700">Vous avez un accès complet aux coordonnées.</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Coordonnées masquées</h3>
                  <p className="text-sm text-slate-500">Débloquez ce prospect pour le contacter.</p>
                </div>
              </>
            )}
          </div>

          {!lead.is_unlocked && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Débloquer ({lead.unlock_price} DH)
            </button>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Needs & Qualification */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Projet & Besoins</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Budget estimé</p>
                  <p className="font-semibold text-slate-900 text-lg">{lead.budget ? `${lead.budget} DH / mois` : 'Non précisé'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Horizon de décision</p>
                  <p className="font-semibold text-slate-900 capitalize">{lead.intent_timeline?.replace(/_/g, ' ')}</p>
                </div>
                
                {lead.needs && lead.needs.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Besoins spécifiques</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.needs.map((need, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Éligibilité & Technique</h3>
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <div>
                  <p className="font-semibold">Test d'éligibilité effectué</p>
                  <p className="text-sm opacity-90">{lead.fiber_eligible ? 'Éligible à la Fibre Optique' : 'ADSL ou 4G/5G Box recommandée'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Coordonnées</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Téléphone</p>
                    {lead.is_unlocked ? (
                      <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="font-semibold text-blue-600 text-lg hover:underline">{lead.phone}</a>
                    ) : (
                      <p className="font-mono text-lg font-semibold text-slate-900 tracking-widest">{lead.phone.substring(0, 5)} ** ** **</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Email</p>
                    {lead.is_unlocked ? (
                      <a href={`mailto:${lead.email}`} className="font-semibold text-blue-600 hover:underline">{lead.email}</a>
                    ) : (
                      <p className="text-slate-400 italic">Débloquer pour voir l'email</p>
                    )}
                  </div>
                </div>

                {lead.type === 'B2B' && (
                  <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Informations Entreprise</p>
                      <p className="font-semibold text-slate-900">{lead.company_name}</p>
                      <p className="text-sm text-slate-600 mt-1">Secteur: {lead.industry}</p>
                      <p className="text-sm text-slate-600">Taille: {lead.company_size} employés</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!lead.is_unlocked && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm">
                  Les coordonnées complètes sont masquées. <button onClick={() => setIsModalOpen(true)} className="font-semibold underline hover:text-amber-900">Débloquez ce prospect</button> pour accéder au numéro de téléphone et à l'adresse email.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      <UnlockLeadModal 
        lead={lead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleUnlock}
      />

    </div>
  );
}
