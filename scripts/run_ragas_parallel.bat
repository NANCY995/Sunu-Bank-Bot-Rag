@echo off
rem Évaluation RAGAS en 2 workers parallèles (reprise par checkpoint).
rem Utilisable depuis n'importe quel répertoire : se place dans le projet.
cd /d "%~dp0.."
start "RAGAS worker A (faithfulness, answer_relevancy)" cmd /c "python scripts\run_ragas_checkpoint.py --worker A faithfulness,answer_relevancy >> data\evaluation\ragas_worker_a.log 2>&1"
start "RAGAS worker B (context_precision, context_recall)" cmd /c "python scripts\run_ragas_checkpoint.py --worker B context_precision,context_recall >> data\evaluation\ragas_worker_b.log 2>&1"