"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { event } from '@/lib/analytics';

export function AgentChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{text: string, isBot: boolean}[]>([]);
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        // Auto-open after 20 seconds
        const timer = setTimeout(() => {
            if (!sessionStorage.getItem('chatbot_opened') && window.innerWidth > 768) {
                setIsOpen(true);
                sessionStorage.setItem('chatbot_opened', 'true');
                setMessages([
                    { text: 'Salut ! 👋', isBot: true },
                    { text: "Je suis l'expert télécom de MonForfait.", isBot: true },
                    { text: "Je vois que vous naviguez... Je peux interroger notre base B2B pour vous trouver un forfait 40% moins cher que les offres publiques.", isBot: true }
                ]);
                event({ action: 'chatbot_auto_opened', category: 'engagement', label: 'ai_retention' });
            }
        }, 20000);
        return () => clearTimeout(timer);
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        sessionStorage.setItem('chatbot_opened', 'true');
        if (messages.length === 0) {
            setMessages([
                { text: 'Salut ! 👋', isBot: true },
                { text: "Je suis l'expert télécom de MonForfait.", isBot: true },
                { text: "Je vois que vous naviguez... Je peux interroger notre base B2B pour vous trouver un forfait 40% moins cher que les offres publiques.", isBot: true }
            ]);
        }
        event({ action: 'chatbot_manual_opened', category: 'engagement', label: 'ai_retention' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;
        
        setStatus('loading');
        
        setMessages(prev => [...prev, { text: phone, isBot: false }]);
        setPhone('');

        try {
            await supabase.from('leads').insert({
                user_phone: phone,
                feature_interest: 'ai_chatbot_negotiation',
                source_url: window.location.pathname
            });

            setTimeout(() => {
                setStatus('success');
                setMessages(prev => [...prev, { text: "Parfait ! La demande est lancée 🚀", isBot: true }, { text: "Un conseiller va scanner nos offres B2B et vous envoyer un WhatsApp privé d'ici 5 minutes avec le forfait cracké.", isBot: true }]);
                
                event({ action: 'chatbot_lead_captured', category: 'conversion', label: 'ai_retention' });
            }, 1000);

        } catch (error) {
            console.error(error);
            setStatus('idle');
            setMessages(prev => [...prev, { text: "Mince, un problème de connexion... Vous pouvez réessayer ?", isBot: true }]);
        }
    };

    return (
        <>
            {/* Chatbot Bubble Toggle */}
            <button 
                onClick={handleOpen}
                className={`fixed bottom-6 right-6 z-[80] w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-transform hover:scale-105 ${isOpen ? 'scale-0 select-none pointer-events-none' : 'scale-100'} animate-in zoom-in-50 duration-300`}
            >
                <div className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                </div>
                <MessageSquare className="w-6 h-6" />
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 w-[340px] max-w-[calc(100vw-32px)] h-[500px] max-h-[80vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[90] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 flex items-center justify-between shrink-0 shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                                <Bot className="w-6 h-6" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight">Yassine de MonForfait</h3>
                                <p className="text-xs text-blue-200">Expert Télécom • En ligne</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition-colors bg-blue-700/50 p-1.5 rounded-full">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-900/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                                    msg.isBot 
                                        ? 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm border border-zinc-100 dark:border-zinc-700' 
                                        : 'bg-blue-600 text-white rounded-tr-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {status === 'loading' && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-sm border border-zinc-100 dark:border-zinc-700 shadow-sm flex items-center gap-1">
                                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                        {status === 'success' ? (
                            <div className="text-center text-sm font-medium text-green-600 dark:text-green-400 py-3">
                                Demande envoyée avec succès ! ✓
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input 
                                    type="tel" 
                                    required
                                    placeholder="Ex: 0612345678" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <button 
                                    type="submit"
                                    disabled={!phone || status === 'loading'}
                                    className="w-12 h-12 shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                        )}
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-zinc-400">Entrez votre WhatsApp pour recevoir l'offre.</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
