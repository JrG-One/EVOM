const fs = require("fs");
const path = require("path");
const cloudinary = require("../lib/cloudinary");
const { generatePDFReport } = require("../utils/pdfGenerator");
const prisma = require("../lib/prisma");
const { createChatCompletion } = require("../utils/openaiClient");
const { cleanMarkdown } = require("../utils/cleanMarkdown");

exports.generateAnalysis = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({ error: "interviewId is required." });
    }

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { user: true }
    });

    if (!interview) {
      return res.status(404).json({ error: "Interview not found." });
    }

    const formData = {
      name: interview.user?.username || "Candidate",
      role: interview.role,
      company: interview.company,
      experience: interview.experience,
      preferredLanguage: interview.preferredLanguage,
      codingRound: interview.codingRound
    };

    const { name, role, company, experience, preferredLanguage, codingRound } = formData;

    let chatHistory = interview.chatHistory ? (typeof interview.chatHistory === 'string' ? JSON.parse(interview.chatHistory) : interview.chatHistory) : [];
    const feedback = chatHistory.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");

    const systemContext = `
Role: You are a Lead Technical Interviewer and Talent Architect with 20+ years of experience in technical recruitment for Tier-1 tech companies.

Objective: Analyze the provided interview transcript and generate a high-fidelity, actionable performance report.

Details:
- Focus on technical accuracy, depth of explanations, and problem-solving methodology.
- Evaluate soft skills: communication, clarity, and attitude.
- Provide constructive, specific feedback that a candidate can use to improve.
- Use a professional, objective, yet encouraging tone.

Grading Rubric (0.0 to 10.0):
- 0-4: Significant gaps in core knowledge or major red flags.
- 5-6: Basic understanding but lacks depth or has several errors.
- 7-8: Strong performance, good problem solving, minor errors only.
- 9-10: Exceptional performance, demonstrates mastery and senior-level thinking.
`;

    const prompt = `
Task: Generate a comprehensive Interview Analysis Report.

Candidate Data:
- Name: ${name}
- Target Role: ${role}
- Target Company: ${company}
- Seniority: ${experience} years experience
- Stack: ${preferredLanguage}
- Mode: ${codingRound ? "Technical/Coding Focus" : "Behavioral/Theory Focus"}

Transcript:
${feedback}

Return a JSON object STRICTLY matching this exact schema:
{
  "report": "## Executive Summary\\n[Summary of overall performance]\\n\\n## Technical Proficiency\\n[Detailed analysis of technical answers]\\n\\n## Problem Solving & Logic\\n[Analysis of their approach]\\n\\n## Communication & Soft Skills\\n[Analysis of how they explained concepts]\\n\\n## Key Strengths\\n- [Strength 1]\\n- [Strength 2]\\n\\n## Areas for Improvement\\n- [Area 1]\\n- [Area 2]\\n\\n## Interviewer Verdict\\n[Final recommendation]",
  "overallScore": 0.0,
  "topicScores": {
    "Technical Depth": 0.0,
    "Problem Solving": 0.0,
    "Communication": 0.0
  }
}

Sense Check: Ensure the overallScore is a weighted average of the topicScores. Ensure the report text is valid Markdown.
`;

    const content = await createChatCompletion(systemContext, prompt, { response_format: { type: "json_object" } });
    if (!content) {
      return res.status(500).json({ error: "OpenAI response is empty." });
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (err) {
      console.error("Failed to parse JSON response from OpenAI:", err);
      return res.status(500).json({ error: "Invalid JSON response from AI." });
    }

    const markdown = cleanMarkdown(parsedContent.report || "");
    const overallScore = parseFloat(parsedContent.overallScore) || 0;
    const topicScores = parsedContent.topicScores || {};

    console.log("📄 Cleaned Markdown:", markdown);
    console.log("✅ Extracted topicScores JSON:", topicScores);


    const pdfPath = await generatePDFReport(markdown, overallScore, formData, topicScores);

    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "auto",
      public_id: `interviews/interview-report-${Date.now()}`,
    });

    const cloudinaryUrl = uploadResult.secure_url;
    fs.unlinkSync(pdfPath);

    // Prepare update data
    const updateData = {
      pdfReport: cloudinaryUrl,
      score: overallScore,
    };

    if (req.body.questions) {
      // Prisma 'Json' field accepts a JS object/array directly
      updateData.questions = req.body.questions;
    }

    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: updateData
    });

    if (!updatedInterview) {
      return res.status(404).json({ error: "Interview not found." });
    }

    return res.status(200).json({
      message: "Report generated and uploaded successfully.",
      pdfUrl: cloudinaryUrl,
      interviewId: updatedInterview.id,
    });
  } catch (err) {
    console.error("Error generating analysis:", err);
    res.status(500).json({ error: "Failed to generate analysis report." });
  }
};