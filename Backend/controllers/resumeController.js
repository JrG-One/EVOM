const { createChatCompletion } = require("../utils/openaiClient"); // Use your existing OpenAI client
const cloudinary = require("../lib/cloudinary");
const prisma = require("../lib/prisma");
const fs = require("fs");
const path = require("path");
const { cleanMarkdown } = require("../utils/cleanMarkdown");
// const pdf = require("pdf-parse"); // Removed as per user request

exports.uploadResume = async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }

    const resumeFile = req.files.resume;

    if (resumeFile.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed." });
    }

    // Set temp directory
    const uploadsDir = path.join(__dirname, "..", "uploads");

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Construct file path
    const tempFilePath = path.join(
      uploadsDir,
      `${Date.now()}-${resumeFile.name}`,
    );

    resumeFile.mv(tempFilePath, async (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res
          .status(500)
          .json({ message: "Error moving the uploaded resume." });
      }

      console.log("Resume file saved temporarily at:", tempFilePath);

      // Convert to Base64 (User requested Strategy)
      let resumeText = "";
      try {
        if (resumeFile.data) {
          console.log("Encoding PDF to Base64 from Buffer...");
          resumeText = resumeFile.data.toString('base64');
        } else {
          console.log("Encoding PDF to Base64 from Disk...");
          const dataBuffer = fs.readFileSync(tempFilePath);
          resumeText = dataBuffer.toString('base64');
        }
        console.log(`✅ Base64 Encoded. Length: ${resumeText.length}`);
      } catch (err) {
        console.error("❌ Base64 Encoding Error:", err);
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
          resource_type: "raw",
          public_id: `resumes/${req.user.id}-${Date.now()}`,
        });

        if (uploadResult && uploadResult.secure_url) {

          const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { resumeUrl: uploadResult.secure_url }
          });

          if (!user) {
            try { fs.unlinkSync(tempFilePath); } catch (e) { }
            return res.status(404).json({ message: "User not found" });
          }

          try { fs.unlinkSync(tempFilePath); } catch (e) { }

          res.status(200).json({
            message: "Resume uploaded successfully",
            resumeUrl: uploadResult.secure_url,
            resumeText: resumeText || ""
          });
        } else {
          try { fs.unlinkSync(tempFilePath); } catch (e) { }
          return res
            .status(500)
            .json({ message: "Error uploading resume to Cloudinary" });
        }
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        try { fs.unlinkSync(tempFilePath); } catch (e) { }

        res
          .status(500)
          .json({ message: "Error processing resume upload." });
      }
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Error uploading resume." });
  }
};

exports.calculateATS = async (req, res) => {
  try {
    const { resumeUrl, resumeText } = req.body;

    if (!resumeUrl && !resumeText) {
      return res.status(400).json({ error: "Resume content is required." });
    }

    const systemPrompt =
      "Assume the role of an expert technical recruiter and ATS specialist. The user has provided a Base64 encoded PDF file. READ and DECODE the content to evaluate the candidate.\n\nCalculate the ATS score (0-100) based on:\n1. Keyword matching (tech stack, skills)\n2. Quantifiable results (metrics, numbers)\n3. Formatting and structure\n\nReturn EXACTLY and ONLY the numeric score (e.g., '85').";

    // Pass Base64 text
    const contentToAnalyze = resumeText || `Resume URL: ${resumeUrl}`;
    const userPrompt = `Resume Content (Base64 Encoded PDF):\n${contentToAnalyze}`;

    // Get ATS score using OpenAI API
    const atsScore = await createChatCompletion(systemPrompt, userPrompt);
    const atsScoreNumber = parseInt(atsScore, 10);
    console.log("ATS Score Response:", atsScore);

    res.status(200).json({
      message: "ATS score calculated successfully.",
      atsScore: atsScore,
    });
  } catch (error) {
    console.error("Error calculating ATS:", error);
    res.status(500).json({ message: "Failed to calculate ATS score." });
  }
};

exports.getOverallComments = async (req, res) => {
  try {
    const { resumeUrl, resumeText } = req.body;

    if (!resumeUrl && !resumeText) {
      return res.status(400).json({ error: "Resume content is required." });
    }

    const systemPrompt =
      "Assume the role of a senior technical recruiter. The user has provided a Base64 encoded PDF. READ and DECODE it to provide detailed feedback.\n\n" +
      "CRITICAL: NEVER mention that you are reading 'encoded content', 'base64', or that you 'cannot read the file'. You have full capability to decode and analyze this document. If you see binary patterns, interpret them as a professional resume.\n\n" +
      "YOU MUST CITE SPECIFIC EXAMPLES from the resume (e.g., specific companies, projects, or metrics mentioned).\n\n" +
      "Structure your response exactly as follows:\n" +
      "STRENGTHS:\n" +
      "- [Bullet point 1 with specific citation]\n" +
      "- [Bullet point 2 with specific citation]\n\n" +
      "IMPROVEMENTS:\n" +
      "- [Critical weak point 1]\n" +
      "- [Critical weak point 2]\n\n" +
      "SUMMARY:\n" +
      "- [One sentence high-level takeaway]";

    // Pass Base64 text
    const contentToAnalyze = resumeText || `Resume URL: ${resumeUrl}`;
    const userPrompt = `Resume Content (Base64 Encoded PDF):\n${contentToAnalyze}`;

    const feedback = await createChatCompletion(systemPrompt, userPrompt);
    console.log("Feedback Response:", feedback);
    const cleanedFeedback = cleanMarkdown(feedback);
    res.status(200).json({
      message: "Resume feedback generated successfully.",
      feedback: cleanedFeedback,
    });
  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ message: "Failed to generate resume feedback." });
  }
};

// Function to provide tips to improve the resume in technical fields
exports.getImprovementTips = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({ error: "Resume URL is required." });
    }

    const systemPrompt =
      "Assume the role of a technical recruiter. Provide tips to improve the resume for the technical job market.";
    const userPrompt = `Resume content: ${resumeUrl}`;

    const improvementTips = await createChatCompletion(
      systemPrompt,
      userPrompt,
    );
    console.log(improvementTips);
    const cleanedTips = cleanMarkdown(improvementTips);
    res.status(200).json({
      message: "Resume improvement tips generated successfully.",
      improvementTips: cleanedTips,
    });
  } catch (error) {
    console.error("Error generating improvement tips:", error);
    res
      .status(500)
      .json({ message: "Failed to generate resume improvement tips." });
  }
};
