import json
import sys
from pathlib import Path

# Ajouter la racine du projet
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

FIGURES_DIR = Path(__file__).resolve().parent.parent.parent / "Memoire" / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

# Charte graphique institutionnelle SUNU Bank
SUNU_RED = "#E21E26"
SUNU_DARK_RED = "#8B1A1A"
SUNU_NAVY = "#003366"
SUNU_GOLD = "#E8A33D"
SUNU_TEAL = "#1B7F79"
SUNU_GRAY = "#4A5568"
SUNU_LIGHT_BG = "#F8FAFC"
SUNU_CARD_BG = "#FFFFFF"

plt.rcParams["font.sans-serif"] = ["DejaVu Sans", "Arial", "Helvetica"]
plt.rcParams["font.family"] = "sans-serif"

def save(fig, name):
    path = FIGURES_DIR / name
    fig.savefig(path, dpi=300, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"[OK] Figure générée avec succès : {path.name}")


def fig_architecture():
    """Figure I.1 : Architecture générale du système RAG appliqué à l'assurance vie."""
    fig, ax = plt.subplots(figsize=(12, 7.2), facecolor="white")
    ax.set_facecolor(SUNU_LIGHT_BG)
    ax.axis("off")

    fig.suptitle(
        "Figure I.1 : Architecture générale d'un système RAG appliqué à l'assurance vie (SUNU Bank Togo)",
        fontsize=13,
        fontweight="bold",
        color=SUNU_NAVY,
        y=0.96
    )

    # 1. Zone Utilisateur / Présentation
    p_user = patches.FancyBboxPatch(
        (0.03, 0.36), 0.18, 0.32,
        boxstyle="round,pad=0.02,rounding_size=0.03",
        facecolor="#FFF5F5", edgecolor=SUNU_RED, linewidth=2
    )
    ax.add_patch(p_user)
    ax.text(0.12, 0.58, "COUCHE PRÉSENTATION\n(Portail Client & Agent)", ha="center", va="center", fontsize=9, fontweight="bold", color=SUNU_RED)
    ax.text(0.12, 0.44, "• Dialogue Web React / TS\n• Sélection Produits CIMA\n• Mode Clair / Sombre\n• Citations des sources", ha="center", va="center", fontsize=8, color="#2D3748")

    # 2. Couche Pipeline RAG / Traitement
    p_rag = patches.FancyBboxPatch(
        (0.29, 0.28), 0.36, 0.48,
        boxstyle="round,pad=0.02,rounding_size=0.03",
        facecolor="#F0F7FF", edgecolor=SUNU_NAVY, linewidth=2
    )
    ax.add_patch(p_rag)
    ax.text(0.47, 0.70, "ORCHESTRATION & PIPELINE RAG (LangChain)", ha="center", va="center", fontsize=10, fontweight="bold", color=SUNU_NAVY)

    sub_boxes = [
        (0.31, 0.53, 0.15, 0.12, "Retriever Vectoriel\n(Top-k = 5)", "#EBF8FF", SUNU_NAVY),
        (0.48, 0.53, 0.15, 0.12, "LLM de Génération\n(Gemini / Qwen)", "#EBF8FF", SUNU_NAVY),
        (0.31, 0.34, 0.15, 0.13, "Module d'Escalade\n& Sécurité CIMA", "#FFF5F5", SUNU_DARK_RED),
        (0.48, 0.34, 0.15, 0.13, "Évaluation RAGAS\n(Fidélité, Pertinence)", "#F0FFF4", "#2E8B57"),
    ]
    for bx, by, bw, bh, blabel, bbg, bcol in sub_boxes:
        p_sub = patches.FancyBboxPatch((bx, by), bw, bh, boxstyle="round,pad=0.01,rounding_size=0.02", facecolor=bbg, edgecolor=bcol, linewidth=1.2)
        ax.add_patch(p_sub)
        ax.text(bx + bw/2, by + bh/2, blabel, ha="center", va="center", fontsize=8, fontweight="bold", color=bcol)

    # 3. Base de Données Vectorielle
    p_db = patches.FancyBboxPatch(
        (0.73, 0.36), 0.24, 0.32,
        boxstyle="round,pad=0.02,rounding_size=0.03",
        facecolor="#F0FDF4", edgecolor=SUNU_TEAL, linewidth=2
    )
    ax.add_patch(p_db)
    ax.text(0.85, 0.58, "BASE DE CONNAISSANCES\nChromaDB Persistante", ha="center", va="center", fontsize=9, fontweight="bold", color=SUNU_TEAL)
    ax.text(0.85, 0.44, "• 5 Documents Sources\n• 335 Chunks Sémantiques\n• Embeddings Multilingues\n• Métadonnées CIMA (Art. 6)", ha="center", va="center", fontsize=8, color="#2D3748")

    arrow_style = dict(arrowstyle="<->", color=SUNU_NAVY, lw=1.8, mutation_scale=15)
    ax.annotate("", xy=(0.21, 0.52), xytext=(0.29, 0.52), arrowprops=arrow_style)
    ax.text(0.25, 0.55, "Requêtes /\nRéponses", ha="center", va="center", fontsize=7.5, fontweight="bold", color=SUNU_NAVY)

    ax.annotate("", xy=(0.65, 0.52), xytext=(0.73, 0.52), arrowprops=arrow_style)
    ax.text(0.69, 0.55, "Similarité\nCosinus", ha="center", va="center", fontsize=7.5, fontweight="bold", color=SUNU_TEAL)

    p_foot = patches.Rectangle((0.03, 0.05), 0.94, 0.14, facecolor="#EDF2F7", edgecolor="#CBD5E0", linewidth=1)
    ax.add_patch(p_foot)
    ax.text(0.50, 0.12, "Gouvernance & Conformité Réglementaire : Code des Assurances CIMA • Réglementation Bancaire UEMOA • IPDCP Togo", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#4A5568")
    ax.text(0.50, 0.08, "Étude empirique appliquée aux produits : Visa Études, Visa Études Plus, Horizon Retraite (SUNU Bank Togo)", ha="center", va="center", fontsize=8, style="italic", color="#718096")

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    save(fig, "fig_architecture.png")


def fig_pipeline():
    """Figure I.2 : Pipeline séquentiel de traitement et de contextualisation d'une requête."""
    fig, ax = plt.subplots(figsize=(11, 8.5), facecolor="white")
    ax.set_facecolor(SUNU_LIGHT_BG)
    ax.axis("off")

    fig.suptitle(
        "Figure I.2 : Pipeline séquentiel de traitement et de contextualisation d'une requête",
        fontsize=13,
        fontweight="bold",
        color=SUNU_NAVY,
        y=0.97
    )

    steps = [
        (0.26, 0.83, "1. Réception de la requête du prospect", "Langage naturel posé sur le portail ou transmis par le conseiller.", SUNU_NAVY),
        (0.26, 0.68, "2. Vectorisation sémantique (Embeddings)", "Modèle dense multilingue transformant la question en vecteur 384-D.", SUNU_NAVY),
        (0.26, 0.53, "3. Recherche vectorielle Top-k dans ChromaDB", "Extraction des 5 fragments contractuels les plus proches par similarité.", SUNU_NAVY),
        (0.26, 0.38, "4. Contrôle de pertinence & Filtre d'escalade", "Vérification des seuils de similarité et détection de thèmes hors périmètre.", SUNU_DARK_RED),
        (0.26, 0.23, "5. Synthèse & Génération conditionnée par le LLM", "Génération déterministe (température 0) strictement basée sur le contexte.", SUNU_NAVY),
        (0.26, 0.08, "6. Restitution de la réponse & Citation des sources", "Affichage clair avec article CIMA, document source et contact conseiller.", "#2E8B57"),
    ]

    for x, y, title, desc, col in steps:
        p = patches.FancyBboxPatch(
            (x, y), 0.48, 0.105,
            boxstyle="round,pad=0.015,rounding_size=0.025",
            facecolor="#FFFFFF", edgecolor=col, linewidth=1.8
        )
        ax.add_patch(p)
        ax.text(x + 0.24, y + 0.068, title, ha="center", va="center", fontsize=9.5, fontweight="bold", color=col)
        ax.text(x + 0.24, y + 0.032, desc, ha="center", va="center", fontsize=7.8, color="#4A5568")

    # Flèches descendantes STRICTES
    for i in range(len(steps) - 1):
        curr_y = steps[i][1]
        next_y = steps[i+1][1] + 0.105
        ax.annotate(
            "",
            xy=(0.50, next_y),
            xytext=(0.50, curr_y),
            arrowprops=dict(arrowstyle="->", color=SUNU_NAVY, lw=2.0, mutation_scale=15)
        )

    # Branche Escalade latérale à l'étape 4
    p_esc = patches.FancyBboxPatch(
        (0.78, 0.35), 0.19, 0.16,
        boxstyle="round,pad=0.015,rounding_size=0.025",
        facecolor="#FFF5F5", edgecolor=SUNU_RED, linewidth=1.8
    )
    ax.add_patch(p_esc)
    ax.text(0.875, 0.45, "DÉCLENCHEMENT\nESCALADE CONSEILLER", ha="center", va="center", fontsize=8.5, fontweight="bold", color=SUNU_RED)
    ax.text(0.875, 0.38, "• Requête hors périmètre\n• Score similarité < seuil\n• Cas litige / opérationnel", ha="center", va="center", fontsize=7.2, color="#742A2A")

    ax.annotate(
        "",
        xy=(0.78, 0.43),
        xytext=(0.74, 0.43),
        arrowprops=dict(arrowstyle="->", color=SUNU_RED, lw=2.0, mutation_scale=15)
    )
    ax.text(0.76, 0.46, "Refus", ha="center", va="center", fontsize=7.5, fontweight="bold", color=SUNU_RED)

    p_rule = patches.FancyBboxPatch(
        (0.03, 0.35), 0.19, 0.16,
        boxstyle="round,pad=0.015,rounding_size=0.025",
        facecolor="#F0FDF4", edgecolor=SUNU_TEAL, linewidth=1.8
    )
    ax.add_patch(p_rule)
    ax.text(0.125, 0.45, "GARDE-FOUS CIMA\n& ANTI-HALLUCINATION", ha="center", va="center", fontsize=8.5, fontweight="bold", color=SUNU_TEAL)
    ax.text(0.125, 0.38, "• Aucune invention admise\n• Prompt système contraint\n• Traçabilité contractuelle", ha="center", va="center", fontsize=7.2, color="#22543D")

    ax.annotate(
        "",
        xy=(0.26, 0.43),
        xytext=(0.22, 0.43),
        arrowprops=dict(arrowstyle="->", color=SUNU_TEAL, lw=2.0, mutation_scale=15)
    )

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    save(fig, "fig_pipeline.png")


def fig_chunking():
    """Figure IV.2 : Évaluation empirique de la calibration du chunking."""
    data = json.loads(
        (Path(__file__).resolve().parent.parent / "data" / "evaluation" / "chunking_experiment.json").read_text(encoding="utf-8")
    )
    labels = list(data.keys())
    p1 = [data[k]["aggregates"]["precision_at_1"] for k in labels]
    hit5 = [data[k]["aggregates"]["source_hit_at_5"] for k in labels]
    mrr = [data[k]["aggregates"]["mrr"] for k in labels]

    x = np.arange(len(labels))
    width = 0.26

    fig, ax = plt.subplots(figsize=(11, 5.8), facecolor="white")
    ax.set_facecolor(SUNU_LIGHT_BG)

    rects1 = ax.bar(x - width, p1, width, label="Precision@1", color=SUNU_NAVY, edgecolor="none", zorder=3)
    rects2 = ax.bar(x, hit5, width, label="Source Hit@5 (Couverture)", color=SUNU_GOLD, edgecolor="none", zorder=3)
    rects3 = ax.bar(x + width, mrr, width, label="MRR (Rang moyen)", color=SUNU_TEAL, edgecolor="none", zorder=3)

    ax.set_title("Figure IV.2 : Évaluation empirique de la calibration du chunking (Taille / Chevauchement)", fontsize=12, fontweight="bold", color=SUNU_NAVY, pad=14)
    ax.set_xticks(x)
    clean_labels = [
        "Taille 300\nOverlap 30\n(Retenu)",
        "Taille 300\nOverlap 60",
        "Taille 500\nOverlap 50",
        "Taille 500\nOverlap 100",
        "Taille 800\nOverlap 80",
        "Taille 800\nOverlap 160"
    ]
    ax.set_xticklabels(clean_labels, fontsize=9)
    ax.set_ylabel("Score de Performance", fontsize=10, fontweight="bold", color=SUNU_NAVY)
    ax.set_ylim(0, 1.05)
    ax.grid(axis="y", linestyle="--", alpha=0.5, zorder=0)
    ax.legend(frameon=True, facecolor="white", edgecolor="#CBD5E0", fontsize=9, loc="upper right")

    ax.annotate(
        "Optimal : Hit@5 = 78.7%",
        xy=(0, 0.79), xytext=(0.4, 0.92),
        arrowprops=dict(arrowstyle="->", color=SUNU_RED, lw=1.6),
        fontweight="bold", color=SUNU_RED, fontsize=8.5
    )

    save(fig, "fig_chunking.png")


def fig_embeddings():
    """Figure IV.3 : Comparaison des modèles d'embeddings MiniLM et Multilingue."""
    data = json.loads(
        (Path(__file__).resolve().parent.parent / "data" / "evaluation" / "embedding_experiment.json").read_text(encoding="utf-8")
    )
    labels = ["all-MiniLM-L6-v2\n(Anglais / Rapide)", "paraphrase-multilingual-MiniLM-L12-v2\n(Multilingue / Français CIMA)"]
    metrics = ["precision_at_1", "source_hit_at_5", "mrr"]
    names = ["Precision@1", "Source Hit@5", "MRR (Mean Reciprocal Rank)"]

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
    width = 0.32

    fig, ax = plt.subplots(figsize=(9, 5.5), facecolor="white")
    ax.set_facecolor(SUNU_LIGHT_BG)

    rects1 = ax.bar(x - width/2, values[:, 0], width, label="all-MiniLM-L6-v2", color=SUNU_NAVY, zorder=3)
    rects2 = ax.bar(x + width/2, values[:, 1], width, label="paraphrase-multilingual-MiniLM-L12-v2", color=SUNU_GOLD, zorder=3)

    for r in rects1:
        h = r.get_height()
        ax.text(r.get_x() + r.get_width()/2., h + 0.015, f"{h:.3f}", ha="center", va="bottom", fontsize=8.5, fontweight="bold", color=SUNU_NAVY)
    for r in rects2:
        h = r.get_height()
        ax.text(r.get_x() + r.get_width()/2., h + 0.015, f"{h:.3f}", ha="center", va="bottom", fontsize=8.5, fontweight="bold", color=SUNU_GOLD)

    ax.set_title("Figure IV.3 : Comparaison des performances des modèles d'embeddings", fontsize=12, fontweight="bold", color=SUNU_NAVY, pad=14)
    ax.set_xticks(x)
    ax.set_xticklabels(names, fontsize=9.5, fontweight="bold")
    ax.set_ylabel("Score obtenu", fontsize=10, fontweight="bold", color=SUNU_NAVY)
    ax.set_ylim(0, 1.05)
    ax.grid(axis="y", linestyle="--", alpha=0.5, zorder=0)
    ax.legend(frameon=True, facecolor="white", edgecolor="#CBD5E0", fontsize=9, loc="upper right")

    save(fig, "fig_embeddings.png")


def fig_categories():
    """Figure IV.1 : Répartition des 75 questions du jeu de test par catégorie."""
    questions = json.loads(
        (Path(__file__).resolve().parent.parent / "data" / "evaluation" / "test_questions.json").read_text(encoding="utf-8")
    )["questions"]

    counts = {}
    cat_names_fr = {
        "definition": "Définition & Présentation (8)",
        "garanties": "Garanties & Prestations (10)",
        "cotisations": "Cotisations & Tarifs (8)",
        "beneficiaires": "Clauses Bénéficiaires (6)",
        "exclusions": "Exclusions Réglementaires (8)",
        "fiscalite": "Fiscalité & Régime UEMOA (5)",
        "souscription": "Modalités de Souscription (8)",
        "resiliation": "Rachat & Résiliation (5)",
        "comparaison": "Comparaison de Produits (5)",
        "hors_perimetre": "Hors Périmètre & Pièges (7)",
        "complexe": "Requêtes Multi-Clauses (5)",
    }

    for q in questions:
        c = q["category"]
        counts[c] = counts.get(c, 0) + 1

    labels = [cat_names_fr.get(k, k) for k in counts.keys()]
    values = list(counts.values())

    palette = [SUNU_NAVY, SUNU_RED, SUNU_GOLD, SUNU_TEAL, SUNU_DARK_RED, SUNU_GRAY, "#2E8B57", "#D97706", "#4338CA", "#059669", "#DC2626"]

    fig, ax = plt.subplots(figsize=(10, 7), facecolor="white")
    wedges, texts, autotexts = ax.pie(
        values,
        labels=labels,
        autopct="%1.1f%%",
        pctdistance=0.8,
        colors=palette,
        startangle=140,
        textprops={"fontsize": 8.5, "color": "#1A202C"}
    )
    for at in autotexts:
        at.set_color("white")
        at.set_fontsize(8)
        at.set_weight("bold")

    centre_circle = plt.Circle((0, 0), 0.55, fc="white")
    ax.add_artist(centre_circle)
    ax.text(0, 0, "75 Questions\nde Test\n(11 Catégories)", ha="center", va="center", fontsize=10, fontweight="bold", color=SUNU_NAVY)

    ax.set_title("Figure IV.1 : Répartition des 75 questions du jeu de test selon les thématiques précontractuelles", fontsize=12, fontweight="bold", color=SUNU_NAVY, pad=16)
    save(fig, "fig_categories.png")


def fig_retrieval_by_category():
    """Figure IV.4 : Performances de recherche par catégorie de questions (Agrégation propre)."""
    q_data = json.loads(
        (Path(__file__).resolve().parent.parent / "data" / "evaluation" / "test_questions.json").read_text(encoding="utf-8")
    )["questions"]
    r_data = json.loads(
        (Path(__file__).resolve().parent.parent / "data" / "evaluation" / "retrieval_results.json").read_text(encoding="utf-8")
    )["per_question"]

    q_map = {q["id"]: q for q in q_data}
    cat_results = {}
    for r in r_data:
        qid = r["id"]
        cat = q_map.get(qid, {}).get("category", "inconnu")
        cat_results.setdefault(cat, []).append(r)

    cat_order = [
        ("definition", "Définition"),
        ("garanties", "Garanties"),
        ("cotisations", "Cotisations"),
        ("beneficiaires", "Bénéficiaires"),
        ("exclusions", "Exclusions"),
        ("fiscalite", "Fiscalité"),
        ("souscription", "Souscription"),
        ("resiliation", "Résiliation"),
        ("comparaison", "Comparaison"),
        ("complexe", "Complexe"),
        ("hors_perimetre", "Hors Périm."),
    ]

    labels = []
    hit5_list = []
    mrr_list = []

    for code, label in cat_order:
        items = cat_results.get(code, [])
        if items:
            n = len(items)
            hit5 = sum(x["source_hit_at_5"] for x in items) / n
            mrr = sum(x["mrr"] for x in items) / n
            labels.append(f"{label}\n(n={n})")
            hit5_list.append(hit5)
            mrr_list.append(mrr)

    x = np.arange(len(labels))
    width = 0.36

    fig, ax = plt.subplots(figsize=(12, 6), facecolor="white")
    ax.set_facecolor(SUNU_LIGHT_BG)

    rects1 = ax.bar(x - width/2, hit5_list, width, label="Source Hit@5 (Taux de réussite)", color=SUNU_NAVY, zorder=3)
    rects2 = ax.bar(x + width/2, mrr_list, width, label="MRR (Rang moyen réciproque)", color=SUNU_TEAL, zorder=3)

    for r in rects1:
        h = r.get_height()
        if h > 0:
            ax.text(r.get_x() + r.get_width()/2., h + 0.02, f"{h:.2f}", ha="center", va="bottom", fontsize=7.8, fontweight="bold", color=SUNU_NAVY)

    ax.set_title("Figure IV.4 : Taux de réussite de la recherche documentaire (Source Hit@5) par catégorie de questions", fontsize=12, fontweight="bold", color=SUNU_NAVY, pad=14)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=8.5)
    ax.set_ylabel("Score de performance", fontsize=10, fontweight="bold", color=SUNU_NAVY)
    ax.set_ylim(0, 1.15)
    ax.grid(axis="y", linestyle="--", alpha=0.5, zorder=0)
    ax.legend(frameon=True, facecolor="white", edgecolor="#CBD5E0", fontsize=9, loc="upper right")

    save(fig, "fig_retrieval_by_category.png")


def fig_corpus_distribution():
    """Figure III.1 : Structure et volumétrie du corpus documentaire SUNU Bank."""
    doc_data = [
        ("Conditions Générales\n(conditions_generales.md)", 41, "Clauses juridiques, garanties, exclusions, rachat"),
        ("Spécifications Produits\n(spec_produits.md)", 37, "Fiches produits détaillées (Visa Études, Retraite)"),
        ("Foire Aux Questions\n(faq.md)", 31, "Questions fréquentes clients & reformulations"),
        ("Notice d'Information\n(notice_information.md)", 24, "Obligations précontractuelles Code CIMA"),
        ("Guide de Souscription\n(guide_souscription.md)", 17, "Parcours client en agence et démarches bancaires"),
    ]

    names = [d[0] for d in doc_data][::-1]
    counts = [d[1] for d in doc_data][::-1]
    descriptions = [d[2] for d in doc_data][::-1]

    fig, ax = plt.subplots(figsize=(11, 5.8), facecolor="white")
    ax.set_facecolor(SUNU_LIGHT_BG)

    bars = ax.barh(names, counts, color=SUNU_NAVY, edgecolor="none", height=0.55, zorder=3)

    for i, bar in enumerate(bars):
        w = bar.get_width()
        ax.text(w + 0.8, bar.get_y() + bar.get_height()/2, f"{w} chunks", va="center", fontsize=9, fontweight="bold", color=SUNU_NAVY)
        ax.text(1, bar.get_y() + bar.get_height()/2, descriptions[i], va="center", fontsize=7.5, color="white", fontweight="bold")

    ax.set_title("Figure III.1 : Structure et volumétrie du corpus documentaire SUNU Bank (150 chunks calibrés)", fontsize=12, fontweight="bold", color=SUNU_NAVY, pad=14)
    ax.set_xlabel("Nombre de Chunks indexés dans ChromaDB (Taille 300 caractères, Chevauchement 30)", fontsize=9.5, fontweight="bold", color=SUNU_NAVY)
    ax.set_xlim(0, 48)
    ax.grid(axis="x", linestyle="--", alpha=0.5, zorder=0)

    save(fig, "fig_corpus_distribution.png")


def main():
    print("=== DÉBUT DE GÉNÉRATION DES FIGURES DU MÉMOIRE ===")
    fig_architecture()
    fig_pipeline()
    fig_chunking()
    fig_embeddings()
    fig_categories()
    fig_retrieval_by_category()
    fig_corpus_distribution()
    print("=== TOUTES LES FIGURES ONT ÉTÉ GÉNÉRÉES AVEC SUCCÈS DANS Memoire/figures/ ===")

if __name__ == "__main__":
    main()
