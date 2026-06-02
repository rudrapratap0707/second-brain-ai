const express = require("express")

const router = express.Router()

const {
  createReminder,
  getReminders,
  toggleReminder,
  deleteReminder,
} = require("../controllers/reminderController")

const protect = require("../middleware/authMiddleware")

router.post("/", protect, createReminder)

router.get("/", protect, getReminders)

router.patch("/:id/toggle", protect, toggleReminder)

router.delete("/:id", protect, deleteReminder)

module.exports = router