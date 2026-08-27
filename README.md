# Assistant Conversationnel RAG — SUNU Bank Togo

Assistant conversationnel intelligent basé sur le RAG (Retrieval-Augmented Generation)
pour l'accompagnement précontractuel à la compréhension des produits d'assurance vie
distribués par SUNU Bank Togo, notamment Visa Études, Visa Études Plus et Horizon Retraite.

Le projet comprend :

1. **Le cœur RAG** : corpus, indexation ChromaDB, retrieval, génération (persona commercial SUNU Bank, gestion des objections, closing), escalade vers conseiller.
2. **Un portail web utilisateur moderne** (React / Tailwind / TypeScript dans `frontend/`) : Concierge financier interactif, devis officiel PDF, simulateur de crédit & épargne retraite, mode sombre/clair, authentification.
3. **Une API REST** (FastAPI) : authentification JWT, endpoints RAG, prédictions ML, KPIs, administration.
4. **Des modèles ML** de démonstration (provisionnement, churn, détection de fraude) entraînés sur données synthétiques reproductibles.

## Installation & Démarrage rapide

```bash
# 1. Installer l'environnement Python
.venv\Scripts\activate
pip install -r requirements.txt

# 2. Installer et lancer le portail frontend
cd frontend
bun install
bun run dev
```

### Lancement en un clic (Recommandé)

Double-cliquer sur `scripts/run_all.bat` ou exécuter :
```bash
scripts\run_all.bat
```
Ce script lance simultanément :
- Le Backend FastAPI sur **http://localhost:8000** (Documentation Swagger sur `/docs`)
- Le Portail React sur **http://localhost:3000**

### Lancement manuel

- **Backend FastAPI** :
  ```bash
  python scripts/seed_portal.py    # création admin + données synthétiques
  scripts\run_api.bat              # démarre FastAPI sur http://localhost:8000
  ```
- **Portail React Utilisateur** :
  ```bash
  scripts\run_portal.bat           # démarre React sur http://localhost:3000
  ```

Se connecter avec `admin@sunubank.tg` / `admin1234` (créé par le seed).

### Scripts d'évaluation

```bash
python scripts/ragas_smoke.py --limit 3
python scripts/run_ragas_local.py
python scripts/run_ragas_checkpoint.py --worker A faithfulness,answer_relevancy
python scripts/compute_final_ragas.py
python scripts/eval_chunking.py
python scripts/eval_embeddings.py
python scripts/make_figures.py
```

## Structure

- `data/raw/` : documents du corpus (conditions générales, notices, fiches produits, FAQ)
- `data/processed/` : chunks et base vectorielle ChromaDB
- `data/evaluation/` : jeu de test, questions d'évaluation et résultats
- `src/corpus/` : chargement, prétraitement, découpage des documents
- `src/indexing/` : embeddings et base vectorielle
- `src/retrieval/` : retriever (top-k, seuil) et reranker optionnel
- `src/generation/` : LLM, prompt système (persona commercial), chaîne RAG
- `src/escalation/` : détection d'escalade vers un conseiller humain
- `src/intents/` : classification d'intentions et d'objections
- `src/evaluation/` : RAGAS, métriques de retrieval, métriques commerciales
- `src/api/` : API FastAPI (auth, dashboard, prédictions, admin, rag)
- `src/ui/` : portail Streamlit (thème, client API, pages)
- `src/models/` : modèles ML de démonstration
- `app/` : interface Streamlit simple (chat RAG direct)
- `scripts/` : scripts d'initialisation, d'évaluation et utilitaires
- `notebooks/` : notebooks d'exploration et d'évaluation
- `tests/` : tests unitaires, d'intégration et E2E

## Évaluation

Les notebooks `notebooks/` et les commandes `python main.py eval*` produisent les
scores RAGAS (faithfulness, answer relevancy, context precision, context recall),
les métriques de retrieval (Precision@k, Recall@k, MRR) et le comportement commercial
(ton, gestion des objections) pour le contexte bancassurance togolais.

## Tests

```bash
python -m pytest tests/ -q
ruff check src tests main.py
```

Le guide d'adaptation du comportement commercial est détaillé dans
`docs/guide_commercial_perplexity_adapte.md`.