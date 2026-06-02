import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  CalendarDays,
  Plus,
  Trash2,
  Loader2,
  BookOpen,
  AlertCircle,
  TrendingUp,
} from "lucide-react"

import {
  createExam,
  getExams,
  updateExam,
  deleteExam,
} from "../services/api"

function ExamSchedule() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    subject: "",
    subjectCode: "",
    examType: "External",
    examDate: "",
    syllabusStatus: "Not Started",
    preparationLevel: 0,
    priority: "Medium",
    notes: "",
  })

  const fetchExams = async () => {
    try {
      setLoading(true)

      const data = await getExams()

      setExams(data.exams || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const handleCreateExam = async () => {
    try {
      if (!form.subject || !form.examDate) {
        return alert("Subject and exam date required")
      }

      setSaving(true)

      await createExam({
        subject: form.subject,
        subjectCode: form.subjectCode,
        examType: form.examType,
        examDate: form.examDate,
        syllabusStatus: form.syllabusStatus,
        preparationLevel: Number(
          form.preparationLevel || 0
        ),
        priority: form.priority,
        notes: form.notes,
      })

      setForm({
        subject: "",
        subjectCode: "",
        examType: "External",
        examDate: "",
        syllabusStatus: "Not Started",
        preparationLevel: 0,
        priority: "Medium",
        notes: "",
      })

      fetchExams()
    } catch (error) {
      console.log(error)
      alert(
        error.response?.data?.message ||
          "Failed to create exam"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteExam(id)
      fetchExams()
    } catch (error) {
      console.log(error)
    }
  }

  const handlePreparationUpdate = async (
    exam,
    value
  ) => {
    try {
      await updateExam(exam._id, {
        preparationLevel: Number(value),
        syllabusStatus:
          Number(value) >= 100
            ? "Completed"
            : Number(value) > 0
            ? "In Progress"
            : "Not Started",
      })

      fetchExams()
    } catch (error) {
      console.log(error)
    }
  }

  const getDaysLeft = (dateValue) => {
    const today = new Date()
    const examDate = new Date(dateValue)

    today.setHours(0, 0, 0, 0)
    examDate.setHours(0, 0, 0, 0)

    const diff = examDate - today

    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="rounded-[32px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-black">
              <CalendarDays size={34} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                Exam Schedule
              </h1>

              <p className="mt-2 text-slate-400">
                Track exam dates, syllabus status, priority, and preparation level.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Add New Exam
            </h2>

            <div className="space-y-5">
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
                label="Subject Code"
                value={form.subjectCode}
                onChange={(v) =>
                  setForm({
                    ...form,
                    subjectCode: v,
                  })
                }
              />

              <Select
                label="Exam Type"
                value={form.examType}
                onChange={(v) =>
                  setForm({
                    ...form,
                    examType: v,
                  })
                }
                options={[
                  "Internal",
                  "External",
                  "Practical",
                  "Viva",
                  "Assignment",
                  "Quiz",
                  "Other",
                ]}
              />

              <Input
                type="date"
                label="Exam Date"
                value={form.examDate}
                onChange={(v) =>
                  setForm({
                    ...form,
                    examDate: v,
                  })
                }
              />

              <Select
                label="Syllabus Status"
                value={form.syllabusStatus}
                onChange={(v) =>
                  setForm({
                    ...form,
                    syllabusStatus: v,
                  })
                }
                options={[
                  "Not Started",
                  "In Progress",
                  "Completed",
                  "Revision Needed",
                ]}
              />

              <Input
                type="number"
                label="Preparation Level %"
                value={form.preparationLevel}
                onChange={(v) =>
                  setForm({
                    ...form,
                    preparationLevel: v,
                  })
                }
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

              <Textarea
                label="Notes"
                value={form.notes}
                onChange={(v) =>
                  setForm({
                    ...form,
                    notes: v,
                  })
                }
              />

              <button
                onClick={handleCreateExam}
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

                Add Exam
              </button>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Your Exams
                </h2>

                <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {exams.length} Exams
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2
                    className="animate-spin text-cyan-400"
                    size={40}
                  />
                </div>
              ) : exams.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
                  <CalendarDays
                    size={50}
                    className="mx-auto text-slate-600"
                  />

                  <h3 className="mt-4 text-xl font-bold text-white">
                    No Exams Yet
                  </h3>

                  <p className="mt-2 text-slate-400">
                    Add your first exam schedule.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {exams.map((exam) => {
                    const daysLeft = getDaysLeft(
                      exam.examDate
                    )

                    return (
                      <div
                        key={exam._id}
                        className="rounded-3xl border border-white/10 bg-black/20 p-6"
                      >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-2xl font-bold text-white">
                                {exam.subject}
                              </h3>

                              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                                {exam.examType}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  exam.priority === "High"
                                    ? "bg-red-500/20 text-red-200"
                                    : exam.priority === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-200"
                                    : "bg-green-500/20 text-green-200"
                                }`}
                              >
                                {exam.priority}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  daysLeft < 0
                                    ? "bg-slate-500/20 text-slate-300"
                                    : daysLeft <= 3
                                    ? "bg-red-500/20 text-red-200"
                                    : daysLeft <= 7
                                    ? "bg-yellow-500/20 text-yellow-200"
                                    : "bg-green-500/20 text-green-200"
                                }`}
                              >
                                {daysLeft < 0
                                  ? "Exam Passed"
                                  : `${daysLeft} days left`}
                              </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Info
                                icon={BookOpen}
                                label="Subject Code"
                                value={
                                  exam.subjectCode ||
                                  "No code"
                                }
                              />

                              <Info
                                icon={CalendarDays}
                                label="Exam Date"
                                value={new Date(
                                  exam.examDate
                                ).toLocaleDateString()}
                              />

                              <Info
                                icon={TrendingUp}
                                label="Preparation"
                                value={`${
                                  exam.preparationLevel ||
                                  0
                                }%`}
                              />

                              <Info
                                icon={AlertCircle}
                                label="Syllabus"
                                value={
                                  exam.syllabusStatus
                                }
                              />
                            </div>

                            {exam.notes && (
                              <p className="mt-5 leading-7 text-slate-400">
                                {exam.notes}
                              </p>
                            )}

                            <div className="mt-5">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={
                                  exam.preparationLevel || 0
                                }
                                onChange={(e) =>
                                  handlePreparationUpdate(
                                    exam,
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handleDelete(exam._id)
                            }
                            className="flex items-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 text-red-300 transition hover:bg-red-500/30"
                          >
                            <Trash2 size={18} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <span className="text-sm">{label}</span>
      </div>

      <p className="mt-2 font-semibold text-white">
        {value}
      </p>
    </div>
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

export default ExamSchedule