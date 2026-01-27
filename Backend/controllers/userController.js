const randString = require("../utils/randString");
const { sendMail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/generateToken");
const { mailCache } = require("../cache/mailcache");
const prisma = require("../lib/prisma");
const cloudinary = require("../lib/cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error("All fields must be filled");
    }

    // Bypass for test user
    if (email === "demo@entervue.ai") {
      const mockUser = {
        id: "demo-user-id",
        username: "Demo User",
        email: "demo@entervue.ai",
        isAdmin: false,
        atsScore: 85,
      };
      const token = generateToken(mockUser.id, res);
      return res.status(200).json({
        email: mockUser.email,
        token,
        username: mockUser.username,
        msg: "Login Successful (Demo Mode)",
        isAdmin: mockUser.isAdmin,
        atsScore: mockUser.atsScore,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Error("Incorrect Email");
    }

    // if (!user.isVerified) {
    //   throw Error("Please verify your email before logging in.");
    // }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw Error("incorrect password");
    }

    const token = generateToken(user.id, res);

    res.status(200).json({ email, token, username: user.username, msg: "Login Successful", isAdmin: user.isAdmin, atsScore: user.atsScore });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// SIGNUP
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
      throw Error("Password not strong enough");
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user immediately verified
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        isVerified: true // Auto-verified for beta
      }
    });

    // Generate token for immediate login if client supports it, 
    // but for now we'll just return success so they can login.

    res.status(200).json({
      msg: "Account created successfully! You can now login.",
      email
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in logout contoller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      profilePic,
      bio,
      phone,
      location,
      socialLinks,
      experience,
      education,
    } = req.body;
    const userId = req.user.id;

    let updateData = {
      bio,
      phone,
      location,
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
      experience,
      education,
    };

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    // Remove undefined keys to avoid overriding existing data with null/undefined if not sent
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateAtsScore = async (req, res) => {
  try {
    const { atsScore } = req.body;
    const userId = req.user.id; // Corrected from _id

    if (atsScore === undefined || isNaN(atsScore)) {
      return res
        .status(400)
        .json({ message: "ATS Score must be a valid number" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { atsScore: parseInt(atsScore) }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating ATS score:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
  signupUser,
  logout,
  checkAuth,
  updateProfile,
  updateAtsScore,
};
