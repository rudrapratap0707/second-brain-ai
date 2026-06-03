import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  Target,
  Plus,
  Trash2,
  Loader2,
  CalendarDays,
  Flag,
  CheckCircle2,
} from "lucide-react"

import {
  createTarget,
  getTargets,
  updateTarget,
  deleteTarget,
} from "../services/api"

function TargetsGoals() {
  const [targets, setTargets] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Study",
    priority: "Medium",
    dueDate: "",
  })

  const fetchTargets = async () => {
    try {
      setLoading(true)

      const data = await getTargets()

      setTargets(data.targets || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTargets()
  }, [])

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "Study",
      priority: "Medium",
      dueDate: "",
    })
  }

  const handleCreateTarget = async () => {
    try {
      if (!form.title.trim() || !form.dueDate) {
        return alert("Title and due date required")
      }

      setSaving(true)

      await createTarget({
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        dueDate: form.dueDate,
        progress: 0,
        status: "Pending",
      })

      resetForm()
      fetchTargets()
    } catch (error) {
      console.log(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTarget(id)
      fetchTargets()
    } catch (error) {
      console.log(error)
    }
  }

  const handleProgressUpdate = async (target, value) => {
    try {
      const progress = Number(value)

      await updateTarget(target._id, {
        progress,
        status: progress >= 100 ? "Completed" : "Pending",
      })

      fetchTargets()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-7xl space-y-5 md:space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-black md:h-16 md:w-16">
              <Target size={30} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
                Targets & Goals
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                Create and manage academic, coding, career, internship, exam,
                and skill goals.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MiniStat title="Total" value={targets.length} />

          <MiniStat
            title="Completed"
            value={
              targets.filter((target) => target.status === "Completed")
                .length
            }
          />

          <MiniStat
            title="Pending"
            value={
              targets.filter((target) => target.status !== "Completed")
                .length
            }
          />

          <MiniStat
            title="High"
            value={
              targets.filter((target) => target.priority === "High")
                .length
            }
          />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <h2 className="mb-5 text-xl font-bold text-white md:text-2xl">
              Create Target
            </h2>

            <div className="space-y-4">
              <Input
                label="Target Title"
                value={form.title}
                onChange={(v) =>
                  setForm({
                    ...form,
                    title: v,
                  })
                }
              />

              <Textarea
                label="Description"
                value={form.description}
                onChange={(v) =>
                  setForm({
                    ...form,
                    description: v,
                  })
                }
              />

              <Select
                label="Category"
                value={form.category}
                onChange={(v) =>
                  setForm({
                    ...form,
                    category: v,
                  })
                }
                options={[
                  "Study",
                  "Coding",
                  "Career",
                  "Internship",
                  "Exam",
                  "Skill",
                ]}
              />

              <Select
                label="Priority"
                value={form.priority}
                onChange={(v) =>
                  setForm({
                    ...form,
                    priority: v,
                  })
                }
                options={["Low", "Medium", "High"]}
              />

              <Input
                type="date"
                label="Due Date"
                value={form.dueDate}
                onChange={(v) =>
                  setForm({
                    ...form,
                    dueDate: v,
                  })
                }
              />

              <button
                type="button"
                onClick={handleCreateTarget}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 md:py-4 md:text-base"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}

                {saving ? "Creating..." : "Create Target"}
              </button>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white md:text-2xl">
                    Active Targets
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {targets.length} target(s) found
                  </p>
                </div>

                <span className="w-fit rounded-2xl bg-white/10 px-4 py-2 text-xs text-slate-300 md:text-sm">
                  Goals Board
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2
                    className="animate-spin text-cyan-400"
                    size={36}
                  />
                </div>
              ) : targets.length === 0 ? (
                <EmptyTargets />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {targets.map((target) => (
                    <TargetCard
                      key={target._id}
                      target={target}
                      onDelete={handleDelete}
                      onProgressUpdate={handleProgressUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function TargetCard({ target, onDelete, onProgressUpdate }) {
  const progress = Number(target.progress || 0)
  const isCompleted = target.status === "Completed"

  return (
    <article className="rounded-3xl border border-white/10 bg-black/20 p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-lg font-bold text-white md:text-2xl">
              {target.title}
            </h3>

            <Badge text={target.category} color="cyan" />
            <Badge text={target.priority} color={getPriorityColor(target.priority)} />

            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200">
                <CheckCircle2 size={13} />
                Completed
              </span>
            )}
          </div>

          {target.description && (
            <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
              {target.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} />
              Due: {formatDate(target.dueDate)}
            </span>

            <span className="inline-flex items-center gap-2">
              <Flag size={15} />
              Progress: {progress}%
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) =>
                onProgressUpdate(target, e.target.value)
              }
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(target._id)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/30 lg:w-auto"
        >
          <Trash2 size={17} />
          Delete
        </button>
      </div>
    </article>
  )
}

function MiniStat({ title, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-5">
      <p className="text-xs text-slate-400 md:text-sm">{title}</p>

      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">
        {value}
      </h3>
    </div>
  )
}

function Badge({ text, color }) {
  const styles = {
    cyan: "bg-cyan-500/20 text-cyan-200",
    red: "bg-red-500/20 text-red-200",
    yellow: "bg-yellow-500/20 text-yellow-200",
    green: "bg-green-500/20 text-green-200",
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[color] || styles.cyan
      }`}
    >
      {text}
    </span>
  )
}

function EmptyTargets() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center md:p-12">
      <Target size={50} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-xl font-bold text-white md:text-2xl">
        No Targets Yet
      </h3>

      <p className="mt-2 text-sm text-slate-400 md:text-base">
        Create your first academic or career goal.
      </p>
    </div>
  )
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
      />
    </label>
  )
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>

      <textarea
        rows="4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none md:text-base"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function getPriorityColor(priority) {
  if (priority === "High") return "red"
  if (priority === "Medium") return "yellow"
  return "green"
}

function formatDate(value) {
  if (!value) return "No date"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default TargetsGoals