import express, { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
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

export function computeActuarialSimulation(
  productKey: string,
  monthlyAmount?: number,
  durationYears?: number
) {
  const normKey = (productKey || "").toLowerCase();

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
      cimaMentions: "Conforme Articles 6 & 65-1 Code CIMA. Faculté de renonciation de 30 jours (Art. 76)."
    };
  }

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
      cimaMentions: "Conforme Article 6 Code CIMA. Taux technique garanti 3,5%. Droit de renonciation de 30 jours."
    };
  }

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
      cimaMentions: "Conforme Code CIMA Livre I. Taux d'intérêt technique garanti 3,5% + Participation aux bénéfices Art. 84."
    };
  }

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
      cimaMentions: "Code CIMA Articles 6, 74 & 84. Taux minimum garanti 3,5% + Participation aux bénéfices annuelle obligatoire."
    };
  }

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
      specificBenefit: "Tirages au sort trimestriels : gain immédiat du capital total sans cotisations futures !",
      deathDisabilityGuarantee: "Préservation intégrale de l'épargne constituée pour les ayants droit en cas de décès",
      cimaMentions: "Contrat de capitalisation avec loterie réglementée conforme au Code CIMA. Droit de renonciation de 30 jours."
    };
  }

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
      cimaMentions: "Micro-assurance régie par le Livre VII du Code CIMA. Renouvelable annuellement."
    };
  }

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
      specificBenefit: `Protection immédiate du solde et capital de ${capGaranti.toLocaleString('fr-FR')} FCFA aux proches`,
      deathDisabilityGuarantee: `Capital décès / invalidité de ${capGaranti.toLocaleString('fr-FR')} FCFA (adhérents de 18 à 70 ans)`,
      cimaMentions: "Prévoyance bancassurance conforme Code CIMA adossée à la tenue de compte SUNU Bank Togo."
    };
  }

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
        specificBenefit: "Souscription et gestion 100% digitale sur wallet Moov Money",
        deathDisabilityGuarantee: "Paiement ultra-rapide du capital décès sur Moov Money",
        cimaMentions: "Micro-assurance mobile autorisée par la CRCA / CIMA."
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
        specificBenefit: "Tirages au sort trimestriels avec capital intégral sur 15 ans libéré par anticipation !",
        deathDisabilityGuarantee: "Restitution du capital constitué aux bénéficiaires désignés",
        cimaMentions: "Micro-assurance CIMA en partenariat avec Moov Africa Togo."
      };
    }
  }

  // Sérénité
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
    specificBenefit: "Prise en charge rapide des frais funéraires et transmission d'un capital sécurisé aux proches",
    deathDisabilityGuarantee: "Capital immédiat pour frais d'obsèques + préservation de l'épargne constituée",
    cimaMentions: "Conforme au Code CIMA Livre I. Droit de renonciation de 30 jours (Art. 76)."
  };
}

export function detectSimulationIntent(text: string) {
  const norm = text.toLowerCase();
  const simKeywords = ["simul", "calcul", "combien", "devis", "estimation", "projec", "épargner", "cotis"];
  const isSimulation = simKeywords.some(k => norm.includes(k)) || /\b(\d+)\s*(fcfa|f|ans|mois)\b/i.test(norm);

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

  let amount: number | undefined;
  const matchAmt = norm.match(/(\d[\d\s]*\d|\d+)\s*(?:fcfa|f\b|francs?)/i) || norm.match(/(?:cotis\w*|montant|mettre|verser)\s*(?:de\s*)?(\d[\d\s]*\d|\d+)/i);
  if (matchAmt) {
    const rawVal = matchAmt[1].replace(/\s+/g, "");
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed > 100) amount = parsed;
  }

  let duration: number | undefined;
  const matchDur = norm.match(/(\d+)\s*(?:ans?|années?)/i);
  if (matchDur) {
    const parsedDur = parseInt(matchDur[1], 10);
    if (!isNaN(parsedDur) && parsedDur >= 1 && parsedDur <= 35) duration = parsedDur;
  }

  return { isSimulation, productKey, amount, duration };
}

// API Health Endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    bank: "SUNU Bank Togo",
    regulation: "Code CIMA / UEMOA / CRCA"
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
1. Réponds avec rigueur professionnelle, clarté et exactitude en citant systématiquement le nom du produit et son identifiant (ex : [PROD-EP-EDUCATION]).
2. Mentionne toujours les montants minimaux exacts, la durée, le taux minimum garanti réglementaire de 3,5% l'an (Code CIMA), les garanties prévoyance et le droit de renonciation de 30 jours (Art. 76 CIMA).
3. Si la question est une demande de calcul ou de simulation, donne le total cotisé et le capital garanti estimé.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
        });

        return res.json({
          answer: response.text,
          sources: SUNU_KNOWLEDGE_DOCUMENTS.filter(d => {
            const q = query.toLowerCase();
            return (
              (q.includes("etude") || q.includes("étude") || q.includes("scolaire") ? d.id.includes("EDUCATION") || d.id.includes("EDUPRO") : false) ||
              (q.includes("retraite") ? d.id.includes("RETRAITE") || d.id.includes("RET5") : false) ||
              (q.includes("bonus") ? d.id.includes("BONUS") : false) ||
              (q.includes("protect") || q.includes("santé") ? d.id.includes("PROTPLUS") : false) ||
              (q.includes("secure") || q.includes("compte") ? d.id.includes("SECCOMPTE") : false) ||
              (q.includes("moov") ? d.id.includes("MOOV") : false) ||
              (q.includes("cima") || q.includes("reglement") || q.includes("rachat") ? d.id.includes("CIMA") : false)
            );
          })
        });
      } catch (genError) {
        console.warn("Gemini API error in RAG query, falling back to deterministic synthesis:", genError);
      }
    }

    // Fallback déterministe
    const normalized = query.toLowerCase();
    let matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[0];
    if (normalized.includes("retraite")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[2];
    } else if (normalized.includes("bonus")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[4];
    } else if (normalized.includes("protect") || normalized.includes("santé") || normalized.includes("sante")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[5];
    } else if (normalized.includes("secure") || normalized.includes("compte")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[6];
    } else if (normalized.includes("moov")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[7];
    } else if (normalized.includes("actuariat") || normalized.includes("taux") || normalized.includes("tmg") || normalized.includes("mortalite") || normalized.includes("mortalité") || normalized.includes("provision")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[11];
    } else if (normalized.includes("micro") || normalized.includes("2012") || normalized.includes("003")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[12];
    } else if (normalized.includes("bancassur") || normalized.includes("mandat") || normalized.includes("kyc") || normalized.includes("ipdcp") || normalized.includes("2019-014")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[13];
    } else if (normalized.includes("crca") || normalized.includes("cma") || normalized.includes("litige") || normalized.includes("recours")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[14];
    } else if (normalized.includes("cima") || normalized.includes("loi") || normalized.includes("rachat") || normalized.includes("article") || normalized.includes("sinistre") || normalized.includes("renonciation")) {
      matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[10];
    }

    return res.json({
      answer: `Selon le corpus officiel de SUNU Bank Togo [${matchedDoc.id}] :\n\n` +
        `**${matchedDoc.title}** (${matchedDoc.category})\n` +
        (matchedDoc.startingPrice ? `• Cotisation minimale : ${matchedDoc.startingPrice}\n` : "") +
        (matchedDoc.yield ? `• Rendement : ${matchedDoc.yield}\n` : "") +
        (matchedDoc.benefits ? matchedDoc.benefits.map((b: string) => `• ${b}`).join("\n") : "") +
        `\n\n📌 *Conformité Code CIMA : Les contrats sont régis par les dispositions de l'Article 6 du Code CIMA (droit de renonciation de 30 jours, rachat réglementé).*`,
      sources: [matchedDoc]
    });

  } catch (err: any) {
    console.error("Error in /api/rag/query:", err);
    res.status(500).json({ error: "Erreur lors de l'exécution de la requête RAG" });
  }
});

// API Financial Concierge Chat Endpoint
app.post("/api/concierge/chat", async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    const simIntent = detectSimulationIntent(message);
    let simulationData: any = null;
    if (simIntent.isSimulation) {
      simulationData = computeActuarialSimulation(simIntent.productKey, simIntent.amount, simIntent.duration);
    }

    const ai = getAIClient();
    const docsContext = JSON.stringify(SUNU_KNOWLEDGE_DOCUMENTS, null, 2);

    if (ai) {
      try {
        const systemInstruction = `Tu es le Conseiller Bancassurance Senior et Concierge Financier officiel de SUNU Bank Togo.
Ton rôle est d'accompagner les clients et chargés de clientèle avec expertise, amabilité, rigueur juridique et clarté sur l'ensemble du portefeuille de bancassurance vie conforme au Code CIMA.

Base documentaire certifiée SUNU Bank Togo :
${docsContext}

${simulationData ? `DONNÉES ACTUARIELLES OFFICIELLES CALCULÉES POUR CETTE SIMULATION :
${JSON.stringify(simulationData, null, 2)}
-> Tu DOIS impérativement intégrer ces chiffres exacts dans ta réponse pour donner une simulation financière claire, structurée et précise au client.` : ""}

Directives strictes :
1. TON : Haut de gamme, courtois, pédagogue, digne d'un conseiller bancassurance de référence à Lomé.
2. CONFORMITÉ CODE CIMA : Rappelle toujours l'Article 6 (information précontractuelle loyale), le droit de renonciation de 30 jours (Art. 76) et le fait que la simulation précontractuelle est indicative et finalisée avec le conseiller en agence.
3. SI LE CLIENT DEMANDE UNE SIMULATION OU DES CHIFFRES : Détaille le total cotisé, le capital garanti au terme avec le taux technique garanti de 3,5% l'an (Code CIMA), les spécificités (Bonus de fidélité 92% pour Horizon Retraite, rentes trimestrielles d'éducation pour Visa Études, tirages au sort pour Épargne Bonus/Moov, capitaux pour Protect Plus/Secure Compte).
4. CITE LES ARTICLES DU CODE CIMA (Art. 6, 74, 76, 84).`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          config: {
            systemInstruction: systemInstruction,
          },
          contents: [
            ...(conversationHistory || []).map((msg: any) => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
            })),
            { role: 'user', parts: [{ text: message }] }
          ]
        });

        return res.json({
          reply: response.text,
          structuredData: simulationData ? { simulation: simulationData } : null
        });
      } catch (genError) {
        console.warn("Gemini API error in chat, using deterministic actuarial response:", genError);
      }
    }

    // Fallback déterministe
    if (simulationData) {
      return res.json({
        reply: `Voici votre simulation financière précontractuelle pour **${simulationData.productName}** (${simulationData.category}) :\n\n` +
          `💰 **Cotisation** : ${simulationData.monthlyAmount.toLocaleString('fr-FR')} FCFA / mois\n` +
          `📅 **Durée prévue** : ${simulationData.durationYears} ans\n` +
          `📊 **Total cotisé** : ${simulationData.totalContributed.toLocaleString('fr-FR')} FCFA\n` +
          `🎯 **Capital garanti à terme** : **${simulationData.guaranteedCapital.toLocaleString('fr-FR')} FCFA** *(avec Taux Minimum Garanti CIMA de 3,5% l'an + participation aux bénéfices Art. 84)*\n\n` +
          `✨ **Spécificité contractuelle** : ${simulationData.specificBenefit}\n` +
          `🛡️ **Couverture prévoyance** : ${simulationData.deathDisabilityGuarantee}\n\n` +
          `⚖️ *${simulationData.cimaMentions}*\n\n` +
          `Souhaitez-vous ajuster le montant ou être mis en relation avec votre conseiller SUNU Bank Togo en agence pour éditer votre proposition d'assurance officielle ?`,
        structuredData: { simulation: simulationData }
      });
    }

    // Fallback comparaison multi-produits (Visa Études vs Visa Études Plus, etc.)
    const normalized = message.toLowerCase();
    const isComparison = normalized.includes("compar") || normalized.includes("versus") ||
      normalized.includes("vs ") || normalized.includes(" vs") || normalized.includes("différen") ||
      normalized.includes("differen") || normalized.includes("entre");

    const mentionsVisaEtudes    = normalized.includes("visa études") || normalized.includes("visa etudes");
    const mentionsVisaEtudesPlus = normalized.includes("plus") && (normalized.includes("visa") || normalized.includes("études") || normalized.includes("etudes"));
    const mentionsRetraite      = normalized.includes("retraite");
    const mentionsHorizon5      = normalized.includes("horizon 5") || normalized.includes("retraite 5");

    if (isComparison && (mentionsVisaEtudes || mentionsVisaEtudesPlus)) {
      const visaEtudes     = SUNU_KNOWLEDGE_DOCUMENTS[0];
      const visaEtudesPlus = SUNU_KNOWLEDGE_DOCUMENTS[1];
      return res.json({
        reply:
`## Comparatif officiel : Visa Études vs Visa Études Plus\n\n` +
`| Critère | **${visaEtudes.title}** | **${visaEtudesPlus.title}** |\n` +
`|---|---|---|\n` +
`| **Objectif** | Épargne progressive pour les études supérieures de l'enfant | Couverture renforcée famille + bourses trimestrielles échelonnées |\n` +
`| **Cotisation minimale** | ${visaEtudes.startingPrice} | ${visaEtudesPlus.startingPrice} |\n` +
`| **Durée** | ${visaEtudes.duration} | ${visaEtudesPlus.duration} |\n` +
`| **Rendement garanti** | ${visaEtudes.yield} | ${visaEtudesPlus.yield} |\n` +
`| **Mode de versement** | Capital unique ou rentes trimestrielles d'études (3 à 5 ans) | Bourses trimestrielles d'études échelonnées à terme |\n` +
`| **Décès du parent** | Exonération intégrale des cotisations + capital garanti maintenu à terme | **Rente d'orphelinat immédiate versée jusqu'au terme** + exonération des primes |\n` +
`| **Décès accidentel** | Capital garanti maintenu | **Doublement du capital** en cas de décès accidentel |\n` +
`| **Versements libres** | Non prévu | Oui — versements libres complémentaires possibles à tout moment |\n` +
`| **Public cible** | Parents/tuteurs, enfant de 0 à 18 ans | Familles souhaitant une prévoyance renforcée et un suivi universitaire sécurisé |\n` +
`\n---\n\n` +
`### 📌 Conditions de sortie — Code CIMA\n\n` +
`**Commun aux deux contrats :**\n` +
`- **Droit de renonciation** : 30 jours calendaires après signature (Art. 76) — remboursement intégral, sans frais\n` +
`- **Rachat anticipé** : Interdit avant **2 ans** de cotisations effectives (Art. 74)\n` +
`- **Frais de rachat** : Plafonnés à **5%** de la provision mathématique (Art. 76)\n` +
`- **Rachat après 10 ans** : Sans pénalité (0%)\n` +
`- **Information précontractuelle** : Fiche synthétique obligatoire + encadré Art. 65-1 CIMA\n` +
`- **Participation aux bénéfices** : Au moins 85% des bénéfices financiers redistribués (Art. 84)\n\n` +
`### 🏆 Quel produit choisir ?\n\n` +
`- Choisissez **Visa Études** si votre budget est limité (dès **4 250 FCFA/mois**) et que vous souhaitez constituer un capital éducation simple et sécurisé.\n` +
`- Choisissez **Visa Études Plus** si vous souhaitez une **protection prévoyance maximale** (rente orphelinat + doublement accident) et avez la capacité de cotiser à partir de **10 000 FCFA/mois**.\n\n` +
`*Simulation personnalisée disponible sur demande. Conformément à l'Article 6 du Code CIMA, cette information précontractuelle est indicative et sera finalisée avec votre conseiller SUNU Bank Togo en agence.*`,
        structuredData: null
      });
    }

    if (isComparison && mentionsRetraite) {
      const hr  = SUNU_KNOWLEDGE_DOCUMENTS[2];
      const hr5 = SUNU_KNOWLEDGE_DOCUMENTS[3];
      return res.json({
        reply:
`## Comparatif : Horizon Retraite vs Horizon Retraite 5\n\n` +
`| Critère | **${hr.title}** | **${hr5.title}** |\n` +
`|---|---|---|\n` +
`| **Objectif** | Capitalisation retraite long terme | Capitalisation accélérée sur 5 ans ferme |\n` +
`| **Cotisation minimale** | ${hr.startingPrice} | ${hr5.startingPrice} |\n` +
`| **Durée** | ${hr.duration} | ${hr5.duration} |\n` +
`| **Rendement garanti** | ${hr.yield} | ${hr5.yield} |\n` +
`| **Bonus fidélité** | **92% de la 1ère annuité** si durée ≥ 10 ans sans rachat | Non applicable |\n` +
`| **Sortie à terme** | Capital unique ou rente viagère mensuelle réversible | Capital unique |\n` +
`| **Public cible** | Actifs préparant leur retraite à long terme | Cadres/seniors à 5 ans de la cessation d'activité |\n\n` +
`### 📌 Conditions CIMA communes\n` +
`- Renonciation 30 jours (Art. 76) | Rachat dès 2 ans (Art. 74) | Frais max 5% PM | Participation bénéfices (Art. 84)\n\n` +
`*Demandez une simulation personnalisée en précisant votre montant mensuel et durée souhaitée.*`,
        structuredData: null
      });
    }

    return res.json({
      reply: `Bienvenue chez SUNU Bank Togo. Je suis votre Concierge Bancassurance certifié CIMA.\n\n` +
        `Notre portefeuille d'assurance vie comprend des solutions d'épargne-études (**Visa Études**, **Visa Études Plus**), de retraite (**Horizon Retraite**, **Horizon Retraite 5**), d'épargne bonifiée (**Épargne Bonus**), et de micro-assurance prévoyance (**Protect Plus**, **Secure Compte**, **Épargne Moov**, **Sérénité**).\n\n` +
        `Vous pouvez me demander une comparaison (ex: *« Compare Visa Études et Visa Études Plus »*) ou une simulation chiffrée (ex: *« Simule Horizon Retraite pour 25 000 FCFA/mois sur 15 ans »*). Comment puis-je vous guider ?`,
      structuredData: null
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

export default app;
