-- =====================================================
-- pgvector Extension + Knowledge Base Vector Support
-- Run this AFTER Prisma migration creates the tables
-- =====================================================

-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add embedding column to KnowledgeChunk
-- Using 1536 dimensions (OpenAI text-embedding-3-small / ada-002)
-- Change to 768 if using Google text-embedding-004
ALTER TABLE "KnowledgeChunk"
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 3. Create IVFFlat index for fast approximate nearest neighbor search
-- lists = sqrt(expected_rows) is a good starting point
-- Start with 100 lists, re-create with more when you have >100K chunks
CREATE INDEX IF NOT EXISTS idx_knowledge_chunk_embedding
ON "KnowledgeChunk"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 4. Create a composite index for filtered vector search (company + role)
CREATE INDEX IF NOT EXISTS idx_knowledge_chunk_doc_id
ON "KnowledgeChunk" (id, "documentId");
