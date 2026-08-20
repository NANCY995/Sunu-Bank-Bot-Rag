"""Pages : chat RAG et analytics d'évaluation."""

import json

import pandas as pd
import plotly.express as px
import streamlit as st

from src.ui.theme import apply_theme, hero_banner, kpi_card, section_header
from src.utils.config import EVALUATION_DATA_DIR

METRIC_LABELS = {
    "faithfulness": "Faithfulness (fidelite)",
    "answer_relevancy": "Answer relevancy (pertinence)",
    "context_precision": "Context precision (precision du contexte)",
    "context_recall": "Context recall (couverture du contexte)",
}


def render_chat(client) -> None:
    apply_theme()
    hero_banner(
        "Chat RAG", "Questions sur Visa Etudes, Visa Etudes Plus et Horizon Retraite."
    )

    if "rag_history" not in st.session_state:
        st.session_state["rag_history"] = []

    for entry in st.session_state["rag_history"]:
        with st.chat_message(entry["role"]):
            st.markdown(entry["content"])

    prompt = st.chat_input("Votre question...")
    if prompt:
        st.session_state["rag_history"].append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        with st.chat_message("assistant"):
            with st.spinner("Recherche dans les documents..."):
                data, error = client.chat(prompt)
            if error:
                st.error(error)
            else:
                st.markdown(data["answer"])
                if data.get("escalated"):
                    st.markdown(
                        '<span class="sunu-badge sunu-badge-warning">ESCALADE</span>',
                        unsafe_allow_html=True,
                    )
        st.session_state["rag_history"].append(
            {"role": "assistant", "content": error if error else data["answer"]}
        )


def _load_checkpoint_scores() -> pd.DataFrame | None:
    path = EVALUATION_DATA_DIR / "ragas_checkpoint.json"
    if not path.exists():
        return None
    try:
        ckpt = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None
    rows = []
    for metric, values in ckpt.items():
        if metric.startswith("_"):
            continue
        for index, score in values.items():
            if score is not None:
                rows.append(
                    {"index": int(index), "metric": metric, "score": float(score)}
                )
    if not rows:
        return None
    return pd.DataFrame(rows)


def render_analytics(client) -> None:
    apply_theme()
    hero_banner("Analytics RAG", "Evaluation du systeme RAG — retrieval et RAGAS")

    data, error = client.rag_stats()
    if error:
        st.error(f"Impossible de charger les stats : {error}")
        return

    section_header("Evaluation du retrieval (75 questions)")
    retrieval = data.get("retrieval", {})
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown(
            kpi_card("Source hit@1", f"{retrieval.get('source_hit_at_1', 0):.3f}"),
            unsafe_allow_html=True,
        )
    with c2:
        st.markdown(
            kpi_card("Source hit@5", f"{retrieval.get('source_hit_at_5', 0):.3f}"),
            unsafe_allow_html=True,
        )
    with c3:
        st.markdown(
            kpi_card("Precision@1", f"{retrieval.get('precision_at_1', 0):.3f}"),
            unsafe_allow_html=True,
        )
    with c4:
        st.markdown(
            kpi_card("MRR", f"{retrieval.get('mrr', 0):.3f}"), unsafe_allow_html=True
        )

    section_header("Evaluation RAGAS (juge local Qwen2.5-1.5B)")
    ragas = data.get("ragas", {})
    if ragas:
        c1, c2, c3, c4 = st.columns(4)
        for col, (key, label) in zip(
            (c1, c2, c3, c4), METRIC_LABELS.items(), strict=True
        ):
            value = ragas.get(key)
            with col:
                val_str = f"{value:.3f}" if isinstance(value, (int, float)) else "—"
                st.markdown(
                    kpi_card(label.split(" (")[0], val_str), unsafe_allow_html=True
                )

        df = pd.DataFrame(
            [
                {"metrique": METRIC_LABELS[k], "score": v}
                for k, v in ragas.items()
                if isinstance(v, (int, float))
            ]
        )
        if not df.empty:
            fig = px.bar(
                df,
                x="metrique",
                y="score",
                range_y=[0, 1],
                color="score",
                color_continuous_scale="Viridis",
                title="Scores RAGAS",
            )
            fig.update_layout(
                font={"family": "JetBrains Mono, IBM Plex Mono, monospace", "size": 12},
                paper_bgcolor="#fdfcfc",
                plot_bgcolor="#fdfcfc",
                font_color="#201d1d",
                title_font_color="#201d1d",
                title_font_size=14,
                margin={"l": 0, "r": 0, "t": 40, "b": 0},
                coloraxis_showscale=False,
                xaxis={"showgrid": False, "linecolor": "rgba(15,0,0,0.12)"},
                yaxis={
                    "showgrid": True,
                    "gridcolor": "rgba(15,0,0,0.12)",
                    "linecolor": "rgba(15,0,0,0.12)",
                },
            )
            st.markdown('<div class="sunu-card">', unsafe_allow_html=True)
            st.plotly_chart(fig, use_container_width=True)
            st.markdown("</div>", unsafe_allow_html=True)
    else:
        st.markdown(
            '<div class="sunu-card" style="border-left:3px solid #ff9f0a;">'
            '<span class="sunu-badge sunu-badge-warning">EN ATTENTE</span> '
            "Aucun score RAGAS final disponible. Le run d'evaluation est peut-etre en cours."
            "</div>",
            unsafe_allow_html=True,
        )

    checkpoint = _load_checkpoint_scores()
    if checkpoint is not None and not checkpoint.empty:
        section_header("Progression du run RAGAS (checkpoint)")
        count = (
            checkpoint.groupby("metric")["score"]
            .count()
            .reindex(METRIC_LABELS, fill_value=0)
        )
        st.dataframe(
            pd.DataFrame(
                {
                    "metrique": [METRIC_LABELS[m] for m in count.index],
                    "lignes evaluees": count.values,
                }
            ),
            hide_index=True,
            use_container_width=True,
        )
