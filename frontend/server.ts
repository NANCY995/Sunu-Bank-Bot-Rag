import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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

// SUNU Bank Knowledge Base for RAG Portal
const SUNU_KNOWLEDGE_DOCUMENTS = [
  {
    id: "SUNU-POL-2024-ETUDES",
    title: "Police d'Assurance Visa Études & Mobilité Internationale",
    category: "Assurance Voyage & Santé",
    coverage: "Monde entier (conforme espace Schengen et international)",
    startingPrice: "15 € / mois (ou 10 000 FCFA / mois)",
    benefits: [
      "Prise en charge des frais médicaux d'urgence et d'hospitalisation jusqu'à 30 000 €",
      "Rapatriement sanitaire intégral et assistance médicale 24h/24 et 7j/7",
      "Conformité garantie aux exigences des consulats et visas étudiants (Schengen, Campus France, USA, Canada)",
      "Assurance bagages et responsabilité civile à l'étranger incluse"
    ],
    eligibility: "Étudiants âgés de 16 à 35 ans inscrits dans un établissement d'enseignement supérieur étranger."
  },
  {
    id: "SUNU-CRED-AUTO-2024",
    title: "Conditions Générales Crédit Auto Confort & Véhicule Vert",
    category: "Financement Particuliers",
    rates: "Taux nominal à partir de 6.5% HT, durée jusqu'à 60 mois",
    benefits: [
      "Financement jusqu'à 100% du prix d'achat du véhicule neuf ou occasion récente",
      "Option assurance tous risques packagée avec décote bonifiée",
      "Différé de remboursement initial possible jusqu'à 3 mois",
      "Frais de dossier réduits pour les titulaires de compte salaire SUNU Bank Togo"
    ]
  },
  {
    id: "SUNU-RETRAITE-ZEN-2024",
    title: "Plan Épargne Retraite Zen & Capitalisation Horizon",
    category: "Épargne & Prévoyance",
    yield: "Rendement minimum garanti de 4.25% net + participation aux bénéfices",
    benefits: [
      "Versements libres ou programmés dès 15 000 FCFA / mois",
      "Disponibilité partielle des fonds en cas d'imprévu majeur ou acquisition de résidence principale",
      "Exonération fiscale sur les plus-values après 5 ans de souscription",
      "Garantie décès et rente viagère réversible au conjoint désigné"
    ]
  },
  {
    id: "SUNU-RISK-AML-2024",
    title: "Manuel de Conformité et Gestion des Risques Réglementaires BCEAO/UMOA",
    category: "Sécurité & Risques",
    compliance: "Conformité stricte directives BCEAO, GABAC et GAFI",
    highlights: "Chiffrement AES-256 de bout en bout des transactions bancaires, authentification multi-facteurs obligatoire, traçabilité des accès aux dossiers de crédit."
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), bank: "SUNU Bank Togo" });
  });

  // API RAG Documents List
  app.get("/api/rag/documents", (req, res) => {
    res.json({ documents: SUNU_KNOWLEDGE_DOCUMENTS });
  });

  // API RAG Query Endpoint
  app.post("/api/rag/query", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Requête manquante" });
      }

      const ai = getAIClient();
      const docsContext = JSON.stringify(SUNU_KNOWLEDGE_DOCUMENTS, null, 2);

      if (ai) {
        try {
          const prompt = `Tu es le moteur d'intelligence RAG officiel de SUNU Bank Togo. 
Voici la base documentaire institutionnelle officielle :
${docsContext}

Question de l'analyste / utilisateur : "${query}"

Instructions de réponse :
1. Réponds de façon concise, experte, institutionnelle et structurée.
2. Si applicable, cite les documents de référence avec leur identifiant (ex: [SUNU-POL-2024-ETUDES]).
3. Donne les montants clés, conditions, taux et garanties exactes.
4. Réponds en français (ou dans la langue de la question si demandé).`;

          const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt,
          });

          return res.json({
            answer: response.text,
            sources: SUNU_KNOWLEDGE_DOCUMENTS.filter(d => 
              query.toLowerCase().includes("étude") || query.toLowerCase().includes("visa") ? d.id.includes("ETUDES") :
              query.toLowerCase().includes("auto") || query.toLowerCase().includes("voiture") ? d.id.includes("AUTO") :
              query.toLowerCase().includes("retraite") || query.toLowerCase().includes("épargne") ? d.id.includes("RETRAITE") : true
            )
          });
        } catch (genError) {
          console.warn("Gemini API error in RAG query, falling back to local synthesis:", genError);
        }
      }

      // Fallback response if no Gemini key or network issue
      const normalized = query.toLowerCase();
      let matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[0];
      if (normalized.includes("auto") || normalized.includes("voiture") || normalized.includes("crédit")) {
        matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[1];
      } else if (normalized.includes("retraite") || normalized.includes("épargne")) {
        matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[2];
      } else if (normalized.includes("risque") || normalized.includes("sécurité") || normalized.includes("aml")) {
        matchedDoc = SUNU_KNOWLEDGE_DOCUMENTS[3];
      }

      return res.json({
        answer: `Selon les données indexées dans le RAG Portal [${matchedDoc.id}] :\n\n` +
          `Le produit **${matchedDoc.title}** (${matchedDoc.category}) offre des prestations optimales pour vos clients.\n\n` +
          (matchedDoc.benefits ? matchedDoc.benefits.map(b => `• ${b}`).join("\n") : matchedDoc.highlights || ""),
        sources: [matchedDoc]
      });

    } catch (err: any) {
      console.error("Error in /api/rag/query:", err);
      res.status(500).json({ error: "Erreur lors de l'exécution de la requête RAG" });
    }
  });

  // API Financial Concierge Chat Endpoint
  app.post("/api/concierge/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message manquant" });
      }

      const ai = getAIClient();
      const docsContext = JSON.stringify(SUNU_KNOWLEDGE_DOCUMENTS, null, 2);

      if (ai) {
        try {
          const systemInstruction = `Tu es le Concierge Financier officiel de SUNU Bank Togo (SUNU Financial Concierge). 
Ton rôle est d'accueillir et d'assister avec élégance, clarté, expertise et bienveillance les clients et prospects sur les produits bancaires, assurances et solutions de crédit.

Connaissances produits clés SUNU Bank Togo :
${docsContext}

Directives de réponse :
- Ton : Haut de gamme, courtois, précis, digne d'un concierge bancaire privé.
- Lorsque l'utilisateur s'intéresse à "Visa Études", mets en avant : Couverture médicale jusqu'à 30 000 €, Rapatriement médical 100%, Conformité Visa Schengen / International, Assistance 24/7, à partir de 15 €/mois (ou 10 000 FCFA).
- Pour "Plan Retraite", "Crédit Auto" ou "Assurances", structure clairement les avantages avec des puces.
- Si pertinent, propose une simulation financière chiffrée ou les prochaines étapes de souscription.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: [
              { text: `System Instruction: ${systemInstruction}` },
              ...(conversationHistory || []).map((msg: any) => ({
                text: `${msg.role === 'user' ? 'Client' : 'Concierge'}: ${msg.content}`
              })),
              { text: `Client: ${message}` }
            ]
          });

          return res.json({
            reply: response.text,
            structuredData: message.toLowerCase().includes("visa") || message.toLowerCase().includes("étude") ? {
              product: "Visa Études",
              startingPrice: "€15/mo",
              coverage: "Worldwide",
              benefits: [
                { label: "Medical Coverage", detail: "Up to €30,000 for unexpected medical emergencies and hospitalization abroad." },
                { label: "Repatriation", detail: "Full coverage for medical evacuation or repatriation in severe cases." },
                { label: "Visa Compliance", detail: "Guaranteed to meet Schengen and other major international student visa requirements." },
                { label: "24/7 Assistance", detail: "Multilingual support hotline available around the clock." }
              ]
            } : null
          });
        } catch (genError) {
          console.warn("Gemini API error in chat, using fallback:", genError);
        }
      }

      // Fallback if no Gemini key or API issue
      const normalized = message.toLowerCase();
      if (normalized.includes("visa") || normalized.includes("étude") || normalized.includes("student")) {
        return res.json({
          reply: `Certainement. **Visa Études** est notre assurance voyage et santé complète spécialement conçue pour les étudiants poursuivant leurs études à l'international. C'est une exigence obligatoire pour les demandes de visa étudiant.`,
          structuredData: {
            product: "Visa Études",
            startingPrice: "€15/mo",
            coverage: "Worldwide",
            benefits: [
              { label: "Medical Coverage", detail: "Up to €30,000 for unexpected medical emergencies and hospitalization abroad." },
              { label: "Repatriation", detail: "Full coverage for medical evacuation or repatriation in severe cases." },
              { label: "Visa Compliance", detail: "Guaranteed to meet Schengen and other major international student visa requirements." },
              { label: "24/7 Assistance", detail: "Multilingual support hotline available around the clock." }
            ]
          }
        });
      } else if (normalized.includes("retraite") || normalized.includes("retirement")) {
        return res.json({
          reply: `Notre solution **Plan Épargne Retraite Zen** de SUNU Bank Togo vous permet de vous constituer un capital garanti avec un rendement minimum de 4.25% net annuel, des déductions fiscales attractives et la sécurité du groupe SUNU.`,
          structuredData: {
            product: "Plan Retraite Zen",
            startingPrice: "15 000 FCFA/mo",
            coverage: "Rendement 4.25% net garanti",
            benefits: [
              { label: "Versements Souples", detail: "Versements programmés ou ponctuels selon votre rythme financier." },
              { label: "Sécurité & Rendement", detail: "Participation aux bénéfices financiers de SUNU Assurances." },
              { label: "Avantage Fiscal", detail: "Exonération fiscale intégrale des plus-values à terme." }
            ]
          }
        });
      } else if (normalized.includes("auto") || normalized.includes("voiture") || normalized.includes("car")) {
        return res.json({
          reply: `Avec le **Crédit Auto SUNU Bank**, financez jusqu'à 100% de votre véhicule neuf ou d'occasion avec un taux préférentiel à partir de 6.5% et une durée de remboursement jusqu'à 60 mois.`,
          structuredData: {
            product: "Crédit Auto SUNU",
            startingPrice: "Taux 6.5%",
            coverage: "Jusqu'à 60 mois",
            benefits: [
              { label: "Financement Intégral", detail: "Possibilité de financer 100% de la facture proforma TTC." },
              { label: "Pack Assurance", detail: "Tarif préférentiel sur l'assurance tous risques SUNU." },
              { label: "Réponse Rapide", detail: "Accord de principe sous 48 heures ouvrées." }
            ]
          }
        });
      }

      return res.json({
        reply: `Je suis à votre entière disposition pour vous accompagner dans tous vos projets financiers avec SUNU Bank Togo. Souhaitez-vous des détails sur nos crédits, assurances voyages comme le Visa Études, ou solutions d'épargne ?`
      });

    } catch (err: any) {
      console.error("Error in /api/concierge/chat:", err);
      res.status(500).json({ error: "Erreur lors du traitement du message" });
    }
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SUNU Bank Togo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
