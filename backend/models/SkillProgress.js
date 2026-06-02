const mongoose = require("mongoose")

const skillProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillName: {
      type: String,
      trim: true,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Programming",
        "Web Development",
        "Aptitude",
        "Communication",
        "Design",
        "Database",
        "AI",
        "Cloud",
        "College Subject",
        "Other",
      ],
      default: "Other",
    },

    currentLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    targetLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },

    confidenceLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    totalPracticeHours: {
      type: Number,
      default: 0,
    },

    learningSource: {
      type: String,
      default: "",
    },

    weakTopics: [
      {
        type: String,
        trim: true,
      },
    ],

    strongTopics: [
      {
        type: String,
        trim: true,
      },
    ],

    lastPracticedAt: {
      type: Date,
      default: null,
    },

    aiFeedback: {
      type: String,
      default: "",
    },

    aiRoadmap: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "SkillProgress",
  skillProgressSchema
)