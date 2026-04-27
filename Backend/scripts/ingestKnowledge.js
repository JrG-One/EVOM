#!/usr/bin/env node

/**
 * Knowledge Base Ingestion Script
 * 
 * Usage:
 *   npm run ingest              # Ingest all knowledge files
 *   npm run ingest -- --clear   # Clear existing data and re-ingest
 *   npm run ingest -- --stats   # Show ingestion statistics only
 * 
 * This script reads all JSON files from the knowledge/ directory,
 * chunks them, generates embeddings, and stores them in PostgreSQL
 * with pgvector for RAG retrieval.
 */

require("dotenv").config();

const path = require("path");
const { ingestDirectory, clearAllKnowledge, getStats } = require("../services/ingestionService");

// ─── Configuration ───────────────────────────────────────────────

const KNOWLEDGE_DIR = path.join(__dirname, "..", "knowledge");

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const shouldClear = args.includes("--clear");
  const statsOnly = args.includes("--stats");

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║    EVOM Knowledge Base Ingestion Pipeline    ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  // Verify embedding configuration
  const provider = process.env.EMBEDDING_PROVIDER || "openai";
  const model = process.env.EMBEDDING_MODEL || "text-embedding-3-small";
  console.log(`📡 Embedding Provider: ${provider}`);
  console.log(`🤖 Embedding Model: ${model}`);
  console.log(`📂 Knowledge Directory: ${KNOWLEDGE_DIR}\n`);

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_EMBEDDING_API_KEY;
  if (!apiKey && !statsOnly) {
    console.error("❌ No API key found. Set OPENAI_API_KEY or AZURE_EMBEDDING_API_KEY in .env");
    process.exit(1);
  }

  // Stats only mode
  if (statsOnly) {
    const stats = await getStats();
    console.log("📊 Current Knowledge Base Statistics:");
    console.log(`   Documents: ${stats.documents}`);
    console.log(`   Chunks: ${stats.chunks}`);
    console.log(`   Embedded: ${stats.embedded}`);
    process.exit(0);
  }

  // Clear existing data if requested
  if (shouldClear) {
    console.log("⚠️  Clearing existing knowledge data...");
    await clearAllKnowledge();
    console.log("");
  }

  // Run ingestion
  const startTime = Date.now();

  try {
    const stats = await ingestDirectory(KNOWLEDGE_DIR);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log("\n╔══════════════════════════════════════════════╗");
    console.log("║            Ingestion Complete!               ║");
    console.log("╚══════════════════════════════════════════════╝");
    console.log(`   Documents processed: ${stats.totalDocuments}`);
    console.log(`   Chunks created: ${stats.totalChunks}`);
    console.log(`   Skipped (already ingested): ${stats.skipped}`);
    console.log(`   Time: ${elapsed}s`);

    // Show final DB stats
    const dbStats = await getStats();
    console.log(`\n   📊 Total in database: ${dbStats.documents} documents, ${dbStats.chunks} chunks, ${dbStats.embedded} embedded`);

    if (dbStats.chunks > 0 && dbStats.embedded === 0) {
      console.log("\n   ⚠️  Chunks exist but no embeddings found.");
      console.log("      Make sure the pgvector migration has been run:");
      console.log("      psql -f prisma/migrations/manual/20260319_add_pgvector_knowledge.sql");
    }
  } catch (error) {
    console.error(`\n❌ Ingestion failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
