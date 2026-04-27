const express = require("express");
const { generateChatResponse } = require('../controllers/chatController');
const { requireAuth } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/chat", requireAuth, generateChatResponse);

module.exports = router;