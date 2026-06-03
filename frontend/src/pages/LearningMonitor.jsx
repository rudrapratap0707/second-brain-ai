import { useEffect, useMemo, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import {
  LineChart,
  Plus,
  Trash2,
  Loader2,
  Flame,
  Clock3,
  Target,
  Brain,
  CalendarDays,
  Activity,
  BookOpen,
  TrendingUp,
} from "lucide-react"

import {
  createLearningLog,
  getLearningLogs,
  deleteLearningLog,
} from "../services/api"

function LearningMonitor() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    date: "",
    subject: "",
    topic: "",
    durationMinutes: 0,
    completedCheckpoints: 0,
    totalCheckpoints: 0,
    focusLevel: 3,
    productivityNote: "",
    weakAreasText: "",
  })

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const data = await getLearningLogs()
      setLogs(data.logs || [])
    } catch (error) {
      console.log(error)
      alert(
        error.response?.data?.message ||
          "Failed to fetch learning logs"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const analytics = useMemo(() => {
    const totalLogs = logs.length

    const totalMinutes = logs.reduce(
      (sum, log) => sum + Number(log.totalStudyMinutes || 0),
      0
    )

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10

    const avgSuccess =
      totalLogs > 0
        ? Math.round(
            logs.reduce(
              (sum, log) => sum + Number(log.successRate || 0),
              0
            ) / totalLogs
          )
        : 0

    const avgFocus =
      totalLogs > 0
        ? (
            logs.reduce(
              (sum, log) => sum + Number(log.focusLevel || 0),
              0
            ) / totalLogs
          ).toFixed(1)
        : 0

    const activeDays = new Set(
      logs.map((log) => new Date(log.date).toDateString())
    ).size

    return {
      totalLogs,
      totalHours,
      avgSuccess,
      avgFocus,
      activeDays,
    }
  }, [logs])

  const heatmapDays = useMemo(() => {
    const today = new Date()
    const days = []

    for (let i = 41; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const matchingLogs = logs.filter((log) => {
        const logDate = new Date(log.date)
        logDate.setHours(0, 0, 0, 0)
        return logDate.getTime() === date.getTime()
      })

      const totalMinutes = matchingLogs.reduce(
        (sum, log) => sum + Number(log.totalStudyMinutes || 0),
        0
      )

      days.push({
        date,
        totalMinutes,
        count: matchingLogs.length,
      })
    }

    return days
  }, [logs])

  const subjectSummary = useMemo(() => {
    const map = {}

    logs.forEach((log) => {
      ;(log.subjectsStudied || []).forEach((item) => {
        const subject = item.subject || "Unknown"

        if (!map[subject]) {
          map[subject] = {
            subject,
            minutes: 0,
            sessions: 0,
          }
        }

        map[subject].minutes += Number(item.durationMinutes || 0)
        map[subject].sessions += 1
      })
    })

    return Object.values(map).sort((a, b) => b.minutes - a.minutes)
  }, [logs])

  const toArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const handleCreateLog = async () => {
    try {
      if (!form.subject || !form.durationMinutes) {
        return alert("Subject and study duration required")
      }

      setSaving(true)

      const completed = Number(form.completedCheckpoints || 0)
      const total = Number(form.totalCheckpoints || 0)

      const successRate =
        total > 0 ? Math.round((completed / total) * 100) : 0

      await createLearningLog({
        date: form.date || new Date(),
        subjectsStudied: [
          {
            subject: form.subject,
            topic: form.topic,
            durationMinutes: Number(form.durationMinutes || 0),
          },
        ],
        totalStudyMinutes: Number(form.durationMinutes || 0),
        completedCheckpoints: completed,
        totalCheckpoints: total,
        successRate,
        focusLevel: Number(form.focusLevel || 3),
        productivityNote: form.productivityNote,
        weakAreasFound: toArray(form.weakAreasText),
      })

      setForm({
        date: "",
        subject: "",
        topic: "",
        durationMinutes: 0,
        completedCheckpoints: 0,
        totalCheckpoints: 0,
        focusLevel: 3,
        productivityNote: "",
        weakAreasText: "",
      })

      fetchLogs()
    } catch (error) {
      console.log(error)
      alert(
        error.response?.data?.message ||
          "Failed to create learning log"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteLearningLog(id)
      fetchLogs()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto px-1 sm:px-4">
        
        {/* Header Hero Section */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.06] p-4 sm:p-6 md:p-8 backdrop-blur-md">
          <div className="absolute -right-24 -top-24 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-green-400 text-black">
                <LineChart className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Learning Monitor
                </h1>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  Heatmap-style study analytics, learning consistency, focus score,
                  subject distribution, and productivity tracking.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl sm:rounded-2xl border border-white/5 bg-black/30 p-3 sm:p-4 lg:self-center self-start min-w-[140px] sm:min-w-[160px]">
              <Flame className="text-orange-400 h-6 w-6 sm:h-8 sm:w-8 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-none">
                  {analytics.activeDays}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1 whitespace-nowrap">
                  Active Study Days
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Counter Grid */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Logs Saved"
            value={analytics.totalLogs}
            icon={Activity}
          />
          <MetricCard
            label="Study Hours"
            value={`${analytics.totalHours}h`}
            icon={Clock3}
          />
          <MetricCard
            label="Success Avg"
            value={`${analytics.avgSuccess}%`}
            icon={Target}
          />
          <MetricCard
            label="Focus Avg"
            value={`${analytics.avgFocus}/5`}
            icon={Brain}
          />
          <div className="col-span-2 md:col-span-1">
            <MetricCard
              label="Active Days"
              value={analytics.activeDays}
              icon={Flame}
            />
          </div>
        </section>

        {/* Heatmap Layout Tracker */}
        <section className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.06] p-4 sm:p-6 md:p-7 backdrop-blur-md">
          <div className="mb-4 sm:mb-6 flex items-start gap-3">
            <CalendarDays className="text-green-400 h-5 w-5 sm:h-7 sm:w-7 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                42-Day Learning Heatmap
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Darker blocks mean higher cumulative study duration on that day.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 sm:grid-cols-7 md:grid-cols-14">
            {heatmapDays.map((day) => (
              <div
                key={day.date.toISOString()}
                title={`${day.date.toDateString()} - ${day.totalMinutes} min`}
                className={`h-8 sm:h-10 rounded-lg sm:rounded-xl border border-white/5 transition-colors duration-200 ${getHeatmapClass(
                  day.totalMinutes
                )}`}
              />
            ))}
          </div>
        </section>

        {/* Bottom Panel Split Layout */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 items-start">
          
          {/* Action Log Form Container */}
          <section className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.06] p-4 sm:p-6 md:p-7 backdrop-blur-md">
            <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white">
              Add Learning Log
            </h2>

            <div className="space-y-4">
              <Input
                type="date"
                label="Log Date"
                value={form.date}
                onChange={(v) => setForm({ ...form, date: v })}
              />

              <Input
                label="Subject Title"
                placeholder="e.g. JavaScript, System Design"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
              />

              <Input
                label="Topic Discussed"
                placeholder="e.g. Promises, Map vs Set"
                value={form.topic}
                onChange={(v) => setForm({ ...form, topic: v })}
              />

              <Input
                type="number"
                label="Study Duration (Minutes)"
                value={form.durationMinutes || ""}
                onChange={(v) => setForm({ ...form, durationMinutes: v })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Done Checkpoints"
                  value={form.completedCheckpoints || ""}
                  onChange={(v) => setForm({ ...form, completedCheckpoints: v })}
                />
                <Input
                  type="number"
                  label="Total Checkpoints"
                  value={form.totalCheckpoints || ""}
                  onChange={(v) => setForm({ ...form, totalCheckpoints: v })}
                />
              </div>

              <RangeInput
                label="Focus Metric Level"
                value={form.focusLevel}
                min="1"
                max="5"
                onChange={(v) => setForm({ ...form, focusLevel: v })}
              />

              <Textarea
                label="Productivity Observation Notes"
                placeholder="How was your retention efficiency today?"
                value={form.productivityNote}
                onChange={(v) => setForm({ ...form, productivityNote: v })}
              />

              <Textarea
                label="Identified Core Weak Areas"
                value={form.weakAreasText}
                onChange={(v) => setForm({ ...form, weakAreasText: v })}
                placeholder="Comma separated: closures, event loop, hoisting"
              />

              <button
                type="button"
                onClick={handleCreateLog}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-green-400 p-3.5 sm:p-4 text-sm sm:text-base font-bold text-black transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                Save Log Profile
              </button>
            </div>
          </section>

          {/* Dashboards and Interactive Lists */}
          <section className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Subject Segmentation Tracking */}
            <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.06] p-4 sm:p-6 md:p-7 backdrop-blur-md">
              <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white">
                Subject Distribution
              </h2>

              {subjectSummary.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-400 py-2">
                  No tracking vectors compiled yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {subjectSummary.map((item) => (
                    <SubjectBar
                      key={item.subject}
                      item={item}
                      maxMinutes={subjectSummary[0]?.minutes || 1}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Card Feed Logger */}
            <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.06] p-4 sm:p-6 md:p-7 backdrop-blur-md">
              <div className="mb-4 sm:mb-6 flex items-center justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Recent Learning Logs
                </h2>
                <span className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 shrink-0">
                  {logs.length} Total Logs
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12 sm:py-20">
                  <Loader2 className="animate-spin text-green-400 h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              ) : logs.length === 0 ? (
                <EmptyLogs />
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <LogCard key={log._id} log={log} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </DashboardLayout>
  )
}

function SubjectBar({ item, maxMinutes }) {
  const width = Math.round((item.minutes / maxMinutes) * 100)

  return (
    <div className="group">
      <div className="mb-1.5 flex justify-between items-end gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-white truncate">
            {item.subject}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            {item.sessions} tracking {item.sessions === 1 ? "session" : "sessions"}
          </p>
        </div>
        <p className="font-bold text-xs sm:text-sm text-green-400 shrink-0">
          {Math.round(item.minutes / 60)}h
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-green-400 transition-all duration-500 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

function LogCard({ log, onDelete }) {
  const subject = log.subjectsStudied?.[0]?.subject || "Unknown Object"
  const topic = log.subjectsStudied?.[0]?.topic || "General Study Stream"

  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-5 transition-all duration-200 hover:border-white/10">
      <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight break-words">
              {subject}
            </h3>
            <span className="inline-flex rounded-full bg-green-400/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-green-300">
              {log.successRate || 0}% Accuracy
            </span>
            <span className="inline-flex rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-cyan-300">
              Focus {log.focusLevel || 3}/5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs sm:text-sm text-slate-400">
            <p className="truncate"><span className="text-slate-500">Topic:</span> {topic}</p>
            <p><span className="text-slate-500">Time:</span> {log.totalStudyMinutes || 0} mins</p>
            <p className="sm:col-span-2">
              <span className="text-slate-500">Timestamp:</span>{" "}
              {new Date(log.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </p>
          </div>

          {log.productivityNote && (
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 border-l border-white/5 pl-2.5 mt-2">
              {log.productivityNote}
            </p>
          )}

          {log.weakAreasFound?.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1">
              {log.weakAreasFound.map((area) => (
                <span
                  key={area}
                  className="rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-red-300 border border-red-500/5"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDelete(log._id)}
          className="flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 active:scale-[0.98] self-start md:self-auto w-full md:w-auto shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Remove File</span>
        </button>
      </div>
    </div>
  )
}

function EmptyLogs() {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-dashed border-white/5 p-8 sm:p-12 text-center">
      <LineChart className="mx-auto text-slate-600 h-10 w-10 sm:h-12 sm:w-12" />
      <h3 className="mt-4 text-lg sm:text-xl font-bold text-white">
        No Activity Traces Checked
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
        Populate your tracking pipeline with logs to activate evaluation metrics.
      </p>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.04] p-4 backdrop-blur-md flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
      <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white/5 text-green-400">
        <Icon className="h-4 sm:h-5 sm:w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate">{label}</p>
        <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5 tracking-tight">
          {value}
        </h2>
      </div>
    </div>
  )
}

function getHeatmapClass(minutes) {
  if (minutes <= 0) return "bg-white/[0.03]"
  if (minutes < 30) return "bg-green-950/40"
  if (minutes < 60) return "bg-green-800/50"
  if (minutes < 120) return "bg-green-600/70"
  return "bg-green-400 text-black"
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block w-full">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/5 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 outline-none focus:border-green-400/30 transition-colors"
      />
    </label>
  )
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block w-full">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <textarea
        rows="3"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full resize-none rounded-xl border border-white/5 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none placeholder:text-slate-600 focus:border-green-400/30 transition-colors"
      />
    </label>
  )
}

function RangeInput({ label, value, onChange, min, max }) {
  return (
    <label className="block w-full">
      <div className="flex justify-between items-center text-xs font-medium text-slate-400">
        <span>{label}</span>
        <span className="font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded text-[10px]">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full accent-green-400 cursor-pointer h-1.5 bg-white/5 rounded-lg appearance-none"
      />
    </label>
  )
}

export default LearningMonitor