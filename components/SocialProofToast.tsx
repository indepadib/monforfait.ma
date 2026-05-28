"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useTranslation } from '@/lib/LocaleContext';

const CITIES_FR = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès'];
const CITIES_AR = ['الدار البيضاء', 'الرباط', 'مراكش', 'طنجة', 'أكادير', 'فاس', 'مكناس'];

const NAMES_FR = ['Amine', 'Sarah', 'Mehdi', 'Youssef', 'Kenza', 'Oussama', 'Fatima', 'Karim'];
const NAMES_AR = ['أمين', 'سارة', 'مهدي', 'يوسف', 'كنزة', 'أسامة', 'فاطمة', 'كريم'];

const ACTIONS = [
    { key: 'toast_action_0', save: 150 },
    { key: 'toast_action_1', save: 80 },
    { key: 'toast_action_2', save: 120 },
    { key: 'toast_action_3', save: 300 },
];

export function SocialProofToast() {
    const { t, isRtl, locale } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({ name: '', city: '', actionKey: 'toast_action_0', save: 0 });

    useEffect(() => {
        const showToast = () => {
            const names = locale === 'ar' ? NAMES_AR : NAMES_FR;
            const cities = locale === 'ar' ? CITIES_AR : CITIES_FR;
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

            setData({
                name: randomName,
                city: randomCity,
                actionKey: randomAction.key,
                save: randomAction.save
            });

            setVisible(true);

            // Hide after 5 seconds
            setTimeout(() => setVisible(false), 5000);
        };

        // Initial delay before first toast
        const initialDelay = setTimeout(showToast, 3000);

        // Show repeatedly every 15-25 seconds
        const interval = setInterval(() => {
            if (!document.hidden) {
                showToast();
            }
        }, Math.floor(Math.random() * 10000) + 15000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, [locale]);

    if (!visible) return null;

    return (
        <div className={`fixed bottom-6 ${isRtl ? 'right-6' : 'left-6'} z-[90] max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className={`bg-white dark:bg-zinc-900 ${isRtl ? 'border-r-4 pl-10' : 'border-l-4 pr-10'} border-green-500 rounded-lg shadow-2xl p-4 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/10`}>
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-[shine_2s_infinite]"></div>

                <button 
                    onClick={() => setVisible(false)}
                    className={`absolute top-2 ${isRtl ? 'left-2' : 'right-2'} text-zinc-400 hover:text-zinc-600 transition-colors`}
                >
                    <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-start gap-3 relative z-10">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full shrink-0">
                        <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-start">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {t('toast_from').replace('{name}', data.name).replace('{city}', data.city)}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {t(data.actionKey as any)}
                        </p>
                        <p className="text-xs font-bold text-green-600 dark:text-green-400 mt-1">
                            {t('toast_save').replace('{save}', data.save.toString())}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
