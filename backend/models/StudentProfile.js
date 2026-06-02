const mongoose = require("mongoose")

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      trim: true,
      default: "",
    },

    collegeName: {
      type: String,
      trim: true,
      default: "",
    },

    courseName: {
      type: String,
      trim: true,
      default: "",
    },

    currentSemester: {
      type: String,
      trim: true,
      default: "",
    },

    academicYear: {
      type: String,
      trim: true,
      default: "",
    },

    rollNumber: {
      type: String,
      trim: true,
      default: "",
    },

    subjects: [
      {
        name: {
          type: String,
          trim: true,
        },

        code: {
          type: String,
          trim: true,
          default: "",
        },

        type: {
          type: String,
          enum: [
            "Core",
            "Elective",
            "Practical",
            "Project",
            "Other",
          ],
          default: "Core",
        },

        difficulty: {
          type: String,
          enum: [
            "Easy",
            "Medium",
            "Hard",
          ],
          default: "Medium",
        },
      },
    ],

    careerGoal: {
      type: String,
      trim: true,
      default: "",
    },

    targetRole: {
      type: String,
      trim: true,
      default: "",
    },

    currentSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    weakAreas: [
      {
        type: String,
        trim: true,
      },
    ],

    strongAreas: [
      {
        type: String,
        trim: true,
      },
    ],

    preferredStudyTime: {
      type: String,
      enum: [
        "Morning",
        "Afternoon",
        "Evening",
        "Night",
        "Flexible",
      ],
      default: "Flexible",
    },

    dailyStudyCapacityHours: {
      type: Number,
      default: 0,
    },

    aiProfileSummary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
)