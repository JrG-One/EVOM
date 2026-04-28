const express = require("express");
const { generateChatResponse } = require('../controllers/chatController');
const { requireAuth } = require("../middleware/auth.middleware");
const { userActivityTracker } = require("../middleware/userActivityTracker");
const router = express.Router();

router.post("/chat", requireAuth, userActivityTracker, generateChatResponse);

module.exports = router;