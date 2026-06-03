const express = require("express")

const router = express.Router()

const {
  signupUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController")

const protect = require("../middleware/authMiddleware")

// AUTH
router.post("/signup", signupUser)
router.post("/login", loginUser)

// PROFILE
router.get("/profile", protect, getProfile)

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPassword
)

// RESET PASSWORD
router.put(
  "/reset-password/:token",
  resetPassword
)

module.exports = router