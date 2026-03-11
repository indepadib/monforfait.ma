"use client";

import { useState, useEffect } from 'react';
import { Search, ShieldAlert, ArrowRight } from 'lucide-react';

export default function WidgetPage() {
    const [operator, setOperator] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        // Since Next.js App Router root layout wraps everything, we aggressively remove 
        // the main site chrome (nav, footers, popups) so the iframe looks clean.
        const elementsToRemove = [
            'footer', 
            'nav', 
            '#cookie-consent',
            '#compare-bar',
            '.fixed.bottom-6.right-6', // Chatbot
            '.fixed.bottom-6.left-6' // Toast
        ];
        
        const removeChrome = () => {
            elementsToRemove.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => el.remove());
            });
            // Also hide any stray sticky headers or fixed elements
            document.body.style.background = 'transparent';
            document.documentElement.style.background = 'transparent';
        };

        // Run immediately and again slightly later to catch delayed renders
        removeChrome();
        setTimeout(removeChrome, 500);
        setTimeout(removeChrome, 2000);
    }, []);
    
    // Simple standalone scanner
    return (
        <div className="w-full h-full bg-zinc-900 text-white rounded-xl overflow-hidden shadow-2xl font-sans border border-zinc-800 flex flex-col">
            <div className="bg-red-600 p-3 text-center flex items-center justify-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase">Scannez votre facture</h3>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-center">
                <div className="mb-3">
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Opérateur Actuel</label>
                    <select 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
                        value={operator}
                        onChange={e => setOperator(e.target.value)}
                    >
                        <option value="">Sélectionnez...</option>
                        <option value="Orange">Orange</option>
                        <option value="IAM">Maroc Telecom</option>
                        <option value="Inwi">Inwi</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Prix (DH)</label>
                    <input 
                        type="number" 
                        placeholder="Ex: 249" 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>

                <a 
                    href={`https://monforfait.ma/offers?utm_source=widget&mode=scan&op=${operator}&px=${price}`}
                    target="_blank"
                    rel="noopener"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                    Lancer l'audit
                    <ArrowRight className="w-4 h-4" />
                </a>
            </div>

            {/* THE BACKLINK */}
            <div className="bg-zinc-950 p-2 text-center border-t border-zinc-800">
                <a 
                    href="https://monforfait.ma" 
                    target="_blank" 
                    rel="noopener"
                    className="text-[10px] text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                    Propulsé par <strong>MonForfait.ma</strong> - Le Comparateur Télécom
                </a>
            </div>
        </div>
    );
}
