import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  FileDown, 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  ExternalLink,
  Zap,
  Globe,
  SlidersHorizontal,
  Copy
} from 'lucide-react';
import logoSunu from '../../assets/LOGO-SUNU.png';

interface ConciergeChatViewProps {
  initialMessage?: string;
  onNavigateHome: () => void;
}

export const ConciergeChatView: React.FC<ConciergeChatViewProps> = ({
  initialMessage,
  onNavigateHome,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<string | null>(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showQuoteSuccess, setShowQuoteSuccess] = useState(false);
  const [userRatings, setUserRatings] = useState<Record<string, 'up' | 'down'>>({});
  const [showMetrics, setShowMetrics] = useState(true);
  const [language, setLanguage] = useState<'FR' | 'EN'>('FR');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const defaultMessages: ChatMessage[] = [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content:
          "Bonjour ! Je suis le **Concierge Financier SUNU Bank Togo**. Je réponds gratuitement et instantanément à toutes vos questions sur les assurances (Visa Études, Horizon Retraite), crédits et démarches consulaires.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    if (initialMessage && initialMessage.trim()) {
      setMessages([
        ...defaultMessages,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          content: initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      // Trigger reply for initial message
      handleSendMessage(initialMessage);
    } else {
      setMessages(defaultMessages);
    }
  }, [initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/concierge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.slice(-4),
        }),
      });

      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Je suis à votre entière disposition pour vous guider sur nos services SUNU Bank Togo.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: data.structuredData || null,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          "Pour toute souscription ou information complémentaire sur les produits SUNU Bank Togo (Visa Études, Crédit Auto, Épargne Retraite), notre service clientèle est joignable en agence et via notre portail sécurisé.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-slate-50 dark:bg-[#131313] text-slate-900 dark:text-[#e5e2e1] overflow-hidden relative font-sans transition-colors">
      {/* Top App Bar with Official SUNU Logo */}
      <header className="flex-shrink-0 border-b border-slate-200 dark:border-[#2a2a2a] bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-md z-30 w-full transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-2.5 sm:p-3.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 px-2 py-0.5 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <img
                src={logoSunu}
                alt="Logo SUNU Bank Togo"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="h-5 w-px bg-slate-300 dark:bg-[#2a2a2a] hidden sm:block"></div>
            <div className="font-heading font-semibold text-xs sm:text-base text-slate-800 dark:text-[#e5e2e1] flex items-center gap-2">
              <span>Financial Concierge</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
              className="flex items-center gap-1 text-xs text-slate-600 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#1B1B1B] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2D2D2D] px-2 py-1.5 sm:px-2.5 rounded-lg transition-colors cursor-pointer"
              title="Basculer la langue"
            >
              <Globe className="w-3.5 h-3.5 text-[#E21E26]" />
              <span className="font-mono-code font-bold">{language}</span>
            </button>

            {/* Metrics Toggle */}
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className={`flex items-center gap-1.5 text-xs px-2 py-1.5 sm:px-2.5 rounded-lg border transition-colors cursor-pointer ${
                showMetrics 
                  ? 'bg-[#E21E26]/10 text-[#E21E26] border-[#E21E26]/30' 
                  : 'bg-slate-100 dark:bg-[#1B1B1B] text-slate-600 dark:text-[#A3A3A3] border-slate-200 dark:border-[#2D2D2D]'
              }`}
              title="Afficher/Masquer les métriques RAG"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit RAG</span>
            </button>

            {/* Simulator button */}
            <button
              onClick={() => setShowLoanModal(true)}
              className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#1B1B1B] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2D2D2D] px-2.5 py-1.5 sm:px-3 rounded-lg transition-colors cursor-pointer"
              title="Simulateur de crédit / devis"
            >
              <Calculator className="w-3.5 h-3.5 text-[#E21E26]" />
              <span className="hidden sm:inline">Simulateur</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="text-slate-600 dark:text-[#e5e2e1] hover:text-[#E21E26] transition-colors p-1 cursor-pointer"
              title="Réinitialiser la conversation"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages Container - Flex-1 independent scroll without overflow hiding */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 md:p-8 space-y-6 w-full">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Intro / Greeting matching Screen 2 */}
          <div className="text-center mb-6 mt-2">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-[#e5e2e1] mb-2 tracking-tight">
              How can I help you today?
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#c8c6c6] max-w-xl mx-auto">
              Your personal financial concierge is ready to assist with products, insurance, and banking needs.
            </p>
          </div>

          {/* Dynamic Messages Loop */}
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-[#E21E26] text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-none max-w-[90%] sm:max-w-[80%] md:max-w-[70%] text-sm sm:text-base shadow-sm leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex gap-2.5 sm:gap-4">
                {/* Agent Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#E21E26] flex-shrink-0 flex items-center justify-center mt-1 text-white shadow-md">
                  <span
                    className="material-symbols-outlined text-white text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    support_agent
                  </span>
                </div>

                {/* Agent Bubble - Style épuré, fluide et naturel */}
                <div className="bg-white dark:bg-[#1B1B1B] text-slate-800 dark:text-[#e5e2e1] p-4 sm:p-5 rounded-2xl rounded-tl-none max-w-[95%] sm:max-w-[88%] md:max-w-[80%] text-sm sm:text-base border border-slate-200 dark:border-[#2a2a2a] shadow-sm relative flex-1 leading-relaxed transition-colors">
                  {/* Main Content paragraph */}
                  <div className="leading-relaxed font-sans text-sm sm:text-base whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Subtle Action Bar (Copier & Devis si mentionné) */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#252525] flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#888]">
                    <span className="text-[11px] text-slate-400 dark:text-[#666]">SUNU Bank Togo Assistant</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="text-slate-400 hover:text-slate-800 dark:text-[#888] dark:hover:text-[#e2e2e2] p-1 rounded transition-colors cursor-pointer"
                        title="Copier le texte"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5 sm:gap-4 items-center text-slate-500 dark:text-[#A3A3A3] text-sm">
              <div className="w-8 h-8 rounded-full bg-[#E21E26] flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
              </div>
              <div className="bg-white dark:bg-[#1B1B1B] px-4 py-3 rounded-xl border border-slate-200 dark:border-[#2a2a2a] flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#E21E26] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#E21E26] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#E21E26] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs font-mono-code ml-1 text-slate-600 dark:text-[#A3A3A3]">Concierge is generating advice...</span>
              </div>
            </div>
          )}

          {/* Dedicated anchor with breathing room */}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area (in normal flex-shrink-0 flow: NEVER covers messages!) */}
      <div className="flex-shrink-0 w-full bg-white/95 dark:bg-[#1f1f1f]/95 backdrop-blur-xl border-t border-slate-200 dark:border-[#353534] px-3 py-2.5 sm:px-4 sm:py-3.5 md:p-4 z-20 transition-colors shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Quick Query Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-1.5 text-xs no-scrollbar">
            <button
              onClick={() => handleSendMessage('Quelles sont les démarches pour obtenir l’attestation Visa Études ?')}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-[#131313] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2a2a2a] text-slate-600 hover:text-slate-900 dark:text-[#A3A3A3] dark:hover:text-white px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer text-xs"
            >
              📋 Démarches attestation Visa
            </button>
            <button
              onClick={() => handleSendMessage('Quelle est la prise en charge pour les frais dentaires ou hospitalisation ?')}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-[#131313] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2a2a2a] text-slate-600 hover:text-slate-900 dark:text-[#A3A3A3] dark:hover:text-white px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer text-xs"
            >
              🏥 Détail plafonds médicaux
            </button>
            <button
              onClick={() => handleSendMessage('Quelles sont les formules d’épargne retraite ou crédit auto ?')}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-[#131313] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2a2a2a] text-slate-600 hover:text-slate-900 dark:text-[#A3A3A3] dark:hover:text-white px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer text-xs"
            >
              🚗 Crédit Auto & Retraite
            </button>
            <button
              onClick={() => handleSendMessage('Comparer la formule Standard vs la formule Premium pour un séjour aux USA.')}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-[#131313] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2a2a2a] text-slate-600 hover:text-slate-900 dark:text-[#A3A3A3] dark:hover:text-white px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer text-xs"
            >
              ⚖️ Comparateur Standard vs Premium
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="relative w-full" id="concierge-chat-form">
            <input
              id="concierge-chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question sur Visa Études, crédit auto ou retraite..."
              className="w-full bg-slate-50 dark:bg-[#1B1B1B] border border-slate-300 dark:border-[#2a2a2a] rounded-xl py-2.5 sm:py-3.5 pl-3.5 sm:pl-4 pr-12 sm:pr-16 text-slate-900 dark:text-[#e5e2e1] text-sm sm:text-base focus:outline-none focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] transition-all shadow-inner placeholder-slate-400 dark:placeholder-[#777777]"
            />
            <button
              id="concierge-chat-send-btn"
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-[#E21E26] text-white rounded-lg flex items-center justify-center hover:bg-[#c00017] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                send
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Loan Simulator Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#191919] border border-slate-200 dark:border-[#2D2D2D] rounded-xl max-w-md w-full p-6 text-slate-800 dark:text-[#e2e2e2] shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-[#2D2D2D] pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#E21E26]" />
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Simulateur Crédit & Épargne SUNU
                </h3>
              </div>
              <button onClick={() => setShowLoanModal(false)} className="text-slate-400 hover:text-slate-700 dark:text-[#A3A3A3] dark:hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#252525]">
                <div className="text-xs text-slate-500 dark:text-[#A3A3A3] font-mono-code uppercase">Exemple Crédit Auto 5 000 000 FCFA</div>
                <div className="text-2xl font-bold text-[#E21E26] mt-1 font-heading">97 850 FCFA <span className="text-xs text-slate-500 dark:text-[#A3A3A3] font-normal">/ mois</span></div>
                <div className="text-xs text-slate-500 dark:text-[#A3A3A3] mt-2">Durée : 60 mois • Taux fixe : 6.5% HT • Frais de dossier offerts</div>
              </div>

              <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#252525]">
                <div className="text-xs text-slate-500 dark:text-[#A3A3A3] font-mono-code uppercase">Exemple Plan Retraite 25 000 FCFA / mois</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">4 820 000 FCFA <span className="text-xs text-slate-500 dark:text-[#A3A3A3] font-normal">capital estimé à 10 ans</span></div>
                <div className="text-xs text-slate-500 dark:text-[#A3A3A3] mt-2">Rendement annuel garanti : 4.25% net + participation bénéfices</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowLoanModal(false)}
                className="bg-[#E21E26] hover:bg-[#c00017] text-white px-5 py-2 rounded font-medium text-sm transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
