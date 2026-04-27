/**
 * Ingestion Service — Chunks, embeds, and stores knowledge data for RAG
 * 
 * Pipeline: JSON file → Parse → Chunk → Embed → Store in PostgreSQL
 * Supports deduplication via SHA-256 checksums.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const prisma = require("../lib/prisma");
const { Pool } = require("pg");
const { generateEmbeddings, estimateTokenCount } = require("./embeddingService");

// ─── Configuration ───────────────────────────────────────────────

// Target chunk size in tokens (~500 tokens ≈ ~2000 characters)
const CHUNK_TARGET_TOKENS = 500;
// Overlap between chunks to preserve context at boundaries
const CHUNK_OVERLAP_TOKENS = 50;
// Batch size for embedding API calls (balance speed vs rate limits)
const EMBEDDING_BATCH_SIZE = 20;

// ─── Database Connection ─────────────────────────────────────────

let _pool = null;

function getPool() {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
    });
  }
  return _pool;
}

// ─── Main Ingestion ──────────────────────────────────────────────

/**
 * Ingest a JSON knowledge file into the database
 * 
 * Expected JSON format:
 * {
 *   "title": "Software Engineer Interview Questions",
 *   "source": "curated",
 *   "category": "interview_question",
 *   "company": "Google" | null,
 *   "role": "Software Engineer" | null,
 *   "difficulty": "medium" | null,
 *   "tags": ["dsa", "algorithms"],
 *   "entries": [
 *     {
 *       "question": "...",
 *       "topic": "...",
 *       "subtopic": "...",
 *       "difficulty": "...",
 *       "expectedApproach": "...",
 *       "hints": ["..."],
 *       "followUps": ["..."]
 *     }
 *   ]
 * }
 * 
 * @param {string} filePath - Absolute path to the JSON file
 * @param {Object} [overrides] - Override metadata from the file
 * @returns {Promise<{documentId: string, chunksCreated: number, skipped: boolean}>}
 */
async function ingestDocument(filePath, overrides = {}) {
  // Read and parse file
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawContent);

  // Compute checksum for deduplication
  const checksum = crypto.createHash("sha256").update(rawContent).digest("hex");

  // Check if already ingested
  const existing = await prisma.knowledgeDocument.findUnique({
    where: { checksum },
  });

  if (existing) {
    console.log(`⏭️  Skipping "${data.title}" — already ingested (checksum match)`);
    return { documentId: existing.id, chunksCreated: 0, skipped: true };
  }

  // Create the document record
  const document = await prisma.knowledgeDocument.create({
    data: {
      title: overrides.title || data.title,
      source: overrides.source || data.source || "curated",
      category: overrides.category || data.category,
      company: overrides.company || data.company || null,
      role: overrides.role || data.role || null,
      difficulty: overrides.difficulty || data.difficulty || null,
      tags: overrides.tags || data.tags || [],
      metadata: data.metadata || null,
      checksum,
    },
  });

  console.log(`📄 Created document: "${document.title}" (${document.id})`);

  // Convert entries to text chunks
  const textChunks = entriesToChunks(data.entries || [], data);

  if (textChunks.length === 0) {
    console.warn(`⚠️  No chunks generated for "${data.title}"`);
    return { documentId: document.id, chunksCreated: 0, skipped: false };
  }

  // Embed and store chunks
  const chunksCreated = await embedAndStore(textChunks, document.id);

  console.log(`✅ Ingested "${document.title}": ${chunksCreated} chunks`);
  return { documentId: document.id, chunksCreated, skipped: false };
}

/**
 * Ingest all JSON files from a directory
 * 
 * @param {string} dirPath - Directory containing JSON files
 * @returns {Promise<{totalDocuments: number, totalChunks: number, skipped: number}>}
 */
async function ingestDirectory(dirPath) {
  const stats = { totalDocuments: 0, totalChunks: 0, skipped: 0 };

  // Recursively find all .json files
  const jsonFiles = findJsonFiles(dirPath);

  console.log(`\n📂 Found ${jsonFiles.length} JSON files in ${dirPath}\n`);

  for (const filePath of jsonFiles) {
    try {
      const result = await ingestDocument(filePath);
      stats.totalDocuments++;
      stats.totalChunks += result.chunksCreated;
      if (result.skipped) stats.skipped++;
    } catch (error) {
      console.error(`❌ Failed to ingest ${filePath}:`, error.message);
    }
  }

  return stats;
}

// ─── Chunking ────────────────────────────────────────────────────

/**
 * Convert question entries into text chunks optimized for embedding
 * Each question becomes its own chunk (preserves question boundaries)
 * 
 * @param {Array} entries - Question entries from the JSON
 * @param {Object} docMeta - Document-level metadata
 * @returns {Array<{content: string, metadata: Object, tokenCount: number}>}
 */
function entriesToChunks(entries, docMeta) {
  const chunks = [];

  for (const entry of entries) {
    // Build a rich text representation of each question
    const parts = [];

    if (entry.topic) parts.push(`Topic: ${entry.topic}`);
    if (entry.subtopic) parts.push(`Subtopic: ${entry.subtopic}`);
    if (entry.difficulty) parts.push(`Difficulty: ${entry.difficulty}`);
    if (entry.company) parts.push(`Company: ${entry.company}`);
    if (entry.role) parts.push(`Role: ${entry.role || docMeta.role || ""}`);

    parts.push(""); // blank line
    parts.push(`Question: ${entry.question}`);

    if (entry.expectedApproach) {
      parts.push(`\nExpected Approach: ${entry.expectedApproach}`);
    }

    if (entry.keyPoints && Array.isArray(entry.keyPoints)) {
      parts.push(`\nKey Points:\n${entry.keyPoints.map((p) => `• ${p}`).join("\n")}`);
    }

    if (entry.hints && Array.isArray(entry.hints)) {
      parts.push(`\nHints:\n${entry.hints.map((h) => `• ${h}`).join("\n")}`);
    }

    if (entry.followUps && Array.isArray(entry.followUps)) {
      parts.push(`\nFollow-up Questions:\n${entry.followUps.map((f) => `• ${f}`).join("\n")}`);
    }

    if (entry.sampleAnswer) {
      parts.push(`\nSample Answer Framework: ${entry.sampleAnswer}`);
    }

    const content = parts.join("\n");
    const tokenCount = estimateTokenCount(content);

    // If a single entry is too large, split it
    if (tokenCount > CHUNK_TARGET_TOKENS * 2) {
      const subChunks = splitLargeChunk(content, CHUNK_TARGET_TOKENS);
      subChunks.forEach((subContent, i) => {
        chunks.push({
          content: subContent,
          metadata: {
            topic: entry.topic || null,
            subtopic: entry.subtopic || null,
            difficulty: entry.difficulty || null,
            questionType: entry.questionType || null,
            part: i + 1,
            totalParts: subChunks.length,
          },
          tokenCount: estimateTokenCount(subContent),
        });
      });
    } else {
      chunks.push({
        content,
        metadata: {
          topic: entry.topic || null,
          subtopic: entry.subtopic || null,
          difficulty: entry.difficulty || null,
          questionType: entry.questionType || null,
        },
        tokenCount,
      });
    }
  }

  return chunks;
}

/**
 * Split a large text chunk into smaller pieces with overlap
 */
function splitLargeChunk(text, targetTokens) {
  const targetChars = targetTokens * 4; // approx 4 chars per token
  const overlapChars = CHUNK_OVERLAP_TOKENS * 4;
  const chunks = [];

  let start = 0;
  while (start < text.length) {
    let end = start + targetChars;

    // Try to break at a sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(".", end);
      const lastNewline = text.lastIndexOf("\n", end);
      const breakPoint = Math.max(lastPeriod, lastNewline);
      if (breakPoint > start + targetChars * 0.5) {
        end = breakPoint + 1;
      }
    }

    chunks.push(text.slice(start, Math.min(end, text.length)).trim());
    start = end - overlapChars;
  }

  return chunks.filter((c) => c.length > 0);
}

// ─── Embedding & Storage ─────────────────────────────────────────

/**
 * Generate embeddings and store chunks in PostgreSQL
 * 
 * @param {Array<{content: string, metadata: Object, tokenCount: number}>} chunks
 * @param {string} documentId - Parent document ID
 * @returns {Promise<number>} - Number of chunks stored
 */
async function embedAndStore(chunks, documentId) {
  const pool = getPool();
  let totalStored = 0;

  // Process in batches to respect API rate limits
  for (let i = 0; i < chunks.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBEDDING_BATCH_SIZE);
    const texts = batch.map((c) => c.content);

    console.log(
      `  📡 Embedding batch ${Math.floor(i / EMBEDDING_BATCH_SIZE) + 1}/${Math.ceil(chunks.length / EMBEDDING_BATCH_SIZE)} ` +
      `(${texts.length} chunks)...`
    );

    // Generate embeddings for the batch
    const embeddings = await generateEmbeddings(texts);

    // Store each chunk with its embedding via raw SQL (Prisma doesn't support vector type)
    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      const embedding = embeddings[j];
      const chunkIndex = i + j;

      // First create the chunk in Prisma (without embedding)
      const created = await prisma.knowledgeChunk.create({
        data: {
          documentId,
          content: chunk.content,
          chunkIndex,
          tokenCount: chunk.tokenCount,
          metadata: chunk.metadata,
        },
      });

      // Then update the embedding via raw SQL
      const embeddingStr = `[${embedding.join(",")}]`;
      await pool.query(
        `UPDATE "KnowledgeChunk" SET embedding = $1::vector WHERE id = $2`,
        [embeddingStr, created.id]
      );

      totalStored++;
    }
  }

  return totalStored;
}

// ─── Utilities ───────────────────────────────────────────────────

/**
 * Recursively find all .json files in a directory
 */
function findJsonFiles(dirPath) {
  const results = [];

  if (!fs.existsSync(dirPath)) {
    return results;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Clear all knowledge data (useful for re-ingestion during development)
 */
async function clearAllKnowledge() {
  console.log("🗑️  Clearing all knowledge data...");
  await prisma.knowledgeChunk.deleteMany({});
  await prisma.knowledgeDocument.deleteMany({});
  console.log("✅ All knowledge data cleared.");
}

/**
 * Get ingestion statistics
 */
async function getStats() {
  const documents = await prisma.knowledgeDocument.count();
  const chunks = await prisma.knowledgeChunk.count();
  const pool = getPool();
  const embeddedResult = await pool.query(
    `SELECT COUNT(*) as count FROM "KnowledgeChunk" WHERE embedding IS NOT NULL`
  );
  const embedded = parseInt(embeddedResult.rows[0].count, 10);

  return { documents, chunks, embedded };
}

module.exports = {
  ingestDocument,
  ingestDirectory,
  clearAllKnowledge,
  getStats,
  entriesToChunks,
  splitLargeChunk,
  CHUNK_TARGET_TOKENS,
};
