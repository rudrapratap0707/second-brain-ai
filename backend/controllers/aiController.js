const axios = require("axios")

// All Student Life OS Models
const Note = require("../models/Note")
const File = require("../models/File")
const Target = require("../models/Target")
const Checkpoint = require("../models/Checkpoint")
const Exam = require("../models/Exam")
const Timetable = require("../models/Timetable")
const SkillProgress = require("../models/SkillProgress") // Updated Model Import
const LearningLog = require("../models/LearningLog")
const StudentProfile = require("../models/StudentProfile")

const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-flash-latest",
]

// COMMON GEMINI CALL WITH FALLBACK
const callGemini = async (prompt) => {
  let lastError = null

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

      const response = await axios.post(
        url,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": process.env.GEMINI_API_KEY,
          },
          timeout: 30000,
        }
      )

      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (text) {
        return text
      }
    } catch (error) {
      lastError = error

      console.log(
        `${model} failed:`,
        error.response?.data || error.message
      )
    }
  }

  throw lastError
}

// AI NOTE SUMMARY
const summarizeNote = async (req, res) => {
  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({
        message: "Note content is required",
      })
    }

    const prompt = `
Summarize this note in simple student-friendly points.

Rules:
- Use clear bullet points.
- Keep it useful for revision.
- Do not add unrelated information.

Note:
${content}
`

    const summary = await callGemini(prompt)

    res.status(200).json({
      summary,
    })
  } catch (error) {
    console.log(
      "AI SUMMARY ERROR:",
      error.response?.data || error.message
    )

    res.status(500).json({
      message: "AI summary failed",
      error: error.response?.data || error.message,
    })
  }
}

// MEMORY-BASED FULL STUDENT LIFE OS AI CHAT
const chatWithAI = async (req, res) => {
  console.log("🔥 FULL STUDENT LIFE OS AI CONTROLLER RUNNING")
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      })
    }

    const userId = req.user?._id || req.user?.id

    // ⚡ PARALLEL DATABASE FETCHING WITH SAFE EXECUTIONS
    const [
      profile,
      targets,
      checkpoints,
      exams,
      timetable,
      skills,
      learningLogs,
      notes,
      files,
    ] = await Promise.all([
      StudentProfile.findOne({ user: userId }).lean().catch(() => null),
      Target.find({ user: userId }).sort({ createdAt: -1 }).limit(10).lean().catch(() => []),
      Checkpoint.find({ user: userId }).sort({ createdAt: -1 }).limit(10).lean().catch(() => []),
      Exam.find({ user: userId, examDate: { $gte: new Date() } }).sort({ examDate: 1 }).limit(10).lean().catch(() => []),
      Timetable.find({ user: userId }).lean().catch(() => []),
      SkillProgress.find({ user: userId }).lean().catch(() => []), // Updated Query
      LearningLog.find({ user: userId }).sort({ date: -1 }).limit(10).lean().catch(() => []),
      Note.find({ user: userId }).sort({ updatedAt: -1 }).limit(25).lean().catch(() => []),
      File.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
    ])

    // 1. STUDENT PROFILE CONTEXT
    const profileContext = profile
      ? `
Name: ${profile.fullName || "Student"}
College: ${profile.collegeName || "N/A"}
Course: ${profile.courseName || "N/A"}
Semester: ${profile.currentSemester || "N/A"}
Academic Year: ${profile.academicYear || "N/A"}
Career Goal: ${profile.careerGoal || "N/A"}
Target Role: ${profile.targetRole || "N/A"}
Preferred Study Time: ${profile.preferredStudyTime || "Flexible"}
Daily Capacity: ${profile.dailyStudyCapacityHours || 0} Hours
Strong Areas: ${(profile.strongAreas || []).join(", ")}
Weak Areas: ${(profile.weakAreas || []).join(", ")}
Skills: ${(profile.currentSkills || []).join(", ")}
`
      : "No profile found."

    // 2. TARGETS CONTEXT
    const targetsContext = targets.length
      ? targets
          .map(
            (t) =>
              `- ${t.title}
Status: ${t.status || "Pending"}
Progress: ${t.progress || 0}%
Priority: ${t.priority || "Normal"}
Due: ${t.dueDate ? new Date(t.dueDate).toDateString() : "N/A"}`
          )
          .join("\n\n")
      : "No Targets"

    // 3. CHECKPOINTS CONTEXT
    const checkpointsContext = checkpoints.length
      ? checkpoints
          .map(
            (c) =>
              `- [${c.completed ? "Completed" : "Pending"}] ${c.title} (Target: ${c.targetTitle || "General"})`
          )
          .join("\n")
      : "No active checkpoints."

    // 4. UPCOMING EXAMS CONTEXT
    const examsContext = exams.length
      ? exams
          .map(
            (e) =>
              `- ${e.subject || e.title}: ${e.examDate ? new Date(e.examDate).toDateString() : "TBD"} (Syllabus Covered: ${e.progress || 0}%)`
          )
          .join("\n")
      : "No upcoming exams scheduled."

    // 5. TIMETABLE CONTEXT
    const timetableContext = timetable.length
      ? timetable
          .map(
            (t) =>
              `- ${t.day || "Day"}: ${t.subject || t.title || t.activity || "Activity"} (${t.startTime || "N/A"} - ${t.endTime || "N/A"})`
          )
          .join("\n")
      : "No timetable."

    // 6. SKILLS CONTEXT
    const skillsContext = skills.length
      ? skills
          .map(
            (s) =>
              `${s.skillName || "Skill"}
Level: ${s.currentLevel || 0}%
Target: ${s.targetLevel || 0}%
Confidence: ${s.confidenceLevel || 0}/5`
          )
          .join("\n\n")
      : "No Skills"

    // 7. LEARNING LOGS CONTEXT
    const logsContext = learningLogs.length
      ? learningLogs
          .map(
            (l) =>
              `Date: ${l.date ? new Date(l.date).toDateString() : "Recent"}
Study Time: ${l.totalStudyMinutes || 0} mins
Success: ${l.successRate || 0}%
Note: ${l.productivityNote || "None"}`
          )
          .join("\n\n")
      : "No Learning Logs"

    // 8. NOTES CONTEXT (Truncated to 700 chars for optimal payload performance)
    const notesContext = notes.length
      ? notes
          .map(
            (n, i) =>
              `[Note ${i + 1}] Title: ${n.title} | Subject: ${n.subject || "General"} | Folder: ${n.folder || "Default"}\nContent: ${n.content ? n.content.slice(0, 700) : "No content"}...`
          )
          .join("\n\n")
      : "No notes found."

    // 9. FILES CONTEXT (Truncated to 1000 chars)
    const filesContext = files.length
      ? files
          .map(
            (f, i) =>
              `[File ${i + 1}] Name: ${f.originalName}\nExtracted Text: ${f.extractedText ? f.extractedText.slice(0, 1000) : "N/A"}`
          )
          .join("\n\n")
      : "No uploaded files found."

    // MASTER PROMPT FOR SECONDBRAIN AI
    const prompt = `
You are SecondBrain AI — an intelligent, context-aware study coach and productivity assistant built into Student Life OS.

Below is the complete live context of the user's academic and learning profile:

----------------------------------------------------
1. STUDENT PROFILE
----------------------------------------------------
${profileContext}

----------------------------------------------------
2. ACTIVE TARGETS
----------------------------------------------------
${targetsContext}

----------------------------------------------------
3. CHECKPOINTS
----------------------------------------------------
${checkpointsContext}

----------------------------------------------------
4. UPCOMING EXAMS
----------------------------------------------------
${examsContext}

----------------------------------------------------
5. TIMETABLE
----------------------------------------------------
${timetableContext}

----------------------------------------------------
6. SKILLS
----------------------------------------------------
${skillsContext}

----------------------------------------------------
7. RECENT LEARNING LOGS
----------------------------------------------------
${logsContext}

----------------------------------------------------
8. NOTES (Academic & General)
----------------------------------------------------
${notesContext}

----------------------------------------------------
9. UPLOADED FILES & DOCUMENTS
----------------------------------------------------
${filesContext}

----------------------------------------------------
USER QUESTION / QUERY
----------------------------------------------------
${message}

----------------------------------------------------
RESPONSE GUIDELINES & SPECIFIC INTENT RULES
----------------------------------------------------
• Priority Order: User Notes/Files > Academic Schedule/Exams > General Student OS Context > General Knowledge.
• Tone: Helpful, structured, encouraging study coach.
• Language: Clean Hinglish unless requested otherwise.
• If answering from Notes/Files, clearly state: "📚 Based on your notes..." or "📄 Based on your files...".

----------------------------------------------------
CUSTOM QUERY INTENT HANDLERS:
----------------------------------------------------

1. If user asks: "What should I study today?"
   Prioritize in this order:
   i. Upcoming exams
   ii. Pending checkpoints
   iii. Pending targets
   iv. Weak areas from Student Profile & Skills
   v. Timetable
   And generate today's actionable study plan.

2. If user asks: "How am I doing?"
   Analyze:
   • Skills Progress & Confidence
   • Learning Logs (Study time, Focus level, Success rate)
   • Active Targets & Progress
   • Checkpoints
   • Notes
   • Student Profile
   Then provide strengths, weaknesses, and a concrete next action plan.

3. If user asks career-related questions:
   Personalize advice using:
   • Career Goal
   • Target Role
   • Current Skills
   • Weak Areas
   • Strong Areas
`

    const reply = await callGemini(prompt)

    res.status(200).json({
      reply,
      contextDataUsed: {
        targetsCount: targets.length,
        examsCount: exams.length,
        notesUsed: notes.length,
        filesUsed: files.length,
      },
    })
  } catch (error) {
    console.log(
      "AI CHAT ERROR:",
      error.response?.data || error.message
    )

    res.status(500).json({
      message: "AI chat failed",
      error: error.response?.data || error.message,
    })
  }
}

module.exports = {
  summarizeNote,
  chatWithAI,
}