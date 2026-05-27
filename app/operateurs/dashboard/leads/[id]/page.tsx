'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lead } from '@/types/lead';
import { LeadScoreBadge } from '@/components/operateurs/LeadScoreBadge';
import { UnlockLeadModal } from '@/components/operateurs/UnlockLeadModal';
import { 
  ArrowLeft, Building, User, MapPin, Calendar, Lock, Unlock, 
  Phone, Mail, CheckCircle2, ShieldAlert, CreditCard, Play, Pause,
  Sparkles, FileText, Share2, Copy, Check, Info, Award
} from 'lucide-react';

const MOCK_LEADS: Record<string, Lead> = {
  'L-1001': {
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
    industry: 'IT & Software',
    budget: 600,
    intent_timeline: 'immédiat',
    fiber_eligible: true,
    needs: ['Fibre Optique Pro 100M', 'Flotte Mobile (5 lignes)'],
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
  
  const [lead, setLead] = useState<Lead | null>(MOCK_LEADS[leadId] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!MOCK_LEADS[leadId]);
  
  // Audio Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Unlocked state (cross-check localStorage)
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(5000);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load local storage keys
  useEffect(() => {
    const savedUnlocks = localStorage.getItem('operator_unlocked_leads');
    const unlocks: string[] = savedUnlocks ? JSON.parse(savedUnlocks) : [];
    setUnlockedIds(unlocks);

    const savedBalance = localStorage.getItem('operator_wallet_balance');
    if (savedBalance) setWalletBalance(parseFloat(savedBalance));
  }, []);

  // Fetch real leads from Supabase if not in mock
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
              company_name: data.is_pro ? 'Entreprise Marocaine' : undefined,
              company_size: '5-20',
              industry: 'Services',
              budget: data.is_pro ? 450 : 249,
              intent_timeline: data.needs_details?.installation_timing || 'immédiat',
              fiber_eligible: data.needs_details?.preferred_operator ? true : false,
              score: data.is_pro ? 85 : hasSpeedtest ? 65 : 45,
              temperature: data.is_pro ? 'hot' : hasSpeedtest ? 'warm' : 'cold',
              status: 'new',
              is_unlocked: false,
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

  // Audio Playback simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500 bg-slate-950 min-h-screen">Chargement du prospect...</div>;
  }

  if (!lead) {
    return notFound();
  }

  const isActuallyUnlocked = unlockedIds.includes(lead.id) || lead.is_unlocked;

  const handleUnlock = () => {
    const price = lead.unlock_price;
    if (walletBalance < price) {
      alert("Solde insuffisant ! Veuillez recharger votre portefeuille.");
      setIsModalOpen(false);
      return;
    }

    const newBalance = walletBalance - price;
    const newUnlocks = [...unlockedIds, lead.id];

    localStorage.setItem('operator_wallet_balance', newBalance.toString());
    localStorage.setItem('operator_unlocked_leads', JSON.stringify(newUnlocks));
    
    setWalletBalance(newBalance);
    setUnlockedIds(newUnlocks);
    setIsModalOpen(false);
    
    // Confetti effect
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);

    // Dispatch balance updated event
    window.dispatchEvent(new Event('balance_updated'));
  };

  // Neighborhood Speed test benchmark mock details
  const neighborhoodName = lead.city === 'Casablanca' ? 'El Maârif' : lead.city === 'Rabat' ? 'Agdal' : 'Centre Ville';
  
  // Custom AI Pitch generator
  const leadBudget = lead.budget ?? 249;
  const generatedPitch = `Bonjour ${lead.first_name}, je suis conseiller commercial chez Orange. Je vous appelle suite à votre diagnostic réseau sur MonForfait.ma à ${lead.city} (${neighborhoodName}). J'ai vu que vous cherchez une éligibilité Fibre pour un budget de ${leadBudget} DH/mois avec un délai ${lead.intent_timeline?.replace(/_/g, ' ') || 'immédiat'}. Nos voisins dans votre quartier de ${neighborhoodName} profitent de notre Fibre 100 Mbps stable. Nous pouvons vous raccorder dès cette semaine pour seulement ${leadBudget - 50} DH/mois. Ça vous intéresse ?`;

  const copyPitch = () => {
    navigator.clipboard.writeText(generatedPitch);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 text-slate-100 bg-slate-950 relative min-h-screen">
      
      {/* Confetti Particle Effect */}
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="text-center bg-slate-900/90 border border-emerald-500/30 p-8 rounded-3xl backdrop-blur shadow-2xl animate-in zoom-in duration-300">
            <span className="text-5xl block mb-2">🎉</span>
            <h3 className="text-xl font-bold text-white">Lead Débloqué avec Succès !</h3>
            <p className="text-xs text-slate-400 mt-1">Les coordonnées complètes sont désormais visibles.</p>
          </div>
        </div>
      )}

      {/* Back button */}
      <Link href="/operateurs/dashboard/leads" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors">
        ← Retour à la marketplace
      </Link>

      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/20 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              lead.type === 'B2B' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'
            }`}>
              {lead.type === 'B2B' ? <Building className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-white capitalize">
                  {lead.type === 'B2B' ? (lead.company_name || 'Entreprise Cliente') : `${lead.first_name} ${isActuallyUnlocked ? lead.last_name : lead.last_name.substring(0, 1) + '.'}`}
                </h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  lead.type === 'B2B' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {lead.type}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {lead.city} ({neighborhoodName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Score Qualité</span>
              <LeadScoreBadge score={lead.score} temperature={lead.temperature} />
            </div>
          </div>
        </div>

        {/* Transaction Header Banner */}
        <div className={`p-5 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 ${
          isActuallyUnlocked ? 'bg-emerald-500/5' : 'bg-slate-900/50'
        }`}>
          <div className="flex items-center gap-3">
            {isActuallyUnlocked ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Prospect Débloqué</h3>
                  <p className="text-xs text-slate-400">Vous avez un accès complet aux données de ce lead.</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Coordonnées Masquées</h3>
                  <p className="text-xs text-slate-400">Débloquez ce prospect pour obtenir les numéros et emails vérifiés.</p>
                </div>
              </>
            )}
          </div>

          {!isActuallyUnlocked && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              Débloquer ({lead.unlock_price} DH)
            </button>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Audio Verification simulated player */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  Vérification Téléphonique
                </h3>
                <p className="text-[10px] text-slate-500">Enregistrement audio du conseiller MonForfait.ma</p>
              </div>
              <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Vérifié le {new Date(lead.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>

            {/* Audio Wave player */}
            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              
              <div className="flex-1 space-y-1">
                {/* Fake audio waveform */}
                <div className="h-8 flex items-end gap-1 px-2">
                  {[12, 28, 16, 42, 32, 20, 48, 12, 24, 38, 28, 16, 42, 35, 12, 26, 49, 12, 32, 24].map((h, i) => {
                    const isActive = audioProgress > (i * 5);
                    return (
                      <span 
                        key={i} 
                        style={{ height: `${h}%` }} 
                        className={`flex-1 rounded-full transition-colors ${
                          isActive 
                            ? 'bg-blue-500' 
                            : 'bg-slate-800'
                        } ${isPlaying && isActive ? 'animate-pulse' : ''}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                  <span>0:0{Math.round(audioProgress / 20)}</span>
                  <span>0:05</span>
                </div>
              </div>
            </div>
          </div>

          {/* Neighborhood telecom benchmark */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Benchmark Réseau - Quartier {neighborhoodName}
              </h3>
              <p className="text-[10px] text-slate-500">Débits moyens réels basés sur les 50 derniers tests de vitesse à proximité.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Orange Fibre', download: '124 Mbps', ping: '12 ms', score: 'Excellent', color: 'border-orange-500/20 bg-orange-950/5 text-orange-400' },
                { name: 'Inwi Fibre', download: '84 Mbps', ping: '19 ms', score: 'Bon', color: 'border-purple-500/20 bg-purple-950/5 text-purple-400' },
                { name: 'IAM ADSL', download: '12 Mbps', ping: '42 ms', score: 'Faible', color: 'border-blue-500/20 bg-blue-950/5 text-blue-400' }
              ].map((bench, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${bench.color} space-y-2`}>
                  <div className="text-xs font-bold text-white">{bench.name}</div>
                  <div className="text-xl font-black text-white">{bench.download}</div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Ping: {bench.ping}</span>
                    <span className="font-bold text-slate-300">{bench.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Generated Pitch / Script */}
          {isActuallyUnlocked && (
            <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Script de Vente Personnalisé (Pitch Commercial)
                </h3>
                <button 
                  onClick={copyPitch}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Copié !' : 'Copier le script'}
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-xs font-medium leading-relaxed text-slate-300 relative">
                <span className="absolute top-2 left-2 text-[10px] uppercase font-black tracking-widest text-slate-700">Argumentaire IA</span>
                <p className="pt-4">{generatedPitch}</p>
              </div>
            </div>
          )}

          {/* Customer project details */}
          <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Projet & Besoins Détaillés</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Budget Mensuel Estimé</span>
                <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">{lead.budget ? `${lead.budget} DH / mois` : 'Non renseigné'}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Horizon d'installation</span>
                <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block capitalize">{lead.intent_timeline?.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {lead.needs && lead.needs.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 block mb-2">Besoins spécifiques exprimés :</span>
                <div className="flex flex-wrap gap-2">
                  {lead.needs.map((need, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-200/50 dark:border-slate-700/50">
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Protected Contact Info */}
        <div className="space-y-8">
          
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Coordonnées Prospect
            </h3>

            <div className="space-y-4">
              
              {/* Phone number */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0 text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Numéro de Téléphone</span>
                  {isActuallyUnlocked ? (
                    <a 
                      href={`tel:${lead.phone.replace(/\s/g, '')}`} 
                      className="text-sm font-black text-blue-400 hover:underline block mt-0.5"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-sm font-mono font-bold text-slate-300 block mt-0.5 tracking-wider">
                      {lead.phone.substring(0, 5)} ** ** **
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Adresse Email</span>
                  {isActuallyUnlocked ? (
                    <a 
                      href={`mailto:${lead.email}`} 
                      className="text-sm font-black text-blue-400 hover:underline block mt-0.5 truncate max-w-[200px]"
                    >
                      {lead.email}
                    </a>
                  ) : (
                    <span className="text-xs italic text-slate-500 block mt-1">
                      Débloquer pour afficher
                    </span>
                  )}
                </div>
              </div>

              {/* B2B specific company metrics */}
              {lead.type === 'B2B' && (
                <div className="pt-4 border-t border-slate-800/80 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0 text-slate-400">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Société</span>
                      <span className="text-xs font-bold text-slate-200 block mt-0.5">{lead.company_name || 'N/A'}</span>
                      <span className="text-[10px] text-slate-500 block">Secteur: {lead.industry || 'Inconnu'} ({lead.company_size || 'N/A'} employés)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Unlocking actions */}
            {!isActuallyUnlocked && (
              <div className="p-4 bg-amber-950/20 border border-amber-500/25 rounded-2xl text-amber-300 text-xs leading-relaxed flex gap-2">
                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  Les coordonnées de contact sont sécurisées. Pour initier le démarchage, veuillez débloquer cette fiche commerciale.
                </p>
              </div>
            )}

            {isActuallyUnlocked && (
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <Link 
                  href={`/operateurs/dashboard/leads/${lead.id}/fiche`}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700/50"
                >
                  <FileText className="w-4 h-4" />
                  Générer Fiche PDF Imprimable
                </Link>
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
