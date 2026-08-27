import React, { useState } from 'react';
import { Shield, X, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  fixed?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ fixed = false }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'security' | null>(null);

  return (
    <>
      <footer
        id="sunu-footer"
        className={`w-full bg-[#0e0e0e] border-t border-[#1E1E1E] flex flex-col md:flex-row justify-between items-center py-3 px-4 md:px-10 gap-4 text-xs z-20 ${
          fixed ? 'fixed bottom-0 left-0 right-0' : 'mt-auto relative'
        }`}
      >
        <div className="font-mono-code text-[#e7bdb8] uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#E21E26]" />
          <span>SUNU Bank Togo</span>
        </div>

        <div className="text-[#A3A3A3] flex flex-col md:flex-row gap-4 items-center font-sans">
          <span>© 2024 SUNU Bank Togo. Secure Banking Intelligence.</span>
          <div className="flex gap-4">
            <button
              id="footer-privacy-btn"
              onClick={() => setActiveModal('privacy')}
              className="hover:text-[#e2e2e2] transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <button
              id="footer-terms-btn"
              onClick={() => setActiveModal('terms')}
              className="hover:text-[#e2e2e2] transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
            </button>
            <button
              id="footer-security-btn"
              onClick={() => setActiveModal('security')}
              className="hover:text-[#e2e2e2] transition-colors underline-offset-4 hover:underline"
            >
              Security Disclosure
            </button>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#191919] border border-[#2D2D2D] rounded-xl max-w-lg w-full p-6 text-[#e2e2e2] shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#A3A3A3] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'privacy' && (
              <div>
                <div className="flex items-center gap-2 text-[#E21E26] font-heading font-bold text-lg mb-4">
                  <FileText className="w-5 h-5" />
                  <h3>Politique de Confidentialité - SUNU Bank Togo</h3>
                </div>
                <div className="space-y-3 text-sm text-[#A3A3A3] leading-relaxed max-h-80 overflow-y-auto pr-2">
                  <p>
                    Conformément aux dispositions légales de la BCEAO et de l'UEMOA, SUNU Bank Togo garantit la confidentialité totale et le traitement sécurisé de vos données bancaires et personnelles.
                  </p>
                  <p>
                    Toutes les requêtes adressées au Concierge Financier et au portail RAG sont anonymisées, isolées et protégées par des mécanismes cryptographiques de pointe.
                  </p>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#E21E26]" />
                    <span>Hébergement sécurisé haute disponibilité</span>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div>
                <div className="flex items-center gap-2 text-[#E21E26] font-heading font-bold text-lg mb-4">
                  <FileText className="w-5 h-5" />
                  <h3>Conditions Générales d'Utilisation</h3>
                </div>
                <div className="space-y-3 text-sm text-[#A3A3A3] leading-relaxed max-h-80 overflow-y-auto pr-2">
                  <p>
                    L'accès aux services digitaux et au RAG Portal est réservé aux clients identifiés et collaborateurs accrédités de SUNU Bank Togo.
                  </p>
                  <p>
                    Les simulations tarifaires émises par le Concierge sont fournies à titre indicatif sous réserve d'acceptation du dossier par nos comités de crédit et d'assurance.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'security' && (
              <div>
                <div className="flex items-center gap-2 text-[#E21E26] font-heading font-bold text-lg mb-4">
                  <Lock className="w-5 h-5" />
                  <h3>Engagement de Sécurité & Conformité</h3>
                </div>
                <div className="space-y-3 text-sm text-[#A3A3A3] leading-relaxed max-h-80 overflow-y-auto pr-2">
                  <p>
                    Infrastructure durcie avec chiffrement AES-256 en transit et au repos, surveillance SOC 24/7 et authentification forte multi-facteurs (MFA).
                  </p>
                  <p className="border-l-2 border-[#E21E26] pl-3 py-1 text-white bg-[#121212]">
                    Conformité stricte : Normes PCI-DSS, ISO/IEC 27001 et Réglementation Bancaire UMOA.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#E21E26] hover:bg-[#c00017] text-white px-5 py-2 rounded font-medium text-sm transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
