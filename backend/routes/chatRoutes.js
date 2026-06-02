const express = require("express")

const router = express.Router()

const {
  createChat,
  getChats,
  getChatById,
  sendMessageToChat,
  deleteChat,
} = require("../controllers/chatController")

const protect = require("../middleware/authMiddleware")

router.post("/", protect, createChat)

router.get("/", protect, getChats)

router.get("/:id", protect, getChatById)

router.post("/:id/message", protect, sendMessageToChat)

router.delete("/:id", protect, deleteChat)

module.exports = router