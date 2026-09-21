import express, { Request, Response } from "express";
import path from "path";
import os from "os";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

const app = express();
app.use(express.json());

export function getLocalNetworkIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (name.toLowerCase().includes("wi-fi") || name.toLowerCase().includes("wireless") || name.toLowerCase().includes("eth")) {
      for (const net of interfaces[name] || []) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  }
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
// BASE DE CONNAISSANCE : 32 TERMES RÉGLEMENTAIRES, ACTUARIELS ET BANCASSURANCE CIMA
// ==============================================================================
export interface LexiconEntry {
  id: string;
  term: string;
  category: 'Réglementation' | 'Actuariat' | 'Contrat' | 'Bancassurance';
  aliases: string[];
  definition: string;
  legalBasis: string;
  bankApplication: string;
  concreteExample: string;
  relatedProducts: string[];
}

export const CIMA_LEXICON_DATABASE: LexiconEntry[] = [
  // ── 1. Réglementation CIMA & Protection du Souscripteur (9 termes) ───────────
  {
    id: "LEX-REG-ART6",
    term: "Article 6 du Code CIMA",
    category: "Réglementation",
    aliases: ["article 6", "art 6", "art. 6", "information precontractuelle", "information précontractuelle", "notice d'information"],
    definition: "Obligation légale impérative imposant à la banque et à l'assureur de remettre au souscripteur, AVANT la conclusion du contrat, une proposition d'assurance et une fiche d'information précontractuelle claire, loyale et détaillée.",
    legalBasis: "Article 6 du Code des Assurances CIMA (Livre I, Titre I).",
    bankApplication: "En agence SUNU Bank Togo, le conseiller remet systématiquement au client une fiche synthétique décrivant les garanties, cotisations, durée, délais de paiement et exclusions avant tout paiement ou signature.",
    concreteExample: "Avant de souscrire un contrat Visa Études, Koffi reçoit une fiche officielle détaillant le taux minimum garanti (3,5%) et le tableau des valeurs de rachat.",
    relatedProducts: ["Tous les 8 contrats du portefeuille SUNU Bank Togo"]
  },
  {
    id: "LEX-REG-ART65",
    term: "Article 65-1 du Code CIMA",
    category: "Réglementation",
    aliases: ["article 65-1", "article 65", "art 65-1", "art. 65-1", "encadre legal", "encadré légal", "encadre standardise"],
    definition: "Encadré légal standardisé et obligatoire inséré en tête de toute proposition d'assurance vie, en caractères très apparents, attirant expressément l'attention du souscripteur sur la durée, le capital garanti, les valeurs de rachat et les frais.",
    legalBasis: "Article 65-1 du Code CIMA (Protection et transparence de l'épargnant).",
    bankApplication: "Sur tous les bulletins de souscription SUNU Bank (Horizon Retraite, Visa Études), cet encadré résume en un coup d'œil les 5 points clés du contrat.",
    concreteExample: "Dès la première page, Ama voit un encadré rouge lui rappelant que tout rachat est interdit avant 2 ans de cotisations effectives.",
    relatedProducts: ["Visa Études", "Visa Études Plus", "Horizon Retraite", "Épargne Bonus", "Sérénité"]
  },
  {
    id: "LEX-REG-ART74",
    term: "Valeur de rachat (Article 74)",
    category: "Réglementation",
    aliases: ["valeur de rachat", "article 74", "art 74", "art. 74", "rachat", "rachat anticipe", "rachat anticipé", "retrait anticipe"],
    definition: "Montant net récupérable par le souscripteur s'il met fin à son contrat d'assurance vie avant l'échéance. En zone CIMA, le rachat est strictement INTERDIT avant 2 ans révolus de cotisations effectives (ou 15% des primes prévues pour les contrats de moins de 10 ans).",
    legalBasis: "Article 74 du Code CIMA (Conditions de liquidation de la provision mathématique).",
    bankApplication: "SUNU Bank applique rigoureusement cette règle : pendant les 24 premiers mois, aucune valeur de rachat n'est exigible afin de protéger l'effort d'épargne constitué.",
    concreteExample: "Si vous cotisez 15 000 FCFA/mois sur Visa Études, vous ne pouvez pas demander de rachat avant d'avoir versé 24 mensualités (360 000 FCFA).",
    relatedProducts: ["Visa Études", "Visa Études Plus", "Horizon Retraite", "Épargne Bonus", "Sérénité"]
  },
  {
    id: "LEX-REG-ART76-RACHAT",
    term: "Plafonnement des frais de rachat (Art. 76)",
    category: "Réglementation",
    aliases: ["frais de rachat", "penalite de rachat", "pénalité de rachat", "plafonnement des frais de rachat", "indemnite de rachat"],
    definition: "Protection légale interdisant à l'assureur de prélever une indemnité de rachat supérieure à 5% de la provision mathématique. Au-delà de 10 ans de contrat, tout rachat est obligatoirement sans aucune pénalité (0%).",
    legalBasis: "Article 76 du Code CIMA.",
    bankApplication: "Pour un rachat effectué entre la 3e et la 9e année chez SUNU Bank, la pénalité ne dépasse jamais 5% de l'épargne acquise. À partir de la 10e année, le rachat est 100% net de pénalité.",
    concreteExample: "Sur une provision mathématique de 1 000 000 FCFA au bout de 4 ans, la pénalité maximale légale est de 50 000 FCFA (vous récupérez au minimum 950 000 FCFA).",
    relatedProducts: ["Horizon Retraite", "Visa Études", "Épargne Bonus", "Sérénité"]
  },
  {
    id: "LEX-REG-ART76-RENONC",
    term: "Faculté de renonciation de 30 jours (Art. 76)",
    category: "Réglementation",
    aliases: ["renonciation", "delai de renonciation", "délai de renonciation", "30 jours", "retractation", "rétractation", "annuler contrat"],
    definition: "Droit légal d'ordre public permettant à tout souscripteur d'annuler son contrat d'assurance vie dans un délai de 30 jours calendaires après signature, avec remboursement intégral de toutes les sommes versées sous 30 jours sans frais ni pénalité.",
    legalBasis: "Article 76 alinéa 1 du Code CIMA.",
    bankApplication: "Si vous changez d'avis après signature d'un contrat chez SUNU Bank Togo, une simple notification écrite dans les 30 jours déclenche le remboursement à 100% sur votre compte bancaire.",
    concreteExample: "Kodjo signe Horizon Retraite le 1er mai et verse 25 000 FCFA. Il renonce le 20 mai : SUNU Assurances lui restitue l'intégralité des 25 000 FCFA.",
    relatedProducts: ["Tous les contrats d'assurance vie SUNU Bank Togo"]
  },
  {
    id: "LEX-REG-ART84",
    term: "Participation aux bénéfices (Article 84)",
    category: "Réglementation",
    aliases: ["article 84", "art 84", "art. 84", "participation aux benefices", "participation aux bénéfices", "benefices financiers", "pb"],
    definition: "Obligation réglementaire imposant à la compagnie d'assurance de redistribuer aux souscripteurs d'assurance vie au moins 85% des bénéfices financiers nets réalisés sur le placement des provisions mathématiques.",
    legalBasis: "Article 84 du Code CIMA.",
    bankApplication: "Chaque année, SUNU Assurances Vie Togo calcule les résultats financiers de ses placements et affecte la quote-part aux contrats avec effet cliquet (irréversibilité des gains).",
    concreteExample: "En plus du taux garanti de 3,5%, votre contrat Horizon Retraite reçoit un bonus de participation aux bénéfices de 1,5%, portant le rendement annuel net à 5,0%.",
    relatedProducts: ["Horizon Retraite", "Visa Études", "Épargne Bonus", "Sérénité"]
  },
  {
    id: "LEX-REG-ART28",
    term: "Prescription Biennale (Article 28)",
    category: "Réglementation",
    aliases: ["prescription biennale", "prescription", "article 28", "art 28", "art. 28", "delai de recours", "délai de recours", "2 ans"],
    definition: "Règle de droit selon laquelle toutes les actions et réclamations judiciaires dérivant d'un contrat d'assurance se prescrivent par deux (2) ans à compter de l'événement qui leur donne naissance. Pour les bénéficiaires d'un capital décès, le délai court à compter du jour où ils ont eu connaissance du décès.",
    legalBasis: "Article 28 du Code CIMA (Prescription des actions).",
    bankApplication: "Les réclamations sur sinistre ou contestations de cotisations doivent être introduites dans les 2 ans pour rester recevables devant les juridictions togolaises.",
    concreteExample: "En cas d'accident survenu en mars 2024, l'assuré a jusqu'en mars 2026 pour faire valoir ses droits à indemnité.",
    relatedProducts: ["Tous les contrats de bancassurance SUNU Bank Togo"]
  },
  {
    id: "LEX-REG-ART21",
    term: "Déclaration de sinistre (Article 21)",
    category: "Réglementation",
    aliases: ["declaration de sinistre", "déclaration de sinistre", "article 21", "art 21", "art. 21", "delai sinistre", "délai sinistre", "5 jours"],
    definition: "Obligation légale incombant à l'assuré ou aux bénéficiaires d'aviser l'assureur de tout sinistre (décès, accident, hospitalisation) dès qu'ils en ont connaissance, et au plus tard dans un délai légal de 5 jours ouvrés.",
    legalBasis: "Article 21 du Code CIMA.",
    bankApplication: "Pour les garanties de prévoyance SUNU Bank (Protect Plus, Secure Compte, Sérénité), la déclaration rapide en agence permet d'activer le versement des fonds sous 48 à 72 heures.",
    concreteExample: "En cas d'hospitalisation d'urgence suite à un accident de circulation, les proches avisent SUNU Bank sous 5 jours avec le certificat d'admission hospitalière.",
    relatedProducts: ["Protect Plus", "Secure Compte", "Sérénité", "Prévoyance Moov"]
  },
  {
    id: "LEX-REG-CRCA",
    term: "Commission Régionale de Contrôle (CRCA)",
    category: "Réglementation",
    aliases: ["crca", "commission regionale de controle", "commission régionale de contrôle", "gendarme des assurances", "autorite de controle"],
    definition: "Organe juridictionnel et de supervision supranational institué par le Traité CIMA, chargé de veiller à la solvabilité des compagnies d'assurance, d'agréer les produits et dirigeants, et de protéger les droits des souscripteurs dans les 14 États membres.",
    legalBasis: "Traité CIMA (Libreville) & Statuts de la CRCA.",
    bankApplication: "Garantit que SUNU Assurances Vie Togo dispose des réserves prudentielles nécessaires pour honorer 100% de ses engagements de capitaux garantis auprès des clients SUNU Bank.",
    concreteExample: "La CRCA effectue des audits réguliers pour s'assurer que les provisions mathématiques de vos contrats de retraite sont rigoureusement cantonnées et sécurisées.",
    relatedProducts: ["Régulation de l'ensemble du marché bancassurance au Togo"]
  },

  // ── 2. Actuariat & Littératie Financière (6 termes) ─────────────────────────
  {
    id: "LEX-ACT-TMG",
    term: "Taux d'Intérêt Technique Garanti (TMG)",
    category: "Actuariat",
    aliases: ["tmg", "taux technique", "taux d'interet technique", "taux d'intérêt technique", "taux minimum garanti", "3,5%", "3.5%"],
    definition: "Taux d'intérêt actuariel minimal fixé par la réglementation CIMA (réglementé à 3,5% net/an) que l'assureur a l'obligation légale de servir sur l'épargne constituée, garantissant l'absence totale de perte en capital.",
    legalBasis: "Décision du Conseil des Ministres des Assurances (CMA) de la CIMA.",
    bankApplication: "Sur Visa Études, Horizon Retraite et Épargne Bonus chez SUNU Bank Togo, votre capital progresse chaque année à hauteur de 3,5% minimum, sans aucun aléa boursier.",
    concreteExample: "Si vous placez 1 000 000 FCFA, l'assureur garantit au minimum 35 000 FCFA d'intérêts nets sur l'année, qui s'ajoutent à votre capital de façon définitive.",
    relatedProducts: ["Visa Études", "Visa Études Plus", "Horizon Retraite", "Épargne Bonus", "Sérénité"]
  },
  {
    id: "LEX-ACT-PM",
    term: "Provision Mathématique (PM)",
    category: "Actuariat",
    aliases: ["provision mathematique", "provision mathématique", "pm", "reserve mathematique", "réserve mathématique"],
    definition: "Réserve financière légale inscrite au passif du bilan de l'assureur pour garantir à 100% et à tout moment le paiement futur des capitaux garantis ou rentes dus aux souscripteurs.",
    legalBasis: "Articles 334 et suivants du Code CIMA.",
    bankApplication: "SUNU Bank Togo et SUNU Assurances Vie couvrent 100% de ces provisions par des actifs souverains (obligations du Trésor togolais et de l'UEMOA) certifiés.",
    concreteExample: "La valeur de rachat de votre contrat d'assurance vie après 3 ans correspond à la provision mathématique constituée, déduction faite des frais de rachat légaux (max 5%).",
    relatedProducts: ["Horizon Retraite", "Visa Études", "Épargne Bonus", "Sérénité"]
  },
  {
    id: "LEX-ACT-TABLES",
    term: "Tables de Mortalité CIMA (TD/TF 88-90)",
    category: "Actuariat",
    aliases: ["tables de mortalite", "tables de mortalité", "td/tf", "td 88", "tf 88", "table de survie"],
    definition: "Tables biométriques statistiques agréées par la CIMA mesurant les probabilités de décès (TD 88/90) et de survie (TF 88/90) des assurés de la zone francophone africaine, servant de socle actuariel au calcul des primes et des rentes.",
    legalBasis: "Réglementation actuarielle CIMA Livre I.",
    bankApplication: "Permet de tarifer au juste prix les contrats prévoyance et de calculer avec précision les rentes d'éducation (Visa Études) et rentes de retraite (Horizon Retraite).",
    concreteExample: "La table TF 88-90 détermine le montant exact de la rente viagère mensuelle qu'un cadre de 60 ans percevra à vie chez SUNU Bank à partir de son capital constitué.",
    relatedProducts: ["Horizon Retraite", "Visa Études Plus", "Protect Plus", "Secure Compte"]
  },
  {
    id: "LEX-ACT-CAPITALISATION",
    term: "Capitalisation Actuarielle",
    category: "Actuariat",
    aliases: ["capitalisation actuarielle", "capitalisation", "interets composes", "intérêts composés"],
    definition: "Mécanisme financier où les primes nettes versées produisent des intérêts annuels composés au TMG de 3,5%, lesquels génèrent à leur tour de nouveaux intérêts au fil des années, majorés de la participation aux bénéfices.",
    legalBasis: "Code CIMA Livre I (Contrats de capitalisation et d'épargne vie).",
    bankApplication: "Permet aux clients de SUNU Bank Togo de faire fructifier une petite épargne régulière pour atteindre des montants importants à terme grâce à la durée.",
    concreteExample: "En versant 25 000 FCFA/mois pendant 15 ans sur Horizon Retraite (4,5 millions FCFA versés), la capitalisation génère plus de 6,1 millions FCFA de capital garanti à terme.",
    relatedProducts: ["Horizon Retraite", "Horizon Retraite 5", "Visa Études", "Épargne Bonus"]
  },
  {
    id: "LEX-ACT-BONUS-FID",
    term: "Bonus de Fidélité Actuariel",
    category: "Actuariat",
    aliases: ["bonus de fidelite", "bonus de fidélité", "bonus fidelite", "bonus 92%", "bonus 92"],
    definition: "Majoration financière contractuelle octroyée à l'échéance au souscripteur ayant maintenu son contrat sans interruption ni rachat. Chez SUNU Bank Togo, ce bonus atteint 92% de la première annuité de cotisation sur Horizon Retraite pour toute durée >= 10 ans.",
    legalBasis: "Conditions générales du contrat Horizon Retraite visées par la CRCA.",
    bankApplication: "Récompense exceptionnelle réservée aux épargnants fidèles de SUNU Bank Togo pour valoriser la préparation de leur retraite.",
    concreteExample: "Pour une cotisation de 25 000 FCFA/mois (1ère annuité de 300 000 FCFA), SUNU Bank vous verse un bonus cash supplémentaire de 276 000 FCFA (92%) à l'échéance.",
    relatedProducts: ["Horizon Retraite"]
  },
  {
    id: "LEX-ACT-CHARGEMENT",
    term: "Frais de Chargement",
    category: "Actuariat",
    aliases: ["frais de chargement", "chargement", "frais de gestion", "frais d'acquisition", "frais sur primes"],
    definition: "Quotes-parts réglementées prélevées sur chaque prime pour rémunérer la distribution commerciale (frais d'acquisition bancassurance) et couvrir la gestion administrative et comptable du contrat par l'assureur.",
    legalBasis: "Note technique actuarielle déposée auprès de la CRCA.",
    bankApplication: "Intégrés de manière transparente dès le départ : ils sont déduits de la prime brute pour obtenir la prime pure d'épargne qui capitalise au TMG de 3,5%.",
    concreteExample: "Sur votre bulletin de souscription SUNU Bank, la décomposition entre prime d'épargne, prime de risque décès et frais de chargement est explicitement indiquée.",
    relatedProducts: ["Tous les contrats de bancassurance vie"]
  },

  // ── 3. Contrat, Prévoyance & Sinistres (10 termes) ──────────────────────────
  {
    id: "LEX-CON-AVANCE",
    term: "Avance sur Police",
    category: "Contrat",
    aliases: ["avance sur police", "avance", "pret sur police", "prêt sur police", "emprunt sur contrat"],
    definition: "Prêt à taux modéré consenti par l'assureur au souscripteur, garanti par le nantissement de sa provision mathématique, lui permettant d'obtenir des liquidités d'urgence sans résilier son contrat ni perdre son ancienneté.",
    legalBasis: "Article 75 du Code CIMA.",
    bankApplication: "Chez SUNU Bank, un client ayant au moins 2 ans d'ancienneté sur Horizon Retraite peut demander une avance pour financer un projet imprévu sans rompre son épargne.",
    concreteExample: "Vous disposez de 2 000 000 FCFA d'épargne : l'assureur peut vous consentir une avance de 1 200 000 FCFA à taux préférentiel remboursable sous 12 à 24 mois.",
    relatedProducts: ["Horizon Retraite", "Visa Études", "Sérénité"]
  },
  {
    id: "LEX-CON-REDUCTION",
    term: "Réduction du Contrat",
    category: "Contrat",
    aliases: ["reduction du contrat", "réduction du contrat", "mise en reduction", "mise en réduction", "arret des cotisations"],
    definition: "Opération permettant à un souscripteur qui ne peut ou ne veut plus payer ses cotisations périodiques (après au moins 2 ans) de conserver son contrat actif sans rachat, pour un capital garanti réduit proportionnel aux primes versées.",
    legalBasis: "Article 74 et 75 du Code CIMA.",
    bankApplication: "Alternative idéale au rachat : si vos revenus baissent temporairement, SUNU Bank maintient votre contrat en vigueur et votre capital réduit continue de capitaliser.",
    concreteExample: "Souscripteur sur 15 ans, Koffi cesse ses cotisations après 7 ans : son contrat est 'mis en réduction' et il percevra son capital constitué à la 15e année sans pénalité.",
    relatedProducts: ["Horizon Retraite", "Visa Études", "Épargne Bonus"]
  },
  {
    id: "LEX-CON-RENTE-VIAGERE",
    term: "Rente Viagère Réversible",
    category: "Contrat",
    aliases: ["rente viagere", "rente viagère", "rente reversible", "rente réversible", "rente mensuelle", "pension viagere"],
    definition: "Revenu régulier garanti versé à vie à l'assuré à compter de sa retraite. La clause de réversibilité prévoit qu'en cas de décès du retraité, la rente continue d'être versée au conjoint survivant (à 60% ou 100%).",
    legalBasis: "Code CIMA Livre I (Assurance sur la vie - Rentes viagères).",
    bankApplication: "Option de sortie majeure d'Horizon Retraite chez SUNU Bank Togo, assurant une sécurité financière absolue jusqu'au dernier jour.",
    concreteExample: "À 60 ans, M. Lawson transforme son capital constitué de 15 millions FCFA en une rente viagère de 95 000 FCFA/mois réversible à 100% sur son épouse.",
    relatedProducts: ["Horizon Retraite", "Sérénité"]
  },
  {
    id: "LEX-CON-RENTE-ORPH",
    term: "Rente d'Orphelinat Immédiate",
    category: "Contrat",
    aliases: ["rente d'orphelinat", "rente d'orphelinat immédiate", "orphelinat", "rente enfant", "rente etudes deces"],
    definition: "Prestation prévoyance spécifique et exclusive de Visa Études Plus. Dès le décès du parent souscripteur, une rente régulière est versée immédiatement à l'enfant orphelin pour son entretien jusqu'au début de ses études universitaires.",
    legalBasis: "Garantie prévoyance adossée agréée CRCA / Code CIMA.",
    bankApplication: "Permet de protéger l'enfant sans attendre le terme prévu du contrat, garantissant qu'il ne quittera pas l'école suite au décès de son parent.",
    concreteExample: "Si un parent souscripteur de Visa Études Plus décède quand son enfant a 8 ans, l'enfant perçoit immédiatement une allocation trimestrielle jusqu'à ses 18 ans, date où commence en plus le versement des bourses d'études !",
    relatedProducts: ["Visa Études Plus"]
  },
  {
    id: "LEX-CON-CLAUSE-BENEF",
    term: "Clause Bénéficiaire",
    category: "Contrat",
    aliases: ["clause beneficiaire", "clause bénéficiaire", "designation beneficiaire", "désignation bénéficiaire", "beneficiaire deces"],
    definition: "Stipulation contractuelle par laquelle le souscripteur désigne la ou les personnes qui recevront le capital garanti en cas de décès de l'assuré. En droit CIMA, ce capital ne fait pas partie de la succession de l'assuré et échappe aux créanciers.",
    legalBasis: "Articles 60 à 68 du Code CIMA.",
    bankApplication: "Chez SUNU Bank, la rédaction de la clause bénéficiaire est soignée avec le conseiller (mention nominative ou standard 'mon conjoint, à défaut mes enfants nés ou à naître').",
    concreteExample: "Le capital de 5 000 000 FCFA versé aux enfants désignés dans la clause est payé directement sans attendre le règlement successoral ni payer de droits de succession.",
    relatedProducts: ["Tous les contrats de bancassurance vie"]
  },
  {
    id: "LEX-CON-BENEF-ACCEPT",
    term: "Bénéficiaire Acceptant",
    category: "Contrat",
    aliases: ["beneficiaire acceptant", "bénéficiaire acceptant", "acceptation beneficiaire", "clause irrevocable"],
    definition: "Bénéficiaire ayant formellement notifié son acceptation du contrat avec l'accord du souscripteur. Dès cette acceptation, la clause devient irrévocable : le souscripteur ne peut plus modifier les bénéficiaires ni demander de rachat sans l'accord écrit du bénéficiaire.",
    legalBasis: "Article 68 du Code CIMA.",
    bankApplication: "Mesure de haute sécurité juridique : SUNU Bank exige la signature du bénéficiaire acceptant pour toute demande de modification ultérieure du contrat.",
    concreteExample: "Une banque désignée bénéficiaire acceptante pour garantir un crédit immobilier empêche l'emprunteur de racheter son contrat d'assurance vie sans remboursement du prêt.",
    relatedProducts: ["Horizon Retraite", "Visa Études", "Secure Compte"]
  },
  {
    id: "LEX-CON-CARENCE",
    term: "Délai de Carence (Stage d'attente)",
    category: "Contrat",
    aliases: ["delai de carence", "délai de carence", "stage d'attente", "carence", "stage d'attente maladie"],
    definition: "Période initiale après la souscription pendant laquelle les garanties ne sont pas encore applicables en cas de maladie. En droit CIMA, le délai de carence est STRICTEMENT EXCLU en cas d'accident corporel direct (couverture immédiate).",
    legalBasis: "Dispositions contractuelles CIMA Livre I et Livre VII.",
    bankApplication: "Sur Protect Plus et Secure Compte, en cas d'accident de la route, la garantie décès ou hospitalisation fonctionne dès la première minute, sans aucun délai de carence.",
    concreteExample: "Un souscripteur blessé dans un accident 3 jours après avoir souscrit Protect Plus bénéficie immédiatement de la prise en charge hospitalière de 250 000 FCFA.",
    relatedProducts: ["Protect Plus", "Secure Compte", "Prévoyance Moov"]
  },
  {
    id: "LEX-CON-IAD",
    term: "Invalidité Absolue et Définitive (IAD)",
    category: "Contrat",
    aliases: ["iad", "invalidite absolue et definitive", "invalidité absolue et définitive", "perte totale d'autonomie"],
    definition: "Incapacité physique ou mentale totale et irréversible constatée médicalement, rendant l'assuré inapte à tout travail rémunéré et nécessitant l'assistance permanente d'une tierce personne pour les actes élémentaires de la vie (se laver, se nourrir, se déplacer).",
    legalBasis: "Réglementation CIMA sur les assurances de personnes.",
    bankApplication: "Déclenche par anticipation le paiement intégral du capital prévu en cas de décès et libère le souscripteur du paiement des cotisations futures.",
    concreteExample: "Sur Visa Études, en cas d'IAD du parent, SUNU Assurances prend en charge 100% des primes restantes et maintient le capital complet pour les études de l'enfant.",
    relatedProducts: ["Visa Études", "Visa Études Plus", "Protect Plus", "Secure Compte", "Horizon Retraite"]
  },
  {
    id: "LEX-CON-EXCLUSION",
    term: "Exclusion de Garantie",
    category: "Contrat",
    aliases: ["exclusion de garantie", "exclusion", "non couvert", "exclusions legales"],
    definition: "Événements ou circonstances expressément exclus de la couverture par le Code CIMA ou les conditions générales du contrat, déchargeant l'assureur de toute obligation d'indemnisation.",
    legalBasis: "Article 63 (Suicide au cours de la 1ère année), Article 20 (Faute intentionnelle), Risques de guerre.",
    bankApplication: "Les exclusions sont obligatoirement rédigées en caractères gras et très apparents dans les documents contractuels SUNU Bank Togo remis au client.",
    concreteExample: "Le suicide intervenant au cours de la première année de contrat est exclu par la loi CIMA (remboursement limité à la provision mathématique constituée).",
    relatedProducts: ["Tous les contrats de bancassurance vie SUNU Bank"]
  },
  {
    id: "LEX-CON-DECHEANCE",
    term: "Déchéance de Garantie",
    category: "Contrat",
    aliases: ["decheance de garantie", "déchéance de garantie", "decheance", "perte de garantie"],
    definition: "Sanction contractuelle privant l'assuré de son droit à indemnisation après la survenance d'un sinistre, consécutive au manquement délibéré à une obligation contractuelle (fausse déclaration intentionnelle ou déclaration tardive frauduleuse ayant causé un préjudice).",
    legalBasis: "Article 18 et Article 21 du Code CIMA.",
    bankApplication: "SUNU Bank veille à l'accompagnement loyal de ses clients pour éviter toute situation de déchéance par simple négligence.",
    concreteExample: "Un assuré qui produit de fausses factures médicales ou dissimule sciemment les circonstances réelles d'un sinistre encourt la déchéance de garantie.",
    relatedProducts: ["Protect Plus", "Secure Compte", "Sérénité"]
  },

  // ── 4. Bancassurance & Inclusion Financière Togo (7 termes) ─────────────────
  {
    id: "LEX-BAN-INTEGREE",
    term: "Bancassurance Intégrée",
    category: "Bancassurance",
    aliases: ["bancassurance integree", "bancassurance intégrée", "bancassurance", "partenariat sunu bank"],
    definition: "Partenariat stratégique et capitalistique permettant à SUNU Bank Togo de commercialiser sous mandat exclusif les contrats d'assurance vie de SUNU Assurances Vie Togo, avec prélèvements bancaires automatisés et guichet unique en agence.",
    legalBasis: "Code CIMA Livre V (Intermédiaires d'assurance) & Conventions bancaires UMOA.",
    bankApplication: "Offre aux clients de SUNU Bank Togo la commodité de gérer au même endroit leur compte bancaire, leurs crédits et leurs contrats d'assurance vie dans 28 agences.",
    concreteExample: "Votre cotisation Horizon Retraite de 25 000 FCFA est automatiquement débitée chaque mois de votre compte salaire SUNU Bank sans frais de virement.",
    relatedProducts: ["Tous les 8 contrats SUNU Bank Togo"]
  },
  {
    id: "LEX-BAN-MICRO",
    term: "Micro-assurance (Livre VII CIMA)",
    category: "Bancassurance",
    aliases: ["micro-assurance", "micro assurance", "livre vii", "livre 7", "reglement 003/cima/2012"],
    definition: "Régime juridique dérogatoire instauré par le Livre VII du Code CIMA et le Règlement n° 003/CIMA/2012 pour favoriser l'inclusion financière des ménages modestes, artisans et commerçants du secteur informel grâce à des primes modiques et des formalités allégées.",
    legalBasis: "Livre VII du Code CIMA & Règlement n° 003/CIMA/2012.",
    bankApplication: "Matérialisé par Protect Plus (dès 500 F/mois) et Épargne Moov chez SUNU Bank : souscription sans bilan médical lourd et indemnisation rapide.",
    concreteExample: "Une revendeuse du grand marché de Lomé souscrit Protect Plus pour 500 FCFA/mois et bénéficie d'une garantie de 150 000 FCFA en cas d'hospitalisation accidentelle.",
    relatedProducts: ["Protect Plus", "Épargne Moov", "Prévoyance Moov"]
  },
  {
    id: "LEX-BAN-MOOV",
    term: "Épargne Mobile Money (Moov Money)",
    category: "Bancassurance",
    aliases: ["epargne moov", "épargne moov", "moov money", "mobile money", "assurance mobile"],
    definition: "Solution d'assurance vie 100% digitale issue du partenariat entre SUNU Assurances Vie Togo et Moov Africa Togo, permettant de souscrire, cotiser et être indemnisé directement via son portefeuille mobile Moov Money sans compte bancaire classique.",
    legalBasis: "Réglementation micro-assurance CIMA Livre VII et monnaie électronique BCEAO.",
    bankApplication: "Ouvre l'assurance vie à toute la population togolaise, y compris dans les zones rurales non couvertes par les agences bancaires traditionnelles.",
    concreteExample: "Vous composez la syntaxe USSD sur votre téléphone portable pour épargner 1 000 FCFA par mois sur votre compte Moov Money et participez aux tirages au sort trimestriels.",
    relatedProducts: ["Épargne Moov", "Prévoyance Moov"]
  },
  {
    id: "LEX-BAN-TIRAGE",
    term: "Tirage au Sort Trimestriel",
    category: "Bancassurance",
    aliases: ["tirage au sort", "tirages au sort", "tirage trimestriel", "loterie assurance", "gain par anticipation"],
    definition: "Dispositif actuariel et réglementaire appliqué aux contrats de capitalisation à tirages (Épargne Bonus SUNU et Épargne Moov). Le souscripteur gagnant au tirage national touche immédiatement l'intégralité du capital prévu au terme et est dispensé du paiement des cotisations restantes !",
    legalBasis: "Code CIMA Livre I (Contrats d'épargne avec tirages au sort autorisés par la CRCA).",
    bankApplication: "Supervisé par un huissier de justice agréé au Togo pour garantir une équité absolue entre tous les souscripteurs.",
    concreteExample: "Ayant souscrit Épargne Bonus pour un capital à terme de 2 000 000 FCFA sur 10 ans, Yao est tiré au sort à la 2e année : il reçoit immédiatement 2 000 000 FCFA et ne paie plus aucun sou pendant les 8 années restantes !",
    relatedProducts: ["Épargne Bonus SUNU", "Épargne Moov"]
  },
  {
    id: "LEX-BAN-SERENITE",
    term: "Capital Obsèques d'Urgence (Sérénité)",
    category: "Bancassurance",
    aliases: ["capital obseques", "capital obsèques", "serenite obseques", "sérénité obsèques", "frais funeraires", "frais funéraires"],
    definition: "Prestation prévoyance d'assistance funéraire du contrat Sérénité prévoyant le déblocage prioritaire et garanti sous 24 à 48 heures des fonds nécessaires aux dépenses d'inhumation, préservant la dignité de la famille sans endettement.",
    legalBasis: "Garantie d'assurance de personnes du Code CIMA.",
    bankApplication: "Procédure d'urgence simplifiée en agence SUNU Bank Togo sur simple présentation du certificat de décès et de la pièce d'identité du bénéficiaire désigné.",
    concreteExample: "Au décès de l'assuré, sa famille perçoit immédiatement 1 500 000 FCFA en agence pour organiser les obsèques dignement sans attendre le règlement de la succession.",
    relatedProducts: ["Sérénité"]
  },
  {
    id: "LEX-BAN-KYC",
    term: "Diagnostic de Convenance KYC (Art. 6)",
    category: "Bancassurance",
    aliases: ["diagnostic de convenance", "kyc", "devoir de conseil", "convenance patrimoniale", "profilage client"],
    definition: "Obligation déontologique et légale (fondée sur l'Article 6 du Code CIMA) imposant au banquier-assureur de mener un questionnaire d'évaluation patrimoniale préalable (revenus, capacité d'épargne, horizon temporel, besoins familiaux) avant de recommander un contrat d'assurance vie adapté.",
    legalBasis: "Article 6 du Code CIMA & Instructions professionnelles de la CRCA.",
    bankApplication: "Le conseiller SUNU Bank Togo ne vous fait jamais souscrire au hasard : il analyse votre projet (retraite, études des enfants, santé) pour calibrer la cotisation exacte.",
    concreteExample: "Pour un jeune cadre de 30 ans avec deux enfants en bas âge, le conseiller orientera en priorité vers Visa Études pour les enfants et Horizon Retraite pour son avenir.",
    relatedProducts: ["Tous les contrats SUNU Bank Togo"]
  },
  {
    id: "LEX-BAN-IPDCP",
    term: "Protection des Données (IPDCP Togo)",
    category: "Bancassurance",
    aliases: ["ipdcp", "protection des donnees", "protection des données", "loi 2019-014", "donnees personnelles", "données personnelles"],
    definition: "Conformité obligatoire à la loi togolaise n° 2019-014 du 29 octobre 2019 relative à la protection des données à caractère personnel, encadrant la collecte, le traitement et la stricte confidentialité des données médicales et financières des souscripteurs en agence SUNU Bank.",
    legalBasis: "Loi n° 2019-014 (République Togolaise) & Instance de Protection des Données à Caractère Personnel (IPDCP Togo).",
    bankApplication: "Vos informations médicales (questionnaire de santé) et bancaires sont strictement protégées par le secret bancaire et médical et ne sont jamais transmises à des tiers non autorisés.",
    concreteExample: "Les questionnaires de santé remplis pour Secure Compte ou Protect Plus sont scellés et traités uniquement par le médecin-conseil de la compagnie d'assurance.",
    relatedProducts: ["Tous les contrats de bancassurance SUNU Bank Togo"]
  }
];

export function findLexiconAnswer(query: string): string | null {
  const norm = query.toLowerCase().trim();

  // Extraction du terme si envoyé depuis "Poser au bot" : « ... »
  const quoteMatch = norm.match(/«\s*(.*?)\s*»/) || norm.match(/"\s*(.*?)\s*"/);
  const targetTerm = quoteMatch ? quoteMatch[1].trim() : norm;

  // Recherche par correspondance exacte ou alias
  for (const entry of CIMA_LEXICON_DATABASE) {
    const entryTermNorm = entry.term.toLowerCase();
    const entryIdNorm = entry.id.toLowerCase();

    const isDirectTermMatch = targetTerm.includes(entryTermNorm) || entryTermNorm.includes(targetTerm);
    const isIdMatch = targetTerm.includes(entryIdNorm);
    const isAliasMatch = entry.aliases.some(alias => {
      const a = alias.toLowerCase();
      return norm.includes(a) || targetTerm.includes(a);
    });

    if (isDirectTermMatch || isIdMatch || isAliasMatch) {
      return (
`## 📜 Fiche Officielle CIMA : ${entry.term}\n\n` +
`> **Catégorie :** ${entry.category} • **Cadre réglementaire :** ${entry.legalBasis}\n\n` +
`### 1. Définition Juridique & Réglementaire\n` +
`${entry.definition}\n\n` +
`### 2. Application Pratique chez SUNU Bank Togo\n` +
`${entry.bankApplication}\n\n` +
`### 3. Exemple Concret pour le Souscripteur\n` +
`💡 *${entry.concreteExample}*\n\n` +
`### 4. Produits Associés dans notre Portefeuille\n` +
`📌 ${entry.relatedProducts.map(p => `**${p}**`).join(', ')}\n\n` +
`---\n\n` +
`*Conformément aux normes de la Conférence Interafricaine des Marchés d'Assurances (CIMA) harmonisées dans les 14 États membres de la zone franc. Nos conseillers en agence SUNU Bank Togo sont à votre entière disposition pour vous guider.*`
      );
    }
  }

  // Si c'est une question générale sur le Code CIMA ou la réglementation
  if (norm.includes("code cima") || norm.includes("reglementation") || norm.includes("réglementation") || norm.includes("glossaire") || norm.includes("litteratie") || norm.includes("littératie")) {
    return (
`## 🏛️ Code des Assurances CIMA & Réglementation Officielle\n\n` +
`Le **Code CIMA** (Conférence Interafricaine des Marchés d'Assurances) est le corpus juridique unique et harmonisé régissant le secteur des assurances dans les **14 États membres** de la zone franc d'Afrique de l'Ouest et Centrale (dont le **Togo**).\n\n` +
`### ⚖️ Les 7 Articles Piliers régissant vos contrats chez SUNU Bank Togo :\n\n` +
`1. **Article 6 (Information précontractuelle)** : Obligation de remise de la fiche d'information détaillée avant signature.\n` +
`2. **Article 65-1 (Encadré légal standardisé)** : Résumé obligatoire en tête de contrat mentionnant la durée, les garanties et les frais.\n` +
`3. **Article 74 (Valeur de rachat)** : Rachat strictement interdit avant **2 ans** de cotisations effectives.\n` +
`4. **Article 76 (Faculté de renonciation)** : Droit de rétractation de **30 jours calendaires** avec remboursement intégral à 100% sans frais.\n` +
`5. **Article 76 (Plafonnement des frais de rachat)** : Indemnité de sortie plafonnée à **5% max** de la provision mathématique, et **0% après 10 ans**.\n` +
`6. **Article 84 (Participation aux bénéfices)** : Obligation de redistribuer au moins **85%** des bénéfices financiers annuels aux épargnants.\n` +
`7. **Article 28 (Prescription biennale)** : Délai légal de **2 ans** pour toute réclamation ou action en justice dérivant du contrat.\n\n` +
`Vous pouvez me demander une explication approfondie sur n'importe lequel des **32 termes du glossaire** (ex : *« Explique-moi l'Article 74 »*, *« Qu'est-ce que le TMG ? »*, *« C'est quoi la rente d'orphelinat ? »*).`
    );
  }

  return null;
}

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

export function doesProductMatchNeed(docId: string, need: string): boolean {
  if (need === "education") return docId.includes("EDUCATION") || docId.includes("EDUPRO");
  if (need === "retraite") return docId.includes("RETRAITE") || docId.includes("RET5");
  if (need === "retraite_courte") return docId.includes("RET5");
  if (need === "sante_accident") return docId.includes("PROTPLUS") || docId.includes("SECCOMPTE");
  if (need === "epargne_tirages") return docId.includes("BONUS") || docId.includes("DIGMOOV");
  if (need === "compte_bancaire") return docId.includes("SECCOMPTE");
  if (need === "mobile_money") return docId.includes("DIGMOOV");
  if (need === "obseques") return docId.includes("SERENITE");
  return false;
}

export function buildComparativeAdvice(
  prodA: any,
  prodB: any,
  compAmount: number,
  compDur: number,
  userQuery: string
): string {
  const norm = (userQuery || "").toLowerCase();

  const mapKey = (docId: string) => {
    if (docId.includes("EDUCATION")) return "visa_etudes";
    if (docId.includes("EDUPRO")) return "visa_etudes_plus";
    if (docId.includes("RET5")) return "horizon_retraite_5";
    if (docId.includes("RETRAITE")) return "horizon_retraite";
    if (docId.includes("BONUS")) return "epargne_bonus";
    if (docId.includes("PROTPLUS")) return "protect_plus";
    if (docId.includes("SECCOMPTE")) return "secure_compte";
    if (docId.includes("DIGMOOV")) return "epargne_moov";
    return "serenite";
  };

  const simA = computeActuarialSimulation(mapKey(prodA.id), compAmount, compDur);
  const simB = computeActuarialSimulation(mapKey(prodB.id), compAmount, compDur);

  // Détection du besoin prioritaire (en isolant le besoin explicite ou en retirant les noms des produits)
  let detectedNeed = "general";
  let needTitle = "Votre Projet d'Assurance Vie";

  let queryForNeed = norm;
  const needMatch = norm.match(/(?:besoin(?:s)?|objectif(?:s)?|projet)\s*(?:prioritaire)?\s*[:\s«"']+\s*([^»"'\n.]+)/i);
  if (needMatch && needMatch[1]) {
    queryForNeed = needMatch[1].toLowerCase();
  } else {
    // Retirer les noms des produits pour éviter qu'un mot comme "études" dans "Visa Études" n'écrase le besoin réel
    queryForNeed = norm
      .replace(new RegExp((prodA.title || "").toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "g"), "")
      .replace(new RegExp((prodB.title || "").toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "g"), "")
      .replace(/\b(?:visa\s+)?(?:études|etudes)(?:\s+plus)?\b/gi, "")
      .replace(/\bhorizon\s+retraite(?:\s+5)?\b/gi, "")
      .replace(/\b(?:épargne|epargne)\s+bonus\b/gi, "")
      .replace(/\bprotect\s+plus\b/gi, "")
      .replace(/\bsecure\s+compte\b/gi, "")
      .replace(/\b(?:épargne|prevoyance)\s+moov\b/gi, "")
      .replace(/\bsérénité\b|\bserenite\b/gi, "");
  }

  if (queryForNeed.includes("santé") || queryForNeed.includes("sante") || queryForNeed.includes("accident") || queryForNeed.includes("hospital") || queryForNeed.includes("maladie")) {
    detectedNeed = "sante_accident";
    needTitle = "Couverture santé, accident et frais d'hospitalisation";
  } else if (queryForNeed.includes("retraite 5") || queryForNeed.includes("ret5") || queryForNeed.includes("court") || queryForNeed.includes("senior")) {
    detectedNeed = "retraite_courte";
    needTitle = "Retraite accélérée sur 5 ans pour cadre / senior";
  } else if (queryForNeed.includes("retraite") || queryForNeed.includes("horizon") || queryForNeed.includes("pension") || queryForNeed.includes("vieux jour") || queryForNeed.includes("viagere") || queryForNeed.includes("viagère")) {
    detectedNeed = "retraite";
    needTitle = "Préparation de votre retraite et maintien du niveau de vie";
  } else if (queryForNeed.includes("etude") || queryForNeed.includes("étude") || queryForNeed.includes("enfant") || queryForNeed.includes("scolaire") || queryForNeed.includes("education") || queryForNeed.includes("université") || queryForNeed.includes("bourse")) {
    detectedNeed = "education";
    needTitle = "Financement des études et protection de l'avenir de vos enfants";
  } else if (queryForNeed.includes("bonus") || queryForNeed.includes("tirage") || queryForNeed.includes("loterie")) {
    detectedNeed = "epargne_tirages";
    needTitle = "Constitution d'épargne avec opportunité de gains immédiats au tirage";
  } else if (queryForNeed.includes("compte") || queryForNeed.includes("banque") || queryForNeed.includes("decouvert")) {
    detectedNeed = "compte_bancaire";
    needTitle = "Sécurisation de votre compte bancaire et couverture familiale";
  } else if (queryForNeed.includes("moov") || queryForNeed.includes("mobile") || queryForNeed.includes("informel")) {
    detectedNeed = "mobile_money";
    needTitle = "Micro-épargne digitale sans compte bancaire classique";
  } else if (queryForNeed.includes("obseque") || queryForNeed.includes("obsèque") || queryForNeed.includes("deuil") || queryForNeed.includes("funeraire") || queryForNeed.includes("funéraire")) {
    detectedNeed = "obseques";
    needTitle = "Prise en charge digne et urgente des frais d'obsèques (48h)";
  }

  // Arbitrage et Conseil Personnalisé
  let winner = prodA;
  let alternative = prodB;
  let matchScore = "98%";
  let whyWinner: string[] = [];
  let whyAlternative: string[] = [];
  let goldenRule = "";

  const idA = prodA.id;
  const idB = prodB.id;

  // Cas 1 : Visa Études vs Visa Études Plus
  if ((idA.includes("EDUCATION") || idA.includes("EDUPRO")) && (idB.includes("EDUCATION") || idB.includes("EDUPRO"))) {
    const isPlusA = idA.includes("EDUPRO");
    const plusProd = isPlusA ? prodA : prodB;
    const classicProd = isPlusA ? prodB : prodA;

    if (compAmount >= 10000) {
      winner = plusProd;
      alternative = classicProd;
      matchScore = "99% d'adéquation";
      whyWinner = [
        "**Rente d'orphelinat immédiate** : Dès le décès éventuel du parent souscripteur, l'enfant perçoit immédiatement une allocation régulière pour son quotidien, *sans attendre ses 18 ans ni le début de ses études universitaires*.",
        "**Doublement du capital en cas de décès accidentel** : Si le décès fait suite à un accident corporel, le capital garanti au terme pour les études de l'enfant est automatiquement doublé !",
        "**Exonération totale des cotisations restantes** : SUNU Assurances Vie prend en charge 100% des primes jusqu'au terme prévu.",
        "**Bourses trimestrielles d'études sécurisées** : Versement échelonné sur 4 ans (16 trimestres) pour payer les frais universitaires sans risque de dilapidation."
      ];
      whyAlternative = [
        `Si votre capacité d'épargne mensuelle est inférieure à 10 000 FCFA : **${classicProd.title}** est accessible dès **4 250 FCFA/mois** et garantit déjà l'exonération des cotisations en cas d'accident avec un capital garanti au TMG 3,5%.`
      ];
      goldenRule = `Pour votre budget de ${compAmount.toLocaleString('fr-FR')} FCFA/mois (≥ 10 000 FCFA), **${plusProd.title}** est le meilleur choix absolu : la rente d'orphelinat immédiate assure que votre enfant poursuivra sa scolarité même en cas de disparition brutale.`;
    } else {
      winner = classicProd;
      alternative = plusProd;
      matchScore = "97% d'adéquation";
      whyWinner = [
        "**Accessibilité maximale** : Cotisation plancher dès **4 250 FCFA/mois**, idéale pour un effort d'épargne régulier et soutenable sans peser sur le budget familial.",
        "**Protection prévoyance incluse** : Exonération intégrale des cotisations restantes par l'assureur en cas de décès ou d'Invalidité Absolue et Définitive (IAD) du parent.",
        "**Taux Minimum Garanti CIMA de 3,5% net/an** majoré de la participation aux bénéfices de l'Article 84.",
        "**Souplesse de sortie** : Choix entre un capital unique en une seule fois ou des rentes trimestrielles scolaires."
      ];
      whyAlternative = [
        `Si vous pouvez porter votre effort d'épargne à au moins 10 000 FCFA/mois : **${plusProd.title}** vous fera bénéficier en plus de la rente d'orphelinat immédiate et du doublement accidentel.`
      ];
      goldenRule = `Avec une capacité d'épargne inférieure à 10 000 FCFA/mois, **${classicProd.title}** est le contrat rationnel pour sécuriser l'avenir scolaire de votre enfant sans compromettre votre équilibre financier.`;
    }
  }
  // Cas 2 : Horizon Retraite vs Horizon Retraite 5
  else if ((idA.includes("RETRAITE") || idA.includes("RET5")) && (idB.includes("RETRAITE") || idB.includes("RET5"))) {
    const isRet5A = idA.includes("RET5");
    const ret5Prod = isRet5A ? prodA : prodB;
    const longProd = isRet5A ? prodB : prodA;

    if (compDur <= 5 || detectedNeed === "retraite_courte") {
      winner = ret5Prod;
      alternative = longProd;
      matchScore = "98% d'adéquation";
      whyWinner = [
        "**Horizon court et ferme de 5 ans** : Conçu sur mesure pour les cadres et seniors à 5 ans de la retraite, évitant un engagement contraignant sur 10 ou 15 ans.",
        "**Capitalisation accélérée garantie** au TMG CIMA de 3,5% net l'an.",
        "**Transmission intégrale** du capital constitué aux bénéficiaires désignés en cas de décès avant l'échéance des 5 ans."
      ];
      whyAlternative = [
        `Si vous avez 10 ans ou plus devant vous : **${longProd.title}** est nettement plus rémunérateur grâce à son bonus de fidélité de 92% de la 1ère annuité et son option de rente viagère réversible à vie.`
      ];
      goldenRule = `À moins de 5 ans de votre départ à la retraite, choisissez **${ret5Prod.title}** pour faire fructifier vos disponibilités rapidement sans pénalité de rachat.`;
    } else {
      winner = longProd;
      alternative = ret5Prod;
      matchScore = "99% d'adéquation";
      whyWinner = [
        "**Bonus de fidélité exceptionnel de 92%** : Pour toute durée ≥ 10 ans sans rachat, SUNU Bank vous octroie un bonus de 92% de l'intégralité de vos cotisations de la 1ère année !",
        "**Rente viagère réversible à vie** : Sécurité absolue jusqu'au dernier jour, avec option de réversion (à 60% ou 100%) sur votre conjoint en cas de décès.",
        "**Intérêts composés au TMG 3,5%** + distribution obligatoire d'au moins 85% des bénéfices financiers (Art. 84 Code CIMA)."
      ];
      whyAlternative = [
        `Si vous devez impérativement récupérer votre capital dans 5 ans : orientez-vous vers **${ret5Prod.title}**.`
      ];
      goldenRule = `Sur un horizon de 10 ans ou plus, **${longProd.title}** est imbattable : le bonus de fidélité de 92% amplifie votre épargne de manière unique sur le marché togolais.`;
    }
  }
  // Cas 3 : Protect Plus vs Secure Compte
  else if ((idA.includes("PROTPLUS") || idA.includes("SECCOMPTE")) && (idB.includes("PROTPLUS") || idB.includes("SECCOMPTE"))) {
    const isProtA = idA.includes("PROTPLUS");
    const protProd = isProtA ? prodA : prodB;
    const secProd = isProtA ? prodB : prodA;

    if (detectedNeed === "sante_accident" || compAmount <= 1500) {
      winner = protProd;
      alternative = secProd;
      matchScore = "97% d'adéquation";
      whyWinner = [
        "**Indemnité d'hospitalisation accidentelle** : Prise en charge forfaitaire de 150 000 à 250 000 FCFA dès 5 jours consécutifs d'hospitalisation.",
        "**Capital décès / accident immédiat** de 500 000 à 1 000 000 FCFA versé aux proches.",
        "**Tarif ultra-accessible** dès 500 FCFA/mois sans formalité médicale lourde (Livre VII CIMA)."
      ];
      whyAlternative = [
        `Si vous avez un compte bancaire SUNU Bank et recherchez un capital décès plus important (jusqu'à 5 000 000 FCFA) : **${secProd.title}** est plus approprié.`
      ];
      goldenRule = `Pour vous protéger contre les frais d'hospitalisation et accidents quotidiens avec une prime minime, **${protProd.title}** est le bouclier indispensable.`;
    } else {
      winner = secProd;
      alternative = protProd;
      matchScore = "96% d'adéquation";
      whyWinner = [
        "**Capital de prévoyance élevé** (jusqu'à 5 000 000 FCFA) versé immédiatement aux proches en cas de décès ou d'invalidité.",
        "**Sécurisation directe du compte bancaire** et des engagements en agence SUNU Bank Togo.",
        "**Prélèvement automatisé** simplifié adossé à la gestion de compte."
      ];
      whyAlternative = [
        `Si vous voulez en plus une indemnité hospitalière en cas d'accident corporel : complétez avec **${protProd.title}**.`
      ];
      goldenRule = `Pour les clients bancarisés voulant laisser un capital substantiel à leur famille, **${secProd.title}** est le choix de référence.`;
    }
  }
  // Cas 3bis : Besoin Santé / Accident & Hospitalisation alors que les produits choisis sont des contrats d'épargne ou éducation (ex: Épargne Bonus vs Visa Études Plus)
  else if (detectedNeed === "sante_accident" && !idA.includes("PROTPLUS") && !idB.includes("PROTPLUS")) {
    const hasAccidentGuar = (id: string) => id.includes("EDUPRO") || id.includes("EDUCATION") || id.includes("SECCOMPTE");
    const isAAccident = hasAccidentGuar(idA);
    const isBAccident = hasAccidentGuar(idB);

    if (isAAccident && !isBAccident) {
      winner = prodA;
      alternative = prodB;
    } else if (isBAccident && !isAAccident) {
      winner = prodB;
      alternative = prodA;
    } else {
      winner = simA.guaranteedCapital >= simB.guaranteedCapital ? prodA : prodB;
      alternative = winner.id === prodA.id ? prodB : prodA;
    }

    matchScore = "88% (Alerte Prévoyance Santé & Accident)";
    whyWinner = [
      `**Garantie Accident & Prévoyance supérieure** : ${winner.id.includes("EDUPRO") ? "Intègre le **doublement du capital garanti en cas de décès accidentel** du souscripteur et le versement d'une **rente d'orphelinat immédiate** pour sécuriser les enfants." : (winner.benefits[1] || winner.benefits[0])}`,
      `**Exonération des cotisations en cas d'IAD/Décès** : Si un accident entraîne une invalidité absolue et définitive, l'assureur prend en charge toutes les primes restantes et le capital complet est versé à terme.`,
      `**Constitution d'un capital garanti CIMA (3,5% net/an)** : Épargne progressive disponible dès 2 ans de cotisations (Art. 74 CIMA) pour faire face aux coups durs.`
    ];
    whyAlternative = [
      `**${alternative.title}** n'offre **aucune couverture accident ni santé**. C'est un pur contrat de capitalisation financière (Livre I CIMA) dont le seul atout est le tirage au sort semestriel pouvant anticiper le gain de l'épargne.`
    ];
    goldenRule = `Entre ces deux produits, **${winner.title}** est le choix rationnel car il contient une vraie protection en cas d'accident grave (doublement du capital). **🚨 ALERTE DÉONTOLOGIQUE MAJEURE DU CONSEILLER SUNU BANK** : Sachez que ni **${prodA.title}** ni **${prodB.title}** ne prennent en charge les **frais médicaux d'hospitalisation** (forfait séjour, soins). Pour être véritablement couvert en cas de maladie ou d'hospitalisation, vous devez impérativement compléter votre souscription avec **Protect Plus** (dès 500 à 1 000 FCFA/mois, jusqu'à 250 000 FCFA d'indemnité d'hospitalisation accidentelle dès 5 jours consécutifs + capital décès accidentel d'1 000 000 FCFA) !`;
  }
  // Cas 4 : Cas Général selon le besoin détecté
  else {
    const matchA = doesProductMatchNeed(idA, detectedNeed);
    const matchB = doesProductMatchNeed(idB, detectedNeed);

    if (matchA && !matchB) {
      winner = prodA;
      alternative = prodB;
      matchScore = "98% d'adéquation";
      whyWinner = [
        `**Spécifiquement conçu pour ${needTitle}** : ${prodA.benefits[0] || prodA.title}.`,
        `**Prestations adaptées** : ${prodA.benefits[1] || prodA.category}.`,
        `**Garanties CIMA** : ${prodA.yield || "Taux technique garanti 3,5% net/an"}.`
      ];
      whyAlternative = [
        `**${prodB.title}** est un contrat de catégorie ${prodB.category}, orienté vers : ${prodB.benefits[0] || 'un autre objectif d\'épargne'}.`
      ];
      goldenRule = `Pour votre objectif prioritaire (${needTitle}), **${prodA.title}** répond exactement au cahier des charges, tandis que **${prodB.title}** répond à une finalité différente.`;
    } else if (matchB && !matchA) {
      winner = prodB;
      alternative = prodA;
      matchScore = "98% d'adéquation";
      whyWinner = [
        `**Spécifiquement conçu pour ${needTitle}** : ${prodB.benefits[0] || prodB.title}.`,
        `**Prestations adaptées** : ${prodB.benefits[1] || prodB.category}.`,
        `**Garanties CIMA** : ${prodB.yield || "Taux technique garanti 3,5% net/an"}.`
      ];
      whyAlternative = [
        `**${prodA.title}** est un contrat de catégorie ${prodA.category}, orienté vers : ${prodA.benefits[0] || 'un autre objectif d\'épargne'}.`
      ];
      goldenRule = `Pour votre objectif prioritaire (${needTitle}), **${prodB.title}** répond exactement au cahier des charges, tandis que **${prodA.title}** est axé sur un autre besoin.`;
    } else {
      if (simA.guaranteedCapital >= simB.guaranteedCapital) {
        winner = prodA;
        alternative = prodB;
      } else {
        winner = prodB;
        alternative = prodA;
      }
      matchScore = "95% d'adéquation";
      whyWinner = [
        `**Performance actuarielle** : Offre une prestation / capital garanti estimé plus élevé pour les paramètres choisis.`,
        `**Atout clé** : ${winner.benefits[0]}.`
      ];
      whyAlternative = [
        `**${alternative.title}** se distingue par : ${alternative.benefits[1] || alternative.benefits[0]}.`
      ];
      goldenRule = `Arbitrez selon votre préférence de sortie : privilégiez **${winner.title}** si vous visez le capital maximal garanti, ou **${alternative.title}** si vous préférez ses garanties annexes.`;
    }
  }

  const durationNotice = compDur > 15
    ? `> ⚠️ **Observation Réglementaire CIMA sur la durée de ${compDur} ans demandée** :\n> Ni **${prodA.title}** (durée max 15 ans) ni **${prodB.title}** (durée max 15 ans) ne prévoient de terme à ${compDur} ans dans leurs conditions générales CIMA. Chez SUNU Bank Togo, pour un horizon de ${compDur} ans, le contrat de référence est **Horizon Retraite** (5 à 25 ans avec bonus de fidélité de 92%). Pour cette comparaison, la projection ci-dessous est donc calculée sur la durée maximale contractuelle autorisée de **15 ans** *(soit ${simA.durationYears} ans)*.\n\n`
    : "";

  // Formatage de la réponse officielle
  return (
`## ⚖️ Analyse Comparative & Conseil CIMA : ${prodA.title} vs ${prodB.title}\n\n` +
`> 🎯 **Objectif analysé :** ${needTitle} • **Simulation retenue :** ${compAmount.toLocaleString('fr-FR')} FCFA/mois sur ${compDur} an(s)\n\n` +
`${durationNotice}` +
`### 📊 1. Tableau Comparatif Synthétique\n\n` +
`| Critère d'évaluation | **${prodA.title}** | **${prodB.title}** |\n` +
`|---|---|---|\n` +
`| **Catégorie de contrat** | ${prodA.category} | ${prodB.category} |\n` +
`| **Cotisation d'entrée** | ${prodA.startingPrice} | ${prodB.startingPrice} |\n` +
`| **Durée contractuelle** | ${prodA.duration} | ${prodB.duration} |\n` +
`| **Rendement Garanti CIMA** | ${prodA.yield || "Tarif garanti Livre VII"} | ${prodB.yield || "Tarif garanti Livre VII"} |\n` +
`| **Prestations garanties** | ${prodA.benefits[0]} | ${prodB.benefits[0]} |\n` +
`| **Couverture Prévoyance** | ${prodA.benefits[2] || prodA.benefits[1]} | ${prodB.benefits[2] || prodB.benefits[1]} |\n` +
`| **Spécificité exclusive** | ${prodA.benefits[1] || prodA.benefits[0]} | ${prodB.benefits[1] || prodB.benefits[0]} |\n\n` +
`---\n\n` +
`### 💰 2. Simulation Chiffrée en Direct (Base : ${compAmount.toLocaleString('fr-FR')} FCFA/mois sur ${compDur} ans)\n\n` +
`- **${prodA.title}** : Total cotisé de **${simA.totalContributed.toLocaleString('fr-FR')} FCFA** ➔ Prestation / Capital garanti à terme : **${simA.guaranteedCapital.toLocaleString('fr-FR')} FCFA** ${simA.fidelityBonus ? `*(dont bonus fidélité 92% : +${simA.fidelityBonus.toLocaleString('fr-FR')} FCFA)*` : ""}.\n` +
`- **${prodB.title}** : Total cotisé de **${simB.totalContributed.toLocaleString('fr-FR')} FCFA** ➔ Prestation / Capital garanti à terme : **${simB.guaranteedCapital.toLocaleString('fr-FR')} FCFA** ${simB.fidelityBonus ? `*(dont bonus fidélité 92% : +${simB.fidelityBonus.toLocaleString('fr-FR')} FCFA)*` : ""}.\n\n` +
`---\n\n` +
`### 🎯 3. VERDICT DU CONSEILLER SUNU BANK (Pour bien choisir selon votre besoin)\n\n` +
`#### ⭐ NOTRE RECOMMANDATION OFFICIELLE : **${winner.title}** (${matchScore})\n\n` +
`**Pourquoi choisir ${winner.title} pour votre projet ?**\n` +
whyWinner.map(r => `- ${r}`).join('\n') + `\n\n` +
`**Dans quel cas préférer plutôt ${alternative.title} ?**\n` +
whyAlternative.map(r => `- ${r}`).join('\n') + `\n\n` +
`💡 **La Règle d'Or pour décider :**\n` +
`> *${goldenRule}*\n\n` +
`---\n\n` +
`### 📜 4. Vos Garanties Légales selon le Code CIMA\n\n` +
`- **Droit de renonciation de 30 jours (Art. 76)** : Vous pouvez renoncer au contrat par lettre recommandée sous 30 jours calendaires après signature avec remboursement intégral à 100% sans frais.\n` +
`- **Valeur de rachat (Art. 74)** : Le rachat est interdit avant 2 ans de cotisations effectives (ou 15% des primes prévues) pour les contrats de capitalisation.\n` +
`- **Plafonnement des frais de rachat (Art. 76)** : Indemnité plafonnée à un maximum strict de 5% de la provision mathématique, et 0% au-delà de 10 ans.\n` +
`- **Participation aux bénéfices (Art. 84)** : Redistribution légale minimale obligatoire d'au moins 85% des bénéfices financiers réalisés par l'assureur.\n\n` +
`*Conformément à l'Article 6 du Code CIMA, ce comparatif précontractuel loyal et transparent a pour but de vous éclairer. Votre conseiller SUNU Bank Togo est à votre entière disposition dans l'une de nos 28 agences pour éditer votre proposition d'assurance définitive.*`
  );
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

// API Network Info Endpoint (Pour test en salle via Smartphone / QR Code)
app.get("/api/network-info", (_req: Request, res: Response) => {
  const localIp = getLocalNetworkIp();
  const port = Number(process.env.PORT || 3000);
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
1. Réponds avec rigueur professionnelle, clarté et exactitude en citant systématiquement le nom du produit et son identifiant (ex : [PROD-EP-EDUCATION]).
2. Mentionne toujours les montants minimaux exacts, la durée, le taux minimum garanti réglementaire de 3,5% l'an (Code CIMA), les garanties prévoyance et le droit de renonciation de 30 jours (Art. 76 CIMA).
3. Si la question est une demande de calcul ou de simulation, donne le total cotisé et le capital garanti estimé.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
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
    const docsContext = JSON.stringify({
      products: SUNU_KNOWLEDGE_DOCUMENTS,
      cima_lexicon: CIMA_LEXICON_DATABASE
    }, null, 2);

    if (ai) {
      try {
        const systemInstruction = `Tu es le Conseiller Bancassurance Senior et Concierge Financier officiel de SUNU Bank Togo.
Ton rôle est d'accompagner les clients et chargés de clientèle avec expertise, amabilité, rigueur juridique et clarté sur l'ensemble du portefeuille de bancassurance vie conforme au Code CIMA.

Base documentaire certifiée SUNU Bank Togo (Produits officiels et Glossaire CIMA des 32 termes) :
${docsContext}

${simulationData ? `DONNÉES ACTUARIELLES OFFICIELLES CALCULÉES POUR CETTE SIMULATION :
${JSON.stringify(simulationData, null, 2)}
-> Tu DOIS impérativement intégrer ces chiffres exacts dans ta réponse pour donner une simulation financière claire, structurée et précise au client.` : ""}

Directives strictes :
1. TON : Haut de gamme, courtois, pédagogue, digne d'un conseiller bancassurance de référence à Lomé.
2. CONFORMITÉ CODE CIMA : Rappelle toujours l'Article 6 (information précontractuelle loyale), le droit de renonciation de 30 jours (Art. 76) et le fait que la simulation précontractuelle est indicative et finalisée avec le conseiller en agence.
3. SI LE CLIENT DEMANDE UNE SIMULATION OU DES CHIFFRES : Détaille le total cotisé, le capital garanti au terme avec le taux technique garanti de 3,5% l'an (Code CIMA), les spécificités (Bonus de fidélité 92% pour Horizon Retraite, rentes trimestrielles d'éducation pour Visa Études, tirages au sort pour Épargne Bonus/Moov, capitaux pour Protect Plus/Secure Compte).
4. CITE LES ARTICLES DU CODE CIMA (Art. 6, 74, 76, 84, 21, 28, etc.).
5. GLOSSAIRE & RÉGLEMENTATION CIMA : Si le client pose une question sur un article du Code CIMA ou un terme du glossaire (ex: Article 6, Article 74, Article 76, Article 84, TMG, Provision Mathématique, Rente d'orphelinat, CRCA, Avance, Réduction, etc.), réponds de manière approfondie, pédagogique et structurée en donnant la définition, le fondement légal, l'application concrète chez SUNU Bank Togo et un exemple.
6. COMPARAISONS ET AIDE À LA DÉCISION / CONSEIL PERSONNALISÉ : Si le client demande de comparer deux produits (ex: « Compare Visa Études et Visa Études Plus » ou « Aide-moi à choisir selon mon besoin ») :
- Compare-les réellement sur tous les critères CIMA (objectifs, cotisations minimales, durées, rendements 3,5% TMG, capitaux garantis avec bonus, garanties prévoyance orphelinat/décès/accident, règles de rachat Art. 74 et 76).
- Calcule ou intègre les chiffres exacts (total cotisé, capital garanti à terme, rentes éventuelles).
- ANALYSE LE BESOIN EXPRIMÉ DU CLIENT (financer les études, retraite long terme vs courte, protection immédiate de la famille, micro-épargne, tirages au sort, budget modeste).
- CONSEILLE FORMELLEMENT LE CLIENT POUR QU'IL CHOISISSE CE QUI EST MIEUX POUR LUI :
  * Désigne clairement le produit recommandé n°1 et explique POURQUOI ce contrat est objectivement supérieur pour son besoin.
  * Précise l'alternative : dans quel cas ou pour quel type de client l'autre contrat est plus pertinent.
  * Formule une règle de décision limpide pour trancher immédiatement.
  * Rappelle les garanties légales CIMA (Art. 6 information précontractuelle, Art. 76 renonciation 30 jours, Art. 74 rachat après 2 ans).`;

        let modelName = process.env.GOOGLE_LLM_MODEL || "gemini-3.6-flash";
        if (modelName.includes("2.0") || modelName.includes("2.5")) modelName = "gemini-3.6-flash";

        const response = await ai.models.generateContent({
          model: modelName,
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
        console.warn("Gemini API error in chat, using deterministic response:", genError);
      }
    }

    // ── Fallback Déterministe Certifié CIMA ───────────────────────────────────────

    // 1. Comparaison universelle multi-produits & Conseil Personnalisé (Prioritaire absolu sur le comparateur)
    const normalized = message.toLowerCase();
    const isComparison = normalized.includes("compar") || normalized.includes("versus") ||
      normalized.includes("vs ") || normalized.includes(" vs") || normalized.includes("différen") ||
      normalized.includes("differen") || normalized.includes("entre") || normalized.includes("choisir") ||
      normalized.includes("lequel") || normalized.includes("meilleur") ||
      (normalized.includes("conseil") && (normalized.includes("visa") || normalized.includes("horizon") || normalized.includes("retraite") || normalized.includes("protect") || normalized.includes("bonus") || normalized.includes("etude") || normalized.includes("étude")));

    if (isComparison) {
      // Détection ordonnée des produits mentionnés dans le message
      interface ProductMatch {
        product: any;
        index: number;
      }
      const matches: ProductMatch[] = [];

      const checkMatch = (regex: RegExp, prod: any) => {
        const m = normalized.match(regex);
        if (m && m.index !== undefined) {
          if (!matches.some(item => item.product.id === prod.id)) {
            matches.push({ product: prod, index: m.index });
          }
        }
      };

      // Visa Études Plus
      checkMatch(/\b(?:visa\s+)?(?:études|etudes)\s+plus\b|\bedupro\b/i, SUNU_KNOWLEDGE_DOCUMENTS[1]);
      // Visa Études classique (si pas Plus)
      if (!matches.some(item => item.product.id === "PROD-EP-EDUPRO")) {
        checkMatch(/\b(?:visa\s+)?(?:études|etudes)(?!\s+plus)\b/i, SUNU_KNOWLEDGE_DOCUMENTS[0]);
      }
      // Horizon Retraite 5
      checkMatch(/\b(?:horizon\s+)?retraite\s+5\b|\bhorizon\s+5\b|\bret5\b/i, SUNU_KNOWLEDGE_DOCUMENTS[3]);
      // Horizon Retraite classique
      if (!matches.some(item => item.product.id === "PROD-EP-RET5")) {
        checkMatch(/\bhorizon\s+retraite\b|\bhorizon\b|\bretraite\b/i, SUNU_KNOWLEDGE_DOCUMENTS[2]);
      }
      // Épargne Bonus
      checkMatch(/\b(?:épargne|epargne)\s+bonus\b|\bbonus\s+sunu\b|\bbonus\b/i, SUNU_KNOWLEDGE_DOCUMENTS[4]);
      // Protect Plus (mot-clé explicite 'protect' pour ne pas capturer le simple besoin santé)
      checkMatch(/\bprotect\s+plus\b|\bprotect\b|\bmicro-assurance\s+santé\b/i, SUNU_KNOWLEDGE_DOCUMENTS[5]);
      // Secure Compte
      checkMatch(/\bsecure\s+compte\b|\bseccompte\b/i, SUNU_KNOWLEDGE_DOCUMENTS[6]);
      // Épargne Moov
      checkMatch(/\b(?:épargne|epargne)\s+moov\b|\bdigmoov\b/i, SUNU_KNOWLEDGE_DOCUMENTS[7]);
      // Prévoyance Moov
      checkMatch(/\b(?:prévoyance|prevoyance)\s+moov\b/i, SUNU_KNOWLEDGE_DOCUMENTS[8]);
      // Sérénité
      checkMatch(/\bsérénité\b|\bserenite\b|\bobsèques\b|\bobseques\b/i, SUNU_KNOWLEDGE_DOCUMENTS[9]);

      // Trier selon l'ordre d'apparition dans le message de l'utilisateur
      matches.sort((a, b) => a.index - b.index);

      let prodA = matches[0]?.product || SUNU_KNOWLEDGE_DOCUMENTS[0];
      let prodB = matches[1]?.product;
      if (!prodB) {
        if (prodA.id === "PROD-EP-EDUCATION") prodB = SUNU_KNOWLEDGE_DOCUMENTS[1];
        else if (prodA.id === "PROD-EP-EDUPRO") prodB = SUNU_KNOWLEDGE_DOCUMENTS[0];
        else if (prodA.id === "PROD-EP-RETRAITE") prodB = SUNU_KNOWLEDGE_DOCUMENTS[3];
        else if (prodA.id === "PROD-EP-RET5") prodB = SUNU_KNOWLEDGE_DOCUMENTS[2];
        else if (prodA.id === "PROD-EP-BONUS") prodB = SUNU_KNOWLEDGE_DOCUMENTS[1];
        else if (prodA.id === "PROD-PR-PROTPLUS") prodB = SUNU_KNOWLEDGE_DOCUMENTS[6];
        else prodB = SUNU_KNOWLEDGE_DOCUMENTS[2];
      }

      // Extraction d'éventuels montants et durées demandés
      let compAmount = 20000;
      const matchAmt = normalized.match(/(\d[\d\s]*\d|\d+)\s*(?:fcfa|f\b|francs?)/i) || normalized.match(/(?:cotis\w*|montant|avec)\s*(?:de\s*)?(\d[\d\s]*\d|\d+)/i);
      if (matchAmt) {
        const parsed = parseInt(matchAmt[1].replace(/\s+/g, ""), 10);
        if (!isNaN(parsed) && parsed >= 500) compAmount = parsed;
      }
      let compDur = 10;
      const matchDur = normalized.match(/(\d+)\s*(?:ans?|années?)/i);
      if (matchDur) {
        const parsed = parseInt(matchDur[1], 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 35) compDur = parsed;
      }

      const comparativeAnswer = buildComparativeAdvice(prodA, prodB, compAmount, compDur, message);

      return res.json({
        reply: comparativeAnswer,
        structuredData: null
      });
    }

    // 2. Détection Terme du Glossaire ou Réglementation CIMA (32 termes)
    const lexiconAnswer = findLexiconAnswer(message);
    if (lexiconAnswer) {
      return res.json({
        reply: lexiconAnswer,
        structuredData: null
      });
    }

    // 3. Détection simulation financière précontractuelle
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
