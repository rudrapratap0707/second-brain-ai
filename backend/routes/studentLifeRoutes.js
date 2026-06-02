const express = require("express")

const {
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


} = require("../controllers/studentLifeController")

const protect = require("../middleware/authMiddleware")

const uploadDocument = require("../middleware/uploadMiddleware")

const router = express.Router()

router.get(
  "/dashboard",
  protect,
  getStudentLifeDashboard
)

router.get(
  "/profile",
  protect,
  getStudentProfile
)

router.put(
  "/profile",
  protect,
  updateStudentProfile
)

// TARGETS & GOALS
router.post(
  "/targets",
  protect,
  createTarget
)

router.get(
  "/targets",
  protect,
  getTargets
)

router.put(
  "/targets/:id",
  protect,
  updateTarget
)

router.delete(
  "/targets/:id",
  protect,
  deleteTarget
)

// CHECKPOINTS
router.post(
  "/checkpoints",
  protect,
  createCheckpoint
)

router.get(
  "/checkpoints",
  protect,
  getCheckpoints
)

router.put(
  "/checkpoints/:id",
  protect,
  updateCheckpoint
)

router.delete(
  "/checkpoints/:id",
  protect,
  deleteCheckpoint
)

// EXAMS
router.post(
  "/exams",
  protect,
  createExam
)

router.get(
  "/exams",
  protect,
  getExams
)

router.put(
  "/exams/:id",
  protect,
  updateExam
)

router.delete(
  "/exams/:id",
  protect,
  deleteExam
)

// TIMETABLE
router.post(
  "/timetable",
  protect,
  createTimetableBlock
)

router.get(
  "/timetable",
  protect,
  getTimetableBlocks
)

router.put(
  "/timetable/:id",
  protect,
  updateTimetableBlock
)

router.delete(
  "/timetable/:id",
  protect,
  deleteTimetableBlock
)

// DAILY STUDY MAP
router.get(
  "/daily-study-map",
  protect,
  getDailyStudyMap
)

// DAILY SUCCESS RATE
router.get(
  "/daily-success-rate",
  protect,
  getDailySuccessRate
)

// SKILLS
router.post("/skills", protect, createSkill)
router.get("/skills", protect, getSkills)
router.put("/skills/:id", protect, updateSkill)
router.delete("/skills/:id", protect, deleteSkill)

// LEARNING LOGS
router.post("/learning-logs", protect, createLearningLog)
router.get("/learning-logs", protect, getLearningLogs)
router.put("/learning-logs/:id", protect, updateLearningLog)
router.delete("/learning-logs/:id", protect, deleteLearningLog)

// AI STUDY COACH
router.get(
  "/ai-study-coach",
  protect,
  getAIStudyCoach
)

// STUDENT DOCUMENT VAULT
router.post(
  "/documents",
  protect,
  uploadDocument.single("file"),
  createStudentDocument
)

router.get(
  "/documents",
  protect,
  getStudentDocuments
)

// STUDY IMPROVER
router.get(
  "/study-improver",
  protect,
  getStudyImprover
)

router.put(
  "/documents/:id",
  protect,
  updateStudentDocument
)

router.delete(
  "/documents/:id",
  protect,
  deleteStudentDocument
)

// NOTES COLLECTION
router.post(
  "/academic-notes",
  protect,
  createAcademicNote
)

router.get(
  "/academic-notes",
  protect,
  getAcademicNotes
)

router.put(
  "/academic-notes/:id",
  protect,
  updateAcademicNote
)

router.delete(
  "/academic-notes/:id",
  protect,
  deleteAcademicNote
)

module.exports = router