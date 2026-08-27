"""Page : prédiction de provisionnement (contrats d'assurance vie)."""

import streamlit as st

from src.ui.theme import apply_theme, hero_banner

PRODUCTS = ["Visa Études", "Visa Études Plus", "Horizon Retraite"]


def render(client) -> None:
    apply_theme()
    hero_banner(
        "Provisionnement",
        "Estimation du montant de provisionnement d'un contrat d'assurance vie "
        "(GradientBoosting sur donnees simulees).",
    )

    with st.form("provisioning"):
        st.markdown(
            '<span class="sunu-badge">PARAMETRES DU CONTRAT</span>',
            unsafe_allow_html=True,
        )
        st.markdown('<div style="height:12px;"></div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        age = c1.number_input("Age de l'assure", 18, 90, 35)
        product = c2.selectbox("Produit", PRODUCTS)
        premium = c1.number_input(
            "Prime annuelle (FCFA)", 5_000, 500_000, 50_000, step=5_000
        )
        duration = c2.number_input("Duree du contrat (annees)", 1, 50, 10)
        sum_assured = st.number_input(
            "Capital assure (FCFA)", 100_000, 20_000_000, 1_000_000, step=100_000
        )
        submitted = st.form_submit_button("Calculer le provisionnement", type="primary")

    if submitted:
        features = {
            "age": int(age),
            "product": product,
            "premium": float(premium),
            "duration_years": int(duration),
            "sum_assured": float(sum_assured),
        }
        with st.spinner("Calcul en cours..."):
            data, error = client.predict_provisioning(features)
        if error:
            st.error(error)
        else:
            amount = data["provisioning_amount"]
            st.markdown(
                '<div class="sunu-card" style="border-left:4px solid #34C759;">'
                '<span class="sunu-badge sunu-badge-success">RESULTAT</span><br><br>'
                f'<span style="font-family:\'Outfit\',sans-serif;font-size:2.5rem;font-weight:700;color:#1A1A1A;">{amount:,.0f} FCFA</span>'
                "<br>"
                '<span style="font-size:0.875rem;color:#8C92A4;font-weight:500;">Modèle : GradientBoostingRegressor — R² ≈ 0,86</span>'
                "</div>",
                unsafe_allow_html=True,
            )

    st.markdown('<div style="height:24px;"></div>', unsafe_allow_html=True)
    with st.expander("Synthèse du portefeuille (contrats en base)"):
        portfolio, p_error = client.portfolio_summary()
        if p_error:
            st.warning(f"Portefeuille indisponible : {p_error}")
        elif portfolio and portfolio.get("number_contracts", 0) > 0:
            c1, c2, c3, c4 = st.columns(4)
            c1.metric("Contrats", portfolio["number_contracts"])
            c2.metric("Provision totale", f"{portfolio['total_provision']:,.0f} FCFA")
            c3.metric(
                "Provision moyenne", f"{portfolio['average_provision']:,.0f} FCFA"
            )
            c4.metric("Provision max", f"{portfolio['max_provision']:,.0f} FCFA")
            st.markdown("**Par produit (FCFA)**")
            st.write(portfolio.get("by_product", {}))
            st.markdown("**Par niveau de risque**")
            st.write(portfolio.get("by_risk_level", {}))
