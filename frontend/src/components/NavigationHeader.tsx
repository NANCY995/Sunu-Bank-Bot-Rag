import React from 'react';
import { ScreenType } from '../types';
import { Sparkles, MessageSquare, Sun, Moon, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import logoSunu from '../../assets/LOGO-SUNU.png';

interface NavigationHeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentScreen,
  onNavigate,
  isAuthenticated,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="w-full bg-[#131313] dark:bg-[#131313] light:bg-white border-b border-[#222222] dark:border-[#222222] light:border-slate-200 sticky top-0 z-40 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-colors">
      {/* Brand with Official SUNU Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('concierge-home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="h-9 px-1.5 py-0.5 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <img
              src={logoSunu}
              alt="Logo SUNU Bank Togo"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div>
            <div className="font-heading font-extrabold text-[#E21E26] tracking-tight leading-none text-base">
              SUNU BANK TOGO
            </div>
            <div className="text-[10px] text-[#A3A3A3] font-mono-code leading-none mt-0.5">
              Financial Intelligence
            </div>
          </div>
        </button>
      </div>

      {/* Screen Navigation Tabs */}
      <nav className="flex items-center gap-1.5 bg-[#1A1A1A] dark:bg-[#1A1A1A] light:bg-slate-100 p-1 rounded-xl border border-[#2A2A2A] dark:border-[#2A2A2A] light:border-slate-200">
        <button
          id="nav-concierge-home-btn"
          onClick={() => onNavigate('concierge-home')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            currentScreen === 'concierge-home'
              ? 'bg-[#E21E26] text-white shadow-sm'
              : 'text-[#A3A3A3] hover:text-white hover:bg-[#252525]'
          }`}
          title="Accueil Concierge"
        >
          <Sparkles className="w-4 h-4" />
          <span>Accueil</span>
        </button>

        <button
          id="nav-concierge-chat-btn"
          onClick={() => onNavigate('concierge-chat')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            currentScreen === 'concierge-chat'
              ? 'bg-[#E21E26] text-white shadow-sm'
              : 'text-[#A3A3A3] hover:text-white hover:bg-[#252525]'
          }`}
          title="Chat Assistant"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Discussion IA</span>
        </button>
      </nav>

      {/* Right Controls: Dark/Light Mode + Auth State */}
      <div className="flex items-center gap-2.5">
        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#2D2D2D] text-[#e2e2e2] transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs">Clair</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline text-xs">Sombre</span>
            </>
          )}
        </button>

        {/* Login / Logout Button */}
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#222222] hover:bg-[#2e2e2e] text-[#ff787f] border border-[#3a2022] transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#E21E26] hover:bg-[#c00017] text-white transition-all shadow-sm cursor-pointer"
            title="Se connecter"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Connexion</span>
          </button>
        )}
      </div>
    </header>
  );
};
