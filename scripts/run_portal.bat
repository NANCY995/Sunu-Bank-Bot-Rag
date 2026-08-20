@echo off
rem Démarre le portail Streamlit SUNU Bank (src/ui/portal.py).
rem Utilisable depuis n'importe quel répertoire : se place dans le projet.
cd /d "%~dp0.."
python -m streamlit run src\ui\portal.py --server.port 8502 --server.headless true