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
      (sum, log) =>
        sum + Number(log.totalStudyMinutes || 0),
      0
    )

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10

    const avgSuccess =
      totalLogs > 0
        ? Math.round(
            logs.reduce(
              (sum, log) =>
                sum + Number(log.successRate || 0),
              0
            ) / totalLogs
          )
        : 0

    const avgFocus =
      totalLogs > 0
        ? (
            logs.reduce(
              (sum, log) =>
                sum + Number(log.focusLevel || 0),
              0
            ) / totalLogs
          ).toFixed(1)
        : 0

    const activeDays = new Set(
      logs.map((log) =>
        new Date(log.date).toDateString()
      )
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
        (sum, log) =>
          sum + Number(log.totalStudyMinutes || 0),
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

        map[subject].minutes += Number(
          item.durationMinutes || 0
        )
        map[subject].sessions += 1
      })
    })

    return Object.values(map).sort(
      (a, b) => b.minutes - a.minutes
    )
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
            durationMinutes: Number(
              form.durationMinutes || 0
            ),
          },
        ],
        totalStudyMinutes: Number(
          form.durationMinutes || 0
        ),
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
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-400 text-black">
                <LineChart size={34} />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white">
                  Learning Monitor
                </h1>

                <p className="mt-2 max-w-3xl text-slate-400">
                  Heatmap-style study analytics, learning consistency, focus score,
                  subject distribution, and productivity tracking.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
              <Flame className="mx-auto text-orange-300" size={34} />
              <h2 className="mt-3 text-3xl font-bold text-white">
                {analytics.activeDays}
              </h2>
              <p className="text-sm text-slate-400">
                Active Study Days
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Logs"
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

          <MetricCard
            label="Active Days"
            value={analytics.activeDays}
            icon={Flame}
          />
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <CalendarDays className="text-green-300" size={28} />

            <div>
              <h2 className="text-2xl font-bold text-white">
                42-Day Learning Heatmap
              </h2>

              <p className="text-sm text-slate-400">
                Darker blocks mean more study minutes on that day.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 md:grid-cols-14">
            {heatmapDays.map((day) => (
              <div
                key={day.date.toISOString()}
                title={`${day.date.toDateString()} - ${day.totalMinutes} min`}
                className={`h-10 rounded-xl border border-white/10 ${getHeatmapClass(
                  day.totalMinutes
                )}`}
              />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Add Learning Log
            </h2>

            <div className="space-y-5">
              <Input
                type="date"
                label="Date"
                value={form.date}
                onChange={(v) =>
                  setForm({
                    ...form,
                    date: v,
                  })
                }
              />

              <Input
                label="Subject"
                value={form.subject}
                onChange={(v) =>
                  setForm({
                    ...form,
                    subject: v,
                  })
                }
              />

              <Input
                label="Topic"
                value={form.topic}
                onChange={(v) =>
                  setForm({
                    ...form,
                    topic: v,
                  })
                }
              />

              <Input
                type="number"
                label="Study Duration Minutes"
                value={form.durationMinutes}
                onChange={(v) =>
                  setForm({
                    ...form,
                    durationMinutes: v,
                  })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Completed Checkpoints"
                  value={form.completedCheckpoints}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      completedCheckpoints: v,
                    })
                  }
                />

                <Input
                  type="number"
                  label="Total Checkpoints"
                  value={form.totalCheckpoints}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      totalCheckpoints: v,
                    })
                  }
                />
              </div>

              <RangeInput
                label="Focus Level"
                value={form.focusLevel}
                min="1"
                max="5"
                onChange={(v) =>
                  setForm({
                    ...form,
                    focusLevel: v,
                  })
                }
              />

              <Textarea
                label="Productivity Note"
                value={form.productivityNote}
                onChange={(v) =>
                  setForm({
                    ...form,
                    productivityNote: v,
                  })
                }
              />

              <Textarea
                label="Weak Areas Found"
                value={form.weakAreasText}
                onChange={(v) =>
                  setForm({
                    ...form,
                    weakAreasText: v,
                  })
                }
                placeholder="Comma separated: normalization, joins, arrays"
              />

              <button
                type="button"
                onClick={handleCreateLog}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-400 px-5 py-4 font-bold text-black"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                Add Learning Log
              </button>
            </div>
          </section>

          <section className="xl:col-span-2 space-y-8">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <h2 className="mb-6 text-2xl font-bold text-white">
                Subject Distribution
              </h2>

              {subjectSummary.length === 0 ? (
                <p className="text-slate-400">
                  No subject data yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {subjectSummary.map((item) => (
                    <SubjectBar
                      key={item.subject}
                      item={item}
                      maxMinutes={
                        subjectSummary[0]?.minutes || 1
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Recent Learning Logs
                </h2>

                <span className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {logs.length} Logs
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2
                    className="animate-spin text-green-300"
                    size={42}
                  />
                </div>
              ) : logs.length === 0 ? (
                <EmptyLogs />
              ) : (
                <div className="space-y-5">
                  {logs.map((log) => (
                    <LogCard
                      key={log._id}
                      log={log}
                      onDelete={handleDelete}
                    />
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
    <div>
      <div className="mb-2 flex justify-between">
        <div>
          <h3 className="font-bold text-white">
            {item.subject}
          </h3>

          <p className="text-sm text-slate-400">
            {item.sessions} sessions
          </p>
        </div>

        <p className="font-semibold text-green-300">
          {Math.round(item.minutes / 60)}h
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-green-400"
          style={{
            width: `${width}%`,
          }}
        />
      </div>
    </div>
  )
}

function LogCard({ log, onDelete }) {
  const subject =
    log.subjectsStudied?.[0]?.subject || "Unknown"

  const topic =
    log.subjectsStudied?.[0]?.topic || "No topic"

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-bold text-white">
              {subject}
            </h3>

            <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs font-semibold text-green-200">
              {log.successRate || 0}% Success
            </span>

            <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-200">
              Focus {log.focusLevel || 3}/5
            </span>
          </div>

          <p className="mt-3 text-slate-400">
            Topic: {topic}
          </p>

          <p className="mt-2 text-slate-400">
            Duration: {log.totalStudyMinutes || 0} minutes
          </p>

          <p className="mt-2 text-slate-400">
            Date:{" "}
            {new Date(log.date).toLocaleDateString()}
          </p>

          {log.productivityNote && (
            <p className="mt-4 leading-7 text-slate-300">
              {log.productivityNote}
            </p>
          )}

          {log.weakAreasFound?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {log.weakAreasFound.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-200"
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
          className="flex items-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 text-red-300 transition hover:bg-red-500/30"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  )
}

function EmptyLogs() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
      <LineChart size={54} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-2xl font-bold text-white">
        No Learning Logs Yet
      </h3>

      <p className="mt-2 text-slate-400">
        Add your first study log to generate analytics.
      </p>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-green-300">
        <Icon size={24} />
      </div>

      <p className="text-sm text-slate-400">{label}</p>

      <h2 className="mt-2 text-3xl font-bold text-white">
        {value}
      </h2>
    </div>
  )
}

function getHeatmapClass(minutes) {
  if (minutes <= 0) {
    return "bg-white/5"
  }

  if (minutes < 30) {
    return "bg-green-900/40"
  }

  if (minutes < 60) {
    return "bg-green-700/60"
  }

  if (minutes < 120) {
    return "bg-green-500/80"
  }

  return "bg-green-300"
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
      />
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <textarea
        rows="4"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-600"
      />
    </label>
  )
}

function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
}) {
  return (
    <label className="block">
      <div className="flex justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full"
      />
    </label>
  )
}

export default LearningMonitor