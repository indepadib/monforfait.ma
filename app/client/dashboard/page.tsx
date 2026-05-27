'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, AlertCircle, ChevronRight, 
  ShieldCheck, Search, Phone, User, MapPin, Sparkles, Send 
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ClientLead {
  id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  city: string;
  status: string;
  is_pro: boolean;
  needs_details: any;
}

export default function ClientDashboardPage() {
  const [searchPhone, setSearchPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundLead, setFoundLead] = useState<ClientLead | null>(null);
  const [searched, setSearched] = useState(false);

  // Quick form states if no lead found
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [needs, setNeeds] = useState('fibre');
  const [budget, setBudget] = useState(249);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone) return;

    setIsLoading(true);
    setSearched(true);
    try {
      // Find lead by phone or name
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .or(`user_phone.eq.${searchPhone},user_name.ilike.%${searchPhone}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setFoundLead(data[0] as ClientLead);
      } else {
        setFoundLead(null);
      }
    } catch (e) {
      console.warn(e);
      setFoundLead(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Basic Moroccan phone validation
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^(05|06|07)\d{8}$/.test(cleanPhone)) {
      alert("Numéro de téléphone invalide. Doit commencer par 05, 06 ou 07 suivi de 8 chiffres.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        user_name: name,
        user_phone: cleanPhone,
        user_email: email,
        city: city,
        status: 'new_qualified',
        is_pro: false,
        needs_details: {
          installation_timing: 'asap',
          preferred_operator: 'orange',
          budget: budget,
          needs: [needs === 'fibre' ? 'Fibre Optique Particulier' : 'Forfait Mobile'],
          captured_at: new Date().toISOString(),
          source: 'client_portal_wizard'
        }
      };

      const { data, error } = await supabase.from('leads').insert(payload).select();
      if (!error && data && data.length > 0) {
        setFoundLead(data[0] as ClientLead);
        setFormSuccess(true);
      } else {
        alert("Erreur lors de l'enregistrement de votre demande. Réessayez.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFormLoading(false);
    }
  };

  // Determine Stepper Stage
  const getProgressStage = (status: string) => {
    if (status === 'converted') return 4; // Complete
    if (status === 'contacted' || status === 'qualified') return 3; // Connected
    if (status === 'new' || status === 'new_qualified' || status === 'new_pro') return 2; // Analysis
    return 1; // Received
  };

  const currentStage = foundLead ? getProgressStage(foundLead.status) : 2;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300 px-4 py-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
          Portail de Suivi Client
        </h1>
        <p className="text-zinc-500 mt-2 text-sm">
          Vérifiez l'état d'éligibilité de votre raccordement et comparez les propositions négociées pour vous.
        </p>
      </div>

      {/* Lookup search bar */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">Rechercher mon dossier</h3>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Saisissez votre numéro de téléphone (ex: 0661458922) ou votre Nom..." 
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>
      </div>

      {/* Search results rendering */}
      {searched && (
        isLoading ? (
          <div className="text-center py-10 text-zinc-500 font-bold">Recherche de votre dossier dans la base...</div>
        ) : foundLead ? (
          <div className="space-y-8">
            
            {/* Live Status Alert */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 text-blue-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-blue-900 dark:text-blue-100">
                    {foundLead.status === 'converted' ? 'Félicitations, raccordement activé !' : 'Analyse commerciale en cours'}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-1 leading-relaxed">
                    Dossier de {foundLead.user_name} ({foundLead.city}) enregistré. Nos partenaires télécom (Orange, Inwi, Maroc Telecom) étudient actuellement votre éligibilité Fibre pour un budget de {foundLead.needs_details?.budget || 249} DH/mois.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Avancement de votre dossier</h3>
              
              <div className="relative pl-6 sm:pl-0 sm:flex justify-between items-start gap-4">
                {/* Desktop progress bar */}
                <div className="hidden sm:block absolute top-4 left-4 right-4 h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-0"></div>
                <div 
                  className="hidden sm:block absolute top-4 left-4 h-0.5 bg-emerald-500 -z-0 transition-all duration-500"
                  style={{ width: `${(Math.min(currentStage - 1, 3) / 3) * 100}%` }}
                ></div>

                {/* Vertical line for mobile */}
                <div className="sm:hidden absolute left-4 top-4 bottom-4 w-0.5 bg-zinc-100 dark:bg-zinc-800"></div>

                {[
                  { step: 1, label: 'Demande Reçue', desc: 'Vos besoins ont été enregistrés.' },
                  { step: 2, label: 'Analyse Éligibilité', desc: 'Diagnostic technique de la ligne.' },
                  { step: 3, label: 'Proposition Envoyée', desc: 'Mise en relation avec un conseiller.' },
                  { step: 4, label: 'Service Activé', desc: 'Votre Fibre est fonctionnelle.' }
                ].map((s) => {
                  const done = currentStage >= s.step;
                  const active = currentStage === s.step;
                  return (
                    <div key={s.step} className="flex sm:flex-col items-start gap-4 sm:gap-2 sm:text-center relative z-10 py-3 sm:py-0 sm:flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ring-4 ring-white dark:ring-zinc-900 ${
                        done 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800'
                      }`}>
                        {done ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{s.step}</span>}
                      </div>
                      <div className="text-left sm:text-center">
                        <span className={`text-sm font-bold block ${active ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-white'}`}>{s.label}</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">{s.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Friendly Alert */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-xs font-semibold">
                Aucun dossier actif n'a été trouvé avec ce numéro. Si vous venez de vous inscrire, cela peut prendre quelques minutes. Sinon, lancez un diagnostic ci-dessous.
              </span>
            </div>

            {/* Quick Capture Form Wizard */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-950 dark:text-white">Diagnostic Fibre & Mobile Gratuit</h3>
                  <p className="text-xs text-zinc-500">Remplissez le formulaire en 30 secondes pour recevoir des offres.</p>
                </div>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Nom Complet</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Votre nom et prénom..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-zinc-900 dark:text-white"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">N° Téléphone Mobile</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: 0661458922..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-zinc-900 dark:text-white"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Adresse Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="client@domaine.com..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-zinc-900 dark:text-white"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Ville</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-zinc-900 dark:text-white"
                    >
                      <option value="Casablanca">Casablanca</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Tanger">Tanger</option>
                      <option value="Fès">Fès</option>
                      <option value="Agadir">Agadir</option>
                    </select>
                  </div>

                  {/* Needs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Besoin principal</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-zinc-800 dark:text-zinc-200">
                        <input type="radio" name="need" checked={needs === 'fibre'} onChange={() => setNeeds('fibre')} className="accent-blue-600" />
                        Fibre Optique
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-zinc-800 dark:text-zinc-200">
                        <input type="radio" name="need" checked={needs === 'mobile'} onChange={() => setNeeds('mobile')} className="accent-blue-600" />
                        Forfait Mobile
                      </label>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Budget maximum mensuel</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-zinc-900 dark:text-white"
                    >
                      <option value="150">Moins de 200 DH / mois</option>
                      <option value="249">200 à 350 DH / mois</option>
                      <option value="499">350 à 600 DH / mois</option>
                      <option value="799">Plus de 600 DH / mois</option>
                    </select>
                  </div>

                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {formLoading ? 'Enregistrement...' : 'Lancer mon diagnostic éligibilité'}
                </button>
              </form>
            </div>
          </div>
        )
      )}

      {/* Security note */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Vos données sont sécurisées</h4>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            MonForfait.ma crypte toutes les communications. Vos données de contact ne seront transmises qu'aux conseillers officiels Orange/Inwi/IAM agréés de votre secteur géographique pour finaliser votre raccordement.
          </p>
        </div>
      </div>

    </div>
  );
}
