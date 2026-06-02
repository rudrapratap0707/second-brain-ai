const mongoose = require("mongoose")

const learningLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    subjectsStudied: [
      {
        subject: {
          type: String,
          trim: true,
        },

        topic: {
          type: String,
          trim: true,
          default: "",
        },

        durationMinutes: {
          type: Number,
          default: 0,
        },
      },
    ],

    totalStudyMinutes: {
      type: Number,
      default: 0,
    },

    completedCheckpoints: {
      type: Number,
      default: 0,
    },

    totalCheckpoints: {
      type: Number,
      default: 0,
    },

    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    focusLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    moodImpact: {
      type: String,
      default: "",
    },

    productivityNote: {
      type: String,
      default: "",
    },

    weakAreasFound: [
      {
        type: String,
        trim: true,
      },
    ],

    aiSummary: {
      type: String,
      default: "",
    },

    aiImprovementPlan: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "LearningLog",
  learningLogSchema
)