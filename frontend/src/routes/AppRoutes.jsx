import { BrowserRouter, Routes, Route } from "react-router-dom"

import Landing from "../pages/Landing"
import Login from "../pages/Login"
import Signup from "../pages/Signup"

import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"

import Dashboard from "../pages/Dashboard"
import Notes from "../pages/Notes"
import Reminders from "../pages/Reminders"
import Mood from "../pages/Mood"
import Files from "../pages/Files"
import Assistant from "../pages/Assistant"
import Settings from "../pages/Settings"
import Profile from "../pages/Profile"
import NotFound from "../pages/NotFound"

import StudentLife from "../pages/StudentLife"
import StudentProfile from "../pages/StudentProfile"

import StudyPlanner from "../pages/StudyPlanner"
import ExamSchedule from "../pages/ExamSchedule"
import DailyTimetable from "../pages/DailyTimetable"
import TargetsGoals from "../pages/TargetsGoals"
import Checkpoints from "../pages/Checkpoints"
import SkillsMonitor from "../pages/SkillsMonitor"
import LearningMonitor from "../pages/LearningMonitor"
import AIStudyCoach from "../pages/AIStudyCoach"

import ProtectedRoute from "../components/ProtectedRoute"

import NotesCollection from "../pages/NotesCollection"

import DigitalDocumentVault from "../pages/DigitalDocumentVault"

import DailyStudyMap from "../pages/DailyStudyMap"

import DailySuccessRate from "../pages/DailySuccessRate"

import StudyImprover from "../pages/StudyImprover"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mood"
          element={
            <ProtectedRoute>
              <Mood />
            </ProtectedRoute>
          }
        />

        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <Files />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <Assistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life"
          element={
            <ProtectedRoute>
              <StudentLife />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/study-planner"
          element={
            <ProtectedRoute>
              <StudyPlanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/exams"
          element={
            <ProtectedRoute>
              <ExamSchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/timetable"
          element={
            <ProtectedRoute>
              <DailyTimetable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/targets"
          element={
            <ProtectedRoute>
              <TargetsGoals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/checkpoints"
          element={
            <ProtectedRoute>
              <Checkpoints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/skills"
          element={
            <ProtectedRoute>
              <SkillsMonitor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/learning"
          element={
            <ProtectedRoute>
              <LearningMonitor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/document-vault"
          element={
            <ProtectedRoute>
              <DigitalDocumentVault />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/coach"
          element={
            <ProtectedRoute>
              <AIStudyCoach />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/daily-study-map"
          element={
            <ProtectedRoute>
              <DailyStudyMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/daily-success-rate"
          element={
            <ProtectedRoute>
              <DailySuccessRate />
            </ProtectedRoute>
          }
        />

        

        <Route
          path="/student-life/study-improver"
          element={
            <ProtectedRoute>
              <StudyImprover />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-life/notes-collection"
          element={
            <ProtectedRoute>
              <NotesCollection />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes