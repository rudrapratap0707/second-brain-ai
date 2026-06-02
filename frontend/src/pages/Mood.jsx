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
    description: "Positive and energetic",
  },
  {
    label: "Focused",
    emoji: "🎯",
    score: 4,
    icon: Target,
    description: "Productive and attentive",
  },
  {
    label: "Neutral",
    emoji: "😐",
    score: 3,
    icon: Meh,
    description: "Balanced and normal",
  },
  {
    label: "Stressed",
    emoji: "🔥",
    score: 2,
    icon: Flame,
    description: "Pressure or overload",
  },
  {
    label: "Sad",
    emoji: "😔",
    score: 1,
    icon: Frown,
    description: "Low or emotionally down",
  },
  {
    label: "Tired",
    emoji: "😴",
    score: 2,
    icon: Moon,
    description: "Low energy or sleepy",
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
      setError("")

      const data = await getMoods()

      setMoods(data.moods || [])
    } catch (error) {
      console.log(error)
      setError("Failed to load mood history.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMoods()
  }, [])

  const handleSelectMood = (mood) => {
    setSelectedMood(mood)
    setError("")
    setSuccess("")
  }

  const handleSaveMood = async () => {
    if (!selectedMood) {
      setError("Please select your mood first.")
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
      setError("Failed to delete mood.")
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

  const latestMood = moods[0]

  const bestMood = useMemo(() => {
    if (moods.length === 0) return null

    return moods.reduce((best, current) =>
      current.score > best.score ? current : best
    )
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

  const getMoodEmoji = (moodName) => {
    const found = moodOptions.find((item) => item.label === moodName)

    return found?.emoji || "🙂"
  }

  const getMoodColor = (score) => {
    if (score >= 5) return "text-green-300"
    if (score >= 4) return "text-cyan-300"
    if (score >= 3) return "text-yellow-300"
    if (score >= 2) return "text-orange-300"

    return "text-red-300"
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
      return "Start tracking your mood daily to build emotional awareness."
    }

    if (averageScore >= 4) {
      return "Your recent mood trend looks positive. Keep following your current routine."
    }

    if (averageScore >= 3) {
      return "Your mood is balanced. Try maintaining sleep, study breaks, and light movement."
    }

    return "Your mood trend seems low. Take short breaks, hydrate, and avoid overload today."
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4">
              <HeartPulse className="text-cyan-400" size={44} />

              <h1 className="text-5xl font-bold">
                Mood Tracker
              </h1>
            </div>

            <p className="text-slate-400 mt-4 text-lg">
              Track your daily mood and understand your emotional patterns.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl px-6 py-5">
            <p className="text-slate-400 text-sm">
              Today&apos;s status
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {latestMood
                ? `${getMoodEmoji(latestMood.mood)} ${latestMood.mood}`
                : "Not logged yet"}
            </h2>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400">
                Total Entries
              </h3>

              <CalendarDays className="text-cyan-400" size={24} />
            </div>

            <p className="text-5xl font-bold mt-4">
              {moods.length}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400">
                Average Score
              </h3>

              <BarChart3 className="text-purple-400" size={24} />
            </div>

            <p className="text-5xl font-bold mt-4">
              {averageScore}
            </p>

            <p className="text-slate-500 mt-2">
              Out of 5
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400">
                Most Frequent
              </h3>

              <Brain className="text-green-400" size={24} />
            </div>

            <p className="text-4xl font-bold mt-4">
              {mostFrequentMood}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-cyan-400" size={28} />

              <h2 className="text-3xl font-bold">
                How are you feeling?
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moodOptions.map((moodItem) => {
                const Icon = moodItem.icon
                const isActive =
                  selectedMood?.label === moodItem.label

                return (
                  <button
                    key={moodItem.label}
                    type="button"
                    onClick={() => handleSelectMood(moodItem)}
                    className={`text-left px-5 py-5 rounded-3xl border transition ${
                      isActive
                        ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                        : "bg-white/10 border-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">
                        {moodItem.emoji}
                      </span>

                      <Icon
                        size={22}
                        className={
                          isActive
                            ? "text-black"
                            : "text-cyan-400"
                        }
                      />
                    </div>

                    <h3 className="font-bold text-xl mt-4">
                      {moodItem.label}
                    </h3>

                    <p
                      className={`text-sm mt-2 ${
                        isActive
                          ? "text-black/70"
                          : "text-slate-400"
                      }`}
                    >
                      {moodItem.description}
                    </p>

                    <p
                      className={`text-xs mt-3 ${
                        isActive
                          ? "text-black/70"
                          : "text-slate-500"
                      }`}
                    >
                      Score: {moodItem.score}/5
                    </p>
                  </button>
                )
              })}
            </div>

            <div className="mt-8">
              <label className="text-slate-300 font-medium">
                Reason or note about your mood
              </label>

              <textarea
                placeholder="Example: I felt productive after completing my study target..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="6"
                className="w-full mt-4 bg-white/10 border border-white/10 rounded-3xl px-5 py-4 outline-none text-white placeholder:text-slate-500 resize-none"
              />
            </div>

            {selectedMood && (
              <div className="mt-6 bg-cyan-500/10 border border-cyan-400/20 rounded-3xl p-5">
                <p className="text-cyan-300 text-sm">
                  Selected Mood
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  {selectedMood.emoji} {selectedMood.label}
                </h3>

                <p className="text-slate-400 mt-2">
                  Score: {selectedMood.score}/5
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-7">
              <button
                onClick={handleSaveMood}
                disabled={saving}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}

                {saving ? "Saving..." : "Save Mood"}
              </button>

              <button
                onClick={clearSelection}
                className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="text-purple-400" size={28} />

              <h2 className="text-3xl font-bold">
                AI Mood Insight
              </h2>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
              <p className="text-slate-300 leading-relaxed">
                {getInsight()}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">
                Mood Distribution
              </h3>

              <div className="space-y-3">
                {moodOptions.map((item) => {
                  const count =
                    moodCounts[item.label] || 0

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-3"
                    >
                      <span>
                        {item.emoji} {item.label}
                      </span>

                      <span className="text-cyan-300 font-bold">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {bestMood && (
              <div className="mt-8 bg-green-500/10 border border-green-400/20 rounded-3xl p-5">
                <p className="text-green-300 text-sm">
                  Best Recorded Mood
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  {getMoodEmoji(bestMood.mood)} {bestMood.mood}
                </h3>

                <p className="text-slate-400 mt-2">
                  Score: {bestMood.score}/5
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mt-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold">
                Mood History
              </h2>

              <p className="text-slate-400 mt-2">
                Your recent emotional records appear here.
              </p>
            </div>

            {loading && (
              <Loader2 className="animate-spin text-cyan-400" size={28} />
            )}
          </div>

          {loading ? (
            <div className="border border-dashed border-white/20 rounded-2xl p-10 text-center text-slate-400">
              Loading mood history...
            </div>
          ) : moods.length === 0 ? (
            <div className="border border-dashed border-white/20 rounded-2xl p-12 text-center text-slate-400">
              <HeartPulse size={60} className="mx-auto text-slate-500 mb-5" />

              <h3 className="text-2xl font-bold text-white mb-3">
                No Mood History Yet
              </h3>

              <p>
                Select your mood and save it to start building your emotional timeline.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {moods.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/10 border border-white/10 rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {getMoodEmoji(item.mood)}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-2xl font-bold">
                          {item.mood}
                        </h3>

                        <span
                          className={`text-sm px-3 py-1 rounded-full border ${getMoodBadgeClass(
                            item.score
                          )}`}
                        >
                          Score {item.score}/5
                        </span>
                      </div>

                      {item.note && (
                        <p className="text-slate-300 mt-3 whitespace-pre-line">
                          {item.note}
                        </p>
                      )}

                      <p className="text-slate-500 text-sm mt-3">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMood(item._id)}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 transition px-5 py-3 rounded-2xl text-white font-medium"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Mood