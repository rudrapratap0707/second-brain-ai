const mongoose = require("mongoose")

const checkpointSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Target",
      default: null,
    },

    title: {
      type: String,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: [
        "Study",
        "Revision",
        "Assignment",
        "Skill",
        "Project",
        "Exam",
        "Practice",
        "Other",
      ],
      default: "Study",
    },

    progressWeight: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
        "Skipped",
      ],
      default: "Pending",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },

    aiSuggestion: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "Checkpoint",
  checkpointSchema
)