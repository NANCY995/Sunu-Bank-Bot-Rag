import React, { useState } from 'react';
import { Mail, Lock, LogIn, Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Footer } from '../components/Footer';
import logoSunu from '../../assets/LOGO-SUNU.png';

interface LoginViewProps {
  onLoginSuccess: (role?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading]   = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Attempt real API login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const role  = data?.user?.role ?? 'agent';
        const token = data?.access_token ?? '';
        localStorage.setItem('sunu_admin_token', token);
        localStorage.setItem('sunu_admin_role', role);
        onLoginSuccess(role);
        return;
      }

      if (res.status === 401) {
        setErrorMessage('Email ou mot de passe incorrect.');
        return;
      }
      if (res.status === 403) {
        setErrorMessage('Compte désactivé. Contactez un administrateur.');
        return;
      }
      // API unavailable — fallback demo admin
      throw new Error('API unavailable');

    } catch {
      // Fallback: offline demo mode (backend not running)
      // Admin demo credentials: admin@sunubank.tg / admin1234
      const DEMO_ADMIN_EMAIL    = 'admin@sunubank.tg';
      const DEMO_ADMIN_PASSWORD = 'admin1234';

      if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
        localStorage.setItem('sunu_admin_token', 'demo-admin-token');
        localStorage.setItem('sunu_admin_role', 'admin');
        onLoginSuccess('admin');
      } else if (email.endsWith('@sunubank.tg') || email.endsWith('@sunubank.com')) {
        // Any @sunubank email → agent in demo mode
        localStorage.setItem('sunu_admin_token', 'demo-agent-token');
        localStorage.setItem('sunu_admin_role', 'agent');
        onLoginSuccess('agent');
      } else {
        setErrorMessage(
          'Connexion au serveur impossible. En mode démo, utilisez :\n' +
          'admin@sunubank.tg / admin1234'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between relative overflow-hidden bg-slate-50 dark:bg-[#131313] text-slate-900 dark:text-[#e2e2e2] transition-colors">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(226, 30, 38, 0.25) 0%, transparent 50%)' }}
        />
        <div className="absolute bottom-0 right-0 w-full h-full opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 85% 80%, rgba(226, 30, 38, 0.2) 0%, transparent 40%)' }}
        />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #E21E26 1px, transparent 1px), linear-gradient(to bottom, #E21E26 1px, transparent 1px)' }}
        />
      </div>

      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="h-20 px-4 py-2 mb-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
              <img src={logoSunu} alt="Logo SUNU Bank Togo" className="h-14 w-auto object-contain" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[#E21E26] tracking-tight">
              SUNU BANK TOGO
            </h1>
            <p className="text-sm text-slate-600 dark:text-[#A3A3A3] mt-1">
              Portail Financier &amp; Intelligence Artificielle
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#1E1E1E] rounded-2xl p-8 shadow-xl dark:shadow-2xl transition-all duration-300 focus-within:border-[#E21E26]/60 focus-within:shadow-[0_0_24px_rgba(226,30,38,0.15)]">
            <form onSubmit={handleSubmit} className="space-y-5" id="rag-login-form">

              {/* Error */}
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-xs p-3.5 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{errorMessage}</span>
                </div>
              )}

              {/* Demo hint */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
                <span className="font-bold">Mode démo admin :</span>{' '}
                <code className="font-mono bg-amber-100 dark:bg-amber-900/30 px-1 rounded">admin@sunubank.tg</code>
                {' / '}
                <code className="font-mono bg-amber-100 dark:bg-amber-900/30 px-1 rounded">admin1234</code>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Email institutionnel
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@sunubank.tg"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-300 dark:border-[#2D2D2D] text-slate-900 dark:text-[#e2e2e2] placeholder-slate-400 dark:placeholder-[#555] text-sm focus:border-[#E21E26] focus:ring-2 focus:ring-[#E21E26]/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-300 dark:border-[#2D2D2D] text-slate-900 dark:text-[#e2e2e2] placeholder-slate-400 dark:placeholder-[#555] text-sm focus:border-[#E21E26] focus:ring-2 focus:ring-[#E21E26]/20 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-[#2D2D2D] accent-[#E21E26]"
                />
                <span className="text-sm text-slate-600 dark:text-[#A3A3A3]">Maintenir la session</span>
              </label>

              {/* Submit */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E21E26] hover:bg-[#c00017] text-white font-bold text-base py-3.5 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E21E26] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 mt-2"
              >
                <span>{isLoading ? 'Connexion...' : 'Se connecter'}</span>
                <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>

          {/* Security notice */}
          <div className="mt-6 text-center flex items-center justify-center gap-2 text-slate-400 dark:text-[#555] text-xs">
            <Shield className="w-4 h-4 text-[#E21E26]" />
            <span>Environnement chiffré de bout en bout</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
