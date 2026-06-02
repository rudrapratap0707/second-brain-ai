const mongoose = require("mongoose")

const examScheduleSchema = new mongoose.Schema(
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

    subjectCode: {
      type: String,
      trim: true,
      default: "",
    },

    examType: {
      type: String,
      enum: [
        "Internal",
        "External",
        "Practical",
        "Viva",
        "Assignment",
        "Quiz",
        "Other",
      ],
      default: "External",
    },

    examDate: {
      type: Date,
      required: true,
    },

    syllabusStatus: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Revision Needed",
      ],
      default: "Not Started",
    },

    preparationLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
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

    notes: {
      type: String,
      default: "",
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
  "ExamSchedule",
  examScheduleSchema
)