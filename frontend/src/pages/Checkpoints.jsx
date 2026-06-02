import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  ClipboardCheck,
  Plus,
  Trash2,
  Loader2,
  CalendarDays,
  CheckCircle2,
  Target,
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

      const checkpointData = await getCheckpoints()
      const targetData = await getTargets()

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

  const handleCreateCheckpoint = async () => {
    try {
      if (!form.title) {
        return alert("Checkpoint title required")
      }

      setSaving(true)

      await createCheckpoint({
        title: form.title,
        description: form.description,
        category: form.category,
        target: form.target || null,
        progressWeight: Number(form.progressWeight || 0),
        dueDate: form.dueDate || null,
        status: "Pending",
      })

      setForm({
        title: "",
        description: "",
        category: "Study",
        target: "",
        progressWeight: 0,
        dueDate: "",
      })

      fetchData()
    } catch (error) {
      console.log(error)
      alert(
        error.response?.data?.message ||
          "Failed to create checkpoint"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCheckpoint(id)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleToggleStatus = async (checkpoint) => {
    try {
      const isCompleted =
        checkpoint.status === "Completed"

      await updateCheckpoint(checkpoint._id, {
        status: isCompleted
          ? "Pending"
          : "Completed",
        completedAt: isCompleted ? null : new Date(),
      })

      fetchData()
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
              <ClipboardCheck size={34} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                Checkpoints
              </h1>

              <p className="mt-2 text-slate-400">
                Break your targets into small measurable tasks.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Create Checkpoint
            </h2>

            <div className="space-y-5">
              <Input
                label="Checkpoint Title"
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
                  "Revision",
                  "Assignment",
                  "Skill",
                  "Project",
                  "Exam",
                  "Practice",
                  "Other",
                ]}
              />

              <label className="block">
                <span className="text-sm text-slate-400">
                  Link Target
                </span>

                <select
                  value={form.target}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      target: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
                >
                  <option
                    value=""
                    className="bg-slate-900"
                  >
                    No linked target
                  </option>

                  {targets.map((target) => (
                    <option
                      key={target._id}
                      value={target._id}
                      className="bg-slate-900"
                    >
                      {target.title}
                    </option>
                  ))}
                </select>
              </label>

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
                onClick={handleCreateCheckpoint}
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

                Create Checkpoint
              </button>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Your Checkpoints
                </h2>

                <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {checkpoints.length} Checkpoints
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2
                    className="animate-spin text-cyan-400"
                    size={40}
                  />
                </div>
              ) : checkpoints.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
                  <ClipboardCheck
                    size={50}
                    className="mx-auto text-slate-600"
                  />

                  <h3 className="mt-4 text-xl font-bold text-white">
                    No Checkpoints Yet
                  </h3>

                  <p className="mt-2 text-slate-400">
                    Create your first measurable checkpoint.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {checkpoints.map((checkpoint) => (
                    <div
                      key={checkpoint._id}
                      className="rounded-3xl border border-white/10 bg-black/20 p-6"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-bold text-white">
                              {checkpoint.title}
                            </h3>

                            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                              {checkpoint.category}
                            </span>

                            {checkpoint.status ===
                              "Completed" && (
                              <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200">
                                <CheckCircle2 size={14} />
                                Completed
                              </span>
                            )}
                          </div>

                          <p className="mt-4 leading-7 text-slate-400">
                            {checkpoint.description ||
                              "No description"}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                              <Target size={16} />
                              Target:
                              {" "}
                              {checkpoint.target?.title ||
                                "Not linked"}
                            </div>

                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} />
                              Due:
                              {" "}
                              {checkpoint.dueDate
                                ? new Date(
                                    checkpoint.dueDate
                                  ).toLocaleDateString()
                                : "No date"}
                            </div>

                            <div>
                              Weight:
                              {" "}
                              {checkpoint.progressWeight || 0}%
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                checkpoint
                              )
                            }
                            className={`rounded-2xl px-4 py-3 font-semibold ${
                              checkpoint.status ===
                              "Completed"
                                ? "bg-yellow-500/20 text-yellow-200"
                                : "bg-green-500/20 text-green-200"
                            }`}
                          >
                            {checkpoint.status ===
                            "Completed"
                              ? "Mark Pending"
                              : "Complete"}
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                checkpoint._id
                              )
                            }
                            className="flex items-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 text-red-300 transition hover:bg-red-500/30"
                          >
                            <Trash2 size={18} />
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

export default Checkpoints