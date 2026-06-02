const express = require("express")

const router = express.Router()

const {
  createMood,
  getMoods,
  deleteMood,
} = require("../controllers/moodController")

const protect = require("../middleware/authMiddleware")

router.post("/", protect, createMood)

router.get("/", protect, getMoods)

router.delete("/:id", protect, deleteMood)

module.exports = router