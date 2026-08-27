import React, { useState } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, LayoutDashboard, Shield, Sparkles } from 'lucide-react';
import { Footer } from '../components/Footer';

export const StreamlitView: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const streamlitUrl = 'http://localhost:8501';

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey(Date.now());
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between bg-[#131313] text-[#e2e2e2] font-sans">
      {/* Top Banner with direct links & control */}
      <div className="bg-[#181818] border-b border-[#262626] px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E21E26]/10 border border-[#E21E26]/30 flex items-center justify-center text-[#E21E26]">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-white text-sm md:text-base">
                Portail Métier & Analytics SUNU Bank (Streamlit)
              </h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono-code px-2 py-0.5 rounded">
                Port: 8501
              </span>
            </div>
            <p className="text-xs text-[#888888]">
              Tableau de bord, Scoring Churn, Fraude, Provisionnement CIMA & Chat RAG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#222222] hover:bg-[#2c2c2c] border border-[#333333] text-[#e2e2e2] transition-colors cursor-pointer"
            title="Recharger l'interface Streamlit"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <a
            href={streamlitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#E21E26] hover:bg-[#c00017] text-white transition-all shadow-md cursor-pointer"
            title="Ouvrir dans un nouvel onglet"
          >
            <span>Ouvrir en plein écran</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Iframe Canvas */}
      <main className="flex-1 w-full relative bg-[#0f0f0f] min-h-[600px] flex flex-col">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#131313]/90 backdrop-blur-sm gap-3">
            <div className="w-10 h-10 border-3 border-[#E21E26] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono-code text-[#A3A3A3]">
              Connexion au serveur Streamlit sur {streamlitUrl}...
            </p>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-[#131313]">
            <div className="w-16 h-16 rounded-2xl bg-[#93000a]/20 border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab] mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">
              Impossible de joindre le serveur Streamlit (8501)
            </h3>
            <p className="text-sm text-[#A3A3A3] max-w-md mb-6 leading-relaxed">
              Assurez-vous que l'application Streamlit est lancée dans votre terminal avec la commande :
            </p>
            <div className="bg-[#0a0a0a] border border-[#252525] rounded-lg p-3 font-mono-code text-xs text-emerald-400 max-w-lg w-full text-left mb-6 overflow-x-auto">
              <code>streamlit run app/app.py --server.port 8501</code>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="bg-[#E21E26] hover:bg-[#c00017] text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Réessayer la connexion
              </button>
              <a
                href={streamlitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#222222] hover:bg-[#333333] border border-[#333333] text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                Tester le lien direct
              </a>
            </div>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={streamlitUrl}
          title="SUNU Bank Streamlit Analytics Portal"
          className="w-full flex-1 border-none min-h-[calc(100vh-140px)]"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </main>

      <Footer />
    </div>
  );
};
