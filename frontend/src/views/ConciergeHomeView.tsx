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
      label: 'Visa Études',
      icon: 'school',
      query: 'I need some information about student insurance for studying abroad. Specifically Visa Études.',
    },
    {
      id: 'plan-retraite',
      label: 'Plan Retirement',
      icon: 'savings',
      query: 'Comment fonctionne le Plan Épargne Retraite Zen et quels sont les rendements garantis ?',
    },
    {
      id: 'credit-auto',
      label: 'Credit Auto',
      icon: 'directions_car',
      query: 'Quelles sont les conditions et taux pour le Crédit Auto SUNU Bank Togo ?',
    },
    {
      id: 'insurance-options',
      label: 'Insurance Options',
      icon: 'health_and_safety',
      query: 'Quelles sont toutes les formules d’assurance et de prévoyance proposées par SUNU ?',
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
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between antialiased relative overflow-hidden bg-[#131313] text-[#e5e2e1] font-sans">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E21E26] rounded-full opacity-5 blur-[140px] mix-blend-screen pointer-events-none"></div>

      <main className="w-full max-w-3xl px-4 md:px-6 mx-auto my-auto py-12 flex flex-col items-center z-10">
        {/* Minimalist Official Branding */}
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="h-20 px-5 py-2 mb-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
            <img
              src={logoSunu}
              alt="SUNU Bank Togo"
              className="h-14 w-auto object-contain"
            />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-[#E21E26] mb-1 tracking-tight">
            SUNU Bank Togo
          </h1>
          <p className="font-heading text-lg text-[#e7bdb8] font-medium">
            Votre Concierge Financier & Assurance
          </p>
        </div>

        {/* Primary Chat Interface Card */}
        <div className="w-full bg-[#1B1B1B] rounded-3xl border border-[#2a2a2a] p-6 md:p-10 shadow-2xl hero-glow flex flex-col gap-6">
          {/* Bot Greeting */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex-shrink-0 flex items-center justify-center border border-[#353534] mt-1 text-[#E21E26]">
              <span className="material-symbols-outlined text-[24px] text-[#E21E26]" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
            </div>
            <div className="bg-[#2a2a2a] p-5 rounded-2xl rounded-tl-none border border-[#353534] shadow-sm max-w-[85%]">
              <p className="text-base md:text-lg text-[#e5e2e1] leading-relaxed">
                Hello! I'm your Financial Concierge. How can I assist you with your banking or insurance needs today?
              </p>
            </div>
          </div>

          {/* Prominent Input Field */}
          <form onSubmit={handleSubmit} className="relative flex items-center w-full mt-2" id="concierge-home-form">
            <input
              id="concierge-home-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about banking, insurance, or loans..."
              className="w-full bg-[#131313] border border-[#353534] rounded-2xl py-5 pl-6 pr-16 text-base text-[#e5e2e1] placeholder-[#888888] focus:ring-2 focus:ring-[#E21E26] focus:border-transparent focus:outline-none transition-all shadow-inner"
            />
            <button
              id="concierge-home-submit-btn"
              type="submit"
              aria-label="Send query"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#E21E26] hover:bg-[#c00017] rounded-xl text-white flex items-center justify-center transition-colors shadow-md cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[22px] transition-transform group-hover:translate-x-0.5">
                send
              </span>
            </button>
          </form>

          {/* Quick Start Suggestions */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {quickPills.map((pill) => (
              <button
                key={pill.id}
                id={`pill-${pill.id}`}
                onClick={() => handlePillClick(pill.query)}
                className="bg-[#1c1b1b] hover:bg-[#252424] transition-colors border border-[#2a2a2a] hover:border-[#E21E26]/50 px-4 md:px-5 py-2.5 rounded-full flex items-center gap-2 group cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[#E21E26] text-[18px] opacity-90 group-hover:opacity-100"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {pill.icon}
                </span>
                <span className="font-heading text-xs md:text-sm font-bold text-[#e7bdb8] group-hover:text-white">
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
