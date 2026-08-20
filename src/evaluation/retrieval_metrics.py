def precision_at_k(retrieved_docs, relevant_doc_ids, k: int) -> float:
    if k <= 0:
        return 0.0
    retrieved = {doc.metadata.get("chunk_id") for doc in retrieved_docs[:k]}
    relevant = set(relevant_doc_ids)
    if not retrieved:
        return 0.0
    return len(retrieved & relevant) / k


def recall_at_k(retrieved_docs, relevant_doc_ids, k: int) -> float:
    retrieved = {doc.metadata.get("chunk_id") for doc in retrieved_docs[:k]}
    relevant = set(relevant_doc_ids)
    if not relevant:
        return 0.0
    return len(retrieved & relevant) / len(relevant)


def mrr(retrieved_docs, relevant_doc_ids) -> float:
    relevant = set(relevant_doc_ids)
    for i, doc in enumerate(retrieved_docs):
        if doc.metadata.get("chunk_id") in relevant:
            return 1.0 / (i + 1)
    return 0.0


def aggregate_scores(results: list[dict]) -> dict:
    metrics = [
        "precision_at_1",
        "precision_at_5",
        "recall_at_5",
        "source_hit_at_1",
        "source_hit_at_5",
        "mrr",
    ]
    aggregated = {}
    for metric in metrics:
        values = [float(r[metric]) for r in results if metric in r]
        aggregated[metric] = sum(values) / len(values) if values else 0.0
    return aggregated
