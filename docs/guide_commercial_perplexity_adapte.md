# Guide adapté — Configurer le bot RAG comme un commercial SUNU Bank Togo

**Source :** Recherches Perplexity (guide générique chatbot bancassurance)  
**Adapté à :** `Projet/` — Assistant RAG SUNU Bank Togo (LangChain + ChromaDB + Streamlit)  
**Date :** 2026-08-20

Ce document mappe chaque section du guide Perplexity vers le code du projet, signale ce qui
existait déjà et ce qui a été ajouté, et explique comment l'utiliser et l'évaluer.

---

## 1. Le prompt système (persona)

**Guide Perplexity :** un prompt système unique avec rôle, style, contraintes, structure de réponse.

**État dans le projet :** déjà implémenté dans `src/generation/prompts.py` (`SYSTEM_PROMPT`),
injecté dans la chaîne par `src/generation/rag_chain.py`.

**Ce qui a été renforcé :**
- **Structure de présentation d'un produit** en 5 points (nom/objectif, garanties, cotisation,
  prestation/échéance, prochaine étape), avec interdiction de calculer des projections chiffrées
  absentes du contexte.
- **Framework d'objection** complet (Écouter → Diagnostiquer → Répondre → Prouver → Confirmer →
  Avancer) avec des exemples de réponses par objection, ancrés uniquement sur des faits du corpus
  (5 000 FCFA/mois, taux minimum garanti 3,5 %, renonciation 30 jours).
- **Section Closing** : ne jamais terminer une réponse sans prochaine étape.

**Fichier à modifier :** `Projet/src/generation/prompts.py`

---

## 2. Le flux de conversation

**Guide Perplexity :** Accueil/Découverte → Présentation du produit → Objections → Closing.

**État dans le projet :**
- Découverte : présente dans le prompt (`QUESTIONS DE DÉCOUVERTE`).
- Présentation : désormais structurée (voir §1).
- Objections : désormais détectées comme intention dédiée (voir §3).
- Closing : imposé par le prompt.

**Détection d'intention ajoutée** dans `src/intents/intent_classifier.py` :
`detect_objection()` identifie 4 types d'objections et `detect_intent()` les retourne en priorité
après le hors-périmètre et la demande de conseiller :

| Intention | Exemple de déclencheur | Label |
|---|---|---|
| `objection_prix` | « C'est trop cher », « je n'ai pas les moyens » | Objection sur le prix |
| `objection_confiance` | « pas confiance », « c'est une arnaque » | Objection sur la confiance |
| `objection_timing` | « je dois réfléchir », « pas le temps » | Objection sur le timing |
| `objection_concurrence` | « j'ai déjà une assurance » | Objection concurrence existante |

Ces intentions ne déclenchent PAS d'escalade (`INTENT_ESCALATE` inchangé) : le bot doit y
répondre lui-même avec le framework d'objection du prompt.

---

## 3. La gestion des objections

**Guide Perplexity :** framework Listen → Diagnose → Respond → Prove → Confirm → Advance.

**Adaptation projet :**
- Le framework est écrit dans `SYSTEM_PROMPT` (section `GESTION DES OBJECTIONS`).
- La détection programmatique est dans `src/intents/intent_classifier.py`.
- La réponse au framework est mesurée par `objection_handled()` (voir §4).

**Différence assumée avec le guide :** le guide suggère des « preuves » type témoignages
(« Mme K. a commencé avec 5 000 FCFA/mois ») ou des chiffres de sinistres payés. Ces éléments
ne figurent pas dans le corpus du projet : **interdits** par la règle 1 du prompt. Les preuves
autorisées sont les faits documentaires (montants minimaux, taux garanti, garanties, renonciation 30 jours).

---

## 4. Évaluation du comportement commercial

**Guide Perplexity :** métrique RAGAS `ton_commercial` + checklist manuelle.

**Adaptation projet :** nouveau module `src/evaluation/commercial_metrics.py`, sans dépendance
LLM (règles lexicales, exécution locale rapide) :

- `ton_commercial(response)` → score [0, 1] : accueil, citation de source, question de
  découverte/closing, prochaine étape, longueur adaptée.
- `objection_handled(question, response)` → score [0, 1] du framework d'objection.
- `run_commercial_evaluation(chain, retriever, questions)` → agrégats + détail par question,
  écrit dans `data/evaluation/commercial_evaluation.json`.

**Lancement :**

```bash
cd Projet
python main.py eval-commercial            # toutes les questions de test
python main.py eval-commercial --limit 5  # échantillon rapide
```

**Checklist manuelle** (à reporter dans le mémoire) pour chaque conversation test :

- [ ] Le bot s'est présenté comme conseiller SUNU Bank Togo
- [ ] Il a posé des questions de découverte avant de recommander
- [ ] Il a cité ses sources documentaires
- [ ] Il a géré les objections avec empathie (validation → question → fait → étape suivante)
- [ ] Il a proposé une prochaine étape claire
- [ ] Il n'a pas inventé d'information (pas de projection chiffrée hors contexte)
- [ ] Il a orienté vers un conseiller humain si nécessaire

---

## 5. Exemple de conversation attendu (aligné sur le corpus réel)

**Client :** « C'est trop cher pour moi. »  
**Bot attendu :**

> Je comprends tout à fait votre préoccupation. Quand vous dites « trop cher », vous voulez
> dire par rapport à votre budget mensuel ou par rapport à d'autres produits que vous avez vus ?
>
> Selon la fiche produit, la cotisation minimale de Visa Études est de **5 000 FCFA par mois**,
> avec un taux minimum garanti de **3,5 %**. En cas de décès ou d'invalidité, les cotisations
> restantes sont prises en charge par l'assureur.
>
> Est-ce que cela répond à votre préoccupation ? Souhaitez-vous que je vous mette en relation
> avec un conseiller pour une simulation adaptée à votre budget ?

---

## 6. Correspondance guide Perplexity → projet

| Élément du guide | Fichier du projet | Statut |
|---|---|---|
| Prompt système (persona, style, contraintes) | `src/generation/prompts.py` | Déjà présent, renforcé |
| Questions de découverte | `SYSTEM_PROMPT` → `QUESTIONS DE DÉCOUVERTE` | ✅ |
| Structure de présentation produit | `SYSTEM_PROMPT` → `STRUCTURE DE PRÉSENTATION D'UN PRODUIT` | Ajouté |
| Framework d'objection | `SYSTEM_PROMPT` + `src/intents/intent_classifier.py` | Ajouté |
| Closing systématique | `SYSTEM_PROMPT` → `CLOSING` | ✅ |
| Refus hors périmètre | `src/intents/intent_classifier.py` + `src/escalation/escalation.py` | ✅ existant |
| Escalade vers conseiller | `src/escalation/escalation.py` + `ESCALATION_MESSAGE` | ✅ existant |
| Métrique `ton_commercial` | `src/evaluation/commercial_metrics.py` | Ajouté |
| Checklist manuelle | `data/evaluation/user_questionnaire.md` + §4 de ce guide | ✅ existant |

**Intégration technique RAG (Option 3 du guide)** : la chaîne `src/generation/rag_chain.py`
correspond exactement au modèle LangChain « Role-Based Prompting with RAG » (system message +
contexte + question), avec citation des sources via `format_docs()`.

---

## 7. Test de non-régression

```bash
cd Projet
python -m pytest tests/ -q
ruff check src tests main.py
```