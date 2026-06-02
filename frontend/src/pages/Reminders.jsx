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
  CalendarDays,
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
} from "lucide-react"

const priorityOptions = [
  {
    label: "Low",
    value: "Low",
    description: "Light task",
  },
  {
    label: "Medium",
    value: "Medium",
    description: "Normal priority",
  },
  {
    label: "High",
    value: "High",
    description: "Important task",
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
      setError("Please select due date and time.")
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

      setSuccess("Reminder added successfully.")

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
      setError("Failed to update reminder.")
    }
  }

  const handleDeleteReminder = async (id) => {
    try {
      await deleteReminder(id)

      fetchReminders()
    } catch (error) {
      console.log(error)
      setError("Failed to delete reminder.")
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

  const todayReminders = useMemo(() => {
    return reminders.filter((item) => isDueToday(item))
  }, [reminders])

  const highPriorityReminders = useMemo(() => {
    return reminders.filter(
      (item) => item.priority === "High" && !item.completed
    )
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
        label: "Due Today",
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

    return new Date(dateValue).toLocaleString()
  }

  const getProductivityInsight = () => {
    if (reminders.length === 0) {
      return "Add your first reminder to start planning your tasks and deadlines."
    }

    if (overdueReminders.length > 0) {
      return `You have ${overdueReminders.length} overdue reminder(s). Clear them first to reduce pressure.`
    }

    if (highPriorityReminders.length > 0) {
      return `You have ${highPriorityReminders.length} high-priority pending task(s). Focus on them first.`
    }

    if (todayReminders.length > 0) {
      return `You have ${todayReminders.length} reminder(s) scheduled for today. Stay consistent.`
    }

    if (completionRate >= 70) {
      return "Great progress. Your reminder completion rate is strong."
    }

    return "Your reminder board is active. Keep updating tasks regularly."
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4">
              <Bell className="text-cyan-400" size={44} />

              <h1 className="text-5xl font-bold">
                Reminders
              </h1>
            </div>

            <p className="text-slate-400 mt-4 text-lg">
              Plan your tasks, deadlines, study targets, and priority reminders.
            </p>
          </div>

          <button
            onClick={fetchReminders}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-400/20 text-red-300 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
            <span>{error}</span>

            <button onClick={() => setError("")}>
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-400/20 text-green-300 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
            <span>{success}</span>

            <button onClick={() => setSuccess("")}>
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400">
                Total
              </h3>

              <ClipboardList className="text-cyan-400" size={24} />
            </div>

            <p className="text-5xl font-bold mt-4">
              {reminders.length}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400">
                Pending
              </h3>

              <ListTodo className="text-yellow-400" size={24} />
            </div>

            <p className="text-5xl font-bold mt-4">
              {pendingReminders.length}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400">
                Completed
              </h3>

              <CheckCircle2 className="text-green-400" size={24} />
            </div>

            <p className="text-5xl font-bold mt-4">
              {completedReminders.length}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400">
                Overdue
              </h3>

              <AlertTriangle className="text-red-400" size={24} />
            </div>

            <p className="text-5xl font-bold mt-4">
              {overdueReminders.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="space-y-6">
            <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="text-cyan-400" size={28} />

                <h2 className="text-3xl font-bold">
                  Add Reminder
                </h2>
              </div>

              <form onSubmit={handleCreateReminder}>
                <label className="text-slate-300 font-medium">
                  Reminder Title
                </label>

                <input
                  type="text"
                  placeholder="Example: Revise Python Module 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500 mb-5"
                />

                <label className="text-slate-300 font-medium">
                  Description
                </label>

                <textarea
                  placeholder="Optional details about this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="5"
                  className="w-full mt-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500 resize-none mb-5"
                />

                <label className="text-slate-300 font-medium">
                  Due Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full mt-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white mb-5"
                />

                <label className="text-slate-300 font-medium">
                  Priority
                </label>

                <div className="grid grid-cols-3 gap-3 mt-3 mb-6">
                  {priorityOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setPriority(item.value)}
                      className={`rounded-2xl px-4 py-4 border transition ${
                        priority === item.value
                          ? "bg-cyan-500 text-black border-cyan-400"
                          : "bg-white/10 border-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      <p className="font-bold">
                        {item.label}
                      </p>

                      <p
                        className={`text-xs mt-1 ${
                          priority === item.value
                            ? "text-black/70"
                            : "text-slate-400"
                        }`}
                      >
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 flex-1 px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Plus size={20} />
                    )}

                    {saving
                      ? "Adding..."
                      : "Add Reminder"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-[32px] p-8">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="text-cyan-300" size={28} />

                <h2 className="text-3xl font-bold text-cyan-300">
                  Productivity Insight
                </h2>
              </div>

              <p className="text-slate-200 leading-relaxed">
                {getProductivityInsight()}
              </p>

              <div className="mt-6 bg-black/20 border border-white/5 rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Completion Rate
                  </span>

                  <span className="text-2xl font-bold text-cyan-300">
                    {completionRate}%
                  </span>
                </div>

                <div className="w-full h-3 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{
                      width: `${completionRate}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
              <div>
                <h2 className="text-3xl font-bold">
                  Reminder List
                </h2>

                <p className="text-slate-400 mt-2">
                  View, complete, filter, and delete reminders.
                </p>
              </div>

              {loading && (
                <Loader2 className="animate-spin text-cyan-400" size={28} />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-slate-400 text-sm flex items-center gap-2 mb-2">
                  <Filter size={16} />
                  Status Filter
                </label>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-[#11162A] border border-white/10 rounded-2xl px-4 py-3 outline-none text-white"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Today</option>
                  <option>Overdue</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-sm flex items-center gap-2 mb-2">
                  <Flag size={16} />
                  Priority Filter
                </label>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full bg-[#11162A] border border-white/10 rounded-2xl px-4 py-3 outline-none text-white"
                >
                  <option>All</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="border border-dashed border-white/20 rounded-2xl p-10 text-center text-slate-400">
                Loading reminders...
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="border border-dashed border-white/20 rounded-2xl p-12 text-center text-slate-400">
                <TimerReset size={60} className="mx-auto text-slate-500 mb-5" />

                <h3 className="text-2xl font-bold text-white mb-3">
                  No Reminders Found
                </h3>

                <p>
                  Add a new reminder or change filters to see your tasks.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[720px] overflow-y-auto pr-2">
                {filteredReminders.map((reminder) => {
                  const status = getReminderStatus(reminder)

                  return (
                    <div
                      key={reminder._id}
                      className={`rounded-3xl p-5 border transition ${
                        reminder.completed
                          ? "bg-green-500/5 border-green-400/20"
                          : isOverdue(reminder)
                          ? "bg-red-500/5 border-red-400/20"
                          : "bg-white/10 border-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() =>
                              handleToggleReminder(reminder._id)
                            }
                            className="mt-1"
                          >
                            {reminder.completed ? (
                              <CheckCircle2
                                className="text-green-400"
                                size={28}
                              />
                            ) : (
                              <Circle
                                className="text-slate-400 hover:text-cyan-400"
                                size={28}
                              />
                            )}
                          </button>

                          <div>
                            <h3
                              className={`text-2xl font-bold ${
                                reminder.completed
                                  ? "line-through text-slate-400"
                                  : "text-white"
                              }`}
                            >
                              {reminder.title}
                            </h3>

                            {reminder.description && (
                              <p className="text-slate-400 mt-2 whitespace-pre-line">
                                {reminder.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 mt-4">
                              <span
                                className={`text-xs px-3 py-1 rounded-full border ${status.className}`}
                              >
                                {status.label}
                              </span>

                              <span
                                className={`text-xs px-3 py-1 rounded-full border ${getPriorityClass(
                                  reminder.priority
                                )}`}
                              >
                                {reminder.priority} Priority
                              </span>

                              <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 flex items-center gap-2">
                                <Clock3 size={13} />
                                {formatDateTime(reminder.dueDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleDeleteReminder(reminder._id)
                          }
                          className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 transition px-5 py-3 rounded-2xl text-white font-medium"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <Target className="text-cyan-400" size={24} />
              <h3 className="text-xl font-bold">
                Today&apos;s Focus
              </h3>
            </div>

            <p className="text-slate-400 mt-4">
              {todayReminders.length > 0
                ? `You have ${todayReminders.length} reminder(s) scheduled today.`
                : "No reminders scheduled for today."}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <Flag className="text-red-400" size={24} />
              <h3 className="text-xl font-bold">
                High Priority
              </h3>
            </div>

            <p className="text-slate-400 mt-4">
              {highPriorityReminders.length > 0
                ? `${highPriorityReminders.length} high-priority task(s) need attention.`
                : "No high-priority pending reminders."}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" size={24} />
              <h3 className="text-xl font-bold">
                Completion
              </h3>
            </div>

            <p className="text-slate-400 mt-4">
              {completionRate}% of your reminders are completed.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Reminders