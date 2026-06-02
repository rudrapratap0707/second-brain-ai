const Settings = require("../models/Settings")

// GET USER SETTINGS
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({
      user: req.user._id || req.user.id,
    })

    if (!settings) {
      settings = await Settings.create({
        user: req.user._id || req.user.id,
      })
    }

    res.status(200).json({
      settings,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// UPDATE USER SETTINGS
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({
      user: req.user._id || req.user.id,
    })

    if (!settings) {
      settings = await Settings.create({
        user: req.user._id || req.user.id,
      })
    }

    const allowedFields = [
      "theme",
      "aiMemory",
      "notifications",
      "emailAlerts",
      "moodTracking",
      "reminderAlerts",
      "dashboardAnimations",
      "compactMode",
      "fontSize",
      "aiPersonality",
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field]
      }
    })

    await settings.save()

    res.status(200).json({
      message: "Settings updated successfully",
      settings,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  getSettings,
  updateSettings,
}