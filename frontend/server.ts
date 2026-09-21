import express, { Request, Response } from "express";
import path from "path";
import os from "os";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

export function getLocalNetworkIp(): string {
  const interfaces = os.networkInterfaces();
  // Check Wi-Fi or Ethernet first
  for (const name of Object.keys(interfaces)) {
    if (name.toLowerCase().includes("wi-fi") || name.toLowerCase().includes("wireless") || name.toLowerCase().includes("eth")) {
      for (const net of interfaces[name] || []) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  }
  // Fallback to any non-virtual IPv4
  for (const name of Object.keys(interfaces)) {
    if (!name.toLowerCase().includes("vethernet") && !name.toLowerCase().includes("pseudo")) {
      for (const net of interfaces[name] || []) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  }
  return "localhost";
}

// Initialize Gemini SDK with telemetry header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// ==============================================================================
// BASE DOCUMENTAIRE INSTITUTIONNELLE OFFICIELLE : 8 PRODUITS DU MÉMOIRE (CODE CIMA)
// ==============================================================================
export const SUNU_KNOWLEDGE_DOCUMENTS = [
  {
    id: "PROD-EP-EDUCATION",
    title: "Visa Études (Épargne-Éducation)",
    category: "Épargne & Prévoyance Éducation",
    startingPrice: "4 250 FCFA / mois (12 750 FCFA/trimestre, 51 000 FCFA/an)",
    duration: "3 à 15 ans au choix du souscripteur",
    yield: "Taux minimum garanti de 3,5% net l'an (Code CIMA) + participation aux bénéfices",
    benefits: [
      "Constitution progressive d'un capital garanti pour financer les études supérieures de l'enfant",
      "Versement au terme sous forme de capital unique ou de rentes trimestrielles d'études pendant 3 à 5 ans",
      "Prévoyance Décès/IAD : exonération intégrale des cotisations restantes et maintien du capital complet garanti à terme en cas de décès du parent",
      "Souscription accessible dès 18 ans pour un enfant de 0 à 18 ans"
    ],
    cima: "Régit par l'Article 6 et 65-1 du Code CIMA. Droit de renonciation légal de 30 jours (Art. 76). Rachat encadré dès 2 ans (Art. 74)."
  },
  {
    id: "PROD-EP-EDUPRO",
    title: "Visa Études Plus (Éducation Renforcée)",
    category: "Épargne-Éducation Haut de Gamme",
    startingPrice: "10 000 FCFA / mois",
    duration: "5 à 15 ans",
    yield: "Taux minimum garanti de 3,5% net l'an + participation aux bénéfices",
    benefits: [
      "Rente d'orphelinat immédiate versée dès le décès du souscripteur jusqu'au terme prévu de l'épargne",
      "Doublement du capital en cas de décès accidentel du parent souscripteur",
      "Versement de bourses trimestrielles d'études échelonnées pour sécuriser l'université de l'enfant",
      "Possibilité d'effectuer des versements libres complémentaires à tout moment"
    ],
    cima: "Conformité stricte Code CIMA Livre I. Protection renforcée de la famille et du mineur bénéficiaire."
  },
  {
    id: "PROD-EP-RETRAITE",
    title: "Horizon Retraite (Capitalisation Retraite Individuelle)",
    category: "Épargne & Capitalisation Retraite",
    startingPrice: "10 000 FCFA / mois",
    duration: "5 à 25 ans (recommandé 10 à 25 ans)",
    yield: "Taux minimum garanti de 3,5% l'an + participation aux bénéfices annuelle (Art. 84 CIMA)",
    benefits: [
      "Bonus de fidélité exceptionnel de 92% de la première annuité versé au terme (si durée >= 10 ans sans rachat)",
      "Choix à l'échéance entre capital unique en une fois ou rente viagère mensuelle réversible au conjoint",
      "Garantie prévoyance : capital constitué reversé aux ayants droit en cas de décès ou invalidité avant l'échéance",
      "Cadre fiscal avantageux pour la préparation de la fin de carrière professionnelle"
    ],
    cima: "Articles 6, 74, 76 et 84 du Code CIMA. Taux technique garanti de 3,5%. Indemnité de rachat plafonnée à 5% de la provision mathématique."
  },
  {
    id: "PROD-EP-RET5",
    title: "Horizon Retraite 5 (Retraite Accélérée)",
    category: "Retraite Cadres & Seniors",
    startingPrice: "25 000 FCFA / mois",
    duration: "5 ans ferme",
    yield: "Taux minimum garanti de 3,5% net l'an + participation aux bénéfices",
    benefits: [
      "Capitalisation accélérée sur 5 ans pour les cadres et travailleurs proches de la cessation d'activité",
      "Ticket d'entrée à partir de 25 000 FCFA/mois pour un apport rapide et sécurisé",
      "Garantie de transmission intégrale du capital aux bénéficiaires en cas de décès"
    ],
    cima: "Contrat de capitalisation à durée déterminée conforme au Code CIMA Livre I."
  },
  {
    id: "PROD-EP-BONUS",
    title: "Épargne Bonus SUNU",
    category: "Épargne Bonifiée avec Tirages au Sort",
    startingPrice: "5 000 FCFA / mois",
    duration: "10 ou 15 ans",
    yield: "Capital garanti au terme + participation aux bénéfices",
    benefits: [
      "Participation automatique aux tirages au sort nationaux trimestriels",
      "Gain par anticipation : en cas de tirage gagnant, versement immédiat de l'intégralité du capital prévu à terme et dispense totale du paiement des cotisations restantes",
      "En cas de vie sans gain au tirage, restitution du capital garanti majoré des intérêts au terme"
    ],
    cima: "Contrat de capitalisation avec tirages au sort strictement réglementé par les dispositions du Code CIMA."
  },
  {
    id: "PROD-PR-PROTPLUS",
    title: "Protect Plus (Micro-assurance Santé & Accident)",
    category: "Micro-assurance Prévoyance & Hospitalisation",
    startingPrice: "Dès 500 FCFA / mois (Petite Mise 5 000 F/an, Grande Mise 10 000 F/an)",
    duration: "1 an renouvelable (protection continue)",
    benefits: [
      "Forfait journalier d'hospitalisation : remboursement des frais médicaux dès le 5e jour d'hospitalisation consécutif suite à un accident (150 000 FCFA pour Petite Mise, 250 000 FCFA pour Grande Mise)",
      "Capital Décès ou Invalidité Absolue et Définitive (IAD) par accident : 500 000 FCFA (Petite Mise) ou 1 000 000 FCFA (Grande Mise)",
      "Couverture ultra-accessible sans examen médical lourd pour artisans, commerçants et ménages"
    ],
    cima: "Micro-assurance conforme au Livre VII du Code CIMA. Liquidation accélérée des prestations d'urgence."
  },
  {
    id: "PROD-PR-SECCOMPTE",
    title: "Secure Compte (Prévoyance adossée au Compte)",
    category: "Prévoyance Bancaire Intégrée",
    startingPrice: "De 2 700 FCFA à 33 500 FCFA par an (dès ~1 000 FCFA/mois)",
    duration: "Adossé au compte bancaire actif (18 à 70 ans)",
    benefits: [
      "Sécurisation des dépôts et des proches en cas de décès ou invalidité définitive du titulaire",
      "Paliers modulables : capital garanti de 400 000 FCFA jusqu'à 5 000 000 FCFA versé aux bénéficiaires désignés",
      "Prélèvement automatique annuel indolore sur le compte bancaire SUNU Bank Togo"
    ],
    cima: "Régime de prévoyance collective adossée au compte bancaire régi par le Code CIMA."
  },
  {
    id: "PROD-EP-DIGMOOV",
    title: "Épargne Moov (Assurance 100% Digitale)",
    category: "Micro-assurance & Mobile Money",
    startingPrice: "500 FCFA à 5 000 FCFA / mois via Moov Money",
    duration: "15 ans",
    yield: "Capitalisation sécurisée + tirages au sort",
    benefits: [
      "Souscription et cotisations dématérialisées directement depuis le menu USSD ou l'application Moov Money",
      "Tirages au sort trimestriels avec gain immédiat du capital total sur 15 ans sur son portefeuille mobile",
      "Accessible à toute la population togolaise même sans compte bancaire physique"
    ],
    cima: "Partenariat SUNU Assurances Vie Togo & Moov Africa Togo sous réglementation CIMA micro-assurance."
  },
  {
    id: "PROD-PR-DIGMOOV",
    title: "Prévoyance Moov",
    category: "Assurance Décès Mobile",
    startingPrice: "Dès 500 FCFA / mois via Moov Money",
    duration: "1 an renouvelable (18 à 64 ans)",
    benefits: [
      "Assurance décès ultra-simple garantissant 500 000 FCFA de secours à la famille",
      "Paiement automatique via le wallet Moov Money sans déplacement en agence",
      "Règlement prioritaire sous 48h aux bénéficiaires désignés"
    ],
    cima: "Micro-assurance décès digitale autorisée par la CRCA / CIMA."
  },
  {
    id: "PROD-EP-SERENITE",
    title: "Sérénité (Épargne & Prévoyance Obsèques)",
    category: "Épargne & Prévoyance Fin de Carrière",
    startingPrice: "Dès 5 000 FCFA / mois",
    duration: "5 à 20 ans",
    yield: "Taux minimum garanti 3,5% CIMA",
    benefits: [
      "Constitution d'un capital pour financer dignement les obsèques et soulager les proches",
      "Prise en charge rapide des dépenses funéraires d'urgence et transmission du solde d'épargne",
      "Possibilité de conversion en capital de retraite ou en rente viagère"
    ],
    cima: "Conforme aux garanties d'assurance de personnes du Code CIMA."
  },
  {
    id: "REG-CIMA-LIVRE1",
    title: "Code CIMA Livre I : Contrat d'Assurance Vie & Droits de l'Assuré",
    category: "Réglementation & Droit des Assurances (Livre I)",
    compliance: "Conférence Interafricaine des Marchés d'Assurances (CIMA)",
    benefits: [
      "Article 6 & 65-1 : Obligation légale d'information précontractuelle, remise de la notice d'information (KID) et encadré légal standardisé en caractères très apparents",
      "Article 74 : Conditions de rachat (exigible après 2 ans de cotisations effectives ou 15% des primes prévues pour les contrats < 10 ans)",
      "Article 76 : Faculté d'ordre public de renonciation de 30 jours calendaires avec remboursement intégral sous 30 jours (intérêts légaux majorés de moitié en cas de retard)",
      "Article 76 : Plafonnement légal strict de l'indemnité de rachat à un maximum de 5% de la provision mathématique (0% après 10 ans de contrat)",
      "Article 75 : Faculté d'avance sur police (prêt d'urgence consenti par l'assureur dans la limite de la provision mathématique sans résilier le contrat)",
      "Article 84 : Obligation légale de redistribution d'au moins 85% des bénéfices financiers nets avec effet cliquet (irréversibilité des gains acquis)",
      "Article 21 : Déclaration de sinistre sous un délai légal de 5 jours ouvrés dès que l'assuré ou les bénéficiaires en ont connaissance",
      "Article 28 : Prescription biennale extinctive (toutes actions dérivant du contrat se prescrivent par 2 ans à compter de l'événement)",
      "Article 60 & 68 : Clause bénéficiaire, désignation libre et conséquences juridiques du bénéficiaire acceptant (irrévocabilité sans son accord)"
    ]
  },
  {
    id: "REG-CIMA-ACTUARIAT",
    title: "Actuariat Vie & Décisions du Conseil des Ministres des Assurances (CMA)",
    category: "Réglementation Actuarielle & Prudentielle CIMA",
    compliance: "Décisions du Conseil des Ministres des Assurances (CMA) / CRCA",
    benefits: [
      "Taux Minimum Garanti (TMG) : Plafonné à 3,5% net l'an par décision du Conseil des Ministres pour sécuriser l'épargne sans risque d'insolvabilité",
      "Provisions Mathématiques (PM) : Obligation réglementaire d'adossement intégral au passif de l'assureur pour garantir à 100% les capitaux futurs",
      "Tables de Mortalité Réglementaires : Homologation des tables TD 88/90 (décès) et TF 88/90 (survie/rentes) adaptées à la démographie africaine",
      "Calcul des Rentes : Formules actuarielles d'actualisation pour les rentes d'éducation (Visa Études) et rentes viagères (Horizon Retraite)",
      "Effet Cliquet Actuariel : Tout intérêt technique et participation aux bénéfices affecté au contrat est définitivement acquis et garanti contre toute baisse"
    ]
  },
  {
    id: "REG-CIMA-LIVRE7",
    title: "Code CIMA Livre VII & Règlement n° 003/CIMA/2012 : Micro-assurance & Inclusion Financière",
    category: "Micro-assurance & Canaux Numériques",
    compliance: "Règlement n° 003/CIMA/2012 & Livre VII du Code CIMA",
    benefits: [
      "Livre VII CIMA : Dispositions dérogatoires et simplifiées pour rendre l'assurance accessible aux ménages modestes et au secteur informel",
      "Règlement n° 003/CIMA/2012 : Allègement des formalités de souscription, dispense de questionnaire médical lourd et conditions lisibles en une page",
      "Protect Plus [PROD-PR-PROTPLUS] : Forfait hospitalisation d'accident dès 500 F/mois versé sous 15 jours sans avance de frais exorbitante",
      "Épargne Moov & Prévoyance Moov [PROD-EP-DIGMOOV] : Souscription dématérialisée via Moov Money et liquidation express en 48 heures"
    ]
  },
  {
    id: "REG-CIMA-BANCASSURANCE",
    title: "Code CIMA Livre V, Circulaires CRCA & Mandat de Distribution Bancassurance",
    category: "Bancassurance & Intermédiation Financière",
    compliance: "Code CIMA Livre V, Circulaires CRCA & Normes BCEAO / IPDCP Togo",
    benefits: [
      "Livre V CIMA : Réglementation des intermédiaires d'assurance et conditions de mandat de distribution pour les établissements de crédit",
      "Convention SUNU Bank Togo & SUNU Assurances Vie Togo : Mandat de distribution exclusif en bancassurance intégrée",
      "Obligation de Convenance KYC (Art. 6) : Diagnostic patrimonial obligatoire du client pour lui recommander le contrat correspondant exactement à son profil",
      "Séparation des Fonds : Cantonnement strict entre les dépôts bancaires et les primes d'assurance collectées",
      "Loi togolaise n° 2019-014 (IPDCP Togo) : Protection des données à caractère personnel et consentement éclairé pour les prélèvements bancaires"
    ]
  },
  {
    id: "REG-CIMA-ORGANES",
    title: "Organes Réglementaires CIMA (CMA, CRCA, Secrétariat Général) & Recours des Assurés",
    category: "Supervision Institutionnelle & Règlement des Litiges",
    compliance: "Traité instituant la CIMA (Libreville) & Commission Régionale de Contrôle des Assurances (CRCA)",
    benefits: [
      "Conseil des Ministres des Assurances (CMA) : Organe législatif suprême qui adopte les règlements modifiant le Code CIMA",
      "Commission Régionale de Contrôle des Assurances (CRCA) : Juridiction de contrôle prudentiel siégeant à Libreville",
      "Secrétariat Général de la CIMA : Organe permanent d'inspection et de surveillance prudentielle des marchés d'assurance",
      "Procédure de Réclamation Client : Traitement amiable interne à SUNU Bank Togo sous 30 jours, puis recours auprès de la CRCA en cas de contestation persistante",
      "Articulation Régionale : Coopération institutionnelle étroite avec la BCEAO et la Commission Bancaire de l'UMOA"
    ]
  }
];

// ==============================================================================
// MOTEUR DE CALCUL ACTUARIEL CERTIFIÉ CIMA
// ==============================================================================
export interface SimulationCalculation {
  productId: string;
  productName: string;
  category: string;
  monthlyAmount: number;
  durationYears: number;
  totalContributed: number;
  guaranteedCapital: number;
  specificBenefit: string;
  fidelityBonus?: number;
  quarterlyPension?: number;
  deathDisabilityGuarantee: string;
  cimaMentions: string;
  summaryText: string;
}

export function computeActuarialSimulation(
  productKey: string,
  monthlyAmount?: number,
  durationYears?: number
): SimulationCalculation {
  const normKey = (productKey || "").toLowerCase();

  // 1. VISA ÉTUDES PLUS
  if (normKey.includes("plus") || normKey.includes("edupro")) {
    const amount = Math.max(monthlyAmount || 15000, 10000);
    const dur = Math.max(5, Math.min(durationYears || 10, 15));
    const totalPaid = amount * 12 * dur;
    const r = 0.035;
    const capital = Math.round((amount * 12) * (((Math.pow(1 + r, dur) - 1) / r)) * (1 + r / 2));
    const pensionTrim = Math.round((capital / 16) * 1.02);

    return {
      productId: "PROD-EP-EDUPRO",
      productName: "Visa Études Plus",
      category: "Épargne-Éducation Renforcée",
      monthlyAmount: amount,
      durationYears: dur,
      totalContributed: totalPaid,
      guaranteedCapital: capital,
      specificBenefit: `Rente d'orphelinat immédiate + Bourse trimestrielle de ${pensionTrim.toLocaleString('fr-FR')} FCFA pendant 4 ans (16 trimestres)`,
      quarterlyPension: pensionTrim,
      deathDisabilityGuarantee: "Exonération totale des primes + Rente d'orphelinat immédiate + Doublement du capital si décès accidentel",
      cimaMentions: "Conforme Articles 6 & 65-1 Code CIMA. Faculté de renonciation de 30 jours (Art. 76).",
      summaryText: `Pour Visa Études Plus avec ${amount.toLocaleString('fr-FR')} FCFA/mois sur ${dur} ans :\n• Total cotisé : ${totalPaid.toLocaleString('fr-FR')} FCFA\n• Capital garanti constitué : ${capital.toLocaleString('fr-FR')} FCFA\n• Rente trimestrielle d'études : ~${pensionTrim.toLocaleString('fr-FR')} FCFA / trimestre pendant 4 ans\n• Prévoyance : Exonération des cotisations, rente orphelinat immédiate et capital doublé en cas d'accident.`
    };
  }

  // 2. VISA ÉTUDES STANDARD
  if (normKey.includes("etude") || normKey.includes("étude") || normKey.includes("education") || normKey.includes("enfant")) {
    const amount = Math.max(monthlyAmount || 10000, 4250);
    const dur = Math.max(3, Math.min(durationYears || 10, 15));
    const totalPaid = amount * 12 * dur;
    const r = 0.035;
    const capital = Math.round((amount * 12) * (((Math.pow(1 + r, dur) - 1) / r)) * (1 + r / 2));
    const pensionTrim = Math.round((capital / 16) * 1.02);

    return {
      productId: "PROD-EP-EDUCATION",
      productName: "Visa Études",
      category: "Épargne-Éducation",
      monthlyAmount: amount,
      durationYears: dur,
      totalContributed: totalPaid,
      guaranteedCapital: capital,
      specificBenefit: `Rente trimestrielle d'études de ${pensionTrim.toLocaleString('fr-FR')} FCFA pendant 4 ans (ou capital unique de ${capital.toLocaleString('fr-FR')} FCFA)`,
      quarterlyPension: pensionTrim,
      deathDisabilityGuarantee: "Prise en charge intégrale des cotisations restantes par l'assureur si décès ou IAD du parent",
      cimaMentions: "Conforme Article 6 Code CIMA. Taux technique garanti 3,5%. Droit de renonciation de 30 jours.",
      summaryText: `Pour Visa Études avec ${amount.toLocaleString('fr-FR')} FCFA/mois sur ${dur} ans :\n• Total cotisé : ${totalPaid.toLocaleString('fr-FR')} FCFA\n• Capital garanti au terme : ${capital.toLocaleString('fr-FR')} FCFA\n• Bourse trimestrielle d'études : ~${pensionTrim.toLocaleString('fr-FR')} FCFA / trimestre pendant 4 ans\n• Prévoyance : Exonération totale des primes si coup dur du souscripteur.`
    };
  }

  // 3. HORIZON RETRAITE 5
  if (normKey.includes("ret5") || normKey.includes("retraite 5") || normKey.includes("retraite5")) {
    const amount = Math.max(monthlyAmount || 25000, 25000);
    const dur = 5;
    const totalPaid = amount * 12 * dur;
    const r = 0.035;
    const capital = Math.round((amount * 12) * (((Math.pow(1 + r, dur) - 1) / r)) * (1 + r / 2));

    return {
      productId: "PROD-EP-RET5",
      productName: "Horizon Retraite 5",
      category: "Retraite Accélérée (5 ans ferme)",
      monthlyAmount: amount,
      durationYears: dur,
      totalContributed: totalPaid,
      guaranteedCapital: capital,
      specificBenefit: "Capitalisation courte sur 5 ans ferme pour cadres et seniors proches de la retraite",
      deathDisabilityGuarantee: "Transmission intégrale du capital constitué garanti aux ayants droit en cas de décès",
      cimaMentions: "Conforme Code CIMA Livre I. Taux d'intérêt technique garanti 3,5% + Participation aux bénéfices Art. 84.",
      summaryText: `Pour Horizon Retraite 5 avec ${amount.toLocaleString('fr-FR')} FCFA/mois sur 5 ans ferme :\n• Total cotisé : ${totalPaid.toLocaleString('fr-FR')} FCFA\n• Capital garanti constitué : ${capital.toLocaleString('fr-FR')} FCFA\n• Solution idéale pour sécuriser sa transition vers la retraite.`
    };
  }

  // 4. HORIZON RETRAITE CLASSIQUE
  if (normKey.includes("retraite") || normKey.includes("horizon")) {
    const amount = Math.max(monthlyAmount || 25000, 10000);
    const dur = Math.max(5, Math.min(durationYears || 15, 25));
    const totalPaid = amount * 12 * dur;
    const r = 0.035;
    const baseCapital = Math.round((amount * 12) * (((Math.pow(1 + r, dur) - 1) / r)) * (1 + r / 2));
    const fidelity = dur >= 10 ? Math.round(0.92 * (amount * 12)) : 0;
    const totalCapital = baseCapital + fidelity;
    const renteMensuelle = Math.round(totalCapital * 0.0065);

    return {
      productId: "PROD-EP-RETRAITE",
      productName: "Horizon Retraite",
      category: "Capitalisation Retraite Individuelle",
      monthlyAmount: amount,
      durationYears: dur,
      totalContributed: totalPaid,
      guaranteedCapital: totalCapital,
      specificBenefit: `Bonus de fidélité de 92% de la 1ère annuité (${fidelity.toLocaleString('fr-FR')} FCFA) + Option rente viagère de ~${renteMensuelle.toLocaleString('fr-FR')} FCFA/mois`,
      fidelityBonus: fidelity,
      quarterlyPension: renteMensuelle * 3,
      deathDisabilityGuarantee: "Versement immédiat de l'épargne garantie aux bénéficiaires désignés en cas de décès",
      cimaMentions: "Code CIMA Articles 6, 74 & 84. Taux minimum garanti 3,5% + Participation aux bénéfices annuelle obligatoire.",
      summaryText: `Pour Horizon Retraite avec ${amount.toLocaleString('fr-FR')} FCFA/mois sur ${dur} ans :\n• Total cotisé : ${totalPaid.toLocaleString('fr-FR')} FCFA\n• Capital constitué garanti : ${baseCapital.toLocaleString('fr-FR')} FCFA\n• Bonus de fidélité au terme (92% de l'annuité 1) : +${fidelity.toLocaleString('fr-FR')} FCFA\n• TOTAL GARANTI AU TERME : ${totalCapital.toLocaleString('fr-FR')} FCFA (ou rente viagère de ~${renteMensuelle.toLocaleString('fr-FR')} FCFA/mois).`
    };
  }

  // 5. ÉPARGNE BONUS SUNU
  if (normKey.includes("bonus")) {
    const amount = Math.max(monthlyAmount || 10000, 5000);
    const dur = (durationYears || 10) >= 12 ? 15 : 10;
    const totalPaid = amount * 12 * dur;
    const r = 0.035;
    const capital = Math.round((amount * 12) * (((Math.pow(1 + r, dur) - 1) / r)) * (1 + r / 2));

    return {
      productId: "PROD-EP-BONUS",
      productName: "Épargne Bonus SUNU",
      category: "Épargne Bonifiée avec Tirages au Sort",
      monthlyAmount: amount,
      durationYears: dur,
      totalContributed: totalPaid,
      guaranteedCapital: capital,
      specificBenefit: "Tirages au sort trimestriels : en cas de gain, versement anticipé de l'intégralité du capital et dispense des cotisations futures !",
      deathDisabilityGuarantee: "Préservation intégrale de l'épargne constituée pour les ayants droit en cas de décès",
      cimaMentions: "Contrat de capitalisation avec loterie réglementée conforme au Code CIMA. Droit de renonciation de 30 jours.",
      summaryText: `Pour Épargne Bonus SUNU avec ${amount.toLocaleString('fr-FR')} FCFA/mois sur ${dur} ans :\n• Total cotisé théorique : ${totalPaid.toLocaleString('fr-FR')} FCFA\n• Capital garanti au terme : ${capital.toLocaleString('fr-FR')} FCFA\n• Effet de levier : Tirage au sort trimestriel avec gain anticipé du capital intégral sans cotisations restantes !`
    };
  }

  // 6. PROTECT PLUS
  if (normKey.includes("protect") || normKey.includes("sante") || normKey.includes("santé") || normKey.includes("hospitalisation")) {
    const isGrande = (monthlyAmount || 0) >= 1000 || (monthlyAmount || 0) >= 10000;
    const primeAnnuelle = isGrande ? 10000 : 5000;
    const capDeces = isGrande ? 1000000 : 500000;
    const hospit = isGrande ? 250000 : 150000;

    return {
      productId: "PROD-PR-PROTPLUS",
      productName: "Protect Plus",
      category: "Micro-assurance Santé & Accident",
      monthlyAmount: Math.round(primeAnnuelle / 12),
      durationYears: 1,
      totalContributed: primeAnnuelle,
      guaranteedCapital: capDeces,
      specificBenefit: `Prise en charge hospitalisation accidentelle jusqu'à ${hospit.toLocaleString('fr-FR')} FCFA (dès 5 jours consécutifs)`,
      deathDisabilityGuarantee: `Capital garanti de ${capDeces.toLocaleString('fr-FR')} FCFA versé aux ayants droit en cas de décès accidentel ou IAD`,
      cimaMentions: "Micro-assurance régie par le Livre VII du Code CIMA. Renouvelable annuellement.",
      summaryText: `Pour Protect Plus (${isGrande ? 'Grande Mise' : 'Petite Mise'}) :\n• Cotisation : ${primeAnnuelle.toLocaleString('fr-FR')} FCFA / an (~${Math.round(primeAnnuelle/12)} FCFA/mois)\n• Capital décès/invalidité accidentelle garanti : ${capDeces.toLocaleString('fr-FR')} FCFA\n• Forfait hospitalier (dès le 5e jour consécutif suite à accident) : jusqu'à ${hospit.toLocaleString('fr-FR')} FCFA.`
    };
  }

  // 7. SECURE COMPTE
  if (normKey.includes("secure") || normKey.includes("compte")) {
    let primeAnnuelle = 2700;
    let capGaranti = 400000;
    const amt = monthlyAmount || 1000;
    if (amt >= 2500 || amt >= 30000) {
      primeAnnuelle = 33500;
      capGaranti = 5000000;
    } else if (amt >= 1000 || amt >= 12000) {
      primeAnnuelle = 13000;
      capGaranti = 2000000;
    } else if (amt >= 500 || amt >= 6000) {
      primeAnnuelle = 6500;
      capGaranti = 1000000;
    }

    return {
      productId: "PROD-PR-SECCOMPTE",
      productName: "Secure Compte",
      category: "Prévoyance adossée au Compte Bancaire",
      monthlyAmount: Math.round(primeAnnuelle / 12),
      durationYears: 1,
      totalContributed: primeAnnuelle,
      guaranteedCapital: capGaranti,
      specificBenefit: `Protection immédiate du solde et versement d'un capital de ${capGaranti.toLocaleString('fr-FR')} FCFA aux proches`,
      deathDisabilityGuarantee: `Capital décès / invalidité de ${capGaranti.toLocaleString('fr-FR')} FCFA (adhérents de 18 à 70 ans)`,
      cimaMentions: "Prévoyance bancassurance conforme Code CIMA adossée à la tenue de compte SUNU Bank Togo.",
      summaryText: `Pour Secure Compte (palier ${capGaranti.toLocaleString('fr-FR')} FCFA) :\n• Prime annuelle : ${primeAnnuelle.toLocaleString('fr-FR')} FCFA (~${Math.round(primeAnnuelle/12)} FCFA/mois)\n• Capital garanti décès/IAD : ${capGaranti.toLocaleString('fr-FR')} FCFA\n• Adhésion automatique dès 18 ans pour sécuriser votre compte.`
    };
  }

  // 8. ÉPARGNE MOOV & PRÉVOYANCE MOOV
  if (normKey.includes("moov")) {
    if (normKey.includes("prevoyance") || normKey.includes("prévoyance")) {
      return {
        productId: "PROD-PR-DIGMOOV",
        productName: "Prévoyance Moov",
        category: "Assurance Décès 100% Mobile",
        monthlyAmount: 500,
        durationYears: 1,
        totalContributed: 6000,
        guaranteedCapital: 500000,
        specificBenefit: "Souscription et prélèvement directs sur compte Moov Money sans compte bancaire",
        deathDisabilityGuarantee: "Paiement prioritaire du capital décès de 500 000 FCFA sur le wallet Moov Money des bénéficiaires",
        cimaMentions: "Micro-assurance mobile autorisée par la CRCA / CIMA.",
        summaryText: `Pour Prévoyance Moov :\n• Cotisation : 500 FCFA/mois sur Moov Money\n• Capital décès garanti : 500 000 FCFA versé rapidement à la famille\n• 100% digital, 18 à 64 ans.`
      };
    } else {
      const amount = Math.max(500, Math.min(monthlyAmount || 2000, 5000));
      const dur = 15;
      const totalPaid = amount * 12 * dur;
      const r = 0.035;
      const capital = Math.round((amount * 12) * (((Math.pow(1 + r, dur) - 1) / r)) * (1 + r / 2));

      return {
        productId: "PROD-EP-DIGMOOV",
        productName: "Épargne Moov",
        category: "Épargne Digitale Mobile Money",
        monthlyAmount: amount,
        durationYears: dur,
        totalContributed: totalPaid,
        guaranteedCapital: capital,
        specificBenefit: "Tirages au sort trimestriels : gain immédiat du capital total de 15 ans libéré sur Moov Money !",
        deathDisabilityGuarantee: "Restitution du capital constitué aux bénéficiaires désignés sur smartphone",
        cimaMentions: "Micro-assurance CIMA en partenariat avec Moov Africa Togo.",
        summaryText: `Pour Épargne Moov avec ${amount.toLocaleString('fr-FR')} FCFA/mois sur 15 ans via Moov Money :\n• Total versé : ${totalPaid.toLocaleString('fr-FR')} FCFA\n• Capital garanti constitué : ${capital.toLocaleString('fr-FR')} FCFA\n• Éligible aux tirages au sort trimestriels pour remporter l'intégralité du capital par anticipation !`
      };
    }
  }

  // 9. SÉRÉNITÉ (Défaut si Sérénité ou demande générique)
  const amount = Math.max(monthlyAmount || 15000, 5000);
  const dur = Math.max(5, Math.min(durationYears || 10, 20));
  const totalPaid = amount * 12 * dur;
  const r = 0.035;
  const capital = Math.round((amount * 12) * (((Math.pow(1 + r, dur) - 1) / r)) * (1 + r / 2));

  return {
    productId: "PROD-EP-SERENITE",
    productName: "Sérénité",
    category: "Épargne & Prévoyance Obsèques",
    monthlyAmount: amount,
    durationYears: dur,
    totalContributed: totalPaid,
    guaranteedCapital: capital,
    specificBenefit: "Garantie de prise en charge rapide des frais funéraires et transmission d'un capital aux proches",
    deathDisabilityGuarantee: "Capital immédiat pour frais d'obsèques + préservation de l'épargne constituée",
    cimaMentions: "Conforme au Code CIMA Livre I. Droit de renonciation de 30 jours (Art. 76).",
    summaryText: `Pour Sérénité avec ${amount.toLocaleString('fr-FR')} FCFA/mois sur ${dur} ans :\n• Total cotisé : ${totalPaid.toLocaleString('fr-FR')} FCFA\n• Capital garanti constitué : ${capital.toLocaleString('fr-FR')} FCFA\n• Sécurisation immédiate des proches et respect des traditions funéraires dignes.`
  };
}

// Fonction pour détecter si un message utilisateur demande une simulation
export function detectSimulationIntent(text: string): { isSimulation: boolean; productKey: string; amount?: number; duration?: number } {
  const norm = text.toLowerCase();
  const simKeywords = ["simul", "calcul", "combien", "devis", "estimation", "projec", "épargner", "cotis"];
  const isSimulation = simKeywords.some(k => norm.includes(k)) || /\b(\d+)\s*(fcfa|f|ans|mois)\b/i.test(norm);

  // Détection du produit
  let productKey = "horizon_retraite";
  if (norm.includes("etude") || norm.includes("étude") || norm.includes("enfant") || norm.includes("education") || norm.includes("scolaire")) {
    productKey = norm.includes("plus") || norm.includes("edupro") ? "visa_etudes_plus" : "visa_etudes";
  } else if (norm.includes("retraite 5") || norm.includes("ret5") || norm.includes("retraite5")) {
    productKey = "horizon_retraite_5";
  } else if (norm.includes("retraite") || norm.includes("horizon") || norm.includes("pension")) {
    productKey = "horizon_retraite";
  } else if (norm.includes("bonus") || norm.includes("tirage")) {
    productKey = "epargne_bonus";
  } else if (norm.includes("protect") || norm.includes("santé") || norm.includes("sante") || norm.includes("hospital")) {
    productKey = "protect_plus";
  } else if (norm.includes("secure") || norm.includes("compte")) {
    productKey = "secure_compte";
  } else if (norm.includes("moov")) {
    productKey = norm.includes("prevoyance") || norm.includes("prévoyance") ? "prevoyance_moov" : "epargne_moov";
  } else if (norm.includes("serenite") || norm.includes("sérénité") || norm.includes("obseque") || norm.includes("obsèque")) {
    productKey = "serenite";
  }

  // Détection du montant
  let amount: number | undefined;
  const matchAmt = norm.match(/(\d[\d\s]*\d|\d+)\s*(?:fcfa|f\b|francs?)/i) || norm.match(/(?:cotis\w*|montant|mettre|verser)\s*(?:de\s*)?(\d[\d\s]*\d|\d+)/i);
  if (matchAmt) {
    const rawVal = matchAmt[1].replace(/\s+/g, "");
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed > 100) amount = parsed;
  }

  // Détection de la durée
  let duration: number | undefined;
  const matchDur = norm.match(/(\d+)\s*(?:ans?|années?)/i);
  if (matchDur) {
    const parsedDur = parseInt(matchDur[1], 10);
    if (!isNaN(parsedDur) && parsedDur >= 1 && parsedDur <= 35) duration = parsedDur;
  }

  return { isSimulation, productKey, amount, duration };
}

// ==============================================================================
// MOTEUR DE CONNAISSANCES & SYNTHÈSE CERTIFIÉE CODE CIMA (FALLBACK RAG SÉCURISÉ)
// ==============================================================================
export function buildCertifiedCimaReply(
  query: string,
  language: string = 'FR',
  sim?: SimulationCalculation | null
): { reply: string; sources: any[] } {
  const q = query.toLowerCase().trim();
  const sources: any[] = [];

  const isEnglish = language === 'EN' || q.includes('hello') || q.includes('how ') || q.includes('what ') || q.includes('simulate') || q.includes('surrender') || q.includes('insurance');
  const isEwe = language === 'EW' || q.includes('nuka') || q.includes('kuku') || q.includes('sukuli') || q.includes('ganyawo') || q.includes('woezor') || q.includes('woezɔ') || q.includes('akpe');
  const isKabye = language === 'KB' || q.includes('dɔɔ') || q.includes('doo') || q.includes('liidiye') || q.includes('sukuli') || q.includes('pɩɣa') || q.includes('lon') || q.includes('lɔŋ');

  // 1. Si une simulation chiffrée est demandée ou disponible
  if (sim) {
    const matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS.find(d => d.id === sim.productId) || SUNU_KNOWLEDGE_DOCUMENTS[2];
    sources.push(matchedDoc);
    sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10]); // REG-CIMA-LIVRE1
    sources.push(SUNU_KNOWLEDGE_DOCUMENTS[11]); // REG-CIMA-ACTUARIAT

    if (isEnglish) {
      const reply = `Here is your **indicative precontractual financial simulation** for **${sim.productName}** (${sim.category}) based on official SUNU Bank Togo rates and **CIMA Insurance Code** regulations:\n\n` +
        `📌 **Product**: ${sim.productName} [${sim.productId}]\n` +
        `💰 **Monthly Premium**: ${sim.monthlyAmount.toLocaleString('en-US')} FCFA / month\n` +
        `📅 **Subscription Duration**: ${sim.durationYears} year(s)\n` +
        `📊 **Total Contributed**: ${sim.totalContributed.toLocaleString('en-US')} FCFA\n` +
        `🎯 **Guaranteed Capital at Maturity**: **${sim.guaranteedCapital.toLocaleString('en-US')} FCFA** *(CIMA Guaranteed Minimum Rate of 3.5% net/year + profit sharing Art. 84)*\n\n` +
        (sim.fidelityBonus ? `⭐ **Loyalty Bonus at Maturity**: **+${sim.fidelityBonus.toLocaleString('en-US')} FCFA** (92% of 1st annual premium for >= 10 years without surrender)\n` : '') +
        (sim.quarterlyPension ? `🎓 **Education Allowance**: **~${sim.quarterlyPension.toLocaleString('en-US')} FCFA / quarter** paid over 4 years (16 quarters)\n` : '') +
        `✨ **Contractual Benefit**: ${sim.specificBenefit}\n` +
        `🛡️ **Death/Disability Coverage**: ${sim.deathDisabilityGuarantee}\n\n` +
        `⚖️ **CIMA Statutory Disclosures (Precontractual Information)**:\n` +
        `• *Article 6 & 65-1*: Mandatory precontractual key facts disclosure sheet provided before signing.\n` +
        `• *Article 76*: You have a statutory 30-calendar-day cancellation cooling-off right from inception with a 100% full refund and zero penalty.\n` +
        `• *Article 74 & 76*: Surrender value available after 2 full years of contributions (penalty legally capped at 5% of mathematical reserves).\n\n` +
        `You can click **"Share on WhatsApp"** or **"Print Quote"** to generate your official proposal.`;
      return { reply, sources };
    }

    if (isEwe) {
      const reply = `Woezɔ le SUNU Bank Togo ! Esia nye wò **akɔntabubu le ${sim.productName}** (${sim.category}) ŋu le CIMA Se la ƒe ɖoɖowo nu :\n\n` +
        `📌 **Nudzɔdzɔ (Produit)** : ${sim.productName} [${sim.productId}]\n` +
        `💰 **Ga si nàtɔ le xexi me (Cotisation)** : ${sim.monthlyAmount.toLocaleString('fr-FR')} FCFA / xexi\n` +
        `📅 **Ƒe agbɔsɔsɔ (Durée)** : Ƒe ${sim.durationYears}\n` +
        `📊 **Ga blibo si nàtɔ katã (Total versé)** : ${sim.totalContributed.toLocaleString('fr-FR')} FCFA\n` +
        `🎯 **Ga si le teƒe na wò le nuwuwu (Capital garanti)** : **${sim.guaranteedCapital.toLocaleString('fr-FR')} FCFA** *(CIMA TMG 3,5% net le ƒe ɖeka me + viɖe mama Art. 84)*\n\n` +
        (sim.fidelityBonus ? `⭐ **Fidélité viɖe le nuwuwu** : **+${sim.fidelityBonus.toLocaleString('fr-FR')} FCFA** (92% na ƒe 10 kple edzi)\n` : '') +
        (sim.quarterlyPension ? `🎓 **Sukuli ga na ɖevi** : **~${sim.quarterlyPension.toLocaleString('fr-FR')} FCFA / xexi 3 ɖesiaɖe** ƒe 4 sɔŋ\n` : '') +
        `✨ **Viɖe tɔxɛ (Avantage)** : ${sim.specificBenefit}\n` +
        `🛡️ **Ametakpɔkpɔ (Prévoyance)** : ${sim.deathDisabilityGuarantee}\n\n` +
        `⚖️ **CIMA Se la ƒe ɖoɖowo** :\n` +
        `• *Article 6 & 65-1* : Míenaa wò akɔntabubu blibo kple se siwo le eme hafi nàde asi agbalẽ te.\n` +
        `• *Article 76* : Mɔnukpɔkpɔ le asiwò be nàtrɔ dzi le ŋkeke 30 me eye woagbugbɔ wò ga blibo la na wò madodomadɔe.\n` +
        `• *Article 74 & 76* : Ne ètɔ ga ƒe 2 sɔŋ la, àte ŋu axɔ wò ga ƒe akpa aɖe (rachat).\n\n` +
        `Àte ŋu aɖo nuɖoɖo sia ɖe **WhatsApp** alo ata agbalẽ la le afisia.`;
      return { reply, sources };
    }

    if (isKabye) {
      const reply = `Dɔɔ le SUNU Bank Togo ! Pɩtɩŋna wò pɔzʋʋ yɔɔ, liidiye nɖɩ ɖɩtaza pɩlɩɩna **${sim.productName}** (${sim.category}) yɔɔ le CIMA se taa kɔyɔ :\n\n` +
        `📌 **Lɩmaaza (Produit)** : ${sim.productName} [${sim.productId}]\n` +
        `💰 **Fenaɣ liidiye (Cotisation)** : ${sim.monthlyAmount.toLocaleString('fr-FR')} FCFA / fenaɣ\n` +
        `📅 **Pɩnzɩ agbɔsɔsɔ (Durée)** : Pɩnzɩ ${sim.durationYears}\n` +
        `📊 **Liidiye kɩkɛdɩyɛ tɩŋa (Total versé)** : ${sim.totalContributed.toLocaleString('fr-FR')} FCFA\n` +
        `🎯 **Liidiye nɖɩ pɔcɔsɩ-ŋ pɩwayɩ (Capital garanti)** : **${sim.guaranteedCapital.toLocaleString('fr-FR')} FCFA** *(CIMA TMG 3,5% net/pɩnaɣ + viɖe mama Art. 84)*\n\n` +
        (sim.fidelityBonus ? `⭐ **Fidélité liidiye pɩwayɩ** : **+${sim.fidelityBonus.toLocaleString('fr-FR')} FCFA**\n` : '') +
        (sim.quarterlyPension ? `🎓 **Pɩɣa sukuli liidiye** : **~${sim.quarterlyPension.toLocaleString('fr-FR')} FCFA** fenaɣ 3 taa pɩnzɩ 4\n` : '') +
        `✨ **Kandɩyʋ tɔm (Avantage clé)** : ${sim.specificBenefit}\n` +
        `🛡️ **Kandɩyʋ sɩm pɩlɩɩna** : ${sim.deathDisabilityGuarantee}\n\n` +
        `⚖️ **CIMA se paɣtʋ** :\n` +
        `• *Article 6 & 65-1* : Pahaɣ-ŋ takayaɣ ŋga kowiluu liidiye tɔm tɩŋa hafi ŋlakɩ nesi tɛɛ tʋmɩyɛ.\n` +
        `• *Article 76* : Ŋwɛna mɔnukpɔkpɔ kɩyakɩŋ 30 taa se ŋkizi nɛ pɔcɔsɩ-ŋ wò liidiye tɩŋa yem.\n` +
        `• *Article 74 & 76* : Pɩnzɩ 2 wayɩ lɛ, ŋpɩzɩɣ ŋlɩzɩ wò liidiye akpa aɖe.\n\n` +
        `Ŋpɩzɩɣ ŋtɩna tɔm tʋnɛ **WhatsApp** yɔɔ yaa ŋlɩzɩ takayaɣ.`;
      return { reply, sources };
    }

    let intro = `Voici votre **simulation financière précontractuelle indicative** pour **${sim.productName}** (${sim.category}) selon les barèmes officiels de SUNU Bank Togo et les dispositions du **Code CIMA** :`;

    const reply = `${intro}\n\n` +
      `📌 **Produit** : ${sim.productName} [${sim.productId}]\n` +
      `💰 **Cotisation mensuelle** : ${sim.monthlyAmount.toLocaleString('fr-FR')} FCFA / mois\n` +
      `📅 **Durée de souscription** : ${sim.durationYears} an(s)\n` +
      `📊 **Cumul des cotisations versées** : ${sim.totalContributed.toLocaleString('fr-FR')} FCFA\n` +
      `🎯 **Capital garanti constitué à terme** : **${sim.guaranteedCapital.toLocaleString('fr-FR')} FCFA** *(Taux d'Intérêt Technique Garanti CIMA de 3,5% net/an + participation aux bénéfices Art. 84)*\n\n` +
      (sim.fidelityBonus ? `⭐ **Bonus de fidélité au terme** : **+${sim.fidelityBonus.toLocaleString('fr-FR')} FCFA** (92% de la 1ère annuité pour une fidélité >= 10 ans sans rachat)\n` : '') +
      (sim.quarterlyPension ? `🎓 **Prestation d'études** : **~${sim.quarterlyPension.toLocaleString('fr-FR')} FCFA / trimestre** versé pendant 4 ans (16 trimestres d'université)\n` : '') +
      `✨ **Spécificité contractuelle** : ${sim.specificBenefit}\n` +
      `🛡️ **Couverture Prévoyance Décès/IAD** : ${sim.deathDisabilityGuarantee}\n\n` +
      `⚖️ **Dispositions Légales CIMA (Information Précontractuelle)** :\n` +
      `• *Article 6 & 65-1* : La présente fiche d'information précontractuelle est indicative et formalisée en agence.\n` +
      `• *Article 76* : Vous disposez d'un délai légal de renonciation de 30 jours calendaires à compter de la conclusion du contrat pour annuler avec remboursement intégral sans frais.\n` +
      `• *Article 74 & 76* : Valeur de rachat ouverte dès 2 ans de cotisations effectives (indemnité légalement plafonnée à 5% de la provision mathématique).\n\n` +
      `Vous pouvez cliquer sur **« Partager sur WhatsApp »** ou **« Imprimer le Devis »** pour éditer votre proposition officielle.`;

    return { reply, sources };
  }

  // 2. Questions de Réglementation & Articles CIMA
  const isCimaQuery = q.includes('article') || q.includes('cima') || q.includes('rachat') || 
    q.includes('surrender') || q.includes('renonciation') || q.includes('cancellation') || 
    q.includes('loi') || q.includes('law') || q.includes('tmg') || q.includes('benefice') || 
    q.includes('bénéfice') || q.includes('profit') || q.includes('prescription') || 
    q.includes('avance') || q.includes('beneficiaire') || q.includes('bénéficiaire') || 
    q.includes('crca') || q.includes('cma') || q.includes('actuariat') || q.includes('table') || 
    q.includes('micro') || q.includes('livre') || q.includes('mandat') || 
    q.includes('bancassurance') || q.includes('reglement') || q.includes('règlement') || 
    q.includes('reference') || q.includes('référence') || q.includes('memoire') || 
    q.includes('mémoire') || q.includes('texte') || q.includes('circulaire') || 
    q.includes('avis') || q.includes('decision') || q.includes('décision') || 
    q.includes('portail') || (q.includes('sinistre') && (q.includes('delai') || q.includes('délai') || q.includes('declaration') || q.includes('déclaration') || q.includes('article')));

  if (isCimaQuery) {
    // 2.1. Déclaration de sinistre & Délais légaux (Article 21 Code CIMA)
    if (q.includes('21') || (q.includes('sinistre') && (q.includes('déclaration') || q.includes('declaration') || q.includes('delai') || q.includes('délai') || q.includes('article')))) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10], SUNU_KNOWLEDGE_DOCUMENTS[14]);
      if (isEnglish) {
        return {
          reply: `### Article 21 CIMA Code: Claims Notification & Statutory Deadlines :\n\n` +
            `• **Statutory 5-Day Notice (Article 21 al. 1)**: The policyholder or beneficiaries are legally mandated to give written notice of any insured event to the company (or its banking distributor SUNU Bank Togo) within **five (5) business days** of becoming aware of it (reduced to 48 hours for theft if covered).\n` +
            `• **Force Majeure Exemption**: The 5-day deadline does not bar coverage if delay was caused by a fortuitous event or justified force majeure.\n` +
            `• **Strict Limitation on Forfeiture (Déchéance)**: An insurer cannot reject a late claim unless two conditions are cumulatively met:\n` +
            `  1. A clear and prominent forfeiture clause is explicitly written in the policy contract.\n` +
            `  2. The insurer proves that the delay caused it direct financial damage.\n` +
            `• **SUNU Bank Togo Settlement Timeframes**:\n` +
            `  - *Prévoyance Moov*: Express payment in **48 hours** onto recipient's Moov Money wallet.\n` +
            `  - *Protect Plus*: Hospital indemnity settlement within **15 days**.\n` +
            `  - *Individual Life Policies (Visa Études, Horizon Retraite, Sérénité)*: Maximum statutory period of **30 days** upon receipt of full claim files.`,
          sources
        };
      }
      return {
        reply: `### Article 21 du Code CIMA : Déclaration de Sinistre & Délais Légaux :\n\n` +
          `• **Délai légal de 5 jours ouvrés (Art. 21 al. 1)** : L'assuré ou ses ayants droit sont tenus d'aviser l'assureur (ou le guichet SUNU Bank Togo) de tout sinistre de nature à entraîner la garantie dès qu'ils en ont eu connaissance, et au plus tard dans un délai légal de **cinq (5) jours ouvrés** (délai ramené à 48 heures en cas de vol si applicable).\n` +
          `• **Cas fortuit et force majeure** : Ce délai légal n'est pas opposable lorsque le retard résulte d'un cas fortuit ou d'une force majeure dûment établie.\n` +
          `• **Encadrement strict de la déchéance de garantie** : L'assureur ne peut opposer la déchéance pour déclaration tardive que si deux conditions cumulatives sont remplies :\n` +
          `  1. La clause de déchéance figure en caractères très apparents dans la police.\n` +
          `  2. L'assureur apporte la preuve formelle que le retard lui a causé un préjudice financier direct.\n` +
          `• **Délais de liquidation des capitaux chez SUNU Bank Togo** :\n` +
          `  - *Prévoyance Moov* : Versement express en **48 heures** sur le compte Moov Money des bénéficiaires.\n` +
          `  - *Protect Plus* : Forfait hospitalisation accidentelle liquidé sous **15 jours**.\n` +
          `  - *Polices d'Assurance Vie (Visa Études, Horizon Retraite, Sérénité)* : Liquidation sous un délai maximal de **30 jours** après constitution du dossier complet.`,
        sources
      };
    }

    // 2.2. Articles 74 & 76 : Valeurs de Rachat & Pénalités Plafonnées
    if (q.includes('74') || q.includes('rachat') || q.includes('surrender')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10], SUNU_KNOWLEDGE_DOCUMENTS[11]);
      if (isEnglish) {
        return {
          reply: `### CIMA Code Articles 74 & 76 regarding Surrender (Rachat) :\n\n` +
            `1. **Eligibility for Surrender (Art. 74)**: In the CIMA zone, policyholders can only request partial or total surrender after **at least two (2) full years of effective premium payments** (or once 15% of total premiums are paid for contracts under 10 years).\n` +
            `2. **Legal Cap on Surrender Penalties (Art. 76)**: Any penalty or fee deducted by the insurer cannot exceed **5% of the policy's mathematical reserves** at the time of the request.\n` +
            `3. **Penalty-free Surrender**: After 10 years of policy duration, zero surrender penalty or fee may be retained by the insurance company (0% fee).\n` +
            `4. **Policy Advance (Art. 75)**: Instead of a surrender that destroys accumulated capital, SUNU Bank Togo offers policy advances (low-interest loan backed by reserves) enabling quick liquidity without terminating your coverage.`,
          sources
        };
      }
      return {
        reply: `### Dispositions de l'Article 74 & 76 du Code CIMA relatives au Rachat :\n\n` +
          `1. **Conditions d'éligibilité au rachat (Art. 74)** : En zone CIMA, le souscripteur d'un contrat d'assurance vie avec valeur de capitalisation ne peut demander le rachat total ou partiel qu'après **au moins 2 années de cotisations effectives** (ou lorsque 15% du montant total des primes prévues ont été versés pour les contrats inférieurs à 10 ans).\n` +
          `2. **Plafonnement légal de l'indemnité de rachat (Art. 76)** : La pénalité ou indemnité prélevée par l'assureur ne peut en aucun cas excéder **5% de la provision mathématique** du contrat au moment de la demande.\n` +
          `3. **Rachat sans pénalité après 10 ans** : Après 10 ans de durée contractuelle, aucun frais ni indemnité de rachat ne peut être retenu par la compagnie d'assurance (0% de pénalité).\n` +
          `4. **Alternative : Avance sur police (Art. 75)** : À la place d'un rachat qui réduit le capital, SUNU Bank Togo propose l'avance sur police (prêt garanti par la provision mathématique) permettant d'obtenir des liquidités d'urgence sans résilier le contrat ni perdre ses garanties.`,
        sources
      };
    }

    // 2.3. Article 75 : Avance sur Police
    if (q.includes('75') || q.includes('avance') || q.includes('prêt sur police') || q.includes('pret sur police')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10], SUNU_KNOWLEDGE_DOCUMENTS[11]);
      if (isEnglish) {
        return {
          reply: `### Policy Advance (Article 75 CIMA Code) :\n\n` +
            `• **Definition (Art. 75)**: An advance is a low-interest financial loan granted by the insurer to the policyholder, backed directly by the policy's accumulated mathematical reserve.\n` +
            `• **Preservation of Guarantees**: Unlike a surrender (rachat), an advance does NOT terminate the insurance contract. Life, death, and accidental disability coverage remain 100% active.\n` +
            `• **Interest & Repayment**: The loan bears interest at a statutory moderate rate and can be repaid flexibly at any time or deducted from final benefits upon maturity.`,
          sources
        };
      }
      return {
        reply: `### Avance sur Police (Article 75 du Code CIMA) :\n\n` +
          `• **Principe de l'avance (Art. 75)** : L'avance est un prêt financier à taux modéré consenti par l'assureur au souscripteur, gagé sur la provision mathématique de son contrat d'assurance vie.\n` +
          `• **Préservation intégrale des garanties** : Contrairement au rachat qui annule ou réduit l'épargne, l'avance ne rompt pas le contrat. Les garanties décès, invalidité et le bonus de fidélité restent 100% actifs.\n` +
          `• **Remboursement flexible** : L'emprunteur peut rembourser l'avance à son rythme pendant la durée du contrat. Si l'avance n'est pas remboursée au terme ou lors du sinistre, son solde est simplement déduit du capital garanti versé.`,
        sources
      };
    }

    // 2.4. Article 76 : Faculté de Renonciation de 30 jours
    if (q.includes('76') || q.includes('renonciation') || q.includes('retract') || q.includes('cancel') || q.includes('cooling')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10]);
      if (isEnglish) {
        return {
          reply: `### Statutory 30-Day Cancellation Right (Article 76 CIMA Code) :\n\n` +
            `• **30-Calendar-Day Cooling-off Period**: Any individual subscribing to a life insurance policy has the legal right to cancel within **30 full calendar days** from the first payment or contract conclusion.\n` +
            `• **100% Full Refund within 30 Days**: Cancellation entails the full reimbursement of all premiums paid by the subscriber, with zero deductions or financial penalties.\n` +
            `• **Late Refund Penalty**: If the insurer exceeds 30 days to refund, overdue sums automatically produce interest at the statutory rate increased by 50%.`,
          sources
        };
      }
      return {
        reply: `### Faculté de Renonciation Légale (Article 76 du Code CIMA) :\n\n` +
          `• **Délai légal de 30 jours** : Toute personne physique ayant souscrit une proposition ou un contrat d'assurance vie a la faculté légale d'y renoncer par lettre recommandée avec accusé de réception ou dépôt contre décharge en agence dans un délai de **30 jours calendaires révolus** à compter du premier versement ou de la conclusion du contrat.\n` +
          `• **Remboursement intégral sous 30 jours** : La renonciation entraîne la restitution intégrale de toutes les sommes versées par le souscripteur, sans aucune retenue ni pénalité financière.\n` +
          `• **Sanction pour retard** : Au-delà du délai de 30 jours pour le remboursement par l'assureur, les sommes non restituées produisent de plein droit intérêt au taux légal majoré de moitié.`,
        sources
      };
    }

    // 2.5. Article 84 : Participation aux Bénéfices & Effet Cliquet
    if (q.includes('84') || q.includes('bénéfice') || q.includes('benefice') || q.includes('profit') || q.includes('participation') || q.includes('cliquet')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10], SUNU_KNOWLEDGE_DOCUMENTS[11]);
      if (isEnglish) {
        return {
          reply: `### Mandatory Profit Sharing (Article 84 CIMA Code) :\n\n` +
            `• **Strict Regulatory Obligation**: Life insurance companies operating in the CIMA zone (including SUNU Assurances Vie Togo) are legally mandated to share technical and financial investment profits with policyholders.\n` +
            `• **Minimum 85% Redistribution**: Regulations require the distribution of **at least 85% of net financial returns** achieved on investments backing policy reserves.\n` +
            `• **Ratchet Effect (Effet Cliquet)**: Once allocated to the policy, profits permanently increase the guaranteed capital and can never be lost or decreased.`,
          sources
        };
      }
      return {
        reply: `### Participation aux Bénéfices (Article 84 du Code CIMA) :\n\n` +
          `• **Obligation réglementaire stricte** : Les entreprises d'assurance vie opérant dans la zone CIMA (dont SUNU Assurances Vie Togo) sont tenues de faire participer leurs assurés aux bénéfices techniques et financiers réalisés.\n` +
          `• **Taux de redistribution minimum** : La réglementation impose de reverser **au moins 85% des bénéfices financiers** nets réalisés sur les placements adossés aux provisions mathématiques des contrats d'épargne et de retraite.\n` +
          `• **Effet cliquet** : Les bénéfices une fois attribués au contrat augmentent définitivement le capital garanti du souscripteur et ne peuvent plus être diminués.`,
        sources
      };
    }

    // 2.6. Articles 6 & 65-1 : Information Précontractuelle & Encadré Légal
    if (q.includes('6') || q.includes('65-1') || q.includes('precontractuel') || q.includes('précontractuel') || q.includes('disclosure') || q.includes('encadré') || q.includes('encadre') || q.includes('kid')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10], SUNU_KNOWLEDGE_DOCUMENTS[13]);
      if (isEnglish) {
        return {
          reply: `### Mandatory Precontractual Information (Articles 6 & 65-1 CIMA Code) :\n\n` +
            `• **Article 6 CIMA**: Prior to binding subscription, the insurer and bank intermediary (SUNU Bank Togo) must provide the client with a standardized precontractual disclosure sheet stating the policy purpose, guarantees, exclusions, duration, 3.5% minimum guaranteed rate, and year-by-year surrender values.\n` +
            `• **Article 65-1 CIMA**: Enforces a mandatory prominent standardized legal warning box at the very top of all contract documents summarizing key fees, coverage, and the 30-day cancellation right.\n` +
            `• This automated RAG assistant guarantees immediate regulatory compliance without omission risk.`,
          sources
        };
      }
      return {
        reply: `### Obligation d'Information Précontractuelle (Articles 6 et 65-1 du Code CIMA) :\n\n` +
          `• **Article 6 du Code CIMA** : Avant toute souscription définitive, l'assureur et son intermédiaire bancaire (SUNU Bank Togo) doivent obligatoirement remettre au souscripteur une proposition d'assurance ou une **fiche d'information précontractuelle** claire, loyale et détaillée précisant l'objet du contrat, les garanties, les exclusions, la durée, le taux d'intérêt minimum garanti (TMG 3,5%) et le tableau des valeurs de rachat année par année.\n` +
          `• **Article 65-1 du Code CIMA** : Instaure l'**encadré légal standardisé** obligatoire qui doit figurer en tête de tout document contractuel en caractères très apparents, rappelant la nature du contrat, les frais, et le droit de renonciation de 30 jours.\n` +
          `• Le présent assistant RAG automatisé garantit la conformité immédiate à ces obligations légales sans risque d'omission.`,
        sources
      };
    }

    // 2.7. Article 28 : Prescription Biennale
    if (q.includes('28') || q.includes('prescript')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10]);
      if (isEnglish) {
        return {
          reply: `### Two-Year Biennial Prescription (Article 28 CIMA Code) :\n\n` +
            `• Under CIMA insurance law, all claims and actions arising from a life insurance contract **expire after two (2) years** from the date of the triggering event.\n` +
            `• In the event of death, the prescription period only runs against beneficiaries from the day they gained knowledge of the contract or death.`,
          sources
        };
      }
      return {
        reply: `### Prescription Biennale (Article 28 du Code CIMA) :\n\n` +
          `• En droit des assurances CIMA, toutes actions et réclamations dérivant d'un contrat d'assurance vie se **prescrivent par deux (2) ans** à compter de l'événement qui y donne naissance.\n` +
          `• En cas de décès de l'assuré, le délai de prescription ne court contre les bénéficiaires qu'à compter du jour où ils ont eu connaissance du contrat ou du décès, dans la limite des délais légaux.`,
        sources
      };
    }

    // 2.8. Articles 60 & 68 : Clause Bénéficiaire & Bénéficiaire Acceptant
    if (q.includes('60') || q.includes('68') || q.includes('clause') || q.includes('beneficiaire') || q.includes('bénéficiaire') || q.includes('acceptant')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10]);
      if (isEnglish) {
        return {
          reply: `### Beneficiary Designation & Acceptance (Articles 60 & 68 CIMA Code) :\n\n` +
            `• **Free Designation (Art. 60)**: The subscriber may freely designate one or multiple beneficiaries, either named directly or identified via standard kinship clauses.\n` +
            `• **Standard Clause Recommended at SUNU Bank Togo**: *"My non-separated spouse, failing whom my children born or to be born in equal shares, failing whom my legal heirs."*\n` +
            `• **Accepting Beneficiary (Art. 68)**: Once a beneficiary formally notifies acceptance to the insurer, the designation becomes **irrevocable**. The subscriber can no longer modify the beneficiary nor request a policy surrender without the accepting beneficiary's express written consent.`,
          sources
        };
      }
      return {
        reply: `### Clause Bénéficiaire & Bénéficiaire Acceptant (Articles 60 et 68 du Code CIMA) :\n\n` +
          `• **Libre désignation des bénéficiaires (Art. 60)** : Le souscripteur a le droit de désigner librement un ou plusieurs bénéficiaires, nommément ou par leur qualité.\n` +
          `• **Clause standard préconisée chez SUNU Bank Togo** : *« Le conjoint non séparé de corps ni divorcé, à défaut les enfants vivants ou représentés par parts égales, à défaut les héritiers légaux du souscripteur. »*\n` +
          `• **Impact juridique du bénéficiaire acceptant (Art. 68)** : Dès lors que le bénéficiaire a notifié son acceptation formelle auprès de la compagnie d'assurance, la clause devient **irrévocable**. Le souscripteur ne peut plus ni changer de bénéficiaire, ni effectuer de rachat, ni demander d'avance sur police sans l'accord écrit exprès du bénéficiaire acceptant.`,
        sources
      };
    }

    // 2.9. TMG 3,5% & Règles Actuarielles (Décisions CMA)
    if (q.includes('tmg') || q.includes('3,5') || q.includes('3.5') || q.includes('actuariat') || q.includes('table') || q.includes('mortalité') || q.includes('mortalite') || q.includes('provision mathématique') || q.includes('pm')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[11]);
      if (isEnglish) {
        return {
          reply: `### Actuarial Framework & Guaranteed Minimum Rate (CIMA CMA Decisions) :\n\n` +
            `• **Guaranteed Minimum Technical Rate (TMG 3.5%)**: Capped at **3.5% net per year** by Decision of the Council of Insurance Ministers (CMA) to ensure absolute solvency while guaranteeing positive returns on savings.\n` +
            `• **Mathematical Reserves (PM)**: The legal reserve recognized on the insurer's balance sheet, accumulating policyholder premiums at compound interest (TMG 3.5% + Art. 84 profit sharing) to guarantee 100% of future lump sums and pensions.\n` +
            `• **Official CIMA Mortality Tables**: Calculation of pure premiums and life annuities relies on regulatory tables approved by CIMA:\n` +
            `  - **TD 88/90**: Mortality tables for death coverage.\n` +
            `  - **TF 88/90**: Survival tables for life annuities and education pensions.`,
          sources
        };
      }
      return {
        reply: `### Cadre Actuariel & Taux Minimum Garanti (Décisions du Conseil des Ministres CIMA) :\n\n` +
          `• **Taux Minimum Garanti (TMG 3,5% net/an)** : Plafonné à **3,5% net l'an** par Décision réglementaire du Conseil des Ministres des Assurances (CMA) pour garantir l'équilibre prudentiel et interdire les promesses de rendement spéculatives non solvables.\n` +
          `• **Provisions Mathématiques (PM)** : Réserve actuarielle obligatoire inscrite au passif du bilan de SUNU Assurances Vie Togo, matérialisant l'engagement ferme envers les assurés et capitalisée aux intérêts composés.\n` +
          `• **Tables de mortalité réglementaires homologuées** :\n` +
          `  - **TD 88/90** : Tables de décès pour le calcul des primes pures de prévoyance.\n` +
          `  - **TF 88/90** : Tables de survie servant au calcul des rentes viagères (Horizon Retraite) et des rentes d'études (Visa Études).\n` +
          `• **Effet cliquet** : Les intérêts techniques et la participation aux bénéfices définitivement inscrits au compte ne peuvent jamais être amputés en cas de baisse ultérieure des marchés.`,
        sources
      };
    }

    // 2.10. Micro-assurance & Livre VII (Règlement n° 003/CIMA/2012)
    if (q.includes('micro') || q.includes('livre 7') || q.includes('livre vii') || q.includes('003') || q.includes('2012')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[12], SUNU_KNOWLEDGE_DOCUMENTS[5]);
      if (isEnglish) {
        return {
          reply: `### Micro-insurance & Financial Inclusion (CIMA Code Book VII & Regulation 003/CIMA/2012) :\n\n` +
            `• **CIMA Book VII**: Created specifically to promote inclusive insurance for low-income households, artisans, and informal sector workers across West Africa.\n` +
            `• **Regulation n° 003/CIMA/2012**: Enforces simplified underwriting, eliminates burdensome medical questionnaires, and mandates concise, jargon-free policy summaries.\n` +
            `• **SUNU Bank Togo Micro-insurance Solutions**:\n` +
            `  - **Protect Plus** [PROD-PR-PROTPLUS]: Accessible from **500 FCFA/month**, covering accident hospitalization (from 5th day) and accidental death up to 1,000,000 FCFA.\n` +
            `  - **Épargne Moov & Prévoyance Moov** [PROD-EP-DIGMOOV]: 100% paperless mobile money micro-insurance with 48h claim settlement.`,
          sources
        };
      }
      return {
        reply: `### Micro-assurance & Inclusion Financière (Livre VII CIMA & Règlement n° 003/CIMA/2012) :\n\n` +
          `• **Livre VII du Code CIMA** : Cadre réglementaire dérogatoire conçu spécifiquement pour étendre la couverture d'assurance aux populations à revenus modestes et aux travailleurs du secteur informel togolais.\n` +
          `• **Règlement n° 003/CIMA/2012 du Conseil des Ministres** : Instaure des formalités d'adhésion ultra-allégées, supprime les examens médicaux préalables contraignants et impose des contrats rédigés en termes simples et compréhensibles.\n` +
          `• **Applications concrètes chez SUNU Bank Togo** :\n` +
          `  - **Protect Plus** [PROD-PR-PROTPLUS] : Accessible dès **500 FCFA/mois** (ou 5 000 F/an), couvrant les frais d'hospitalisation dès 5 jours consécutifs suite à accident et garantissant jusqu'à 1 000 000 FCFA en cas de décès accidentel.\n` +
          `  - **Épargne Moov & Prévoyance Moov** [PROD-EP-DIGMOOV] : Micro-assurance 100% digitale sur smartphone sans compte bancaire avec règlement express des sinistres en 48 heures sur Moov Money.`,
        sources
      };
    }

    // 2.11. Bancassurance, Livre V & Mandat de Distribution SUNU Bank
    if (q.includes('bancassurance') || q.includes('livre 5') || q.includes('livre v') || q.includes('mandat') || q.includes('intermédiation') || q.includes('distributeur') || q.includes('convenance') || q.includes('kyc') || q.includes('ipdcp') || q.includes('2019-014')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[13]);
      if (isEnglish) {
        return {
          reply: `### Bancassurance Framework, Book V & SUNU Bank Togo Mandate :\n\n` +
            `• **CIMA Book V (Intermediation)**: Regulates entities authorized to distribute insurance products. SUNU Bank Togo operates as an accredited bancassurance distributor for SUNU Assurances Vie Togo.\n` +
            `• **Suitability & KYC Obligation (Art. 6 & CRCA Circulars)**: Bank advisors are legally required to evaluate the client's financial situation, risk profile, and investment horizon before recommending any policy.\n` +
            `• **Strict Asset Segregation**: Bank deposits and insurance premiums collected via standing orders are strictly separated in compliance with BCEAO and CRCA rules.\n` +
            `• **Personal Data Protection (Togolese Law n° 2019-014 / IPDCP)**: All customer profiling, KYC questionnaires, and automated debit mandates strictly comply with Togolese privacy regulations.`,
          sources
        };
      }
      return {
        reply: `### Cadre de la Bancassurance, Livre V CIMA & Mandat de Distribution SUNU Bank Togo :\n\n` +
          `• **Livre V du Code CIMA (Intermédiation)** : Encadre les conditions d'exercice de la distribution d'assurance par les établissements bancaires. SUNU Bank Togo agit en qualité de distributeur mandataire exclusif de SUNU Assurances Vie Togo.\n` +
          `• **Obligation de convenance patrimoniale & Diagnostic KYC (Art. 6 & Circulaires CRCA)** : Les conseillers bancaires ont l'obligation légale d'analyser la situation financière, les charges et les objectifs du client afin de lui recommander une formule parfaitement adaptée à sa capacité contributive.\n` +
          `• **Cantonnement et étanchéité des flux** : Séparation comptable stricte entre les dépôts bancaires et les primes d'assurance vie collectées sous contrôle de la Commission Bancaire de l'UMOA et de la CRCA.\n` +
          `• **Protection des données personnelles (Loi togolaise n° 2019-014 / IPDCP)** : Le recueil des informations patrimoniales KYC et la dématérialisation des prélèvements respectent scrupuleusement la législation togolaise sur la vie privée.`,
        sources
      };
    }

    // 2.12. Organes Régulateurs : CRCA, CMA & Voies de Recours
    if (q.includes('crca') || q.includes('cma') || q.includes('contrôle') || q.includes('controle') || q.includes('litige') || q.includes('recours') || q.includes('sanction') || q.includes('libreville')) {
      sources.push(SUNU_KNOWLEDGE_DOCUMENTS[14]);
      if (isEnglish) {
        return {
          reply: `### CIMA Supervisory Bodies (CMA, CRCA) & Policyholder Dispute Resolution :\n\n` +
            `• **Council of Insurance Ministers (CMA)**: The supreme legislative body adopting uniform CIMA regulations across the 14 member states.\n` +
            `• **Regional Insurance Control Commission (CRCA)**: Based in Libreville (Gabon), CRCA is the supreme independent administrative court supervising insurer solvency, enforcing sanctions, and protecting policyholder rights.\n` +
            `• **Complaint & Mediation Procedure at SUNU Bank Togo**:\n` +
            `  1. Step 1: Internal complaint filed at any SUNU Bank Togo branch (statutory handling within 30 days).\n` +
            `  2. Step 2: In case of persistent unresolved dispute, referral to the General Secretariat of the CIMA / CRCA in Libreville or the national regulatory authority.`,
          sources
        };
      }
      return {
        reply: `### Organes Régulateurs CIMA (CMA, CRCA) & Règlement des Réclamations :\n\n` +
          `• **Conseil des Ministres des Assurances (CMA)** : Organe législatif suprême de la CIMA regroupant les Ministres des Finances des 14 États membres pour voter les règlements uniformes.\n` +
          `• **Commission Régionale de Contrôle des Assurances (CRCA)** : Juridiction administrative supranationale siégeant à Libreville (Gabon), dotée d'un pouvoir de contrôle sur pièces et sur place, de validation des tarifs et de sanctions disciplinaires.\n` +
          `• **Procédure de traitement des réclamations chez SUNU Bank Togo** :\n` +
          `  1. *Étape 1 (Amiable)* : Saisine du service réclamation de SUNU Bank Togo ou SUNU Assurances Vie Togo avec accusé de réception (délai de réponse de 30 jours).\n` +
          `  2. *Étape 2 (Recours)* : En cas de désaccord persistant, saisine de la Direction Nationale des Assurances du Togo ou saisine directe de la CRCA à Libreville.`,
        sources
      };
    }

    // 2.13. Corpus Global & Références Officielles pour le Mémoire de Master
    sources.push(...SUNU_KNOWLEDGE_DOCUMENTS.slice(10));
    if (isEnglish) {
      return {
        reply: `### Official CIMA References & Regulatory Corpus for Bancassurance at SUNU Bank Togo :\n\n` +
          `For academic rigor in your Master's thesis, our RAG system integrates all certified regulatory sources from the **CIMA Africa portal (cima-afrique.org)**:\n\n` +
          `1. **CIMA Insurance Code - Book I (Life Insurance Contracts)**:\n` +
          `   • *Articles 6 & 65-1*: Mandatory precontractual disclosure and standardized legal warning box.\n` +
          `   • *Articles 74 & 76*: Surrender values available after 2 years; penalty strictly capped at 5% of mathematical reserves (0% after 10 years).\n` +
          `   • *Article 75*: Policy advances preserving accumulated capital and death coverage.\n` +
          `   • *Article 76*: Statutory 30-day cancellation right with 100% full refund.\n` +
          `   • *Article 84*: Mandatory redistribution of at least 85% of net investment profits (Ratchet Effect).\n` +
          `   • *Article 21*: 5-business-day statutory claims notification deadline.\n` +
          `   • *Article 28*: Two-year biennial prescription period.\n\n` +
          `2. **Actuarial Regulations & CMA Decisions**:\n` +
          `   • Guaranteed Minimum Technical Rate (TMG) capped at **3.5% net per year**.\n` +
          `   • Regulatory mortality tables **TD 88/90** (death) and **TF 88/90** (annuities).\n\n` +
          `3. **Micro-insurance & Financial Inclusion (Book VII & Regulation 003/CIMA/2012)**:\n` +
          `   • Simplified underwriting for Protect Plus and Épargne Moov via Moov Money.\n\n` +
          `4. **Bancassurance Intermediation & Data Privacy**:\n` +
          `   • *CIMA Book V & CRCA Circulars*: Mandate between SUNU Bank Togo and SUNU Assurances Vie Togo.\n` +
          `   • *Togolese Law n° 2019-014 (IPDCP)*: Personal data protection and KYC audit trail.`,
        sources
      };
    }

    return {
      reply: `### Corpus Réglementaire Officiel CIMA & Références Certifiées pour le Mémoire de Master :\n\n` +
        `Pour la parfaite rigueur de votre mémoire de Master professionnel, l'assistant RAG de SUNU Bank Togo s'appuie sur l'intégralité des textes authentiques du **portail officiel CIMA (cima-afrique.org)** :\n\n` +
        `1. **Livre I du Code CIMA (Droit des Contrats d'Assurance Vie)** :\n` +
        `   • *Articles 6 & 65-1* : Obligation formelle d'information précontractuelle et encadré légal standardisé obligatoire en tête de police.\n` +
        `   • *Articles 74 & 76* : Droit au rachat ouvert après 2 ans de cotisations (ou 15% des primes) ; indemnité légalement plafonnée à 5% de la provision mathématique (0% après 10 ans).\n` +
        `   • *Article 75* : Faculté d'avance sur police préservant le capital et la couverture prévoyance.\n` +
        `   • *Article 76* : Faculté de renonciation d'ordre public de 30 jours calendaires avec remboursement intégral sous 30 jours.\n` +
        `   • *Article 84* : Obligation de redistribution d'au moins 85% des bénéfices financiers nets (Effet Cliquet irréversible).\n` +
        `   • *Article 21* : Déclaration de sinistre sous un délai légal de 5 jours ouvrés.\n` +
        `   • *Article 28* : Prescription biennale extinctive de deux (2) ans pour toute action en justice.\n` +
        `   • *Articles 60 & 68* : Clause bénéficiaire libre et impact bloquant du bénéficiaire acceptant.\n\n` +
        `2. **Actuariat & Décisions du Conseil des Ministres des Assurances (CMA)** :\n` +
        `   • Taux d'Intérêt Technique Minimum Garanti (TMG) plafonné à **3,5% net/an**.\n` +
        `   • Provisions mathématiques capitalisées et tables biométriques agréées **TD 88/90** (décès) et **TF 88/90** (survie/rentes).\n\n` +
        `3. **Micro-assurance & Canaux Numériques (Livre VII & Règlement n° 003/CIMA/2012)** :\n` +
        `   • Formalités allégées sans sélection médicale lourde pour Protect Plus et Épargne Moov.\n\n` +
        `4. **Bancassurance & Protection des Données** :\n` +
        `   • *Livre V CIMA & Circulaires CRCA* : Convention de distribution exclusive SUNU Bank Togo / SUNU Assurances Vie Togo et devoir de convenance KYC.\n` +
        `   • *Loi togolaise n° 2019-014 (IPDCP Togo)* : Protection des données à caractère personnel et traçabilité des consentements.\n` +
        `   • *Instructions BCEAO / UEMOA* : Sécurité des prélèvements automatiques bancaires.`,
      sources
    };
  }

  // 3. Comparatifs et Différences
  if (q.includes('compar') || q.includes('différ') || q.includes('differ') || (q.includes('ou') && (q.includes('etude') || q.includes('retraite') || q.includes('protect')))) {
    sources.push(SUNU_KNOWLEDGE_DOCUMENTS[0], SUNU_KNOWLEDGE_DOCUMENTS[2], SUNU_KNOWLEDGE_DOCUMENTS[5]);
    if (isEnglish) {
      return {
        reply: `### Comparative Overview of SUNU Bank Togo Bancassurance Solutions :\n\n` +
          `| CIMA Criteria | **Visa Études** [PROD-EP-EDUCATION] | **Horizon Retraite** [PROD-EP-RETRAITE] | **Protect Plus** [PROD-PR-PROTPLUS] |\n` +
          `| :--- | :--- | :--- | :--- |\n` +
          `| **Purpose** | Financing child higher education | Securing comfortable retirement income | Micro-insurance hospital & accident cover |\n` +
          `| **Min. Premium** | From **4,250 FCFA** / month | From **10,000 FCFA** / month | From **500 FCFA** / month (5,000 F/yr) |\n` +
          `| **Duration** | 3 to 15 years | 5 to 25 years | 1 year renewable |\n` +
          `| **CIMA Rate** | **3.5% net / year** + profits | **3.5% net / year** + profits | N/A (Pure risk insurance) |\n` +
          `| **Key Payout** | Lump sum or 4-year quarterly allowances | Lifetime annuity or lump sum + **92% Bonus** | Up to 250,000 F hospit. + 1,000,000 F death |\n` +
          `| **Death Cover** | Full premium waiver + full capital | Account balance paid to heirs | Immediate lump sum paid within 15 days |\n\n` +
          `💡 *You can click the **"Comparer"** button in the header to compare any of our 8 products.*`,
        sources
      };
    }
    return {
      reply: `### Comparatif Synthétique des Solutions de Bancassurance SUNU Bank Togo :\n\n` +
        `| Critère CIMA | **Visa Études** [PROD-EP-EDUCATION] | **Horizon Retraite** [PROD-EP-RETRAITE] | **Protect Plus** [PROD-PR-PROTPLUS] |\n` +
        `| :--- | :--- | :--- | :--- |\n` +
        `| **Finalité** | Financement études supérieures enfant | Sécurisation des revenus de retraite | Micro-assurance hospitalisation & accident |\n` +
        `| **Cotisation min.** | Dès **4 250 FCFA** / mois | Dès **10 000 FCFA** / mois | Dès **500 FCFA** / mois (5 000 F/an) |\n` +
        `| **Durée contractuelle** | 3 à 15 ans | 5 à 25 ans | 1 an renouvelable |\n` +
        `| **Taux Garanti CIMA** | **3,5% net / an** + bénéfices | **3,5% net / an** + bénéfices | N/A (Assurance de risque) |\n` +
        `| **Prestation clé** | Capital ou bourses trimestrielles sur 4 ans | Rente viagère ou capital + **Bonus 92%** | Jusqu'à 250 000 F hospit. + 1 000 000 F décès |\n` +
        `| **Prévoyance Décès** | Exonération totale primes + capital complet | Versement de l'épargne aux ayants droit | Capital immédiat aux bénéficiaires sous 15j |\n\n` +
        `💡 *Vous pouvez utiliser le bouton **« Comparer »** en haut de l'interface pour confronter n'importe lesquels des 8 produits.*`,
      sources
    };
  }

  // 4. Procédure Sinistres et Délais
  if (q.includes('sinistre') || q.includes('deces') || q.includes('décès') || q.includes('reclamation') || q.includes('réclamation') || q.includes('delai') || q.includes('délai') || q.includes('payer')) {
    sources.push(SUNU_KNOWLEDGE_DOCUMENTS[5], SUNU_KNOWLEDGE_DOCUMENTS[10]);
    return {
      reply: `### Procédure de Déclaration de Sinistre & Délais de Liquidation CIMA chez SUNU Bank Togo :\n\n` +
        `En cas de survenance d'un événement garanti (décès, invalidité absolue et définitive, hospitalisation), la famille ou les bénéficiaires doivent suivre les étapes suivantes :\n\n` +
        `1. **Notification** : Informer l'agence SUNU Bank Togo la plus proche ou le conseiller dédié sous **8 jours ouvrés**.\n` +
        `2. **Pièces justificatives à fournir** :\n` +
        `   • Pièce d'identité officielle du souscripteur et des bénéficiaires désignés\n` +
        `   • Bulletin original de souscription ou attestation d'assurance\n` +
        `   • Extrait d'acte de décès et certificat de genre de mort délivré par un médecin légal\n` +
        `   • En cas d'accident (Protect Plus) : Procès-verbal de gendarmerie/police et factures d'hospitalisation certifiées\n` +
        `   • En cas de bénéficiaires indéterminés : Acte de notoriété ou d'hérédité légalisé\n` +
        `3. **Délais de règlement légaux** :\n` +
        `   • **Prévoyance Moov** : Liquidation express en **48 heures** sur wallet Moov Money\n` +
        `   • **Protect Plus** : Forfait hospitalisation réglé sous **15 jours**\n` +
        `   • **Assurances Vie individuelles (Visa Études, Horizon Retraite, Sérénité)** : Règlement sous un délai maximum de **30 jours** sous contrôle CIMA.`,
      sources
    };
  }

  // 5. Sans compte bancaire / Moov
  if (q.includes('sans compte') || q.includes('moov') || q.includes('mobile') || q.includes('téléphone')) {
    sources.push(SUNU_KNOWLEDGE_DOCUMENTS[7], SUNU_KNOWLEDGE_DOCUMENTS[8]);
    return {
      reply: `### Souscription Sans Compte Bancaire : Offres Dématérialisées Moov Money & SUNU Bank Togo :\n\n` +
        `Même si vous ne possédez pas de compte bancaire physique chez SUNU Bank Togo, vous pouvez souscrire instantanément à nos deux produits 100% mobiles en partenariat avec **Moov Africa Togo** :\n\n` +
        `1. **Épargne Moov** [PROD-EP-DIGMOOV] :\n` +
        `   • Cotisation : De **500 à 5 000 FCFA par mois** débités directement sur votre compte Moov Money\n` +
        `   • Durée : 15 ans\n` +
        `   • Avantage exclusif : Participation à des **tirages au sort trimestriels**. Si vous gagnez, vous touchez immédiatement l'intégralité du capital prévu sur 15 ans et vous êtes dispensé du paiement des cotisations restantes !\n\n` +
        `2. **Prévoyance Moov** [PROD-PR-DIGMOOV] :\n` +
        `   • Cotisation : **500 FCFA par mois** seulement\n` +
        `   • Garantie : Versement de **500 000 FCFA** aux bénéficiaires en cas de décès de l'assuré\n` +
        `   • Règlement express en **48 heures** directement sur le compte Moov Money des proches.`,
      sources
    };
  }

  // 6. Langues Locales (Éwé & Kabyè)
  if (isEwe) {
    sources.push(SUNU_KNOWLEDGE_DOCUMENTS[0], SUNU_KNOWLEDGE_DOCUMENTS[2]);
    return {
      reply: `### Woezɔ le SUNU Bank Togo ! (Bancassurance le Eʋegbe me)\n\n` +
        `Akpe kakaka ɖe wò biabia ta. Le SUNU Bank Togo la, míetsɔ ganyawo ƒe kpekpeɖeŋu vovovowo vɛ na míawɔlawo le **CIMA Se** ƒe ɖoɖowo nu :\n\n` +
        `1. **Visa Études** : Enye liidiye dzodzro na viwòwo ƒe sukukɔkɔwo. Àte ŋu adze egɔme kple **4 250 FCFA le ɣleti ɖesiaɖe me**.\n` +
        `2. **Horizon Retraite** : Enye dzodzro na wò dɔdzidada (retraite). Àte ŋu adze egɔme kple **10 000 FCFA le ɣleti me**, eye nàkpɔ **92% bonus** ne èwɔ dɔ sia ƒe 10.\n` +
        `3. **Protect Plus** : Enye lamedokuisinna na dɔnɔxɔxɔ kple dɔléle tso **500 FCFA le ɣleti me**.\n` +
        `4. **Épargne Moov** : Enye dɔwɔwɔ to Moov Money dzi ne kɔntra mele asiwò le bank la me o gɔ̃ hã.\n\n` +
        `*(Traduction française : Bienvenue chez SUNU Bank Togo. Toutes nos offres sont régies par le Code CIMA. Vous pouvez demander une simulation directe en précisant le montant de votre choix).*`,
      sources
    };
  }

  if (isKabye) {
    sources.push(SUNU_KNOWLEDGE_DOCUMENTS[0], SUNU_KNOWLEDGE_DOCUMENTS[2]);
    return {
      reply: `### Dɔɔ le SUNU Bank Togo ! (Bancassurance kɛ Kabyɛ tɔm taa)\n\n` +
        `Mba ɖɩkpaɣ liidiye nɛ ɖɩsɩɩ pɩlɩɩna **CIMA se** taa yɔ, pɩwɛ yem kɛlɛʊ nɛ pɩkɛ lɔŋ siŋŋ :\n\n` +
        `1. **Visa Études** : Pɩkɛ pɩɣa sukuli kɩkpaɖɩŋ liidiye sɩʊ tɔm. Ŋpɩzɩɣ nɛ ŋpaɣzɩ kpaɣ **4 250 FCFA fenaɣ taa**.\n` +
        `2. **Horizon Retraite** : Pɩkɛ pɩyʋʋ kɩbɩŋ liidiye tɔm, kpaɣ **10 000 FCFA fenaɣ taa** nɛ ŋhiɣ **92% bonus** pɩnzɩ 10 wayɩ.\n` +
        `3. **Protect Plus** : Pɩkɛ kʋdɔmɩŋ nɛ kʋjɔŋ liidiye kpaɣ **500 FCFA**.\n` +
        `4. **Épargne Moov** : Pɩkɛ Moov Money yɔɔ liidiye sɩʊ tɔm.\n\n` +
        `*(Traduction française : Bienvenue chez SUNU Bank Togo. Toutes nos offres d'assurance vie respectent le Code CIMA. Demandez votre simulation en précisant votre cotisation).*`,
      sources
    };
  }

  // 7. Recherche ciblée par produit
  let matched = SUNU_KNOWLEDGE_DOCUMENTS[2]; // Horizon Retraite par défaut
  if (q.includes('etude') || q.includes('étude') || q.includes('enfant') || q.includes('scolaire')) {
    matched = (q.includes('plus') || q.includes('edupro')) ? SUNU_KNOWLEDGE_DOCUMENTS[1] : SUNU_KNOWLEDGE_DOCUMENTS[0];
  } else if (q.includes('retraite 5') || q.includes('ret5') || q.includes('retraite5')) {
    matched = SUNU_KNOWLEDGE_DOCUMENTS[3];
  } else if (q.includes('retraite') || q.includes('horizon')) {
    matched = SUNU_KNOWLEDGE_DOCUMENTS[2];
  } else if (q.includes('bonus')) {
    matched = SUNU_KNOWLEDGE_DOCUMENTS[4];
  } else if (q.includes('protect') || q.includes('sante') || q.includes('santé') || q.includes('hospital')) {
    matched = SUNU_KNOWLEDGE_DOCUMENTS[5];
  } else if (q.includes('secure') || q.includes('compte')) {
    matched = SUNU_KNOWLEDGE_DOCUMENTS[6];
  } else if (q.includes('moov')) {
    matched = (q.includes('prevoyance') || q.includes('prévoyance')) ? SUNU_KNOWLEDGE_DOCUMENTS[8] : SUNU_KNOWLEDGE_DOCUMENTS[7];
  } else if (q.includes('serenite') || q.includes('sérénité') || q.includes('obseque') || q.includes('obsèque')) {
    matched = SUNU_KNOWLEDGE_DOCUMENTS[9];
  }

  sources.push(matched);
  sources.push(SUNU_KNOWLEDGE_DOCUMENTS[10]);

  return {
    reply: `### Informations Certifiées CIMA : **${matched.title}** [${matched.id}]\n\n` +
      `**Catégorie** : ${matched.category}\n` +
      (matched.startingPrice ? `💰 **Conditions tarifaires** : ${matched.startingPrice}\n` : '') +
      (matched.duration ? `📅 **Durée de souscription** : ${matched.duration}\n` : '') +
      (matched.yield ? `📈 **Rendement contractuel** : ${matched.yield}\n\n` : '\n') +
      `**Garanties & Avantages Principaux** :\n` +
      (matched.benefits ? matched.benefits.map((b: string) => `• ${b}`).join('\n') : '') +
      `\n\n⚖️ **Encadré Réglementaire Code CIMA** :\n` +
      `• ${(matched as any).cima || 'Régit par les dispositions du Code CIMA Livre I et l\'obligation d\'information précontractuelle (Art. 6).'}\n` +
      `• Droit de renonciation légal de 30 jours à compter de la souscription (Article 76).\n` +
      `• Rachat encadré dès 2 ans de cotisations avec indemnité légale plafonnée à 5% de la provision mathématique (Articles 74 & 76).\n\n` +
      `Souhaitez-vous effectuer une **simulation chiffrée** de ce produit ? *(Ex : tapez « Simule ${matched.title} avec 25 000 F sur 10 ans »)*.`,
    sources
  };
}

// ==============================================================================
// APP SERVER
// ==============================================================================
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      bank: "SUNU Bank Togo",
      regulation: "Code CIMA / UEMOA / CRCA",
      productsAvailable: 8
    });
  });

  // API Network Info Endpoint (Pour test en salle via Smartphone / QR Code)
  app.get("/api/network-info", (_req: Request, res: Response) => {
    const localIp = getLocalNetworkIp();
    const port = PORT;
    const url = `http://${localIp}:${port}`;
    res.json({
      localIp,
      port,
      url,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(url)}`,
      bank: "SUNU Bank Togo",
      service: "Bancassurance RAG & Simulateur Actuariel CIMA",
      status: "online"
    });
  });

  // API RAG Documents List
  app.get("/api/rag/documents", (_req: Request, res: Response) => {
    res.json({ documents: SUNU_KNOWLEDGE_DOCUMENTS });
  });

  // API RAG Query Endpoint
  app.post("/api/rag/query", async (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Requête manquante" });
      }

      const ai = getAIClient();
      const docsContext = JSON.stringify(SUNU_KNOWLEDGE_DOCUMENTS, null, 2);

      if (ai) {
        try {
          const prompt = `Tu es le moteur d'intelligence RAG officiel de SUNU Bank Togo pour la bancassurance vie et la conformité CIMA.
Voici la base documentaire certifiée issue du portefeuille officiel de SUNU Bank Togo :
${docsContext}

Question de l'analyste / conseiller / client : "${query}"

Instructions strictes :
1. Réponds avec une rigueur juridique et académique exemplaire, clarté et exactitude en citant systématiquement le nom du produit et son identifiant (ex : [PROD-EP-EDUCATION]).
2. Mentionne toujours les montants minimaux exacts, la durée, le taux minimum garanti réglementaire de 3,5% net/an (Code CIMA & Décisions CMA), les garanties prévoyance et le droit de renonciation de 30 jours (Art. 76 CIMA).
3. Cite expressément les dispositions légales CIMA applicables selon la thématique :
   - Information précontractuelle & encadré légal standardisé : Articles 6 et 65-1 du Code CIMA
   - Rachat (2 ans minimum, indemnité plafonnée à 5% de la provision mathématique, 0% après 10 ans) : Articles 74 et 76 du Code CIMA
   - Avance sur police sans perte des garanties : Article 75 du Code CIMA
   - Droit de renonciation de 30 jours calendaires avec remboursement intégral sous 30 jours : Article 76 du Code CIMA
   - Participation aux bénéfices (minimum 85% des rendements financiers nets) & Effet Cliquet : Article 84 du Code CIMA
   - Déclaration de sinistre sous 5 jours ouvrés : Article 21 du Code CIMA
   - Prescription biennale de 2 ans : Article 28 du Code CIMA
   - Clause bénéficiaire et impact bloquant du bénéficiaire acceptant : Articles 60 et 68 du Code CIMA
   - Micro-assurance simplifiée : Livre VII du Code CIMA & Règlement n° 003/CIMA/2012
   - Distribution bancassurance, diagnostic KYC et séparation des fonds : Livre V du Code CIMA & Circulaires CRCA
   - Protection des données à caractère personnel : Loi togolaise n° 2019-014 (IPDCP Togo)
   - Organe suprême de régulation et de contrôle : CRCA (Libreville) et Conseil des Ministres des Assurances (CMA)
4. Ne jamais mentionner l'ACPR (organisme français). Uniquement Code CIMA, CRCA, UEMOA, BCEAO, et IPDCP Togo.`;

          let modelName = process.env.GOOGLE_LLM_MODEL || "gemini-3.6-flash";
          if (!modelName || modelName.includes("2.5") || modelName.includes("2.0") || modelName.includes("1.5")) {
            modelName = "gemini-3.6-flash";
          }
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
          });

          if (response && response.text) {
            return res.json({
              answer: response.text,
              sources: SUNU_KNOWLEDGE_DOCUMENTS.filter(d => {
                const q = query.toLowerCase();
                if (d.id.startsWith("REG-CIMA")) {
                  if (q.includes("cima") || q.includes("reglement") || q.includes("règlement") || q.includes("loi") || q.includes("article") || q.includes("droit") || q.includes("ref") || q.includes("source") || q.includes("memoire") || q.includes("mémoire")) return true;
                  if (d.id === "REG-CIMA-LIVRE1" && (q.includes("rachat") || q.includes("renonciation") || q.includes("beneficiaire") || q.includes("bénéficiaire") || q.includes("sinistre") || q.includes("precontractuel") || q.includes("précontractuel") || q.includes("prescription") || q.includes("avance") || q.includes("6") || q.includes("21") || q.includes("28") || q.includes("74") || q.includes("75") || q.includes("76") || q.includes("84"))) return true;
                  if (d.id === "REG-CIMA-ACTUARIAT" && (q.includes("taux") || q.includes("tmg") || q.includes("actuariat") || q.includes("table") || q.includes("mortalite") || q.includes("mortalité") || q.includes("provision") || q.includes("cliquet") || q.includes("3,5") || q.includes("3.5"))) return true;
                  if (d.id === "REG-CIMA-LIVRE7" && (q.includes("micro") || q.includes("inclus") || q.includes("moov") || q.includes("mobile") || q.includes("protect") || q.includes("2012") || q.includes("003"))) return true;
                  if (d.id === "REG-CIMA-BANCASSURANCE" && (q.includes("bancassur") || q.includes("mandat") || q.includes("banque") || q.includes("conseil") || q.includes("kyc") || q.includes("ipdcp") || q.includes("2019-014") || q.includes("bceao"))) return true;
                  if (d.id === "REG-CIMA-ORGANES" && (q.includes("crca") || q.includes("cma") || q.includes("control") || q.includes("contrôle") || q.includes("litige") || q.includes("recours") || q.includes("sanction") || q.includes("ministre"))) return true;
                  return false;
                }
                return (
                  (q.includes("etude") || q.includes("étude") || q.includes("scolaire") ? d.id.includes("EDUCATION") || d.id.includes("EDUPRO") : false) ||
                  (q.includes("retraite") ? d.id.includes("RETRAITE") || d.id.includes("RET5") : false) ||
                  (q.includes("bonus") ? d.id.includes("BONUS") : false) ||
                  (q.includes("protect") || q.includes("santé") ? d.id.includes("PROTPLUS") : false) ||
                  (q.includes("secure") || q.includes("compte") ? d.id.includes("SECCOMPTE") : false) ||
                  (q.includes("moov") ? d.id.includes("MOOV") : false) ||
                  (q.includes("serenite") || q.includes("sérénité") || q.includes("obseque") || q.includes("obsèque") ? d.id.includes("SERENITE") : false)
                );
              })
            });
          }
        } catch (genError) {
          console.warn("Gemini API error in RAG query, falling back to certified local synthesis:", genError);
        }
      }

      // Fallback déterministe certifié CIMA
      const certified = buildCertifiedCimaReply(query);
      return res.json({
        answer: certified.reply,
        sources: certified.sources
      });

    } catch (err: any) {
      console.error("Error in /api/rag/query:", err);
      res.status(500).json({ error: "Erreur lors de l'exécution de la requête RAG" });
    }
  });

  // API Financial Concierge Chat Endpoint
  app.post("/api/concierge/chat", async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory, language } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message manquant" });
      }

      const simIntent = detectSimulationIntent(message);
      let simulationData: SimulationCalculation | null = null;
      if (simIntent.isSimulation) {
        simulationData = computeActuarialSimulation(simIntent.productKey, simIntent.amount, simIntent.duration);
      }

      const ai = getAIClient();
      if (ai) {
        try {
          const docsContext = JSON.stringify(SUNU_KNOWLEDGE_DOCUMENTS, null, 2);
          let langDirective = "LANGUE : Français soigné, accessible et courtois.";
          if (language === 'EN') {
            langDirective = `CRITICAL MANDATORY LANGUAGE: ENGLISH (EN).
You MUST formulate your ENTIRE response in professional, elegant, and grammatically flawless English.
Translate all insurance terms accurately:
- 'Fiche d'information précontractuelle' -> 'Precontractual Key Information Document (Art. 6 & 65-1 CIMA Code)'
- 'Valeur de rachat' -> 'Surrender value (Articles 74 & 76 CIMA Code, accessible after 2 full years, surrender penalty legally capped at 5% of mathematical reserves)'
- 'Droit de renonciation' -> 'Statutory 30-day cooling-off cancellation right (Article 76 CIMA Code, 100% full refund with zero deductions)'
- 'Participation aux bénéfices' -> 'Mandatory profit sharing (Article 84 CIMA Code, at least 85% of net financial investment returns)'
- 'Taux Minimum Garanti (TMG)' -> 'Guaranteed minimum technical interest rate (3.5% net per year)'
- 'Prescription biennale' -> 'Two-year biennial prescription period (Article 28 CIMA Code)'
Maintain SUNU Bank Togo and the official French product names (Visa Études, Horizon Retraite, Protect Plus, Secure Compte, Épargne Moov, Sérénité).
Do NOT reply in French when the requested language is EN!`;
          } else if (language === 'EW') {
            langDirective = `CRITICAL MANDATORY LANGUAGE: ÉWÉ / EVEGBE (EW - Langue nationale du Togo).
You MUST respond primarily in authentic, respectful, and fluent ÉWÉ (Evegbe) as spoken in Togo (Lomé, Maritime, Plateaux).
- Use warm greetings: Woezɔ / Miawoe zɔ / Akpe kaka / Mede kuku.
- Use key Éwé concepts:
  * Ganyawo (Finances) / Ga dzidzedze / Dzidzem (Épargne)
  * Nudzɔdzɔ / Ametakpɔkpɔ (Assurance vie / Prévoyance)
  * Sukuli kple dɔwɔƒe na ɖeviwo (Études des enfants pour Visa Études)
  * Kpɔkplɔ / Dzudzɔxɔxɔ le dɔ me (Retraite pour Horizon Retraite)
  * Ga home si woatɔ le xexi me (Cotisation mensuelle FCFA)
  * Ga si woɖo ɖi na wò le nuwuwu (Capital garanti au terme)
  * CIMA Se la (Code CIMA - Art. 6, 74, 76, 84)
  * Mɔnukpɔkpɔ be nàtrɔ dzi le ŋkeke 30 me (Renonciation 30 jours Art. 76)
  * Ga gbugbɔxɔ le ƒe 2 megbe (Valeur de rachat après 2 ans Art. 74)
Provide clear, respectful explanations in Éwé with numbers and FCFA amounts clearly stated.`;
          } else if (language === 'KB') {
            langDirective = `CRITICAL MANDATORY LANGUAGE: KABYÈ (KB - Langue nationale du Togo).
You MUST respond primarily in authentic, respectful, and fluent KABYÈ as spoken in Togo (Kara, Kozah, Togo Nord).
- Use warm greetings: Dɔɔ / Ɖɩseɣ-ŋ / Ɛɛ dɔɔ / Akpɛ.
- Use key Kabyè concepts:
  * Liidiye (Argent / Cotisations FCFA)
  * Liidiye kɩkandɩyɛ / Kandɩyʋ (Assurance vie / Prévoyance)
  * Pɩɣa sukuli (Études des enfants pour Visa Études)
  * Kpazaʋ / Ɖazaʋ (Retraite pour Horizon Retraite)
  * Fenaɣ liidiye (Cotisation mensuelle)
  * Liidiye nɖɩ pɔcɔsɩ-ŋ pɩwayɩ (Capital garanti au terme)
  * CIMA se (Code CIMA - Art. 6, 74, 76, 84)
  * Kiziʋ kɩyakɩŋ 30 taa (Renonciation 30 jours Art. 76)
  * Liidiye lɩzʋʋ pɩnzɩ 2 wayɩ (Rachat après 2 ans Art. 74)
Provide clear, respectful explanations in Kabyè adapted to Togolese realities.`;
          }

          const systemInstruction = `Tu es le Conseiller Bancassurance Senior et Concierge Financier officiel de SUNU Bank Togo.
Ton rôle est d'accompagner les clients et chargés de clientèle avec expertise, amabilité, rigueur juridique et clarté sur l'ensemble du portefeuille officiel de 8 produits de bancassurance vie conforme au Code CIMA.
${langDirective}

Base documentaire certifiée SUNU Bank Togo :
${docsContext}

${simulationData ? `DONNÉES ACTUARIELLES OFFICIELLES CALCULÉES POUR CETTE SIMULATION (TMG CIMA 3,5%) :
${JSON.stringify(simulationData, null, 2)}
-> Tu DOIS impérativement intégrer ces chiffres exacts dans ta réponse (total cotisé, capital garanti, bonus fidélité ou rentes d'études).` : ""}

Directives strictes :
1. TON : Haut de gamme, courtois, pédagogue, digne d'un conseiller bancassurance de référence à Lomé.
2. CONFORMITÉ & RÉFÉRENCES CODE CIMA : Tu maîtrises parfaitement l'ensemble des textes officiels CIMA. Cite avec exactitude les articles applicables :
   - Fiche d'information précontractuelle & encadré légal standardisé : Articles 6 et 65-1 du Code CIMA
   - Faculté de renonciation de 30 jours calendaires révolus (remboursement intégral sous 30 jours sans frais) : Article 76 du Code CIMA
   - Conditions de rachat (ouvert dès 2 ans de cotisations effectives, indemnité plafonnée à 5% de la provision mathématique, 0% après 10 ans) : Articles 74 et 76 du Code CIMA
   - Avance sur police sans résiliation du contrat : Article 75 du Code CIMA
   - Redistribution obligatoire d'au moins 85% des bénéfices financiers nets avec effet cliquet irréversible : Article 84 du Code CIMA
   - Déclaration de sinistre sous un délai légal de 5 jours ouvrés : Article 21 du Code CIMA
   - Prescription biennale de deux ans : Article 28 du Code CIMA
   - Clause bénéficiaire et effet bloquant du bénéficiaire acceptant : Articles 60 et 68 du Code CIMA
   - Taux Minimum Garanti (TMG) plafonné à 3,5% net/an par décision du Conseil des Ministres des Assurances (CMA) et tables de mortalité TD/TF 88-90
   - Micro-assurance simplifiée pour l'inclusion financière : Livre VII du Code CIMA & Règlement n° 003/CIMA/2012 (Protect Plus & Moov Money)
   - Statut de bancassurance, devoir de convenance patrimoniale KYC et séparation des fonds : Livre V du Code CIMA & Circulaires CRCA
   - Protection des données personnelles : Loi togolaise n° 2019-014 (IPDCP Togo)
   - Organe de régulation suprême et de contrôle prudentiel : Commission Régionale de Contrôle des Assurances (CRCA) à Libreville
3. Ne jamais mentionner l'ACPR (organisme français). Uniquement Code CIMA, CRCA, UEMOA, BCEAO, et IPDCP Togo.`;

          let modelName = process.env.GOOGLE_LLM_MODEL || "gemini-3.6-flash";
          if (!modelName || modelName.includes("2.5") || modelName.includes("2.0") || modelName.includes("1.5")) {
            modelName = "gemini-3.6-flash";
          }
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              { text: `System Instruction: ${systemInstruction}` },
              ...(conversationHistory || []).map((msg: any) => ({
                text: `${msg.role === 'user' ? 'Client' : 'Conseiller'}: ${msg.content}`
              })),
              { text: `Client: ${message}` }
            ]
          });

          if (response && response.text) {
            return res.json({
              reply: response.text,
              structuredData: simulationData ? { simulation: simulationData } : null
            });
          }
        } catch (genError) {
          console.warn("Gemini API error in chat, using deterministic certified CIMA response:", genError);
        }
      }

      // Fallback déterministe certifié CIMA
      const certified = buildCertifiedCimaReply(message, language, simulationData);
      return res.json({
        reply: certified.reply,
        structuredData: simulationData ? { simulation: simulationData } : null,
        sources: certified.sources
      });

    } catch (err: any) {
      console.error("Error in /api/concierge/chat:", err);
      res.status(500).json({ error: "Erreur lors du traitement du message" });
    }
  });

  // API Simulation directe
  app.post("/api/simulate", (req: Request, res: Response) => {
    const { productKey, monthlyAmount, durationYears } = req.body;
    const result = computeActuarialSimulation(productKey, monthlyAmount, durationYears);
    res.json(result);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SUNU Bank Togo Bancassurance Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
