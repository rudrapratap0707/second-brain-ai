const axios = require("axios")

const Note = require("../models/Note")
const File = require("../models/File")

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

// MEMORY-BASED AI CHAT
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      })
    }

    const userId = req.user?._id || req.user?.id

    let notesContext = ""
    let notesCount = 0

    let filesContext = ""
    let filesCount = 0

    // FETCH USER NOTES
    try {
      const notes = await Note.find({
        user: userId,
      })
        .sort({ createdAt: -1 })
        .limit(20)

      notesCount = notes.length

      notesContext = notes
        .map((note, index) => {
          return `
Note ${index + 1}
Title: ${note.title}
Content: ${note.content}
Created At: ${note.createdAt}
`
        })
        .join("\n")
    } catch (noteError) {
      console.log(
        "NOTES FETCH ERROR:",
        noteError.message
      )

      notesContext =
        "Could not fetch saved notes."
    }

    // FETCH USER UPLOADED FILES
    try {
      const files = await File.find({
        user: userId,
      })
        .sort({ createdAt: -1 })
        .limit(10)

      filesCount = files.length

      filesContext = files
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
    } catch (fileError) {
      console.log(
        "FILES FETCH ERROR:",
        fileError.message
      )

      filesContext =
        "Could not fetch uploaded files."
    }

    const prompt = `
You are SecondBrain AI, a personal memory-based productivity and study assistant.

You can answer using:
1. The user's saved notes
2. The user's uploaded files and extracted PDF/document text
3. The user's current question

Important rules:
- First check uploaded files and saved notes.
- If the answer is found in uploaded files, start with: "Based on your uploaded file..."
- If the answer is found in saved notes, start with: "Based on your notes..."
- If the user asks about a PDF, file, syllabus, document, uploaded material, course, semester, or study material, check uploaded files first.
- If the answer is not found in notes or files, clearly say: "I could not find this in your saved notes or uploaded files."
- After saying that, you may still give general helpful advice.
- Keep answers simple, useful, and student-friendly.
- Do not pretend that something exists in notes or files if it does not.

User's saved notes:
${notesContext || "No saved notes found."}

User's uploaded files:
${filesContext || "No uploaded files found."}

User question:
${message}
`

    const reply = await callGemini(prompt)

    res.status(200).json({
      reply,
      notesUsed: notesCount,
      filesUsed: filesCount,
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