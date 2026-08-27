"""Page : détection de fraude sur les transactions."""

import streamlit as st

from src.ui.theme import apply_theme, hero_banner

TX_TYPES = ["cotisation", "rachat", "versement", "remboursement"]


def render(client) -> None:
    apply_theme()
    hero_banner(
        "Detection de fraude",
        "Analyse d'anomalie d'une transaction "
        "(Isolation Forest, contamination 4 % sur donnees simulees).",
    )

    with st.form("fraud"):
        st.markdown(
            '<span class="sunu-badge">TRANSACTION</span>',
            unsafe_allow_html=True,
        )
        st.markdown('<div style="height:12px;"></div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        amount = c1.number_input(
            "Montant (FCFA)", 1_000, 100_000_000, 500_000, step=10_000
        )
        tx_type = c2.selectbox("Type de transaction", TX_TYPES)
        submitted = st.form_submit_button("Analyser la transaction", type="primary")

    if submitted:
        with st.spinner("Analyse en cours..."):
            data, error = client.predict_fraud(float(amount), tx_type)
        if error:
            st.error(error)
        else:
            if data["is_fraud"]:
                st.markdown(
                    f'<div class="sunu-card" style="border-left:4px solid #FF3B30;">'
                    f'<span class="sunu-badge sunu-badge-danger">[!!] SUSPECT</span>'
                    f"<br><br>"
                    f'<span style="font-size:0.9375rem;color:#4A505C;font-weight:500;">'
                    f"Score d'anomalie : <strong style='font-family:Outfit,sans-serif;font-size:1.1rem;color:#1A1A1A;'>{data['fraud_score']}</strong></span>"
                    f"<br><br>"
                    f'<span style="font-size:0.9375rem;color:#4A505C;font-weight:500;">'
                    f"Bloquer et transmettre au service de conformite.</span>"
                    f"</div>",
                    unsafe_allow_html=True,
                )
            else:
                st.markdown(
                    f'<div class="sunu-card" style="border-left:4px solid #34C759;">'
                    f'<span class="sunu-badge sunu-badge-success">[OK] NORMAL</span>'
                    f"<br><br>"
                    f'<span style="font-size:0.9375rem;color:#4A505C;font-weight:500;">'
                    f"Score d'anomalie : <strong style='font-family:Outfit,sans-serif;font-size:1.1rem;color:#1A1A1A;'>{data['fraud_score']}</strong></span>"
                    f"</div>",
                    unsafe_allow_html=True,
                )
