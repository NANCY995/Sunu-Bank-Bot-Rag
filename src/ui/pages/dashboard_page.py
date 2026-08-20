"""Page : tableau de bord avec KPIs globaux."""

import streamlit as st

from src.ui.theme import apply_theme, hero_banner, kpi_card, section_header


def render(client) -> None:
    apply_theme()

    hero_banner(
        "Tableau de bord",
        "Vue d'ensemble du portail SUNU Bank Togo — assurance vie",
    )

    kpis, error = client.kpis()
    if error:
        st.error(f"Impossible de charger les KPIs : {error}")
        return

    st.markdown('<div style="height:24px;"></div>', unsafe_allow_html=True)

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown(
            kpi_card("Utilisateurs", str(kpis.get("users", 0))), unsafe_allow_html=True
        )
    with c2:
        st.markdown(
            kpi_card("Conversations", str(kpis.get("conversations", 0))),
            unsafe_allow_html=True,
        )
    with c3:
        st.markdown(
            kpi_card("Contrats", str(kpis.get("contracts", 0))), unsafe_allow_html=True
        )
    with c4:
        frauds = kpis.get("frauds", 0)
        delta = f"{frauds} signalée(s)" if frauds else "aucune"
        st.markdown(kpi_card("Fraudes", str(frauds), delta), unsafe_allow_html=True)

    section_header("Activite recente")

    escalations = kpis.get("escalations", 0)
    conversations = kpis.get("conversations", 0)
    taux = (escalations / conversations * 100) if conversations else 0.0

    c1, c2 = st.columns(2)
    with c1:
        st.markdown(
            kpi_card("Escalades vers conseiller", str(escalations)),
            unsafe_allow_html=True,
        )
    with c2:
        delta = f"+{taux:.1f}%" if taux > 0 else "0%"
        st.markdown(
            kpi_card("Taux d'escalade", f"{taux:.1f} %", delta), unsafe_allow_html=True
        )

    st.markdown(
        '<div class="sunu-card" style="margin-top:32px;">'
        '<span style="font-size:0.75rem;color:#646262;text-transform:uppercase;letter-spacing:0.05em;">INFO</span><br>'
        "Portail de demonstration : les donnees de contrats et transactions sont simulees. "
        "Les statistiques RAG (retrieval + RAGAS) sont visibles dans la page Analytics."
        "</div>",
        unsafe_allow_html=True,
    )
