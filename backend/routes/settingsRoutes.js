const express = require("express")

const router = express.Router()

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController")

const protect = require("../middleware/authMiddleware")

// GET SETTINGS
router.get("/", protect, getSettings)

// UPDATE SETTINGS
router.put("/", protect, updateSettings)

module.exports = router