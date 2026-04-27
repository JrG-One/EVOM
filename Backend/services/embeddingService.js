/**
 * Embedding Service — Generates vector embeddings for RAG pipeline
 * 
 * Supports both OpenAI Direct API and Azure OpenAI.
 * Configure via environment variables:
 *   - EMBEDDING_PROVIDER: "openai" (default) or "azure"
 *   - OPENAI_API_KEY: Used for both providers (or AZURE_EMBEDDING_API_KEY for Azure)
 *   - OPENAI_EMBEDDING_URL: Override for custom endpoints
 */

const axios = require("axios");

const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || "openai";
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = parseInt(process.env.EMBEDDING_DIMENSIONS || "1536", 10);

// Max tokens per embedding request (model limit is 8191 for ada-002 / 3-small)
const MAX_TOKENS_PER_REQUEST = 8000;
// Max texts per batch (OpenAI limit)
const MAX_BATCH_SIZE = 100;
// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Get the embedding API URL based on provider configuration
 */
function getEmbeddingUrl() {
  if (process.env.OPENAI_EMBEDDING_URL) {
    return process.env.OPENAI_EMBEDDING_URL;
  }

  if (EMBEDDING_PROVIDER === "azure") {
    const baseUrl = process.env.AZURE_EMBEDDING_API_URL;
    if (!baseUrl) {
      throw new Error(
        "AZURE_EMBEDDING_API_URL is required when EMBEDDING_PROVIDER=azure.");
    }
    return baseUrl;
  }

  return "https://api.openai.com/v1/embeddings";
}

/**
 * Get the API key based on provider configuration
 */
function getApiKey() {
  if (EMBEDDING_PROVIDER === "azure") {
    return process.env.AZURE_EMBEDDING_API_KEY || process.env.OPENAI_API_KEY;
  }
  return process.env.OPENAI_API_KEY;
}

/**
 * Build request headers based on provider
 */
function buildHeaders() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "No API key configured for embeddings. Set OPENAI_API_KEY or AZURE_EMBEDDING_API_KEY."
    );
  }

  if (EMBEDDING_PROVIDER === "azure") {
    return {
      "Content-Type": "application/json",
      "api-key": apiKey,
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

/**
 * Sleep helper for retry backoff
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate embedding for a single text string
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector (float array)
 */
async function generateEmbedding(text) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Cannot generate embedding for empty text");
  }

  const embeddings = await generateEmbeddings([text]);
  return embeddings[0];
}

/**
 * Generate embeddings for multiple texts in batch
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
async function generateEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error("texts must be a non-empty array of strings");
  }

  // Clean input
  const cleanedTexts = texts.map((t) =>
    typeof t === "string" ? t.trim().replace(/\n+/g, " ") : String(t)
  );

  // Process in batches if needed
  const results = [];
  for (let i = 0; i < cleanedTexts.length; i += MAX_BATCH_SIZE) {
    const batch = cleanedTexts.slice(i, i + MAX_BATCH_SIZE);
    const batchEmbeddings = await _requestEmbeddings(batch);
    results.push(...batchEmbeddings);
  }

  return results;
}

/**
 * Internal: Make the API request with retry logic
 * @param {string[]} texts - Batch of texts
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
async function _requestEmbeddings(texts) {
  const url = getEmbeddingUrl();
  const headers = buildHeaders();

  const body = {
    input: texts,
  };

  // OpenAI direct API requires model field; Azure uses deployment URL
  if (EMBEDDING_PROVIDER !== "azure") {
    body.model = EMBEDDING_MODEL;
    body.dimensions = EMBEDDING_DIMENSIONS;
  }

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(url, body, {
        headers,
        timeout: 30000, // 30 second timeout
      });

      // Extract embeddings and sort by index (API may return out of order)
      const embeddings = response.data.data
        .sort((a, b) => a.index - b.index)
        .map((item) => item.embedding);

      return embeddings;
    } catch (error) {
      lastError = error;

      const status = error.response?.status;
      const isRetryable = status === 429 || status >= 500;

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // exponential backoff
        console.warn(
          `⚠️ Embedding API attempt ${attempt}/${MAX_RETRIES} failed (${status}). Retrying in ${delay}ms...`
        );
        await sleep(delay);
        continue;
      }

      // Non-retryable error or max retries exhausted
      break;
    }
  }

  // Format a useful error message
  const errorMessage = lastError.response?.data?.error?.message 
    || lastError.message 
    || "Unknown embedding API error";
  
  throw new Error(`Embedding API failed after ${MAX_RETRIES} attempts: ${errorMessage}`);
}

/**
 * Rough token count estimator (for chunking decisions)
 * Uses the ~4 chars per token heuristic
 * @param {string} text
 * @returns {number}
 */
function estimateTokenCount(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

module.exports = {
  generateEmbedding,
  generateEmbeddings,
  estimateTokenCount,
  EMBEDDING_DIMENSIONS,
  MAX_TOKENS_PER_REQUEST,
};
