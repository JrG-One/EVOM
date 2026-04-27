/**
 * Question Controller — Generates interview questions using RAG pipeline
 * 
 * Flow:
 * 1. Receive request with jobRole, targetCompany, experience, etc.
 * 2. Query RAG knowledge base for relevant context
 * 3. If relevant context found → generate grounded question
 * 4. If no relevant context → fallback to prompt-only (original behavior)
 */

const openai = require("../utils/openaiClient");
const { retrieveWithFallback, buildGroundedPrompt } = require("../services/ragService");

// ─── Difficulty Mapping ──────────────────────────────────────────

/**
 * Map years of experience to difficulty level for RAG filtering
 */
function mapExperienceToDifficulty(yearsOfExperience) {
  const years = parseInt(yearsOfExperience, 10) || 0;
  if (years <= 1) return "easy";
  if (years <= 3) return "medium";
  if (years <= 7) return "hard";
  return "expert";
}

// ─── Main Controller ─────────────────────────────────────────────

exports.generateQuestion = async (req, res, next) => {
  try {
    const { jobRole, targetCompany, yearsOfExperience, isCoding, preferredLanguage } = req.body;

    const ragQuery = isCoding
      ? `${jobRole} technical coding interview question ${targetCompany || ""} ${preferredLanguage || ""}`
      : `${jobRole} theoretical behavioral interview question ${targetCompany || ""}`;

    const difficulty = mapExperienceToDifficulty(yearsOfExperience);
    const ragResult = await retrieveWithFallback({
      query: ragQuery,
      filters: {
        company: targetCompany || undefined,
        role: jobRole || undefined,
        difficulty: difficulty,
      },
      topK: 5,
    });

    let question;

    if (!ragResult.isFallback && ragResult.chunks.length > 0) {
      console.log(
        `🧠 RAG: Using grounded context (${ragResult.chunks.length} chunks, avg similarity: ${ragResult.avgSimilarity.toFixed(3)})`
      );

      const systemPrompt = buildGroundedPrompt(ragResult.chunks, {
        baseSystemPrompt:
          `You are an experienced interviewer with 20+ years in technical interviews for the job role of ${jobRole}` +
          (targetCompany ? ` at companies like ${targetCompany}` : "") + ".",
        taskDescription: isCoding
          ? `Generate ONE technical interview question for a ${jobRole} position` +
            (targetCompany ? ` at ${targetCompany}` : "") +
            `, considering ${yearsOfExperience} years of experience` +
            (preferredLanguage ? ` and ${preferredLanguage} as the main programming language` : "") +
            `. Use the reference material as inspiration — adapt a question from the reference or generate a similar-quality question. Include hints for the interviewer.`
          : `Generate ONE behavioral/theoretical question for a ${jobRole} position` +
            (targetCompany ? ` at ${targetCompany}` : "") +
            ` with ${yearsOfExperience} years of experience. ` +
            `Use the reference material to create a relevant, well-structured question that evaluates real competencies for this role.`,
      });

      const prompt = isCoding
        ? `Generate a ${difficulty}-level technical question for a ${jobRole} with ${yearsOfExperience} years of experience` +
          (preferredLanguage ? ` in ${preferredLanguage}` : "") +
          `. Base your question on the reference material provided.`
        : `Generate a ${difficulty}-level theoretical question for a ${jobRole} with ${yearsOfExperience} years of experience` +
          (targetCompany ? ` at ${targetCompany}` : "") +
          `. Base your question on the reference material provided.`;

      question = await openai.createChatCompletion(systemPrompt, prompt);
    } else {
      console.log("⚠️ RAG: Falling back to prompt-only mode");

      const systemContext = `
        You are an experienced interviewer with 20+ years in technical interviews for the job role of ${jobRole}${targetCompany ? ` at companies like ${targetCompany}` : ""}.
        Please provide a relevant interview question for this role, based on current trends and typical interview questions for ${jobRole}${targetCompany ? ` at ${targetCompany}` : ""}. 
        If the role is technical (e.g., Software Engineer, Data Scientist), provide a coding or problem-solving question${preferredLanguage ? ` in ${preferredLanguage}` : ""}. Otherwise, provide a theoretical question as per the questions asked for ${jobRole} role Interview.
      `;

      let prompt = "";
      if (isCoding) {
        prompt = `Generate a medium-level technical question for a ${jobRole} position${targetCompany ? ` at ${targetCompany}` : ""}, considering ${yearsOfExperience} years of experience${preferredLanguage ? ` and ${preferredLanguage} as the main programming language` : ""}.`;
      } else {
        prompt = `Generate a theoretical question for a ${jobRole} position${targetCompany ? ` at ${targetCompany}` : ""} with ${yearsOfExperience} years of experience.`;
      }

      question = await openai.createChatCompletion(systemContext, prompt);
    }

    res.status(200).json({
      question,
      ragUsed: !ragResult.isFallback,
      ragChunksUsed: ragResult.chunks.length,
      ragAvgSimilarity: ragResult.avgSimilarity,
    });
  } catch (error) {
    next(error);
  }
};