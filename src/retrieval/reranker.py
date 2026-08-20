class Reranker:
    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model_name = model_name
        self._model = None

    def _load(self):
        if self._model is None:
            from sentence_transformers import CrossEncoder

            self._model = CrossEncoder(self.model_name)
        return self._model

    def rerank(self, query: str, docs: list, top_k: int | None = None):
        model = self._load()
        pairs = [(query, doc.page_content) for doc in docs]
        scores = model.predict(pairs)
        ranked = sorted(
            zip(docs, scores, strict=True), key=lambda item: item[1], reverse=True
        )
        top_k = top_k or len(ranked)
        return [doc for doc, _ in ranked[:top_k]]
