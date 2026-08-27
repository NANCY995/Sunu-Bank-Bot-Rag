import json
import logging
import os
import subprocess
import sys
import time
from pathlib import Path

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = Path(os.path.dirname(SCRIPT_DIR))
sys.path.insert(0, str(PROJECT_ROOT))
os.chdir(str(PROJECT_ROOT))

EVALUATION_DATA_DIR = PROJECT_ROOT / "data" / "evaluation"
DONE_FLAG = EVALUATION_DATA_DIR / "ragas_done.flag"
RESULTS_PATH = EVALUATION_DATA_DIR / "ragas_results_local.json"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [WATCHER] %(message)s",
)
LOG = logging.getLogger()

def workers_running():
    """Vérifie si les workers A et B tournent encore."""
    for tag in ["A", "B"]:
        pid_file = EVALUATION_DATA_DIR / f"ragas_worker_{tag}.pid"
        if not pid_file.exists():
            LOG.info(f"Worker {tag} : PID file absent")
            return False
        try:
            pid = int(pid_file.read_text(encoding="utf-8").strip())
        except (ValueError, OSError):
            LOG.info(f"Worker {tag} : PID illisible")
            return False
        result = subprocess.run(
            ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
            capture_output=True,
            text=True,
        )
        if str(pid) not in result.stdout:
            LOG.info(f"Worker {tag} : PID {pid} non trouvé")
            return False
    return True

def wait_ragas():
    """Attend que les workers terminent."""
    LOG.info("Attente fin évaluation RAGAS...")
    while workers_running():
        time.sleep(30)
        LOG.info("Workers actifs, attente...")
    
    # Attendre le flag de fin
    LOG.info("Workers arrêtés, attente flag done...")
    for _ in range(120):  # Max 2 min
        if DONE_FLAG.exists():
            LOG.info("RAGAS terminé !")
            return True
        time.sleep(1)
    
    LOG.warning("Timeout flag done - vérification résultats")
    return RESULTS_PATH.exists()

def start_servers():
    """Démarre API et portail."""
    LOG.info("Démarrage API...")
    api_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "src.api.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=PROJECT_ROOT,
    )
    
    LOG.info("Démarrage portail...")
    portal_proc = subprocess.Popen(
        [sys.executable, "-m", "streamlit", "run", "src/portal/app.py", "--server.port", "8502"],
        cwd=PROJECT_ROOT,
    )
    
    time.sleep(5)  # Démarrage
    LOG.info(f"API PID: {api_proc.pid}, Portail PID: {portal_proc.pid}")
    return api_proc, portal_proc

def run_notebook_04():
    """Exécute le notebook d'analyse."""
    LOG.info("Exécution notebook 04...")
    result = subprocess.run(
        [sys.executable, "-m", "jupyter", "nbconvert", "--to", "notebook", "--execute", "--inplace", 
         "notebooks/04_analyse_resultats.ipynb"],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
    )
    LOG.info(f"Notebook 04 terminé (exit code: {result.returncode})")
    if result.returncode != 0:
        LOG.error(f"Erreur notebook: {result.stderr}")
    return result.returncode == 0

def commit_final():
    """Commit final des résultats."""
    LOG.info("Commit final...")
    subprocess.run(
        ["git", "add", "data/evaluation/ragas_results_local.json", "notebooks/04_analyse_resultats.ipynb"],
        cwd=PROJECT_ROOT,
    )
    subprocess.run(
        ["git", "commit", "-m", "RAGAS terminé + notebook 04 exécuté"],
        cwd=PROJECT_ROOT,
    )
    LOG.info("Commit effectué")

def main():
    LOG.info("=== PIPELINE COMPLET DÉMARRÉ ===")
    
    # 1. Attendre RAGAS
    if not wait_ragas():
        LOG.error("RAGAS non terminé correctement")
        return
    
    # 2. Démarrer serveurs
    api_proc, portal_proc = start_servers()
    
    try:
        # 3. Notebook 04
        if run_notebook_04():
            # 4. Commit
            commit_final()
            LOG.info("=== PIPELINE TERMINÉ AVEC SUCCÈS ===")
        else:
            LOG.error("Notebook 04 échoué")
    finally:
        LOG.info("Arrêt serveurs...")
        api_proc.terminate()
        portal_proc.terminate()

if __name__ == "__main__":
    main()
