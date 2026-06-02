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

  const handleCreateTarget = async () => {
    try {
      if (!form.title || !form.dueDate) {
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

      setForm({
        title: "",
        description: "",
        category: "Study",
        priority: "Medium",
        dueDate: "",
      })

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
      {/* Main Container Wrapper */}
      <div className="space-y-6 p-2 sm:p-4 md:space-y-8">
        
        {/* Header Hero Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:rounded-[24px] sm:p-6 md:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-black sm:h-14 sm:w-14 sm:rounded-2xl">
              <Target className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                Targets & Goals
              </h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm md:mt-2">
                Create and manage academic, coding, and career goals.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Responsive Grid Layout */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          
          {/* Create New Target Form Section */}
          <div className="h-fit rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:rounded-[24px] sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:mb-6 md:text-2xl">
              Create New Target
            </h2>

            <div className="space-y-4">
              <Input
                label="Target Title"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
              />

              <Textarea
                label="Description"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
              />

              {/* Input Group to stack fields beautifully on tiny screens */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v })}
                  options={["Study", "Coding", "Career", "Internship", "Exam", "Skill"]}
                />

                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={(v) => setForm({ ...form, priority: v })}
                  options={["Low", "Medium", "High"]}
                />
              </div>

              <Input
                type="date"
                label="Due Date"
                value={form.dueDate}
                onChange={(v) => setForm({ ...form, dueDate: v })}
              />

              <button
                onClick={handleCreateTarget}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98] sm:rounded-2xl sm:py-4 sm:text-base"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                Create Target
              </button>
            </div>
          </div>

          {/* Active Targets List Section */}
          <div className="xl:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:rounded-[24px] sm:p-6">
              
              {/* Header inside list */}
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                  Active Targets
                </h2>
                <div className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                  {targets.length} Targets
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-cyan-400" size={32} />
                </div>
              ) : targets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-6 text-center sm:p-10">
                  <Target size={40} className="mx-auto text-slate-600 sm:size-[50px]" />
                  <h3 className="mt-3 text-lg font-bold text-white sm:text-xl">
                    No Targets Yet
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    Create your first academic goal.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {targets.map((target) => (
                    <div
                      key={target._id}
                      className="rounded-xl border border-white/10 bg-black/20 p-4 sm:rounded-2xl sm:p-6"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Title & Badge Layout */}
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl truncate max-w-full">
                              {target.title}
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-200 sm:text-xs">
                                {target.category}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${
                                  target.priority === "High"
                                    ? "bg-red-500/20 text-red-200"
                                    : target.priority === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-200"
                                    : "bg-green-500/20 text-green-200"
                                }`}
                              >
                                {target.priority}
                              </span>
                              {target.status === "Completed" && (
                                <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-200 sm:text-xs">
                                  <CheckCircle2 size={12} />
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm sm:leading-7">
                            {target.description}
                          </p>

                          {/* Meta Information Container */}
                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays size={14} className="text-slate-500" />
                              <span>Due: {new Date(target.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Flag size={14} className="text-slate-500" />
                              <span>Progress: {target.progress || 0}%</span>
                            </div>
                          </div>

                          {/* Custom Sliders styled minimally */}
                          <div className="mt-4">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={target.progress || 0}
                              onChange={(e) => handleProgressUpdate(target, e.target.value)}
                              className="w-full accent-cyan-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Action buttons look cleaner and full width on smaller screen breaks */}
                        <div className="flex lg:self-start justify-end mt-2 lg:mt-0">
                          <button
                            onClick={() => handleDelete(target._id)}
                            className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/20 active:scale-[0.98]"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

// Minimalistic Custom Input Component
function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-400 sm:text-sm">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-white/10 sm:rounded-2xl sm:px-4 sm:py-3"
      />
    </label>
  )
}

// Minimalistic Custom Textarea Component
function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-400 sm:text-sm">
        {label}
      </span>
      <textarea
        rows="3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-white/10 sm:rounded-2xl sm:px-4 sm:py-3"
      />
    </label>
  )
}

// Minimalistic Custom Select Component
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-400 sm:text-sm">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-white/10 sm:rounded-2xl sm:px-4 sm:py-3"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900 text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default TargetsGoals