const { mailCache } = require("../cache/mailcache");
const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const mailVerify = async (req, res) => {
  try {
    const { uniqueString } = req.params;

    // Check for token in database
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { token: uniqueString },
      include: { user: true }
    });

    if (!tokenRecord) {
      return res.status(404).send("Verification link invalid");
    }

    if (new Date() > tokenRecord.expiresAt) {
      // Clean up expired token
      await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
      return res.status(410).send("Verification link expired. Please sign up again.");
    }

    const email = tokenRecord.user.email;

    // Update user to verified and delete the token in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { isVerified: true }
      }),
      prisma.verificationToken.delete({ where: { id: tokenRecord.id } })
    ]);

    res.status(201).send(`
      <html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f3f4f6;">
          <div style="text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: #6366f1;">Verification Successful!</h1>
            <p>Your account for <strong>${email}</strong> has been verified.</p>
            <p>You can now close this tab and log in to Entervue.</p>
            <a href="http://localhost:5173" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; text-decoration: none; border-radius: 9999px; font-weight: bold;">Go to Login</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error in mail verification:", error);
    res.status(500).json({ message: "Internal server error during verification" });
  }
};

module.exports = mailVerify;
