const StudentProfile = require("../models/StudentProfile")
const StudySession = require("../models/StudySession")
const ExamSchedule = require("../models/ExamSchedule")
const Timetable = require("../models/Timetable")
const Target = require("../models/Target")
const Checkpoint = require("../models/Checkpoint")
const SkillProgress = require("../models/SkillProgress")
const LearningLog = require("../models/LearningLog")
const Note = require("../models/Note") // Using central Note model
const StudentDocument = require("../models/StudentDocument")

// Helper: Get User ID safely
const getUserId = (req) => {
  return req.user?._id || req.user?.id
}

// 1. DASHBOARD ANALYTICS (Optimized with Promise.all & lean)
const getStudentLifeDashboard = async (req, res) => {
  try {
    const userId = getUserId(req)

    // Parallel DB Execution for maximum performance
    const [
      profile,
      studySessions,
      exams,
      timetable,
      targets,
      checkpoints,
      skills,
      learningLogs,
      notesCount,
      documentsCount,
    ] = await Promise.all([
      StudentProfile.findOne({ user: userId }).lean(),
      StudySession.find({ user: userId }).sort({ studiedAt: -1 }).lean(),
      ExamSchedule.find({ user: userId }).sort({ examDate: 1 }).lean(),
      Timetable.find({ user: userId, isActive: true }).sort({ startTime: 1 }).lean(),
      Target.find({ user: userId }).sort({ dueDate: 1 }).lean(),
      Checkpoint.find({ user: userId }).sort({ dueDate: 1 }).lean(),
      SkillProgress.find({ user: userId }).sort({ updatedAt: -1 }).lean(),
      LearningLog.find({ user: userId }).sort({ date: -1 }).lean(),
      Note.countDocuments({ user: userId, folder: "Academic" }),
      StudentDocument.countDocuments({ user: userId }),
    ])

    const totalStudyMinutes = studySessions.reduce(
      (sum, session) => sum + Number(session.durationMinutes || 0),
      0
    )

    const completedCheckpoints = checkpoints.filter(
      (item) => item.status === "Completed"
    ).length

    const totalCheckpoints = checkpoints.length

    const successRate =
      totalCheckpoints > 0
        ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
        : 0

    const completedTargets = targets.filter(
      (item) => item.status === "Completed"
    ).length

    const targetProgressRate =
      targets.length > 0
        ? Math.round((completedTargets / targets.length) * 100)
        : 0

    const upcomingExams = exams.filter(
      (exam) => new Date(exam.examDate) >= new Date()
    )

    const activeTargets = targets.filter(
      (item) => item.status !== "Completed"
    )

    const pendingCheckpoints = checkpoints.filter(
      (item) => item.status !== "Completed"
    )

    res.status(200).json({
      profile,
      analytics: {
        totalStudyMinutes,
        totalStudyHours: Math.round((totalStudyMinutes / 60) * 10) / 10,
        totalStudySessions: studySessions.length,
        totalTargets: targets.length,
        completedTargets,
        targetProgressRate,
        totalCheckpoints,
        completedCheckpoints,
        successRate,
        totalSkills: skills.length,
        totalExams: exams.length,
        notesCount,
        documentsCount,
      },
      recent: {
        studySessions: studySessions.slice(0, 5),
        learningLogs: learningLogs.slice(0, 5),
      },
      upcoming: {
        exams: upcomingExams.slice(0, 5),
        targets: activeTargets.slice(0, 5),
        checkpoints: pendingCheckpoints.slice(0, 5),
      },
      timetable,
      skills,
    })
  } catch (error) {
    console.log("STUDENT LIFE DASHBOARD ERROR:", error)

    res.status(500).json({
      message: "Student Life dashboard failed",
      error: error.message,
    })
  }
}

// 2. PROFILE CONTROLLERS
const getStudentProfile = async (req, res) => {
  try {
    const userId = getUserId(req)

    let profile = await StudentProfile.findOne({ user: userId }).lean()

    if (!profile) {
      profile = await StudentProfile.create({ user: userId })
    }

    res.status(200).json({ profile })
  } catch (error) {
    res.status(500).json({
      message: "Failed to get student profile",
      error: error.message,
    })
  }
}

const updateStudentProfile = async (req, res) => {
  try {
    const userId = getUserId(req)

    const profile = await StudentProfile.findOneAndUpdate(
      { user: userId },
      { ...req.body, user: userId },
      { new: true, upsert: true, runValidators: true }
    )

    res.status(200).json({
      message: "Student profile saved successfully",
      profile,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update student profile",
      error: error.message,
    })
  }
}

// 3. TARGET CONTROLLERS
const createTarget = async (req, res) => {
  try {
    const userId = getUserId(req)

    if (!req.body.title) {
      return res.status(400).json({ message: "Target title is required" })
    }

    const target = await Target.create({
      user: userId,
      ...req.body,
    })

    res.status(201).json({
      message: "Target created successfully",
      target,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create target",
      error: error.message,
    })
  }
}

const getTargets = async (req, res) => {
  try {
    const userId = getUserId(req)

    const targets = await Target.find({ user: userId })
      .sort({ dueDate: 1, createdAt: -1 })
      .lean()

    res.status(200).json({ targets })
  } catch (error) {
    res.status(500).json({
      message: "Failed to get targets",
      error: error.message,
    })
  }
}

const updateTarget = async (req, res) => {
  try {
    const userId = getUserId(req)

    const target = await Target.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!target) {
      return res.status(404).json({ message: "Target not found" })
    }

    res.status(200).json({
      message: "Target updated successfully",
      target,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update target",
      error: error.message,
    })
  }
}

const deleteTarget = async (req, res) => {
  try {
    const userId = getUserId(req)

    const target = await Target.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    })

    if (!target) {
      return res.status(404).json({ message: "Target not found" })
    }

    res.status(200).json({ message: "Target deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete target",
      error: error.message,
    })
  }
}

// 4. CHECKPOINT CONTROLLERS
const createCheckpoint = async (req, res) => {
  try {
    const userId = getUserId(req)

    if (!req.body.title) {
      return res.status(400).json({ message: "Checkpoint title is required" })
    }

    const checkpoint = await Checkpoint.create({
      user: userId,
      ...req.body,
    })

    res.status(201).json({
      message: "Checkpoint created successfully",
      checkpoint,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create checkpoint",
      error: error.message,
    })
  }
}

const getCheckpoints = async (req, res) => {
  try {
    const userId = getUserId(req)

    const checkpoints = await Checkpoint.find({ user: userId })
      .populate("target", "title category")
      .sort({ dueDate: 1, createdAt: -1 })
      .lean()

    res.status(200).json({ checkpoints })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch checkpoints",
      error: error.message,
    })
  }
}

const updateCheckpoint = async (req, res) => {
  try {
    const userId = getUserId(req)

    const checkpoint = await Checkpoint.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!checkpoint) {
      return res.status(404).json({ message: "Checkpoint not found" })
    }

    res.status(200).json({
      message: "Checkpoint updated successfully",
      checkpoint,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update checkpoint",
      error: error.message,
    })
  }
}

const deleteCheckpoint = async (req, res) => {
  try {
    const userId = getUserId(req)

    const checkpoint = await Checkpoint.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    })

    if (!checkpoint) {
      return res.status(404).json({ message: "Checkpoint not found" })
    }

    res.status(200).json({ message: "Checkpoint deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete checkpoint",
      error: error.message,
    })
  }
}

// 5. EXAM CONTROLLERS
const createExam = async (req, res) => {
  try {
    const userId = getUserId(req)

    if (!req.body.subject && !req.body.title) {
      return res.status(400).json({ message: "Subject or Exam title is required" })
    }

    const exam = await ExamSchedule.create({
      user: userId,
      ...req.body,
    })

    res.status(201).json({
      message: "Exam created successfully",
      exam,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create exam",
      error: error.message,
    })
  }
}

const getExams = async (req, res) => {
  try {
    const userId = getUserId(req)

    const exams = await ExamSchedule.find({ user: userId })
      .sort({ examDate: 1, createdAt: -1 })
      .lean()

    res.status(200).json({ exams })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch exams",
      error: error.message,
    })
  }
}

const updateExam = async (req, res) => {
  try {
    const userId = getUserId(req)

    const exam = await ExamSchedule.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" })
    }

    res.status(200).json({
      message: "Exam updated successfully",
      exam,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update exam",
      error: error.message,
    })
  }
}

const deleteExam = async (req, res) => {
  try {
    const userId = getUserId(req)

    const exam = await ExamSchedule.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    })

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" })
    }

    res.status(200).json({ message: "Exam deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete exam",
      error: error.message,
    })
  }
}

// 6. TIMETABLE CONTROLLERS
const createTimetableBlock = async (req, res) => {
  try {
    const userId = getUserId(req)

    if (!req.body.day || !req.body.startTime) {
      return res.status(400).json({ message: "Day and Start Time are required" })
    }

    const block = await Timetable.create({
      user: userId,
      ...req.body,
    })

    res.status(201).json({
      message: "Timetable block created successfully",
      block,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create timetable block",
      error: error.message,
    })
  }
}

const getTimetableBlocks = async (req, res) => {
  try {
    const userId = getUserId(req)

    const blocks = await Timetable.find({ user: userId })
      .sort({ day: 1, startTime: 1 })
      .lean()

    res.status(200).json({ blocks })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch timetable blocks",
      error: error.message,
    })
  }
}

const updateTimetableBlock = async (req, res) => {
  try {
    const userId = getUserId(req)

    const block = await Timetable.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!block) {
      return res.status(404).json({ message: "Timetable block not found" })
    }

    res.status(200).json({
      message: "Timetable block updated successfully",
      block,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update timetable block",
      error: error.message,
    })
  }
}

const deleteTimetableBlock = async (req, res) => {
  try {
    const userId = getUserId(req)

    const block = await Timetable.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    })

    if (!block) {
      return res.status(404).json({ message: "Timetable block not found" })
    }

    res.status(200).json({ message: "Timetable block deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete timetable block",
      error: error.message,
    })
  }
}

// 7. SKILL CONTROLLERS
const createSkill = async (req, res) => {
  try {
    const userId = getUserId(req)

    if (!req.body.skillName) {
      return res.status(400).json({ message: "Skill name is required" })
    }

    const skill = await SkillProgress.create({
      user: userId,
      ...req.body,
    })

    res.status(201).json({
      message: "Skill created successfully",
      skill,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create skill",
      error: error.message,
    })
  }
}

const getSkills = async (req, res) => {
  try {
    const userId = getUserId(req)

    const skills = await SkillProgress.find({ user: userId })
      .sort({ category: 1, currentLevel: -1, updatedAt: -1 })
      .lean()

    res.status(200).json({ skills })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message,
    })
  }
}

const updateSkill = async (req, res) => {
  try {
    const userId = getUserId(req)

    const skill = await SkillProgress.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" })
    }

    res.status(200).json({
      message: "Skill updated successfully",
      skill,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update skill",
      error: error.message,
    })
  }
}

const deleteSkill = async (req, res) => {
  try {
    const userId = getUserId(req)

    const skill = await SkillProgress.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    })

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" })
    }

    res.status(200).json({ message: "Skill deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete skill",
      error: error.message,
    })
  }
}

// 8. LEARNING LOG CONTROLLERS
const createLearningLog = async (req, res) => {
  try {
    const userId = getUserId(req)

    const log = await LearningLog.create({
      user: userId,
      ...req.body,
    })

    res.status(201).json({
      message: "Learning log created successfully",
      log,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create learning log",
      error: error.message,
    })
  }
}

const getLearningLogs = async (req, res) => {
  try {
    const userId = getUserId(req)

    const logs = await LearningLog.find({ user: userId })
      .sort({ date: -1, createdAt: -1 })
      .lean()

    res.status(200).json({ logs })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch learning logs",
      error: error.message,
    })
  }
}

const updateLearningLog = async (req, res) => {
  try {
    const userId = getUserId(req)

    const log = await LearningLog.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!log) {
      return res.status(404).json({ message: "Learning log not found" })
    }

    res.status(200).json({
      message: "Learning log updated successfully",
      log,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update learning log",
      error: error.message,
    })
  }
}

const deleteLearningLog = async (req, res) => {
  try {
    const userId = getUserId(req)

    const log = await LearningLog.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    })

    if (!log) {
      return res.status(404).json({ message: "Learning log not found" })
    }

    res.status(200).json({ message: "Learning log deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete learning log",
      error: error.message,
    })
  }
}

// 9. AI STUDY COACH ANALYSIS (Optimized with Promise.all)
const getAIStudyCoach = async (req, res) => {
  try {
    const userId = getUserId(req)

    const [
      profile,
      exams,
      targets,
      checkpoints,
      timetable,
      skills,
      learningLogs
    ] = await Promise.all([
      StudentProfile.findOne({ user: userId }).lean(),
      ExamSchedule.find({ user: userId }).sort({ examDate: 1 }).lean(),
      Target.find({ user: userId }).sort({ dueDate: 1 }).lean(),
      Checkpoint.find({ user: userId }).sort({ dueDate: 1 }).lean(),
      Timetable.find({ user: userId, isActive: true }).sort({ startTime: 1 }).lean(),
      SkillProgress.find({ user: userId }).sort({ currentLevel: 1 }).lean(),
      LearningLog.find({ user: userId }).sort({ date: -1 }).lean(),
    ])

    const today = new Date()

    const upcomingExams = exams
      .filter((exam) => new Date(exam.examDate) >= today)
      .slice(0, 5)

    const weakSkills = skills
      .filter((skill) => Number(skill.currentLevel || 0) < 60)
      .slice(0, 5)

    const pendingTargets = targets
      .filter((target) => target.status !== "Completed")
      .slice(0, 5)

    const pendingCheckpoints = checkpoints
      .filter((checkpoint) => checkpoint.status !== "Completed")
      .slice(0, 8)

    const recentLogs = learningLogs.slice(0, 7)

    const totalStudyMinutes = recentLogs.reduce(
      (sum, log) => sum + Number(log.totalStudyMinutes || 0),
      0
    )

    const avgFocus =
      recentLogs.length > 0
        ? (
            recentLogs.reduce(
              (sum, log) => sum + Number(log.focusLevel || 0),
              0
            ) / recentLogs.length
          ).toFixed(1)
        : 0

    const avgSuccess =
      recentLogs.length > 0
        ? Math.round(
            recentLogs.reduce(
              (sum, log) => sum + Number(log.successRate || 0),
              0
            ) / recentLogs.length
          )
        : 0

    const recommendations = []

    if (upcomingExams.length > 0) {
      const nearestExam = upcomingExams[0]
      const daysLeft = Math.ceil(
        (new Date(nearestExam.examDate) - today) / (1000 * 60 * 60 * 24)
      )

      recommendations.push({
        type: "exam",
        priority: daysLeft <= 3 ? "High" : "Medium",
        title: `${nearestExam.subject} exam is approaching`,
        message: `${daysLeft} days left. Preparation level is ${
          nearestExam.preparationLevel || 0
        }%. Focus on this subject first.`,
      })
    }

    if (weakSkills.length > 0) {
      recommendations.push({
        type: "skill",
        priority: "Medium",
        title: "Weak skills need attention",
        message: `Lowest skill: ${weakSkills[0].skillName} at ${
          weakSkills[0].currentLevel || 0
        }%. Add practice blocks or checkpoints.`,
      })
    }

    if (pendingCheckpoints.length > 0) {
      recommendations.push({
        type: "checkpoint",
        priority: "Medium",
        title: "Pending checkpoints found",
        message: `You have ${pendingCheckpoints.length} pending checkpoints. Complete small tasks to improve daily success rate.`,
      })
    }

    if (avgFocus && Number(avgFocus) < 3) {
      recommendations.push({
        type: "focus",
        priority: "High",
        title: "Focus level is low",
        message:
          "Your recent focus average is below 3/5. Reduce distractions and schedule smaller study blocks.",
      })
    }

    if (recentLogs.length === 0) {
      recommendations.push({
        type: "learning",
        priority: "Medium",
        title: "No learning logs yet",
        message:
          "Start adding learning logs so AI can analyze your study consistency and weak topics.",
      })
    }

    res.status(200).json({
      profile,
      summary: {
        upcomingExams: upcomingExams.length,
        pendingTargets: pendingTargets.length,
        pendingCheckpoints: pendingCheckpoints.length,
        weakSkills: weakSkills.length,
        recentStudyHours: Math.round((totalStudyMinutes / 60) * 10) / 10,
        avgFocus,
        avgSuccess,
      },
      upcomingExams,
      weakSkills,
      pendingTargets,
      pendingCheckpoints,
      recentLogs,
      timetable,
      recommendations,
    })
  } catch (error) {
    res.status(500).json({
      message: "AI Study Coach analysis failed",
      error: error.message,
    })
  }
}

// 10. STUDENT DOCUMENT CONTROLLERS
const createStudentDocument = async (req, res) => {
  try {
    const userId = getUserId(req)
    const file = req.file

    if (!file) {
      return res.status(400).json({
        message: "Document file is required",
      })
    }

    const publicId = file.public_id || file.filename
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME

    const fileUrl =
      file.secure_url ||
      file.url ||
      (publicId && cloudName
        ? `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`
        : "")

    const fileName = file.originalname || ""
    const fileSize = file.size || 0

    let parsedTags = []
    if (req.body.tags) {
      try {
        parsedTags = Array.isArray(req.body.tags)
          ? req.body.tags
          : JSON.parse(req.body.tags)
      } catch (err) {
        parsedTags = String(req.body.tags).split(",").map((t) => t.trim())
      }
    }

    const document = await StudentDocument.create({
      user: userId,
      title: req.body.title || fileName,
      category: req.body.category,
      documentType: req.body.documentType,
      issuingAuthority: req.body.issuingAuthority,
      documentDate: req.body.documentDate || null,
      expiryDate: req.body.expiryDate || null,
      tags: parsedTags,
      isImportant: req.body.isImportant === "true" || req.body.isImportant === true,
      isVerified: req.body.isVerified === "true" || req.body.isVerified === true,
      notes: req.body.notes,
      fileUrl,
      fileName,
      fileSize,
    })

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    })
  } catch (error) {
    console.log("DOCUMENT UPLOAD ERROR:", error)
    res.status(500).json({
      message: "Failed to upload document",
      error: error.message,
    })
  }
}

const getStudentDocuments = async (req, res) => {
  try {
    const userId = getUserId(req)

    const documents = await StudentDocument.find({ user: userId })
      .sort({ isImportant: -1, createdAt: -1 })
      .lean()

    res.status(200).json({ documents })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    })
  }
}

const updateStudentDocument = async (req, res) => {
  try {
    const userId = getUserId(req)

    const document = await StudentDocument.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!document) {
      return res.status(404).json({ message: "Document not found" })
    }

    res.status(200).json({
      message: "Document updated successfully",
      document,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update document",
      error: error.message,
    })
  }
}

const deleteStudentDocument = async (req, res) => {
  try {
    const userId = getUserId(req)

    const document = await StudentDocument.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    })

    if (!document) {
      return res.status(404).json({ message: "Document not found" })
    }

    res.status(200).json({ message: "Document deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    })
  }
}

// 11. ACADEMIC NOTE CONTROLLERS (MAPPED TO 'Note' MODEL)
const createAcademicNote = async (req, res) => {
  try {
    const userId = getUserId(req)

    if (!req.body.title) {
      return res.status(400).json({ message: "Note title is required" })
    }

    let parsedTags = []
    if (req.body.tags) {
      try {
        parsedTags = Array.isArray(req.body.tags)
          ? req.body.tags
          : JSON.parse(req.body.tags)
      } catch (e) {
        parsedTags = String(req.body.tags).split(",").map((t) => t.trim())
      }
    }

    const note = await Note.create({
      user: userId,
      title: req.body.title,
      content: req.body.content,
      subject: req.body.subject,
      chapter: req.body.chapter,
      noteType: req.body.noteType,
      tags: parsedTags,
      priority: req.body.priority || "Medium",
      revisionStatus: req.body.revisionStatus || "Not Revised",
      isImportant: req.body.isImportant || false,
      folder: "Academic",
      createdBy: "Student Life",
      visibility: "all",
    })

    res.status(201).json({
      message: "Academic note created successfully",
      note,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Failed to create academic note",
      error: error.message,
    })
  }
}

const getAcademicNotes = async (req, res) => {
  try {
    const userId = getUserId(req)

    const notes = await Note.find({
      user: userId,
      folder: "Academic",
    })
      .sort({ isImportant: -1, updatedAt: -1 })
      .lean()

    res.status(200).json({ notes })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Failed to fetch academic notes",
      error: error.message,
    })
  }
}

const updateAcademicNote = async (req, res) => {
  try {
    const userId = getUserId(req)

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
        folder: "Academic",
      },
      req.body,
      { new: true, runValidators: true }
    )

    if (!note) {
      return res.status(404).json({ message: "Academic note not found" })
    }

    res.status(200).json({
      message: "Academic note updated successfully",
      note,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Failed to update academic note",
      error: error.message,
    })
  }
}

const deleteAcademicNote = async (req, res) => {
  try {
    const userId = getUserId(req)

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: userId,
      folder: "Academic",
    })

    if (!note) {
      return res.status(404).json({ message: "Academic note not found" })
    }

    res.status(200).json({ message: "Academic note deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete academic note",
      error: error.message,
    })
  }
}

// 12. DAILY STUDY MAP (Optimized with Promise.all)
const getDailyStudyMap = async (req, res) => {
  try {
    const userId = getUserId(req)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      profile,
      exams,
      targets,
      checkpoints,
      skills,
      timetable,
      recentLogs,
      academicNotes
    ] = await Promise.all([
      StudentProfile.findOne({ user: userId }).lean(),
      ExamSchedule.find({ user: userId, examDate: { $gte: today } }).sort({ examDate: 1 }).lean(),
      Target.find({ user: userId, status: { $ne: "Completed" } }).sort({ dueDate: 1, priority: -1 }).lean(),
      Checkpoint.find({ user: userId, status: { $ne: "Completed" } }).populate("target", "title category priority").sort({ dueDate: 1, createdAt: -1 }).lean(),
      SkillProgress.find({ user: userId }).sort({ currentLevel: 1 }).lean(),
      Timetable.find({ user: userId, isActive: true }).sort({ startTime: 1 }).lean(),
      LearningLog.find({ user: userId }).sort({ date: -1 }).limit(7).lean(),
      Note.find({ user: userId, folder: "Academic", revisionStatus: { $in: ["Not Revised", "Need Revision"] } }).sort({ isImportant: -1, updatedAt: -1 }).limit(5).lean()
    ])

    const dailyPlan = []
    const urgentItems = []
    const improvementFocus = []

    timetable.forEach((block) => {
      dailyPlan.push({
        type: "Timetable Block",
        title: block.subject || block.title || "Scheduled Study",
        subject: block.subject || "General",
        priority: "Medium",
        estimatedMinutes: block.durationMinutes || 60,
        reason: `Scheduled block for ${block.day || "Today"}.`,
      })
    })

    exams.slice(0, 3).forEach((exam) => {
      const daysLeft = Math.ceil(
        (new Date(exam.examDate) - today) / (1000 * 60 * 60 * 24)
      )

      const urgency = daysLeft <= 3 ? "High" : daysLeft <= 7 ? "Medium" : "Low"

      urgentItems.push({
        type: "Exam",
        title: exam.subject,
        priority: urgency,
        reason: `${daysLeft} days left and preparation is ${
          exam.preparationLevel || 0
        }%.`,
      })

      dailyPlan.push({
        type: "Exam Preparation",
        title: `Prepare ${exam.subject}`,
        subject: exam.subject,
        priority: urgency,
        estimatedMinutes:
          urgency === "High" ? 120 : urgency === "Medium" ? 90 : 60,
        reason: `Upcoming exam deadline detected.`,
      })
    })

    checkpoints.slice(0, 5).forEach((checkpoint) => {
      dailyPlan.push({
        type: "Checkpoint",
        title: checkpoint.title,
        subject: checkpoint.category || "General",
        priority: checkpoint.dueDate ? "Medium" : "Low",
        estimatedMinutes: 45,
        reason: checkpoint.target?.title
          ? `Linked with target: ${checkpoint.target.title}`
          : "Pending academic checkpoint.",
      })
    })

    skills
      .filter((skill) => Number(skill.currentLevel || 0) < 60)
      .slice(0, 3)
      .forEach((skill) => {
        improvementFocus.push({
          type: "Skill",
          title: skill.skillName,
          priority: "Medium",
          reason: `Current level is ${
            skill.currentLevel || 0
          }%, below recommended level.`,
        })

        dailyPlan.push({
          type: "Skill Practice",
          title: `Practice ${skill.skillName}`,
          subject: skill.category,
          priority: "Medium",
          estimatedMinutes: 45,
          reason: "Weak skill detected.",
        })
      })

    academicNotes.slice(0, 3).forEach((note) => {
      dailyPlan.push({
        type: "Revision",
        title: `Revise ${note.title}`,
        subject: note.subject,
        priority: note.isImportant ? "High" : "Medium",
        estimatedMinutes: 30,
        reason: `Revision status: ${note.revisionStatus}`,
      })
    })

    const totalStudyMinutes = recentLogs.reduce(
      (sum, log) => sum + Number(log.totalStudyMinutes || 0),
      0
    )

    const avgFocus =
      recentLogs.length > 0
        ? (
            recentLogs.reduce(
              (sum, log) => sum + Number(log.focusLevel || 0),
              0
            ) / recentLogs.length
          ).toFixed(1)
        : 0

    const todayPlan = dailyPlan
      .sort((a, b) => {
        const score = { High: 3, Medium: 2, Low: 1 }
        return score[b.priority] - score[a.priority]
      })
      .slice(0, 8)

    const totalPlannedMinutes = todayPlan.reduce(
      (sum, item) => sum + Number(item.estimatedMinutes || 0),
      0
    )

    res.status(200).json({
      profile,
      summary: {
        totalTasks: todayPlan.length,
        totalPlannedMinutes,
        recentStudyHours: Math.round((totalStudyMinutes / 60) * 10) / 10,
        avgFocus,
        urgentItems: urgentItems.length,
        improvementFocus: improvementFocus.length,
      },
      todayPlan,
      urgentItems,
      improvementFocus,
      timetable,
      recentLogs,
      pendingTargets: targets.slice(0, 5),
      pendingCheckpoints: checkpoints.slice(0, 5),
      revisionNotes: academicNotes,
    })
  } catch (error) {
    res.status(500).json({
      message: "Daily Study Map failed",
      error: error.message,
    })
  }
}

// 13. DAILY SUCCESS RATE (Optimized with Promise.all)
const getDailySuccessRate = async (req, res) => {
  try {
    const userId = getUserId(req)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [checkpoints, targets, learningLogs, timetable] = await Promise.all([
      Checkpoint.find({ user: userId }).sort({ createdAt: -1 }).lean(),
      Target.find({ user: userId }).sort({ dueDate: 1 }).lean(),
      LearningLog.find({ user: userId }).sort({ date: -1 }).lean(),
      Timetable.find({ user: userId, isActive: true }).lean(),
    ])

    const todayLogs = learningLogs.filter((log) => {
      const date = new Date(log.date)
      return date >= today && date < tomorrow
    })

    const completedCheckpoints = checkpoints.filter(
      (item) => item.status === "Completed"
    ).length

    const totalCheckpoints = checkpoints.length

    const checkpointScore =
      totalCheckpoints > 0
        ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
        : 0

    const completedTargets = targets.filter(
      (item) => item.status === "Completed"
    ).length

    const targetScore =
      targets.length > 0
        ? Math.round((completedTargets / targets.length) * 100)
        : 0

    const todayStudyMinutes = todayLogs.reduce(
      (sum, log) => sum + Number(log.totalStudyMinutes || 0),
      0
    )

    // Scaled to 240 mins (4 hrs)
    const studyScore = Math.min(
      100,
      Math.round((todayStudyMinutes / 240) * 100)
    )

    const todayLogSuccess =
      todayLogs.length > 0
        ? Math.round(
            todayLogs.reduce(
              (sum, log) => sum + Number(log.successRate || 0),
              0
            ) / todayLogs.length
          )
        : 0

    const activeTimetableBlocks = timetable.length

    const timetableScore =
      activeTimetableBlocks > 0
        ? Math.min(100, Math.round((todayStudyMinutes / 240) * 100))
        : 0

    const overallScore = Math.round(
      checkpointScore * 0.3 +
        targetScore * 0.25 +
        studyScore * 0.25 +
        todayLogSuccess * 0.2
    )

    const productivityLevel =
      overallScore >= 85
        ? "Excellent"
        : overallScore >= 70
        ? "Good"
        : overallScore >= 50
        ? "Average"
        : overallScore > 0
        ? "Low"
        : "No Data"

    const insights = []

    if (checkpointScore < 50 && totalCheckpoints > 0) {
      insights.push({
        type: "Checkpoint",
        priority: "High",
        message:
          "Checkpoint completion is low. Complete small tasks first to improve today’s progress.",
      })
    }

    if (studyScore < 50) {
      insights.push({
        type: "Study Time",
        priority: "Medium",
        message:
          "Today’s study time is below target. Add at least one focused study session.",
      })
    }

    if (targetScore < 50 && targets.length > 0) {
      insights.push({
        type: "Targets",
        priority: "Medium",
        message:
          "Target progress is low. Update progress or complete pending goals.",
      })
    }

    if (overallScore >= 80) {
      insights.push({
        type: "Performance",
        priority: "Low",
        message:
          "Great performance today. Keep this consistency going.",
      })
    }

    res.status(200).json({
      date: today,
      scores: {
        overallScore,
        checkpointScore,
        targetScore,
        studyScore,
        timetableScore,
        todayLogSuccess,
      },
      productivityLevel,
      stats: {
        totalCheckpoints,
        completedCheckpoints,
        totalTargets: targets.length,
        completedTargets,
        todayStudyMinutes,
        todayStudyHours: Math.round((todayStudyMinutes / 60) * 10) / 10,
        todayLogs: todayLogs.length,
        activeTimetableBlocks,
      },
      insights,
      recentLogs: learningLogs.slice(0, 5),
      pendingCheckpoints: checkpoints
        .filter((item) => item.status !== "Completed")
        .slice(0, 5),
      pendingTargets: targets
        .filter((item) => item.status !== "Completed")
        .slice(0, 5),
    })
  } catch (error) {
    res.status(500).json({
      message: "Daily Success Rate failed",
      error: error.message,
    })
  }
}

// 14. STUDY IMPROVER (Optimized with Promise.all)
const getStudyImprover = async (req, res) => {
  try {
    const userId = getUserId(req)

    const [exams, targets, checkpoints, skills, learningLogs, notes] = await Promise.all([
      ExamSchedule.find({ user: userId }).sort({ examDate: 1 }).lean(),
      Target.find({ user: userId }).sort({ dueDate: 1 }).lean(),
      Checkpoint.find({ user: userId }).sort({ createdAt: -1 }).lean(),
      SkillProgress.find({ user: userId }).sort({ currentLevel: 1 }).lean(),
      LearningLog.find({ user: userId }).sort({ date: -1 }).lean(),
      Note.find({ user: userId, folder: "Academic" }).sort({ updatedAt: -1 }).lean(),
    ])

    const weakSubjectsMap = {}

    learningLogs.forEach((log) => {
      ;(log.weakAreasFound || []).forEach((area) => {
        weakSubjectsMap[area] = (weakSubjectsMap[area] || 0) + 1
      })
    })

    notes.forEach((note) => {
      if (
        note.revisionStatus === "Not Revised" ||
        note.revisionStatus === "Need Revision"
      ) {
        weakSubjectsMap[note.subject] =
          (weakSubjectsMap[note.subject] || 0) + 1
      }
    })

    const weakSubjects = Object.entries(weakSubjectsMap)
      .map(([name, count]) => ({
        name,
        count,
        reason: "Found in weak areas or unrevised notes.",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const incompleteTargets = targets
      .filter((target) => target.status !== "Completed")
      .slice(0, 6)

    const skippedCheckpoints = checkpoints
      .filter((checkpoint) => checkpoint.status !== "Completed")
      .slice(0, 8)

    const weakSkills = skills
      .filter((skill) => Number(skill.currentLevel || 0) < 60)
      .slice(0, 6)

    const lowPreparedExams = exams
      .filter((exam) => Number(exam.preparationLevel || 0) < 60)
      .slice(0, 5)

    const recentLogs = learningLogs.slice(0, 7)

    const avgFocus =
      recentLogs.length > 0
        ? (
            recentLogs.reduce(
              (sum, log) => sum + Number(log.focusLevel || 0),
              0
            ) / recentLogs.length
          ).toFixed(1)
        : 0

    const avgSuccess =
      recentLogs.length > 0
        ? Math.round(
            recentLogs.reduce(
              (sum, log) => sum + Number(log.successRate || 0),
              0
            ) / recentLogs.length
          )
        : 0

    const improvementPlan = []

    if (lowPreparedExams.length > 0) {
      improvementPlan.push({
        type: "Exam Preparation",
        priority: "High",
        title: "Improve low-prepared exam subjects",
        action: `Start with ${lowPreparedExams[0].subject}. Current preparation is ${
          lowPreparedExams[0].preparationLevel || 0
        }%.`,
      })
    }

    if (weakSubjects.length > 0) {
      improvementPlan.push({
        type: "Weak Subject",
        priority: "High",
        title: "Revise weak subject areas",
        action: `Focus on ${weakSubjects[0].name}. It appears repeatedly in weak/revision data.`,
      })
    }

    if (skippedCheckpoints.length > 0) {
      improvementPlan.push({
        type: "Checkpoint",
        priority: "Medium",
        title: "Complete pending checkpoints",
        action: `You have ${skippedCheckpoints.length} pending checkpoints. Finish the smallest ones first.`,
      })
    }

    if (weakSkills.length > 0) {
      improvementPlan.push({
        type: "Skill",
        priority: "Medium",
        title: "Improve weak career skills",
        action: `Practice ${weakSkills[0].skillName}. Current level is ${
          weakSkills[0].currentLevel || 0
        }%.`,
      })
    }

    if (Number(avgFocus) < 3 && recentLogs.length > 0) {
      improvementPlan.push({
        type: "Focus",
        priority: "High",
        title: "Improve focus quality",
        action:
          "Use shorter 25–40 minute study blocks and avoid multitasking during study.",
      })
    }

    res.status(200).json({
      summary: {
        weakSubjects: weakSubjects.length,
        incompleteTargets: incompleteTargets.length,
        skippedCheckpoints: skippedCheckpoints.length,
        weakSkills: weakSkills.length,
        lowPreparedExams: lowPreparedExams.length,
        avgFocus,
        avgSuccess,
      },
      weakSubjects,
      incompleteTargets,
      skippedCheckpoints,
      weakSkills,
      lowPreparedExams,
      improvementPlan,
      recentLogs,
    })
  } catch (error) {
    res.status(500).json({
      message: "Study Improver failed",
      error: error.message,
    })
  }
}

module.exports = {
  getStudentLifeDashboard,
  getStudentProfile,
  updateStudentProfile,

  createTarget,
  getTargets,
  updateTarget,
  deleteTarget,

  createCheckpoint,
  getCheckpoints,
  updateCheckpoint,
  deleteCheckpoint,

  createExam,
  getExams,
  updateExam,
  deleteExam,

  createTimetableBlock,
  getTimetableBlocks,
  updateTimetableBlock,
  deleteTimetableBlock,

  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,

  createLearningLog,
  getLearningLogs,
  updateLearningLog,
  deleteLearningLog,

  getAIStudyCoach,

  createStudentDocument,
  getStudentDocuments,
  updateStudentDocument,
  deleteStudentDocument,

  createAcademicNote,
  getAcademicNotes,
  updateAcademicNote,
  deleteAcademicNote,

  getDailyStudyMap,
  getDailySuccessRate,
  getStudyImprover,
}