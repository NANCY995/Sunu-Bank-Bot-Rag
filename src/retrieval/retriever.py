from src.utils.config import SCORE_THRESHOLD, TOP_K


def create_retriever(
    vectorstore,
    top_k: int | None = None,
    score_threshold: float | None = None,
    search_type: str = "similarity",
):
    top_k = top_k or TOP_K
    search_kwargs: dict = {"k": top_k}
    if search_type == "similarity_score_threshold":
        search_kwargs["score_threshold"] = (
            SCORE_THRESHOLD if score_threshold is None else score_threshold
        )
    return vectorstore.as_retriever(
        search_type=search_type,
        search_kwargs=search_kwargs,
    )
