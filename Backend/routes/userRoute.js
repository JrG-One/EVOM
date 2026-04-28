const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  logout,
  updateProfile,
  checkAuth,
  updateAtsScore,
} = require("../controllers/userController");
const {requireAuth} = require("../middleware/auth.middleware");
const { userActivityTracker } = require("../middleware/userActivityTracker");

//login
router.post("/login", loginUser);

//signup
router.post("/signup", signupUser);

//logout
router.post("/logout", logout);

//update profile
router.put("/update-profile", requireAuth, userActivityTracker, updateProfile);

//update ats
router.put("/update-ats-score", requireAuth, userActivityTracker, updateAtsScore);

//checkAuth
router.get("/check", requireAuth, userActivityTracker, checkAuth);

module.exports = router;
