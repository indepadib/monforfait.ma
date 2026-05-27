'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, Bell, Zap, Shield, Save, Check,
  Sliders, Mail, PhoneCall, MapPin, Building 
} from 'lucide-react';

interface CampaignSettings {
  autoPilotEnabled: boolean;
  maxMonthlyBudget: number;
  leadType: 'ALL' | 'B2B' | 'B2C';
  minScore: number;
  cities: string[];
  alertEmail: boolean;
  alertWhatsApp: boolean;
}

export default function OperatorSettingsPage() {
  const [settings, setSettings] = useState<CampaignSettings>({
    autoPilotEnabled: false,
    maxMonthlyBudget: 2000,
    leadType: 'ALL',
    minScore: 70,
    cities: ['Casablanca', 'Rabat'],
    alertEmail: true,
    alertWhatsApp: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('operator_campaign_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('operator_campaign_settings', JSON.stringify(settings));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const handleCityToggle = (city: string) => {
    const newCities = settings.cities.includes(city)
      ? settings.cities.filter(c => c !== city)
      : [...settings.cities, city];
    setSettings({ ...settings, cities: newCities });
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Configuration Auto-Pilote & Alertes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Configurez les critères de ciblage pour réclamer automatiquement les meilleurs prospects dès leur soumission.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <>Enregistrement...</>
          ) : (
            <>
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saveSuccess ? 'Enregistré !' : 'Sauvegarder les règles'}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Auto-pilot Campaign settings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Autopilot Banner */}
          <div className={`p-6 rounded-3xl border transition-all ${
            settings.autoPilotEnabled 
              ? 'bg-blue-600/10 border-blue-500/30' 
              : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  settings.autoPilotEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-zinc-800 dark:text-slate-400'
                }`}>
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Auto-Pilote de Réclamation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Débloquez instantanément les prospects qui répondent strictement à vos critères de ciblage ci-dessous sans action manuelle.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  checked={settings.autoPilotEnabled} 
                  onChange={(e) => setSettings({ ...settings, autoPilotEnabled: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Filtering Criteria */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-slate-400" /> Critères de ciblage
            </h3>

            {/* Lead Type */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Segment Cible</label>
              <div className="flex bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl w-fit">
                {[
                  { value: 'ALL', label: 'Tous les leads' },
                  { value: 'B2B', label: 'B2B Pro uniquement' },
                  { value: 'B2C', label: 'B2C Particuliers uniquement' }
                ].map((opt) => (
                  <button 
                    key={opt.value}
                    type="button"
                    onClick={() => setSettings({ ...settings, leadType: opt.value as any })}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      settings.leadType === opt.value 
                        ? 'bg-white dark:bg-zinc-800 shadow-sm text-slate-900 dark:text-white' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score Télécom Minimum</label>
                <span className="text-sm font-black text-blue-600">{settings.minScore} / 100</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="95" 
                value={settings.minScore}
                onChange={(e) => setSettings({ ...settings, minScore: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 dark:bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Seuls les prospects ayant un score de qualification supérieur ou égal seront ciblés.</span>
            </div>

            {/* Monthly Budget cap */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Budget maximum par lead acheté</label>
              <div className="relative max-w-[200px]">
                <input 
                  type="number" 
                  value={settings.maxMonthlyBudget}
                  onChange={(e) => setSettings({ ...settings, maxMonthlyBudget: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">DH</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">Limite le coût d'achat unitaire pour les leads exclusifs à forte valeur ajoutée.</span>
            </div>

            {/* Cities Multi-select */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Villes Ciblées</label>
              <div className="flex flex-wrap gap-2">
                {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'].map((city) => {
                  const active = settings.cities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCityToggle(city)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        active 
                          ? 'border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-900/10' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications & Security */}
        <div className="space-y-8">
          
          {/* Notification Preferences */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-400" /> Alertes en temps réel
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <span className="text-sm font-bold block text-slate-900 dark:text-white">Alertes Emails</span>
                    <span className="text-[10px] text-slate-500">Flux quotidien des nouveaux leads</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.alertEmail} 
                    onChange={(e) => setSettings({ ...settings, alertEmail: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-slate-400" />
                  <div>
                    <span className="text-sm font-bold block text-slate-900 dark:text-white">WhatsApp Direct</span>
                    <span className="text-[10px] text-slate-500">Notifications instantanées (prospects très chauds)</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.alertWhatsApp} 
                    onChange={(e) => setSettings({ ...settings, alertWhatsApp: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-950 dark:text-white flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-emerald-500" /> Règle RLS & Sécurité
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              En tant qu'opérateur agréé, vous devez vous conformer aux exigences de la CNDP sur la protection des données personnelles au Maroc. Il est strictement interdit de revendre ou partager les coordonnées débloquées sur cette plateforme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
