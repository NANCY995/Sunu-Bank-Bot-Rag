"""Assistant RAG SUNU Bank Togo — Interface d'application unique factorisée.

Lancement :
    streamlit run app/app.py
"""

import sys
from pathlib import Path

# Ajouter la racine du projet au PYTHONPATH pour les imports
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

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
from src.ui.theme import apply_theme

st.set_page_config(
    page_title="Portail SUNU Bank Togo",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded",
)

API_URL = "http://localhost:8000/api"

apply_theme()


def _login_form(client: ApiClient):
    # CSS spécifique pour centrer la carte de login façon portail React
    st.markdown(
        """
        <style>
        .main .block-container {
            max-width: 480px !important;
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
            margin: auto !important;
        }
        div[data-testid="stForm"] {
            background-color: #FFFFFF !important;
            border: 1px solid #E2E8F0 !important;
            border-radius: 16px !important;
            padding: 24px !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01) !important;
        }
        .stTabs [data-baseweb="tab-list"] {
            background-color: #F1F5F9 !important;
            border-radius: 12px !important;
            padding: 4px !important;
            gap: 4px !important;
            border: 1px solid #E2E8F0 !important;
        }
        .stTabs [data-baseweb="tab"] {
            border-radius: 8px !important;
            font-size: 0.85rem !important;
            font-weight: 600 !important;
            padding: 8px 16px !important;
            color: #64748B !important;
            background-color: transparent !important;
            border: none !important;
        }
        .stTabs [aria-selected="true"] {
            background-color: #FFFFFF !important;
            color: #0F172A !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
        }
        div.stButton > button[kind="primary"] {
            background-color: #E21E26 !important;
            border-color: #E21E26 !important;
            color: #FFFFFF !important;
            font-weight: 700 !important;
            border-radius: 12px !important;
            padding: 10px 20px !important;
            box-shadow: 0 4px 12px rgba(226, 30, 38, 0.25) !important;
            transition: all 0.2s ease !important;
        }
        div.stButton > button[kind="primary"]:hover {
            background-color: #C91920 !important;
            border-color: #C91920 !important;
            transform: translateY(-1px) !important;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    logo_url = "https://lh3.googleusercontent.com/aida-public/AB6AXuDV96CYYVnVtiTSrnMZbTbekRWozE4XY7QYJafa8kN1RKq6erZu6iCvAX0EnEstkskH1gGz9KOM2aIMI1yIM05bRVvN4GrbJ0E1OJV2JtALh6mjErZnw2NMa35oA6f3ejjM868hkl81fJia0zV-L3i_ROMB_bO26Nfkgi95QbF7Z9jW4xNPfMuufXVMPbpD24Z_MTN-FDozNN-I477gZfnKSjlJOWy4p6yRm6EFYg0sNw_gZiCtFZAvhJLCIf7YTciLxA"

    st.markdown(
        f"""
        <div style="text-align:center; margin-bottom: 24px;">
            <div style="display:inline-flex; align-items:center; gap:12px; margin-bottom:12px;">
                <img src="{logo_url}" alt="SUNU Logo" style="height:44px; border-radius:6px; object-contain:contain;" />
                <div style="text-align:left;">
                    <span style="font-family:'Outfit',sans-serif; font-size:1.1rem; font-weight:800; color:#0F172A; display:block; line-height:1.1; letter-spacing:0.05em;">SUNU BANK</span>
                    <span style="font-size:0.65rem; font-weight:700; color:#E21E26; letter-spacing:0.15em; text-transform:uppercase;">TOGO • RAG PORTAL</span>
                </div>
            </div>
            <h2 style="font-family:'Outfit',sans-serif; font-size:1.4rem; font-weight:700; color:#0F172A; margin:0 0 4px 0;">Connexion au Portail</h2>
            <p style="font-size:0.85rem; color:#64748B; margin:0;">Portail intelligent d'assurance vie, scoring et conformité CIMA</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    tab_login, tab_register = st.tabs(["🔐 Se connecter", "📝 Inscription"])

    with tab_login, st.form("login_form"):
        email = st.text_input("Adresse Email", placeholder="votre.email@sunubank.tg")
        password = st.text_input("Mot de passe", type="password", placeholder="••••••••")
        submitted = st.form_submit_button("Accéder au Portail →", type="primary", use_container_width=True)
        if submitted:
            token, user, error = client.login(email, password)
            if error:
                st.error(f"⚠️ {error}")
            else:
                st.success("✅ Connexion réussie !")
                st.session_state["token"] = token
                st.session_state["user"] = user
                st.rerun()

    with tab_register, st.form("register_form"):
        full_name = st.text_input("Nom complet", placeholder="ex. Koffi Mensah")
        username = st.text_input("Nom d'utilisateur", placeholder="ex. kmensah")
        reg_email = st.text_input("Adresse Email", placeholder="votre.email@sunubank.tg")
        reg_password = st.text_input("Mot de passe (8+ caractères)", type="password", placeholder="••••••••")
        submitted_reg = st.form_submit_button("Créer mon compte →", type="primary", use_container_width=True)
        if submitted_reg:
            token, user, error = client.register(reg_email, username, reg_password, full_name)
            if error:
                st.error(f"⚠️ {error}")
            else:
                st.success("✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.")

    st.markdown(
        """
        <div style="text-align:center; margin-top:20px; font-size:0.75rem; color:#94A3B8; display:flex; align-items:center; justify-content:center; gap:6px;">
            <span style="color:#10B981;">🛡️</span>
            <span>Sécurisé par JWT & Chiffrement SHA-256 • Conformité CIMA</span>
        </div>
        """,
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

    logo_path = project_root / "src" / "ui" / "static" / "LOGO-SUNU.png"
    if not logo_path.exists():
        logo_path = project_root / "LOGO-SUNU.png"

    if logo_path.exists():
        st.sidebar.image(str(logo_path), width=160)

    st.sidebar.markdown(
        '<div style="padding:16px;background:linear-gradient(135deg, #1E232E 0%, #2A303C 100%);margin:-16px -16px 16px -16px;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">'
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">'
        '<div>'
        '<span style="font-family:\'Outfit\',sans-serif;font-size:1.1rem;font-weight:700;color:#FFFFFF;display:block;">SUNU Bank Togo</span>'
        '<span style="font-size:0.75rem;color:#B3B8C2;display:block;">Portail RAG & Assurance Vie</span>'
        '</div>'
        '</div>'
        '</div>',
        unsafe_allow_html=True,
    )

    # User profile badge
    st.sidebar.markdown(
        f'<div style="padding:12px;background:#FFFFFF;border:1px solid rgba(0,0,0,0.06);border-radius:12px;margin-bottom:24px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">'
        f'<div style="display:flex;align-items:center;gap:12px;">'
        f'<div style="width:36px;height:36px;background:linear-gradient(135deg, #0062FF 0%, #3385FF 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#FFFFFF;font-weight:700;font-size:1rem;font-family:\'Outfit\',sans-serif;">'
        f'{(user.get("full_name") or user.get("username") or "U")[0].upper()}'
        f'</div>'
        f'<div>'
        f'<span style="font-family:\'Outfit\',sans-serif;font-size:0.9375rem;font-weight:600;color:#1A1A1A;display:block;">{user.get("full_name") or user.get("username")}</span>'
        f'<span class="sunu-badge" style="font-size:0.65rem;margin-top:4px;">{user.get("role", "").upper()}</span>'
        f'</div>'
        f'</div>'
        f'</div>',
        unsafe_allow_html=True,
    )

    st.sidebar.markdown(
        '<div style="font-family:\'Outfit\',sans-serif;font-size:0.75rem;font-weight:700;color:#8C92A4;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;margin-left:4px;">Menu Principal</div>',
        unsafe_allow_html=True,
    )

    pages = {
        "📊 Tableau de bord": dashboard_page.render,
        "🤖 Chat RAG": analytics_page.render_chat,
        "📈 Analytics RAG": analytics_page.render_analytics,
        "💰 Provisionnement": provisioning_page.render,
        "🔄 Risque de Churn": churn_page.render,
        "🛡️ Détection de Fraude": fraud_page.render,
    }

    if user.get("role") == "admin":
        pages["👥 Administration"] = admin_page.render

    choice = st.sidebar.radio("Navigation", list(pages.keys()), label_visibility="collapsed")

    if st.sidebar.button("🚪 Se déconnecter", type="secondary", use_container_width=True):
        st.session_state.clear()
        st.rerun()

    pages[choice](client)


if __name__ == "__main__":
    main()
