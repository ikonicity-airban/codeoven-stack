---
name: rag-vector-search
description: Implement Retrieval-Augmented Generation (RAG) systems with smart chunking, dense vector embeddings, hybrid search (BM25 + vector), and reranking. Use when building question-answering systems or knowledge-base search.
---

# RAG & Semantic Vector Search Guide

## 1. Ingestion Pipeline
- **Chunking Strategy:** Prefer recursive semantic chunking (500–1000 tokens with 10–15% overlap) to preserve contextual boundaries.
- **Metadata Tagging:** Attach source document ID, creation date, author, and section headers to each chunk.

## 2. Hybrid Search & Reranking
1. **Dense Retrieval:** Vector similarity (Cosine distance / Inner product via pgvector, Pinecone, or Chroma).
2. **Sparse Retrieval:** BM25 lexical keyword matching to capture exact part numbers, names, or codes.
3. **Reranker Pass:** Apply a cross-encoder model (e.g., Cohere Rerank) to top 20 candidates to select the top 5 most relevant context chunks.
