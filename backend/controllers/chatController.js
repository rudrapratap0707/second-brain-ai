const Chat = require("../models/Chat")
const Note = require("../models/Note")
const File = require("../models/File")
const Mood = require("../models/Mood")
const Settings = require("../models/Settings")
const Reminder = require("../models/Reminder")

const axios = require("axios")

const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-flash-latest",
]

const VALID_PERSONALITIES = [
  "friendly",
  "professional",
  "motivational",
  "minimal",
]

const VALID_MOODS = [
  "Happy",
  "Sad",
  "Neutral",
  "Stressed",
  "Focused",
  "Tired",
]

const VALID_PRIORITIES = [
  "Low",
  "Medium",
  "High",
]

const VALID_REPEAT_VALUES = [
  "None",
  "Daily",
  "Weekly",
  "Monthly",
]

const getUserId = (req) => {
  return req.user?._id || req.user?.id
}

const safeString = (value, fallback = "") => {
  if (typeof value !== "string") return fallback
  return value.trim()
}

const safeNumber = (value, fallback = 0) => {
  const number = Number(value)
  if (Number.isNaN(number)) return fallback
  return number
}

const formatDateForUser = (dateValue) => {
  if (!dateValue) return "No date"

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const getAIUnavailableMessage = () => {
  return `
# AI Temporarily Unavailable

I'm temporarily unable to access the AI model because the API quota has been exceeded or the service is currently busy.

Please try again in a minute.

Meanwhile, your SecondBrain system is still active and your data is safely stored:

- Notes Memory
- PDF/File Memory
- Chat History
- Mood Tracking
- Reminder System
- Productivity Data

Nothing has been lost.
`
}

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

  console.log(
    "ALL GEMINI MODELS FAILED:",
    lastError?.response?.data || lastError?.message
  )

  throw new Error("AI_TEMPORARILY_UNAVAILABLE")
}

const callGeminiJson = async (prompt) => {
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
          generationConfig: {
            responseMimeType: "application/json",
          },
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

      if (!text) continue

      return JSON.parse(text)
    } catch (error) {
      lastError = error

      console.log(
        "GEMINI JSON FAILED:",
        model,
        error.response?.data || error.message
      )
    }
  }

  console.log(
    "ALL GEMINI JSON MODELS FAILED:",
    lastError?.response?.data || lastError?.message
  )

  throw new Error("AI_JSON_EXTRACTION_FAILED")
}

const getPersonalityInstruction = (personality) => {
  const mode = VALID_PERSONALITIES.includes(personality)
    ? personality
    : "friendly"

  const instructions = {
    friendly:
      "Respond in a friendly, warm, simple, supportive, student-friendly tone.",
    professional:
      "Respond in a formal, structured, precise, and professional tone.",
    motivational:
      "Respond in an energetic, encouraging, confidence-building tone.",
    minimal:
      "Respond briefly and directly without unnecessary explanation.",
  }

  return instructions[mode]
}

const getUserSettings = async (userId) => {
  let settings = await Settings.findOne({
    user: userId,
  })

  if (!settings) {
    settings = await Settings.create({
      user: userId,
    })
  }

  return settings
}

const buildNotesContext = (notes) => {
  if (!notes || notes.length === 0) return ""

  return notes
    .map((note, index) => {
      return `
Note ${index + 1}
Title: ${note.title}
Content: ${note.content}
Created At: ${note.createdAt}
`
    })
    .join("\n")
}

const buildFilesContext = (files) => {
  if (!files || files.length === 0) return ""

  return files
    .map((file, index) => {
      return `
File ${index + 1}
File Name: ${file.originalName}
File Type: ${file.mimeType}
Uploaded At: ${file.createdAt}
Extracted Text:
${
  file.extractedText
    ? file.extractedText.slice(0, 5000)
    : "No extracted text available."
}
`
    })
    .join("\n")
}

const buildMoodsContext = (moods) => {
  if (!moods || moods.length === 0) return ""

  return moods
    .map((mood, index) => {
      return `
Mood ${index + 1}
Mood: ${mood.mood}
Score: ${mood.score}/5
Note: ${mood.note || "No mood note"}
Created At: ${mood.createdAt}
`
    })
    .join("\n")
}

const buildRemindersContext = (reminders) => {
  if (!reminders || reminders.length === 0) return ""

  return reminders
    .map((reminder, index) => {
      return `
Reminder ${index + 1}
Title: ${reminder.title}
Description: ${reminder.description || "No description"}
Due Date: ${reminder.dueDate}
Priority: ${reminder.priority}
Repeat: ${reminder.repeat || "None"}
Source: ${reminder.source || "Manual"}
Completed: ${reminder.completed ? "Yes" : "No"}
Created At: ${reminder.createdAt}
`
    })
    .join("\n")
}

const buildPreviousMessagesContext = (chat) => {
  if (!chat?.messages || chat.messages.length === 0) return ""

  return chat.messages
    .slice(-14)
    .map((msg) => `${msg.role}: ${msg.text}`)
    .join("\n")
}

const getMemoryContext = async (userId, chat, aiMemory) => {
  let notes = []
  let files = []
  let moods = []
  let reminders = []

  let notesContext = ""
  let filesContext = ""
  let moodsContext = ""
  let remindersContext = ""
  let previousMessages = ""

  let latestMood = null
  let averageMoodScore = "No mood data"

  if (!aiMemory) {
    return {
      notes,
      files,
      moods,
      reminders,
      notesContext,
      filesContext,
      moodsContext,
      remindersContext,
      previousMessages,
      latestMood,
      averageMoodScore,
    }
  }

  notes = await Note.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .limit(20)

  files = await File.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .limit(10)

  moods = await Mood.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .limit(20)

  reminders = await Reminder.find({
    user: userId,
  })
    .sort({ dueDate: 1 })
    .limit(50)

  latestMood = moods[0] || null

  averageMoodScore =
    moods.length > 0
      ? (
          moods.reduce(
            (sum, item) =>
              sum + safeNumber(item.score, 0),
            0
          ) / moods.length
        ).toFixed(1)
      : "No mood data"

  notesContext = buildNotesContext(notes)
  filesContext = buildFilesContext(files)
  moodsContext = buildMoodsContext(moods)
  remindersContext = buildRemindersContext(reminders)
  previousMessages = buildPreviousMessagesContext(chat)

  return {
    notes,
    files,
    moods,
    reminders,
    notesContext,
    filesContext,
    moodsContext,
    remindersContext,
    previousMessages,
    latestMood,
    averageMoodScore,
  }
}

const buildMoodUpdatedReply = (createdMood) => {
  return `
# Mood Updated Successfully ✅

Your mood has been updated.

- Mood: ${createdMood.mood}
- Score: ${createdMood.score}/5
- Note: ${createdMood.note || "No note"}

You can view your mood history on the Mood page.
`
}

const buildMoodListReply = (moods) => {
  if (!moods || moods.length === 0) {
    return `
# Your Mood

No mood has been logged yet.
`
  }

  const latestMood = moods[0]

  return `
# Your Current Mood

Your latest mood is:

- Mood: ${latestMood.mood}
- Score: ${latestMood.score}/5
- Note: ${latestMood.note || "No note"}
- Updated At: ${formatDateForUser(latestMood.createdAt)}
`
}

const buildRemindersCreatedReply = (createdReminders) => {
  if (!createdReminders || createdReminders.length === 0) {
    return `
# No Reminders Created

I could not create any reminders.
`
  }

  return `
# Reminder${createdReminders.length > 1 ? "s" : ""} Created Successfully ✅

${createdReminders
  .map(
    (item, index) => `
## ${index + 1}. ${item.title}

- Due Date: ${formatDateForUser(item.dueDate)}
- Priority: ${item.priority}
- Repeat: ${item.repeat || "None"}
- Status: Pending
`
  )
  .join("\n")}

You can view or manage ${
    createdReminders.length > 1
      ? "these reminders"
      : "this reminder"
  } from the Reminders page.
`
}

const buildReminderListReply = (reminders) => {
  if (!reminders || reminders.length === 0) {
    return `
# Your Reminders

You do not have any reminders yet.

Example:

**Set reminder for tomorrow 8 AM for revision**
`
  }

  const pending = reminders.filter((item) => !item.completed)
  const completed = reminders.filter((item) => item.completed)

  return `
# Your Reminders

You have **${reminders.length}** reminder(s).

## Pending Reminders

${
  pending.length > 0
    ? pending
        .map(
          (item, index) => `
${index + 1}. **${item.title}**
- Due Date: ${formatDateForUser(item.dueDate)}
- Priority: ${item.priority}
- Repeat: ${item.repeat || "None"}
- Status: Pending
${item.description ? `- Details: ${item.description}` : ""}
`
        )
        .join("\n")
    : "No pending reminders."
}

## Completed Reminders

${
  completed.length > 0
    ? completed
        .map(
          (item, index) => `
${index + 1}. **${item.title}**
- Due Date: ${formatDateForUser(item.dueDate)}
- Priority: ${item.priority}
- Repeat: ${item.repeat || "None"}
- Status: Completed
`
        )
        .join("\n")
    : "No completed reminders."
}
`
}

const buildClarificationReply = (question) => {
  return `
# Need More Details

${question || "Please provide the missing details."}
`
}

const extractAIAction = async ({
  message,
  previousMessages,
  notesContext,
  filesContext,
  moodsContext,
  remindersContext,
  latestMood,
  averageMoodScore,
}) => {
  const now = new Date()

  const prompt = `
You are the pure AI action engine for SecondBrain AI.

Current Date Time:
${now.toISOString()}

User Message:
${message}

Previous Chat Context:
${previousMessages || "No previous chat context."}

User Notes Context:
${notesContext || "No notes."}

User Files Context:
${filesContext || "No uploaded files."}

User Mood Context:
${moodsContext || "No mood history."}

Latest Mood Summary:
${
  latestMood
    ? `${latestMood.mood}, score ${latestMood.score}/5, note: ${
        latestMood.note || "No note"
      }, created at ${latestMood.createdAt}`
    : "No latest mood found."
}
Average Mood Score:
${averageMoodScore}

User Reminders Context:
${remindersContext || "No reminders."}

Return ONLY valid JSON.

Schema:
{
  "action": "chat" | "view_mood" | "update_mood" | "view_reminders" | "create_reminders" | "ask_clarification",
  "reason": string,

  "moodUpdate": {
    "mood": "Happy" | "Sad" | "Neutral" | "Stressed" | "Focused" | "Tired",
    "score": 1 | 2 | 3 | 4 | 5,
    "note": string
  },

  "reminders": [
    {
      "title": string,
      "description": string,
      "dueDate": string,
      "priority": "Low" | "Medium" | "High",
      "repeat": "None" | "Daily" | "Weekly" | "Monthly"
    }
  ],

  "clarificationQuestion": string
}

Rules:
- Use pure AI understanding.
- Do not rely on fixed keywords.
- Do not invent unrelated default reminders.
- If user asks to view current/latest/recent mood, action must be "view_mood".
- If user clearly asks to update/set/log current mood, action must be "update_mood".
- For mood update, analyze meaning and intensity from the user's message.
- If mood is unclear, action must be "ask_clarification".
- If user asks to view/list/show reminders/tasks, action must be "view_reminders".
- If user asks to create one or multiple reminders, action must be "create_reminders".
- If user says "set these reminders", "set them", "yes set first reminder", or refers to previous reminders, use Previous Chat Context to infer the intended reminder(s).
- If only first/second/third reminder is requested, create only that one from previous context.
- If multiple reminders are clearly listed in previous context and user confirms all, create all of them.
- If reminder task is clear but date/time is missing, action must be "ask_clarification".
- If reminder date/time is clear but task is missing, action must be "ask_clarification".
- Reminder dueDate must be ISO date string.
- Use India timezone context.
- Interpret Hinglish/Hindi naturally:
  kal = tomorrow
  aaj = today
  parso = day after tomorrow
  shaam = evening
  subah = morning
  raat = night
  baje = o'clock
- Repeat:
  every day / daily / roz = Daily
  every week / weekly / har week = Weekly
  every month / monthly = Monthly
- If priority is unclear, use Medium.
- If repeat is unclear, use None.
- If no database action is needed, action must be "chat".
- Never claim something was saved unless backend will save it.
`

  const result = await callGeminiJson(prompt)

  if (!result || !result.action) {
    return {
      action: "chat",
      reason: "Invalid AI action response",
      reminders: [],
      moodUpdate: null,
      clarificationQuestion: "",
    }
  }

  return {
    action: result.action,
    reason: result.reason || "",
    moodUpdate: result.moodUpdate || null,
    reminders: Array.isArray(result.reminders)
      ? result.reminders
      : [],
    clarificationQuestion:
      result.clarificationQuestion || "",
  }
}

const validateMoodUpdate = (moodUpdate) => {
  if (!moodUpdate) return null

  const mood = safeString(moodUpdate.mood)
  const score = safeNumber(moodUpdate.score, 0)
  const note = safeString(
    moodUpdate.note,
    "Mood updated by SecondBrain AI."
  )

  if (!VALID_MOODS.includes(mood)) {
    return null
  }

  if (score < 1 || score > 5) {
    return null
  }

  return {
    mood,
    score,
    note,
  }
}

const validateReminders = (reminders) => {
  if (!Array.isArray(reminders)) return []

  return reminders
    .filter((item) => item && item.title && item.dueDate)
    .map((item) => {
      const dueDate = new Date(item.dueDate)

      if (Number.isNaN(dueDate.getTime())) {
        return null
      }

      const priority = VALID_PRIORITIES.includes(item.priority)
        ? item.priority
        : "Medium"

      const repeat = VALID_REPEAT_VALUES.includes(item.repeat)
        ? item.repeat
        : "None"

      return {
        title: safeString(item.title, "AI Reminder"),
        description: safeString(
          item.description,
          "Created automatically by SecondBrain AI from chat."
        ),
        dueDate,
        priority,
        repeat,
      }
    })
    .filter(Boolean)
}

const buildMainChatPrompt = ({
  message,
  aiPersonality,
  personalityInstruction,
  aiMemory,
  previousMessages,
  notesContext,
  filesContext,
  moodsContext,
  remindersContext,
  latestMood,
  averageMoodScore,
}) => {
  return `
You are SecondBrain AI.

Personality Mode:
${aiPersonality}

Tone Rule:
${personalityInstruction}

AI Memory Enabled:
${aiMemory ? "Yes" : "No"}

Core Rules:
- Follow the selected Personality Mode strictly.
- Never say reminders, notes, files, or moods were saved unless backend actually created them.
- If user asks vague reminder request without exact task and date/time, ask for exact details.
- Backend supports creating one or multiple reminders if user intent and reminder details are clear.
- If AI Memory is No, answer only current message.

Previous Chat History:
${
  aiMemory
    ? previousMessages || "No previous chat history."
    : "AI Memory disabled."
}

User Notes:
${
  aiMemory
    ? notesContext || "No saved notes found."
    : "AI Memory disabled."
}

User Uploaded Files:
${
  aiMemory
    ? filesContext || "No uploaded files found."
    : "AI Memory disabled."
}

User Mood Summary:
${
  aiMemory
    ? `Latest Mood: ${
        latestMood
          ? `${latestMood.mood}, score ${latestMood.score}/5, note: ${
              latestMood.note || "No note"
            }, created at ${latestMood.createdAt}`
          : "No latest mood found."
      }
Average Mood Score: ${averageMoodScore}`
    : "AI Memory disabled."
}

User Mood History:
${
  aiMemory
    ? moodsContext || "No mood history found."
    : "AI Memory disabled."
}

User Reminders:
${
  aiMemory
    ? remindersContext || "No reminders found."
    : "AI Memory disabled."
}

Current User Message:
${message}
`
}

const createChat = async (req, res) => {
  try {
    const userId = getUserId(req)

    const chat = await Chat.create({
      user: userId,
      title: "New Chat",
      messages: [],
    })

    res.status(201).json({
      message: "Chat created successfully",
      chat,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getChats = async (req, res) => {
  try {
    const userId = getUserId(req)

    const chats = await Chat.find({
      user: userId,
    })
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 })

    res.status(200).json({
      chats,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getChatById = async (req, res) => {
  try {
    const userId = getUserId(req)

    const chat = await Chat.findOne({
      _id: req.params.id,
      user: userId,
    })

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      })
    }

    res.status(200).json({
      chat,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const sendMessageToChat = async (req, res) => {
  try {
    const { message } = req.body
    const userId = getUserId(req)

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      })
    }

    const chat = await Chat.findOne({
      _id: req.params.id,
      user: userId,
    })

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      })
    }

    const settings = await getUserSettings(userId)

    const aiPersonality =
      VALID_PERSONALITIES.includes(settings?.aiPersonality)
        ? settings.aiPersonality
        : "friendly"

    const aiMemory =
      settings?.aiMemory !== false

    const personalityInstruction =
      getPersonalityInstruction(aiPersonality)

    const memory = await getMemoryContext(
      userId,
      chat,
      aiMemory
    )

    let aiReply = ""
    let aiFailed = false
    let createdReminders = []
    let createdMood = null
    let actionResult = null

    try {
      actionResult = await extractAIAction({
        message,
        previousMessages: memory.previousMessages,
        notesContext: memory.notesContext,
        filesContext: memory.filesContext,
        moodsContext: memory.moodsContext,
        remindersContext: memory.remindersContext,
        latestMood: memory.latestMood,
        averageMoodScore: memory.averageMoodScore,
      })
    } catch (error) {
      aiFailed = true
      console.log("AI ACTION ERROR:", error.message)
      aiReply = getAIUnavailableMessage()
    }

    if (!aiFailed) {
      if (actionResult.action === "view_mood") {
        aiReply = buildMoodListReply(memory.moods)
      } else if (actionResult.action === "update_mood") {
        const moodData =
          validateMoodUpdate(actionResult.moodUpdate)

        if (!moodData) {
          aiReply = buildClarificationReply(
            actionResult.clarificationQuestion ||
              "I could not clearly understand the mood update. Please say something like: Update my mood to Happy."
          )
        } else {
          createdMood = await Mood.create({
            user: userId,
            mood: moodData.mood,
            score: moodData.score,
            note: moodData.note,
          })

          aiReply = buildMoodUpdatedReply(createdMood)
        }
      } else if (actionResult.action === "view_reminders") {
        aiReply = buildReminderListReply(memory.reminders)
      } else if (actionResult.action === "create_reminders") {
        const reminderData =
          validateReminders(actionResult.reminders)

        if (reminderData.length === 0) {
          aiReply = buildClarificationReply(
            actionResult.clarificationQuestion ||
              "I could not clearly understand the reminder details. Please include task and date/time."
          )
        } else {
          const remindersToCreate =
            reminderData.map((item) => ({
              user: userId,
              title: item.title,
              description: item.description,
              dueDate: item.dueDate,
              priority: item.priority,
              repeat: item.repeat,
              source: "AI",
            }))

          createdReminders =
            await Reminder.insertMany(
              remindersToCreate
            )

          aiReply =
            buildRemindersCreatedReply(
              createdReminders
            )
        }
      } else if (actionResult.action === "ask_clarification") {
        aiReply = buildClarificationReply(
          actionResult.clarificationQuestion ||
            "Please provide more details."
        )
      } else {
        const prompt = buildMainChatPrompt({
          message,
          aiPersonality,
          personalityInstruction,
          aiMemory,
          previousMessages: memory.previousMessages,
          notesContext: memory.notesContext,
          filesContext: memory.filesContext,
          moodsContext: memory.moodsContext,
          remindersContext: memory.remindersContext,
          latestMood: memory.latestMood,
          averageMoodScore: memory.averageMoodScore,
        })

        try {
          aiReply = await callGemini(prompt)
        } catch (error) {
          aiFailed = true
          console.log("AI CHAT ERROR:", error.message)
          aiReply = getAIUnavailableMessage()
        }
      }
    }

    chat.messages.push({
      role: "user",
      text: message,
    })

    chat.messages.push({
      role: "ai",
      text: aiReply,
    })

    if (chat.title === "New Chat") {
      chat.title =
        message.length > 30
          ? message.slice(0, 30) + "..."
          : message
    }

    await chat.save()

    res.status(200).json({
      reply: aiReply,
      chat,
      action: actionResult?.action || "none",
      settingsUsed: {
        aiPersonality,
        aiMemory,
      },
      notesUsed: aiMemory ? memory.notes.length : 0,
      filesUsed: aiMemory ? memory.files.length : 0,
      moodsUsed: aiMemory ? memory.moods.length : 0,
      remindersUsed: aiMemory ? memory.reminders.length : 0,
      remindersCreated: createdReminders,
      moodCreated: createdMood,
      aiFailed,
    })
  } catch (error) {
    console.log(
      "CHAT MESSAGE ERROR:",
      error.response?.data || error.message
    )

    res.status(500).json({
      message: "Chat message failed",
      error: error.response?.data || error.message,
    })
  }
}

const deleteChat = async (req, res) => {
  try {
    const userId = getUserId(req)

    const chat = await Chat.findOne({
      _id: req.params.id,
      user: userId,
    })

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      })
    }

    await chat.deleteOne()

    res.status(200).json({
      message: "Chat deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  createChat,
  getChats,
  getChatById,
  sendMessageToChat,
  deleteChat,
}