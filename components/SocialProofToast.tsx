"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès'];
const ACTIONS = [
    { text: 'vient de débloquer une offre secrète Fibre', save: 150 },
    { text: 'a économisé sur son forfait mobile', save: 80 },
    { text: 'vient de comparer les offres ADSL', save: 120 },
    { text: 'a trouvé un forfait Pro 50% moins cher', save: 300 },
];
const NAMES = ['Amine', 'Sarah', 'Mehdi', 'Youssef', 'Kenza', 'Oussama', 'Fatima', 'Karim'];

export function SocialProofToast() {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({ name: '', city: '', action: '', save: 0 });

    useEffect(() => {
        const showToast = () => {
            const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
            const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
            const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

            setData({
                name: randomName,
                city: randomCity,
                action: randomAction.text,
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
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[90] max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-white dark:bg-zinc-900 border-l-4 border-green-500 rounded-lg shadow-2xl p-4 pr-10 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-[shine_2s_infinite]"></div>

                <button 
                    onClick={() => setVisible(false)}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-start gap-3 relative z-10">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full shrink-0">
                        <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            <span className="font-bold">{data.name}</span> de {data.city}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {data.action}
                        </p>
                        <p className="text-xs font-bold text-green-600 dark:text-green-400 mt-1">
                            Économie: {data.save} DH / mois !
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
