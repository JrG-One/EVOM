/**
 * RAG Service — Retrieval-Augmented Generation for EVOM
 * 
 * Core responsibilities:
 * 1. Vector similarity search against pgvector
 * 2. Prompt construction with guardrails
 * 3. Fallback detection when no relevant data exists
 * 4. Extensibility hooks for re-rankers and hybrid search (future phases)
 */

const { Pool } = require("pg");
const { generateEmbedding } = require("./embeddingService");

// ─── Configuration ───────────────────────────────────────────────

const SIMILARITY_THRESHOLD = parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || "0.65");
const DEFAULT_TOP_K = parseInt(process.env.RAG_TOP_K || "5", 10);
const RAG_ENABLED = process.env.RAG_ENABLED !== "false"; // enabled by default

// ─── Database Connection ─────────────────────────────────────────

let _pool = null;

/**
 * Get or create the PostgreSQL connection pool (shared with Prisma)
 */
function getPool() {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5, // Limit connections for the RAG service
    });
  }
  return _pool;
}

// ─── Core Retrieval ──────────────────────────────────────────────

/**
 * Retrieve the most relevant knowledge chunks for a given query
 * 
 * @param {Object} options
 * @param {string} options.query - Natural language query to search for
 * @param {Object} [options.filters] - Optional metadata filters
 * @param {string} [options.filters.company] - Filter by company name
 * @param {string} [options.filters.role] - Filter by role
 * @param {string} [options.filters.category] - Filter by category
 * @param {string} [options.filters.difficulty] - Filter by difficulty level
 * @param {number} [options.topK] - Number of results to return (default: 5)
 * @returns {Promise<Array<{id: string, content: string, similarity: number, metadata: Object}>>}
 */
async function retrieve({ query, filters = {}, topK = DEFAULT_TOP_K }) {
  if (!RAG_ENABLED) {
    console.log("🔕 RAG is disabled via RAG_ENABLED=false");
    return [];
  }

  try {
    // Step 1: Basic Query Expansion (Keyword Extraction)
    const expandedQuery = expandQuery(query, filters);
    
    // Step 2: Generate embedding for the query
    const queryEmbedding = await generateEmbedding(expandedQuery);
    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    // Step 3: Build the SQL query with optional filters
    const { whereClause, params } = buildFilterClause(filters, embeddingStr);

    // Step 4: Execute cosine similarity search
    const pool = getPool();
    const sql = `
      SELECT 
        kc.id,
        kc.content,
        kc."chunkIndex",
        kc.metadata AS chunk_metadata,
        kd.title AS document_title,
        kd.company,
        kd.role,
        kd.category,
        kd.difficulty,
        kd.tags,
        1 - (kc.embedding <=> $1::vector) AS similarity
      FROM "KnowledgeChunk" kc
      JOIN "KnowledgeDocument" kd ON kc."documentId" = kd.id
      ${whereClause}
      ORDER BY kc.embedding <=> $1::vector
      LIMIT $${params.length + 1}
    `;

    params.push(topK);

    const result = await pool.query(sql, params);

    // Step 5: Map results to a clean format
    const chunks = result.rows.map((row) => ({
      id: row.id,
      content: row.content,
      similarity: parseFloat(row.similarity),
      documentTitle: row.document_title,
      company: row.company,
      role: row.role,
      category: row.category,
      difficulty: row.difficulty,
      tags: row.tags,
      chunkIndex: row.chunkIndex,
      metadata: row.chunk_metadata,
    }));

    console.log(
      `🔍 RAG Retrieved ${chunks.length} chunks for expanded query: "${expandedQuery}". ` +
      `Top similarity: ${chunks[0]?.similarity?.toFixed(3) || "N/A"}`
    );

    return chunks;
  } catch (error) {
    console.error("❌ RAG retrieval error:", error.message);
    return [];
  }
}

/**
 * Basic Query Expansion — Focuses the vector search on core keywords
 */
function expandQuery(query, filters) {
  // Remove common conversational filler
  const cleanQuery = query
    .replace(/(please|can you|tell me|about|what is|how to|i want to|know|could you)/gi, "")
    .trim();
  
  // Combine with filters for context
  const context = [filters.company, filters.role, cleanQuery]
    .filter(Boolean)
    .join(" ");

  return context || query;
}

/**
 * Build SQL WHERE clause from filter options
 * @returns {{ whereClause: string, params: any[] }}
 */
function buildFilterClause(filters, embeddingStr) {
  const conditions = [];
  const params = [embeddingStr]; // $1 is always the embedding

  // Only return chunks that actually have embeddings
  conditions.push(`kc.embedding IS NOT NULL`);

  if (filters.company) {
    params.push(filters.company.toLowerCase());
    conditions.push(`LOWER(kd.company) = $${params.length}`);
  }

  if (filters.role) {
    params.push(filters.role.toLowerCase());
    conditions.push(`LOWER(kd.role) = $${params.length}`);
  }

  if (filters.category) {
    params.push(filters.category);
    conditions.push(`kd.category = $${params.length}`);
  }

  if (filters.difficulty) {
    params.push(filters.difficulty);
    conditions.push(`kd.difficulty = $${params.length}`);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  return { whereClause, params };
}

// ─── Retrieval with Fallback Detection ───────────────────────────

/**
 * Retrieve with automatic fallback detection.
 * If no chunks pass the similarity threshold, signals the controller to use prompt-only mode.
 * 
 * @param {Object} options - Same as retrieve()
 * @returns {Promise<{chunks: Array, isFallback: boolean, avgSimilarity: number}>}
 */
async function retrieveWithFallback(options) {
  const allChunks = await retrieve(options);

  // Filter by similarity threshold
  const relevantChunks = allChunks.filter(
    (chunk) => chunk.similarity >= SIMILARITY_THRESHOLD
  );

  const isFallback = relevantChunks.length === 0;
  const avgSimilarity = relevantChunks.length > 0
    ? relevantChunks.reduce((sum, c) => sum + c.similarity, 0) / relevantChunks.length
    : 0;

  if (isFallback) {
    console.log(
      `⚠️ RAG: No chunks above threshold (${SIMILARITY_THRESHOLD}). ` +
      `Best match: ${allChunks[0]?.similarity?.toFixed(3) || "N/A"}. Falling back to prompt-only.`
    );
  } else {
    console.log(
      `✅ RAG: ${relevantChunks.length} relevant chunks found. ` +
      `Avg similarity: ${avgSimilarity.toFixed(3)}`
    );
  }

  return {
    chunks: relevantChunks,
    isFallback,
    avgSimilarity,
  };
}

// ─── Prompt Construction ─────────────────────────────────────────

/**
 * Build a grounded system prompt with RAG context and guardrails
 * 
 * @param {Array} chunks - Retrieved knowledge chunks
 * @param {Object} options
 * @param {string} options.baseSystemPrompt - The original system prompt (used as foundation)
 * @param {string} options.taskDescription - What the AI should do with the context
 * @returns {string} - Complete system prompt with context and guardrails
 */
function buildGroundedPrompt(chunks, { role, company, experience, taskDescription }) {
  // 1. Format the retrieved context
  const contextBlock = chunks && chunks.length > 0
    ? chunks
        .map((chunk, i) => {
          const source = [chunk.documentTitle, chunk.company, chunk.difficulty]
            .filter(Boolean)
            .join(" | ");
          return `[Source ${i + 1}: ${source}]\n${chunk.content}`;
        })
        .join("\n\n---\n\n")
    : "No specific proprietary knowledge found for this query. Use general industry standards.";

  // 2. Base RTF Instructions
  const baseInstructions = `
[ROLE]
You are an Elite Technical Interviewer specializing in ${role} positions for ${company}. You have ${experience} years of industry experience and a reputation for being thorough yet professional.

[TASK]
Your objective is to conduct a high-fidelity technical interview. 
${taskDescription || "Start by introducing yourself as the InterviewWhiz AI, welcoming the candidate to the platform, and then asking a targeted technical question based on the candidate's background and the job requirements."}

[FORMAT]
- Tone: Professional, authoritative, and encouraging.
- Structure: One question at a time. Provide brief, constructive feedback or follow-ups based on the candidate's responses.
`;

  return `
${baseInstructions}

═══════════════════════════════════════════════════
GROUNDING INSTRUCTIONS (CRITICAL — FOLLOW STRICTLY)
═══════════════════════════════════════════════════

You have been provided with a REFERENCE KNOWLEDGE BASE below containing real interview data, 
questions, patterns, and guidelines for ${company}. You MUST follow these rules:

1. **USE the reference knowledge**: Base your questions and expectations primarily on the provided context.
   Adapt, rephrase, or combine elements from the reference material to create your questions.

2. **DO NOT fabricate**: Do NOT invent company-specific details, processes, or interview patterns 
   that are not supported by the reference context or widely-known public information.

3. **CITE your basis**: When possible, align your response with specific patterns or question 
   types from the reference material.

4. **STAY ON TOPIC**: Your response must be relevant to the ${role} role at ${company}.

5. **ACKNOWLEDGE GAPS**: If the reference material doesn't cover the specific topic well enough, 
   use your general knowledge but clearly indicate this is general guidance rather than 
   company-specific data.

═══════════════════════════════════════════════════
REFERENCE KNOWLEDGE BASE
═══════════════════════════════════════════════════

${contextBlock}

═══════════════════════════════════════════════════
ADDITIONAL CONTEXT
═══════════════════════════════════════════════════
- Candidate Target Role: ${role}
- Target Company: ${company}
- Interviewer Experience Level: Senior/Expert
`;
}

// ─── Extensibility Hooks (Future Phases) ─────────────────────────

/**
 * STUB: Re-rank retrieved chunks using a cross-encoder model
 * Phase 2+ implementation will add a cross-encoder re-ranker here
 * 
 * @param {string} query - Original query
 * @param {Array} chunks - Retrieved chunks to re-rank
 * @returns {Promise<Array>} - Re-ranked chunks
 */
async function rerank(query, chunks) {
  // TODO: Phase 2 — Integrate a cross-encoder re-ranker
  // Options: Cohere Rerank API, ms-marco-MiniLM cross-encoder, etc.
  console.log("ℹ️ Re-ranker not yet implemented. Using vector similarity order.");
  return chunks;
}

/**
 * STUB: Hybrid search combining vector + full-text search
 * Phase 2+ will add PostgreSQL full-text search (tsvector) alongside vector search
 * 
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Combined results from both search methods
 */
async function hybridSearch(options) {
  // TODO: Phase 2 — Combine pgvector cosine similarity with PostgreSQL ts_rank
  // This will improve results for keyword-heavy queries
  console.log("ℹ️ Hybrid search not yet implemented. Using vector-only search.");
  return retrieve(options);
}

// ─── Cleanup ─────────────────────────────────────────────────────

/**
 * Gracefully close the connection pool (call on server shutdown)
 */
async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}

module.exports = {
  retrieve,
  retrieveWithFallback,
  buildGroundedPrompt,
  rerank,
  hybridSearch,
  closePool,
  SIMILARITY_THRESHOLD,
};
