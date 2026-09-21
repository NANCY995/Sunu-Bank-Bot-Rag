import React, { useState } from 'react';
import { Footer } from '../components/Footer';
import logoSunu from '../../assets/LOGO-SUNU.png';

interface ConciergeHomeViewProps {
  onStartChat: (initialQuery: string) => void;
}

export const ConciergeHomeView: React.FC<ConciergeHomeViewProps> = ({ onStartChat }) => {
  const [inputValue, setInputValue] = useState('');

  const quickPills = [
    {
      id: 'visa-etudes',
      label: 'Visa Études (Éducation)',
      icon: 'school',
      query: 'Simule Visa Études avec 15 000 FCFA par mois pendant 10 ans pour financer les études de mon enfant.',
    },
    {
      id: 'horizon-retraite',
      label: 'Horizon Retraite (Bonus 92%)',
      icon: 'savings',
      query: 'Fais-moi une simulation pour Horizon Retraite avec 25 000 FCFA par mois pendant 15 ans et explique le bonus de fidélité.',
    },
    {
      id: 'epargne-bonus',
      label: 'Épargne Bonus & Tirages',
      icon: 'military_tech',
      query: 'Comment fonctionne Épargne Bonus SUNU avec le mécanisme de tirage au sort trimestriel ?',
    },
    {
      id: 'protect-plus',
      label: 'Protect Plus (Micro-assurance)',
      icon: 'health_and_safety',
      query: 'Quelles sont les garanties d’hospitalisation et de décès accidentel de Protect Plus dès 500 FCFA par mois ?',
    },
    {
      id: 'conformite-cima',
      label: 'Conformité Code CIMA',
      icon: 'gavel',
      query: 'Quelles sont les obligations d’information précontractuelle selon l’Article 6 du Code CIMA et les règles de rachat ?',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onStartChat(inputValue.trim());
  };

  const handlePillClick = (query: string) => {
    onStartChat(query);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between antialiased relative overflow-hidden bg-slate-50 dark:bg-[#131313] text-slate-900 dark:text-[#e5e2e1] font-sans transition-colors">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E21E26] rounded-full opacity-5 blur-[140px] mix-blend-screen pointer-events-none"></div>

      <main className="w-full max-w-3xl px-3 sm:px-4 md:px-6 mx-auto my-auto py-6 sm:py-10 flex flex-col items-center z-10">
        {/* Minimalist Official Branding */}
        <div className="mb-6 sm:mb-8 text-center flex flex-col items-center">
          <div className="h-16 sm:h-20 px-3 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
            <img
              src={logoSunu}
              alt="SUNU Bank Togo"
              className="h-11 sm:h-14 w-auto object-contain"
            />
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#E21E26] mb-1 tracking-tight">
            SUNU Bank Togo
          </h1>
          <p className="font-heading text-sm sm:text-base md:text-lg text-slate-700 dark:text-[#e7bdb8] font-medium px-2">
            Conseiller Bancassurance & Simulateur CIMA
          </p>
        </div>

        {/* Primary Chat Interface Card */}
        <div className="w-full bg-white dark:bg-[#1B1B1B] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#2a2a2a] p-4 sm:p-6 md:p-10 shadow-xl dark:shadow-2xl hero-glow flex flex-col gap-4 sm:gap-6 transition-colors">
          {/* Bot Greeting */}
          <div className="flex items-start gap-2.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-[#2a2a2a] flex-shrink-0 flex items-center justify-center border border-slate-200 dark:border-[#353534] mt-0.5 text-[#E21E26]">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-[#E21E26]" style={{ fontVariationSettings: "'FILL' 1" }}>
                support_agent
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-[#2a2a2a] p-3.5 sm:p-5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-[#353534] shadow-sm flex-1">
              <p className="text-xs sm:text-sm md:text-base text-slate-800 dark:text-[#e5e2e1] leading-relaxed">
                Bonjour ! Je suis votre Concierge Bancassurance SUNU Bank Togo. Je réponds à toutes vos questions sur nos 8 contrats d'assurance vie et réalise vos simulations financières précontractuelles instantanées.
              </p>
            </div>
          </div>

          {/* Prominent Input Field */}
          <form onSubmit={handleSubmit} className="relative flex items-center w-full mt-1 sm:mt-2" id="concierge-home-form">
            <input
              id="concierge-home-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez une question ou demandez une simulation..."
              className="w-full bg-slate-50 dark:bg-[#131313] border border-slate-300 dark:border-[#353534] rounded-xl sm:rounded-2xl py-3 sm:py-4.5 pl-3.5 sm:pl-6 pr-13 sm:pr-16 text-xs sm:text-sm md:text-base text-slate-900 dark:text-[#e5e2e1] placeholder-slate-400 dark:placeholder-[#888888] focus:ring-2 focus:ring-[#E21E26] focus:border-transparent focus:outline-none transition-all shadow-inner"
            />
            <button
              id="concierge-home-submit-btn"
              type="submit"
              aria-label="Send query"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-[#E21E26] hover:bg-[#c00017] rounded-lg sm:rounded-xl text-white flex items-center justify-center transition-colors shadow-md cursor-pointer group shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[22px] transition-transform group-hover:translate-x-0.5">
                send
              </span>
            </button>
          </form>

          {/* Quick Start Suggestions */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 mt-1 sm:mt-2">
            {quickPills.map((pill) => (
              <button
                key={pill.id}
                id={`pill-${pill.id}`}
                onClick={() => handlePillClick(pill.query)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-[#1c1b1b] dark:hover:bg-[#252424] transition-colors border border-slate-200 dark:border-[#2a2a2a] hover:border-[#E21E26]/50 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 group cursor-pointer text-[11px] sm:text-xs"
              >
                <span
                  className="material-symbols-outlined text-[#E21E26] text-[15px] sm:text-[17px] opacity-90 group-hover:opacity-100 shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {pill.icon}
                </span>
                <span className="font-heading text-[11px] sm:text-xs font-bold text-slate-700 dark:text-[#e7bdb8] group-hover:text-[#E21E26] dark:group-hover:text-white">
                  {pill.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
