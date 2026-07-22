const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Academic Fields
    subject: {
      type: String,
      default: "",
      trim: true,
    },

    chapter: {
      type: String,
      default: "",
      trim: true,
    },

    noteType: {
      type: String,
      default: "General",
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    revisionStatus: {
      type: String,
      enum: [
        "Not Revised",
        "Need Revision",
        "Revised",
        "Mastered",
      ],
      default: "Not Revised",
    },

    isImportant: {
      type: Boolean,
      default: false,
    },

    // Used by Sidebar Notes
    folder: {
      type: String,
      default: "General",
      trim: true,
    },

    // Where note came from
    source: {
      type: String,
      default: "Sidebar",
      trim: true,
    },

    // Visibility for future sharing
    visibility: {
      type: String,
      default: "all",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Note", noteSchema)