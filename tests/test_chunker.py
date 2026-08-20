import unittest

from langchain_core.documents import Document

from src.corpus.chunker import chunk_documents, extract_section
from src.corpus.loader import load_corpus
from src.corpus.preprocessor import normalize_text, preprocess_documents


class TestCorpus(unittest.TestCase):
    def test_extract_section(self):
        text = "# Titre principal\n\nContenu du document."
        self.assertEqual(extract_section(text), "Titre principal")

    def test_extract_section_empty(self):
        self.assertEqual(extract_section("pas de titre"), "")

    def test_normalize_text(self):
        raw = "  Ligne   1  \n\n   Ligne 2  \n"
        self.assertEqual(normalize_text(raw), "Ligne 1\nLigne 2")

    def test_preprocess_documents(self):
        doc = Document(
            page_content="  Contenu  ",
            metadata={"source": "data/raw/spec_produits.md"},
        )
        processed = preprocess_documents([doc])[0]
        self.assertEqual(processed.metadata["source_type"], "spec_produits")
        self.assertEqual(processed.metadata["document"], "spec_produits.md")

    def test_chunk_documents_metadata(self):
        doc = Document(
            page_content="# Garanties\n\n" + "Paragraphe. " * 200,
            metadata={"source": "data/raw/conditions_generales.md"},
        )
        chunks = chunk_documents([doc], chunk_size=500, chunk_overlap=50)
        self.assertGreater(len(chunks), 1)
        for chunk in chunks:
            self.assertIn("chunk_id", chunk.metadata)
            self.assertIn("section", chunk.metadata)

    def test_load_corpus_empty_dir(self):
        chunks = load_corpus("data/raw")
        self.assertIsInstance(chunks, list)


if __name__ == "__main__":
    unittest.main()
