import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.evaluation.retrieval_metrics import aggregate_scores

results = json.loads(
    (Path("data/evaluation/retrieval_results.json")).read_text(encoding="utf-8")
)["per_question"]
questions = json.loads(
    (Path("data/evaluation/test_questions.json")).read_text(encoding="utf-8")
)["questions"]
cat_of = {q["id"]: q["category"] for q in questions}
by_cat = {}
for r in results:
    by_cat.setdefault(cat_of[r["id"]], []).append(r)
for cat, rs in sorted(by_cat.items()):
    a = aggregate_scores(rs)
    print(
        f"{cat:18s} n={len(rs):2d}  P@1={a['precision_at_1']:.3f}  "
        f"P@5={a['precision_at_5']:.3f}  hit@5={a['source_hit_at_5']:.3f}  MRR={a['mrr']:.3f}"
    )
errs = [r for r in results if r["source_hit_at_5"] == 0]
print()
print(f"Questions sans source attendue dans le top-5 : {len(errs)}")
for r in errs:
    print(" -", r["id"], r["question"][:80])
