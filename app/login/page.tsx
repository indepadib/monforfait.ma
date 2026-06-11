'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Mail, ArrowRight, 
  Building, AlertCircle, Briefcase, Eye, EyeOff,
  UserPlus, CheckCircle, RefreshCw, Key
} from 'lucide-react';

function LoginPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'operator' | 'admin' | 'commercial') || 'operator';

  const [activeTab, setActiveTab] = useState<'operator' | 'admin' | 'commercial'>(initialTab);
  const [view, setView] = useState<'login' | 'signup' | 'forgot_password'>('login');
  
  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup form states
  const [signupOperatorName, setSignupOperatorName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // General states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync tab with search params
  useEffect(() => {
    const tab = searchParams.get('tab') as 'operator' | 'admin' | 'commercial';
    if (tab === 'admin' || tab === 'operator' || tab === 'commercial') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Set default credentials helper
  const loadDemoCredentials = () => {
    if (activeTab === 'operator') {
      setEmail('orange@telecom.ma');
      setPassword('orange123');
    } else if (activeTab === 'commercial') {
      setEmail('commercial@monforfait.ma');
      setPassword('commercial123');
    } else {
      setEmail('admin@monforfait.ma');
      setPassword('admin123');
    }
    setError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      if (activeTab === 'operator') {
        // Check registered accounts first
        const registered = localStorage.getItem('operator_account_' + email);
        let isValid = false;
        let company = 'Orange Maroc B2B';
        if (registered) {
          const acc = JSON.parse(registered);
          if (acc.password === password) {
            isValid = true;
            company = acc.companyName || company;
          }
        }
        
        if (email === 'orange@telecom.ma' && password === 'orange123') {
          isValid = true;
        }

        if (isValid) {
          localStorage.setItem('operator_logged_in', 'true');
          localStorage.setItem('operator_email', email);
          localStorage.setItem('operator_company_name', company);
          document.cookie = `operator_email=${encodeURIComponent(email)}; path=/; max-age=86400`;
          router.push('/operateurs/dashboard/leads');
        } else {
          setError("Identifiants Opérateur incorrects. (Démo: orange@telecom.ma / orange123)");
          setIsLoading(false);
        }
      } else if (activeTab === 'commercial') {
        // Check commercial accounts
        const registeredComm = localStorage.getItem('commercial_account_' + email);
        let isValidComm = false;
        if (registeredComm) {
          const acc = JSON.parse(registeredComm);
          if (acc.password === password) isValidComm = true;
        }
        
        if (email === 'commercial@monforfait.ma' && password === 'commercial123') {
          isValidComm = true;
        }

        if (isValidComm) {
          localStorage.setItem('admin_logged_in', 'true');
          localStorage.setItem('user_role', 'commercial');
          document.cookie = "admin_logged_in=true; path=/; max-age=86400";
          document.cookie = "user_role=commercial; path=/; max-age=86400";
          router.push('/admin/leads');
        } else {
          setError("Identifiants Commercial incorrects. (Démo: commercial@monforfait.ma / commercial123)");
          setIsLoading(false);
        }
      } else {
        // Check registered admin accounts
        const registeredAdmin = localStorage.getItem('admin_account_' + email);
        let isValidAdmin = false;
        if (registeredAdmin) {
          const acc = JSON.parse(registeredAdmin);
          if (acc.password === password) {
            isValidAdmin = true;
          }
        }
        
        if (email === 'admin@monforfait.ma' && password === 'admin123') {
          isValidAdmin = true;
        }

        if (isValidAdmin) {
          localStorage.setItem('admin_logged_in', 'true');
          localStorage.setItem('user_role', 'admin');
          document.cookie = "admin_logged_in=true; path=/; max-age=86400";
          document.cookie = "user_role=admin; path=/; max-age=86400";
          router.push('/admin/leads');
        } else {
          setError("Identifiants Administrateur incorrects. (Démo: admin@monforfait.ma / admin123)");
          setIsLoading(false);
        }
      }
    }, 1000);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      if (activeTab === 'operator') {
        localStorage.setItem('operator_account_' + signupEmail, JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          companyName: signupOperatorName
        }));
        setSuccessMessage("Compte Opérateur créé avec succès ! Connectez-vous avec vos identifiants.");
      } else {
        localStorage.setItem('admin_account_' + signupEmail, JSON.stringify({
          email: signupEmail,
          password: signupPassword
        }));
        setSuccessMessage("Compte Administrateur créé avec succès ! Connectez-vous avec vos identifiants.");
      }
      setEmail(signupEmail);
      setPassword(signupPassword);
      setIsLoading(false);
      setView('login');
      setSignupEmail('');
      setSignupPassword('');
      setSignupOperatorName('');
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setSuccessMessage(`Un e-mail de réinitialisation a été envoyé à ${email}. (Simulé)`);
      setIsLoading(false);
      setView('login');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      
      {/* Glow shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span>Mon<span className="text-blue-500">Forfait</span><span className="text-purple-500">.ma</span></span>
          </Link>
          <h2 className="text-lg font-bold text-slate-300 mt-4">Portail Professionnel Sécurisé</h2>
          <p className="text-xs text-slate-500 mt-1">
            {view === 'login' && 'Connectez-vous à votre espace partenaire.'}
            {view === 'signup' && 'Créez votre compte partenaire B2B ou Admin.'}
            {view === 'forgot_password' && 'Récupérez l\'accès à votre compte.'}
          </p>
        </div>

        {/* Tab selection (only if in login/signup views) */}
        {view !== 'forgot_password' && (
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-850">
            <button
              onClick={() => {
                setActiveTab('operator');
                setError(null);
                setSuccessMessage(null);
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
                setActiveTab('commercial');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'commercial' 
                  ? 'bg-amber-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" /> Commercial
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setError(null);
                setSuccessMessage(null);
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
        )}

        {/* Success message */}
        {successMessage && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-2xl flex items-start gap-3 animate-in fade-in duration-300">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-300 rounded-2xl flex items-start gap-3 animate-in shake duration-300">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* VIEW: LOGIN */}
        {view === 'login' && (
          <>
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

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Adresse Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required
                    placeholder={activeTab === 'operator' ? 'ex: orange@telecom.ma' : activeTab === 'commercial' ? 'ex: commercial@monforfait.ma' : 'ex: admin@monforfait.ma'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mot de Passe</label>
                  <button 
                    type="button"
                    onClick={() => {
                      setView('forgot_password');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-bold"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
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

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                  activeTab === 'operator'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/10'
                } disabled:opacity-50`}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Se Connecter'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Pas encore inscrit ? </span>
              <button 
                onClick={() => {
                  setView('signup');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold"
              >
                Créer un compte
              </button>
            </div>
          </>
        )}

        {/* VIEW: SIGNUP */}
        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            {activeTab === 'operator' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Nom de l'Opérateur / Entreprise</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Inwi Telecom, IAM Business"
                    value={signupOperatorName}
                    onChange={(e) => setSignupOperatorName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Adresse Email Professionnelle</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  placeholder="Ex: contact@operatortelco.ma"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Mot de Passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  required
                  placeholder="Choisissez un mot de passe robuste..."
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                activeTab === 'operator'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/10'
              } disabled:opacity-50`}
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Créer mon compte'}
              {!isLoading && <UserPlus className="w-4 h-4" />}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Déjà inscrit ? </span>
              <button 
                type="button"
                onClick={() => {
                  setView('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold"
              >
                Se connecter
              </button>
            </div>
          </form>
        )}

        {/* VIEW: FORGOT PASSWORD */}
        {view === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Votre Adresse Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  placeholder="Saisissez votre e-mail enregistré..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-white placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Réinitialiser le mot de passe'}
              {!isLoading && <Key className="w-4 h-4" />}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => {
                  setView('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold"
              >
                ← Retour à la connexion
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-800/60">
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
