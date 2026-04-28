const { createChatCompletionWithHistory } = require("../utils/openaiClient");
const prisma = require("../lib/prisma");
const ragService = require("../services/ragService");

exports.generateChatResponse = async (req, res, next) => {
  try {
    const { interviewId, message } = req.body;
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized - please log in' });
    }
    const userId = req.user.id;

    if (!interviewId || !message) {
      return res.status(400).json({ error: "'interviewId' and 'message' are required." });
    }

    const now = new Date();
    const nextCycleEnd = new Date(now);
    nextCycleEnd.setMonth(nextCycleEnd.getMonth() + 1);
    let quota = await prisma.aICreditQuota.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        plan: "FREE",
        monthlyLimit: 1000,
        usedThisCycle: 0,
        cycleStart: now,
        cycleEnd: nextCycleEnd,
      },
    });

    if (quota.cycleEnd < now) {
      quota = await prisma.aICreditQuota.update({
        where: { userId },
        data: {
          usedThisCycle: 0,
          cycleStart: now,
          cycleEnd: nextCycleEnd,
        },
      });
      await prisma.aICreditLedger.create({
        data: {
          userId,
          changeType: "RESET",
          delta: 0,
          balanceAfter: quota.monthlyLimit,
          source: "MONTHLY_RESET",
        },
      });
    }

    if (quota.usedThisCycle >= quota.monthlyLimit) {
      return res.status(503).json({
        error: "AI credits exhausted for the current billing cycle.",
        code: "AI_CREDITS_EXHAUSTED",
      });
    }

    // Fetch the interview details
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      return res.status(404).json({ error: "Interview not found." });
    }

    if (interview.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access to this interview." });
    }

    let chatHistory = interview.chatHistory ? (typeof interview.chatHistory === 'string' ? JSON.parse(interview.chatHistory) : interview.chatHistory) : [];
    
    // If it's the very first message, or we want to re-ground periodically
    if (chatHistory.length === 0) {
      // 1. Retrieve context from Knowledge Base
      const { chunks } = await ragService.retrieveWithFallback({
        query: `${interview.role} at ${interview.company} ${message}`,
        filters: {
          role: interview.role,
          company: interview.company
        },
        topK: 5
      });

      // 2. Build the grounded system prompt
      const systemPrompt = ragService.buildGroundedPrompt(chunks, {
        role: interview.role,
        company: interview.company,
        experience: interview.experience,
        taskDescription: `Start the interview for a ${interview.role} position at ${interview.company}. Focus on assessing core technical competencies.`
      });

      chatHistory.push({ role: "system", content: systemPrompt });
    }

    // Append user message
    chatHistory.push({ role: "user", content: message });

    // Call OpenAI
    const reply = await createChatCompletionWithHistory(chatHistory);

    // Append assistant reply
    chatHistory.push({ role: "assistant", content: reply });

    // Save back to DB
    await prisma.$transaction([
      prisma.interview.update({
        where: { id: interviewId },
        data: { chatHistory: chatHistory },
      }),
      prisma.aICreditQuota.update({
        where: { userId },
        data: { usedThisCycle: { increment: 1 } },
      }),
      prisma.aICreditLedger.create({
        data: {
          userId,
          changeType: "CONSUME",
          delta: -1,
          balanceAfter: quota.monthlyLimit - (quota.usedThisCycle + 1),
          source: "CHAT_COMPLETION",
        },
      }),
    ]);

    return res.json({ reply });
  } catch (error) {
    next(error);
  }
};