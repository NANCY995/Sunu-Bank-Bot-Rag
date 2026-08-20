import unittest

from langchain_core.documents import Document

from src.escalation.escalation import should_escalate
from src.generation.rag_chain import format_docs


class TestEscalation(unittest.TestCase):
    def test_no_documents_escalates(self):
        result = should_escalate("Question quelconque", [])
        self.assertTrue(result["escalate"])

    def test_out_of_scope_keyword_escalates(self):
        docs = [Document(page_content="contenu")]
        result = should_escalate("Comment déclarer un sinistre automobile ?", docs)
        self.assertTrue(result["escalate"])

    def test_in_scope_does_not_escalate(self):
        docs = [Document(page_content="contenu")]
        result = should_escalate(
            "Comment fonctionne l'assurance vie en bancassurance ?", docs
        )
        self.assertFalse(result["escalate"])

    def test_low_similarity_escalates(self):
        docs = [Document(page_content="contenu")]
        result = should_escalate("Question", docs, similarity_scores=[0.1])
        self.assertTrue(result["escalate"])


class TestFormatDocs(unittest.TestCase):
    def test_format_docs_includes_sources(self):
        doc = Document(
            page_content="Contenu du passage",
            metadata={"document": "faq.md", "section": "Cotisations"},
        )
        formatted = format_docs([doc])
        self.assertIn("faq.md", formatted)
        self.assertIn("Cotisations", formatted)
        self.assertIn("Contenu du passage", formatted)


if __name__ == "__main__":
    unittest.main()
