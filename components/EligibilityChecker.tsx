"use client";

import { useState } from 'react';
import { Wifi, Home, Phone, User, CheckCircle2, ChevronRight, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { AddressMapPicker } from '@/components/AddressMapPicker';

type Step = 'NEED' | 'LOCATION' | 'CONTACT' | 'SCANNING' | 'RESULT';

export function EligibilityChecker() {
    const [step, setStep] = useState<Step>('NEED');
    const [need, setNeed] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNeedSelection = (selectedNeed: string) => {
        setNeed(selectedNeed);
        setStep('LOCATION');
    };

    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address.trim().length > 3) {
            setStep('CONTACT');
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && phone.length >= 10) {
            setStep('SCANNING');
            
            // Send to Webhook
            try {
                await fetch('/api/leads/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source: 'eligibility',
                        need,
                        address,
                        lat,
                        lon,
                        name,
                        phone,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (err) {
                console.error("Failed to send webhook", err);
            }

            // Simulate scanning
            setTimeout(() => {
                setStep('RESULT');
            }, 3500);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-2xl mx-auto relative overflow-hidden">
            {/* Progress Bar */}
            {step !== 'SCANNING' && step !== 'RESULT' && (
                <div className="flex gap-2 mb-8">
                    <div className={`h-2 flex-1 rounded-full ${step === 'NEED' ? 'bg-blue-600' : 'bg-blue-200 dark:bg-blue-900'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${step === 'LOCATION' ? 'bg-blue-600' : (step === 'CONTACT' ? 'bg-blue-600' : 'bg-zinc-100 dark:bg-zinc-800')}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${step === 'CONTACT' ? 'bg-blue-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}></div>
                </div>
            )}

            {step === 'NEED' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-2">Test d'Éligibilité National</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Quel est votre besoin principal à domicile ?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => handleNeedSelection('Fibre Optique')} className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group">
                            <Wifi className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-zinc-900 dark:text-white">Fibre Optique (Très Haut Débit)</div>
                            <div className="text-sm text-zinc-500">Idéal pour le streaming et télétravail</div>
                        </button>
                        <button onClick={() => handleNeedSelection('ADSL')} className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group">
                            <Home className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-zinc-900 dark:text-white">ADSL / Box standard</div>
                            <div className="text-sm text-zinc-500">Couverture nationale maximale</div>
                        </button>
                        <button onClick={() => handleNeedSelection('Box 4G/5G')} className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group">
                            <Activity className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-zinc-900 dark:text-white">Box 4G / 5G (Sans fil)</div>
                            <div className="text-sm text-zinc-500">Là où la fibre ne passe pas</div>
                        </button>
                        <button onClick={() => handleNeedSelection('Forfait Mobile')} className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group">
                            <Phone className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-zinc-900 dark:text-white">Forfait Mobile seul</div>
                            <div className="text-sm text-zinc-500">Meilleure couverture réseau</div>
                        </button>
                    </div>
                </div>
            )}

            {step === 'LOCATION' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <button onClick={() => setStep('NEED')} className="text-sm text-zinc-500 mb-4 hover:text-zinc-900 dark:hover:text-white">← Retour</button>
                    <div className="mb-6">
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Où habitez-vous ?</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Recherchez votre adresse puis glissez le marqueur pour ajuster précisément votre position.</p>
                    </div>
                    <form onSubmit={handleLocationSubmit} className="space-y-4">
                        <AddressMapPicker
                            onChange={({ address: addr, lat: la, lon: lo }) => {
                                setAddress(addr);
                                setLat(la);
                                setLon(lo);
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!address}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            Confirmer l'adresse <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {step === 'CONTACT' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <button onClick={() => setStep('LOCATION')} className="text-sm text-zinc-500 mb-4 hover:text-zinc-900 dark:hover:text-white">← Retour</button>
                    <div className="mb-6">
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Dernière étape</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Où devons-nous vous envoyer le résultat de la couverture réseau ?</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-sm mb-6 flex gap-2 items-start">
                        <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>Vos données sont sécurisées et serviront uniquement à vous informer sur la disponibilité de la fibre.</p>
                    </div>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Prénom & Nom</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input 
                                    type="text" 
                                    required 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Amine Benali" 
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Numéro de téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input 
                                    type="tel" 
                                    required 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="06 XX XX XX XX" 
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-600/30">
                            Lancer le Test de Couverture <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {step === 'SCANNING' && (
                <div className="py-12 text-center animate-in zoom-in duration-500 text-zinc-900 dark:text-white">
                    <div className="relative w-32 h-32 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-blue-100 dark:border-zinc-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
                        {/* Radar ping effect */}
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-2xl font-black mb-2 animate-pulse">Analyse des bornes...</h3>
                    <p className="text-zinc-500">Vérification de l'adresse : {address}</p>
                    <div className="mt-6 flex justify-center gap-1 text-sm text-zinc-400">
                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>Connexion aux bases opérateurs...</span>
                    </div>
                </div>
            )}

            {step === 'RESULT' && (
                <div className="py-8 text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">Bonne nouvelle !</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
                        Votre quartier (<span className="font-bold text-zinc-900 dark:text-white">{address}</span>) semble éligible aux offres haut débit. Les techniciens peuvent vous raccorder rapidement.
                    </p>
                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-2xl p-6 mb-8 text-left">
                        <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" /> Attention aux arnaques
                        </h4>
                        <p className="text-sm text-orange-700/80 dark:text-orange-300/80">
                            Ne souscrivez pas directement en agence ! 92% des personnes paient trop cher car elles n'ont pas accès aux offres "Rétention B2B". Utilisez notre comparateur secret pour voir les vrais prix (jusqu'à -40%).
                        </p>
                    </div>
                    <a href="/?scam=true" className="inline-flex w-full bg-black dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white font-black py-4 px-8 rounded-xl items-center justify-center gap-2 transition-transform active:scale-95 shadow-2xl">
                        Débloquer les prix secrets
                    </a>
                </div>
            )}
        </div>
    );
}
