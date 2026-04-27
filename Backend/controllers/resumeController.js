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
  return res.status(200).json({
    message: "Feature coming soon.",
    atsScore: "N/A",
    comingSoon: true
  });
};

exports.getOverallComments = async (req, res) => {
  return res.status(200).json({
    message: "Feature coming soon.",
    feedback: "This high-fidelity analysis feature is currently being optimized. Stay tuned!",
    comingSoon: true
  });
};

// Function to provide tips to improve the resume in technical fields
exports.getImprovementTips = async (req, res) => {
  return res.status(200).json({
    message: "Feature coming soon.",
    improvementTips: "Smart improvement tips will be available in the next release.",
    comingSoon: true
  });
};
