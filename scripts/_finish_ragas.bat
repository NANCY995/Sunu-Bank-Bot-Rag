@echo off
rem Relance l'evaluation RAGAS en boucle jusqu'a completion (checkpoint + flag).
cd /d "%~dp0.."
set "PY=C:\Users\Johnson Nancy\AppData\Local\Programs\Python\Python313\python.exe"
:loop
"%PY%" scripts\run_ragas_checkpoint.py --replay-missing >> data\evaluation\ragas_err.log 2>&1
if exist data\evaluation\ragas_done.flag goto done
echo [%date% %time%] replay incomplet, relance >> data\evaluation\ragas_err.log
goto loop
:done
"%PY%" scripts\compute_final_ragas.py >> data\evaluation\ragas_err.log 2>&1
