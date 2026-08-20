# API des modules

## Cœur RAG

### src.corpus

- `loader.load_corpus(data_dir=None) -> list[Document]` : charge les fichiers `.md`
- `preprocessor.preprocess_documents(documents)` : normalise et enrichit les métadonnées
- `chunker.chunk_documents(documents, chunk_size, chunk_overlap)` : découpe en chunks

### src.indexing

- `embeddings.get_embedding_model()` : OpenAI, Google ou Sentence-Transformers selon config
- `vectorstore.create_vectorstore(chunks, embeddings, persist_dir)` : indexe et persiste
- `vectorstore.load_vectorstore(persist_dir, embeddings)` : charge une base existante

### src.retrieval

- `retriever.create_retriever(vectorstore, top_k, score_threshold, search_type)` : retriever LangChain
- `reranker.Reranker.rerank(query, docs, top_k)` : reranking par Cross-Encoder (optionnel)

### src.generation

- `llm.get_llm(model_name, temperature, max_tokens)` : Google > LLM local > OpenAI
- `llm.get_judge_llm()` : juge RAGAS (local Qwen 2.5 ou OpenAI)
- `prompts.SYSTEM_PROMPT` : persona commercial (découverte, objections, closing, sources)
- `prompts.ESCALATION_MESSAGE` / `prompts.OUT_OF_SCOPE_KEYWORDS`
- `rag_chain.build_rag_chain(retriever, llm)` : chaîne RAG complète
- `rag_chain.format_docs(docs)` : formatage des sources

### src.escalation

- `escalation.should_escalate(question, retrieved_docs, similarity_scores)` : décide de l'escalade
  (intention, documents absents, similarité < 0.5, mots-clés hors périmètre)

### src.intents

- `intent_classifier.detect_intent(question)` : 13 intentions (produit, garanties, exclusions,
  cotisations, bénéficiaires, souscription, pièces, hors périmètre, conseiller, 4 objections)
- `intent_classifier.detect_objection(question)` : objection prix / confiance / timing / concurrence
- `intent_classifier.get_intent_label(intent)` : libellé lisible

### src.evaluation

- `retrieval_metrics.*` : precision_at_k, recall_at_k, mrr, aggregate_scores
- `ragas_eval.run_ragas_evaluation(chain, retriever, questions, llm, embeddings)` : scores RAGAS
- `ragas_eval.run_retrieval_evaluation(retriever, vectorstore, questions)` : métriques de retrieval
- `ragas_eval.full_evaluation(...)` : évaluation complète
- `commercial_metrics.ton_commercial(response)` : score [0,1] du comportement commercial
- `commercial_metrics.objection_handled(question, response)` : score du framework d'objection
- `commercial_metrics.run_commercial_evaluation(chain, retriever, questions)` : évaluation complète
- `hallucination_detector.detect_hallucination(answer, contexts, threshold)` : heuristique lexicale

## Portail (API REST FastAPI)

Routes sous préfixe `/api`, documentées automatiquement via `/docs` (Swagger) :

| Méthode | Route | Description |
|---|---|---|
| POST | `/auth/register` | Inscription (rôle agent) |
| POST | `/auth/login` | Connexion → JWT bearer |
| GET | `/auth/me` | Profil courant |
| GET | `/dashboard/kpis` | KPIs globaux (users, conversations, contrats, fraudes) |
| GET | `/dashboard/rag` | Statistiques d'évaluation RAG (retrieval + RAGAS) |
| POST | `/predict/provisioning` | Provisionnement d'un contrat |
| POST | `/predict/provisioning/batch` | Provisionnement en lot (statistiques) |
| GET | `/predict/portfolio` | Synthèse du portefeuille de contrats en base |
| GET | `/predict/model-info` | Méta-données des modèles ML |
| POST | `/predict/churn` | Probabilité de churn d'un contrat |
| POST | `/predict/fraud` | Score de fraude d'une transaction |
| POST | `/rag/chat` | Conversation RAG (escalade, intention, réponse) |
| GET | `/admin/users` | Liste des utilisateurs (admin) |
| POST | `/admin/users` | Création d'utilisateur (admin) |
| PATCH | `/admin/users/{id}` | Modification d'utilisateur (admin) |
| GET | `/health` | État de santé du service |

Schémas Pydantic : `src/api/schemas/provisioning.py` (requests/réponses de provisioning).
Persistance : SQLite (`data/sunu_portal.db`) via `src/api/persistence.py`, modèles dans
`src/api/database.py`, JWT dans `src/api/deps.py`.