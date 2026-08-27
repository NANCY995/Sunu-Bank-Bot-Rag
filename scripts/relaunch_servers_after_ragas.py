"""Relance l'API et le portail quand les workers RAGAS ont terminé."""

import os
import subprocess
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
os.chdir(PROJECT_ROOT)

PYTHON = sys.executable
EVAL_DIR = os.path.join(PROJECT_ROOT, "data", "evaluation")


def worker_alive() -> bool:
    return any(
        os.path.exists(os.path.join(EVAL_DIR, f"ragas_worker_{tag}.pid"))
        for tag in ("a", "b")
    )


def worker_seen() -> bool:
    return any(
        os.path.exists(os.path.join(EVAL_DIR, f"ragas_worker_{tag}.pid"))
        for tag in ("a", "b")
    )


def main():
    while not worker_seen():
        time.sleep(30)
    while worker_alive():
        time.sleep(60)
    subprocess.Popen(
        [
            PYTHON,
            "-m",
            "uvicorn",
            "src.api.main:app",
            "--host",
            "127.0.0.1",
            "--port",
            "8000",
        ],
        cwd=PROJECT_ROOT,
        stdout=open(os.path.join(EVAL_DIR, "api.log"), "a", encoding="utf-8"),
        stderr=open(os.path.join(EVAL_DIR, "api_err.log"), "a", encoding="utf-8"),
        creationflags=subprocess.CREATE_NO_WINDOW,
    )
    subprocess.Popen(
        [
            PYTHON,
            "-m",
            "streamlit",
            "run",
            "app/app.py",
            "--server.port",
            "8502",
            "--server.headless",
            "true",
        ],
        cwd=PROJECT_ROOT,
        stdout=open(os.path.join(EVAL_DIR, "portal.log"), "a", encoding="utf-8"),
        stderr=open(os.path.join(EVAL_DIR, "portal_err.log"), "a", encoding="utf-8"),
        creationflags=subprocess.CREATE_NO_WINDOW,
    )
    with open(os.path.join(EVAL_DIR, "watcher_restarted.log"), "a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} serveurs relances\n")


if __name__ == "__main__":
    main()