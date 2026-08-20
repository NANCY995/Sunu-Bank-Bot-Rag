@echo off
rem Démarre l'API FastAPI du portail SUNU Bank (uvicorn).
rem Utilisable depuis n'importe quel répertoire : se place dans le projet.
cd /d "%~dp0.."
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000