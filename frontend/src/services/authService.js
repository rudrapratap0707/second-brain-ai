import API from "./api"

export const signupUser = async (userData) => {
  const response = await API.post("/auth/signup", userData)
  return response.data
}

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData)
  return response.data
}

export const forgotPassword = async (email) => {
  const response = await API.post(
    "/auth/forgot-password",
    {
      email,
    }
  )

  return response.data
}

export const resetPassword = async (
  token,
  password
) => {
  const response = await API.put(
    `/auth/reset-password/${token}`,
    {
      password,
    }
  )

  return response.data
}

export const getProfile = async () => {
  const response = await API.get("/auth/profile")
  return response.data
}

export const createNote = async (noteData) => {
  const response = await API.post("/notes", noteData)

  return response.data
}

export const getNotes = async () => {
  const response = await API.get("/notes")

  return response.data
}

export const deleteNote = async (id) => {
  const response = await API.delete(`/notes/${id}`)

  return response.data
}


export const summarizeNote = async (content) => {
  const response = await API.post(
    "/ai/summarize",
    {
      content,
    }
  )

  return response.data
}

export const chatWithAI = async (message) => {
  const response = await API.post("/ai/chat", {
    message,
  })

  return response.data
}

// CREATE NEW CHAT
export const createChat = async () => {
  const response = await API.post("/chats")

  return response.data
}

// GET ALL CHATS
export const getChats = async () => {
  const response = await API.get("/chats")

  return response.data
}

// GET SINGLE CHAT
export const getChatById = async (id) => {
  const response = await API.get(`/chats/${id}`)

  return response.data
}

// DELETE CHAT
export const deleteChat = async (id) => {
  const response = await API.delete(`/chats/${id}`)

  return response.data
}

// SEND MESSAGE TO CHAT
export const sendMessageToChat = async (
  chatId,
  message
) => {
  const response = await API.post(
    `/chats/${chatId}/message`,
    {
      message,
    }
  )

  return response.data
}


// GLOBAL SEARCH
export const globalSearch = async (query) => {
  const response = await API.get(`/search?q=${query}`)

  return response.data
}


// UPLOAD FILE
export const uploadFile = async (formData) => {
  const response = await API.post(
    "/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data
}

// GET FILES
export const getFiles = async () => {
  const response = await API.get("/files")

  return response.data
}

// DELETE FILE
export const deleteFile = async (id) => {
  const response = await API.delete(`/files/${id}`)

  return response.data
}



// CREATE MOOD
export const createMood = async (moodData) => {
  const response = await API.post("/moods", moodData)

  return response.data
}

// GET MOODS
export const getMoods = async () => {
  const response = await API.get("/moods")

  return response.data
}

// DELETE MOOD
export const deleteMood = async (id) => {
  const response = await API.delete(`/moods/${id}`)

  return response.data
}


// CREATE REMINDER
export const createReminder = async (
  reminderData
) => {
  const response = await API.post(
    "/reminders",
    reminderData
  )

  return response.data
}

// GET REMINDERS
export const getReminders = async () => {
  const response = await API.get(
    "/reminders"
  )

  return response.data
}

// TOGGLE REMINDER
export const toggleReminder = async (id) => {
  const response = await API.patch(
    `/reminders/${id}/toggle`
  )

  return response.data
}

// DELETE REMINDER
export const deleteReminder = async (id) => {
  const response = await API.delete(
    `/reminders/${id}`
  )

  return response.data
}

// GET SETTINGS
export const getSettings = async () => {
  const response = await API.get("/settings")

  return response.data
}

// UPDATE SETTINGS
export const updateSettings = async (settingsData) => {
  const response = await API.put("/settings", settingsData)

  return response.data
}

// GET DASHBOARD STATS
export const getDashboardStats = async () => {
  const response = await API.get("/dashboard")

  return response.data
}