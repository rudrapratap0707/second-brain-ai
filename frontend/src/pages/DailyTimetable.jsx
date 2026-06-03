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
    className: "bg-blue-500/10 text-blue-200 border-blue-500/20",
  },
  Study: {
    icon: BookOpen,
    className: "bg-cyan-500/10 text-cyan-200 border-cyan-500/20",
  },
  Revision: {
    icon: Brain,
    className: "bg-violet-500/10 text-violet-200 border-violet-500/20",
  },
  Skill: {
    icon: Code2,
    className: "bg-green-500/10 text-green-200 border-green-500/20",
  },
  Project: {
    icon: Briefcase,
    className: "bg-orange-500/10 text-orange-200 border-orange-500/20",
  },
  Break: {
    icon: Coffee,
    className: "bg-yellow-500/10 text-yellow-200 border-yellow-500/20",
  },
  Personal: {
    icon: User,
    className: "bg-pink-500/10 text-pink-200 border-pink-500/20",
  },
  Other: {
    icon: Activity,
    className: "bg-slate-500/10 text-slate-200 border-slate-500/20",
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
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto px-1 sm:px-0">
        {/* Header Section */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-[24px] md:rounded-[32px] border border-white/5 bg-white/[0.04] p-4 sm:p-6 md:p-8 backdrop-blur-lg">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-500 text-black shrink-0 shadow-lg shadow-cyan-500/20">
                <Clock3 className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Daily Timetable
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  Visual time-block planner for college, study, routines, and personal breaks.
                </p>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:flex sm:items-center lg:justify-end w-full lg:w-auto border-t border-white/5 pt-4 lg:border-t-0 lg:pt-0">
              <SummaryCard label="Blocks" value={todaySummary.total} />
              <SummaryCard label="Active" value={todaySummary.active} />
              <SummaryCard label="Study" value={todaySummary.study} />
              <SummaryCard label="Skills" value={todaySummary.skills} />
            </div>
          </div>
        </section>

        {/* Horizontal Days Navigation */}
        <section className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.03] p-1.5 sm:p-2 backdrop-blur-md">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x snap-mandatory">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayChange(day)}
                className={`shrink-0 snap-tight rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 min-h-[40px] flex items-center justify-center ${
                  selectedDay === day
                    ? "bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/15"
                    : "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Form Side - Column Spans 4 on large screens */}
          <section className="lg:col-span-5 xl:col-span-4 rounded-2xl sm:rounded-[24px] border border-white/5 bg-white/[0.04] p-4 sm:p-6 backdrop-blur-lg lg:sticky lg:top-6">
            <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-white tracking-tight">
              Add Time Block
            </h2>

            <div className="space-y-4">
              <Input
                label="Block Title"
                placeholder="e.g., Learn Next.js Setup"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
              />

              <Select
                label="Day"
                value={form.day}
                onChange={(v) => setForm({ ...form, day: v })}
                options={days}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="time"
                  label="Start Time"
                  value={form.startTime}
                  onChange={(v) => setForm({ ...form, startTime: v })}
                />
                <Input
                  type="time"
                  label="End Time"
                  value={form.endTime}
                  onChange={(v) => setForm({ ...form, endTime: v })}
                />
              </div>

              <Select
                label="Category"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                options={categories}
              />

              <Input
                label="Subject / Focus Area"
                placeholder="e.g., Web Development"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
              />

              <Select
                label="Repeat"
                value={form.repeat}
                onChange={(v) => setForm({ ...form, repeat: v })}
                options={["None", "Daily", "Weekly"]}
              />

              <Textarea
                label="Description"
                placeholder="Add secondary sub-tasks or goals..."
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
              />

              <button
                type="button"
                onClick={handleCreateBlock}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-cyan-500 px-4 py-3 sm:py-3.5 text-sm font-bold text-black shadow-lg shadow-cyan-500/10 hover:bg-cyan-400 active:scale-[0.99] transition duration-150 disabled:opacity-50 min-h-[48px]"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                Add Block
              </button>
            </div>
          </section>

          {/* Timeline View Side - Column Spans 8 on large screens */}
          <section className="lg:col-span-7 xl:col-span-8">
            <div className="rounded-2xl sm:rounded-[24px] border border-white/5 bg-white/[0.04] p-4 sm:p-6 backdrop-blur-lg">
              <div className="mb-5 sm:mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {selectedDay} Timeline
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Includes direct & global daily events.
                  </p>
                </div>

                <div className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-slate-300">
                  {selectedBlocks.length} {selectedBlocks.length === 1 ? 'Block' : 'Blocks'}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-16 sm:py-24">
                  <Loader2 className="animate-spin text-cyan-400" size={32} />
                </div>
              ) : selectedBlocks.length === 0 ? (
                <EmptyTimeline selectedDay={selectedDay} />
              ) : (
                <div className="relative space-y-4 sm:space-y-5 pl-1">
                  {/* Vertical Timeline Thread Line */}
                  <div className="absolute left-5 sm:left-6 top-2 h-[calc(100%-16px)] w-px bg-white/10 pointer-events-none" />

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
  const style = categoryStyles[block.category] || categoryStyles.Other
  const Icon = style.icon

  return (
    <div className="relative flex gap-3 sm:gap-4 items-start group">
      {/* Icon Node Badge */}
      <div className="relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950 text-cyan-400 shadow-md">
        <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
      </div>

      {/* Main Content Block Node */}
      <div className={`flex-1 rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:bg-white/[0.02] ${style.className}`}>
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {block.title}
              </h3>

              <div className="flex flex-wrap gap-1">
                <span className="rounded-md bg-black/30 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-slate-300">
                  {block.category}
                </span>

                {block.repeat !== "None" && (
                  <span className="rounded-md bg-black/30 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-cyan-300">
                    {block.repeat}
                  </span>
                )}
              </div>
            </div>

            {/* Time / Info Meta Chips */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock3 size={14} className="text-slate-400" />
                {block.startTime} - {block.endTime}
              </span>

              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-slate-400" />
                {block.day}
              </span>
            </div>

            {block.subject && (
              <p className="text-xs sm:text-sm font-semibold text-white/90 pt-0.5">
                <span className="text-slate-400 font-normal">Focus:</span> {block.subject}
              </p>
            )}

            {block.description && (
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 pt-1 max-w-xl whitespace-pre-line">
                {block.description}
              </p>
            )}
          </div>

          {/* Action Area */}
          <div className="flex md:self-start justify-end border-t border-white/5 pt-3 md:border-t-0 md:pt-0 shrink-0">
            <button
              type="button"
              onClick={() => onDelete(block._id)}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 transition-colors w-full sm:w-auto min-h-[36px]"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyTimeline({ selectedDay }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 sm:p-12 text-center max-w-md mx-auto my-4">
      <Clock3 size={40} className="mx-auto text-slate-500 opacity-60" />
      <h3 className="mt-4 text-base sm:text-lg font-bold text-white">
        No blocks for {selectedDay}
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
        Add your first time block to build your daily routine workspace.
      </p>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 px-3 py-2 sm:px-4 sm:py-2.5 min-w-[75px] sm:min-w-[100px] text-center sm:text-left">
      <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="mt-0.5 text-base sm:text-lg font-bold text-white">
        {value}
      </h3>
    </div>
  )
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/5 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition min-h-[44px]"
      />
    </label>
  )
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <textarea
        rows="3"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-xl border border-white/5 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/5 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition min-h-[44px]"
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

export default DailyTimetable