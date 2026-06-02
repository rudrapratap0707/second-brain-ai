import { useEffect, useMemo, useState } from "react"

import { Link } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  getDashboardStats,
} from "../services/authService"

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
  Target,
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

  const user =
    JSON.parse(localStorage.getItem("user")) || {}

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
    if (totalProductivityItems >= 20) {
      return "Power User"
    }

    if (totalProductivityItems >= 10) {
      return "Growing"
    }

    if (totalProductivityItems >= 3) {
      return "Active"
    }

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

    return new Date(value).toLocaleString()
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4">
              <Brain className="text-cyan-400" size={46} />

              <h1 className="text-5xl font-bold">
                Welcome back, {user?.name || "User"} 👋
              </h1>
            </div>

            <p className="text-slate-400 mt-4 text-lg">
              Your AI productivity dashboard is ready with live analytics.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <RefreshCcw size={20} />
            )}

            Refresh Analytics
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/20 text-red-300 rounded-2xl px-5 py-4 mb-8 flex items-center gap-3">
            <AlertTriangle size={20} />

            <span>{error}</span>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 mb-8 flex items-center gap-3 text-cyan-300">
            <Loader2 className="animate-spin" size={24} />

            <span>Loading dashboard analytics...</span>
          </div>
        )}

        {/* MAIN STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Notes"
            value={stats.totalNotes}
            icon={<FileText size={30} />}
            color="text-cyan-300"
            description="Saved ideas and study notes"
            link="/notes"
          />

          <StatCard
            title="Uploaded Files"
            value={stats.totalFiles}
            icon={<FolderOpen size={30} />}
            color="text-purple-300"
            description="PDFs and documents"
            link="/files"
          />

          <StatCard
            title="AI Chats"
            value={stats.totalChats}
            icon={<MessageCircle size={30} />}
            color="text-green-300"
            description="Persistent AI conversations"
            link="/assistant"
          />

          <StatCard
            title="Workspace"
            value={workspaceStatus}
            icon={<Activity size={30} />}
            color="text-yellow-300"
            description="Overall activity status"
            link="/dashboard"
          />
        </div>

        {/* PRODUCTIVITY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Pending Reminders"
            value={stats.pendingReminders}
            icon={<Bell size={30} />}
            color="text-orange-300"
            description="Tasks waiting for action"
            link="/reminders"
          />

          <StatCard
            title="Completed Tasks"
            value={stats.completedReminders}
            icon={<CheckCircle2 size={30} />}
            color="text-green-300"
            description="Finished reminders"
            link="/reminders"
          />

          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<BarChart3 size={30} />}
            color="text-cyan-300"
            description="Reminder completion progress"
            link="/reminders"
          />

          <StatCard
            title="Average Mood"
            value={`${stats.averageMoodScore}/5`}
            icon={<Smile size={30} />}
            color={getMoodColor(Number(stats.averageMoodScore))}
            description="Emotional trend score"
            link="/mood"
          />
        </div>

        {/* INSIGHTS + MOOD */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-10">
          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-cyan-300" size={30} />

              <h2 className="text-3xl font-bold text-cyan-300">
                AI Productivity Insight
              </h2>
            </div>

            <p className="text-slate-200 text-lg leading-relaxed">
              {getProductivityInsight()}
            </p>

            <div className="mt-8 bg-black/20 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">
                  Productivity Completion
                </span>

                <span className="text-3xl font-bold text-cyan-300">
                  {stats.completionRate}%
                </span>
              </div>

              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all"
                  style={{
                    width: `${stats.completionRate || 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <Smile className="text-purple-300" size={30} />

              <h2 className="text-3xl font-bold">
                Latest Mood
              </h2>
            </div>

            {stats.latestMood ? (
              <div>
                <div className="text-7xl mb-5">
                  {getMoodEmoji(moodLabel)}
                </div>

                <h3 className="text-4xl font-bold">
                  {moodLabel}
                </h3>

                <p
                  className={`text-2xl font-bold mt-3 ${getMoodColor(
                    Number(moodScore)
                  )}`}
                >
                  Score: {moodScore}/5
                </p>

                {stats.latestMood.note && (
                  <p className="text-slate-300 mt-5 whitespace-pre-line">
                    {stats.latestMood.note}
                  </p>
                )}

                <p className="text-slate-500 text-sm mt-5 flex items-center gap-2">
                  <Clock3 size={16} />
                  {formatDate(stats.latestMood.createdAt)}
                </p>
              </div>
            ) : (
              <div className="border border-dashed border-white/20 rounded-3xl p-10 text-center text-slate-400">
                <Smile size={60} className="mx-auto text-slate-500 mb-5" />

                <h3 className="text-2xl font-bold text-white mb-3">
                  No Mood Logged
                </h3>

                <p>
                  Track your mood to unlock emotional insights.
                </p>

                <Link
                  to="/mood"
                  className="inline-flex mt-6 px-5 py-3 rounded-2xl bg-cyan-500 text-black font-bold"
                >
                  Add Mood
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <QuickAction
            title="Open Smart Notes"
            description="Create notes, save ideas, and summarize them with AI."
            icon={<FileText size={30} />}
            link="/notes"
            color="cyan"
          />

          <QuickAction
            title="Open AI Assistant"
            description="Continue old chats or start a memory-based conversation."
            icon={<MessageCircle size={30} />}
            link="/assistant"
            color="purple"
          />

          <QuickAction
            title="Upload File"
            description="Upload PDFs and documents for AI memory."
            icon={<FolderOpen size={30} />}
            link="/files"
            color="green"
          />

          <QuickAction
            title="Add Reminder"
            description="Plan tasks, deadlines, and priority work."
            icon={<Bell size={30} />}
            link="/reminders"
            color="orange"
          />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ActivityCard
            title="Recent Notes"
            icon={<FileText className="text-cyan-400" size={28} />}
            emptyText="No recent notes found."
          >
            {recentActivity.recentNotes?.map((note) => (
              <div
                key={note._id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5"
              >
                <h3 className="text-xl font-bold line-clamp-1">
                  {note.title}
                </h3>

                <p className="text-slate-400 mt-2 line-clamp-2">
                  {note.content}
                </p>

                <p className="text-slate-500 text-sm mt-3">
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
                className="bg-white/10 border border-white/10 rounded-3xl p-5"
              >
                <h3 className="text-xl font-bold break-all line-clamp-1">
                  {file.originalName}
                </h3>

                <p className="text-slate-400 mt-2">
                  {file.mimeType}
                </p>

                <p className="text-slate-500 text-sm mt-3">
                  {formatDate(file.createdAt)}
                </p>
              </div>
            ))}
          </ActivityCard>
        </div>

        {/* AI CONTROL CENTER */}
        <div className="mt-10 bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-yellow-300" size={30} />

            <h2 className="text-3xl font-bold">
              SecondBrain Control Center
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
  description,
  link,
}) {
  return (
    <Link
      to={link}
      className="bg-white/10 border border-white/10 rounded-[32px] p-6 backdrop-blur-xl hover:bg-white/15 transition group"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-slate-400 font-medium">
          {title}
        </h3>

        <div className={`${color} group-hover:scale-110 transition`}>
          {icon}
        </div>
      </div>

      <p className="text-5xl font-bold mt-5">
        {value}
      </p>

      <p className="text-slate-500 mt-3">
        {description}
      </p>
    </Link>
  )
}

function QuickAction({
  title,
  description,
  icon,
  link,
  color,
}) {
  const colorClasses = {
    cyan: "bg-cyan-500/10 border-cyan-400/20 text-cyan-300",
    purple: "bg-purple-500/10 border-purple-400/20 text-purple-300",
    green: "bg-green-500/10 border-green-400/20 text-green-300",
    orange: "bg-orange-500/10 border-orange-400/20 text-orange-300",
  }

  return (
    <Link
      to={link}
      className={`rounded-[32px] p-6 border hover:scale-[1.02] transition ${colorClasses[color]}`}
    >
      <div className="mb-5">
        {icon}
      </div>

      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <p className="text-slate-300 mt-3">
        {description}
      </p>

      <div className="flex items-center gap-2 mt-6 font-semibold">
        <span>Open</span>
        <ArrowRight size={18} />
      </div>
    </Link>
  )
}

function ActivityCard({
  title,
  icon,
  emptyText,
  children,
}) {
  const hasChildren =
    Array.isArray(children)
      ? children.length > 0
      : Boolean(children)

  return (
    <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        {icon}

        <h2 className="text-3xl font-bold">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {hasChildren ? (
          children
        ) : (
          <div className="border border-dashed border-white/20 rounded-3xl p-10 text-center text-slate-400">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  )
}

function ControlPoint({
  icon,
  title,
  text,
}) {
  return (
    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
      <div className="text-cyan-400 mb-4">
        {icon}
      </div>

      <h3 className="text-2xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-3">
        {text}
      </p>
    </div>
  )
}

export default Dashboard