import { useEffect, useMemo, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  createMood,
  getMoods,
  deleteMood,
} from "../services/authService"

import {
  Smile,
  Target,
  Meh,
  Flame,
  Frown,
  Moon,
  Trash2,
  Brain,
  BarChart3,
  CalendarDays,
  Sparkles,
  Loader2,
  Save,
  X,
  HeartPulse,
} from "lucide-react"

const moodOptions = [
  {
    label: "Happy",
    emoji: "😊",
    score: 5,
    icon: Smile,
  },
  {
    label: "Focused",
    emoji: "🎯",
    score: 4,
    icon: Target,
  },
  {
    label: "Neutral",
    emoji: "😐",
    score: 3,
    icon: Meh,
  },
  {
    label: "Stressed",
    emoji: "🔥",
    score: 2,
    icon: Flame,
  },
  {
    label: "Sad",
    emoji: "😔",
    score: 1,
    icon: Frown,
  },
  {
    label: "Tired",
    emoji: "😴",
    score: 2,
    icon: Moon,
  },
]

function Mood() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState("")
  const [moods, setMoods] = useState([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchMoods = async () => {
    try {
      setLoading(true)

      const data = await getMoods()

      setMoods(data.moods || [])
    } catch (error) {
      console.log(error)
      setError("Failed to load moods.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMoods()
  }, [])

  const handleSaveMood = async () => {
    if (!selectedMood) {
      setError("Please select a mood.")
      return
    }

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      await createMood({
        mood: selectedMood.label,
        score: selectedMood.score,
        note,
      })

      setSelectedMood(null)
      setNote("")

      setSuccess("Mood saved successfully.")

      fetchMoods()
    } catch (error) {
      console.log(error)
      setError("Failed to save mood.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMood = async (id) => {
    try {
      await deleteMood(id)
      fetchMoods()
    } catch (error) {
      console.log(error)
    }
  }

  const clearSelection = () => {
    setSelectedMood(null)
    setNote("")
    setError("")
    setSuccess("")
  }

  const averageScore = useMemo(() => {
    if (moods.length === 0) return 0

    const total = moods.reduce(
      (sum, item) => sum + Number(item.score || 0),
      0
    )

    return (total / moods.length).toFixed(1)
  }, [moods])

  const moodCounts = useMemo(() => {
    const counts = {}

    moods.forEach((item) => {
      counts[item.mood] = (counts[item.mood] || 0) + 1
    })

    return counts
  }, [moods])

  const mostFrequentMood = useMemo(() => {
    const entries = Object.entries(moodCounts)

    if (entries.length === 0) return "No data"

    entries.sort((a, b) => b[1] - a[1])

    return entries[0][0]
  }, [moodCounts])

  const latestMood = moods[0]

  const getMoodEmoji = (moodName) => {
    const found = moodOptions.find(
      (item) => item.label === moodName
    )

    return found?.emoji || "🙂"
  }

  const getMoodBadgeClass = (score) => {
    if (score >= 5) {
      return "bg-green-500/10 border-green-400/20 text-green-300"
    }

    if (score >= 4) {
      return "bg-cyan-500/10 border-cyan-400/20 text-cyan-300"
    }

    if (score >= 3) {
      return "bg-yellow-500/10 border-yellow-400/20 text-yellow-300"
    }

    if (score >= 2) {
      return "bg-orange-500/10 border-orange-400/20 text-orange-300"
    }

    return "bg-red-500/10 border-red-400/20 text-red-300"
  }

  const getInsight = () => {
    if (moods.length === 0) {
      return "Start tracking your mood daily."
    }

    if (averageScore >= 4) {
      return "Your recent mood trend looks positive."
    }

    if (averageScore >= 3) {
      return "Your mood is balanced and stable."
    }

    return "Your mood trend seems low. Take rest and avoid overload."
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
                <HeartPulse size={34} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl md:text-5xl">
                  Mood Tracker
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Track your emotions and monitor mental wellness daily.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
              <p className="text-xs text-slate-400 md:text-sm">
                Today's Mood
              </p>

              <h2 className="mt-2 text-xl font-bold md:text-3xl">
                {latestMood
                  ? `${getMoodEmoji(latestMood.mood)} ${latestMood.mood}`
                  : "Not logged"}
              </h2>
            </div>
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

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <MiniStat
            title="Entries"
            value={moods.length}
            icon={CalendarDays}
          />

          <MiniStat
            title="Average"
            value={averageScore}
            icon={BarChart3}
          />

          <MiniStat
            title="Frequent"
            value={mostFrequentMood}
            icon={Brain}
          />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles
                className="text-cyan-400"
                size={24}
              />

              <h2 className="text-xl font-bold text-white md:text-2xl">
                How are you feeling?
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {moodOptions.map((moodItem) => {
                const Icon = moodItem.icon

                const isActive =
                  selectedMood?.label === moodItem.label

                return (
                  <button
                    key={moodItem.label}
                    onClick={() =>
                      setSelectedMood(moodItem)
                    }
                    className={`rounded-3xl border p-4 text-left transition ${
                      isActive
                        ? "border-cyan-400 bg-cyan-500 text-black"
                        : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">
                        {moodItem.emoji}
                      </span>

                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-black"
                            : "text-cyan-400"
                        }
                      />
                    </div>

                    <h3 className="mt-3 text-sm font-bold md:text-base">
                      {moodItem.label}
                    </h3>

                    <p
                      className={`mt-2 text-xs ${
                        isActive
                          ? "text-black/70"
                          : "text-slate-400"
                      }`}
                    >
                      Score {moodItem.score}/5
                    </p>
                  </button>
                )
              })}
            </div>

            <div className="mt-6">
              <label className="text-sm text-slate-300">
                Note
              </label>

              <textarea
                placeholder="Write how you feel..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="5"
                className="mt-3 w-full resize-none rounded-3xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
              />
            </div>

            {selectedMood && (
              <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                <p className="text-sm text-cyan-300">
                  Selected Mood
                </p>

                <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                  {selectedMood.emoji}{" "}
                  {selectedMood.label}
                </h3>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleSaveMood}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={18} />
                )}

                {saving ? "Saving..." : "Save Mood"}
              </button>

              <button
                onClick={clearSelection}
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Brain
                  className="text-purple-400"
                  size={24}
                />

                <h2 className="text-xl font-bold text-white md:text-2xl">
                  AI Mood Insight
                </h2>
              </div>

              <div className="rounded-3xl border border-white/5 bg-black/20 p-4">
                <p className="text-sm leading-7 text-slate-300 md:text-base">
                  {getInsight()}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
              <h3 className="mb-4 text-lg font-bold text-white">
                Mood Distribution
              </h3>

              <div className="space-y-3">
                {moodOptions.map((item) => {
                  const count =
                    moodCounts[item.label] || 0

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
                    >
                      <span className="text-sm">
                        {item.emoji} {item.label}
                      </span>

                      <span className="font-bold text-cyan-300">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white md:text-2xl">
                Mood History
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your recent emotional timeline.
              </p>
            </div>

            {loading && (
              <Loader2
                className="animate-spin text-cyan-400"
                size={24}
              />
            )}
          </div>

          {loading ? (
            <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-slate-400">
              Loading history...
            </div>
          ) : moods.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center">
              <HeartPulse
                size={52}
                className="mx-auto mb-5 text-slate-500"
              />

              <h3 className="mb-3 text-2xl font-bold text-white">
                No Mood History
              </h3>

              <p className="text-sm text-slate-400 md:text-base">
                Save your first mood entry.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {moods.map((item) => (
                <div
                  key={item._id}
                  className="rounded-3xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/15 md:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {getMoodEmoji(item.mood)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-white md:text-xl">
                            {item.mood}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs ${getMoodBadgeClass(
                              item.score
                            )}`}
                          >
                            Score {item.score}/5
                          </span>
                        </div>

                        {item.note && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">
                            {item.note}
                          </p>
                        )}

                        <p className="mt-3 text-xs text-slate-500">
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteMood(item._id)
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm text-slate-400">
          {title}
        </h3>

        <Icon size={22} className="text-cyan-400" />
      </div>

      <p className="text-2xl font-bold text-white md:text-4xl">
        {value}
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

export default Mood