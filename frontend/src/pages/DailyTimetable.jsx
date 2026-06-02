import { useEffect, useMemo, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  Clock3,
  Plus,
  Trash2,
  Loader2,
  CalendarDays,
  BookOpen,
  Brain,
  Coffee,
  Code2,
  GraduationCap,
  Briefcase,
  User,
  Activity,
} from "lucide-react"

import {
  createTimetableBlock,
  getTimetableBlocks,
  deleteTimetableBlock,
} from "../services/api"

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Daily",
]

const categories = [
  "College",
  "Study",
  "Revision",
  "Skill",
  "Project",
  "Break",
  "Personal",
  "Other",
]

const categoryStyles = {
  College: {
    icon: GraduationCap,
    className: "bg-blue-500/20 text-blue-200 border-blue-400/20",
  },
  Study: {
    icon: BookOpen,
    className: "bg-cyan-500/20 text-cyan-200 border-cyan-400/20",
  },
  Revision: {
    icon: Brain,
    className: "bg-violet-500/20 text-violet-200 border-violet-400/20",
  },
  Skill: {
    icon: Code2,
    className: "bg-green-500/20 text-green-200 border-green-400/20",
  },
  Project: {
    icon: Briefcase,
    className: "bg-orange-500/20 text-orange-200 border-orange-400/20",
  },
  Break: {
    icon: Coffee,
    className: "bg-yellow-500/20 text-yellow-200 border-yellow-400/20",
  },
  Personal: {
    icon: User,
    className: "bg-pink-500/20 text-pink-200 border-pink-400/20",
  },
  Other: {
    icon: Activity,
    className: "bg-slate-500/20 text-slate-200 border-slate-400/20",
  },
}

function DailyTimetable() {
  const [blocks, setBlocks] = useState([])
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    category: "Study",
    subject: "",
    description: "",
    repeat: "None",
  })

  const fetchBlocks = async () => {
    try {
      setLoading(true)

      const data = await getTimetableBlocks()

      setBlocks(data.blocks || [])
    } catch (error) {
      console.log(error)
      alert(
        error.response?.data?.message ||
          "Failed to fetch timetable"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlocks()
  }, [])

  const selectedBlocks = useMemo(() => {
    return blocks
      .filter(
        (block) =>
          block.day === selectedDay ||
          block.day === "Daily"
      )
      .sort((a, b) =>
        String(a.startTime).localeCompare(
          String(b.startTime)
        )
      )
  }, [blocks, selectedDay])

  const todaySummary = useMemo(() => {
    const total = selectedBlocks.length
    const active = selectedBlocks.filter(
      (block) => block.isActive !== false
    ).length

    const college = selectedBlocks.filter(
      (block) => block.category === "College"
    ).length

    const study = selectedBlocks.filter(
      (block) =>
        block.category === "Study" ||
        block.category === "Revision"
    ).length

    const skills = selectedBlocks.filter(
      (block) => block.category === "Skill"
    ).length

    return {
      total,
      active,
      college,
      study,
      skills,
    }
  }, [selectedBlocks])

  const handleCreateBlock = async () => {
    try {
      if (
        !form.title ||
        !form.startTime ||
        !form.endTime
      ) {
        return alert(
          "Title, start time, and end time are required"
        )
      }

      if (form.endTime <= form.startTime) {
        return alert(
          "End time must be after start time"
        )
      }

      setSaving(true)

      await createTimetableBlock({
        title: form.title,
        day: form.day,
        startTime: form.startTime,
        endTime: form.endTime,
        category: form.category,
        subject: form.subject,
        description: form.description,
        repeat: form.repeat,
        isActive: true,
        aiGenerated: false,
      })

      setForm({
        title: "",
        day: selectedDay,
        startTime: "",
        endTime: "",
        category: "Study",
        subject: "",
        description: "",
        repeat: "None",
      })

      fetchBlocks()
    } catch (error) {
      console.log(error)
      alert(
        error.response?.data?.message ||
          "Failed to create timetable block"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTimetableBlock(id)
      fetchBlocks()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDayChange = (day) => {
    setSelectedDay(day)

    setForm((prev) => ({
      ...prev,
      day,
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-black">
                <Clock3 size={34} />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white">
                  Daily Timetable
                </h1>

                <p className="mt-2 max-w-3xl text-slate-400">
                  Visual time-block planner for college,
                  study, revision, skills, projects, breaks,
                  and personal routines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <SummaryCard label="Blocks" value={todaySummary.total} />
              <SummaryCard label="Active" value={todaySummary.active} />
              <SummaryCard label="Study" value={todaySummary.study} />
              <SummaryCard label="Skills" value={todaySummary.skills} />
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayChange(day)}
                className={`shrink-0 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  selectedDay === day
                    ? "bg-cyan-500 text-black"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Add Time Block
            </h2>

            <div className="space-y-5">
              <Input
                label="Block Title"
                value={form.title}
                onChange={(v) =>
                  setForm({
                    ...form,
                    title: v,
                  })
                }
              />

              <Select
                label="Day"
                value={form.day}
                onChange={(v) =>
                  setForm({
                    ...form,
                    day: v,
                  })
                }
                options={days}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  label="Start Time"
                  value={form.startTime}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      startTime: v,
                    })
                  }
                />

                <Input
                  type="time"
                  label="End Time"
                  value={form.endTime}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      endTime: v,
                    })
                  }
                />
              </div>

              <Select
                label="Category"
                value={form.category}
                onChange={(v) =>
                  setForm({
                    ...form,
                    category: v,
                  })
                }
                options={categories}
              />

              <Input
                label="Subject / Focus Area"
                value={form.subject}
                onChange={(v) =>
                  setForm({
                    ...form,
                    subject: v,
                  })
                }
              />

              <Select
                label="Repeat"
                value={form.repeat}
                onChange={(v) =>
                  setForm({
                    ...form,
                    repeat: v,
                  })
                }
                options={[
                  "None",
                  "Daily",
                  "Weekly",
                ]}
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

              <button
                type="button"
                onClick={handleCreateBlock}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-bold text-black"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                Add Block
              </button>
            </div>
          </section>

          <section className="xl:col-span-2">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedDay} Timeline
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Daily blocks are also shown here.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {selectedBlocks.length} Blocks
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2
                    className="animate-spin text-cyan-400"
                    size={42}
                  />
                </div>
              ) : selectedBlocks.length === 0 ? (
                <EmptyTimeline selectedDay={selectedDay} />
              ) : (
                <div className="relative space-y-5">
                  <div className="absolute left-6 top-0 h-full w-px bg-white/10" />

                  {selectedBlocks.map((block) => (
                    <TimelineBlock
                      key={block._id}
                      block={block}
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

function TimelineBlock({ block, onDelete }) {
  const style =
    categoryStyles[block.category] ||
    categoryStyles.Other

  const Icon = style.icon

  return (
    <div className="relative flex gap-5">
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-cyan-300">
        <Icon size={22} />
      </div>

      <div
        className={`flex-1 rounded-3xl border p-5 ${style.className}`}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-white">
                {block.title}
              </h3>

              <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold">
                {block.category}
              </span>

              {block.repeat !== "None" && (
                <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold">
                  {block.repeat}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-200">
              <span className="flex items-center gap-2">
                <Clock3 size={16} />
                {block.startTime} - {block.endTime}
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {block.day}
              </span>
            </div>

            {block.subject && (
              <p className="mt-3 font-semibold text-white">
                Focus: {block.subject}
              </p>
            )}

            {block.description && (
              <p className="mt-3 leading-6 text-slate-200">
                {block.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onDelete(block._id)}
            className="flex items-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 text-red-200 transition hover:bg-red-500/30"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyTimeline({ selectedDay }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
      <Clock3 size={54} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-2xl font-bold text-white">
        No blocks for {selectedDay}
      </h3>

      <p className="mt-2 text-slate-400">
        Add your first time block to build your daily routine.
      </p>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>
      <h3 className="mt-1 text-xl font-bold text-white">
        {value}
      </h3>
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
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <textarea
        rows="4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
        onChange={(e) => onChange(e.target.value)}
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

export default DailyTimetable