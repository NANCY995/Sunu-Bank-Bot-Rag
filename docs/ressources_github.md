# Ressources GitHub — Assistant RAG Assurance Éducation

Références techniques collectées pour le mémoire. Les dépôts servent de support
technique et d'inspiration ; les choix méthodologiques du mémoire s'appuient sur
les articles scientifiques et documentations officielles. Ces dépôts sont cités
dans la webographie et dans les annexes du mémoire (section ressources techniques).

## Dépôts orientés assurance

| Dépôt | Lien | Intérêt pour le mémoire |
|---|---|---|
| Insurance-RAG-Chatbot (arpan65) | https://github.com/arpan65/Insurance-RAG-Chatbot | Architecture RAG orientée assurance (AWS Bedrock, LangChain, Docker) |
| RAG System for Insurance Document Q&A (skrsumit250) | https://github.com/skrsumit250/RAG-System-for-Insurance-Document-Q-A | Pipeline chunking/embeddings/retrieval/génération |
| Insurance Documents QA Chatbot (SandeepGitGuy) | https://github.com/SandeepGitGuy/Insurance_Documents_QA_Chatbot_RAG_LlamaIndex_LangGraph | Organisation du pipeline (LlamaIndex + LangGraph) |
| Insurance Document Chatbot (SandeepGitGuy) | https://github.com/SandeepGitGuy/Insurance_Document_Chatbot_RAG | Extraction d'informations depuis des polices complexes |
| In-Surely (Willpro34) | https://github.com/Willpro34/In-Surely | Q&A sur polices avec recherche sémantique et cache |
| ValAct_RAG (DanTCIM) | https://github.com/DanTCIM/ValAct_RAG | Documentation actuarielle assurance vie (PDF → Markdown → ChromaDB → LLM) |
| RAG HelpMate — Life Insurance Policy (satyap84) | https://github.com/satyap84/RAG_HelpMate_Chatbot | Q&A sur police d'assurance vie |

## Frameworks RAG

| Dépôt | Lien | Intérêt |
|---|---|---|
| LangChain | https://github.com/langchain-ai/langchain | Orchestration (chargement, chunking, embeddings, retrieval, génération) |
| LlamaIndex | https://github.com/run-llama/llama_index | Ingestion, indexation, interrogation — alternative à LangChain |
| LlamaIndex-RAG-Document-Chatbot (march038) | https://github.com/march038/LlamaIndex-RAG-Document-Chatbot | Exemple simple avec affichage des sources |
| llamaindexchat (dcarpintero) | https://github.com/dcarpintero/llamaindexchat | Découpage, indexation, citation des sources |
| RAG-LlamaIndex (felipearosr) | https://github.com/felipearosr/RAG-LlamaIndex | Chatbot documentaire (LlamaIndex + Pinecone + Chainlit) |

## Évaluation

| Dépôt | Lien | Intérêt |
|---|---|---|
| RAGAS (explodinggradients) | https://github.com/explodinggradients/ragas | Évaluation automatique : faithfulness, relevancy, context precision/recall |
| Awesome-RAG-Evaluation (yhpeter) | https://github.com/yhpeter/awesome-rag-evaluation | Collection d'articles et benchmarks d'évaluation RAG |
| RAG Evaluation using RAGAS (margitantal68) | https://github.com/margitantal68/rag_paper | Exemple académique d'évaluation RAGAS |
| Chatbot RAG with Evaluation (RitikaVerma7) | https://github.com/RitikaVerma7/Chatbot-RAG_with_Evaluation | Chatbot RAG avec phase d'évaluation |

## Recherche vectorielle

| Dépôt | Lien | Intérêt |
|---|---|---|
| FAISS (Meta) | https://github.com/facebookresearch/faiss | Recherche de similarité à grande échelle |
| Chroma | https://github.com/chroma-core/chroma | Base vectorielle locale légère (retenue pour le prototype) |
| Qdrant | https://github.com/qdrant/qdrant | Moteur vectoriel open source, recherche hybride, reranking |
| Sentence Transformers (UKPLab) | https://github.com/UKPLab/sentence-transformers | Embeddings open source |

## Sécurité

| Dépôt | Lien | Intérêt |
|---|---|---|
| OWASP Top 10 for LLM Applications | https://github.com/GenAI-Security-Project/GenAI-LLM-Top10 | Prompt injection, fuite d'information, empoisonnement du corpus |
| LegalBench-RAG (zeroentropy-ai) | https://github.com/zeroentropy-ai/legalbenchrag | Benchmark RAG sur documents juridiques/réglementaires |

## Dépôts privilégiés pour le mémoire

1. Insurance-RAG-Chatbot — architecture orientée assurance
2. ValAct_RAG — assurance vie (proche du sujet)
3. Insurance Documents QA Chatbot (LlamaIndex + LangGraph) — organisation du pipeline
4. RAGAS — évaluation
5. OWASP Top 10 for LLM — sécurité

## Architecture retenue pour le prototype

Python + LangChain + Sentence Transformers (embeddings locaux) + ChromaDB + Streamlit + RAGAS.
LlamaIndex conserve le rôle d'alternative documentée dans le mémoire.
