import { useEffect, useMemo, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  ClipboardCheck,
  Plus,
  Trash2,
  Loader2,
  CalendarDays,
  CheckCircle2,
  Target,
  FileText,
  Layers,
  Percent,
  Clock,
  Bookmark,
  CheckSquare,
} from "lucide-react"

import {
  createCheckpoint,
  getCheckpoints,
  updateCheckpoint,
  deleteCheckpoint,
  getTargets,
} from "../services/api"

function Checkpoints() {
  const [checkpoints, setCheckpoints] = useState([])
  const [targets, setTargets] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Study",
    target: "",
    progressWeight: 0,
    dueDate: "",
  })

  const fetchData = async () => {
    try {
      setLoading(true)

      const [checkpointData, targetData] = await Promise.all([
        getCheckpoints(),
        getTargets(),
      ])

      setCheckpoints(checkpointData.checkpoints || [])
      setTargets(targetData.targets || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const completedCount = useMemo(() => {
    return checkpoints.filter((item) => item.status === "Completed").length
  }, [checkpoints])

  const pendingCount = useMemo(() => {
    return checkpoints.filter((item) => item.status !== "Completed").length
  }, [checkpoints])

  const totalWeight = useMemo(() => {
    return checkpoints.reduce(
      (total, item) => total + Number(item.progressWeight || 0),
      0
    )
  }, [checkpoints])

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "Study",
      target: "",
      progressWeight: 0,
      dueDate: "",
    })
  }

  const handleCreateCheckpoint = async () => {
    try {
      if (!form.title.trim()) {
        return alert("Checkpoint title required")
      }

      setSaving(true)

      await createCheckpoint({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        target: form.target || null,
        progressWeight: Number(form.progressWeight || 0),
        dueDate: form.dueDate || null,
        status: "Pending",
      })

      resetForm()
      await fetchData()
    } catch (error) {
      console.log(error)
      alert(
        error.response?.data?.message ||
          "Failed to create checkpoint."
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!id) return

    try {
      await deleteCheckpoint(id)
      await fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleToggleStatus = async (checkpoint) => {
    if (!checkpoint?._id) return

    try {
      const isCompleted = checkpoint.status === "Completed"

      await updateCheckpoint(checkpoint._id, {
        status: isCompleted ? "Pending" : "Completed",
        completedAt: isCompleted ? null : new Date(),
      })

      await fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-7xl space-y-5 md:space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-black md:h-16 md:w-16">
                <ClipboardCheck size={30} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
                  Checkpoints
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Break big targets into small measurable tasks, lectures,
                  tests, notes, practice sets, and milestones.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[420px]">
              <Metric label="Total" value={checkpoints.length} />
              <Metric label="Pending" value={pendingCount} />
              <Metric label="Completed" value={completedCount} />
              <Metric label="Weight" value={`${totalWeight}%`} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <CheckSquare className="text-cyan-400" size={22} />

              <h2 className="text-xl font-bold text-white md:text-2xl">
                Create Checkpoint
              </h2>
            </div>

            <div className="space-y-4">
              <Input
                label="Checkpoint Title"
                value={form.title}
                onChange={(v) =>
                  setForm({
                    ...form,
                    title: v,
                  })
                }
                placeholder="Example: Complete DBMS notes"
                icon={<Bookmark size={14} />}
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
                placeholder="Write short task details..."
                icon={<FileText size={14} />}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
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
                    "Revision",
                    "Assignment",
                    "Skill",
                    "Project",
                    "Exam",
                    "Practice",
                    "Other",
                  ]}
                  icon={<Layers size={14} />}
                />

                <Input
                  type="number"
                  label="Progress Weight"
                  value={form.progressWeight}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      progressWeight: v,
                    })
                  }
                  placeholder="0-100"
                  icon={<Percent size={14} />}
                />
              </div>

              <TargetSelect
                value={form.target}
                targets={targets}
                onChange={(v) =>
                  setForm({
                    ...form,
                    target: v,
                  })
                }
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
                icon={<Clock size={14} />}
              />

              <button
                type="button"
                onClick={handleCreateCheckpoint}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 md:py-4 md:text-base"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}

                {saving ? "Creating..." : "Create Checkpoint"}
              </button>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white md:text-2xl">
                    Active Checkpoints
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {checkpoints.length} checkpoint(s) loaded
                  </p>
                </div>

                <span className="w-fit rounded-2xl bg-white/10 px-4 py-2 text-xs text-slate-300 md:text-sm">
                  Progress Board
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <Loader2 className="animate-spin text-cyan-400" size={36} />
                  <p className="text-sm text-slate-400">
                    Loading checkpoints...
                  </p>
                </div>
              ) : checkpoints.length === 0 ? (
                <EmptyCheckpoints />
              ) : (
                <div className="space-y-4">
                  {checkpoints.map((checkpoint) => (
                    <CheckpointCard
                      key={checkpoint._id}
                      checkpoint={checkpoint}
                      onDelete={handleDelete}
                      onToggle={handleToggleStatus}
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

function CheckpointCard({ checkpoint, onDelete, onToggle }) {
  const isCompleted = checkpoint.status === "Completed"
  const isOverdue =
    !isCompleted &&
    checkpoint.dueDate &&
    new Date(checkpoint.dueDate) < new Date()

  return (
    <article
      className={`rounded-3xl border p-4 transition md:p-5 ${
        isCompleted
          ? "border-green-400/20 bg-green-500/5"
          : isOverdue
          ? "border-red-400/20 bg-red-500/5"
          : "border-white/10 bg-black/20 hover:bg-white/10"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`break-words text-lg font-bold md:text-2xl ${
                isCompleted
                  ? "text-slate-400 line-through"
                  : "text-white"
              }`}
            >
              {checkpoint.title}
            </h3>

            <Badge color="cyan" text={checkpoint.category} />

            {Number(checkpoint.progressWeight || 0) > 0 && (
              <Badge
                color="purple"
                text={`Weight ${checkpoint.progressWeight}%`}
              />
            )}

            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200">
                <CheckCircle2 size={13} />
                Completed
              </span>
            )}

            {isOverdue && <Badge color="red" text="Overdue" />}
          </div>

          <p
            className={`mt-3 text-sm leading-7 md:text-base ${
              isCompleted ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {checkpoint.description || "No description added."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
            <span className="inline-flex min-w-0 items-center gap-2">
              <Target size={15} className="shrink-0" />
              <span className="truncate">
                {checkpoint.target?.title || "Standalone"}
              </span>
            </span>

            <span
              className={`inline-flex items-center gap-2 ${
                isOverdue ? "text-red-300" : ""
              }`}
            >
              <CalendarDays size={15} />
              {checkpoint.dueDate
                ? formatDate(checkpoint.dueDate)
                : "Flexible"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <button
            type="button"
            onClick={() => onToggle(checkpoint)}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              isCompleted
                ? "bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30"
                : "bg-green-500/20 text-green-200 hover:bg-green-500/30"
            }`}
          >
            {isCompleted ? "Mark Pending" : "Complete"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(checkpoint._id)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/30"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

function TargetSelect({ value, targets, onChange }) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Target size={14} />
        <span>Link Target</span>
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none md:text-base"
      >
        <option value="" className="bg-slate-900">
          Independent Checkpoint
        </option>

        {targets.map((target) => (
          <option key={target._id} value={target._id} className="bg-slate-900">
            {target.title}
          </option>
        ))}
      </select>
    </label>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 md:px-4">
      <p className="text-xs text-slate-400">{label}</p>

      <h3 className="mt-1 text-lg font-bold text-white md:text-xl">
        {value}
      </h3>
    </div>
  )
}

function Badge({ text, color }) {
  const styles = {
    cyan: "bg-cyan-500/20 text-cyan-200",
    purple: "bg-purple-500/20 text-purple-200",
    red: "bg-red-500/20 text-red-200",
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

function EmptyCheckpoints() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center md:p-12">
      <ClipboardCheck size={50} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-xl font-bold text-white md:text-2xl">
        No Checkpoints Yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400 md:text-base">
        Create your first checkpoint to break a big goal into smaller steps.
      </p>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon = null,
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        {icon}
        <span>{label}</span>
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 md:text-base"
      />
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  icon = null,
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        {icon}
        <span>{label}</span>
      </div>

      <textarea
        rows="4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 md:text-base"
      />
    </label>
  )
}

function Select({ label, value, onChange, options, icon = null }) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        {icon}
        <span>{label}</span>
      </div>

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

export default Checkpoints