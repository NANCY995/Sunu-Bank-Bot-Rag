# Threat Model : Application SUNU Bank (Assistant RAG & Analytics)

Ce modèle de menace est structuré autour des **4 questions fondamentales du Threat Modeling** recommandées pour le *Secure Vibe Coding* :

---

## 1. Que cherchons-nous à faire ? (What are we trying to do?)
L'application SUNU Bank est une plateforme hybride combinant :
1. **Un Assistant RAG Bancassurance** : Répondre aux questions des clients et agents sur les produits d'épargne, prévoyance et micro-assurance en s'appuyant sur un corpus documentaire validé (Code CIMA, fiches produits).
2. **Un Moteur Prédictif ML** : Estimer le provisionnement mathématique, détecter le risque de résiliation (*churn*) et repérer les transactions anormales (*fraude*).
3. **Une API REST sécurisée (FastAPI)** et un portail d'administration pour la gestion des utilisateurs, des contrats et des audits de conversation.

---

## 2. Qu'est-ce qui peut mal tourner ? (What can go wrong?)

| Vecteur de Risque | Menace Identifiée | Impact | Probabilité |
| :--- | :--- | :--- | :--- |
| **LLM & RAG** | **Denial of Wallet (Déni de portefeuille)** : Requêtes massives automatisées épuisant le quota d'API LLM / ressources GPU. | Élevé (Coût financier, indisponibilité) | Moyenne / Élevée |
| **LLM & RAG** | **Prompt Injection / Jailbreak** : Un utilisateur manipule le prompt pour faire émettre de fausses promesses financières ou faire fuiter des instructions internes. | Élevé (Risque légal CIMA, atteinte à l'image) | Élevée |
| **LLM & RAG** | **Sensitive Information Disclosure** : Révélation de données d'autres clients ou de secrets dans les contextes récupérés. | Critique (RGPD, secret bancaire) | Faible à Moyenne |
| **API & Auth** | **Broken Access Control** : Accès non autorisé à des endpoints sensibles (`/admin/users`, `/predict/portfolio`). | Critique (Élévation de privilèges) | Faible (avec RBAC) |
| **API & Auth** | **Weak Password Hashing** : Compromission de la base SQLite/Postgres exposant les mots de passe si mal hachés. | Élevé (Compromission de comptes) | Moyenne |
| **Supply Chain** | **Dependency Bloat / Slop Squatting** : Inclusion de packages inutiles ou malicieux générés lors de phases de vibe coding sans contrôle. | Critique (RCE, backdoor) | Faible (si audité) |

---

## 3. Comment y remédions-nous ? (How do we fix it?)

### A. Protection contre le Déni de Portefeuille & Abus (Rate Limiting)
- Mise en place d'une limitation de débit (*Rate Limiting*) en mémoire ou via Redis sur les endpoints coûteux (`/api/rag/chat`, `/api/predict/*`).
- Limitation de la taille des requêtes entrantes (`question` limitée à 500 caractères, rejet des chaînes vides).

### B. Cloisonnement du Prompt RAG (Prompt Shielding)
- Balisage strict des données utilisateur : délimiter la question par des balises claires (`<user_query>`) dans le prompt.
- Système d'escalade : Si l'intention est hors périmètre ou si la confiance documentaire est faible, le système refuse poliment et propose un conseiller humain sans exécuter de raisonnement non maîtrisé.

### C. Contrôle d'Accès Homogène (RBAC Stricte)
- Application systématique des dépendances FastAPI :
  - `get_current_user` pour toutes les routes authentifiées.
  - `require_admin` pour la gestion des utilisateurs et la vue globale de portefeuille.

### D. Renforcement Cryptographique & Erreurs
- Hachage de mot de passe renforcé (PBKDF2-HMAC-SHA256 avec sel aléatoire ou `bcrypt`).
- Masquage des détails d'erreurs en production : aucun traceback SQLAlchemy ou chemin local renvoyé dans les réponses HTTP.

---

## 4. Comment avons-nous fait ? (How did we do?)
- **Audits continus** : Exécution de la suite de tests automatisés (`pytest`).
- **Journalisation de conformité** : Chaque conversation RAG est archivée avec son statut d'escalade et son intention pour audit après-coup.
- **Revue de dépendances** : Validation systématique de chaque paquet dans `pyproject.toml` / `requirements.txt`.
