import React, { useState } from 'react';
import { Mail, Lock, LogIn, Shield, ArrowRight } from 'lucide-react';
import { Footer } from '../components/Footer';

import logoSunu from '../../assets/LOGO-SUNU.png';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('analyst@sunubank.com');
  const [password, setPassword] = useState('••••••••••••');
  const [maintainSession, setMaintainSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Veuillez renseigner votre email institutionnel');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      // Direct login success
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between relative overflow-hidden bg-slate-50 dark:bg-[#131313] text-slate-900 dark:text-[#e2e2e2] transition-colors">
      {/* Subtle Background Elements for Intelligence Portal Theme */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 50%, rgba(226, 30, 38, 0.25) 0%, transparent 50%)',
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-full h-full opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 85% 80%, rgba(226, 30, 38, 0.2) 0%, transparent 40%)',
          }}
        ></div>
        {/* Abstract grid lines */}
        <div
          className="absolute inset-0 border-t border-l border-slate-200 dark:border-[#1E1E1E] opacity-20"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage:
              'linear-gradient(to right, #1E1E1E 1px, transparent 1px), linear-gradient(to bottom, #1E1E1E 1px, transparent 1px)',
          }}
        ></div>
      </div>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 md:px-10 py-12">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="h-20 px-4 py-2 mb-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-lg">
              <img
                src={logoSunu}
                alt="Logo SUNU Bank Togo"
                className="h-14 w-auto object-contain"
              />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[#E21E26] tracking-tight">
              SUNU BANK TOGO
            </h1>
            <p className="text-sm text-slate-600 dark:text-[#A3A3A3] mt-1 font-sans">
              Portail Financier & Intelligence Artificielle
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#1E1E1E] rounded-xl p-8 shadow-xl dark:shadow-2xl transition-all duration-300 relative focus-within:border-[#E21E26]/60 focus-within:shadow-[0_0_24px_rgba(226,30,38,0.2)]">
            <form onSubmit={handleSubmit} className="space-y-6" id="rag-login-form">
              {errorMessage && (
                <div className="bg-red-50 dark:bg-[#93000a]/20 border border-red-200 dark:border-[#ffb4ab]/40 text-[#E21E26] dark:text-[#ffb4ab] text-xs p-3 rounded">
                  {errorMessage}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="font-mono-code text-xs text-slate-700 dark:text-[#e7bdb8] block uppercase tracking-wider font-semibold"
                >
                  Institutional Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#A3A3A3]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@sunubank.com"
                    className="block w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-300 dark:border-[#2D2D2D] text-slate-900 dark:text-[#e2e2e2] placeholder-slate-400 dark:placeholder-[#555555] font-sans text-base focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] focus:outline-none transition-colors caret-[#E21E26]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="font-mono-code text-xs text-slate-700 dark:text-[#e7bdb8] block uppercase tracking-wider font-semibold"
                  >
                    Security Credential
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Un lien de réinitialisation sécurisé a été transmis à votre département de conformité.")}
                    className="text-xs text-[#E21E26] hover:underline transition-colors underline-offset-4"
                  >
                    Recover Access
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#A3A3A3]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-3 py-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-300 dark:border-[#2D2D2D] text-slate-900 dark:text-[#e2e2e2] placeholder-slate-400 dark:placeholder-[#555555] font-sans text-base focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] focus:outline-none transition-colors caret-[#E21E26]"
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={maintainSession}
                    onChange={(e) => setMaintainSession(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-[#2D2D2D] bg-slate-50 dark:bg-black text-[#E21E26] accent-[#E21E26] focus:ring-[#E21E26]"
                  />
                  <span className="ml-2.5 block text-sm text-slate-600 dark:text-[#A3A3A3] font-sans">
                    Maintain Session
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#E21E26] hover:bg-[#c00017] text-white font-heading font-semibold text-lg py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E21E26] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
                >
                  <span>{isLoading ? 'Authentification...' : 'Authenticate'}</span>
                  <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-500 dark:text-[#777777] font-mono-code text-xs">
            <Shield className="w-4 h-4 text-[#E21E26]" />
            <span>End-to-End Encrypted Environment</span>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};
