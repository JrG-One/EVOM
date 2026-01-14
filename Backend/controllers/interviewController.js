const prisma = require("../lib/prisma");

const postInterviewData = async (req, res) => {
  try {
    const { company, role, experience, prefferedLanguage, codingRound } = req.body;

    // Correct the typo when saving to DB if schema has fixed spelling
    // Schema has 'preferredLanguage', body has 'prefferedLanguage'

    const newInterview = await prisma.interview.create({
      data: {
        company,
        role,
        experience,
        preferredLanguage: prefferedLanguage, // Mapping input (typo) to Schema (correct)
        codingRound: codingRound || false,
        user: {
          connect: { id: req.user.id }
        }
      }
    });

    res.status(201).json({ message: "Interview data saved successfully!", interviewId: newInterview.id });
  } catch (error) {
    console.error("Error saving interview data:", error);
    res.status(500).json({ message: "Failed to save interview data." });
  }
};

const getUserInterviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const interviews = await prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found" });
    }

    res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching interview data:", error);
    res.status(500).json({ message: "Error fetching interview data" });
  }
};

const getLatestInterview = async (req, res) => {
  try {
    const userId = req.user.id;

    const interview = await prisma.interview.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!interview) {
      return res.status(404).json({ error: "No interviews found." });
    }

    return res.status(200).json({ interviewId: interview.id });
  } catch (err) {
    console.error("Error fetching latest interview:", err);
    res.status(500).json({ error: "Failed to fetch latest interview." });
  }
};

module.exports = { getUserInterviews, postInterviewData, getLatestInterview };
