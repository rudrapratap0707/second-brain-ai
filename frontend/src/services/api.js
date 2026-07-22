import axios from "axios"

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:5000/api",
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default API


// STUDENT LIFE DASHBOARD
export const getStudentLifeDashboard = async () => {
  const response = await API.get(
    "/student-life/dashboard"
  )

  return response.data
}
// GET STUDENT PROFILE
export const getStudentProfile = async () => {
  const response = await API.get(
    "/student-life/profile"
  )

  return response.data
}

// UPDATE STUDENT PROFILE
export const updateStudentProfile = async (
  profileData
) => {
  const response = await API.put(
    "/student-life/profile",
    profileData
  )

  return response.data
}

// CREATE TARGET
export const createTarget = async (targetData) => {
  const response = await API.post(
    "/student-life/targets",
    targetData
  )

  return response.data
}

// GET TARGETS
export const getTargets = async () => {
  const response = await API.get(
    "/student-life/targets"
  )

  return response.data
}

// UPDATE TARGET
export const updateTarget = async (id, targetData) => {
  const response = await API.put(
    `/student-life/targets/${id}`,
    targetData
  )

  return response.data
}

// DELETE TARGET
export const deleteTarget = async (id) => {
  const response = await API.delete(
    `/student-life/targets/${id}`
  )

  return response.data
}

// CREATE CHECKPOINT
export const createCheckpoint = async (
  checkpointData
) => {
  const response = await API.post(
    "/student-life/checkpoints",
    checkpointData
  )

  return response.data
}

// GET CHECKPOINTS
export const getCheckpoints = async () => {
  const response = await API.get(
    "/student-life/checkpoints"
  )

  return response.data
}

// UPDATE CHECKPOINT
export const updateCheckpoint = async (
  id,
  checkpointData
) => {
  const response = await API.put(
    `/student-life/checkpoints/${id}`,
    checkpointData
  )

  return response.data
}

// DELETE CHECKPOINT
export const deleteCheckpoint = async (id) => {
  const response = await API.delete(
    `/student-life/checkpoints/${id}`
  )

  return response.data
}

// CREATE EXAM
export const createExam = async (examData) => {
  const response = await API.post(
    "/student-life/exams",
    examData
  )

  return response.data
}

// GET EXAMS
export const getExams = async () => {
  const response = await API.get(
    "/student-life/exams"
  )

  return response.data
}

// UPDATE EXAM
export const updateExam = async (id, examData) => {
  const response = await API.put(
    `/student-life/exams/${id}`,
    examData
  )

  return response.data
}

// DELETE EXAM
export const deleteExam = async (id) => {
  const response = await API.delete(
    `/student-life/exams/${id}`
  )

  return response.data
}


// CREATE TIMETABLE BLOCK
export const createTimetableBlock = async (
  blockData
) => {
  const response = await API.post(
    "/student-life/timetable",
    blockData
  )

  return response.data
}

// GET TIMETABLE BLOCKS
export const getTimetableBlocks = async () => {
  const response = await API.get(
    "/student-life/timetable"
  )

  return response.data
}

// UPDATE TIMETABLE BLOCK
export const updateTimetableBlock = async (
  id,
  blockData
) => {
  const response = await API.put(
    `/student-life/timetable/${id}`,
    blockData
  )

  return response.data
}

// DELETE TIMETABLE BLOCK
export const deleteTimetableBlock = async (id) => {
  const response = await API.delete(
    `/student-life/timetable/${id}`
  )

  return response.data
}

// CREATE SKILL
export const createSkill = async (skillData) => {
  const response = await API.post(
    "/student-life/skills",
    skillData
  )

  return response.data
}

// GET SKILLS
export const getSkills = async () => {
  const response = await API.get(
    "/student-life/skills"
  )

  return response.data
}

// UPDATE SKILL
export const updateSkill = async (id, skillData) => {
  const response = await API.put(
    `/student-life/skills/${id}`,
    skillData
  )

  return response.data
}

// DELETE SKILL
export const deleteSkill = async (id) => {
  const response = await API.delete(
    `/student-life/skills/${id}`
  )

  return response.data
}

// CREATE LEARNING LOG
export const createLearningLog = async (logData) => {
  const response = await API.post(
    "/student-life/learning-logs",
    logData
  )

  return response.data
}

// GET LEARNING LOGS
export const getLearningLogs = async () => {
  const response = await API.get(
    "/student-life/learning-logs"
  )

  return response.data
}

// UPDATE LEARNING LOG
export const updateLearningLog = async (id, logData) => {
  const response = await API.put(
    `/student-life/learning-logs/${id}`,
    logData
  )

  return response.data
}

// DELETE LEARNING LOG
export const deleteLearningLog = async (id) => {
  const response = await API.delete(
    `/student-life/learning-logs/${id}`
  )

  return response.data
}


// GET AI STUDY COACH ANALYSIS
export const getAIStudyCoach = async () => {
  const response = await API.get(
    "/student-life/ai-study-coach"
  )

  return response.data
}


// CREATE STUDENT DOCUMENT
export const createStudentDocument = async (documentData) => {
  const response = await API.post(
    "/student-life/documents",
    documentData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data
}
// GET STUDENT DOCUMENTS
export const getStudentDocuments = async () => {
  const response = await API.get(
    "/student-life/documents"
  )

  return response.data
}

// UPDATE STUDENT DOCUMENT
export const updateStudentDocument = async (
  id,
  documentData
) => {
  const response = await API.put(
    `/student-life/documents/${id}`,
    documentData
  )

  return response.data
}

// DELETE STUDENT DOCUMENT
export const deleteStudentDocument = async (id) => {
  const response = await API.delete(
    `/student-life/documents/${id}`
  )

  return response.data
}

// CREATE ACADEMIC NOTE
export const createAcademicNote = async (noteData) => {
  const response = await API.post(
    "/student-life/academic-notes",
    noteData
  )

  return response.data
}

// GET ACADEMIC NOTES
export const getAcademicNotes = async () => {
  const response = await API.get(
    "/student-life/academic-notes"
  )

  console.log(response.data)

  return response.data
}

// UPDATE ACADEMIC NOTE
export const updateAcademicNote = async (id, noteData) => {
  const response = await API.put(
    `/student-life/academic-notes/${id}`,
    noteData
  )

  return response.data
}


// GET DAILY STUDY MAP
export const getDailyStudyMap = async () => {
  const response = await API.get(
    "/student-life/daily-study-map"
  )

  return response.data
}

// GET DAILY SUCCESS RATE
export const getDailySuccessRate = async () => {
  const response = await API.get(
    "/student-life/daily-success-rate"
  )

  return response.data
}

// DELETE ACADEMIC NOTE
export const deleteAcademicNote = async (id) => {
  const response = await API.delete(
    `/student-life/academic-notes/${id}`
  )

  return response.data
}

// GET STUDY IMPROVER
export const getStudyImprover = async () => {
  const response = await API.get(
    "/student-life/study-improver"
  )

  return response.data
}