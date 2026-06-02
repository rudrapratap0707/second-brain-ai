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

  const handleProgressUpdate = async (
    target,
    value
  ) => {
    try {
      const progress = Number(value)

      await updateTarget(target._id, {
        progress,
        status:
          progress >= 100
            ? "Completed"
            : "Pending",
      })

      fetchTargets()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="rounded-[32px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-black">
              <Target size={34} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                Targets & Goals
              </h1>

              <p className="mt-2 text-slate-400">
                Create and manage academic,
                coding, and career goals.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Create New Target
            </h2>

            <div className="space-y-5">
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
                options={[
                  "Low",
                  "Medium",
                  "High",
                ]}
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
                onClick={handleCreateTarget}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-bold text-black"
              >
                {saving ? (
                  <Loader2
                    className="animate-spin"
                    size={20}
                  />
                ) : (
                  <Plus size={20} />
                )}

                Create Target
              </button>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Active Targets
                </h2>

                <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {targets.length} Targets
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2
                    className="animate-spin text-cyan-400"
                    size={40}
                  />
                </div>
              ) : targets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
                  <Target
                    size={50}
                    className="mx-auto text-slate-600"
                  />

                  <h3 className="mt-4 text-xl font-bold text-white">
                    No Targets Yet
                  </h3>

                  <p className="mt-2 text-slate-400">
                    Create your first academic goal.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {targets.map((target) => (
                    <div
                      key={target._id}
                      className="rounded-3xl border border-white/10 bg-black/20 p-6"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-bold text-white">
                              {target.title}
                            </h3>

                            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                              {target.category}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                target.priority === "High"
                                  ? "bg-red-500/20 text-red-200"
                                  : target.priority === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-200"
                                  : "bg-green-500/20 text-green-200"
                              }`}
                            >
                              {target.priority}
                            </span>

                            {target.status ===
                              "Completed" && (
                              <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200">
                                <CheckCircle2 size={14} />
                                Completed
                              </span>
                            )}
                          </div>

                          <p className="mt-4 leading-7 text-slate-400">
                            {target.description}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} />
                              Due:
                              {" "}
                              {new Date(
                                target.dueDate
                              ).toLocaleDateString()}
                            </div>

                            <div className="flex items-center gap-2">
                              <Flag size={16} />
                              Progress:
                              {" "}
                              {target.progress || 0}%
                            </div>
                          </div>

                          <div className="mt-5">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={
                                target.progress || 0
                              }
                              onChange={(e) =>
                                handleProgressUpdate(
                                  target,
                                  e.target.value
                                )
                              }
                              className="w-full"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleDelete(
                              target._id
                            )
                          }
                          className="flex items-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 text-red-300 transition hover:bg-red-500/30"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
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
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
      />
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <textarea
        rows="4"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
      />
    </label>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-slate-900"
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default TargetsGoals
