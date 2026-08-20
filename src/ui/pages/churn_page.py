"""Page : prédiction du risque de churn (rachat anticipé)."""

import streamlit as st

from src.ui.pages.provisioning_page import PRODUCTS
from src.ui.theme import apply_theme, hero_banner


def render(client) -> None:
    apply_theme()
    hero_banner(
        "Risque de churn",
        "Probabilite qu'un assure rachete son contrat prematurement "
        "(RandomForest sur donnees simulees).",
    )

    with st.form("churn"):
        st.markdown(
            '<span class="sunu-badge">PARAMETRES DU CONTRAT</span>',
            unsafe_allow_html=True,
        )
        st.markdown('<div style="height:12px;"></div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        age = c1.number_input("Age de l'assure", 18, 90, 45)
        product = c2.selectbox("Produit", PRODUCTS)
        premium = c1.number_input(
            "Prime annuelle (FCFA)", 5_000, 500_000, 30_000, step=5_000
        )
        duration = c2.number_input("Duree ecoulee (annees)", 1, 50, 15)
        sum_assured = st.number_input(
            "Capital assure (FCFA)", 100_000, 20_000_000, 800_000, step=100_000
        )
        submitted = st.form_submit_button("Evaluer le risque", type="primary")

    if submitted:
        features = {
            "age": int(age),
            "product": product,
            "premium": float(premium),
            "duration_years": int(duration),
            "sum_assured": float(sum_assured),
        }
        with st.spinner("Calcul en cours..."):
            data, error = client.predict_churn(features)
        if error:
            st.error(error)
        else:
            proba = data["churn_probability"]
            level = data["risk_level"]

            if proba < 0.3:
                color = "#30d158"
                variant = "success"
                icon = "[OK]"
                msg = "Risque faible : aucun suivi particulier necessaire."
            elif proba < 0.5:
                color = "#ff9f0a"
                variant = "warning"
                icon = "[!]"
                msg = "Risque modere : monitorer le comportement de l'assure."
            else:
                color = "#ff3b30"
                variant = "danger"
                icon = "[!!]"
                msg = (
                    "Recommandation : proposer un entretien de fidelisation ou "
                    "une offre de rachat partiel avant l'echeance."
                )

            st.markdown(
                f'<div class="sunu-card" style="border-left:3px solid {color};">'
                f'<span class="sunu-badge sunu-badge-{variant}">{icon} {level.upper()}</span>'
                f"<br><br>"
                f'<span style="font-size:2rem;font-weight:700;color:#201d1d;">{proba * 100:.1f} %</span>'
                f"<br>"
                f'<span style="font-size:0.75rem;color:#646262;">Probabilite de churn</span>'
                f"<br><br>"
                f'<span style="font-size:0.875rem;color:#424245;">{msg}</span>'
                f"</div>",
                unsafe_allow_html=True,
            )
