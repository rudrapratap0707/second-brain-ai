const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50000, "Content exceeds maximum allowed length"],
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

    // Folder Organization with Strict Enum
    folder: {
      type: String,
      enum: [
        "General",
        "Academic",
        "Personal",
        "Projects",
        "Ideas",
        "Journal",
      ],
      default: "General",
    },

    // Origin tracking (Replaced 'source')
    createdBy: {
      type: String,
      enum: [
        "Sidebar",
        "Student Life",
        "AI Assistant",
        "Import",
        "Voice",
        "OCR",
      ],
      default: "Sidebar",
    },

    // Visibility matching controller specs
    visibility: {
      type: String,
      enum: ["private", "shared", "all"],
      default: "all",
    },

    // UX & Customization Additions with Validation
    color: {
      type: String,
      default: "#ffffff",
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid Hex color code"],
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    // AI & Analytics Enhancements
    isAIGenerated: {
      type: Boolean,
      default: false,
    },

    aiSummary: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "AI summary cannot exceed 1000 characters"],
    },

    lastAISummaryAt: {
      type: Date,
    },

    wordCount: {
      type: Number,
      default: 0,
    },

    readingTime: {
      type: Number,
      default: 0, // In minutes
    },

    lastOpened: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ⚡ High Performance Compound Indexes
noteSchema.index({ user: 1, folder: 1 })
noteSchema.index({ user: 1, subject: 1 })
noteSchema.index({ user: 1, isPinned: -1 })
noteSchema.index({ user: 1, isArchived: 1 })
noteSchema.index({ user: 1, createdAt: -1 })
noteSchema.index({ user: 1, updatedAt: -1 })

// 🔍 Full-Text Search Index for Fast Multi-Field Search
noteSchema.index({
  title: "text",
  content: "text",
  subject: "text",
  chapter: "text",
})

// 💡 Virtual Property
noteSchema.virtual("isEmpty").get(function () {
  return this.wordCount === 0
})

// 🛠️ Reliable Word Count & Reading Time Hook
noteSchema.pre("save", function (next) {
  if (this.isModified("content") || this.isNew) {
    const cleanContent = this.content ? this.content.trim() : ""
    const words = cleanContent.match(/\S+/g)

    this.wordCount = words ? words.length : 0
    this.readingTime = this.wordCount > 0 ? Math.max(1, Math.ceil(this.wordCount / 200)) : 0
  }
  next()
})

module.exports = mongoose.model("Note", noteSchema)