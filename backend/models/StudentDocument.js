const mongoose = require("mongoose")

const studentDocumentSchema = new mongoose.Schema(
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

    category: {
      type: String,
      enum: [
        "Admit Card",
        "Marksheet",
        "Certificate",
        "ID Card",
        "Syllabus",
        "Fee Receipt",
        "Scholarship",
        "NCC",
        "Project",
        "Notes",
        "Other",
      ],
      default: "Other",
    },

    documentType: {
      type: String,
      enum: [
        "PDF",
        "Image",
        "Document",
        "Other",
      ],
      default: "Other",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    issuingAuthority: {
      type: String,
      default: "",
    },

    documentDate: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    isImportant: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },

    aiSummary: {
      type: String,
      default: "",
    },

    extractedText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "StudentDocument",
  studentDocumentSchema
)