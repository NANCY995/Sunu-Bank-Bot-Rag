"""Page : administration des utilisateurs (réservée aux admins)."""

import streamlit as st

from src.ui.theme import apply_theme, hero_banner, section_header

ROLES = ["agent", "admin"]


def render(client) -> None:
    apply_theme()
    hero_banner("Administration", "Gestion des utilisateurs du portail (acces admin).")

    users, error = client.list_users()
    if error:
        st.error(error)
        return

    section_header("Liste des utilisateurs")
    if users:
        import pandas as pd

        df = pd.DataFrame(
            [
                {
                    "id": u["id"],
                    "email": u["email"],
                    "username": u["username"],
                    "nom": u["full_name"],
                    "role": u["role"],
                    "actif": u["is_active"],
                }
                for u in users
            ]
        )
        st.dataframe(df, hide_index=True, use_container_width=True)
    else:
        st.markdown(
            '<div class="sunu-card"><span class="sunu-badge">AUCUN UTILISATEUR</span></div>',
            unsafe_allow_html=True,
        )

    section_header("Creer un utilisateur")
    with st.form("create_user"):
        st.markdown(
            '<span class="sunu-badge">NOUVEAU COMPTE</span>',
            unsafe_allow_html=True,
        )
        st.markdown('<div style="height:12px;"></div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        email = c1.text_input("Email")
        username = c2.text_input("Nom d'utilisateur")
        full_name = st.text_input("Nom complet")
        c3, c4 = st.columns(2)
        password = c3.text_input("Mot de passe (8+ caracteres)", type="password")
        role = c4.selectbox("Role", ROLES)
        submitted = st.form_submit_button("Creer", type="primary")

    if submitted:
        _, err = client.create_user(
            {
                "email": email,
                "username": username,
                "password": password,
                "full_name": full_name,
                "role": role,
            }
        )
        if err:
            st.error(err)
        else:
            st.markdown(
                '<div class="sunu-card" style="border-left:3px solid #30d158;">'
                '<span class="sunu-badge sunu-badge-success">[OK] CREE</span><br><br>'
                '<span style="font-size:0.875rem;color:#424245;">Utilisateur cree avec succes.</span>'
                "</div>",
                unsafe_allow_html=True,
            )
            st.rerun()
