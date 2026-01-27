const { Resend } = require("resend");

const resendApiKey = process.env.RESEND_API_KEY;
let resend;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn("⚠️  RESEND_API_KEY is missing. Email features will not work.");
}

async function sendMail(email, uniqueString) {
  const addr = process.env.IP || "localhost:5001";

  if (!resend) {
    console.warn(`[SIMULATION] Verification Email to: ${email}, Link: http://${addr}/api/verify/mail/${uniqueString}`);
    return true; // Simulate success for testing
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Entervue <onboarding@resend.dev>", // Should be replaced with domain later
      to: email,
      subject: "Verify your email - Entervue",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 30px 20px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold; color: white; letter-spacing: 1px;">Enter<span style="color: #ffe74c;">vue</span></div>
          </div>
          <div style="padding: 30px 40px;">
            <h2 style="color: #6366f1; margin-top: 0;">Welcome to Entervue!</h2>
            <p>Hello future interview champion,</p>
            <p>Thank you for joining Entervue - your AI-powered personal interview preparation assistant. We're excited to help you ace your next interview and land your dream job!</p>
            <div style="background-color: #f5f3ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
              <strong>Did you know?</strong> Candidates who prepare with structured mock interviews are significantly more likely to receive job offers.
            </div>
            <p>To get started with your preparation journey, please verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://${addr}/api/verify/mail/${uniqueString}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25);">Verify My Email</a>
            </div>
            <p>Once verified, you'll gain access to our full suite of AI tools.</p>
            <p>Best regards,<br>The Entervue Team</p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 5px 0;">Entervue Inc. &copy; 2026</p>
          </div>
        </div>
      </div>
      `,
    });

    if (error) {
      // Handle Resend Sandbox restriction (403) gracefully during development
      if (error.statusCode === 403 || error.name === "validation_error") {
        console.warn(`⚠️  Resend Sandbox Restriction: Could not send to ${email}.`);
        console.warn(`[SIMULATION] Verification Link: http://${addr}/api/verify/mail/${uniqueString}`);
        return true;
      }
      console.error("Resend error:", error);
      throw new Error("Failed to send verification email");
    }

    console.log("Verification email sent via Resend:", data.id);
    return true;
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
}

async function sendOTPEmail(email, OTP) {
  if (!resend) {
    console.warn(`[SIMULATION] OTP Email to: ${email}, OTP: ${OTP}`);
    return true; // Simulate success for testing
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Entervue <onboarding@resend.dev>",
      to: email,
      subject: 'Entervue Password Recovery',
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 25px 20px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold; color: white; letter-spacing: 1px;">Enter<span style="color: #ffe74c;">vue</span></div>
          </div>
          <div style="padding: 30px 40px;">
            <h2 style="color: #6366f1; margin-top: 0;">Password Recovery</h2>
            <p>We received a request to reset your password. Use the following One-Time Password (OTP) to complete the process:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #fff; font-size: 28px; font-weight: bold; padding: 15px 25px; display: inline-block; border-radius: 6px; letter-spacing: 5px;">${OTP}</div>
              <p style="margin-top: 15px; font-size: 14px; color: #666;">This OTP is valid for 5 minutes only</p>
            </div>
            <p>If you didn't request this reset, please ignore this email.</p>
            <p>Best regards,<br>The Entervue Team</p>
          </div>
        </div>
      </div>
      `
    });

    if (error) {
      if (error.statusCode === 403 || error.name === "validation_error") {
        console.warn(`⚠️  Resend Sandbox Restriction: Could not send to ${email}. OTP: ${OTP}`);
        return true;
      }
      console.error("Resend OTP error:", error);
      return false;
    }

    console.log("OTP email sent via Resend:", data.id);
    return true;
  } catch (err) {
    console.error("Error sending OTP mail:", err);
    return false;
  }
}

module.exports = { sendMail, sendOTPEmail };
