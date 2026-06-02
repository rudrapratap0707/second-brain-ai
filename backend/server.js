const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const noteRoutes = require("./routes/noteRoutes")
const aiRoutes = require("./routes/aiRoutes")
const chatRoutes = require("./routes/chatRoutes")
const fileRoutes = require("./routes/fileRoutes")
const moodRoutes = require("./routes/moodRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const reminderRoutes = require("./routes/reminderRoutes")
const settingsRoutes = require("./routes/settingsRoutes")
const studentLifeRoutes = require("./routes/studentLifeRoutes")
const searchRoutes = require("./routes/searchRoutes")

dotenv.config()

connectDB()

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "https://second-brain-ai-beryl.vercel.app",
  process.env.CLIENT_URL,
]

// MIDDLEWARE
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.options("*", cors())

app.use(express.json())

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/notes", noteRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/moods", moodRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/reminders", reminderRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/student-life", studentLifeRoutes)
app.use("/api/search", searchRoutes)

// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
)

// TEST ROUTE
app.get("/", (req, res) => {
  res.send(
    "Second Brain AI Backend is running with MongoDB, Gemini AI, Chat History and Student Life OS"
  )
})

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})