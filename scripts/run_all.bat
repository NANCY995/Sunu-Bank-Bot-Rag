@echo off
chcp 65001 > nul
echo ========================================================
echo   DEMARRAGE DE SUNU BANK TOGO - RAG & FINANCE PLATFORM
echo ========================================================
echo.

cd /d "%~dp0.."

echo [1/2] Lancement du Backend FastAPI sur http://localhost:8000 ...
start "SUNU Bank - API FastAPI" cmd /k "python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Lancement du Portail React sur http://localhost:3000 ...
start "SUNU Bank - Portail React" cmd /k "cd frontend && bun run dev"

echo.
echo Application en cours d'execution !
echo - API Backend : http://localhost:8000/docs
echo - Portail UI  : http://localhost:3000
echo.
pause
