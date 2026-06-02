const mongoose = require("mongoose")

const timetableSchema = new mongoose.Schema(
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

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Daily",
      ],
      default: "Daily",
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "College",
        "Study",
        "Revision",
        "Skill",
        "Project",
        "Break",
        "Personal",
        "Other",
      ],
      default: "Study",
    },

    subject: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    repeat: {
      type: String,
      enum: [
        "None",
        "Daily",
        "Weekly",
      ],
      default: "None",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "Timetable",
  timetableSchema
)