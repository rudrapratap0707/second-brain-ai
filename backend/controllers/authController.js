const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

// SIGNUP
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// PROFILE
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      })
    }

    // GENERATE TOKEN
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex")

    // HASH TOKEN
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    // SAVE TOKEN
    user.resetPasswordToken = hashedToken

    // EXPIRE IN 15 MIN
    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000

    await user.save()

    const clientUrl =
      process.env.CLIENT_URL ||
      "http://localhost:5173"

    const resetUrl = `${clientUrl}/reset-password/${resetToken}`

    console.log(
      "RESET PASSWORD LINK:",
      resetUrl
    )

    res.status(200).json({
      message:
        "Password reset link generated successfully",
      resetUrl,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params

    const { password } = req.body

    if (!password || password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      })
    }

    // HASH TOKEN
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // FIND USER
    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    })

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired reset token",
      })
    }

    // HASH NEW PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10)

    user.password = hashedPassword

    user.resetPasswordToken = null
    user.resetPasswordExpire = null

    await user.save()

    res.status(200).json({
      message:
        "Password reset successful. Please login.",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  signupUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
}