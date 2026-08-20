import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

from src.evaluation.retrieval_metrics import aggregate_scores
from src.utils.config import EVALUATION_DATA_DIR

FIGURES_DIR = Path(__file__).resolve().parent.parent.parent / "Memoire" / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

COLORS = ["#003366", "#e8a33d", "#1b7f79", "#8b1a1a", "#5b6770", "#2e8b57"]


def save(fig, name):
    path = FIGURES_DIR / name
    fig.savefig(path, dpi=200, bbox_inches="tight")
    plt.close(fig)
    print(f"figure écrite : {path}")


def fig_architecture():
    fig, ax = plt.subplots(figsize=(11, 6.5))
    ax.axis("off")
    boxes = [
        (0.02, 0.35, 0.18, 0.30, "Interface\nStreamlit", "#e8a33d"),
        (0.27, 0.35, 0.30, 0.30, "Pipeline RAG\nLangChain", "#003366"),
        (
            0.65,
            0.35,
            0.33,
            0.30,
            "Base de connaissances\nChromaDB (240 chunks)",
            "#1b7f79",
        ),
        (0.27, 0.02, 0.14, 0.22, "Retriever\n(ChromaDB)", "#5b6770"),
        (0.44, 0.02, 0.14, 0.22, "LLM\n(API OpenAI)", "#5b6770"),
        (0.27, 0.78, 0.14, 0.16, "Détection\nd'escalade", "#8b1a1a"),
        (0.44, 0.78, 0.14, 0.16, "Évaluation\n(RAGAS)", "#2e8b57"),
    ]
    for x, y, w, h, label, color in boxes:
        ax.add_patch(
            plt.Rectangle((x, y), w, h, facecolor=color, alpha=0.85, edgecolor="black")
        )
        ax.text(
            x + w / 2,
            y + h / 2,
            label,
            ha="center",
            va="center",
            fontsize=9,
            color="white",
            fontweight="bold",
        )
    ax.annotate(
        "",
        xy=(0.20, 0.50),
        xytext=(0.27, 0.50),
        arrowprops={"arrowstyle": "->", "lw": 1.5},
    )
    ax.annotate(
        "",
        xy=(0.57, 0.50),
        xytext=(0.65, 0.50),
        arrowprops={"arrowstyle": "->", "lw": 1.5},
    )
    ax.annotate(
        "",
        xy=(0.33, 0.35),
        xytext=(0.33, 0.24),
        arrowprops={"arrowstyle": "->", "lw": 1.2},
    )
    ax.annotate(
        "",
        xy=(0.50, 0.35),
        xytext=(0.50, 0.24),
        arrowprops={"arrowstyle": "->", "lw": 1.2},
    )
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_title(
        "Figure : Architecture fonctionnelle et technique de l'assistant RAG",
        fontsize=12,
        fontweight="bold",
        pad=12,
    )
    save(fig, "fig_architecture.png")


def fig_pipeline():
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.axis("off")
    steps = [
        (0.28, 0.90, "1. Requête utilisateur"),
        (0.28, 0.75, "2. Embedding de la requête"),
        (0.28, 0.60, "3. Recherche vectorielle (top-k)"),
        (0.28, 0.45, "4. Vérification pertinence / escalade"),
        (0.28, 0.30, "5. Génération de la réponse (LLM + contexte)"),
        (0.28, 0.15, "6. Réponse avec citation des sources"),
    ]
    for x, y, label in steps:
        ax.add_patch(
            plt.Rectangle(
                (x, y), 0.44, 0.10, facecolor="#003366", edgecolor="black", alpha=0.9
            )
        )
        ax.text(
            x + 0.22,
            y + 0.05,
            label,
            ha="center",
            va="center",
            fontsize=10,
            color="white",
        )
        if y > 0.20:
            ax.annotate(
                "",
                xy=(x + 0.22, y - 0.02),
                xytext=(x + 0.22, y - 0.10),
                arrowprops={"arrowstyle": "->", "lw": 1.4},
            )
    ax.text(
        0.05,
        0.53,
        "Hors périmètre /\nnon pertinent",
        fontsize=9,
        color="#8b1a1a",
        fontweight="bold",
    )
    ax.annotate(
        "",
        xy=(0.28, 0.47),
        xytext=(0.10, 0.50),
        arrowprops={"arrowstyle": "->", "color": "#8b1a1a", "lw": 1.3},
    )
    ax.text(
        0.60,
        0.53,
        "Escalade vers\nun conseiller humain",
        fontsize=9,
        color="#8b1a1a",
        fontweight="bold",
    )
    ax.annotate(
        "",
        xy=(0.68, 0.47),
        xytext=(0.56, 0.50),
        arrowprops={"arrowstyle": "->", "color": "#8b1a1a", "lw": 1.3},
    )
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_title(
        "Figure : Flux de traitement d'une requête utilisateur",
        fontsize=12,
        fontweight="bold",
        pad=12,
    )
    save(fig, "fig_pipeline.png")


def fig_chunking():
    data = json.loads(
        (EVALUATION_DATA_DIR / "chunking_experiment.json").read_text(encoding="utf-8")
    )
    labels = list(data.keys())
    p1 = [data[k]["aggregates"]["precision_at_1"] for k in labels]
    hit5 = [data[k]["aggregates"]["source_hit_at_5"] for k in labels]
    mrr = [data[k]["aggregates"]["mrr"] for k in labels]
    x = np.arange(len(labels))
    width = 0.25
    fig, ax = plt.subplots(figsize=(10, 5.5))
    ax.bar(x - width, p1, width, label="Precision@1", color=COLORS[0])
    ax.bar(x, hit5, width, label="Source hit@5", color=COLORS[1])
    ax.bar(x + width, mrr, width, label="MRR", color=COLORS[2])
    ax.set_xticks(x)
    ax.set_xticklabels(
        [f"{k.split('_')[0]}\noverlap {k.split('_')[1][1:]}" for k in labels]
    )
    ax.set_ylim(0, 1)
    ax.set_ylabel("Score")
    ax.legend()
    ax.grid(axis="y", alpha=0.3)
    ax.set_title("Figure : Comparaison des configurations de chunking")
    save(fig, "fig_chunking.png")


def fig_embeddings():
    data = json.loads(
        (EVALUATION_DATA_DIR / "embedding_experiment.json").read_text(encoding="utf-8")
    )
    labels = ["MiniLM L6\n(anglais)", "MiniLM L12\n(multilingue)"]
    metrics = ["precision_at_1", "source_hit_at_5", "mrr"]
    names = ["Precision@1", "Source hit@5", "MRR"]
    values = np.array(
        [
            [
                data["all-MiniLM-L6-v2"][m],
                data["paraphrase-multilingual-MiniLM-L12-v2"][m],
            ]
            for m in metrics
        ]
    )
    x = np.arange(len(metrics))
    width = 0.3
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(x - width / 2, values[:, 0], width, label=labels[0], color=COLORS[0])
    ax.bar(x + width / 2, values[:, 1], width, label=labels[1], color=COLORS[1])
    ax.set_xticks(x)
    ax.set_xticklabels(names)
    ax.set_ylim(0, 1)
    ax.legend()
    ax.grid(axis="y", alpha=0.3)
    ax.set_title("Figure : Comparaison des modèles d'embeddings")
    save(fig, "fig_embeddings.png")


def fig_categories(questions):
    counts = {}
    for q in questions:
        counts[q["category"]] = counts.get(q["category"], 0) + 1
    labels = list(counts.keys())
    values = list(counts.values())
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.pie(
        values,
        labels=labels,
        autopct="%1.0f%%",
        colors=COLORS * 2,
        startangle=90,
        textprops={"fontsize": 8},
    )
    ax.set_title("Figure : Répartition des questions de test par catégorie")
    save(fig, "fig_categories.png")


def fig_retrieval_by_category(results):
    by_cat = {}
    for r in results:
        cat = r["id"][1:4].lstrip("0") if r["id"].startswith("Q") else "?"
        by_cat.setdefault(cat, []).append(r)
    categories = sorted(by_cat.keys())
    hit5 = [aggregate_scores(by_cat[c])["source_hit_at_5"] for c in categories]
    mrr = [aggregate_scores(by_cat[c])["mrr"] for c in categories]
    x = np.arange(len(categories))
    width = 0.35
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.bar(x - width / 2, hit5, width, label="Source hit@5", color=COLORS[0])
    ax.bar(x + width / 2, mrr, width, label="MRR", color=COLORS[2])
    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.set_ylim(0, 1)
    ax.legend()
    ax.grid(axis="y", alpha=0.3)
    ax.set_title("Figure : Performances du retrieval par catégorie de questions")
    save(fig, "fig_retrieval_by_category.png")


def fig_corpus_distribution(chunks_by_source):
    fig, ax = plt.subplots(figsize=(8, 5))
    sources = list(chunks_by_source.keys())
    counts = list(chunks_by_source.values())
    ax.barh(sources, counts, color=COLORS[0])
    for i, v in enumerate(counts):
        ax.text(v + 1, i, str(v), va="center", fontsize=9)
    ax.set_xlabel("Nombre de chunks (taille 300, chevauchement 30)")
    ax.set_title("Figure : Répartition des chunks par document du corpus")
    save(fig, "fig_corpus_distribution.png")


def main():
    questions = json.loads(
        (EVALUATION_DATA_DIR / "test_questions.json").read_text(encoding="utf-8")
    )["questions"]
    results = json.loads(
        (EVALUATION_DATA_DIR / "retrieval_results.json").read_text(encoding="utf-8")
    )["per_question"]
    fig_architecture()
    fig_pipeline()
    fig_chunking()
    fig_embeddings()
    fig_categories(questions)
    fig_retrieval_by_category(results)
    fig_corpus_distribution(_count_chunks_per_source())
    print("Toutes les figures ont été générées.")


def _count_chunks_per_source():
    from src.indexing.embeddings import get_embedding_model
    from src.indexing.vectorstore import load_vectorstore
    from src.utils.config import CHROMA_PERSIST_DIR

    vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, get_embedding_model())
    data = vectorstore.get(include=["metadatas"])
    counts = {}
    for metadata in data["metadatas"]:
        source = metadata.get("document", "inconnu")
        counts[source] = counts.get(source, 0) + 1
    return counts


if __name__ == "__main__":
    sys.exit(main())
