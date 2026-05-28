"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Wifi, Home, MapPin, Phone, User, CheckCircle2, ChevronRight, Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import VoiceConsentCheckbox from '@/components/VoiceConsentCheckbox';
import { AddressMapPicker } from '@/components/AddressMapPicker';
import { useTranslation } from '@/lib/LocaleContext';

type Step = 'NEED' | 'REASON' | 'LOCATION' | 'CONTACT' | 'SCANNING' | 'RESULT';

export function EligibilityChecker() {
    const { locale, t, isRtl } = useTranslation();
    const [step, setStep] = useState<Step>('NEED');
    const [need, setNeed] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [reason, setReason] = useState('');
    const [city, setCity] = useState('');
    const [timing, setTiming] = useState('asap');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
  const [consentVoice, setConsentVoice] = useState(false);
    const [comment, setComment] = useState('');


    const handleNeedSelection = (selectedNeed: string) => {
        setNeed(selectedNeed);
        setStep('REASON');
    };

    const handleReasonSelection = (selectedReason: string) => {
        setReason(selectedReason);
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
            
            // 1. Save to Supabase
            try {
                const { data: leadData } = await supabase.from('leads').insert({
                    user_name: name,
                    user_phone: phone,
                    address: address,
                    status: 'eligibility_qualified',
                    needs_details: {
                        source: 'eligibility_v3',
                        need,
                        reason,
                        installation_timing: timing,
                        comment,
                        lat,
                        lon,
                        captured_at: new Date().toISOString()
                    }

                }).select('id').single();
                // Queue voice verification if consented
                if (consentVoice && leadData) {
                  await fetch('/api/voice/queue', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ leadId: leadData.id, phone })
                  });
                }

                // 2. Secondary notification pipeline
                await fetch('/api/leads/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadId: leadData?.id,
                        phone: phone,
                        user_name: name,
                        city: city || address.split(',').slice(-3, -2)[0]?.trim() || 'Casablanca',
                        address: address,
                        source: 'eligibility_checker',
                        needs_details: {
                            reason,
                            need,
                            installation_timing: timing,
                            comment,
                            location: { lat, lon },
                            captured_at: new Date().toISOString()
                        }

                    })
                });
            } catch (err) {
                console.error("Failed to save lead", err);
            }

            // Simulate scanning
            setTimeout(() => {
                setStep('RESULT');
            }, 3500);
        }
    };

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-2xl mx-auto relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
            {/* Progress Bar */}
            {step !== 'SCANNING' && step !== 'RESULT' && (
                <div className={`flex gap-2 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-2 flex-1 rounded-full ${['NEED', 'REASON', 'LOCATION', 'CONTACT'].includes(step) ? 'bg-blue-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${['REASON', 'LOCATION', 'CONTACT'].includes(step) ? 'bg-blue-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${['LOCATION', 'CONTACT'].includes(step) ? 'bg-blue-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${['CONTACT'].includes(step) ? 'bg-blue-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}></div>
                </div>
            )}

            {step === 'NEED' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-2">{t('elig_title')}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">{t('elig_subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => handleNeedSelection('Fibre Optique')} className={`p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group ${isRtl ? 'text-right' : 'text-left'}`}>
                            <Wifi className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-zinc-900 dark:text-white">{t('elig_need_fibre_title')}</div>
                            <div className="text-sm text-zinc-500">{t('elig_need_fibre_desc')}</div>
                        </button>
                        <button onClick={() => handleNeedSelection('ADSL')} className={`p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group ${isRtl ? 'text-right' : 'text-left'}`}>
                            <Home className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-zinc-900 dark:text-white">{t('elig_need_adsl_title')}</div>
                            <div className="text-sm text-zinc-500">{t('elig_need_adsl_desc')}</div>
                        </button>
                        <button onClick={() => handleNeedSelection('Box 4G/5G')} className={`p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group ${isRtl ? 'text-right' : 'text-left'}`}>
                            <Activity className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-zinc-900 dark:text-white">{t('elig_need_box_title')}</div>
                            <div className="text-sm text-zinc-500">{t('elig_need_box_desc')}</div>
                        </button>
                        <button onClick={() => handleNeedSelection('Forfait Mobile')} className={`p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group ${isRtl ? 'text-right' : 'text-left'}`}>
                            <Phone className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-zinc-900 dark:text-white">{t('elig_need_mobile_title')}</div>
                            <div className="text-sm text-zinc-500">{t('elig_need_mobile_desc')}</div>
                        </button>
                    </div>
                </div>
            )}

            {step === 'REASON' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <button onClick={() => setStep('NEED')} className="text-sm text-zinc-500 mb-4 hover:text-zinc-900 dark:hover:text-white">
                        {isRtl ? 'رجوع ←' : '← Retour'}
                    </button>
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-2">{t('elig_reason_title')}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">{t('elig_reason_desc')}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'moving', label: t('elig_reason_moving'), icon: Home, color: 'text-blue-500' },
                            { id: 'better_price', label: t('elig_reason_cheaper'), icon: ShieldCheck, color: 'text-green-500' },
                            { id: 'better_speed', label: t('elig_reason_faster'), icon: Activity, color: 'text-orange-500' },
                            { id: 'new_line', label: t('elig_reason_new'), icon: Zap, color: 'text-yellow-500' }
                        ].map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => handleReasonSelection(item.label)}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                            >
                                <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                                <span className="font-bold text-zinc-900 dark:text-white">{item.label}</span>
                                <ChevronRight className={`w-5 h-5 ${isRtl ? 'mr-auto rotate-180' : 'ml-auto'} text-zinc-300 group-hover:text-blue-500 transition-colors`} />
                            </button>
                        ))}
                    </div>
                </div>
            )}


            {step === 'LOCATION' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <button onClick={() => setStep('REASON')} className="text-sm text-zinc-500 mb-4 hover:text-zinc-900 dark:hover:text-white">
                        {isRtl ? 'رجوع ←' : '← Retour'}
                    </button>
                    <div className="mb-6">
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('elig_loc_title')}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{t('elig_loc_desc')}</p>
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
                            className={`w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 ${isRtl ? 'flex-row-reverse' : ''}`}
                        >
                            {t('elig_loc_btn')} <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                        </button>
                    </form>
                </div>
            )}

            {step === 'CONTACT' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <button onClick={() => setStep('LOCATION')} className="text-sm text-zinc-500 mb-4 hover:text-zinc-900 dark:hover:text-white">
                        {isRtl ? 'رجوع ←' : '← Retour'}
                    </button>
                    <div className="mb-6">
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('elig_contact_title')}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">{t('elig_contact_desc')}</p>
                    </div>
                    <div className={`bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-sm mb-6 flex gap-2 items-start ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                        <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>{t('elig_contact_secure')}</p>
                    </div>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">{t('promo_step2_name')}</label>
                            <div className="relative">
                                <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400`} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    placeholder={t('elig_contact_name_placeholder')}
                                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white`}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">{t('promo_step2_phone')}</label>
                            <div className="relative">
                                <Phone className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400`} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                                    placeholder={t('elig_contact_phone_placeholder')}
                                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white`}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">{t('elig_contact_delay')}</label>
                            <select 
                                value={timing}
                                onChange={(e) => setTiming(e.target.value)}
                                className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white font-bold ${isRtl ? 'text-right' : ''}`}
                            >
                                <option value="asap">{t('elig_delay_asap')}</option>
                                <option value="1_month">{t('elig_delay_1month')}</option>
                                <option value="checking">{t('elig_delay_checking')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">{t('elig_contact_comment')}</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t('elig_contact_comment_placeholder')}
                                className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white min-h-[80px] ${isRtl ? 'text-right' : ''}`}
                            />
                        </div>

                        <button type="submit" className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-600/30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            {t('elig_contact_btn')} <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                        </button>
                    
<VoiceConsentCheckbox consentVoice={consentVoice} setConsentVoice={setConsentVoice} />
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
                    <h3 className="text-2xl font-black mb-2 animate-pulse">{t('elig_scan_title')}</h3>
                    <p className="text-zinc-500">{t('elig_scan_desc').replace('{address}', address)}</p>
                    <div className="mt-6 flex justify-center gap-1 text-sm text-zinc-400">
                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>{t('elig_scan_connecting')}</span>
                    </div>
                </div>
            )}

            {step === 'RESULT' && (
                <div className="py-8 text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">{t('elig_res_title')}</h3>
                    <div className={`flex items-center justify-center gap-4 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-1 text-[10px] uppercase font-bold text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <ShieldCheck className="w-3 h-3 text-green-500" /> {t('elig_res_encrypted')}
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] uppercase font-bold text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <CheckCircle2 className="w-3 h-3 text-blue-500" /> {t('elig_res_verified')}
                        </div>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
                        {t('elig_res_desc').replace('{address}', address)}
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-6 mb-8 text-left">
                        <h4 className={`font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                             {t('elig_res_advisor_title')}
                        </h4>
                        <p className={`text-sm text-blue-700/80 dark:text-blue-300/80 italic ${isRtl ? 'text-right' : 'text-left'}`}>
                            {t('elig_res_advisor_desc')}
                        </p>
                    </div>
                    <a href="/?scam=true" className={`inline-flex w-full bg-black dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white font-black py-4 px-8 rounded-xl items-center justify-center gap-2 transition-transform active:scale-95 shadow-2xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                        {t('elig_res_btn')}
                    </a>
                </div>
            )}
        </div>
    );
}
