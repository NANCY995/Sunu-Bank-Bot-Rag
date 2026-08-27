import json
import os
import subprocess
import time
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent
EVALUATION_DATA_DIR = PROJECT_ROOT / "data" / "evaluation"
CHECKPOINT_PATH = EVALUATION_DATA_DIR / "ragas_checkpoint.json"
LOG_PATH = EVALUATION_DATA_DIR / "ragas_full.log"

METRICS = ["faithfulness", "answer_relevancy", "context_precision", "context_recall"]

def get_progress():
    """Lit le checkpoint et retourne la progression."""
    if not CHECKPOINT_PATH.exists():
        return {}
    try:
        return json.loads(CHECKPOINT_PATH.read_text(encoding="utf-8"))
    except:
        return {}

def workers_active():
    """Vérifie si les workers tournent."""
    active = 0
    for tag in ["A", "B"]:
        pid_file = EVALUATION_DATA_DIR / f"ragas_worker_{tag}.pid"
        if pid_file.exists():
            try:
                pid = int(pid_file.read_text(encoding="utf-8").strip())
                result = subprocess.run(
                    ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
                    capture_output=True,
                    text=True,
                )
                if str(pid) in result.stdout:
                    active += 1
            except:
                pass
    return active

def print_progress():
    """Affiche la progression actuelle."""
    ckpt = get_progress()
    active = workers_active()
    
    print(f"\n=== {datetime.now().strftime('%H:%M:%S')} ===")
    print(f"Workers actifs: {active}/2")
    
    for metric in METRICS:
        if metric in ckpt:
            done = len([k for k in ckpt[metric].keys() if ckpt[metric][k] is not None])
            total = len(ckpt[metric])
            pct = (done / total * 100) if total > 0 else 0
            print(f"{metric}: {done}/{total} ({pct:.1f}%)")
        else:
            print(f"{metric}: 0/68 (0.0%)")
    
    # Dernières lignes du log
    if LOG_PATH.exists():
        try:
            with open(LOG_PATH, "r", encoding="utf-8") as f:
                lines = f.readlines()
                if lines:
                    print(f"\nDernière activité: {lines[-1].strip()}")
        except:
            pass

def main():
    print("Monitoring RAGAS - Ctrl+C pour arrêter")
    try:
        while True:
            print_progress()
            time.sleep(30)
    except KeyboardInterrupt:
        print("\nMonitoring arrêté")

if __name__ == "__main__":
    main()
