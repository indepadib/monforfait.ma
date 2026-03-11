"use client";

import { useState, useEffect } from 'react';
import { X, HandCoins, AlertOctagon, Send } from 'lucide-react';
import { event } from '@/lib/analytics';
import { supabase } from '@/lib/supabaseClient';

export function ExitIntentPopup() {
    const [visible, setVisible] = useState(false);
    const [hasFired, setHasFired] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 10 && !hasFired) {
                // Wait 5 seconds minimum before allowing exit intent
                const sessionTime = performance.now();
                if (sessionTime > 5000) {
                    setVisible(true);
                    setHasFired(true);
                    sessionStorage.setItem('exit_intent_fired', 'true');
                    
                    event({
                        action: 'exit_intent_triggered',
                        category: 'retention',
                        label: 'popup_impression'
                    });
                }
            }
        };

        if (sessionStorage.getItem('exit_intent_fired')) {
            setHasFired(true);
            return;
        }

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasFired]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            await supabase.from('leads').insert({
                user_email: email,
                feature_interest: 'exit_intent_retention_offer',
                source_url: window.location.pathname
            });

            setStatus('success');
            event({
                action: 'exit_intent_converted',
                category: 'retention',
                label: 'email_saved'
            });

            setTimeout(() => setVisible(false), 3000);
        } catch (error) {
            console.error('Error saving exit intent lead:', error);
            setStatus('idle');
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-500 delay-150">
                
                {/* Close Button */}
                <button 
                    onClick={() => setVisible(false)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors z-10 bg-white/20 backdrop-blur-sm rounded-full p-2"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header Image/Gradient */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 p-8 text-center text-white relative h-32 flex items-center justify-center">
                   <div className="absolute inset-0 opacity-20 transition-opacity bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent pointer-events-none"></div>
                   <AlertOctagon className="w-16 h-16 absolute -bottom-8 bg-white dark:bg-zinc-900 text-red-500 rounded-full p-2 shadow-xl border-4 border-white dark:border-zinc-900 z-10" />
                </div>

                <div className="p-8 pt-12 text-center">
                    <h2 className="text-3xl font-black mb-4 text-zinc-900 dark:text-white tracking-tight leading-tight">
                        Vous partez déjà ? <br/> Acceptez-vous de payer 1200 DH/an en trop ?
                    </h2>
                    
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-lg">
                        Laissez votre email. Notre IA va scanner le marché <strong>cette nuit</strong> et vous enverra demain matin le seul forfait qui correspond parfaitement à votre consommation réelle.
                    </p>

                    {status === 'success' ? (
                        <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 p-4 rounded-xl font-bold border border-green-200 dark:border-green-800/50">
                            ✓ Dossier prioritaire ! Vous allez recevoir notre analyse demain matin.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input 
                                type="email" 
                                required
                                placeholder="Votre adresse e-mail" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-red-500 outline-none transition-all text-center text-lg shadow-inner"
                            />
                            <button 
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {status === 'loading' ? 'Sécurisation...' : 'Envoyez-moi le forfait secret'} 
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    )}
                    
                    <button 
                        onClick={() => setVisible(false)}
                        className="mt-6 text-sm flex items-center justify-center w-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        Non merci, j'aime payer le prix plein pot pour le même service.
                    </button>
                </div>
            </div>
        </div>
    )
}
