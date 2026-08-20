import streamlit as st

from src.escalation.escalation import should_escalate
from src.generation.prompts import ESCALATION_MESSAGE
from src.intents.intent_classifier import get_intent_label

Source = dict[str, str]
ChatMessage = dict[str, object]

SUGGESTIONS = [
    "Quelles sont les garanties de Visa Études ?",
    "Comment fonctionne Horizon Retraite ?",
    "Quelle est la différence entre Visa Études et Visa Études Plus ?",
    "Quelles sont les modalités de cotisation ?",
    "Que faire si je souhaite un accompagnement personnalisé ?",
]

WELCOME = (
    "Bonjour et bienvenue ! Je suis votre assistant virtuel dédié aux produits "
    "d'assurance vie de SUNU Bank Togo.\n\n"
    "Posez-moi vos questions sur Visa Études, Visa Études Plus ou Horizon Retraite : "
    "garanties, cotisations, souscription, exclusions, rachat ou conditions générales.\n\n"
    "_Je m'appuie sur les documents officiels et je peux vous orienter vers un conseiller humain si nécessaire._"
)


def _handle_prompt(chain, retriever, prompt):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Je recherche dans les documents du produit..."):
            docs = retriever.invoke(prompt)
            escalation = should_escalate(prompt, docs)
            if escalation["escalate"]:
                response = ESCALATION_MESSAGE.format(question=prompt)
                sources = []
            else:
                response = chain.invoke(prompt)
                sources = [
                    {
                        "document": d.metadata.get("document")
                        or d.metadata.get("source", "inconnu"),
                        "section": d.metadata.get("section", ""),
                    }
                    for d in docs
                ]
        st.markdown(response)
        if escalation.get("intent"):
            st.caption(f"Intention détectée : {get_intent_label(escalation['intent'])}")
        if escalation["escalate"]:
            st.caption(
                "Votre question a été transmise à un conseiller. Prenez contact avec "
                "votre agence pour un accompagnement personnalisé."
            )

    st.session_state.messages.append(
        {"role": "assistant", "content": response, "sources": sources}
    )


def render_chat(chain, retriever):
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": WELCOME, "sources": []}
        ]

    for message in st.session_state.messages:
        role = str(message["role"])
        content = str(message["content"])
        with st.chat_message(role):
            st.markdown(content)

    fresh = len(st.session_state.messages) <= 1
    if fresh:
        st.caption("Suggestions de questions :")
        cols = st.columns(len(SUGGESTIONS))
        for col, question in zip(cols, SUGGESTIONS, strict=True):
            if col.button(question, use_container_width=True):
                _handle_prompt(chain, retriever, question)
                st.rerun()

    if prompt := st.chat_input("Votre question..."):
        _handle_prompt(chain, retriever, prompt)
        st.rerun()
