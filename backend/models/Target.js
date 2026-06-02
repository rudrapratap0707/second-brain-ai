const mongoose = require("mongoose")

const targetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
        "Coding",
        "Career",
        "Internship",
        "Exam",
        "Skill",
        "Project",
        "Daily",
        "Weekly",
        "Monthly",
        "Semester",
        "Other",
    ],
    default: "Study",
    },


    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },


    status: {
    type: String,
    enum: [
        "Pending",
        "Not Started",
        "In Progress",
        "Completed",
        "Paused",
    ],
    default: "Pending",
    },



    dueDate: {
      type: Date,
      default: null,
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
  "Target",
  targetSchema
)