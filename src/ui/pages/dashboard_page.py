"""Page : tableau de bord avec KPIs globaux."""

import streamlit as st

from src.ui.theme import apply_theme, hero_banner, kpi_card, section_header


def render(client) -> None:
    apply_theme()

    # Modern hero banner with gradient
    hero_banner("Tableau de bord", "Vue d'ensemble du portail SUNU Bank Togo — assurance vie")

    kpis, error = client.kpis()
    if error:
        st.error(f"Impossible de charger les KPIs : {error}")
        return

    st.markdown('<div style="height:16px;"></div>', unsafe_allow_html=True)

    # Enhanced KPI cards with icons and better styling
    c1, c2, c3, c4 = st.columns(4)
    
    with c1:
        st.markdown(kpi_card("👥 Utilisateurs", str(kpis.get("users", 0))), unsafe_allow_html=True)
    with c2:
        st.markdown(kpi_card("💬 Conversations", str(kpis.get("conversations", 0))), unsafe_allow_html=True)
    with c3:
        st.markdown(kpi_card("📋 Contrats", str(kpis.get("contracts", 0))), unsafe_allow_html=True)
    with c4:
        frauds = kpis.get("frauds", 0)
        delta_str = "+⚠️" if frauds > 0 else "OK"
        st.markdown(kpi_card("🛡️ Fraudes", str(frauds), delta=delta_str, delta_suffix=" signalée(s)" if frauds > 0 else ""), unsafe_allow_html=True)

    st.markdown('<div style="height:24px;"></div>', unsafe_allow_html=True)

    # Activity section with enhanced styling
    section_header("Activité récente")

    escalations = kpis.get("escalations", 0)
    conversations = kpis.get("conversations", 0)
    taux = (escalations / conversations * 100) if conversations else 0.0

    c1, c2 = st.columns(2)
    
    with c1:
        st.markdown(kpi_card("📞 Escalades", str(escalations)), unsafe_allow_html=True)
    with c2:
        st.markdown(kpi_card("📈 Taux d'escalade", f"{taux:.1f}%", delta=f"{taux:.1f}%"), unsafe_allow_html=True)

    # Info card with better styling
    st.markdown(
        '<div class="sunu-card" style="border-left:4px solid #0062FF;">'
        '<div style="display:flex;align-items:center;gap:12px;">'
        '<span style="font-size:1.5rem;">ℹ️</span>'
        '<div>'
        '<span style="font-size:0.75rem;font-weight:700;color:#8C92A4;text-transform:uppercase;letter-spacing:0.05em;">INFO</span><br>'
        '<span style="font-size:0.875rem;color:#4A505C;">Portail de démonstration : les données de contrats et transactions sont simulées. '
        'Les statistiques RAG (retrieval + RAGAS) sont visibles dans la page Analytics.</span>'
        '</div>'
        '</div>'
        '</div>',
        unsafe_allow_html=True,
    )
