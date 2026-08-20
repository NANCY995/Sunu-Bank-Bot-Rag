# Assistant Conversationnel RAG — SUNU Bank Togo

Assistant conversationnel intelligent basé sur le RAG (Retrieval-Augmented Generation)
pour l'accompagnement précontractuel à la compréhension des produits d'assurance vie
distribués par SUNU Bank Togo, notamment Visa Études, Visa Études Plus et Horizon Retraite.

Le projet comprend :

1. **Le cœur RAG** : corpus, indexation ChromaDB, retrieval, génération (persona
   commercial SUNU Bank, gestion des objections, closing), escalade vers conseiller.
2. **Un portail web** (Streamlit) : tableau de bord, chat RAG, provisioning, churn,
   fraude, analytics, administration.
3. **Une API REST** (FastAPI) : authentification JWT, endpoints RAG, prédictions ML,
   KPIs, administration.
4. **Des modèles ML** de démonstration (provisionnement, churn, détection de fraude)
   entraînés sur données synthétiques reproductibles.

## Installation

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Copier `.env.example` vers `.env` et renseigner les clés API. En mode hors ligne
(recommandé), laisser `USE_LOCAL_LLM=true` et `USE_GOOGLE_LLM=false` : le chat utilise
alors le modèle local Qwen 2.5 (`models/qwen2.5-1.5b-instruct-q4_k_m.gguf`).

## Utilisation

### Cœur RAG

```bash
python main.py index             # indexer le corpus dans la base vectorielle
python main.py chat              # conversation en ligne de commande
python main.py eval-retrieval    # évaluer la recherche documentaire (sans LLM)
python main.py eval              # évaluer le pipeline RAGAS + retrieval
python main.py eval-commercial   # évaluer le comportement commercial (ton, objections)
```

### Interface web (chat simple)

```bash
streamlit run app/app.py
```

### Portail complet (API + UI)

```bash
python scripts/seed_portal.py    # admin + 200 contrats + 400 transactions + modèles
scripts\run_api.bat              # ou : python -m uvicorn src.api.main:app --port 8000
scripts\run_portal.bat           # ou : streamlit run src/ui/portal.py --server.port 8502
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