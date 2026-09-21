import React from 'react';
import { ScreenType } from '../types';
import { Sparkles, MessageSquare, Sun, Moon, LogIn, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import logoSunu from '../../assets/LOGO-SUNU.png';

interface NavigationHeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  onLogout: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentScreen,
  onNavigate,
  isAuthenticated,
  isAdmin = false,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="w-full bg-white dark:bg-[#131313] border-b border-slate-200 dark:border-[#222222] sticky top-0 z-40 px-2.5 sm:px-4 py-2 flex items-center justify-between gap-1.5 sm:gap-3 shadow-sm transition-colors">
      {/* Brand with Official SUNU Logo */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={() => onNavigate('concierge-home')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
        >
          <div className="h-8 sm:h-9 px-1.5 py-0.5 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <img
              src={logoSunu}
              alt="Logo SUNU Bank Togo"
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </div>
          <div>
            <div className="font-heading font-extrabold text-[#E21E26] tracking-tight leading-none text-xs sm:text-base">
              SUNU BANK TOGO
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#A3A3A3] font-mono-code leading-none mt-0.5 hidden sm:block">
              Financial Intelligence
            </div>
          </div>
        </button>
      </div>

      {/* Screen Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-100 dark:bg-[#1A1A1A] p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
        <button
          id="nav-concierge-home-btn"
          onClick={() => onNavigate('concierge-home')}
          className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap cursor-pointer ${
            currentScreen === 'concierge-home'
              ? 'bg-[#E21E26] text-white shadow-sm'
              : 'text-slate-600 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252525]'
          }`}
          title="Accueil Concierge"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Accueil</span>
        </button>

        <button
          id="nav-concierge-chat-btn"
          onClick={() => onNavigate('concierge-chat')}
          className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap cursor-pointer ${
            currentScreen === 'concierge-chat'
              ? 'bg-[#E21E26] text-white shadow-sm'
              : 'text-slate-600 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252525]'
          }`}
          title="Chat Assistant"
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Discussion IA</span>
        </button>

        {isAdmin && (
          <button
            id="nav-admin-btn"
            onClick={() => onNavigate('admin')}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap cursor-pointer ${
              currentScreen === 'admin'
                ? 'bg-[#E21E26] text-white shadow-sm'
                : 'text-slate-600 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252525]'
            }`}
            title="Administration"
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Admin</span>
          </button>
        )}
      </nav>

      {/* Right Controls: Dark/Light Mode + Auth State */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2D2D2D] text-slate-700 dark:text-[#e2e2e2] transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 text-xs font-medium"
          title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline text-xs">Clair</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-500" />
              <span className="hidden md:inline text-xs">Sombre</span>
            </>
          )}
        </button>

        {/* Login / Logout Button */}
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-[#222222] dark:hover:bg-[#2e2e2e] text-[#E21E26] dark:text-[#ff787f] border border-red-200 dark:border-[#3a2022] transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#E21E26] hover:bg-[#c00017] text-white transition-all shadow-sm cursor-pointer"
            title="Se connecter"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Connexion</span>
          </button>
        )}
      </div>
    </header>
  );
};
