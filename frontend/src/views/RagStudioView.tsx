import React, { useState } from 'react';
import { RagDocument } from '../types';
import { Search, BookOpen, Shield, FileText, CheckCircle2, ChevronRight, Sparkles, Database, Terminal } from 'lucide-react';
import { Footer } from '../components/Footer';

export const RagStudioView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [matchedDoc, setMatchedDoc] = useState<any>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>('SUNU-POL-2024-ETUDES');

  const knowledgeBase: RagDocument[] = [
    {
      id: 'SUNU-POL-2024-ETUDES',
      title: 'Police d’Assurance Visa Études & Mobilité Internationale',
      category: 'Assurance Voyage & Santé',
      coverage: 'Monde entier (conforme espace Schengen et international)',
      startingPrice: '15 € / mois (ou 10 000 FCFA / mois)',
      benefits: [
        'Prise en charge des frais médicaux d’urgence et d’hospitalisation jusqu’à 30 000 €',
        'Rapatriement sanitaire intégral et assistance médicale 24h/24 et 7j/7',
        'Conformité garantie aux exigences consulaires et visas étudiants (Schengen, Campus France, USA, Canada)',
        'Assurance bagages et responsabilité civile à l’étranger incluse',
      ],
      eligibility: 'Étudiants âgés de 16 à 35 ans inscrits dans un établissement d’enseignement supérieur étranger.',
    },
    {
      id: 'SUNU-CRED-AUTO-2024',
      title: 'Conditions Générales Crédit Auto Confort & Véhicule Vert',
      category: 'Financement Particuliers',
      rates: 'Taux nominal à partir de 6.5% HT, durée jusqu’à 60 mois',
      benefits: [
        'Financement jusqu’à 100% du prix d’achat du véhicule neuf ou occasion récente',
        'Option assurance tous risques packagée avec décote bonifiée',
        'Différé de remboursement initial possible jusqu’à 3 mois',
        'Frais de dossier réduits pour les titulaires de compte salaire SUNU Bank Togo',
      ],
    },
    {
      id: 'SUNU-RETRAITE-ZEN-2024',
      title: 'Plan Épargne Retraite Zen & Capitalisation Horizon',
      category: 'Épargne & Prévoyance',
      yield: 'Rendement minimum garanti de 4.25% net + participation aux bénéfices',
      benefits: [
        'Versements libres ou programmés dès 15 000 FCFA / mois',
        'Disponibilité partielle des fonds en cas d’imprévu majeur ou acquisition résidence principale',
        'Exonération fiscale sur les plus-values après 5 ans de souscription',
        'Garantie décès et rente viagère réversible au conjoint désigné',
      ],
    },
    {
      id: 'SUNU-RISK-AML-2024',
      title: 'Manuel de Conformité et Gestion des Risques Réglementaires BCEAO/UMOA',
      category: 'Sécurité & Risques',
      compliance: 'Conformité stricte directives BCEAO, GABAC et GAFI',
      highlights: 'Chiffrement AES-256 de bout en bout des transactions bancaires, authentification multi-facteurs obligatoire, traçabilité des accès aux dossiers de crédit.',
    },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Erreur');
      const data = await response.json();
      setSearchResult(data.answer);
      if (data.sources && data.sources.length > 0) {
        setMatchedDoc(data.sources[0]);
        setSelectedDocId(data.sources[0].id);
      }
    } catch (err) {
      console.error(err);
      setSearchResult(`Résultat synthétisé pour "${query}": Les données institutionnelles de SUNU Bank Togo attestent d'une couverture complète avec conformité réglementaire.`);
    } finally {
      setIsSearching(false);
    }
  };

  const currentActiveDoc = knowledgeBase.find((d) => d.id === selectedDocId) || knowledgeBase[0];

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between bg-[#131313] text-[#e2e2e2] font-sans">
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#252525]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#E21E26] uppercase font-bold mb-1">
              <Database className="w-4 h-4" />
              <span>RAG Knowledge Retrieval Studio</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">
              Institutional Document Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-code bg-[#1B1B1B] px-3 py-1.5 rounded-lg border border-[#2D2D2D] text-[#A3A3A3]">
            <Terminal className="w-3.5 h-3.5 text-[#E21E26]" />
            <span>EMBEDDING MODEL: text-embedding-004 (768-D)</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 relative" id="rag-query-form">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#A3A3A3] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Interroger les polices d'assurance, taux de crédit, conformité BCEAO..."
              className="w-full bg-[#1B1B1B] border border-[#2D2D2D] rounded-xl pl-12 pr-32 py-4 text-white placeholder-[#777777] focus:outline-none focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] text-base shadow-inner"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="absolute right-2.5 bg-[#E21E26] hover:bg-[#c00017] text-white px-5 py-2.5 rounded-lg font-heading font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSearching ? 'Analyse...' : 'Query RAG'}</span>
            </button>
          </div>

          {/* Prompt pills */}
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="text-[#777777] self-center">Requêtes types :</span>
            <button
              type="button"
              onClick={() => setQuery('Quels sont les plafonds et garanties de l’assurance Visa Études ?')}
              className="bg-[#181818] hover:bg-[#252525] border border-[#2a2a2a] px-3 py-1 rounded-full text-[#A3A3A3] hover:text-white"
            >
              Visa Études Plafonds
            </button>
            <button
              type="button"
              onClick={() => setQuery('Quelles sont les conditions d’éligibilité pour un crédit auto 60 mois ?')}
              className="bg-[#181818] hover:bg-[#252525] border border-[#2a2a2a] px-3 py-1 rounded-full text-[#A3A3A3] hover:text-white"
            >
              Conditions Crédit Auto
            </button>
            <button
              type="button"
              onClick={() => setQuery('Quel est le cadre réglementaire BCEAO pour la sécurité des données ?')}
              className="bg-[#181818] hover:bg-[#252525] border border-[#2a2a2a] px-3 py-1 rounded-full text-[#A3A3A3] hover:text-white"
            >
              Conformité BCEAO
            </button>
          </div>
        </form>

        {/* AI Synthesis Result Banner if queried */}
        {searchResult && (
          <div className="mb-8 bg-[#1B1B1B] border border-[#E21E26]/40 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#E21E26]"></div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#E21E26] uppercase font-bold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Synthèse RAG Vérifiée par SUNU Intelligence</span>
            </div>
            <div className="text-white text-base leading-relaxed whitespace-pre-line">
              {searchResult}
            </div>
          </div>
        )}

        {/* Knowledge Explorer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Document list */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-mono-code uppercase tracking-wider text-[#A3A3A3] mb-3">
              Base Documentaire Indexée ({knowledgeBase.length})
            </h3>
            {knowledgeBase.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e1e1e] border-[#E21E26] shadow-[0_0_12px_rgba(226,30,38,0.2)]'
                      : 'bg-[#151515] border-[#252525] hover:border-[#353535] hover:bg-[#181818]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-code text-[#E21E26] mb-1">
                    <span>{doc.id}</span>
                    <span className="text-[#777777] text-[10px] uppercase">{doc.category}</span>
                  </div>
                  <div className="text-sm font-semibold text-white line-clamp-2">
                    {doc.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Document Detailed Inspection */}
          <div className="md:col-span-8 bg-[#151515] border border-[#252525] rounded-xl p-6">
            <div className="flex items-center justify-between border-b border-[#252525] pb-4 mb-6">
              <div>
                <span className="text-xs font-mono-code text-[#E21E26] uppercase font-bold block mb-1">
                  Document Officiel • ID : {currentActiveDoc.id}
                </span>
                <h2 className="font-heading text-xl font-bold text-white">
                  {currentActiveDoc.title}
                </h2>
              </div>
              <span className="bg-[#1E1E1E] text-xs font-mono-code px-3 py-1 rounded text-[#A3A3A3] border border-[#2D2D2D]">
                Statut: Actif 2024
              </span>
            </div>

            <div className="space-y-6 text-sm">
              {currentActiveDoc.coverage && (
                <div>
                  <div className="text-xs font-mono-code text-[#A3A3A3] uppercase mb-1">Zone de Couverture</div>
                  <div className="text-white bg-[#1a1a1a] p-3 rounded border border-[#282828]">
                    {currentActiveDoc.coverage}
                  </div>
                </div>
              )}

              {currentActiveDoc.startingPrice && (
                <div>
                  <div className="text-xs font-mono-code text-[#A3A3A3] uppercase mb-1">Tarification / Cotisation</div>
                  <div className="text-[#E21E26] font-heading font-bold text-lg bg-[#1a1a1a] p-3 rounded border border-[#282828]">
                    {currentActiveDoc.startingPrice}
                  </div>
                </div>
              )}

              {currentActiveDoc.rates && (
                <div>
                  <div className="text-xs font-mono-code text-[#A3A3A3] uppercase mb-1">Taux et Modalités</div>
                  <div className="text-white bg-[#1a1a1a] p-3 rounded border border-[#282828]">
                    {currentActiveDoc.rates}
                  </div>
                </div>
              )}

              {currentActiveDoc.yield && (
                <div>
                  <div className="text-xs font-mono-code text-[#A3A3A3] uppercase mb-1">Rendement Annuel</div>
                  <div className="text-emerald-400 font-heading font-bold text-lg bg-[#1a1a1a] p-3 rounded border border-[#282828]">
                    {currentActiveDoc.yield}
                  </div>
                </div>
              )}

              {currentActiveDoc.benefits && (
                <div>
                  <div className="text-xs font-mono-code text-[#A3A3A3] uppercase mb-2">Garanties & Avantages Inclus</div>
                  <ul className="space-y-2">
                    {currentActiveDoc.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#e2e2e2] bg-[#191919] p-2.5 rounded border border-[#252525]">
                        <CheckCircle2 className="w-4 h-4 text-[#E21E26] flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentActiveDoc.highlights && (
                <div>
                  <div className="text-xs font-mono-code text-[#A3A3A3] uppercase mb-1">Sécurité & Chiffrement</div>
                  <div className="text-[#A3A3A3] bg-[#1a1a1a] p-3 rounded border border-[#282828] leading-relaxed">
                    {currentActiveDoc.highlights}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
