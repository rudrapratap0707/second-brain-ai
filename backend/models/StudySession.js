const mongoose = require("mongoose")

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      trim: true,
      required: true,
    },

    topic: {
      type: String,
      trim: true,
      default: "",
    },

    sessionType: {
      type: String,
      enum: [
        "Lecture",
        "Revision",
        "Practice",
        "Notes",
        "Test",
        "Project",
        "Other",
      ],
      default: "Other",
    },

    durationMinutes: {
      type: Number,
      default: 0,
    },

    focusLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    completionStatus: {
      type: String,
      enum: [
        "Planned",
        "In Progress",
        "Completed",
        "Skipped",
      ],
      default: "Planned",
    },

    notes: {
      type: String,
      default: "",
    },

    studiedAt: {
      type: Date,
      default: Date.now,
    },

    aiFeedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "StudySession",
  studySessionSchema
)