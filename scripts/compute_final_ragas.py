"""Calcule les scores RAGAS finaux depuis le checkpoint et met à jour ragas_results_local.json."""

import json
import statistics
from pathlib import Path

CKPT = Path("data/evaluation/ragas_checkpoint.json")
RESULTS = Path("data/evaluation/ragas_results_local.json")

METRICS = ["faithfulness", "answer_relevancy", "context_precision", "context_recall"]


def compute():
    ckpt = json.loads(CKPT.read_text(encoding="utf-8"))

    scores = {}
    details = {}
    for metric in METRICS:
        vals = ckpt.get(metric, {})
        valid = [v for v in vals.values() if v is not None]
        given_up = ckpt.get("_given_up", {}).get(metric, [])
        total = len(vals)
        done = len(valid)
        failed = len(given_up)

        if valid:
            avg = statistics.mean(valid)
            med = statistics.median(valid)
            std = statistics.stdev(valid) if len(valid) > 1 else 0.0
        else:
            avg = med = std = 0.0

        scores[metric] = round(avg, 4)
        details[metric] = {
            "mean": round(avg, 4),
            "median": round(med, 4),
            "std": round(std, 4),
            "valid": done,
            "total": total,
            "given_up": failed,
            "min": round(min(valid), 4) if valid else None,
            "max": round(max(valid), 4) if valid else None,
        }
        print(
            f"  {metric:25s}: {avg:.4f}  (n={done}/{total}, given_up={failed}, median={med:.4f})"
        )

    output = {
        "scores": scores,
        "details": details,
        "overall_mean": round(statistics.mean(scores.values()), 4),
    }
    RESULTS.write_text(
        json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\n  Overall mean: {output['overall_mean']:.4f}")
    print(f"  Saved to {RESULTS}")
    return output


if __name__ == "__main__":
    print("=== RAGAS Final Scores ===\n")
    compute()
