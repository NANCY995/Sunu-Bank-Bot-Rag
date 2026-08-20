"""Portail SUNU Bank — point d'entrée avec authentification et navigation.

Lancement : streamlit run src/ui/portal.py
L'API FastAPI doit tourner sur http://localhost:8000 (scripts/run_api.bat).
"""

import streamlit as st

from src.ui.api_client import ApiClient
from src.ui.pages import (
    admin_page,
    analytics_page,
    churn_page,
    dashboard_page,
    fraud_page,
    provisioning_page,
)
from src.ui.theme import apply_theme, hero_banner

st.set_page_config(
    page_title="Portail SUNU Bank",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded",
)

API_URL = "http://localhost:8000/api"

apply_theme()


def _login_form(client: ApiClient):
    hero_banner(
        "🏦 Portail SUNU Bank", "Connexion au portail assurance vie — SUNU Bank Togo"
    )

    tab_login, tab_register = st.tabs(["Se connecter", "Creer un compte"])
    with tab_login, st.form("login"):
        email = st.text_input("Email")
        password = st.text_input("Mot de passe", type="password")
        submitted = st.form_submit_button("Se connecter", type="primary")
        if submitted:
            token, user, error = client.login(email, password)
            if error:
                st.error(error)
            else:
                st.session_state["token"] = token
                st.session_state["user"] = user
                st.rerun()
    with tab_register, st.form("register"):
        email = st.text_input("Email", key="reg_email")
        username = st.text_input("Nom d'utilisateur", key="reg_user")
        full_name = st.text_input("Nom complet", key="reg_name")
        password = st.text_input(
            "Mot de passe (8+ caracteres)", type="password", key="reg_pwd"
        )
        submitted = st.form_submit_button("Creer le compte")
        if submitted:
            token, user, error = client.register(email, username, password, full_name)
            if error:
                st.error(error)
            else:
                st.success("Compte cree ! Vous pouvez vous connecter.")
    st.markdown(
        '<div class="sunu-card" style="margin-top:16px;">'
        '<span style="font-size:0.75rem;color:#646262;">'
        "API : <code>"
        + API_URL
        + "</code> — Lancez <code>scripts/run_api.bat</code> puis rechargez."
        "</span></div>",
        unsafe_allow_html=True,
    )


def main():
    client = ApiClient(API_URL)
    if not client.health():
        st.error("API FastAPI injoignable sur " + API_URL)
        st.info("Lancez `scripts/run_api.bat` puis rechargez la page.")
        return
    if "token" not in st.session_state:
        _login_form(client)
        return
    client.token = st.session_state["token"]

    user = st.session_state["user"]
    st.sidebar.markdown(
        '<div style="padding:16px 0 8px 0;">'
        '<span style="font-size:1rem;font-weight:700;color:#201d1d;">SUNU Bank Togo</span><br>'
        '<span style="font-size:0.75rem;color:#646262;">Portail Assurance Vie</span>'
        "</div>",
        unsafe_allow_html=True,
    )
    st.sidebar.markdown(
        f'<div style="padding:8px 0;border-top:1px solid rgba(15,0,0,0.12);">'
        f'<span style="font-size:0.75rem;color:#424245;">{user.get("full_name") or user.get("username")}</span><br>'
        f'<span class="sunu-badge" style="font-size:0.65rem;">{user.get("role", "").upper()}</span>'
        f"</div>",
        unsafe_allow_html=True,
    )

    pages = {
        "📊 Tableau de bord": dashboard_page.render,
        "🤖 Chat RAG": analytics_page.render_chat,
        "📈 Analytics RAG": analytics_page.render_analytics,
        "🏦 Provisionnement": provisioning_page.render,
        "⚠️ Risque de churn": churn_page.render,
        "🛡️ Détection de fraude": fraud_page.render,
    }
    if user.get("role") == "admin":
        pages["👥 Administration"] = admin_page.render

    choice = st.sidebar.radio("Navigation", list(pages.keys()))
    if st.sidebar.button("Se deconnecter", type="secondary"):
        st.session_state.clear()
        st.rerun()
    pages[choice](client)


if __name__ == "__main__":
    main()
