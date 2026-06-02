const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")

dotenv.config()

const User = require("../models/User")
const Note = require("../models/Note")
const Reminder = require("../models/Reminder")
const Mood = require("../models/Mood")
const Chat = require("../models/Chat")

const StudentProfile = require("../models/StudentProfile")
const StudySession = require("../models/StudySession")
const ExamSchedule = require("../models/ExamSchedule")
const Timetable = require("../models/Timetable")
const Target = require("../models/Target")
const Checkpoint = require("../models/Checkpoint")
const SkillProgress = require("../models/SkillProgress")
const LearningLog = require("../models/LearningLog")
const StudentDocument = require("../models/StudentDocument")
const AcademicNote = require("../models/AcademicNote")

const flushData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log("MongoDB connected")

    await User.deleteMany()
    await Note.deleteMany()
    await Reminder.deleteMany()
    await Mood.deleteMany()
    await Chat.deleteMany()

    await StudentProfile.deleteMany()
    await StudySession.deleteMany()
    await ExamSchedule.deleteMany()
    await Timetable.deleteMany()
    await Target.deleteMany()
    await Checkpoint.deleteMany()
    await SkillProgress.deleteMany()
    await LearningLog.deleteMany()
    await StudentDocument.deleteMany()
    await AcademicNote.deleteMany()

    const uploadDir = path.join(__dirname, "../uploads/documents")

    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, {
        recursive: true,
        force: true,
      })

      fs.mkdirSync(uploadDir, {
        recursive: true,
      })

      console.log("Uploaded documents deleted")
    }

    console.log("All current data flushed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Flush failed:", error)
    process.exit(1)
  }
}

flushData()