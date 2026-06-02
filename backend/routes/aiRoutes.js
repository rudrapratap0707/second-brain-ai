const express = require("express")

const router = express.Router()

const {
  summarizeNote,
  chatWithAI,
} = require("../controllers/aiController")

const protect = require("../middleware/authMiddleware")

router.post("/summarize", protect, summarizeNote)

router.post("/chat", protect, chatWithAI)

module.exports = router