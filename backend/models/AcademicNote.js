const mongoose = require("mongoose")

const academicNoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    chapter: {
      type: String,
      default: "",
      trim: true,
    },

    noteType: {
      type: String,
      enum: [
        "Class Note",
        "Short Note",
        "Formula",
        "Definition",
        "PYQ",
        "Important Question",
        "Revision",
        "Other",
      ],
      default: "Class Note",
    },

    content: {
      type: String,
      required: true,
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

    aiSummary: {
      type: String,
      default: "",
    },

    aiFlashcards: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "AcademicNote",
  academicNoteSchema
)