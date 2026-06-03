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
  Smile,
  BarChart3,
  FolderOpen,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Activity,
  RefreshCcw,
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
    if (score >= 5) return "text-green-400"
    if (score >= 4) return "text-cyan-400"
    if (score >= 3) return "text-yellow-400"
    if (score >= 2) return "text-orange-400"
    return "text-red-400"
  }

  const getProductivityInsight = () => {
    if (stats.pendingReminders > 0) {
      return `You have ${stats.pendingReminders} pending tasks. Finish them up to bump up your workspace metrics.`
    }
    if (Number(stats.averageMoodScore) >= 4) {
      return "Your mood baseline is solid right now. Perfect window for intense coding or high-focus learning."
    }
    if (stats.totalNotes === 0) {
      return "Your SecondBrain is clean. Start tracking your daily build logs by writing your first smart note."
    }
    return "Workspace synced perfectly. Keep feeding documentation, tasks, and notes into your engine."
  }

  const formatDate = (value) => {
    if (!value) return "No date"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Invalid date"
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
      <div className="w-full mx-auto max-w-7xl space-y-4 px-2 py-3 sm:space-y-5 sm:px-4 md:space-y-6 md:py-4">
        
        {/* Minimalized Dynamic Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md sm:p-5 md:p-6">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Brain size={22} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-black text-white sm:text-xl md:text-2xl tracking-tight truncate">
                  Welcome back, {user?.name || "User"} 👋
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-400 truncate">
                  Workspace Metrics Status: <span className="text-cyan-400 font-semibold">{workspaceStatus}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchDashboard}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 sm:w-fit active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <RefreshCcw size={14} />
              )}
              <span>Refresh Analytics</span>
            </button>
          </div>
        </section>

        {/* Global Notifications Panel */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300 text-xs sm:text-sm">
            <AlertTriangle size={16} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Optimized Core Operational Metrics Grid */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          <StatCard
            title="Total Notes"
            value={stats.totalNotes}
            icon={<FileText size={20} />}
            color="text-cyan-400"
            link="/notes"
          />
          <StatCard
            title="AI Storage Vault"
            value={stats.totalFiles}
            icon={<FolderOpen size={20} />}
            color="text-purple-400"
            link="/files"
          />
          <StatCard
            title="Active Assistant Chats"
            value={stats.totalChats}
            icon={<MessageCircle size={20} />}
            color="text-emerald-400"
            link="/assistant"
          />
          <StatCard
            title="Task Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<BarChart3 size={20} />}
            color="text-amber-400"
            link="/reminders"
          />
        </section>

        {/* Operational Split Panel Zone */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr] md:gap-5">
          
          {/* AI Engines Insight Frame */}
          <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.01] p-4 backdrop-blur-md sm:p-5 flex flex-col justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="text-cyan-400 shrink-0" size={18} />
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                  AI Context Engine Insights
                </h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                {getProductivityInsight()}
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.04] bg-black/20 p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-400 font-medium">
                <span>Task Queue Completion Rate</span>
                <span className="font-bold text-cyan-400">{stats.completionRate}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${stats.completionRate || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Compact Emotional Feedback Deck */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md sm:p-5">
            <div className="mb-3.5 flex items-center gap-2 border-b border-white/[0.04] pb-2">
              <Smile className="text-purple-400 shrink-0" size={18} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Latest State Monitor</h2>
            </div>

            {stats.latestMood ? (
              <div className="flex items-center gap-4 min-w-0">
                <div className="text-4xl bg-white/5 p-2 rounded-xl shrink-0">
                  {getMoodEmoji(moodLabel)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white tracking-tight truncate">{moodLabel}</h3>
                  <p className={`text-xs font-semibold mt-0.5 ${getMoodColor(Number(moodScore))}`}>
                    Sentiment Vector: {moodScore}/5
                  </p>
                  {stats.latestMood.note && (
                    <p className="mt-1 text-xs text-slate-400 truncate max-w-full">
                      {stats.latestMood.note}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/5 p-4 text-center">
                <p className="text-xs text-slate-500 font-medium">No psychological logs registered for today.</p>
                <Link to="/mood" className="mt-2.5 inline-flex rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-black active:scale-[0.98]">
                  Log Current Status
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Clean, Non-redundant Quick Launch Control Actions Grid */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          <QuickAction title="Smart Notes" icon={<FileText size={18} />} link="/notes" color="cyan" />
          <QuickAction title="AI Core Chat" icon={<MessageCircle size={18} />} link="/assistant" color="purple" />
          <QuickAction title="Vault Upload" icon={<FolderOpen size={18} />} link="/files" color="emerald" />
          <QuickAction title="Add Reminders" icon={<Bell size={18} />} link="/reminders" color="amber" />
        </section>

        {/* Dynamic Activity Streaming Engine Area */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          <ActivityCard title="Recent Sync Notes" icon={<FileText className="text-cyan-400" size={18} />} emptyText="No cached notes found.">
            {recentActivity.recentNotes?.slice(0, 2).map((note) => (
              <div key={note._id} className="rounded-xl border border-white/[0.04] bg-black/20 p-3.5 min-w-0 w-full">
                <h3 className="truncate text-xs sm:text-sm font-bold text-white">{note.title}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-slate-400">{note.content}</p>
                <span className="mt-2 block text-[10px] text-slate-500 font-medium">{formatDate(note.createdAt)}</span>
              </div>
            ))}
          </ActivityCard>

          <ActivityCard title="Recent Documents" icon={<FolderOpen className="text-purple-400" size={18} />} emptyText="No system assets uploaded.">
            {recentActivity.recentFiles?.slice(0, 2).map((file) => (
              <div key={file._id} className="rounded-xl border border-white/[0.04] bg-black/20 p-3.5 min-w-0 w-full">
                <h3 className="truncate text-xs sm:text-sm font-bold text-white break-all">{file.originalName}</h3>
                <p className="mt-0.5 text-[10px] uppercase font-bold text-slate-500">{file.mimeType?.split("/")[1] || "Doc"}</p>
                <span className="mt-2 block text-[10px] text-slate-500 font-medium">{formatDate(file.createdAt)}</span>
              </div>
            ))}
          </ActivityCard>
        </section>

      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon, color, link }) {
  return (
    <Link to={link} className="group rounded-xl border border-white/5 bg-white/[0.01] p-3.5 backdrop-blur-md transition hover:bg-white/[0.03] flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate">{title}</h3>
        <div className={`${color} shrink-0 transition group-hover:scale-105`}>{icon}</div>
      </div>
      <p className="mt-3 text-xl font-black text-white sm:text-2xl tracking-tight truncate">{value}</p>
    </Link>
  )
}

function QuickAction({ title, icon, link, color }) {
  const themes = {
    cyan: "bg-cyan-500/[0.02] border-cyan-500/10 text-cyan-400 hover:bg-cyan-500/[0.06]",
    purple: "bg-purple-500/[0.02] border-purple-500/10 text-purple-400 hover:bg-purple-500/[0.06]",
    emerald: "bg-emerald-500/[0.02] border-emerald-500/10 text-emerald-400 hover:bg-emerald-500/[0.06]",
    amber: "bg-amber-500/[0.02] border-amber-500/10 text-amber-400 hover:bg-amber-500/[0.06]",
  }

  return (
    <Link to={link} className={`rounded-xl border p-3 flex items-center justify-between gap-2 text-xs font-bold transition active:scale-[0.98] ${themes[color]}`}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="shrink-0">{icon}</div>
        <span className="truncate">{title}</span>
      </div>
      <ArrowRight size={14} className="shrink-0" />
    </Link>
  )
}

function ActivityCard({ title, icon, emptyText, children }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children)

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md flex flex-col min-w-0 w-full">
      <div className="mb-3.5 flex items-center gap-2 border-b border-white/[0.04] pb-2">
        {icon}
        <h2 className="text-xs font-bold text-white uppercase tracking-wider truncate">{title}</h2>
      </div>
      <div className="space-y-2.5 flex-1">
        {hasChildren ? children : (
          <div className="rounded-xl border border-dashed border-white/5 p-6 text-center text-xs text-slate-500">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard