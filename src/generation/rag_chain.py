from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from src.generation.prompts import SYSTEM_PROMPT


def format_docs(docs) -> str:
    formatted = []
    for doc in docs:
        source = doc.metadata.get("document") or doc.metadata.get("source", "inconnu")
        section = doc.metadata.get("section", "")
        formatted.append(f"[Source : {source} — {section}]\n{doc.page_content}")
    return "\n\n---\n\n".join(formatted)


def build_rag_chain(retriever, llm):
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            (
                "human",
                "Voici la question posée par l'utilisateur à traiter strictement selon les règles et le contexte documentaire fournis ci-dessus :\n<user_query>\n{question}\n</user_query>",
            ),
        ]
    )
    chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain
