import unittest

from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

from src.corpus.loader import load_corpus
from src.indexing.vectorstore import create_vectorstore
from src.utils.config import RAW_DATA_DIR


class _FakeEmbeddings(Embeddings):
    def embed_documents(self, texts):
        return [[0.1, 0.2, 0.3] for _ in texts]

    def embed_query(self, text):
        return [0.1, 0.2, 0.3]


class TestCorpusLoader(unittest.TestCase):
    def test_load_corpus_excludes_readme(self):
        docs = load_corpus(RAW_DATA_DIR)
        names = [d.metadata.get("source", "") for d in docs]
        self.assertFalse(any(name.endswith("README.md") for name in names))
        self.assertEqual(len(docs), 9)


class TestVectorstore(unittest.TestCase):
    def test_create_vectorstore_resets_collection(self):
        import tempfile

        docs = [
            Document(page_content="contenu A", metadata={"document": "a.md"}),
            Document(page_content="contenu B", metadata={"document": "b.md"}),
        ]
        tmp = tempfile.mkdtemp()
        try:
            create_vectorstore(docs, _FakeEmbeddings(), persist_dir=tmp)
            first = create_vectorstore(docs, _FakeEmbeddings(), persist_dir=tmp)
            self.assertEqual(first._collection.count(), len(docs))
        finally:
            import shutil

            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    unittest.main()
