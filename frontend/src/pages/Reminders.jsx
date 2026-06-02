import { useEffect, useMemo, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  createReminder,
  getReminders,
  toggleReminder,
  deleteReminder,
} from "../services/authService"

import {
  Bell,
  Plus,
  Clock3,
  Trash2,
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  Flag,
  ListTodo,
  Target,
  Sparkles,
  X,
  RefreshCcw,
  Filter,
  TimerReset,
  ClipboardList,
  CalendarDays,
} from "lucide-react"

const priorityOptions = [
  {
    label: "Low",
    value: "Low",
  },
  {
    label: "Medium",
    value: "Medium",
  },
  {
    label: "High",
    value: "High",
  },
]

function Reminders() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("Medium")

  const [reminders, setReminders] = useState([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [filter, setFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")

  const fetchReminders = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getReminders()

      setReminders(data.reminders || [])
    } catch (error) {
      console.log(error)
      setError("Failed to load reminders.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDueDate("")
    setPriority("Medium")
  }

  const handleCreateReminder = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Please enter reminder title.")
      return
    }

    if (!dueDate) {
      setError("Please select due date.")
      return
    }

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      await createReminder({
        title,
        description,
        dueDate,
        priority,
      })

      resetForm()

      setSuccess("Reminder created successfully.")

      fetchReminders()
    } catch (error) {
      console.log(error)
      setError("Failed to create reminder.")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleReminder = async (id) => {
    try {
      await toggleReminder(id)
      fetchReminders()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteReminder = async (id) => {
    try {
      await deleteReminder(id)
      fetchReminders()
    } catch (error) {
      console.log(error)
    }
  }

  const isOverdue = (reminder) => {
    if (reminder.completed) return false

    return new Date(reminder.dueDate) < new Date()
  }

  const isDueToday = (reminder) => {
    const today = new Date()
    const due = new Date(reminder.dueDate)

    return (
      today.getFullYear() === due.getFullYear() &&
      today.getMonth() === due.getMonth() &&
      today.getDate() === due.getDate()
    )
  }

  const pendingReminders = useMemo(() => {
    return reminders.filter((item) => !item.completed)
  }, [reminders])

  const completedReminders = useMemo(() => {
    return reminders.filter((item) => item.completed)
  }, [reminders])

  const overdueReminders = useMemo(() => {
    return reminders.filter((item) => isOverdue(item))
  }, [reminders])

  const completionRate = useMemo(() => {
    if (reminders.length === 0) return 0

    return Math.round(
      (completedReminders.length / reminders.length) * 100
    )
  }, [reminders, completedReminders])

  const filteredReminders = useMemo(() => {
    let list = reminders

    if (filter === "Pending") {
      list = list.filter((item) => !item.completed)
    }

    if (filter === "Completed") {
      list = list.filter((item) => item.completed)
    }

    if (filter === "Today") {
      list = list.filter((item) => isDueToday(item))
    }

    if (filter === "Overdue") {
      list = list.filter((item) => isOverdue(item))
    }

    if (priorityFilter !== "All") {
      list = list.filter(
        (item) => item.priority === priorityFilter
      )
    }

    return list
  }, [reminders, filter, priorityFilter])

  const getPriorityClass = (priorityValue) => {
    if (priorityValue === "High") {
      return "bg-red-500/10 border-red-400/20 text-red-300"
    }

    if (priorityValue === "Medium") {
      return "bg-yellow-500/10 border-yellow-400/20 text-yellow-300"
    }

    return "bg-green-500/10 border-green-400/20 text-green-300"
  }

  const getReminderStatus = (reminder) => {
    if (reminder.completed) {
      return {
        label: "Completed",
        className:
          "bg-green-500/10 border-green-400/20 text-green-300",
      }
    }

    if (isOverdue(reminder)) {
      return {
        label: "Overdue",
        className:
          "bg-red-500/10 border-red-400/20 text-red-300",
      }
    }

    if (isDueToday(reminder)) {
      return {
        label: "Today",
        className:
          "bg-cyan-500/10 border-cyan-400/20 text-cyan-300",
      }
    }

    return {
      label: "Pending",
      className:
        "bg-white/10 border-white/10 text-slate-300",
    }
  }

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "No date"

    return new Date(dateValue).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-7xl space-y-5 md:space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 md:h-16 md:w-16">
                <Bell size={34} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl md:text-5xl">
                  Reminders
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Manage deadlines, tasks, study goals, and daily reminders.
                </p>
              </div>
            </div>

            <button
              onClick={fetchReminders}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20 sm:w-fit"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>
          </div>
        </section>

        {error && (
          <AlertBox
            type="error"
            text={error}
            onClose={() => setError("")}
          />
        )}

        {success && (
          <AlertBox
            type="success"
            text={success}
            onClose={() => setSuccess("")}
          />
        )}

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MiniStat
            title="Total"
            value={reminders.length}
            icon={ClipboardList}
          />

          <MiniStat
            title="Pending"
            value={pendingReminders.length}
            icon={ListTodo}
          />

          <MiniStat
            title="Completed"
            value={completedReminders.length}
            icon={CheckCircle2}
          />

          <MiniStat
            title="Overdue"
            value={overdueReminders.length}
            icon={AlertTriangle}
          />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Plus className="text-cyan-400" size={24} />

                <h2 className="text-xl font-bold text-white md:text-2xl">
                  Add Reminder
                </h2>
              </div>

              <form
                onSubmit={handleCreateReminder}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Reminder title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
                />

                <textarea
                  placeholder="Description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
                />

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                    <CalendarDays size={16} />
                    Due Date
                  </label>

                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none md:text-base"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {priorityOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setPriority(item.value)}
                      className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        priority === item.value
                          ? "border-cyan-400 bg-cyan-500 text-black"
                          : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Plus size={18} />
                    )}

                    {saving ? "Adding..." : "Add Reminder"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <Sparkles className="text-cyan-300" size={22} />

                <h2 className="text-xl font-bold text-cyan-300 md:text-2xl">
                  Productivity Insight
                </h2>
              </div>

              <p className="text-sm leading-7 text-slate-200 md:text-base">
                {completionRate >= 70
                  ? "Your reminder completion rate is strong. Keep maintaining consistency."
                  : "Complete pending tasks regularly to improve productivity."}
              </p>

              <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Completion Rate
                  </span>

                  <span className="text-xl font-bold text-cyan-300 md:text-2xl">
                    {completionRate}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{
                      width: `${completionRate}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  Reminder List
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {filteredReminders.length} reminder(s)
                </p>
              </div>

              {loading && (
                <Loader2
                  className="animate-spin text-cyan-400"
                  size={24}
                />
              )}
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#11162A] px-4 py-3 text-sm outline-none"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Today</option>
                <option>Overdue</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="rounded-2xl border border-white/10 bg-[#11162A] px-4 py-3 text-sm outline-none"
              >
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-slate-400">
                Loading reminders...
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center">
                <TimerReset
                  size={52}
                  className="mx-auto mb-5 text-slate-500"
                />

                <h3 className="mb-3 text-2xl font-bold text-white">
                  No Reminders Found
                </h3>

                <p className="text-sm text-slate-400 md:text-base">
                  Add a reminder or change filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReminders.map((reminder) => {
                  const status =
                    getReminderStatus(reminder)

                  return (
                    <ReminderCard
                      key={reminder._id}
                      reminder={reminder}
                      status={status}
                      getPriorityClass={getPriorityClass}
                      formatDateTime={formatDateTime}
                      handleDeleteReminder={
                        handleDeleteReminder
                      }
                      handleToggleReminder={
                        handleToggleReminder
                      }
                    />
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <BottomCard
            icon={Target}
            title="Today's Focus"
            text={`${
              reminders.filter((item) =>
                isDueToday(item)
              ).length
            } reminder(s) scheduled today.`}
          />

          <BottomCard
            icon={Flag}
            title="High Priority"
            text={`${
              reminders.filter(
                (item) =>
                  item.priority === "High" &&
                  !item.completed
              ).length
            } high-priority task(s) pending.`}
          />

          <BottomCard
            icon={CheckCircle2}
            title="Completion"
            text={`${completionRate}% reminders completed.`}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm text-slate-400">{title}</h3>

        <Icon size={22} className="text-cyan-400" />
      </div>

      <p className="text-2xl font-bold text-white md:text-4xl">
        {value}
      </p>
    </div>
  )
}

function ReminderCard({
  reminder,
  status,
  getPriorityClass,
  formatDateTime,
  handleDeleteReminder,
  handleToggleReminder,
}) {
  return (
    <div
      className={`rounded-3xl border p-4 transition md:p-5 ${
        reminder.completed
          ? "border-green-400/20 bg-green-500/5"
          : "border-white/10 bg-white/10 hover:bg-white/15"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={() =>
              handleToggleReminder(reminder._id)
            }
            className="mt-1"
          >
            {reminder.completed ? (
              <CheckCircle2
                className="text-green-400"
                size={24}
              />
            ) : (
              <Circle
                className="text-slate-400 hover:text-cyan-400"
                size={24}
              />
            )}
          </button>

          <div className="min-w-0">
            <h3
              className={`text-lg font-bold md:text-xl ${
                reminder.completed
                  ? "text-slate-400 line-through"
                  : "text-white"
              }`}
            >
              {reminder.title}
            </h3>

            {reminder.description && (
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-400">
                {reminder.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs ${status.className}`}
              >
                {status.label}
              </span>

              <span
                className={`rounded-full border px-3 py-1 text-xs ${getPriorityClass(
                  reminder.priority
                )}`}
              >
                {reminder.priority}
              </span>

              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-300">
                <Clock3 size={12} />
                {formatDateTime(reminder.dueDate)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            handleDeleteReminder(reminder._id)
          }
          className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  )
}

function BottomCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <Icon className="text-cyan-400" size={22} />

        <h3 className="text-lg font-bold text-white">
          {title}
        </h3>
      </div>

      <p className="text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  )
}

function AlertBox({ type, text, onClose }) {
  const styles =
    type === "error"
      ? "bg-red-500/10 border-red-400/20 text-red-300"
      : "bg-green-500/10 border-green-400/20 text-green-300"

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 ${styles}`}
    >
      <span className="text-sm md:text-base">
        {text}
      </span>

      <button onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  )
}

export default Reminders