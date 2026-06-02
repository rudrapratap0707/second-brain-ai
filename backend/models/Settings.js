const mongoose = require("mongoose")

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    theme: {
      type: String,
      enum: ["dark", "light"],
      default: "dark",
    },

    aiMemory: {
      type: Boolean,
      default: true,
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    emailAlerts: {
      type: Boolean,
      default: false,
    },

    moodTracking: {
      type: Boolean,
      default: true,
    },

    reminderAlerts: {
      type: Boolean,
      default: true,
    },

    dashboardAnimations: {
      type: Boolean,
      default: true,
    },

    compactMode: {
      type: Boolean,
      default: false,
    },

    fontSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
    },

    aiPersonality: {
      type: String,
      enum: [
        "professional",
        "friendly",
        "motivational",
        "minimal",
      ],
      default: "friendly",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "Settings",
  settingsSchema
)