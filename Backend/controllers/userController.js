const randString = require("../utils/randString");
const { sendMail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/generateToken");
const { mailCache } = require("../cache/mailcache");
const prisma = require("../lib/prisma");
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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Error("Incorrect Email");
    }

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

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        profilePic: "",
        isAdmin: false
      }
    });

    const token = generateToken(user.id, res);
    res.status(200).json({ email, token, username, msg: "Signup Successful", isAdmin: user.isAdmin, atsScore: user.atsScore });
  } catch (error) {
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
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in logout contoller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateAtsScore = async (req, res) => {
  try {
    console.log(req.body);
    const { atsScore } = req.body;
    const userId = req.user._id;

    if (atsScore === undefined || isNaN(atsScore)) {
      return res
        .status(400)
        .json({ message: "ATS Score must be a valid number" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { atsScore },
      { new: true },
    );

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
    console.log("Error in logout contoller", error.message);
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
