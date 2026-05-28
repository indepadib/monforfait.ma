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
  Sparkles, FileText, Share2, Copy, Check, Info, Award,
  PhoneOff, Mic, MicOff, Volume2, RefreshCw
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
  const [audioDuration, setAudioDuration] = useState(5); // default 5s fallback
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Unlocked state (cross-check localStorage)
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(5000);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Call Simulator States
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [callState, setCallState] = useState<'idle' | 'dialing' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [whatsappTone, setWhatsappTone] = useState<'professional' | 'direct' | 'urgent'>('professional');

  // Call simulator timers
  useEffect(() => {
    let timer: any;
    if (callState === 'dialing') {
      timer = setTimeout(() => {
        setCallState('connected');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [callState]);

  useEffect(() => {
    let timer: any;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => {
          if (prev >= 15) {
            setCallState('ended');
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const b2bTranscript = [
    { time: 0, speaker: lead?.first_name || 'Ahmed', text: "Allô, bonjour ? Société Tech Solutions." },
    { time: 3, speaker: 'Yassine (Copilote)', text: "Bonjour, Yassine à l'appareil de LeadCenter. Je vous appelle suite à votre diagnostic fibre." },
    { time: 6, speaker: lead?.first_name || 'Ahmed', text: "Ah oui, super ! On a déménagé nos bureaux et notre connexion ADSL rame trop à Casablanca pour nos 15 collaborateurs." },
    { time: 9, speaker: 'Yassine (Copilote)', text: "Je vois tout à fait. J'ai analysé votre raccordement : vous êtes 100% éligible Fibre Pro chez Orange avec 124 Mbps constatés dans votre rue." },
    { time: 12, speaker: lead?.first_name || 'Ahmed', text: "Génial. Envoyez-moi les détails de l'offre et l'estimation budgétaire par WhatsApp pour signature immédiate !" },
    { time: 15, speaker: 'Yassine (Copilote)', text: "C'est noté, je vous envoie le récapitulatif WhatsApp pré-configuré immédiatement. Merci pour votre temps !" }
  ];

  const b2cTranscript = [
    { time: 0, speaker: lead?.first_name || 'Prospect', text: "Allô, bonjour ?" },
    { time: 3, speaker: 'Yassine (Copilote)', text: "Bonjour, c'est Yassine de MonForfait.ma. Je vous contacte suite à votre speedtest et demande de forfait fibre." },
    { time: 6, speaker: lead?.first_name || 'Prospect', text: "Ah oui ! Je paye trop cher chez Maroc Telecom ADSL actuellement et la connexion se coupe tout le temps." },
    { time: 9, speaker: 'Yassine (Copilote)', text: "Je comprends. Nous avons une offre exclusive Orange Fibre à 249 DH/mois avec installation gratuite et 2 mois offerts. Ça vous convient ?" },
    { time: 12, speaker: lead?.first_name || 'Prospect', text: "C'est parfait ! Envoyez-moi le lien de souscription sur WhatsApp s'il vous plaît, je m'abonne aujourd'hui." },
    { time: 15, speaker: 'Yassine (Copilote)', text: "C'est en cours d'envoi. Un installateur passera sous 48h. Excellente journée !" }
  ];

  const getWhatsappMessage = () => {
    if (!lead) return '';
    const name = lead.first_name || 'Client';
    const company = lead.company_name ? ` pour ${lead.company_name}` : '';
    const city = lead.city || 'votre secteur';
    const budgetVal = lead.budget ?? 249;
    
    if (whatsappTone === 'professional') {
      return `Cher M. ${name},\n\nSuite à notre échange téléphonique concernant votre projet de raccordement Fibre Optique${company} à ${city}, veuillez trouver ci-joint notre proposition commerciale :\n\n- Offre Fibre Pro Débit Max stable\n- Tarif : ${budgetVal} DH / mois\n- Raccordement prioritaire sous 48h\n\nNous restons à votre entière disposition pour finaliser la commande.\n\nCordialement,\nService Commercial B2B`;
    } else if (whatsappTone === 'direct') {
      return `Salut ${name} ! 🙌 Voici le récap de l'offre Fibre Telecom${company} dont nous venons de parler :\n\n⚡ Débit stable Fibre Optique à ${city}\n💸 Budget : ${budgetVal} DH/mois\n🛠️ Installation gratuite sous 48h\n\nCliquez ici pour finaliser votre dossier en 1-clic : https://monforfait.ma/client/validation\n\nA tout de suite !`;
    } else { // urgent
      return `⚠️ OFFRE FLASH - RACCORDEMENT FIBRE ${city.toUpperCase()} ⚠️\n\nBonjour M. ${name},\nVotre secteur est actuellement éligible à notre raccordement express sous 24 heures.\n\n👉 Offre exclusive validée : Forfait Fibre à ${budgetVal} DH/mois avec 2 MOIS OFFERTS !\n🔥 Attention, le créneau d'installation gratuite expire sous 48 heures.\n\nRépondez "OK" pour valider le rendez-vous technicien.`;
    }
  };

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

  const audioUrl = lead?.needs_details?.verification_audio_url || '';

  // Initialize and handle HTML5 Audio element if url is present
  useEffect(() => {
    if (typeof window !== 'undefined' && audioUrl) {
      const audio = new Audio(audioUrl);
      setAudioElement(audio);

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        if (audio.duration) {
          setAudioDuration(audio.duration);
          setAudioProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setAudioProgress(0);
      };

      const handleLoadedMetadata = () => {
        if (audio.duration) setAudioDuration(audio.duration);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audio.pause();
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [audioUrl]);

  // Audio Playback action controller (Supports real sound or fallback simulation)
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(e => {
          console.warn("Real audio autoplay blocked or failed, falling back to simulated playback:", e);
          runSimulation();
        });
      } else {
        audioElement.pause();
      }
      return;
    }

    let interval: any;
    if (isPlaying) {
      runSimulation();
    }
    return () => {
      if (interval) clearInterval(interval);
    };

    function runSimulation() {
      setAudioDuration(5); // mock 5s
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setCurrentTime(0);
            return 0;
          }
          const nextProgress = prev + 2;
          setCurrentTime((nextProgress / 100) * 5);
          return nextProgress;
        });
      }, 100);
    }
  }, [isPlaying, audioElement]);

  const formatAudioTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                  Vérification Téléphonique {audioUrl ? '🔊' : '⚡'}
                </h3>
                <p className="text-[10px] text-slate-500">
                  {audioUrl ? "Enregistrement vocal réel de la qualification client" : "Enregistrement simulé du conseiller MonForfait.ma"}
                </p>
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
                {/* Visual Audio Waveform */}
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
                  <span>{formatAudioTime(currentTime)}</span>
                  <span>{formatAudioTime(audioDuration)}</span>
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
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={`tel:${lead.phone.replace(/\s/g, '')}`} 
                        className="text-sm font-black text-blue-400 hover:underline block"
                      >
                        {lead.phone}
                      </a>
                      <button 
                        onClick={() => {
                          setIsDialerOpen(true);
                          setCallState('dialing');
                          setCallDuration(0);
                        }}
                        className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-tight flex items-center gap-1 shadow transition-all active:scale-95 animate-pulse"
                      >
                        <Phone className="w-2.5 h-2.5" /> Appeler (IA)
                      </button>
                    </div>
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

      {/* Floating Glassmorphic Call Dialer Simulator */}
      {isDialerOpen && (
        <div className="fixed bottom-6 right-6 z-[200] w-[360px] bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-8 duration-300 flex flex-col max-h-[500px]">
          {/* Dialer Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-650 p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white relative">
                <Phone className={`w-5 h-5 ${callState === 'connected' ? 'animate-bounce' : ''}`} />
                {callState === 'connected' && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full animate-ping"></span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none text-white uppercase tracking-wider">Dialer Commercial</h4>
                <span className="text-[10px] text-blue-200 mt-1 block">
                  {callState === 'dialing' && 'Appel en cours...'}
                  {callState === 'connected' && `En communication • 00:${callDuration < 10 ? '0' + callDuration : callDuration}`}
                  {callState === 'ended' && 'Appel terminé'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsDialerOpen(false);
                setCallState('idle');
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>

          {/* Dialer Content */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-950/60 max-h-[380px] text-slate-100">
            {/* 1. DIALING STATE */}
            {callState === 'dialing' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                  <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-blue-400 relative z-10">
                    <Phone className="w-8 h-8 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-sm font-bold text-white">Connexion avec {lead.first_name} {lead.last_name}...</div>
                  <div className="text-xs text-slate-500">{lead.phone}</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* 2. CONNECTED STATE */}
            {callState === 'connected' && (
              <div className="space-y-4 flex flex-col h-full">
                {/* Audio wave simulation */}
                <div className="flex justify-center items-center gap-1.5 py-2">
                  {[...Array(12)].map((_, i) => (
                    <span 
                      key={i} 
                      style={{ height: `${Math.max(4, Math.sin(callDuration * 1.5 + i) * 15 + 20)}px` }}
                      className="w-1 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full transition-all duration-300"
                    />
                  ))}
                </div>

                {/* Transcription screen */}
                <div className="bg-slate-950/90 border border-slate-850 p-3.5 rounded-2xl h-[160px] flex flex-col justify-end">
                  <div className="text-[9px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-850 pb-1.5 mb-1.5">Transcription qualification en direct</div>
                  <div className="space-y-2.5 overflow-y-auto max-h-[120px] pr-1">
                    {(lead.type === 'B2B' ? b2bTranscript : b2cTranscript)
                      .filter(item => callDuration >= item.time)
                      .map((item, idx) => (
                        <div key={idx} className="text-[10px] leading-relaxed">
                          <span className={`font-black ${item.speaker.startsWith('Yassine') ? 'text-blue-400' : 'text-purple-400'}`}>
                            {item.speaker} :
                          </span>{' '}
                          <span className="text-slate-300">{item.text}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Call Options Bar */}
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full border transition-all ${
                      isMuted 
                        ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isMuted ? 'Activer le micro' : 'Couper le micro'}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => setCallState('ended')}
                    className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                    title="Raccrocher"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. ENDED STATE */}
            {callState === 'ended' && (
              <div className="space-y-4">
                {/* AI Review Header */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Rapport Commercial IA
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded">Chaud 🔥</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Sentiment : Très Positif (92% d'intention de commande).</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Résumé de l'appel</div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {lead.type === 'B2B' 
                      ? "Le prospect Ahmed confirme le besoin urgent de Fibre pour sa structure (15 postes). Il souhaite recevoir la proposition par WhatsApp immédiatement."
                      : "Le client est insatisfait de son ADSL Maroc Telecom et valide le forfait Orange Fibre 249 DH/m. Il attend le devis WhatsApp."
                    }
                  </p>
                </div>

                {/* WhatsApp tone message copy-generator */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Rédiger Proposition</span>
                    <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                      {[
                        { val: 'professional', label: 'Pro 💼' },
                        { val: 'direct', label: 'Direct 🚀' },
                        { val: 'urgent', label: 'Urgent ⚠️' }
                      ].map((t) => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => setWhatsappTone(t.val as any)}
                          className={`px-2 py-1 rounded text-[8px] font-black transition-all ${
                            whatsappTone === t.val 
                              ? 'bg-blue-600 text-white' 
                              : 'text-slate-500 hover:text-slate-355'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      readOnly
                      value={getWhatsappMessage()}
                      className="w-full h-32 p-3 bg-slate-950 border border-slate-850 rounded-2xl text-[10px] leading-relaxed text-slate-300 focus:outline-none select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getWhatsappMessage());
                        alert('Proposition copiée ! Prêt à être collée sur WhatsApp.');
                      }}
                      className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[9px] font-black uppercase tracking-tight flex items-center gap-1 shadow-md transition-all active:scale-95"
                    >
                      <Copy className="w-3 h-3" /> Copier
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setCallState('dialing');
                      setCallDuration(0);
                    }}
                    className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Recomposer
                  </button>
                  <button 
                    onClick={() => {
                      setIsDialerOpen(false);
                      setCallState('idle');
                    }}
                    className="flex-grow py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
