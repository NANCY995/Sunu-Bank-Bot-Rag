# Architecture

Assistant conversationnel RAG pour l'accompagnement précontractuel à la compréhension
des produits d'assurance vie en bancassurance (SUNU Bank Togo).

## Vue d'ensemble

```
+----------------------------+        +----------------------------+
|   Interface Streamlit      |        |   API REST FastAPI (/api)  |
|   (portail agent, :8502)   |<------>|   (port 8000)              |
|   src/ui/                  |        |   src/api/                 |
+----------------------------+        +------+---------------------+
                                              |
                              +---------------+---------------+
                              |               |               |
                      +-------+----+   +------+------+  +-----+------+
                      | Pipeline   |   | Modèles ML  |  | Persistance|
                      | RAG        |   | scikit-learn|  | SQLite     |
                      +------------+   | provisioning|  | data/      |
                                       | churn/fraud |  | sunu_portal|
                                       +-------------+  +------------+
```

## Pipeline RAG

```
Question client
      |
      v
IntentClassifier (13 intentions + détection d'objection)
      |
      v
Retriever (ChromaDB, embeddings multilingues, top_k) --> EscalationChecker
      |                                                     (hors périmètre)
      v
LLM avec persona commercial (prompts.py : découverte, objections, closing)
      |
      v
Réponse + sources + intention + décision d'escalade
```

LLM : Gemini (via `USE_GOOGLE_LLM=true` dans `.env`) ou Qwen2.5-1.5B local (hors ligne).

## Modules

| Module | Rôle |
|---|---|
| `src/corpus` | Chargement, prétraitement, chunking des documents |
| `src/indexing` | Embeddings + indexation ChromaDB |
| `src/retrieval` | Recherche vectorielle (option : reranking) |
| `src/generation` | LLM, prompts commerciaux, chaîne RAG |
| `src/intents` | Classification d'intention + détection d'objections |
| `src/escalation` | Détection des questions hors périmètre |
| `src/evaluation` | RAGAS, Precision@k, Recall@k, MRR, métriques commerciales |
| `src/api` | API REST FastAPI (auth JWT, dashboard, prédictions, chat RAG) |
| `src/ui` | Portail Streamlit (pages : dashboard, chat, provisioning, churn, fraude, admin) |
| `src/models` | Services de prédiction ML (provisioning, churn, fraude) |
| `app` | Interface Streamlit (point d'entrée) |

## Commandes

- `python main.py index` : indexer le corpus (ChromaDB)
- `python main.py chat` : conversation CLI
- `python main.py eval` : évaluation RAGAS + retrieval
- `python main.py eval-commercial` : évaluation du comportement commercial
- `streamlit run app/app.py` : interface web
- `uvicorn src.api.main:app` : API REST
- `python scripts/seed_portal.py` : peupler la base du portail (données synthétiques)
- `scripts/run_api.bat`, `scripts/run_portal.bat`, `scripts/run_ragas_parallel.bat` : lancement
  sur Windows