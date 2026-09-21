import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, SimulationData } from '../types';
import { 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  FileDown, 
  Check, 
  ExternalLink,
  Zap,
  Globe,
  SlidersHorizontal,
  Copy,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Share2,
  BookOpen,
  Scale,
  Search,
  Printer,
  ThumbsUp,
  ThumbsDown,
  Compass,
  CheckCircle2,
  ArrowLeftRight,
  Star,
  Target
} from 'lucide-react';
import { FormattedMessage } from '../components/FormattedMessage';
import logoSunu from '../../assets/LOGO-SUNU.png';

interface ConciergeChatViewProps {
  initialMessage?: string;
  onNavigateHome: () => void;
}

export interface PortfolioProduct {
  id: string;
  name: string;
  category: string;
  minAmount: number;
  defaultAmount: number;
  defaultDuration: number;
  minDur: number;
  maxDur: number;
  target: string;
  payout: string;
  prevoyance: string;
  isEpargne: boolean;
  tauxGaranti: string;
  rachatCima: string;
  renonciation: string;
  participationBenefices: string;
  pointFort: string;
  quiDevraitChoisir: string;
}

const PORTFOLIO_PRODUCTS: PortfolioProduct[] = [
  {
    id: 'visa_etudes',
    name: 'Visa Études',
    category: 'Épargne-Éducation',
    minAmount: 4250,
    defaultAmount: 15000,
    defaultDuration: 10,
    minDur: 3,
    maxDur: 15,
    target: "Parents et tuteurs d'enfants de 0 à 18 ans",
    payout: 'Capital unique ou rentes trimestrielles sur 3 à 5 ans',
    prevoyance: 'Exonération totale des cotisations restantes si décès/IAD du parent souscripteur',
    isEpargne: true,
    tauxGaranti: '3,5% net l\'an (TMG Code CIMA)',
    rachatCima: 'Autorisé après 2 ans (Art. 74) • Pénalité max 5% (Art. 76) • 0% après 10 ans',
    renonciation: '30 jours calendaires (Art. 76 CIMA) avec remboursement intégral sans frais',
    participationBenefices: 'Oui (Art. 84 CIMA) — redistribution d\'au moins 85% des bénéfices financiers',
    pointFort: 'Idéal budget modéré (dès 4 250 F/mois) : garantit les bourses scolaires de l\'enfant même en cas de décès du parent.',
    quiDevraitChoisir: 'Parents souhaitant constituer pas à pas une réserve scolaire garantie pour l\'avenir de leur enfant.'
  },
  {
    id: 'visa_etudes_plus',
    name: 'Visa Études Plus',
    category: 'Éducation Renforcée & Prévoyance Famille',
    minAmount: 10000,
    defaultAmount: 20000,
    defaultDuration: 10,
    minDur: 5,
    maxDur: 15,
    target: 'Familles souhaitant une couverture prévoyance maximale pour les études supérieures',
    payout: 'Rentes trimestrielles éducation échelonnées',
    prevoyance: 'Rente d\'orphelinat immédiate + Doublement du capital en cas de décès accidentel',
    isEpargne: true,
    tauxGaranti: '3,5% net l\'an (TMG Code CIMA)',
    rachatCima: 'Autorisé après 2 ans (Art. 74) • Pénalité max 5% (Art. 76) • 0% après 10 ans',
    renonciation: '30 jours calendaires (Art. 76 CIMA) avec remboursement intégral sans frais',
    participationBenefices: 'Oui (Art. 84 CIMA) — redistribution d\'au moins 85% des bénéfices financiers',
    pointFort: 'Couverture d\'élite : versement immédiat d\'une rente d\'orphelinat à l\'enfant dès le décès + doublement du capital si accident.',
    quiDevraitChoisir: 'Familles voulant garantir un revenu d\'orphelinat immédiat et une prise en charge complète jusqu\'au diplôme.'
  },
  {
    id: 'horizon_retraite',
    name: 'Horizon Retraite',
    category: 'Capitalisation Retraite Individuelle',
    minAmount: 10000,
    defaultAmount: 25000,
    defaultDuration: 15,
    minDur: 5,
    maxDur: 25,
    target: 'Salariés, fonctionnaires et professions libérales préparant leur retraite',
    payout: 'Capital unique en une fois ou rente viagère mensuelle réversible',
    prevoyance: 'Bonus de fidélité 92% annuité 1 + reversement épargne aux ayants droit',
    isEpargne: true,
    tauxGaranti: '3,5% net l\'an (TMG Code CIMA)',
    rachatCima: 'Autorisé après 2 ans (Art. 74) • Pénalité max 5% (Art. 76) • 0% après 10 ans',
    renonciation: '30 jours calendaires (Art. 76 CIMA) avec remboursement intégral sans frais',
    participationBenefices: 'Oui (Art. 84 CIMA) — redistribution annuelle des gains financiers',
    pointFort: 'Bonus de fidélité de 92% de la 1ère annuité pour toute durée ≥ 10 ans + rente viagère réversible au conjoint.',
    quiDevraitChoisir: 'Actifs de 25 à 55 ans désireux de maintenir leur niveau de vie à la retraite avec un bonus garanti exceptionnel.'
  },
  {
    id: 'horizon_retraite_5',
    name: 'Horizon Retraite 5',
    category: 'Retraite Accélérée 5 ans ferme',
    minAmount: 25000,
    defaultAmount: 50000,
    defaultDuration: 5,
    minDur: 5,
    maxDur: 5,
    target: 'Cadres et seniors à 5 ans de la cessation d\'activité',
    payout: 'Capitalisation accélérée restituée en capital unique au terme de 5 ans',
    prevoyance: 'Transmission intégrale du capital constitué aux bénéficiaires désignés',
    isEpargne: true,
    tauxGaranti: '3,5% net l\'an (TMG Code CIMA)',
    rachatCima: 'Autorisé après 2 ans de cotisations (Art. 74 CIMA) • Pénalité max 5%',
    renonciation: '30 jours calendaires (Art. 76 CIMA)',
    participationBenefices: 'Oui (Art. 84 CIMA)',
    pointFort: 'Horizon ultra-court de 5 ans pour rentabiliser rapidement une épargne avant le départ à la retraite.',
    quiDevraitChoisir: 'Professionnels seniors proches de la retraite disposant d\'une capacité d\'épargne mensuelle d\'au moins 25 000 FCFA.'
  },
  {
    id: 'epargne_bonus',
    name: 'Épargne Bonus SUNU',
    category: 'Épargne Bonifiée avec Tirages au Sort',
    minAmount: 5000,
    defaultAmount: 10000,
    defaultDuration: 10,
    minDur: 10,
    maxDur: 15,
    target: 'Épargnants cherchant une rentabilité sécurisée doublée d\'opportunités de gains anticipés',
    payout: 'Capital garanti à terme ou versement anticipé de l\'intégralité si tirage gagnant',
    prevoyance: 'Gain au tirage = versement immédiat du capital total prévu + dispense des primes futures',
    isEpargne: true,
    tauxGaranti: '3,5% net l\'an + Participation aux bénéfices',
    rachatCima: 'Autorisé après 2 ans (Art. 74) • Encadré par les règles des contrats à tirages CIMA',
    renonciation: '30 jours calendaires (Art. 76 CIMA)',
    participationBenefices: 'Oui (Art. 84 CIMA)',
    pointFort: 'Double opportunité : votre capital fructifie à 3,5% et vous pouvez gagner le capital complet dès les premiers trimestres !',
    quiDevraitChoisir: 'Épargnants dynamiques voulant valoriser leur argent tout en tentant leur chance à chaque tirage trimestriel.'
  },
  {
    id: 'protect_plus',
    name: 'Protect Plus',
    category: 'Micro-assurance Santé & Prévoyance',
    minAmount: 500,
    defaultAmount: 1000,
    defaultDuration: 1,
    minDur: 1,
    maxDur: 1,
    target: 'Artisans, commerçants, travailleurs indépendants et ménages modestes',
    payout: 'Forfait hospitalisation dès 5j (150 000 à 250 000 FCFA)',
    prevoyance: 'Capital décès / invalidité accidentel de 500 000 à 1 000 000 FCFA',
    isEpargne: false,
    tauxGaranti: 'Tarif forfaitaire garanti (Livre VII Code CIMA)',
    rachatCima: 'Prévoyance annuelle à fonds perdus — Pas de valeur de rachat (Art. 74 non applicable)',
    renonciation: '30 jours calendaires (Art. 76 CIMA)',
    participationBenefices: 'Non applicable (assurance de risque)',
    pointFort: 'Ultra-accessible (dès 500 F/mois) sans bilan médical : protège en cas de blessure grave ou d\'hospitalisation prolongée.',
    quiDevraitChoisir: 'Artisans et familles recherchant un bouclier financier d\'urgence à prix minime contre les accidents.'
  },
  {
    id: 'secure_compte',
    name: 'Secure Compte',
    category: 'Prévoyance Compte Bancaire',
    minAmount: 1000,
    defaultAmount: 2500,
    defaultDuration: 1,
    minDur: 1,
    maxDur: 1,
    target: 'Titulaires de compte bancaire SUNU Bank Togo (18 à 70 ans)',
    payout: 'Capital décès ou invalidité adossé au compte (400 000 à 5 000 000 FCFA)',
    prevoyance: 'Paiement prioritaire sous 48h aux ayants droit en cas de coup dur',
    isEpargne: false,
    tauxGaranti: 'Tarif annuel forfaitaire garanti',
    rachatCima: 'Prévoyance annuelle à fonds perdus — Pas de valeur de rachat',
    renonciation: '30 jours calendaires (Art. 76 CIMA)',
    participationBenefices: 'Non applicable',
    pointFort: 'Protection automatique des découverts et de la famille prélevée directement une fois par an sur le compte bancaire.',
    quiDevraitChoisir: 'Tout client SUNU Bank souhaitant que ses proches soient protégés d\'un capital immédiat sans formalités.'
  },
  {
    id: 'epargne_moov',
    name: 'Épargne Moov',
    category: 'Micro-assurance & Mobile Money',
    minAmount: 500,
    defaultAmount: 2000,
    defaultDuration: 15,
    minDur: 15,
    maxDur: 15,
    target: 'Tout détenteur d\'un compte Moov Money au Togo, sans compte bancaire obligatoire',
    payout: 'Capitalisation 15 ans avec tirages au sort trimestriels nationaux',
    prevoyance: 'Libération anticipée du capital complet sur wallet en cas de tirage gagnant',
    isEpargne: true,
    tauxGaranti: '3,5% net l\'an (TMG CIMA)',
    rachatCima: 'Encadré par le Code CIMA Livre VII',
    renonciation: '30 jours calendaires (Art. 76 CIMA)',
    participationBenefices: 'Oui (Art. 84 CIMA)',
    pointFort: '100% digital et mobile : souscription et cotisations par USSD/appli Moov Money avec tirages trimestriels.',
    quiDevraitChoisir: 'Jeunes et populations du secteur informel cherchant une première épargne mobile sécurisée.'
  },
  {
    id: 'serenite',
    name: 'Sérénité',
    category: 'Épargne & Prévoyance Fin de Vie',
    minAmount: 5000,
    defaultAmount: 15000,
    defaultDuration: 10,
    minDur: 5,
    maxDur: 20,
    target: 'Personnes soucieuses de soulager leurs proches lors des cérémonies d\'obsèques',
    payout: 'Prise en charge d\'urgence des frais funéraires + capitalisation de l\'épargne restante',
    prevoyance: 'Capital décès et obsèques versé sous 48h aux bénéficiaires désignés',
    isEpargne: true,
    tauxGaranti: '3,5% net l\'an (TMG CIMA)',
    rachatCima: 'Autorisé après 2 ans (Art. 74) • Pénalité max 5% (Art. 76)',
    renonciation: '30 jours calendaires (Art. 76 CIMA)',
    participationBenefices: 'Oui (Art. 84 CIMA)',
    pointFort: 'Déblocage garanti sous 48h des fonds d\'obsèques pour une inhumation digne, sans épuiser les économies familiales.',
    quiDevraitChoisir: 'Toute personne prévoyante désirant éviter à ses proches la charge financière brutale d\'un deuil.'
  },
];

interface LexiconItem {
  term: string;
  category: 'Réglementation' | 'Actuariat' | 'Contrat' | 'Bancassurance';
  definition: string;
}

const CIMA_LEXICON: LexiconItem[] = [
  // 1. Réglementation CIMA & Protection du Souscripteur
  { term: 'Article 6 du Code CIMA', category: 'Réglementation', definition: 'Obligation légale d\'information précontractuelle imposant à la banque et à l\'assureur de remettre au souscripteur, avant la signature, une fiche synthétique claire sur les garanties, prix, exclusions et délais.' },
  { term: 'Article 65-1 du Code CIMA', category: 'Réglementation', definition: 'Encadré légal standardisé et obligatoire en tête de toute proposition d\'assurance vie, attirant expressément l\'attention du client sur la durée, le capital garanti, les rachats et les frais.' },
  { term: 'Valeur de rachat (Article 74)', category: 'Réglementation', definition: 'Montant récupérable par le souscripteur en cas de cessation anticipée. En zone CIMA, le rachat est strictement interdit avant 2 ans de cotisations effectives (ou 15% des primes prévues).' },
  { term: 'Plafonnement des frais de rachat (Art. 76)', category: 'Réglementation', definition: 'L\'indemnité ou pénalité de rachat est légalement plafonnée à un maximum strict de 5% de la provision mathématique. Tout rachat au-delà de 10 ans de contrat est obligatoirement sans pénalité (0%).' },
  { term: 'Faculté de renonciation de 30 jours (Art. 76)', category: 'Réglementation', definition: 'Droit légal d\'ordre public permettant à tout souscripteur d\'annuler son contrat dans un délai de 30 jours calendaires après signature avec remboursement intégral sous 30 jours sans frais.' },
  { term: 'Participation aux bénéfices (Article 84)', category: 'Réglementation', definition: 'Obligation réglementaire imposant à l\'assureur de redistribuer aux assurés au moins 85% des bénéfices financiers réalisés sur la gestion de leurs provisions mathématiques.' },
  { term: 'Prescription Biennale (Article 28)', category: 'Réglementation', definition: 'Toutes les actions et réclamations en justice dérivant d\'un contrat d\'assurance vie se prescrivent obligatoirement par deux ans à compter de l\'événement qui y donne naissance.' },
  { term: 'Déclaration de sinistre (Article 21)', category: 'Réglementation', definition: 'Obligation pour l\'assuré ou les bénéficiaires d\'aviser la compagnie d\'assurance de tout sinistre dès qu\'ils en ont connaissance, et au plus tard dans un délai légal de 5 jours ouvrés.' },
  { term: 'Commission Régionale de Contrôle (CRCA)', category: 'Réglementation', definition: 'Organe supranational de régulation et de supervision des assurances dans les 14 États membres de la CIMA, veillant à la solvabilité des compagnies et à la protection des souscripteurs.' },

  // 2. Actuariat & Littératie Financière
  { term: 'Taux d\'Intérêt Technique Garanti (TMG)', category: 'Actuariat', definition: 'Taux actuariel minimal fixé par la réglementation CIMA (réglementé à 3,5% net/an) que l\'assureur s\'engage à servir obligatoirement sur l\'épargne constituée, garantissant l\'absence de perte en capital.' },
  { term: 'Provision Mathématique (PM)', category: 'Actuariat', definition: 'Réserve financière réglementée inscrite au passif de l\'assureur pour garantir à 100% et à tout moment le paiement futur des capitaux garantis ou rentes dus aux souscripteurs.' },
  { term: 'Tables de Mortalité CIMA (TD/TF 88-90)', category: 'Actuariat', definition: 'Tables statistiques biométriques agréées par la CIMA pour mesurer les probabilités de survie et de décès des assurés de la zone francophone, servant de base au calcul actuariel des primes.' },
  { term: 'Capitalisation Actuarielle', category: 'Actuariat', definition: 'Mécanisme financier où les primes nettes versées produisent des intérêts composés annuels au TMG de 3,5% majorés de la participation aux bénéfices de l\'article 84.' },
  { term: 'Bonus de Fidélité Actuariel', category: 'Actuariat', definition: 'Majoration financière contractuelle (ex: 92% de la 1ère annuité pour Horizon Retraite) octroyée à l\'échéance au souscripteur ayant maintenu son contrat au moins 10 ans sans rachat.' },
  { term: 'Frais de Chargement', category: 'Actuariat', definition: 'Quotes-parts réglementées prélevées sur les cotisations pour couvrir l\'acquisition commerciale (rémunération bancassurance) et la gestion administrative du compte d\'assurance.' },

  // 3. Contrat, Prévoyance & Sinistres
  { term: 'Avance sur Police', category: 'Contrat', definition: 'Prêt à taux modéré consenti par l\'assureur au souscripteur, gagé sur sa provision mathématique, lui permettant d\'obtenir des liquidités d\'urgence sans résilier son contrat ni perdre ses garanties.' },
  { term: 'Réduction du Contrat', category: 'Contrat', definition: 'Opération permettant à un assuré qui interrompt ses cotisations après 2 ans de maintenir son contrat en vigueur pour un capital réduit garanti, sans pénalité de rachat.' },
  { term: 'Rente Viagère Réversible', category: 'Contrat', definition: 'Revenu régulier garanti versé à vie à l\'assuré à sa retraite, pouvant être réversé au conjoint survivant en cas de décès (ex: option de sortie Horizon Retraite).' },
  { term: 'Rente d\'Orphelinat Immédiate', category: 'Contrat', definition: 'Prestation spécifique de Visa Études Plus versée immédiatement sous forme d\'allocation régulière à l\'enfant dès le décès du parent jusqu\'au début de ses études supérieures.' },
  { term: 'Clause Bénéficiaire', category: 'Contrat', definition: 'Désignation expresse dans le contrat de la personne physique ou morale qui percevra le capital ou la rente en cas de décès de l\'assuré, avec possibilité de démembrement usufruit/nue-propriété.' },
  { term: 'Bénéficiaire Acceptant', category: 'Contrat', definition: 'Bénéficiaire ayant notifié son accord officiel sur le contrat. Dès son acceptation, le souscripteur ne peut plus modifier la clause ni demander de rachat sans son accord exprès.' },
  { term: 'Délai de Carence (Stage d\'attente)', category: 'Contrat', definition: 'Période initiale du contrat pendant laquelle certaines garanties ne sont pas encore applicables en cas de maladie (généralement exclue en cas d\'accident corporel direct).' },
  { term: 'Invalidité Absolue et Définitive (IAD)', category: 'Contrat', definition: 'Incapacité physique totale et permanente empêchant l\'assuré de se livrer à toute activité rémunérée et nécessitant l\'aide d\'un tiers, déclenchant le versement anticipé du capital décès.' },
  { term: 'Exclusion de Garantie', category: 'Contrat', definition: 'Circonstances formellement exclues de la couverture par le Code CIMA ou les conditions générales (ex: suicide au cours de la 1ère année selon l\'Art. 63, guerre, acte criminel).' },
  { term: 'Déchéance de Garantie', category: 'Contrat', definition: 'Perte du droit aux prestations consécutive au manquement intentionnel de l\'assuré à une obligation contractuelle après la survenance d\'un sinistre (ex: fausse déclaration intentionnelle).' },

  // 4. Bancassurance & Inclusion Financière Togo
  { term: 'Bancassurance Intégrée', category: 'Bancassurance', definition: 'Partenariat stratégique permettant à SUNU Bank Togo de commercialiser les contrats de SUNU Assurances Vie Togo, avec prélèvements sécurisés et gestion intégrée au compte bancaire.' },
  { term: 'Micro-assurance (Livre VII CIMA)', category: 'Bancassurance', definition: 'Régime d\'assurance simplifié adapté aux ménages modestes, commerçants et secteur informel du Togo (ex: Protect Plus dès 500 F/mois), caractérisé par une souscription sans bilan médical lourd.' },
  { term: 'Épargne Mobile Money (Moov Money)', category: 'Bancassurance', definition: 'Solution d\'assurance 100% digitale accessible au Togo sur smartphone via Moov Money, permettant de cotiser et de percevoir des tirages au sort sans compte bancaire traditionnel.' },
  { term: 'Tirage au Sort Trimestriel', category: 'Bancassurance', definition: 'Dispositif réglementé (Épargne Bonus / Moov) permettant au souscripteur gagnant au tirage de toucher immédiatement l\'intégralité du capital prévu à terme, avec dispense totale des primes restantes.' },
  { term: 'Capital Obsèques d\'Urgence (Sérénité)', category: 'Bancassurance', definition: 'Prestation prévoyance avec déblocage prioritaire sous 48 heures des fonds nécessaires aux dépenses funéraires, soulageant la famille des charges imprévues.' },
  { term: 'Diagnostic de Convenance KYC (Art. 6)', category: 'Bancassurance', definition: 'Obligation pour le banquier-assureur d\'évaluer la capacité financière, les objectifs patrimoniaux et l\'horizon de l\'usager avant de recommander un contrat d\'assurance vie adapté.' },
  { term: 'Protection des Données (IPDCP Togo)', category: 'Bancassurance', definition: 'Conformité à la loi togolaise n° 2019-014 encadrant la collecte, le traitement et la confidentialité des données personnelles et financières des souscripteurs en agence.' }
];

export interface ComparisonNeed {
  id: string;
  label: string;
  icon: string;
  desc: string;
  targetProductIds: string[];
}

export const COMPARISON_NEEDS: ComparisonNeed[] = [
  { 
    id: 'education', 
    label: 'Études des enfants & Sécurisation Avenir', 
    icon: '🎓', 
    desc: 'Financer les études supérieures et garantir les bourses même en cas de décès du parent',
    targetProductIds: ['visa_etudes', 'visa_etudes_plus']
  },
  { 
    id: 'retraite', 
    label: 'Retraite Confortable (10 à 25 ans)', 
    icon: '🏖️', 
    desc: 'Constituer un capital retraite avec le bonus de fidélité de 92% et option de rente viagère',
    targetProductIds: ['horizon_retraite', 'horizon_retraite_5']
  },
  { 
    id: 'retraite_courte', 
    label: 'Retraite Accélérée Senior (5 ans)', 
    icon: '⚡', 
    desc: 'Capitalisation courte de 5 ans ferme pour cadres proches de la cessation d\'activité',
    targetProductIds: ['horizon_retraite_5', 'horizon_retraite']
  },
  { 
    id: 'sante_accident', 
    label: 'Santé, Accident & Hospitalisation', 
    icon: '🏥', 
    desc: 'Bouclier financier d\'urgence avec forfait hospitalisation et capital décès accidentel',
    targetProductIds: ['protect_plus', 'secure_compte']
  },
  { 
    id: 'epargne_tirages', 
    label: 'Épargne & Tirages au Sort Trimestriels', 
    icon: '🎲', 
    desc: 'Capitaliser à 3,5% tout en tentant de remporter immédiatement le capital complet',
    targetProductIds: ['epargne_bonus', 'epargne_moov']
  },
  { 
    id: 'compte_bancaire', 
    label: 'Sécurité Compte Bancaire & Découverts', 
    icon: '🏦', 
    desc: 'Adosser un capital prévoyance immédiat (jusqu\'à 5M) directement à son compte bancaire',
    targetProductIds: ['secure_compte', 'protect_plus']
  },
  { 
    id: 'mobile_money', 
    label: 'Micro-Épargne 100% Mobile Money', 
    icon: '📱', 
    desc: 'Souscription et versements sur smartphone via Moov Money sans compte bancaire classique',
    targetProductIds: ['epargne_moov', 'protect_plus']
  },
  { 
    id: 'obseques', 
    label: 'Frais Funéraires & Obsèques sous 48h', 
    icon: '⚰️', 
    desc: 'Déblocage prioritaire garanti des fonds nécessaires pour des funérailles dignes',
    targetProductIds: ['serenite', 'secure_compte']
  },
];

export function evaluateComparisonAdvice(
  pA: PortfolioProduct,
  pB: PortfolioProduct,
  amount: number,
  duration: number,
  needId: string
) {
  const currentNeed = COMPARISON_NEEDS.find(n => n.id === needId) || COMPARISON_NEEDS[0];
  const isEpargneA = pA.isEpargne;

  let winner = pA;
  let other = pB;
  let matchScore = '98%';
  let winnerReasons: string[] = [];
  let otherReasons: string[] = [];
  let goldenRule = '';

  // 1. Les deux produits sont Visa Études vs Visa Études Plus
  if ((pA.id === 'visa_etudes' || pA.id === 'visa_etudes_plus') && (pB.id === 'visa_etudes' || pB.id === 'visa_etudes_plus')) {
    const isPlusA = pA.id === 'visa_etudes_plus';
    const plus = isPlusA ? pA : pB;
    const classic = isPlusA ? pB : pA;

    if (amount >= 10000) {
      winner = plus;
      other = classic;
      matchScore = '99% d\'adéquation';
      winnerReasons = [
        "Rente d'orphelinat immédiate : Dès le décès éventuel du parent, une allocation régulière est versée à l'enfant pour son quotidien sans attendre ses études supérieures.",
        "Doublement du capital garanti en cas de décès consécutif à un accident corporel.",
        "Exonération totale des cotisations restantes prise en charge par SUNU Assurances.",
        "Versement échelonné des bourses scolaires sur 4 ans (16 trimestres) pour sécuriser le cursus complet."
      ];
      otherReasons = [
        "Privilégiez Visa Études classique si votre budget mensuel est modeste (accessible dès 4 250 FCFA/mois)."
      ];
      goldenRule = `Pour votre budget de ${amount.toLocaleString('fr-FR')} FCFA/mois (≥ 10 000 F), ${plus.name} est le choix d'excellence : la rente d'orphelinat immédiate met votre enfant à l'abri de toute déscolarisation.`;
    } else {
      winner = classic;
      other = plus;
      matchScore = '97% d\'adéquation';
      winnerReasons = [
        "Cotisation d'entrée ultra-accessible dès 4 250 FCFA/mois, idéale pour épargner sans pression.",
        "Exonération totale des cotisations par l'assureur si le parent souscripteur venait à décéder ou à être invalide (IAD).",
        "Rendement garanti au Taux Minimum Garanti CIMA de 3,5% net/an + participation aux bénéfices (Art. 84).",
        "Souplesse de sortie : Choix entre un capital unique en une seule fois ou des rentes trimestrielles scolaires."
      ];
      otherReasons = [
        "Choisissez Visa Études Plus si vous pouvez augmenter votre effort d'épargne à au moins 10 000 FCFA/mois pour activer la rente d'orphelinat immédiate."
      ];
      goldenRule = `Avec un budget inférieur à 10 000 FCFA/mois, ${classic.name} est la formule la plus réaliste et sécurisante pour démarrer immédiatement.`;
    }
  }
  // 2. Horizon Retraite vs Horizon Retraite 5
  else if ((pA.id === 'horizon_retraite' || pA.id === 'horizon_retraite_5') && (pB.id === 'horizon_retraite' || pB.id === 'horizon_retraite_5')) {
    const isRet5A = pA.id === 'horizon_retraite_5';
    const ret5 = isRet5A ? pA : pB;
    const long = isRet5A ? pB : pA;

    if (duration <= 5 || needId === 'retraite_courte') {
      winner = ret5;
      other = long;
      matchScore = '98% d\'adéquation';
      winnerReasons = [
        "Horizon court de 5 ans ferme conçu spécialement pour les seniors et cadres proches de la retraite.",
        "Capitalisation rapide sans engagement contraignant sur 10 ou 15 ans.",
        "Rendement garanti CIMA de 3,5% net/an avec restitution du capital à échéance."
      ];
      otherReasons = [
        "Privilégiez Horizon Retraite si vous avez 10 ans ou plus devant vous pour toucher le bonus de fidélité de 92%."
      ];
      goldenRule = `À moins de 5 ans de votre départ à la retraite, ${ret5.name} vous évite tout blocage sur le long terme tout en garantissant vos intérêts.`;
    } else {
      winner = long;
      other = ret5;
      matchScore = '99% d\'adéquation';
      winnerReasons = [
        "Bonus de fidélité exceptionnel de 92% de la 1ère annuité versé à l'échéance (pour tout contrat ≥ 10 ans sans rachat).",
        "Option de rente viagère réversible à vie (60% ou 100%) au conjoint survivant.",
        "Effet puissant des intérêts composés à 3,5% et de la participation aux bénéfices de l'Article 84."
      ];
      otherReasons = [
        "Choisissez Horizon Retraite 5 uniquement si vous devez récupérer votre capital d'ici 5 ans sans attendre."
      ];
      goldenRule = `Sur 10 ans ou plus, ${long.name} est imbattable : le bonus de fidélité de 92% amplifie votre épargne de manière unique.`;
    }
  }
  // 3. Protect Plus vs Secure Compte
  else if ((pA.id === 'protect_plus' || pA.id === 'secure_compte') && (pB.id === 'protect_plus' || pB.id === 'secure_compte')) {
    const isProtA = pA.id === 'protect_plus';
    const prot = isProtA ? pA : pB;
    const sec = isProtA ? pB : pA;

    if (needId === 'sante_accident' || amount <= 1500) {
      winner = prot;
      other = sec;
      matchScore = '97% d\'adéquation';
      winnerReasons = [
        "Prise en charge forfaitaire des frais d'hospitalisation accidentelle dès 5 jours consécutifs (150 000 à 250 000 FCFA).",
        "Capital décès et invalidité accidentels de 500 000 à 1 000 000 FCFA.",
        "Accessibilité record dès 500 FCFA/mois sans formalité médicale lourde (Livre VII CIMA)."
      ];
      otherReasons = [
        "Privilégiez Secure Compte si vous avez un compte bancaire SUNU Bank et visez un capital décès plus important (jusqu'à 5 000 000 FCFA)."
      ];
      goldenRule = `Pour vous protéger contre les frais d'hospitalisation et accidents quotidiens avec une prime minime, ${prot.name} est le bouclier indispensable.`;
    } else {
      winner = sec;
      other = prot;
      matchScore = '96% d\'adéquation';
      winnerReasons = [
        "Capital de prévoyance substantiel jusqu'à 5 000 000 FCFA versé sous 48h aux ayants droit.",
        "Protection automatique des découverts bancaires et des engagements.",
        "Prélèvement simple et automatisé directement sur le compte bancaire."
      ];
      otherReasons = [
        "Complétez avec Protect Plus si vous souhaitez également une couverture spécifique pour les séjours à l'hôpital."
      ];
      goldenRule = `Pour les clients bancarisés voulant sécuriser un capital conséquent pour leur famille, ${sec.name} est le premier choix.`;
    }
  }
  // 4. Cas général selon le besoin sélectionné
  else {
    const matchesA = currentNeed.targetProductIds.includes(pA.id);
    const matchesB = currentNeed.targetProductIds.includes(pB.id);

    if (matchesA && !matchesB) {
      winner = pA;
      other = pB;
      matchScore = '98% d\'adéquation';
      winnerReasons = [
        `Spécifiquement conçu pour « ${currentNeed.label} ».`,
        `${pA.pointFort}`,
        `Prestations clés : ${pA.payout}.`
      ];
      otherReasons = [
        `${pB.name} répond principalement à un autre objectif (${pB.category}) : ${pB.pointFort}.`
      ];
      goldenRule = `Pour votre priorité (${currentNeed.label}), ${pA.name} correspond exactement à vos attentes.`;
    } else if (matchesB && !matchesA) {
      winner = pB;
      other = pA;
      matchScore = '98% d\'adéquation';
      winnerReasons = [
        `Spécifiquement conçu pour « ${currentNeed.label} ».`,
        `${pB.pointFort}`,
        `Prestations clés : ${pB.payout}.`
      ];
      otherReasons = [
        `${pA.name} répond principalement à un autre objectif (${pA.category}) : ${pA.pointFort}.`
      ];
      goldenRule = `Pour votre priorité (${currentNeed.label}), ${pB.name} correspond exactement à vos attentes.`;
    } else {
      winner = isEpargneA ? pA : pB;
      other = winner.id === pA.id ? pB : pA;
      matchScore = '94% d\'adéquation';
      winnerReasons = [
        `Atout majeur : ${winner.pointFort}`,
        `Garanties de sortie : ${winner.payout}.`
      ];
      otherReasons = [
        `Alternative : ${other.name} pour ${other.pointFort}.`
      ];
      goldenRule = `Comparez vos priorités : préférez ${winner.name} pour sa flexibilité de sortie, ou ${other.name} pour ses garanties spécifiques.`;
    }
  }

  return {
    winner,
    other,
    matchScore,
    winnerReasons,
    otherReasons,
    goldenRule,
    isWinnerA: winner.id === pA.id,
    isWinnerB: winner.id === pB.id,
    currentNeed
  };
}

export const ConciergeChatView: React.FC<ConciergeChatViewProps> = ({
  initialMessage,
  onNavigateHome,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [showLexiconModal, setShowLexiconModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [language, setLanguage] = useState<'FR' | 'EW' | 'KB' | 'EN'>('FR');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio Features State (Speech-to-Text & Text-to-Speech)
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Simulator Modal State
  const [simProduct, setSimProduct] = useState(PORTFOLIO_PRODUCTS[2]);
  const [simAmount, setSimAmount] = useState<number>(25000);
  const [simDuration, setSimDuration] = useState<number>(15);
  const [modalSimResult, setModalSimResult] = useState<SimulationData | null>(null);

  // Comparator State
  const [compareProdA, setCompareProdA] = useState<PortfolioProduct>(PORTFOLIO_PRODUCTS[0]); // Visa Études
  const [compareProdB, setCompareProdB] = useState<PortfolioProduct>(PORTFOLIO_PRODUCTS[1]); // Visa Études Plus
  const [compareMonthlyAmount, setCompareMonthlyAmount] = useState<number>(20000);
  const [compareDurationYears, setCompareDurationYears] = useState<number>(10);
  const [compareUserNeed, setCompareUserNeed] = useState<string>('education');

  // Lexicon Search State
  const [lexiconSearch, setLexiconSearch] = useState('');

  // KYC Questionnaire Modal State
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycGoal, setKycGoal] = useState<'education' | 'retraite' | 'sante' | 'bonus' | 'obseques'>('retraite');
  const [kycBudget, setKycBudget] = useState<number>(25000);
  const [kycHorizon, setKycHorizon] = useState<number>(15);
  const [kycStep, setKycStep] = useState<number>(1);

  // Tester Feedback & Rating State
  const [feedbackScores, setFeedbackScores] = useState<{ [msgId: string]: 'positive' | 'negative' }>({});
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const accumulatedTranscriptRef = useRef('');
  const sessionTranscriptRef = useRef('');
  const restartTimerRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [lexiconCategory, setLexiconCategory] = useState<string>('all');

  const handleFeedback = (msgId: string, type: 'positive' | 'negative') => {
    setFeedbackScores((prev) => ({ ...prev, [msgId]: type }));
    setFeedbackToast(
      type === 'positive' 
        ? "✓ Réponse validée conforme au Code CIMA !" 
        : "✓ Remarque enregistrée pour l'audit de fidélité CIMA."
    );
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const getKycRecommendation = () => {
    if (kycGoal === 'education') {
      if (kycBudget >= 15000) {
        return {
          product: PORTFOLIO_PRODUCTS[1], // Visa Études Plus
          reason: `Pour votre budget de ${kycBudget.toLocaleString('fr-FR')} FCFA/mois, Visa Études Plus offre une rente d'orphelinat immédiate dès le décès du parent et le doublement du capital en cas d'accident pour sécuriser l'université de vos enfants.`,
          confidence: '99% de conformité profil'
        };
      }
      return {
        product: PORTFOLIO_PRODUCTS[0], // Visa Études
        reason: "Visa Études est parfaitement adapté pour une constitution progressive dès 4 250 FCFA/mois avec capital garanti au TMG 3,5% net l'an et exonération totale des primes en cas d'accident.",
        confidence: '98% de conformité profil'
      };
    }

    if (kycGoal === 'retraite') {
      if (kycHorizon <= 5) {
        return {
          product: PORTFOLIO_PRODUCTS[3], // Horizon Retraite 5
          reason: "Horizon Retraite 5 est conçu sur 5 ans ferme pour les cadres et seniors souhaitant une capitalisation accélérée avant la cessation d'activité.",
          confidence: '97% de conformité profil'
        };
      }
      return {
        product: PORTFOLIO_PRODUCTS[2], // Horizon Retraite
        reason: `Horizon Retraite sur ${kycHorizon} ans vous fait bénéficier du bonus de fidélité exceptionnel de 92% de la première annuité et de l'option de conversion en rente viagère mensuelle réversible.`,
        confidence: '99% de conformité profil'
      };
    }

    if (kycGoal === 'sante') {
      if (kycBudget <= 2000) {
        return {
          product: PORTFOLIO_PRODUCTS[5], // Protect Plus
          reason: "Protect Plus est la micro-assurance santé par excellence au Togo : dès 500 F/mois, elle couvre l'hospitalisation jusqu'à 250 000 F et garantit 1 000 000 F en cas d'accident.",
          confidence: '98% de conformité profil'
        };
      }
      return {
        product: PORTFOLIO_PRODUCTS[6], // Secure Compte
        reason: "Secure Compte sécurise votre compte bancaire SUNU Bank Togo avec jusqu'à 5 000 000 FCFA de capital prévoyance immédiat pour vos proches.",
        confidence: '96% de conformité profil'
      };
    }

    if (kycGoal === 'bonus') {
      if (kycBudget <= 2000) {
        return {
          product: PORTFOLIO_PRODUCTS[7], // Épargne Moov
          reason: "Épargne Moov est 100% digitale sur smartphone via Moov Money avec tirages trimestriels pour remporter le capital total par anticipation sans compte bancaire physique.",
          confidence: '98% de conformité profil'
        };
      }
      return {
        product: PORTFOLIO_PRODUCTS[4], // Épargne Bonus SUNU
        reason: "Épargne Bonus SUNU combine la certitude d'un capital garanti à terme et la chance de toucher immédiatement l'intégralité du capital sans payer les cotisations restantes si tiré au sort !",
        confidence: '97% de conformité profil'
      };
    }

    return {
      product: PORTFOLIO_PRODUCTS[8], // Sérénité
      reason: "Sérénité soulage vos proches avec un capital obsèques débloqué en urgence sous 48h et la préservation intégrale du capital épargné.",
      confidence: '95% de conformité profil'
    };
  };

  // Initialize Continuous Speech Recognition (Longue durée & résistant aux pauses)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'EN' ? 'en-US' : 'fr-FR';

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
      };

      recognition.onend = () => {
        // Sauvegarde des mots de la sous-session
        if (sessionTranscriptRef.current) {
          accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + sessionTranscriptRef.current).replace(/\s+/g, ' ').trim();
          sessionTranscriptRef.current = '';
        }

        // Si l'utilisateur n'a pas appuyé sur Terminer, relance automatique immédiate
        if (isListeningRef.current) {
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                // Seconde tentative de sécurité si le pipeline audio libérait encore ses ressources
                restartTimerRef.current = setTimeout(() => {
                  if (isListeningRef.current && recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch (e) {}
                  }
                }, 200);
              }
            }
          }, 100);
        } else {
          setIsListening(false);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
      };

      recognition.onerror = (event: any) => {
        // Pause normale / silence : on ignore l'erreur no-speech et on laisse onend relancer !
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        }
      };

      recognition.onresult = (event: any) => {
        let currentSessionText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentSessionText += event.results[i][0].transcript + ' ';
        }
        sessionTranscriptRef.current = currentSessionText;
        const prefix = accumulatedTranscriptRef.current ? `${accumulatedTranscriptRef.current.trim()} ` : '';
        const combined = (prefix + currentSessionText).replace(/\s+/g, ' ').trim();
        setInputValue(combined);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      isListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [language]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas supportée par ce navigateur. Utilisez Google Chrome ou Microsoft Edge.");
      return;
    }

    if (isListening) {
      // Arrêt manuel par l'utilisateur
      isListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsListening(false);
      try { recognitionRef.current.stop(); } catch (e) {}
    } else {
      // Démarrage dictée vocale longue durée
      accumulatedTranscriptRef.current = inputValue.trim();
      sessionTranscriptRef.current = '';
      isListeningRef.current = true;
      setIsListening(true);
      setRecordingSeconds(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      try {
        recognitionRef.current.start();
      } catch (e) {
        restartTimerRef.current = setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (err) {}
          }
        }, 150);
      }
    }
  };

  const formatRecordingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Text-to-Speech (Audio Output)
  const handleSpeakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'EN' ? 'en-US' : 'fr-FR';
    utterance.rate = 1.0;

    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  const getWelcomeContent = (lang: 'FR' | 'EW' | 'KB' | 'EN') => {
    switch (lang) {
      case 'EW':
        return "Woezɔ le SUNU Bank Togo ! Nye enye wò Bancassurance kple Ganyawo ƒe Kpeɖeŋutɔ.\n\nMele klalo be makpe ɖe ŋuwò le míafé dɔwɔƒe ƒe nudzɔdzɔ 8 la me (Visa Études, Horizon Retraite, Épargne Bonus...) le CIMA Se la nu.\n\nNu ka ŋu nèdi be míagblɔ tɔtrɔ na wò egbe ?";
      case 'KB':
        return "Dɔɔ le SUNU Bank Togo ! Mɛ kɛŋ wɛɛ pɩtɩŋna Bancassurance nɛ Liidiye kɛdɛɛ tɔm taa.\n\nMɛwɛ lɔŋ se mambazɩ-ŋ pɩlɩɩna lɩmaaza 8 wena a-tɔm wɛ CIMA se taa yɔ (Visa Études, Horizon Retraite, Protect Plus...).\n\nƐbɛ tɔm ŋcɔsɔɔ se ɖɩyɔɔdɩ pɩpaa egbele ?";
      case 'EN':
        return "Welcome to SUNU Bank Togo! I am your Senior Bancassurance Advisor and Financial Concierge.\n\nI am certified to guide you through all **8 official life insurance products** under the **CIMA Insurance Code** and perform instant financial simulations directly in this chat.\n\nWhich product or simulation would you like to explore today?";
      default:
        return "Bonjour ! Je suis le **Conseiller Bancassurance et Concierge Financier de SUNU Bank Togo**.\n\nJe suis habilité à vous renseigner avec rigueur sur l'ensemble de nos **8 produits d'assurance vie** conformes au **Code des assurances CIMA** (Visa Études, Horizon Retraite, Épargne Bonus, Protect Plus, Secure Compte, Épargne Moov, Sérénité) et à réaliser toutes vos **simulations financières instantanées** directement ici dans notre discussion.\n\nQuelle solution souhaitez-vous découvrir ou simuler aujourd'hui ?";
    }
  };

  const getQuickPills = (lang: 'FR' | 'EW' | 'KB' | 'EN') => {
    if (lang === 'EN') {
      return [
        { label: '🏖️ Horizon Retraite (92% Bonus)', query: 'Simulate Horizon Retraite with 25,000 FCFA per month over 15 years' },
        { label: '🎓 Visa Études (Education)', query: 'Simulate Visa Études with 15,000 FCFA per month over 10 years for my child' },
        { label: '⚖️ CIMA Surrender Rules (Art. 74)', query: 'What are the surrender conditions and legal penalties under Articles 74 and 76 of the CIMA Code?' },
        { label: '🏥 Protect Plus (Health/Accident)', query: 'What are the hospitalization and accidental death benefits of Protect Plus?' },
        { label: '🛡️ Claims Procedure & Deadlines', query: 'How do I file a death claim and what are the legal CIMA settlement deadlines?' },
      ];
    }
    if (lang === 'EW') {
      return [
        { label: '🏖️ Horizon Retraite (Kpɔkplɔ)', query: 'Mede kuku, nuka nye Horizon Retraite kple aleke wòwɔa dɔe le SUNU Bank ?' },
        { label: '🎓 Visa Études (Sukuli 15 000 F)', query: 'Tɔtrɔ Visa Études kple 15 000 FCFA le xexi me ƒe 10 na nye vi' },
        { label: '⚖️ Ga gbugbɔxɔ (Art. 74 & 76)', query: 'Aleke se la gblɔ tso ga gbugbɔxɔ (rachat) ŋu le CIMA Se la me?' },
        { label: '🏥 Protect Plus (Ametakpɔkpɔ)', query: 'Nuka Protect Plus nana le kɔdzi dede kple afɔku me?' },
        { label: '🛡️ Sinistre kple Ku ƒe ga', query: 'Aleke woawɔ axɔ ga ne ku alo afɔku dzɔ le CIMA se nu?' },
      ];
    }
    if (lang === 'KB') {
      return [
        { label: '🏖️ Horizon Retraite (Kpazaʋ)', query: 'Dɔɔ, nuka kɛŋna Horizon Retraite le SUNU Bank taa?' },
        { label: '🎓 Visa Études (Sukuli 15 000 F)', query: 'Taza Visa Études yɔɔ nɛ 15 000 FCFA fenaɣ taa pɩnzɩ 10 pɩɣa sukuli yɔɔ' },
        { label: '⚖️ CIMA se (Art. 74 & 76)', query: 'Ɛbɛ paɣtʋ wɛɛ pɩlɩɩna liidiye lɩzʋʋ yɔɔ le CIMA se taa?' },
        { label: '🏥 Protect Plus (Kandɩyʋ)', query: 'Ɛbɛ Protect Plus haɣ ye kʋdɔŋ yaa afɔku kɔma?' },
        { label: '🛡️ Sɩm liidiye cɔnaʋ', query: 'Ɛzɩma palakɩ nɛ pɔcɔsɩ liidiye ye sɩm kɔma le CIMA se taa?' },
      ];
    }
    return [
      { label: '🏖️ Horizon Retraite (Bonus 92%)', query: 'Simule Horizon Retraite avec 25 000 FCFA par mois sur 15 ans' },
      { label: '🎓 Visa Études (15 000 F)', query: 'Simule Visa Études avec 15 000 FCFA par mois pendant 10 ans pour mon enfant' },
      { label: '⚖️ Rachat CIMA (Art. 74 & 76)', query: 'Quelles sont les conditions de rachat et pénalités selon les Articles 74 et 76 du Code CIMA ?' },
      { label: '🏥 Protect Plus (Santé/Accident)', query: 'Quelles sont les prestations hospitalisation et décès de Protect Plus ?' },
      { label: '🛡️ Déclaration Sinistre (Délais)', query: 'Comment déclarer un sinistre décès et quels sont les délais de paiement légaux CIMA ?' },
    ];
  };

  const getInputPlaceholder = (lang: 'FR' | 'EW' | 'KB' | 'EN') => {
    switch (lang) {
      case 'EN': return 'Ask any question about our 8 life insurance products or enter a simulation...';
      case 'EW': return 'Bia nyabiase le míafé nudzɔdzɔ 8 la ŋuti alo bia akɔntabubu...';
      case 'KB': return 'Pɔzɩ tɔm pɩlɩɩna liidiye kandɩyʋ 8 yɔɔ yaa liidiye tazaʋ...';
      default: return 'Posez une question ou demandez une simulation (ex: Simule Visa Études 15000 F sur 10 ans)...';
    }
  };

  const handleLanguageSwitch = (newLang: 'FR' | 'EW' | 'KB' | 'EN') => {
    if (newLang === language) return;
    setLanguage(newLang);

    // If chat only has the initial welcome message, swap it cleanly
    if (messages.length <= 1) {
      setMessages([
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: getWelcomeContent(newLang),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } else {
      // Non-destructive: preserve chat history and append assistant confirmation in the new language
      let switchNotice = "Langue configurée en **Français**. Je reste à votre entière disposition pour vos questions.";
      if (newLang === 'EN') switchNotice = "Language switched to **English**. All answers will now be provided in English. How may I assist you with your insurance plan?";
      if (newLang === 'EW') switchNotice = "Wò gbe tɔtrɔ va **Evegbe** me. Míele klalo be míakpe ɖe ŋuwò le míafé nudzɔdzɔwo kple CIMA Se la ŋuti.";
      if (newLang === 'KB') switchNotice = "Lɩmaaza kɛ **Kabyɛ** taa. Ɖɩwɛ lɔŋ se ɖɩcɔsɩ ña-tɔm pɩlɩɩna SUNU Bank Togo liidiye kandɩyʋ yɔɔ.";

      setMessages((prev) => [
        ...prev,
        {
          id: `lang-switch-${Date.now()}`,
          role: 'assistant',
          content: switchNotice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  };

  // Initial welcome message mount
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'msg-welcome',
      role: 'assistant',
      content: getWelcomeContent(language),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (initialMessage && initialMessage.trim()) {
      setMessages([
        welcomeMsg,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          content: initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      handleSendMessage(initialMessage);
    } else {
      setMessages([welcomeMsg]);
    }
  }, [initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Calcul local pour la modale
  useEffect(() => {
    const r = 0.035;
    const dur = simProduct.id === 'horizon_retraite_5' ? 5 : (simProduct.minDur === simProduct.maxDur ? simProduct.minDur : simDuration);
    const amount = Math.max(simAmount, simProduct.minAmount);
    const totalPaid = amount * 12 * dur;
    const capital = Math.round((amount * 12) * (((Math.pow(1 + r, dur) - 1) / r)) * (1 + r / 2));
    const fidelity = simProduct.id === 'horizon_retraite' && dur >= 10 ? Math.round(0.92 * (amount * 12)) : 0;
    const totalCap = simProduct.id === 'horizon_retraite' ? capital + fidelity : capital;
    const renteTrim = Math.round((capital / 16) * 1.02);

    let specific = `Capital garanti constitué de ${capital.toLocaleString('fr-FR')} FCFA à l'échéance.`;
    if (simProduct.id === 'horizon_retraite') {
      specific = `Bonus de fidélité de 92% de la 1ère annuité (+${fidelity.toLocaleString('fr-FR')} FCFA) + Option rente viagère de ~${Math.round(totalCap * 0.0065).toLocaleString('fr-FR')} FCFA/mois.`;
    } else if (simProduct.id.includes('etude') || simProduct.id.includes('education')) {
      specific = `Rente trimestrielle d'études de ${renteTrim.toLocaleString('fr-FR')} FCFA pendant 4 ans (16 trimestres) pour financer les études.`;
    } else if (simProduct.id === 'epargne_bonus' || simProduct.id === 'epargne_moov') {
      specific = `Tirages au sort trimestriels pour remporter par anticipation l'intégralité du capital sans payer les cotisations restantes !`;
    } else if (simProduct.id === 'protect_plus') {
      const isG = amount >= 1000;
      specific = `Hospitalisation accidentelle prise en charge dès 5 jours jusqu'à ${isG ? '250 000' : '150 000'} FCFA + Capital décès de ${isG ? '1 000 000' : '500 000'} FCFA.`;
    }

    setModalSimResult({
      productId: simProduct.id,
      productName: simProduct.name,
      category: simProduct.category,
      monthlyAmount: amount,
      durationYears: dur,
      totalContributed: totalPaid,
      guaranteedCapital: simProduct.id === 'protect_plus' ? (amount >= 1000 ? 1000000 : 500000) : totalCap,
      specificBenefit: specific,
      fidelityBonus: fidelity,
      quarterlyPension: renteTrim,
      deathDisabilityGuarantee: 'Exonération des cotisations et maintien intégral du capital / versement immédiat aux bénéficiaires.',
      cimaMentions: 'Conforme Article 6 du Code CIMA. Taux technique garanti 3,5% l\'an. Droit de renonciation de 30 jours (Art. 76).'
    });
  }, [simProduct, simAmount, simDuration]);

  const handleSendMessage = async (textToSend?: string) => {
    if (isListeningRef.current) {
      isListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsListening(false);
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
    }

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
          language,
        }),
      });

      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Je suis à votre entière disposition pour vous guider sur nos solutions bancassurance SUNU Bank Togo.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: data.structuredData || null,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const cleanQ = query.toLowerCase();
      const quoteMatch = cleanQ.match(/«\s*(.*?)\s*»/) || cleanQ.match(/"\s*(.*?)\s*"/);
      const target = quoteMatch ? quoteMatch[1].trim().toLowerCase() : cleanQ;
      const matchedLex = CIMA_LEXICON.find(item => 
        target.includes(item.term.toLowerCase()) || 
        item.term.toLowerCase().includes(target)
      );

      let fallbackContent = "Pour toute souscription ou information complémentaire sur les produits SUNU Bank Togo (Visa Études, Horizon Retraite, Épargne Bonus, Protect Plus), nos conseillers vous accueillent dans nos 28 agences avec le respect rigoureux des dispositions du Code CIMA.";
      
      const isComp = cleanQ.includes("compar") || cleanQ.includes("versus") || cleanQ.includes("vs ") || cleanQ.includes(" vs") || cleanQ.includes("différen") || cleanQ.includes("differen") || cleanQ.includes("entre") || cleanQ.includes("choisir") || cleanQ.includes("lequel") || cleanQ.includes("meilleur");

      if (isComp) {
        interface LocalProdMatch {
          prod: any;
          index: number;
        }
        const matches: LocalProdMatch[] = [];
        const check = (regex: RegExp, p: any) => {
          const m = cleanQ.match(regex);
          if (m && m.index !== undefined && !matches.some(x => x.prod.id === p.id)) {
            matches.push({ prod: p, index: m.index });
          }
        };

        check(/\b(?:visa\s+)?(?:études|etudes)\s+plus\b|\bedupro\b/i, PORTFOLIO_PRODUCTS[1]);
        if (!matches.some(x => x.prod.id === 'visa_etudes_plus')) {
          check(/\b(?:visa\s+)?(?:études|etudes)(?!\s+plus)\b/i, PORTFOLIO_PRODUCTS[0]);
        }
        check(/\b(?:horizon\s+)?retraite\s+5\b|\bhorizon\s+5\b/i, PORTFOLIO_PRODUCTS[3]);
        if (!matches.some(x => x.prod.id === 'horizon_retraite_5')) {
          check(/\bhorizon\s+retraite\b|\bhorizon\b|\bretraite\b/i, PORTFOLIO_PRODUCTS[2]);
        }
        check(/\b(?:épargne|epargne)\s+bonus\b|\bbonus\s+sunu\b|\bbonus\b/i, PORTFOLIO_PRODUCTS[4]);
        check(/\bprotect\s+plus\b|\bprotect\b|\bmicro-assurance\s+santé\b/i, PORTFOLIO_PRODUCTS[5]);
        check(/\bsecure\s+compte\b/i, PORTFOLIO_PRODUCTS[6]);
        check(/\b(?:épargne|epargne)\s+moov\b/i, PORTFOLIO_PRODUCTS[7]);

        matches.sort((a, b) => a.index - b.index);

        const pA = matches[0]?.prod || PORTFOLIO_PRODUCTS[0];
        const pB = matches[1]?.prod || (pA.id === PORTFOLIO_PRODUCTS[0].id ? PORTFOLIO_PRODUCTS[1] : PORTFOLIO_PRODUCTS[0]);

        let compAmt = 20000;
        const matchAmt = cleanQ.match(/(\d[\d\s]*\d|\d+)\s*(?:fcfa|f\b|francs?)/i);
        if (matchAmt) {
          const parsed = parseInt(matchAmt[1].replace(/\s+/g, ''), 10);
          if (!isNaN(parsed) && parsed >= 500) compAmt = parsed;
        }

        let compDur = 10;
        const matchDur = cleanQ.match(/(\d+)\s*(?:ans?|années?)/i);
        if (matchDur) {
          const parsed = parseInt(matchDur[1], 10);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= 35) compDur = parsed;
        }

        let clientNeed = 'general';
        const needMatch = cleanQ.match(/(?:besoin(?:s)?|objectif(?:s)?|projet)\s*(?:prioritaire)?\s*[:\s«"']+\s*([^»"'\n.]+)/i);
        const needStr = needMatch ? needMatch[1].toLowerCase() : cleanQ;
        if (needStr.includes('santé') || needStr.includes('sante') || needStr.includes('accident') || needStr.includes('hospital')) {
          clientNeed = 'sante_accident';
        } else if (needStr.includes('retraite 5') || needStr.includes('court')) {
          clientNeed = 'retraite_courte';
        } else if (needStr.includes('retraite') || needStr.includes('horizon')) {
          clientNeed = 'retraite';
        } else if (needStr.includes('etude') || needStr.includes('étude') || needStr.includes('scolaire')) {
          clientNeed = 'education';
        } else if (needStr.includes('bonus') || needStr.includes('tirage')) {
          clientNeed = 'epargne_tirages';
        }

        const advice = evaluateComparisonAdvice(pA, pB, compAmt, compDur, clientNeed);
        fallbackContent = 
`## ⚖️ Analyse Comparative & Conseil CIMA : ${pA.name} vs ${pB.name}\n\n` +
`> 🎯 **Conseil Personnalisé SUNU Bank Togo** • **Simulation :** ${compAmt.toLocaleString('fr-FR')} FCFA/mois sur ${compDur} an(s)\n\n` +
`### ⭐ CONTRAT RECOMMANDÉ : **${advice.winner.name}** (${advice.matchScore})\n\n` +
`**Pourquoi choisir ${advice.winner.name} pour votre projet ?**\n` +
advice.winnerReasons.map(r => `- ${r}`).join('\n') + `\n\n` +
`**Dans quel cas préférer plutôt ${advice.other.name} ?**\n` +
advice.otherReasons.map(r => `- ${r}`).join('\n') + `\n\n` +
`💡 **La Règle d'Or pour décider :**\n` +
`> *${advice.goldenRule}*\n\n` +
`---\n\n` +
`### 📜 Rappels Légaux CIMA (Livre I)\n` +
`- **Droit de renonciation de 30 jours (Art. 76)** : Remboursement intégral sans frais.\n` +
`- **Valeur de rachat (Art. 74 & 76)** : Rachat possible après 2 ans, plafonné à 5% max de la provision mathématique.\n` +
`- **Participation aux bénéfices (Art. 84)** : Redistribution légale minimale de 85% des bénéfices financiers.\n\n` +
`*Conformément à l'Article 6 du Code CIMA, ce comparatif précontractuel loyal a pour but de vous éclairer. Nos conseillers en agence sont à votre disposition pour concrétiser votre adhésion.*`;
      } else if (matchedLex) {
        fallbackContent = `## 📜 Fiche CIMA : ${matchedLex.term}\n\n` +
          `> **Catégorie :** ${matchedLex.category} • **Cadre :** Code des Assurances CIMA\n\n` +
          `### Définition Réglementaire :\n${matchedLex.definition}\n\n` +
          `*Information officielle certifiée CIMA. Les conseillers de SUNU Bank Togo sont à votre disposition en agence pour toute étude personnalisée.*`;
      }

      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
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

  const handleWhatsAppShare = (sim: SimulationData) => {
    const text = `*SIMULATION PRÉCONTRACTUELLE SUNU BANK TOGO*\n\n` +
      `📌 *Produit* : ${sim.productName} (${sim.category})\n` +
      `💰 *Cotisation* : ${sim.monthlyAmount.toLocaleString('fr-FR')} FCFA / mois\n` +
      `📅 *Durée* : ${sim.durationYears} an(s)\n` +
      `📊 *Total cotisé* : ${sim.totalContributed.toLocaleString('fr-FR')} FCFA\n` +
      `🎯 *Capital Garanti (TMG 3,5%)* : ${sim.guaranteedCapital.toLocaleString('fr-FR')} FCFA\n` +
      `✨ *Avantage* : ${sim.specificBenefit}\n` +
      `🛡️ *Prévoyance* : ${sim.deathDisabilityGuarantee}\n\n` +
      `⚖️ *Cadre réglementaire* : ${sim.cimaMentions}\n\n` +
      `_Devis indicatif généré par l'Assistant RAG Officiel SUNU Bank Togo. Rendez-vous dans votre agence pour souscrire._`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrintQuote = (sim: SimulationData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Devis Précontractuel - SUNU Bank Togo</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0F172A; }
          .header { border-bottom: 2px solid #E21E26; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .logo-text { font-size: 24px; font-weight: 800; color: #E21E26; }
          .badge { background: #FEF2F2; color: #991B1B; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; }
          .card-title { font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: bold; margin-bottom: 5px; }
          .card-value { font-size: 20px; font-weight: bold; color: #E21E26; }
          .legal { font-size: 11px; color: #64748B; line-height: 1.6; border-top: 1px solid #E2E8F0; padding-top: 20px; margin-top: 40px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 30px; }
          .sign-box { border-top: 1px dashed #94A3B8; width: 220px; text-align: center; font-size: 12px; padding-top: 10px; color: #64748B; }
          @media print { button { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo-text">SUNU BANK TOGO</div>
            <div style="font-size: 13px; color: #64748B; font-weight: 600;">PÔLE BANCASSURANCE VIE • CONFORMITÉ CODE CIMA</div>
          </div>
          <div class="badge">FICHE D'INFORMATION PRÉCONTRACTUELLE</div>
        </div>

        <h2 style="font-size: 18px; margin-bottom: 5px;">PROPOSITION INDICATIVE : ${sim.productName}</h2>
        <p style="font-size: 13px; color: #64748B; margin-top: 0; margin-bottom: 25px;">Catégorie : ${sim.category} • Date d'émission : ${new Date().toLocaleDateString('fr-FR')}</p>

        <div class="grid">
          <div class="card">
            <div class="card-title">Cotisation Mensuelle</div>
            <div class="card-value">${sim.monthlyAmount.toLocaleString('fr-FR')} FCFA</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Périodicité : Mensuelle prélevée à la source</div>
          </div>

          <div class="card">
            <div class="card-title">Durée de Constitution</div>
            <div class="card-value">${sim.durationYears} ans</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Échéance contractuelle programmée</div>
          </div>

          <div class="card">
            <div class="card-title">Cumul des Cotisations Versées</div>
            <div class="card-value" style="color: #0F172A;">${sim.totalContributed.toLocaleString('fr-FR')} FCFA</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Effort d'épargne brut total</div>
          </div>

          <div class="card" style="border-color: #FCA5A5; background: #FFF5F5;">
            <div class="card-title" style="color: #991B1B;">Capital Garanti Estimé au Terme</div>
            <div class="card-value">${sim.guaranteedCapital.toLocaleString('fr-FR')} FCFA</div>
            <div style="font-size: 11px; color: #991B1B; margin-top: 4px;">Taux minimum garanti 3,5% + PB annuelle</div>
          </div>
        </div>

        <div style="background: #F8FAFC; border-left: 4px solid #E21E26; padding: 15px; margin-bottom: 20px; font-size: 13px;">
          <strong>Prestation & Modalité de Sortie :</strong><br/>
          ${sim.specificBenefit}
        </div>

        <div style="background: #F8FAFC; border-left: 4px solid #10B981; padding: 15px; margin-bottom: 25px; font-size: 13px;">
          <strong>Garantie de Prévoyance Décès / Invalidité :</strong><br/>
          ${sim.deathDisabilityGuarantee}
        </div>

        <div class="legal">
          <strong>MENTIONS LÉGALES OBLIGATOIRES (CODE DES ASSURANCES CIMA - LIVRE I) :</strong><br/>
          Conformément à l'Article 6 du Code CIMA, ce document constitue une fiche d'information précontractuelle remise à titre indicatif avant la conclusion du contrat. En vertu de l'Article 76 du Code CIMA, le souscripteur dispose d'une faculté de renonciation de 30 jours à compter de la conclusion du contrat avec restitution intégrale des primes. Les conditions de rachat sont régies par les Articles 74 et 76 (indemnité maximale de rachat plafonnée à 5% de la provision mathématique). La souscription définitive s'effectue en agence SUNU Bank Togo après examen des déclarations de santé et acceptation médicale de l'assureur.
        </div>

        <div class="signatures">
          <div class="sign-box">Le Souscripteur<br/>(Mention "Lu et approuvé")</div>
          <div class="sign-box">Pour SUNU Bank Togo<br/>Le Conseiller Clientèle Agréé</div>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <button onclick="window.print()" style="background: #E21E26; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-weight: bold; cursor: pointer;">Imprimer / Enregistrer en PDF</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleInsertModalSim = () => {
    if (!modalSimResult) return;
    setShowSimulatorModal(false);
    handleSendMessage(`Fais-moi une simulation complète pour ${modalSimResult.productName} avec ${modalSimResult.monthlyAmount.toLocaleString('fr-FR')} FCFA par mois pendant ${modalSimResult.durationYears} ans.`);
  };

  const handleInsertComparison = (pA: PortfolioProduct, pB: PortfolioProduct, amount?: number, duration?: number, needLabel?: string) => {
    setShowCompareModal(false);
    const amtStr = amount ? ` avec une cotisation de ${amount.toLocaleString('fr-FR')} FCFA par mois` : '';
    const durStr = duration ? ` sur ${duration} ans` : '';
    const needStr = needLabel ? ` pour mon besoin prioritaire : « ${needLabel} »` : '';
    handleSendMessage(`En tant que Conseiller Bancassurance SUNU Bank Togo, aide-moi à choisir entre ${pA.name} et ${pB.name}${needStr}${amtStr}${durStr}. Compare-les en détail selon leurs objectifs, cotisations, durées, garanties et conditions de sortie CIMA, et conseille-moi pour que je choisisse ce qui est le mieux pour moi.`);
  };

  const filteredLexicon = CIMA_LEXICON.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(lexiconSearch.toLowerCase()) || 
      item.definition.toLowerCase().includes(lexiconSearch.toLowerCase());
    const matchesCat = lexiconCategory === 'all' || item.category === lexiconCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-slate-50 dark:bg-[#131313] text-slate-900 dark:text-[#e5e2e1] overflow-hidden relative font-sans transition-colors">
      {/* Top App Bar */}
      <header className="flex-shrink-0 border-b border-slate-200 dark:border-[#2a2a2a] bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-md z-30 w-full transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-2 sm:p-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 px-2 py-0.5 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <img
                src={logoSunu}
                alt="Logo SUNU Bank Togo"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="h-5 w-px bg-slate-300 dark:bg-[#2a2a2a] hidden sm:block"></div>
            <div className="font-heading font-semibold text-xs sm:text-base text-slate-800 dark:text-[#e5e2e1] flex items-center gap-1.5">
              <span>Conseiller Bancassurance RAG</span>
              <span className="hidden sm:inline-flex text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-mono-code px-2 py-0.5 rounded-full font-bold">
                CIMA Certified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end">
            {/* Language Selector: FR, EW, KB, EN */}
            <div className="flex items-center bg-slate-100 dark:bg-[#1B1B1B] border border-slate-200 dark:border-[#2D2D2D] rounded-lg p-0.5 text-[11px] font-mono-code font-bold">
              <button
                onClick={() => handleLanguageSwitch('FR')}
                className={`px-1.5 py-1 rounded cursor-pointer transition-colors ${language === 'FR' ? 'bg-[#E21E26] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'}`}
                title="Français"
              >
                FR
              </button>
              <button
                onClick={() => handleLanguageSwitch('EW')}
                className={`px-1.5 py-1 rounded cursor-pointer transition-colors ${language === 'EW' ? 'bg-[#E21E26] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'}`}
                title="Éwé (Togo Sud)"
              >
                EW
              </button>
              <button
                onClick={() => handleLanguageSwitch('KB')}
                className={`px-1.5 py-1 rounded cursor-pointer transition-colors ${language === 'KB' ? 'bg-[#E21E26] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'}`}
                title="Kabyè (Togo Nord)"
              >
                KB
              </button>
              <button
                onClick={() => handleLanguageSwitch('EN')}
                className={`px-1.5 py-1 rounded cursor-pointer transition-colors ${language === 'EN' ? 'bg-[#E21E26] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'}`}
                title="English"
              >
                EN
              </button>
            </div>


            {/* Assistant KYC / Éligibilité */}
            <button
              id="btn-open-kyc"
              onClick={() => {
                setKycStep(1);
                setShowKycModal(true);
              }}
              className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#A3A3A3] hover:text-[#E21E26] dark:hover:text-white bg-slate-100 hover:bg-red-50 dark:bg-[#1B1B1B] dark:hover:bg-[#252525] border border-slate-200 hover:border-red-200 dark:border-[#2D2D2D] px-2 sm:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs shrink-0"
              title="Assistant d'éligibilité et diagnostic KYC (Obligation de conseil CIMA Art. 6)"
            >
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E21E26] shrink-0" />
              <span className="hidden sm:inline">Diagnostic KYC</span>
              <span className="sm:hidden">KYC</span>
            </button>

            {/* Comparateur */}
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-1 text-xs text-slate-700 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#1B1B1B] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2D2D2D] px-2 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Comparer deux produits"
            >
              <Scale className="w-3.5 h-3.5 text-[#E21E26] shrink-0" />
              <span className="hidden sm:inline">Comparer</span>
            </button>

            {/* Lexique CIMA */}
            <button
              onClick={() => setShowLexiconModal(true)}
              className="flex items-center gap-1 text-xs text-slate-700 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#1B1B1B] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2D2D2D] px-2 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Lexique juridique CIMA"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E21E26] shrink-0" />
              <span className="hidden sm:inline">Lexique</span>
            </button>

            {/* Simulator button */}
            <button
              id="btn-open-simulator"
              onClick={() => setShowSimulatorModal(true)}
              className="flex items-center gap-1 text-xs text-white bg-[#E21E26] hover:bg-[#c00017] px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium shadow-sm shrink-0"
              title="Ouvrir le simulateur multi-produits"
            >
              <Calculator className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="hidden sm:inline">Simulateur</span>
              <span className="sm:hidden">Simuler</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="text-slate-600 dark:text-[#e5e2e1] hover:text-[#E21E26] transition-colors p-1 cursor-pointer shrink-0"
              title="Réinitialiser la conversation"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>
      </header>


      {/* Chat Messages Container */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 md:p-8 space-y-6 w-full">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Intro / Greeting */}
          <div className="text-center mb-6 mt-2">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#e5e2e1] mb-2 tracking-tight">
              Bancassurance Vie & Simulateur CIMA
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#c8c6c6] max-w-xl mx-auto">
              Assistant RAG pour l'information précontractuelle certifiée de SUNU Bank Togo. Entrez une question ou cliquez sur le micro pour parler.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  setKycStep(1);
                  setShowKycModal(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 dark:bg-[#1B1B1B] dark:hover:bg-[#252525] border border-slate-200 hover:border-red-200 dark:border-[#2D2D2D] text-slate-800 hover:text-[#E21E26] dark:text-[#e2e2e2] text-xs font-semibold cursor-pointer transition-all shadow-xs hover:shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-[#E21E26] shrink-0" />
                <span>Diagnostic d'Éligibilité & KYC (Art. 6 CIMA)</span>
                <ArrowRight className="w-3 h-3 text-[#E21E26] shrink-0" />
              </button>
            </div>
          </div>

          {/* Dynamic Messages Loop */}
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-[#E21E26] text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-none max-w-[90%] sm:max-w-[80%] md:max-w-[70%] text-sm sm:text-base shadow-sm leading-relaxed">
                    <FormattedMessage content={msg.content} isUser={true} />
                  </div>
                </div>
              );
            }

            const sim = msg.structuredData?.simulation;
            const isSpeakingThis = speakingMsgId === msg.id;

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

                {/* Agent Bubble */}
                <div className="bg-white dark:bg-[#1B1B1B] text-slate-900 dark:text-[#f3f0ec] p-4 sm:p-5 rounded-2xl rounded-tl-none max-w-[95%] sm:max-w-[88%] md:max-w-[82%] font-alike border border-slate-200 dark:border-[#2a2a2a] shadow-sm relative flex-1 leading-relaxed transition-colors">
                  
                  {/* Main Content paragraph */}
                  <FormattedMessage content={msg.content} isUser={false} />

                  {/* CARTE INTERACTIVE DE SIMULATION PRÉCONTRACTUELLE */}
                  {sim && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-[#161616] dark:to-[#221718] border border-red-200 dark:border-red-900/40 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-red-100 dark:border-red-900/30 pb-2.5">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#E21E26]" />
                          <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                            {sim.productName} — Fiche Précontractuelle Indicative
                          </span>
                        </div>
                        <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-mono-code font-bold px-2 py-0.5 rounded">
                          Art. 6 CIMA
                        </span>
                      </div>

                      {/* Métriques Clés */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        <div className="bg-white dark:bg-[#202020] p-2.5 rounded-lg border border-slate-200 dark:border-[#2c2c2c]">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono-code">Cotisation</div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 font-heading">
                            {sim.monthlyAmount.toLocaleString('fr-FR')} F <span className="text-[10px] text-slate-400 font-normal">/mois</span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-[#202020] p-2.5 rounded-lg border border-slate-200 dark:border-[#2c2c2c]">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono-code">Durée</div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 font-heading">
                            {sim.durationYears} ans
                          </div>
                        </div>

                        <div className="bg-white dark:bg-[#202020] p-2.5 rounded-lg border border-slate-200 dark:border-[#2c2c2c]">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono-code">Total Cotisé</div>
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5 font-heading">
                            {sim.totalContributed.toLocaleString('fr-FR')} F
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-900/60">
                          <div className="text-[10px] text-red-700 dark:text-red-400 uppercase font-mono-code font-bold">Capital Garanti</div>
                          <div className="text-sm font-extrabold text-[#E21E26] dark:text-red-400 mt-0.5 font-heading">
                            {sim.guaranteedCapital.toLocaleString('fr-FR')} F
                          </div>
                        </div>
                      </div>

                      {/* Avantage Spécifique */}
                      <div className="text-xs bg-white/70 dark:bg-[#1a1a1a]/70 p-2.5 rounded-lg border border-slate-200/80 dark:border-[#2a2a2a] text-slate-700 dark:text-slate-300">
                        <strong className="text-[#E21E26] font-semibold">Prestation principale : </strong>
                        {sim.specificBenefit}
                      </div>

                      {/* Mentions Légales CIMA */}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 leading-snug">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{sim.cimaMentions}</span>
                      </div>

                      {/* Action Bar Avancée : WhatsApp, Impression Devis, Ajuster */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-[#2a2a2a] flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {/* Partage WhatsApp */}
                          <button
                            onClick={() => handleWhatsAppShare(sim)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                            title="Partager cette simulation sur WhatsApp"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Imprimer Devis PDF */}
                          <button
                            onClick={() => handlePrintQuote(sim)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-[#252525] dark:hover:bg-[#333] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-200 dark:border-[#333]"
                            title="Générer et imprimer le devis officiel"
                          >
                            <Printer className="w-3 h-3 text-[#E21E26]" />
                            <span>Imprimer Devis</span>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            const found = PORTFOLIO_PRODUCTS.find(p => p.id === sim.productId) || PORTFOLIO_PRODUCTS[0];
                            setSimProduct(found);
                            setSimAmount(sim.monthlyAmount);
                            setSimDuration(sim.durationYears);
                            setShowSimulatorModal(true);
                          }}
                          className="text-xs text-[#E21E26] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                          Ajuster simulation
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Bar du message : Évaluation Testeur, Audio Readout, Copier, Traçabilité */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#252525] flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#888]">
                    <span className="text-[11px] text-slate-400 dark:text-[#666] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      SUNU Bank Togo • Traçabilité CIMA
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Évaluation du Testeur (Thumbs Up / Down) */}
                      <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-[#333] pr-2 mr-0.5">
                        <button
                          onClick={() => handleFeedback(msg.id, 'positive')}
                          className={`p-1 rounded transition-colors cursor-pointer ${feedbackScores[msg.id] === 'positive' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 font-bold' : 'text-slate-400 hover:text-emerald-600'}`}
                          title="Réponse claire et conforme CIMA"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'negative')}
                          className={`p-1 rounded transition-colors cursor-pointer ${feedbackScores[msg.id] === 'negative' ? 'text-red-600 bg-red-50 dark:bg-red-950/60 font-bold' : 'text-slate-400 hover:text-red-600'}`}
                          title="À préciser ou inexacte"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Audio Readout Toggle */}
                      <button
                        onClick={() => handleSpeakMessage(msg.id, msg.content)}
                        className={`p-1 rounded transition-colors cursor-pointer ${isSpeakingThis ? 'text-[#E21E26] bg-red-100 dark:bg-red-950 animate-pulse' : 'text-slate-400 hover:text-slate-800 dark:text-[#888] dark:hover:text-[#e2e2e2]'}`}
                        title={isSpeakingThis ? "Arrêter la lecture" : "Écouter la réponse"}
                      >
                        {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5 text-[#E21E26]" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* Copier */}
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
                <span className="text-xs font-mono-code ml-1 text-slate-600 dark:text-[#A3A3A3]">
                  {language === 'EW' ? "Ganyawo ƒe tɔtrɔ me le dzidzem..." : language === 'KB' ? "Kɛdɛɛ tɔm taa cɔnaʋ..." : "Vérification documentaire CIMA & simulation..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Toast d'évaluation de la réponse */}
      {feedbackToast && (
        <div className="fixed bottom-28 right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-mono-code flex items-center gap-2 animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Input Area with Vocal Speech-to-Text */}
      <div className="flex-shrink-0 w-full bg-white/95 dark:bg-[#1f1f1f]/95 backdrop-blur-xl border-t border-slate-200 dark:border-[#353534] px-3 py-2.5 sm:px-4 sm:py-3.5 md:p-4 z-20 transition-colors shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Quick Query Pills / Scénarios Démo Express */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-1.5 text-xs no-scrollbar items-center">
            {/* Bouton direct Diagnostic KYC */}
            <button
              id="btn-pill-kyc"
              onClick={() => {
                setKycStep(1);
                setShowKycModal(true);
              }}
              className="bg-[#E21E26] hover:bg-[#c00017] text-white font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer text-xs flex items-center gap-1.5 shadow-sm shrink-0"
              title="Ouvrir le questionnaire d'éligibilité KYC en 3 étapes (Art. 6 CIMA)"
            >
              <Compass className="w-3.5 h-3.5 text-white shrink-0" />
              <span>🧭 Diagnostic KYC (3 étapes)</span>
            </button>

            {getQuickPills(language).map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill.query)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-[#131313] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2a2a2a] text-slate-700 hover:text-slate-900 dark:text-[#A3A3A3] dark:hover:text-white px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-medium shrink-0"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Bandeau d'état Dictée Vocale Longue Durée avec Timer */}
          {isListening && (
            <div className="flex items-center justify-between px-3.5 py-2 mb-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-[#E21E26] animate-fade-in shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E21E26] animate-ping shrink-0" />
                <span className="font-bold font-mono-code bg-[#E21E26] text-white px-2 py-0.5 rounded text-[11px] shadow-xs">
                  🔴 {formatRecordingTime(recordingSeconds)}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">Microphone Ouvert (Dictée Illimitée)</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden md:inline">— Parlez aussi longtemps que vous voulez, les silences sont autorisés !</span>
              </div>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className="text-xs font-bold bg-[#E21E26] hover:bg-[#c00017] text-white px-3 py-1 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Terminer la dictée
              </button>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="relative w-full flex items-center gap-2" id="concierge-chat-form">
            <div className="relative flex-1">
              <input
                id="concierge-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? (language === 'EN' ? "🎙️ Continuous listening... Speak as long as you want!" : "🎙️ Écoute continue active... Parlez aussi longtemps que vous voulez !") : getInputPlaceholder(language)}
                className={`w-full bg-slate-50 dark:bg-[#1B1B1B] border rounded-xl py-2.5 sm:py-3.5 pl-3.5 sm:pl-4 pr-12 sm:pr-14 text-slate-900 dark:text-[#e5e2e1] text-sm sm:text-base focus:outline-none transition-all shadow-inner placeholder-slate-400 dark:placeholder-[#777777] ${
                  isListening 
                    ? 'border-red-500 ring-2 ring-red-500/30' 
                    : 'border-slate-300 dark:border-[#2a2a2a] focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26]'
                }`}
              />

              {/* Bouton Microphone Vocal (Speech-to-Text) */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-[#E21E26] text-white shadow-md animate-pulse' 
                    : 'text-slate-400 hover:text-[#E21E26] hover:bg-slate-100 dark:hover:bg-[#252525]'
                }`}
                title={isListening ? "Arrêter la dictée vocale continue" : "Parler au micro (Reconnaissance vocale continue)"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Bouton Envoyer */}
            <button
              id="concierge-chat-send-btn"
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E21E26] text-white rounded-xl flex items-center justify-center hover:bg-[#c00017] transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                send
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* MULTI-PRODUCT ACTUARIAL SIMULATOR MODAL */}
      {showSimulatorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#191919] border border-slate-200 dark:border-[#2D2D2D] rounded-2xl max-w-lg w-full p-4 sm:p-6 text-slate-800 dark:text-[#e2e2e2] shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-[#2D2D2D] pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#E21E26]" />
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Simulateur Bancassurance Vie CIMA
                </h3>
              </div>
              <button 
                onClick={() => setShowSimulatorModal(false)} 
                className="text-slate-400 hover:text-slate-700 dark:text-[#A3A3A3] dark:hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase font-mono-code">
                  Produit de Bancassurance SUNU Bank
                </label>
                <select
                  value={simProduct.id}
                  onChange={(e) => {
                    const found = PORTFOLIO_PRODUCTS.find(p => p.id === e.target.value) || PORTFOLIO_PRODUCTS[0];
                    setSimProduct(found);
                    setSimAmount(found.defaultAmount);
                    setSimDuration(found.defaultDuration);
                  }}
                  className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#333] rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:border-[#E21E26] focus:outline-none"
                >
                  {PORTFOLIO_PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Cotisation Mensuelle :
                  </span>
                  <span className="text-sm font-bold text-[#E21E26] font-mono-code">
                    {simAmount.toLocaleString('fr-FR')} FCFA / mois
                  </span>
                </div>
                <input
                  type="range"
                  min={simProduct.minAmount}
                  max={simProduct.id.includes('retraite') ? 200000 : 50000}
                  step={simProduct.minAmount >= 5000 ? 5000 : 500}
                  value={simAmount}
                  onChange={(e) => setSimAmount(Number(e.target.value))}
                  className="w-full accent-[#E21E26] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono-code">
                  <span>Min: {simProduct.minAmount.toLocaleString('fr-FR')} F</span>
                  <span>Max: {simProduct.id.includes('retraite') ? '200 000' : '50 000'} F</span>
                </div>
              </div>

              {simProduct.minDur !== simProduct.maxDur && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Durée du Contrat :
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono-code">
                      {simDuration} ans
                    </span>
                  </div>
                  <input
                    type="range"
                    min={simProduct.minDur}
                    max={simProduct.maxDur}
                    step={1}
                    value={simDuration}
                    onChange={(e) => setSimDuration(Number(e.target.value))}
                    className="w-full accent-[#E21E26] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono-code">
                    <span>{simProduct.minDur} ans</span>
                    <span>{simProduct.maxDur} ans</span>
                  </div>
                </div>
              )}

              {modalSimResult && (
                <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#252525] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-code uppercase">
                      Capital Garanti à Terme (TMG 3,5%)
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold font-mono-code">
                      Code CIMA
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#E21E26] font-heading">
                    {modalSimResult.guaranteedCapital.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-[#222]">
                    Total cotisé : <strong>{modalSimResult.totalContributed.toLocaleString('fr-FR')} FCFA</strong> sur {modalSimResult.durationYears} an(s).
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] p-2.5 rounded-lg border border-slate-200 dark:border-[#262626]">
                    <strong>Garantie clé : </strong> {modalSimResult.specificBenefit}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowSimulatorModal(false)}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252525] text-xs font-medium cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={handleInsertModalSim}
                className="bg-[#E21E26] hover:bg-[#c00017] text-white px-4 py-2 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Insérer dans la discussion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPARATEUR VISUEL DE PRODUITS MODAL */}
      {showCompareModal && (() => {
        // Paramètres réels et calculs actuariels CIMA côte-à-côte
        const durA = Math.min(Math.max(compareDurationYears, compareProdA.minDur), compareProdA.maxDur);
        const amtA = Math.max(compareMonthlyAmount, compareProdA.minAmount);
        const totalPaidA = amtA * 12 * durA;
        const r = 0.035;
        const capitalA = compareProdA.isEpargne ? Math.round((amtA * 12) * (((Math.pow(1 + r, durA) - 1) / r)) * (1 + r / 2)) : 0;
        const fidelityA = compareProdA.id === 'horizon_retraite' && durA >= 10 ? Math.round(0.92 * (amtA * 12)) : 0;
        const totalCapA = compareProdA.id === 'protect_plus' 
          ? (amtA >= 1000 ? 1000000 : 500000) 
          : (compareProdA.id === 'secure_compte' ? 2000000 : capitalA + fidelityA);

        const durB = Math.min(Math.max(compareDurationYears, compareProdB.minDur), compareProdB.maxDur);
        const amtB = Math.max(compareMonthlyAmount, compareProdB.minAmount);
        const totalPaidB = amtB * 12 * durB;
        const capitalB = compareProdB.isEpargne ? Math.round((amtB * 12) * (((Math.pow(1 + r, durB) - 1) / r)) * (1 + r / 2)) : 0;
        const fidelityB = compareProdB.id === 'horizon_retraite' && durB >= 10 ? Math.round(0.92 * (amtB * 12)) : 0;
        const totalCapB = compareProdB.id === 'protect_plus' 
          ? (amtB >= 1000 ? 1000000 : 500000) 
          : (compareProdB.id === 'secure_compte' ? 2000000 : capitalB + fidelityB);

        const isSame = compareProdA.id === compareProdB.id;

        const handleSwapProducts = () => {
          const temp = compareProdA;
          setCompareProdA(compareProdB);
          setCompareProdB(temp);
        };

        const advice = evaluateComparisonAdvice(compareProdA, compareProdB, compareMonthlyAmount, compareDurationYears, compareUserNeed);

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#191919] border border-slate-200 dark:border-[#2D2D2D] rounded-2xl max-w-4xl w-full p-3 sm:p-6 text-slate-800 dark:text-[#e2e2e2] shadow-2xl relative my-auto max-h-[94vh] sm:max-h-[92vh] flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-[#2D2D2D] pb-3 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 flex items-center justify-center text-[#E21E26] shrink-0">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-lg text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span>Comparateur & Conseil CIMA</span>
                      <span className="text-[9px] sm:text-[10px] uppercase font-mono-code font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                        Arbitrage Certifié
                      </span>
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#888]">
                      Comparez réellement deux contrats selon votre besoin et recevez la recommandation personnalisée d'un actuaire.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCompareModal(false)} 
                  className="text-slate-400 hover:text-slate-700 dark:text-[#A3A3A3] dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252525] cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto pr-1 space-y-3.5 text-xs flex-1">
                
                {/* 1. Étape 1 : Quel est votre besoin ou objectif prioritaire ? */}
                <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-200 dark:border-[#282828] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 dark:border-[#252525] pb-1.5">
                    <span className="font-bold text-[11px] uppercase font-mono-code text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#E21E26]" />
                      1. Votre besoin ou objectif prioritaire
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                      🎯 {advice.currentNeed.desc}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {COMPARISON_NEEDS.map((need) => (
                      <button
                        key={need.id}
                        type="button"
                        onClick={() => setCompareUserNeed(need.id)}
                        className={`p-2 rounded-lg text-left transition-all cursor-pointer flex flex-col justify-between border ${
                          compareUserNeed === need.id
                            ? 'bg-red-50 dark:bg-red-950/40 border-[#E21E26] ring-1 ring-[#E21E26] text-slate-900 dark:text-white shadow-xs'
                            : 'bg-white dark:bg-[#1c1c1c] border-slate-200 dark:border-[#2c2c2c] text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-bold text-xs">
                          <span>{need.icon}</span>
                          <span className="truncate">{need.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Étape 2 : Product Selectors with Swap */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2.5 items-end bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-200 dark:border-[#282828]">
                  <div>
                    <label className="block font-bold text-[11px] uppercase font-mono-code text-[#E21E26] mb-1">
                      Produit A (Référence)
                    </label>
                    <select
                      value={compareProdA.id}
                      onChange={(e) => setCompareProdA(PORTFOLIO_PRODUCTS.find(p => p.id === e.target.value) || PORTFOLIO_PRODUCTS[0])}
                      className="w-full bg-white dark:bg-[#1f1f1f] border border-slate-300 dark:border-[#383838] rounded-lg p-2 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E21E26] outline-none"
                    >
                      {PORTFOLIO_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
                    </select>
                  </div>

                  <div className="flex justify-center sm:pb-1">
                    <button
                      type="button"
                      onClick={handleSwapProducts}
                      title="Intervertir Produit A et Produit B"
                      className="p-2 rounded-lg bg-white dark:bg-[#222] border border-slate-300 dark:border-[#333] hover:border-[#E21E26] text-slate-600 dark:text-slate-300 hover:text-[#E21E26] transition-all cursor-pointer shadow-sm flex items-center gap-1 text-[11px] font-medium"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      <span className="sm:hidden">Intervertir</span>
                    </button>
                  </div>

                  <div>
                    <label className="block font-bold text-[11px] uppercase font-mono-code text-emerald-600 dark:text-emerald-400 mb-1">
                      Produit B (Comparé)
                    </label>
                    <select
                      value={compareProdB.id}
                      onChange={(e) => setCompareProdB(PORTFOLIO_PRODUCTS.find(p => p.id === e.target.value) || PORTFOLIO_PRODUCTS[1])}
                      className="w-full bg-white dark:bg-[#1f1f1f] border border-slate-300 dark:border-[#383838] rounded-lg p-2 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {PORTFOLIO_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
                    </select>
                  </div>
                </div>

                {isSame && (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Vous avez sélectionné le même produit des deux côtés. Choisissez deux contrats distincts pour visualiser les écarts.</span>
                  </div>
                )}

                {/* 3. Étape 3 : Simulation Parameters Bar */}
                <div className="bg-slate-50 dark:bg-[#161616] p-3 rounded-xl border border-slate-200 dark:border-[#262626] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-[#262626] pb-2">
                    <span className="font-bold text-[11px] uppercase font-mono-code text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#E21E26]" />
                      Paramètres de simulation comparative en direct
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Taux Minimum Garanti (TMG) : <strong>3,5% net/an</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Monthly Amount Input & Presets */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-medium text-slate-700 dark:text-slate-300">
                          Cotisation mensuelle simulée :
                        </label>
                        <span className="font-extrabold font-mono-code text-[#E21E26]">
                          {compareMonthlyAmount.toLocaleString('fr-FR')} FCFA / mois
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5000}
                        max={100000}
                        step={5000}
                        value={compareMonthlyAmount}
                        onChange={(e) => setCompareMonthlyAmount(Number(e.target.value))}
                        className="w-full accent-[#E21E26] cursor-pointer"
                      />
                      <div className="flex gap-1.5 mt-1.5">
                        {[10000, 20000, 25000, 50000].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setCompareMonthlyAmount(val)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-medium transition-colors cursor-pointer ${
                              compareMonthlyAmount === val
                                ? 'bg-[#E21E26] text-white'
                                : 'bg-slate-200 dark:bg-[#252525] text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            }`}
                          >
                            {val >= 1000 ? `${val / 1000}k` : val} F
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration Input & Presets */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-medium text-slate-700 dark:text-slate-300">
                          Durée de capitalisation :
                        </label>
                        <span className="font-extrabold font-mono-code text-emerald-600 dark:text-emerald-400">
                          {compareDurationYears} an(s)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={3}
                        max={25}
                        step={1}
                        value={compareDurationYears}
                        onChange={(e) => setCompareDurationYears(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex gap-1.5 mt-1.5">
                        {[5, 10, 15, 20].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setCompareDurationYears(val)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-medium transition-colors cursor-pointer ${
                              compareDurationYears === val
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-[#252525] text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            }`}
                          >
                            {val} ans
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. VERDICT & CONSEIL PERSONNALISÉ DU CONSEILLER SUNU BANK */}
                <div className="bg-gradient-to-br from-red-50/80 via-white to-emerald-50/80 dark:from-[#1e1414] dark:via-[#181818] dark:to-[#121c17] p-4 rounded-xl border-2 border-red-200 dark:border-red-900/60 shadow-md space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-200/60 dark:border-red-900/40 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#E21E26] text-white shadow-xs">
                        <Award className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Verdict du Conseiller :</span>
                          <span className="text-[#E21E26] font-black underline decoration-red-400">
                            {advice.winner.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Recommandation personnalisée pour votre projet : <strong>« {advice.currentNeed.label} »</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-code font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      {advice.matchScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/90 dark:bg-[#1f1f1f]/90 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/50 space-y-1.5 shadow-xs">
                      <div className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Pourquoi choisir {advice.winner.name} :</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 pl-4 list-disc text-[11px]">
                        {advice.winnerReasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/90 dark:bg-[#1f1f1f]/90 p-3 rounded-lg border border-slate-200 dark:border-[#333] space-y-1.5 shadow-xs">
                      <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Dans quel cas préférer plutôt {advice.other.name} :</span>
                      </div>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-4 list-disc text-[11px]">
                        {advice.otherReasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <span className="text-base shrink-0">💡</span>
                    <div>
                      <strong>Règle d'or du Conseiller :</strong> {advice.goldenRule}
                    </div>
                  </div>
                </div>

                {/* 5. Side-by-Side Simulation Results Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Card Produit A */}
                  <div className={`p-3.5 rounded-xl border ${advice.isWinnerA ? 'border-red-400 dark:border-red-800 ring-2 ring-red-400/40' : 'border-red-200 dark:border-red-950/60'} bg-red-50/40 dark:bg-red-950/15 space-y-2 relative overflow-hidden`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {compareProdA.name}
                        </span>
                        {advice.isWinnerA && (
                          <span className="text-[9px] font-bold bg-emerald-600 text-white uppercase font-mono-code px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Star className="w-2.5 h-2.5 fill-white" /> Recommandé
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#E21E26] uppercase font-mono-code bg-red-100 dark:bg-red-950/80 px-2 py-0.5 rounded">
                        Produit A
                      </span>
                    </div>

                    <div className="border-t border-red-200/60 dark:border-red-900/30 pt-2 space-y-1">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Cotisation retenue :</span>
                        <strong className="text-slate-900 dark:text-white font-mono-code">
                          {amtA.toLocaleString('fr-FR')} FCFA/mois
                        </strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Durée effective :</span>
                        <strong className="text-slate-900 dark:text-white font-mono-code">
                          {durA} an(s) {durA !== compareDurationYears && `(max: ${compareProdA.maxDur}a)`}
                        </strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Total cotisé :</span>
                        <span className="font-mono-code font-bold text-slate-800 dark:text-slate-200">
                          {totalPaidA.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a1a1a] p-2.5 rounded-lg border border-red-200 dark:border-red-900/40">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono-code">
                        {compareProdA.isEpargne ? 'Capital Garanti Estimé au terme (TMG 3,5%)' : 'Prestation Prévoyance / Décès'}
                      </div>
                      <div className="text-lg font-extrabold text-[#E21E26] font-heading mt-0.5">
                        {totalCapA.toLocaleString('fr-FR')} FCFA
                      </div>
                      {fidelityA > 0 && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          ✓ Inclut le bonus fidélité de 92% (+{fidelityA.toLocaleString('fr-FR')} FCFA)
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      🎯 {compareProdA.pointFort}
                    </p>
                  </div>

                  {/* Card Produit B */}
                  <div className={`p-3.5 rounded-xl border ${advice.isWinnerB ? 'border-emerald-400 dark:border-emerald-800 ring-2 ring-emerald-400/40' : 'border-emerald-200 dark:border-emerald-950/60'} bg-emerald-50/40 dark:bg-emerald-950/15 space-y-2 relative overflow-hidden`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {compareProdB.name}
                        </span>
                        {advice.isWinnerB && (
                          <span className="text-[9px] font-bold bg-emerald-600 text-white uppercase font-mono-code px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Star className="w-2.5 h-2.5 fill-white" /> Recommandé
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase font-mono-code bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                        Produit B
                      </span>
                    </div>

                    <div className="border-t border-emerald-200/60 dark:border-emerald-900/30 pt-2 space-y-1">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Cotisation retenue :</span>
                        <strong className="text-slate-900 dark:text-white font-mono-code">
                          {amtB.toLocaleString('fr-FR')} FCFA/mois
                        </strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Durée effective :</span>
                        <strong className="text-slate-900 dark:text-white font-mono-code">
                          {durB} an(s) {durB !== compareDurationYears && `(max: ${compareProdB.maxDur}a)`}
                        </strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Total cotisé :</span>
                        <span className="font-mono-code font-bold text-slate-800 dark:text-slate-200">
                          {totalPaidB.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a1a1a] p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono-code">
                        {compareProdB.isEpargne ? 'Capital Garanti Estimé au terme (TMG 3,5%)' : 'Prestation Prévoyance / Décès'}
                      </div>
                      <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 font-heading mt-0.5">
                        {totalCapB.toLocaleString('fr-FR')} FCFA
                      </div>
                      {fidelityB > 0 && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          ✓ Inclut le bonus fidélité de 92% (+{fidelityB.toLocaleString('fr-FR')} FCFA)
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      🎯 {compareProdB.pointFort}
                    </p>
                  </div>
                </div>

                {/* 6. Detailed Comparison Table */}
                <div className="border border-slate-200 dark:border-[#2D2D2D] rounded-xl overflow-x-auto shadow-sm">
                  <table className="w-full min-w-[500px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-[#222] border-b border-slate-200 dark:border-[#2D2D2D]">
                        <th className="p-2.5 font-bold text-slate-600 dark:text-slate-300 w-[28%]">
                          Critères CIMA & Caractéristiques
                        </th>
                        <th className="p-2.5 font-bold text-[#E21E26] w-[36%] border-l border-slate-200 dark:border-[#2D2D2D]">
                          {compareProdA.name}
                        </th>
                        <th className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400 w-[36%] border-l border-slate-200 dark:border-[#2D2D2D]">
                          {compareProdB.name}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#262626] text-[11px]">
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Catégorie</td>
                        <td className="p-2.5 font-medium border-l border-slate-100 dark:border-[#262626]">{compareProdA.category}</td>
                        <td className="p-2.5 font-medium border-l border-slate-100 dark:border-[#262626]">{compareProdB.category}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Cotisation minimale</td>
                        <td className="p-2.5 font-bold font-mono-code text-[#E21E26] border-l border-slate-100 dark:border-[#262626]">
                          {compareProdA.minAmount.toLocaleString('fr-FR')} FCFA/mois
                        </td>
                        <td className="p-2.5 font-bold font-mono-code text-emerald-600 dark:text-emerald-400 border-l border-slate-100 dark:border-[#262626]">
                          {compareProdB.minAmount.toLocaleString('fr-FR')} FCFA/mois
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Durée contractuelle</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">
                          {compareProdA.minDur === compareProdA.maxDur ? `${compareProdA.minDur} an(s)` : `${compareProdA.minDur} à ${compareProdA.maxDur} ans`}
                        </td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">
                          {compareProdB.minDur === compareProdB.maxDur ? `${compareProdB.minDur} an(s)` : `${compareProdB.minDur} à ${compareProdB.maxDur} ans`}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Rendement garanti CIMA</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdA.tauxGaranti}</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdB.tauxGaranti}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Prestation de sortie</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdA.payout}</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdB.payout}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Garantie Prévoyance / Décès</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdA.prevoyance}</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdB.prevoyance}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Rachat CIMA (Art. 74 & 76)</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdA.rachatCima}</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdB.rachatCima}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Droit de renonciation (Art. 76)</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdA.renonciation}</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdB.renonciation}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#161616]">Participation aux bénéfices (Art. 84)</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdA.participationBenefices}</td>
                        <td className="p-2.5 border-l border-slate-100 dark:border-[#262626]">{compareProdB.participationBenefices}</td>
                      </tr>
                      <tr className="bg-amber-50/30 dark:bg-amber-950/10">
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200 bg-amber-100/40 dark:bg-amber-950/30">
                          Profil & Recommandation
                        </td>
                        <td className="p-2.5 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-[#262626]">
                          {compareProdA.quiDevraitChoisir}
                        </td>
                        <td className="p-2.5 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-[#262626]">
                          {compareProdB.quiDevraitChoisir}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#2D2D2D] flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                  ⚖️ Conforme Articles 6, 65-1, 74, 76 & 84 du Code CIMA.
                </span>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252525] text-xs font-medium cursor-pointer transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => handleInsertComparison(compareProdA, compareProdB, compareMonthlyAmount, compareDurationYears, advice.currentNeed.label)}
                    className="bg-[#E21E26] hover:bg-[#c00017] text-white px-3.5 sm:px-4 py-2 rounded-lg font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span className="hidden sm:inline">Demander l'analyse détaillée et le conseil au Conseiller Virtuel</span>
                    <span className="sm:hidden">Demander le conseil au Bot</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* LEXIQUE INTERACTIF CIMA MODAL */}
      {showLexiconModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#191919] border border-slate-200 dark:border-[#2D2D2D] rounded-2xl max-w-2xl w-full p-4 sm:p-6 text-slate-800 dark:text-[#e2e2e2] shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-[#2D2D2D] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#E21E26]" />
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    Glossaire & Littératie Financière CIMA
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#888]">
                    Encyclopédie réglementaire et actuarielle (14 États membres CIMA) • {filteredLexicon.length} terme(s) affiché(s)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowLexiconModal(false)} 
                className="text-slate-400 hover:text-slate-700 dark:text-[#A3A3A3] dark:hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Onglets Filtres par Catégorie */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar text-[11px]">
              {[
                { id: 'all', label: `Tous (${CIMA_LEXICON.length})` },
                { id: 'Réglementation', label: '⚖️ Réglementation CIMA (9)' },
                { id: 'Actuariat', label: '📊 Actuariat & Taux (6)' },
                { id: 'Contrat', label: '📜 Contrat & Prévoyance (10)' },
                { id: 'Bancassurance', label: '🏦 Bancassurance Togo (7)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setLexiconCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    lexiconCategory === cat.id
                      ? 'bg-[#E21E26] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#222] dark:hover:bg-[#2c2c2c] text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Recherche Lexique */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={lexiconSearch}
                onChange={(e) => setLexiconSearch(e.target.value)}
                placeholder="Rechercher un terme, un article (ex: rachat, renonciation, TMG, PM, 74)..."
                className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#333] rounded-lg pl-9 pr-3 py-2 text-xs focus:border-[#E21E26] focus:outline-none"
              />
            </div>

            {/* Liste des termes */}
            <div className="max-h-[52vh] overflow-y-auto space-y-2.5 pr-1 text-xs">
              {filteredLexicon.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 dark:bg-[#141414] p-3.5 rounded-xl border border-slate-200 dark:border-[#292929] hover:border-[#E21E26]/40 transition-colors space-y-1.5 shadow-xs"
                >
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-mono-code font-bold px-1.5 py-0.5 rounded ${
                        item.category === 'Réglementation' ? 'bg-red-100 dark:bg-red-950 text-[#E21E26]' :
                        item.category === 'Actuariat' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' :
                        item.category === 'Contrat' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                        'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-sm font-heading font-extrabold">{item.term}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowLexiconModal(false);
                        handleSendMessage(`Explique-moi en détail ce que signifie : « ${item.term} » selon le Code CIMA.`);
                      }}
                      className="text-[11px] text-[#E21E26] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      <span>Poser au bot</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                    {item.definition}
                  </div>
                </div>
              ))}
              {filteredLexicon.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aucun terme ne correspond à votre recherche.
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200 dark:border-[#2D2D2D] text-[11px] text-slate-500">
              <span>Code CIMA harmonisé • 14 pays membres de la zone franc</span>
              <button
                onClick={() => setShowLexiconModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#252525] text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}


      {/* KYC ELIGIBILITY & RECOMMENDATION MODAL */}
      {showKycModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#191919] border border-slate-200 dark:border-[#2D2D2D] rounded-2xl max-w-lg w-full p-4 sm:p-6 text-slate-800 dark:text-[#e2e2e2] shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-[#2D2D2D] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#E21E26]" />
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    Assistant d'Éligibilité & Diagnostic KYC
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#888]">
                    Obligation de conseil et profilage client (Art. 6 Code CIMA)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowKycModal(false)} 
                className="text-slate-400 hover:text-slate-700 dark:text-[#A3A3A3] dark:hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className={`flex items-center gap-1.5 text-xs font-bold ${kycStep === 1 ? 'text-[#E21E26]' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${kycStep === 1 ? 'bg-[#E21E26] text-white' : 'bg-slate-200 dark:bg-[#333]'}`}>1</span>
                <span>Projet</span>
              </div>
              <div className="h-0.5 flex-1 mx-2 bg-slate-200 dark:bg-[#333]"></div>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${kycStep === 2 ? 'text-[#E21E26]' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${kycStep === 2 ? 'bg-[#E21E26] text-white' : 'bg-slate-200 dark:bg-[#333]'}`}>2</span>
                <span>Budget</span>
              </div>
              <div className="h-0.5 flex-1 mx-2 bg-slate-200 dark:bg-[#333]"></div>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${kycStep === 3 ? 'text-[#E21E26]' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${kycStep === 3 ? 'bg-[#E21E26] text-white' : 'bg-slate-200 dark:bg-[#333]'}`}>3</span>
                <span>Résultat</span>
              </div>
            </div>

            {/* STEP 1: PROJET */}
            {kycStep === 1 && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quel est votre objectif prioritaire de prévoyance ou d'épargne ?
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'education', icon: '🎓', title: 'Financer les études de mes enfants', desc: 'Constitution de capital pour l\'université et rentes échelonnées (Visa Études)' },
                    { id: 'retraite', icon: '🏖️', title: 'Préparer ma retraite professionnelle', desc: 'Capital ou rente viagère avec bonus de fidélité 92% (Horizon Retraite)' },
                    { id: 'sante', icon: '🏥', title: 'Protéger ma santé et ma famille en cas d\'accident', desc: 'Forfait hospitalisation d\'urgence dès 5j et capital décès (Protect Plus)' },
                    { id: 'bonus', icon: '🎁', title: 'Épargner avec tirages au sort trimestriels', desc: 'Possibilité de remporter le capital entier dès le prochain tirage (Épargne Bonus / Moov)' },
                    { id: 'obseques', icon: '🕊️', title: 'Prévoir des obsèques dignes pour mes proches', desc: 'Prise en charge rapide des dépenses funéraires (Sérénité)' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setKycGoal(opt.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        kycGoal === opt.id
                          ? 'border-[#E21E26] bg-red-50/50 dark:bg-red-950/20 ring-1 ring-[#E21E26]'
                          : 'border-slate-200 dark:border-[#2a2a2a] hover:bg-slate-50 dark:hover:bg-[#202020]'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{opt.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setKycStep(2)}
                    className="bg-[#E21E26] hover:bg-[#c00017] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Suivant : Votre Budget</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: BUDGET & DURÉE */}
            {kycStep === 2 && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Capacité d'épargne mensuelle sans déséquilibrer votre budget :
                    </span>
                    <span className="text-sm font-bold text-[#E21E26] font-mono-code">
                      {kycBudget.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={100000}
                    step={kycBudget < 5000 ? 500 : 5000}
                    value={kycBudget}
                    onChange={(e) => setKycBudget(Number(e.target.value))}
                    className="w-full accent-[#E21E26] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono-code">
                    <span>500 F (Micro-assurance)</span>
                    <span>25 000 F</span>
                    <span>100 000 F+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Horizon temporel souhaité :
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono-code">
                      {kycHorizon} an(s)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    step={1}
                    value={kycHorizon}
                    onChange={(e) => setKycHorizon(Number(e.target.value))}
                    className="w-full accent-[#E21E26] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono-code">
                    <span>1 an (court terme)</span>
                    <span>5 ans (moyen terme)</span>
                    <span>25 ans (long terme)</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center pt-2">
                  <button
                    onClick={() => setKycStep(1)}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white px-2 py-1 cursor-pointer"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={() => setKycStep(3)}
                    className="bg-[#E21E26] hover:bg-[#c00017] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Voir ma Recommandation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: RÉSULTAT */}
            {kycStep === 3 && (() => {
              const rec = getKycRecommendation();
              return (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-red-50 to-slate-50 dark:from-[#221718] dark:to-[#181818] p-4 rounded-xl border border-red-200 dark:border-red-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono-code font-bold text-[#E21E26] bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded">
                        Recommandation Certifiée CIMA
                      </span>
                      <span className="text-[10px] font-mono-code font-bold text-emerald-600 dark:text-emerald-400">
                        {rec.confidence}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                        {rec.product.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {rec.product.category}
                      </p>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-[#1f1f1f]/80 p-3 rounded-lg border border-slate-200 dark:border-[#2a2a2a]">
                      <strong>Analyse de convenance : </strong>
                      {rec.reason}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-white dark:bg-[#202020] p-2 rounded border border-slate-200 dark:border-[#2a2a2a]">
                        <div className="text-[10px] text-slate-400 uppercase">Cotisation cible</div>
                        <div className="font-bold text-slate-900 dark:text-white font-mono-code mt-0.5">
                          {kycBudget.toLocaleString('fr-FR')} F/mois
                        </div>
                      </div>
                      <div className="bg-white dark:bg-[#202020] p-2 rounded border border-slate-200 dark:border-[#2a2a2a]">
                        <div className="text-[10px] text-slate-400 uppercase">Horizon CIMA</div>
                        <div className="font-bold text-slate-900 dark:text-white font-mono-code mt-0.5">
                          {kycHorizon} an(s)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setKycStep(2)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white px-2 py-1 cursor-pointer"
                    >
                      ← Modifier critères
                    </button>
                    <button
                      onClick={() => {
                        setShowKycModal(false);
                        handleSendMessage(`Fais-moi une simulation personnalisée pour ${rec.product.name} avec ${kycBudget.toLocaleString('fr-FR')} FCFA par mois sur ${kycHorizon} ans.`);
                      }}
                      className="bg-[#E21E26] hover:bg-[#c00017] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Lancer la simulation dans le chat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
