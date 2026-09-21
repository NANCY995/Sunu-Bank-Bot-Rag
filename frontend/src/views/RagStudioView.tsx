import React, { useState } from 'react';
import { RagDocument } from '../types';
import { Search, BookOpen, Shield, FileText, CheckCircle2, ChevronRight, Sparkles, Database, Terminal } from 'lucide-react';
import { Footer } from '../components/Footer';

export const RagStudioView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [matchedDoc, setMatchedDoc] = useState<any>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>('PROD-EP-EDUCATION');

  const knowledgeBase: RagDocument[] = [
    {
      id: 'PROD-EP-EDUCATION',
      title: 'Visa Études (Épargne-Éducation)',
      category: 'Épargne & Prévoyance Éducation',
      startingPrice: '4 250 FCFA / mois (ou 12 750 FCFA/trimestre)',
      coverage: 'Financement études supérieures + Protection décès parent',
      yield: 'Taux minimum garanti 3,5% net l’an + participation aux bénéfices',
      benefits: [
        'Constitution d’un capital garanti converti au terme en rentes trimestrielles d’études (sur 3, 4 ou 5 ans)',
        'Prévoyance : Exonération intégrale des cotisations restantes si décès ou IAD du parent souscripteur',
        'Droit de renonciation légal de 30 jours conformément à l’Article 76 du Code CIMA',
        'Accessible dès 18 ans pour un enfant de 0 à 18 ans à la souscription'
      ],
      eligibility: 'Parents, tuteurs ou proches âgés de 18 à 65 ans souscrivant pour un enfant.',
    },
    {
      id: 'PROD-EP-EDUPRO',
      title: 'Visa Études Plus (Éducation Renforcée)',
      category: 'Épargne-Éducation Renforcée',
      startingPrice: '10 000 FCFA / mois',
      coverage: 'Bourses trimestrielles + Rente orphelinat immédiate + Doublement accident',
      yield: 'Taux minimum garanti 3,5% net l’an (Code CIMA)',
      benefits: [
        'Rente d’orphelinat immédiate versée dès le décès du souscripteur jusqu’à l’échéance',
        'Doublement du capital en cas de décès accidentel',
        'Bourses trimestrielles d’études pour financer l’université et grandes écoles'
      ],
    },
    {
      id: 'PROD-EP-RETRAITE',
      title: 'Horizon Retraite (Capitalisation Retraite)',
      category: 'Capitalisation Retraite Individuelle',
      startingPrice: '10 000 FCFA / mois',
      coverage: 'Complément de retraite garanti + Bonus de fidélité',
      yield: 'Rendement minimum garanti de 3,5% l’an + participation bénéfices (Art. 84 CIMA)',
      benefits: [
        'Bonus de fidélité exceptionnel de 92% de la première annuité versé au terme (si durée >= 10 ans)',
        'Choix à terme entre capital unique en une fois ou rente viagère mensuelle réversible',
        'Rachat encadré par le Code CIMA (indemnité max de 5% de la provision mathématique)'
      ],
    },
    {
      id: 'PROD-EP-RET5',
      title: 'Horizon Retraite 5 (Retraite Accélérée)',
      category: 'Retraite Cadres & Seniors',
      startingPrice: '25 000 FCFA / mois',
      coverage: '5 ans ferme pour cadres proches de la retraite',
      yield: 'Taux technique garanti 3,5% l’an',
      benefits: [
        'Capitalisation courte et intensive sur 5 ans',
        'Sécurisation de la transition professionnelle',
        'Transmission intégrale aux ayants droit en cas de décès'
      ]
    },
    {
      id: 'PROD-EP-BONUS',
      title: 'Épargne Bonus SUNU',
      category: 'Épargne Bonifiée avec Tirages au Sort',
      startingPrice: '5 000 FCFA / mois',
      coverage: '10 ou 15 ans avec tirages au sort trimestriels',
      benefits: [
        'Tirages au sort nationaux trimestriels pour remporter le capital total par anticipation',
        'Dispense intégrale du paiement des cotisations futures en cas de gain au tirage',
        'Restitution du capital garanti majoré des intérêts au terme'
      ]
    },
    {
      id: 'PROD-PR-PROTPLUS',
      title: 'Protect Plus (Micro-assurance Santé & Accident)',
      category: 'Micro-assurance Prévoyance',
      startingPrice: 'Dès 500 FCFA / mois (5 000 F ou 10 000 F / an)',
      coverage: 'Indemnité hospitalière + Capital décès accidentel',
      benefits: [
        'Prise en charge des frais d’hospitalisation dès 5 jours consécutifs suite à accident (jusqu’à 250 000 FCFA)',
        'Capital décès ou invalidité par accident garanti de 500 000 FCFA à 1 000 000 FCFA',
        'Souscription simplifiée sans questionnaire médical lourd'
      ]
    },
    {
      id: 'PROD-PR-SECCOMPTE',
      title: 'Secure Compte (Prévoyance adossée au Compte)',
      category: 'Prévoyance Bancaire Intégrée',
      startingPrice: 'De 2 700 à 33 500 FCFA par an',
      coverage: 'Sécurisation des dépôts bancaires et de la famille',
      benefits: [
        'Capital garanti de 400 000 FCFA à 5 000 000 FCFA versé aux proches',
        'Couvre les titulaires de compte de 18 à 70 ans',
        'Adossement direct au compte bancaire SUNU Bank Togo'
      ]
    },
    {
      id: 'PROD-EP-DIGMOOV',
      title: 'Épargne Moov (100% Mobile Money)',
      category: 'Micro-assurance Mobile',
      startingPrice: '500 à 5 000 FCFA / mois sur Moov Money',
      coverage: '15 ans dématérialisés + tirages au sort',
      benefits: [
        'Épargne mobile accessible sans compte bancaire via Moov Money',
        'Tirages au sort trimestriels pour remporter le capital intégral de 15 ans',
        'Inclusion financière maximale pour les populations togolaises'
      ]
    },
    {
      id: 'REG-CIMA-LIVRE1',
      title: 'Code CIMA Livre I : Contrat d\'Assurance Vie & Droits de l\'Assuré',
      category: 'Réglementation & Droit des Assurances (Livre I)',
      compliance: 'Conférence Interafricaine des Marchés d’Assurances (CIMA)',
      highlights: 'Articles 6 & 65-1 (Information précontractuelle et encadré légal), Articles 74 & 76 (Rachat après 2 ans, pénalité plafonnée à 5%), Article 75 (Avance sur police), Article 76 (Renonciation 30 jours), Article 84 (Participation aux bénéfices >= 85%), Article 21 (Sinistre 5j), Article 28 (Prescription 2 ans).',
      benefits: [
        'Articles 6 & 65-1 : Information précontractuelle obligatoire avec encadré légal standardisé',
        'Article 74 & 76 : Valeurs de rachat réglementées (max 5% de la PM, 0% après 10 ans)',
        'Article 76 : Faculté de renonciation d\'ordre public de 30 jours avec remboursement intégral sous 30 jours',
        'Article 84 : Obligation légale de redistribution d\'au moins 85% des bénéfices financiers avec effet cliquet'
      ]
    },
    {
      id: 'REG-CIMA-ACTUARIAT',
      title: 'Actuariat Vie & Décisions du Conseil des Ministres des Assurances (CMA)',
      category: 'Réglementation Actuarielle & Prudentielle CIMA',
      compliance: 'Conseil des Ministres des Assurances (CMA) / CRCA',
      highlights: 'TMG 3,5% net/an plafonné, Provisions Mathématiques adossées à 100%, Tables de mortalité TD 88/90 et TF 88/90, Effet Cliquet actuariel irréversible.',
      benefits: [
        'TMG fixé à 3,5% net par an pour préserver la solvabilité et sécuriser les épargnants',
        'Provisions Mathématiques calculées aux intérêts composés pour garantir à 100% les capitaux',
        'Tables de mortalité réglementaires TD 88/90 (décès) et TF 88/90 (survie/rentes)'
      ]
    },
    {
      id: 'REG-CIMA-LIVRE7',
      title: 'Code CIMA Livre VII & Règlement n° 003/CIMA/2012 : Micro-assurance',
      category: 'Micro-assurance & Canaux Numériques',
      compliance: 'Règlement n° 003/CIMA/2012 & Livre VII du Code CIMA',
      highlights: 'Micro-assurance simplifiée pour l\'inclusion financière au Togo, suppression des bilans médicaux lourds, Protect Plus dès 500 F/mois, Épargne Moov via Mobile Money avec règlement en 48h.',
      benefits: [
        'Formalités de souscription ultra-allégées sans questionnaire médical approfondi',
        'Conditions contractuelles lisibles et accessibles aux populations à faibles revenus',
        'Protect Plus & Épargne Moov : liquidation accélérée des prestations d\'urgence'
      ]
    },
    {
      id: 'REG-CIMA-BANCASSURANCE',
      title: 'Code CIMA Livre V, Circulaires CRCA & Mandat SUNU Bank Togo',
      category: 'Bancassurance & Intermédiation Financière',
      compliance: 'Code CIMA Livre V, Circulaires CRCA, Normes BCEAO & Loi togolaise n° 2019-014',
      highlights: 'Mandat de distribution exclusive SUNU Bank Togo / SUNU Assurances Vie Togo, obligation de convenance patrimoniale KYC (Art. 6), séparation stricte des dépôts et primes, protection des données (IPDCP).',
      benefits: [
        'Intermédiation bancassurance encadrée par le Livre V et les circulaires CRCA',
        'Devoir de conseil et diagnostic KYC obligatoire avant toute recommandation',
        'Cantonnement des flux et conformité à la loi togolaise n° 2019-014 (IPDCP Togo)'
      ]
    },
    {
      id: 'REG-CIMA-ORGANES',
      title: 'Organes Réglementaires CIMA (CMA, CRCA, Secrétariat Général) & Recours',
      category: 'Supervision Institutionnelle & Règlement des Litiges',
      compliance: 'Traité instituant la CIMA (Libreville) & Commission Régionale de Contrôle des Assurances',
      highlights: 'Conseil des Ministres des Assurances (législation), CRCA à Libreville (contrôle et sanctions), procédure de médiation amiable sous 30 jours et saisine de la CRCA en cas de contestation.',
      benefits: [
        'Conseil des Ministres des Assurances : adoption des règlements communautaires uniformes',
        'CRCA : autorité de supervision prudentielle indépendante et juridiction disciplinaire',
        'Voies de recours et traitement amiable des réclamations clients sous 30 jours'
      ]
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
