const { mailCache } = require("../cache/mailcache");
const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const mailVerify = async (req, res) => {
  try {
    const { uniqueString } = req.params;

    const cachedUser = mailCache.get(uniqueString);

    if (!cachedUser) {
      return res.status(404).send("Verification link expired or invalid");
    }

    const { username, email, password } = cachedUser;

    // Check if user already exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).send("Email already in use");
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

    console.log(user);

    if (user) {
      res.status(201).send("Account creation was successful");
    } else {
      res.status(500).send("Failed to create account");
    }
  } catch (error) {
    console.error("Error in mail verification:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = mailVerify;
