'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Mail, ArrowRight, 
  Building, UserCheck, AlertCircle, Briefcase, Eye, EyeOff 
} from 'lucide-react';

function LoginPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'admin' ? 'admin' : 'operator';

  const [activeTab, setActiveTab] = useState<'operator' | 'admin'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync tab with search params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'admin' || tab === 'operator') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Set default credentials helper
  const loadDemoCredentials = () => {
    if (activeTab === 'operator') {
      setEmail('orange@telecom.ma');
      setPassword('orange123');
    } else {
      setEmail('admin@monforfait.ma');
      setPassword('admin123');
    }
    setError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (activeTab === 'operator') {
        if (email === 'orange@telecom.ma' && password === 'orange123') {
          localStorage.setItem('operator_logged_in', 'true');
          router.push('/operateurs/dashboard');
        } else {
          setError("Identifiants Opérateur incorrects. (Démo: orange@telecom.ma / orange123)");
          setIsLoading(false);
        }
      } else {
        if (email === 'admin@monforfait.ma' && password === 'admin123') {
          localStorage.setItem('admin_logged_in', 'true');
          router.push('/admin/leads');
        } else {
          setError("Identifiants Administrateur incorrects. (Démo: admin@monforfait.ma / admin123)");
          setIsLoading(false);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      
      {/* Glow shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-8">
        
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span>Mon<span className="text-blue-500">Forfait</span><span className="text-purple-500">.ma</span></span>
          </Link>
          <h2 className="text-lg font-bold text-slate-300 mt-4">Portail Professionnel Sécurisé</h2>
          <p className="text-xs text-slate-500 mt-1">Connectez-vous à votre espace partenaire.</p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-850">
          <button
            onClick={() => {
              setActiveTab('operator');
              setEmail('');
              setPassword('');
              setError(null);
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'operator' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" /> Opérateur B2B
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              setEmail('');
              setPassword('');
              setError(null);
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Administration
          </button>
        </div>

        {/* Credentials hints */}
        <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex justify-between items-center text-[10px]">
          <span className="text-slate-400 font-semibold">Besoin d'un compte de démo ?</span>
          <button 
            type="button"
            onClick={loadDemoCredentials}
            className="text-blue-400 hover:text-blue-300 font-black underline cursor-pointer"
          >
            Remplir les champs
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-300 rounded-2xl flex items-start gap-3 animate-in shake duration-300">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required
                placeholder={activeTab === 'operator' ? 'ex: orange@telecom.ma' : 'ex: admin@monforfait.ma'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Mot de Passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                placeholder="Saisissez votre mot de passe..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg ${
              activeTab === 'operator'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/10'
            } disabled:opacity-50`}
          >
            {isLoading ? 'Authentification...' : 'Se Connecter'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 font-semibold">
            ← Retour à l'accueil public
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPortalPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500 bg-slate-950 min-h-screen">Chargement du portail d'authentification...</div>}>
      <LoginPortalContent />
    </Suspense>
  );
}
