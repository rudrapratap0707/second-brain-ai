const axios = require("axios")

const AcademicNote = require("../models/AcademicNotes")
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
  console.log("🔥 NEW AI CONTROLLER RUNNING");
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

    // FETCH USER ACADEMIC NOTES (Student Life OS)
    try {
      const notes = await AcademicNote.find({
        user: userId,
      })
        .sort({ updatedAt: -1 })
        .limit(50)

      notesCount = notes.length

      if (notes.length > 0) {
        notesContext = notes
          .map(
            (note, index) => `
==============================
ACADEMIC NOTE ${index + 1}

Title:
${note.title}

Subject:
${note.subject}

Chapter:
${note.chapter || "N/A"}

Type:
${note.noteType}

Priority:
${note.priority}

Revision Status:
${note.revisionStatus}

Important:
${note.isImportant ? "Yes" : "No"}

Tags:
${note.tags?.length ? note.tags.join(", ") : "None"}

Content:
${note.content}

AI Summary:
${note.aiSummary || "No summary available"}

Created:
${note.createdAt}

==============================
`
          )
          .join("\n\n")
      } else {
        notesContext = "No Academic Notes found."
      }
    } catch (noteError) {
      console.log(
        "ACADEMIC NOTES FETCH ERROR:",
        noteError.message
      )

      notesContext = "Could not fetch Academic Notes."
    }

    // FETCH USER UPLOADED FILES
    try {
      const files = await File.find({
        user: userId,
      })
        .sort({ createdAt: -1 })
        .limit(10)

      filesCount = files.length

      if (files.length > 0) {
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
      } else {
        filesContext = "No uploaded files found."
      }
    } catch (fileError) {
      console.log(
        "FILES FETCH ERROR:",
        fileError.message
      )

      filesContext = "Could not fetch uploaded files."
    }

    const prompt = `
You are SecondBrain AI, an intelligent study and productivity assistant.

You have access to:

1. Academic Notes (Student Life OS)
2. Uploaded Files
3. User Question

----------------------------------------------------
IMPORTANT RULES
----------------------------------------------------

Academic Notes are the PRIMARY source.

If the answer exists inside Academic Notes,
answer ONLY using those notes.

Begin the answer with:

"📚 Based on your Academic Notes..."

If the answer exists inside uploaded files,

Begin with:

"📄 Based on your uploaded files..."

If information exists in both,
combine both.

If nothing exists,

Say:

"I couldn't find this information inside your Academic Notes or uploaded files."

Then provide general knowledge.

Never pretend information exists.

Never hallucinate.

----------------------------------------------------
ACADEMIC NOTES
----------------------------------------------------

${notesContext}

----------------------------------------------------
UPLOADED FILES
----------------------------------------------------

${filesContext}

----------------------------------------------------
USER QUESTION
----------------------------------------------------

${message}

----------------------------------------------------
RESPONSE STYLE
----------------------------------------------------

• Answer in Hinglish unless the user asks another language.
• Explain simply.
• Use bullet points.
• Use examples whenever possible.
• If the user asks to explain notes,
explain every point one by one.
• If the user asks for revision,
create revision notes.
• If the user asks for interview preparation,
convert notes into interview questions.
• If the user asks for MCQs,
generate MCQs from Academic Notes.
• If the user asks for flashcards,
generate flashcards from Academic Notes.

Remember:

Academic Notes > Uploaded Files > General Knowledge.
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