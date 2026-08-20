# Données d'évaluation (Phase 5)

- `test_questions.json` : jeu de questions de test (75 questions catégorisées)
  avec `gold_answer`, `category`, `complexity`, `needs_escalation`, `expected_source`,
  `relevant_chunk_ids`.
- `gold_answers.json` : réponses de référence (version détaillée), générées depuis
  `test_questions.json` (`gold_answer`).
- `user_test_results.csv` : gabarit de résultats du questionnaire utilisateur (TAM adapté).
  À remplir lors des passations manuelles en agence.
- `retrieval_results.json` : scores de retrieval par question (P@1, P@5, Recall@5, MRR,
  source hit) — produit par `python main.py eval-retrieval`.
- `ragas_results_local.json` : scores RAGAS agrégés (faithfulness, answer relevancy,
  context precision, context recall) — juge local Qwen 2.5 — produit par
  `python main.py eval` ou `scripts/run_ragas_checkpoint.py`.
- `commercial_evaluation.json` : scores du comportement commercial (ton, objections,
  closing) — produit par `python main.py eval-commercial`.
- `results/` : exports bruts et figures produits lors des campagnes d'évaluation.
- `chunking_experiment.json` / `embedding_experiment.json` : expériences d'optimisation
  du chunking et des embeddings (`scripts/eval_chunking.py`, `scripts/eval_embeddings.py`).
- `user_questionnaire.md` : protocole du questionnaire utilisateur (TAM adapté).

## Commandes

```bash
python main.py eval-retrieval     # sans LLM, sans clé API
python main.py eval               # RAGAS + retrieval (nécessite un juge LLM)
python main.py eval-commercial    # comportement commercial (règles lexicales)
```