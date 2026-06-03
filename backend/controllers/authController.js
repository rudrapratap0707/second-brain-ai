const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

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

    const resetToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    await user.save()

    const clientUrl =
      process.env.CLIENT_URL || "http://localhost:5173"

    const resetUrl = `${clientUrl}/reset-password/${resetToken}`

    const html = `
      <div style="font-family: Arial, sans-serif; background:#070B1A; padding:30px; color:#ffffff;">
        <div style="max-width:520px; margin:auto; background:#111827; border-radius:18px; padding:28px; border:1px solid rgba(255,255,255,0.12);">
          <h2 style="color:#22d3ee; margin-bottom:10px;">Second Brain AI</h2>

          <h1 style="font-size:24px; margin-bottom:12px;">Reset Your Password</h1>

          <p style="color:#cbd5e1; line-height:1.7;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>

          <a href="${resetUrl}" 
             style="display:inline-block; margin-top:20px; padding:14px 22px; background:#22d3ee; color:#000000; text-decoration:none; border-radius:12px; font-weight:bold;">
            Reset Password
          </a>

          <p style="color:#94a3b8; font-size:13px; margin-top:24px; line-height:1.6;">
            This link will expire in 15 minutes. If you did not request this, you can safely ignore this email.
          </p>

          <p style="color:#64748b; font-size:12px; margin-top:20px; word-break:break-all;">
            ${resetUrl}
          </p>
        </div>
      </div>
    `

    await sendEmail({
      to: user.email,
      subject: "Reset your Second Brain AI password",
      html,
    })

    res.status(200).json({
      message:
        "Password reset link has been sent to your registered email.",
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message:
        "Failed to send password reset email. Please try again.",
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
        message: "Password must be at least 6 characters",
      })
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    })

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordToken = null
    user.resetPasswordExpire = null

    await user.save()

    res.status(200).json({
      message: "Password reset successful. Please login.",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    user.name = name || user.name

    await user.save()

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
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
  updateProfile,
}