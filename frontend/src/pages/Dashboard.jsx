import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"

import { getDashboardStats } from "../services/authService"

import {
  Brain,
  FileText,
  MessageCircle,
  Bell,
  CheckCircle2,
  Clock3,
  Smile,
  BarChart3,
  FolderOpen,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Activity,
  RefreshCcw,
  Zap,
  CalendarDays,
  TrendingUp,
} from "lucide-react"

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalNotes: 0,
      totalFiles: 0,
      totalChats: 0,
      pendingReminders: 0,
      completedReminders: 0,
      completionRate: 0,
      latestMood: null,
      averageMoodScore: "0",
    },
    recentActivity: {
      recentNotes: [],
      recentFiles: [],
    },
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const user = JSON.parse(localStorage.getItem("user")) || {}

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getDashboardStats()

      setDashboardData({
        stats: data.stats || {
          totalNotes: 0,
          totalFiles: 0,
          totalChats: 0,
          pendingReminders: 0,
          completedReminders: 0,
          completionRate: 0,
          latestMood: null,
          averageMoodScore: "0",
        },
        recentActivity: data.recentActivity || {
          recentNotes: [],
          recentFiles: [],
        },
      })
    } catch (error) {
      console.log(error)
      setError("Failed to load dashboard analytics.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const stats = dashboardData.stats
  const recentActivity = dashboardData.recentActivity

  const totalProductivityItems = useMemo(() => {
    return (
      Number(stats.totalNotes || 0) +
      Number(stats.totalFiles || 0) +
      Number(stats.totalChats || 0) +
      Number(stats.pendingReminders || 0) +
      Number(stats.completedReminders || 0)
    )
  }, [stats])

  const workspaceStatus = useMemo(() => {
    if (totalProductivityItems >= 20) return "Power User"
    if (totalProductivityItems >= 10) return "Growing"
    if (totalProductivityItems >= 3) return "Active"
    return "Getting Started"
  }, [totalProductivityItems])

  const moodLabel = stats.latestMood?.mood || "No mood"
  const moodScore = stats.latestMood?.score || 0

  const getMoodEmoji = (mood) => {
    const moods = {
      Happy: "😊",
      Focused: "🎯",
      Neutral: "😐",
      Stressed: "🔥",
      Sad: "😔",
      Tired: "😴",
    }

    return moods[mood] || "🙂"
  }

  const getMoodColor = (score) => {
    if (score >= 5) return "text-green-300"
    if (score >= 4) return "text-cyan-300"
    if (score >= 3) return "text-yellow-300"
    if (score >= 2) return "text-orange-300"
    return "text-red-300"
  }

  const getProductivityInsight = () => {
    if (stats.pendingReminders > 0) {
      return `You have ${stats.pendingReminders} pending reminder(s). Complete them first to improve productivity.`
    }

    if (Number(stats.averageMoodScore) >= 4) {
      return "Your mood trend looks strong. This is a good time for focused study or creative work."
    }

    if (stats.totalNotes === 0) {
      return "Start by creating your first smart note. Your SecondBrain grows with every saved idea."
    }

    if (stats.totalFiles === 0) {
      return "Upload your first PDF or study material to make your AI assistant more powerful."
    }

    if (stats.totalChats === 0) {
      return "Start a conversation with your AI assistant to build your personal memory."
    }

    return "Your workspace is active. Keep adding notes, reminders, files, and mood entries consistently."
  }

  const formatDate = (value) => {
    if (!value) return "No date"

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return "Invalid date"
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-7xl space-y-5 md:space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl md:h-72 md:w-72" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl md:h-72 md:w-72" />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 md:h-16 md:w-16">
                <Brain size={34} />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
                  Welcome back, {user?.name || "User"} 👋
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 md:mt-4 md:text-lg">
                  Your AI productivity dashboard is ready with live analytics.
                </p>
              </div>
            </div>

            <button
              onClick={fetchDashboard}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-fit md:px-6 md:py-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <RefreshCcw size={20} />
              )}
              Refresh Analytics
            </button>
          </div>
        </section>

        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-4 text-red-300 sm:flex-row sm:items-center md:px-5">
            <AlertTriangle size={20} />
            <span className="text-sm md:text-base">{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 text-cyan-300 md:p-6">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm md:text-base">
              Loading dashboard analytics...
            </span>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Notes"
            value={stats.totalNotes}
            icon={<FileText size={28} />}
            color="text-cyan-300"
            description="Saved ideas and study notes"
            link="/notes"
          />

          <StatCard
            title="Uploaded Files"
            value={stats.totalFiles}
            icon={<FolderOpen size={28} />}
            color="text-purple-300"
            description="PDFs and documents"
            link="/files"
          />

          <StatCard
            title="AI Chats"
            value={stats.totalChats}
            icon={<MessageCircle size={28} />}
            color="text-green-300"
            description="Persistent AI conversations"
            link="/assistant"
          />

          <StatCard
            title="Workspace"
            value={workspaceStatus}
            icon={<Activity size={28} />}
            color="text-yellow-300"
            description="Overall activity status"
            link="/dashboard"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Pending Reminders"
            value={stats.pendingReminders}
            icon={<Bell size={28} />}
            color="text-orange-300"
            description="Tasks waiting for action"
            link="/reminders"
          />

          <StatCard
            title="Completed Tasks"
            value={stats.completedReminders}
            icon={<CheckCircle2 size={28} />}
            color="text-green-300"
            description="Finished reminders"
            link="/reminders"
          />

          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<BarChart3 size={28} />}
            color="text-cyan-300"
            description="Reminder completion progress"
            link="/reminders"
          />

          <StatCard
            title="Average Mood"
            value={`${stats.averageMoodScore}/5`}
            icon={<Smile size={28} />}
            color={getMoodColor(Number(stats.averageMoodScore))}
            description="Emotional trend score"
            link="/mood"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4 md:rounded-[32px] md:p-8">
            <div className="mb-5 flex items-center gap-3 md:mb-6">
              <Sparkles className="text-cyan-300" size={28} />

              <h2 className="text-xl font-bold text-cyan-300 md:text-3xl">
                AI Productivity Insight
              </h2>
            </div>

            <p className="text-sm leading-7 text-slate-200 md:text-lg">
              {getProductivityInsight()}
            </p>

            <div className="mt-6 rounded-3xl border border-white/5 bg-black/20 p-4 md:mt-8 md:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-slate-400 md:text-base">
                  Productivity Completion
                </span>

                <span className="text-2xl font-bold text-cyan-300 md:text-3xl">
                  {stats.completionRate}%
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 md:h-4">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{
                    width: `${stats.completionRate || 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
            <div className="mb-5 flex items-center gap-3 md:mb-6">
              <Smile className="text-purple-300" size={28} />

              <h2 className="text-xl font-bold text-white md:text-3xl">
                Latest Mood
              </h2>
            </div>

            {stats.latestMood ? (
              <div>
                <div className="mb-4 text-6xl md:mb-5 md:text-7xl">
                  {getMoodEmoji(moodLabel)}
                </div>

                <h3 className="text-3xl font-bold text-white md:text-4xl">
                  {moodLabel}
                </h3>

                <p
                  className={`mt-3 text-xl font-bold md:text-2xl ${getMoodColor(
                    Number(moodScore)
                  )}`}
                >
                  Score: {moodScore}/5
                </p>

                {stats.latestMood.note && (
                  <p className="mt-5 whitespace-pre-line text-sm text-slate-300 md:text-base">
                    {stats.latestMood.note}
                  </p>
                )}

                <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 size={16} />
                  {formatDate(stats.latestMood.createdAt)}
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/20 p-6 text-center text-slate-400 md:p-10">
                <Smile size={54} className="mx-auto mb-5 text-slate-500" />

                <h3 className="mb-3 text-xl font-bold text-white md:text-2xl">
                  No Mood Logged
                </h3>

                <p className="text-sm md:text-base">
                  Track your mood to unlock emotional insights.
                </p>

                <Link
                  to="/mood"
                  className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black md:text-base"
                >
                  Add Mood
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            title="Open Smart Notes"
            description="Create notes, save ideas, and summarize them with AI."
            icon={<FileText size={28} />}
            link="/notes"
            color="cyan"
          />

          <QuickAction
            title="Open AI Assistant"
            description="Continue old chats or start a memory-based conversation."
            icon={<MessageCircle size={28} />}
            link="/assistant"
            color="purple"
          />

          <QuickAction
            title="Upload File"
            description="Upload PDFs and documents for AI memory."
            icon={<FolderOpen size={28} />}
            link="/files"
            color="green"
          />

          <QuickAction
            title="Add Reminder"
            description="Plan tasks, deadlines, and priority work."
            icon={<Bell size={28} />}
            link="/reminders"
            color="orange"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ActivityCard
            title="Recent Notes"
            icon={<FileText className="text-cyan-400" size={28} />}
            emptyText="No recent notes found."
          >
            {recentActivity.recentNotes?.map((note) => (
              <div
                key={note._id}
                className="rounded-3xl border border-white/10 bg-white/10 p-4 md:p-5"
              >
                <h3 className="line-clamp-1 text-lg font-bold text-white md:text-xl">
                  {note.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-slate-400 md:text-base">
                  {note.content}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            ))}
          </ActivityCard>

          <ActivityCard
            title="Recent Files"
            icon={<FolderOpen className="text-purple-400" size={28} />}
            emptyText="No recent files found."
          >
            {recentActivity.recentFiles?.map((file) => (
              <div
                key={file._id}
                className="rounded-3xl border border-white/10 bg-white/10 p-4 md:p-5"
              >
                <h3 className="line-clamp-1 break-all text-lg font-bold text-white md:text-xl">
                  {file.originalName}
                </h3>

                <p className="mt-2 text-sm text-slate-400 md:text-base">
                  {file.mimeType}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  {formatDate(file.createdAt)}
                </p>
              </div>
            ))}
          </ActivityCard>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Zap className="text-yellow-300" size={28} />

            <h2 className="text-xl font-bold text-white md:text-3xl">
              SecondBrain Control Center
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ControlPoint
              icon={<Brain size={28} />}
              title="AI Memory"
              text="Your AI assistant can use notes, files, chats, moods, and reminders."
            />

            <ControlPoint
              icon={<TrendingUp size={28} />}
              title="Productivity Tracking"
              text="Your reminders and completion rate help calculate productivity flow."
            />

            <ControlPoint
              icon={<CalendarDays size={28} />}
              title="Daily Planning"
              text="Use reminders and mood tracking to plan better study sessions."
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon, color, description, link }) {
  return (
    <Link
      to={link}
      className="group rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl transition hover:bg-white/15 md:rounded-[32px] md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-medium text-slate-400 md:text-base">
          {title}
        </h3>

        <div className={`${color} transition group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-white md:mt-5 md:text-5xl">
        {value}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  )
}

function QuickAction({ title, description, icon, link, color }) {
  const colorClasses = {
    cyan: "bg-cyan-500/10 border-cyan-400/20 text-cyan-300",
    purple: "bg-purple-500/10 border-purple-400/20 text-purple-300",
    green: "bg-green-500/10 border-green-400/20 text-green-300",
    orange: "bg-orange-500/10 border-orange-400/20 text-orange-300",
  }

  return (
    <Link
      to={link}
      className={`rounded-3xl border p-4 transition hover:scale-[1.02] md:rounded-[32px] md:p-6 ${colorClasses[color]}`}
    >
      <div className="mb-4 md:mb-5">{icon}</div>

      <h2 className="text-xl font-bold md:text-2xl">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold md:mt-6">
        <span>Open</span>
        <ArrowRight size={18} />
      </div>
    </Link>
  )
}

function ActivityCard({ title, icon, emptyText, children }) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children)

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
      <div className="mb-5 flex items-center gap-3 md:mb-6">
        {icon}

        <h2 className="text-xl font-bold text-white md:text-3xl">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {hasChildren ? (
          children
        ) : (
          <div className="rounded-3xl border border-dashed border-white/20 p-6 text-center text-sm text-slate-400 md:p-10 md:text-base">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  )
}

function ControlPoint({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-black/20 p-4 md:p-6">
      <div className="mb-4 text-cyan-400">{icon}</div>

      <h3 className="text-xl font-bold text-white md:text-2xl">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  )
}

export default Dashboard