import unittest

from langchain_core.documents import Document

from src.evaluation.retrieval_metrics import (
    aggregate_scores,
    mrr,
    precision_at_k,
    recall_at_k,
)


def make_docs(ids):
    return [Document(page_content="", metadata={"chunk_id": i}) for i in ids]


class TestRetrievalMetrics(unittest.TestCase):
    def test_precision_at_k(self):
        docs = make_docs([1, 2, 3, 4, 5])
        self.assertEqual(precision_at_k(docs, [1, 2], 5), 2 / 5)

    def test_precision_at_k_zero(self):
        docs = make_docs([1, 2, 3])
        self.assertEqual(precision_at_k(docs, [9], 5), 0.0)

    def test_recall_at_k(self):
        docs = make_docs([1, 2, 3])
        self.assertEqual(recall_at_k(docs, [1, 3, 7], 5), 2 / 3)

    def test_mrr_first_position(self):
        docs = make_docs([5, 1, 2])
        self.assertEqual(mrr(docs, [1]), 0.5)

    def test_mrr_no_match(self):
        docs = make_docs([5, 6])
        self.assertEqual(mrr(docs, [1]), 0.0)

    def test_aggregate_scores(self):
        results = [
            {"precision_at_5": 0.4, "recall_at_5": 0.5, "mrr": 1.0},
            {"precision_at_5": 0.6, "recall_at_5": 0.25, "mrr": 0.5},
        ]
        agg = aggregate_scores(results)
        self.assertAlmostEqual(agg["precision_at_5"], 0.5)
        self.assertAlmostEqual(agg["recall_at_5"], 0.375)
        self.assertAlmostEqual(agg["mrr"], 0.75)


if __name__ == "__main__":
    unittest.main()
