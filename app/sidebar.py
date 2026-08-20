import streamlit as st


def render_sidebar():
    with st.sidebar:
        st.header("À propos")
        st.info(
            "**Assistant virtuel** dédié aux produits d'assurance vie de SUNU Bank Togo. "
            "Les réponses sont générées à partir des documents officiels du produit "
            "(fiches produits, notices d'information, conditions générales et FAQ)."
        )
        st.header("Contact")
        st.write(
            "**SUNU Bank Togo**\n\n"
            "- Agence SUNU Bank Togo\n"
            "- Service client et bancassurance\n"
            "- Horaires d'ouverture selon l'agence\n"
            "- Accompagnement client pour les produits Visa Études, Visa Études Plus et Horizon Retraite"
        )
        st.markdown('<hr style="margin:0.6rem 0">', unsafe_allow_html=True)
        st.caption(
            "Les informations fournies sont de nature informative et ne se "
            "substituent pas aux conditions générales du contrat."
        )
        st.header("Session")
        st.metric("Messages", len(st.session_state.get("messages", [])))
        if st.button("Effacer la conversation"):
            st.session_state.messages = []
            st.rerun()
