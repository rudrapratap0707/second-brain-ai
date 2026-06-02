import { useEffect, useMemo, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  Sparkles,
  Loader2,
  Brain,
  AlertTriangle,
  CalendarDays,
  Target,
  ClipboardCheck,
  BarChart3,
  Clock3,
  BookOpen,
  Zap,
  Activity,
  RefreshCcw,
} from "lucide-react"

import { getAIStudyCoach } from "../services/api"

const priorityStyles = {
  High: "bg-red-500/20 text-red-200 border-red-400/20",
  Medium:
    "bg-yellow-500/20 text-yellow-200 border-yellow-400/20",
  Low: "bg-green-500/20 text-green-200 border-green-400/20",
}

function AIStudyCoach() {
  const [coachData, setCoachData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchCoach = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getAIStudyCoach()

      setCoachData(data)
    } catch (err) {
      console.log(err)
      setError(
        err.response?.data?.message ||
          "Failed to load AI Study Coach"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoach()
  }, [])

  const summary = coachData?.summary || {}
  const recommendations = coachData?.recommendations || []
  const upcomingExams = coachData?.upcomingExams || []
  const weakSkills = coachData?.weakSkills || []
  const pendingTargets = coachData?.pendingTargets || []
  const pendingCheckpoints =
    coachData?.pendingCheckpoints || []
  const recentLogs = coachData?.recentLogs || []

  const commandScore = useMemo(() => {
    const success = Number(summary.avgSuccess || 0)
    const focus = Number(summary.avgFocus || 0) * 20
    const studyHours = Math.min(
      100,
      Number(summary.recentStudyHours || 0) * 10
    )

    return Math.round(
      (success + focus + studyHours) / 3
    )
  }, [summary])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-xl">
            <Loader2 className="mx-auto animate-spin text-cyan-400" size={42} />

            <h2 className="mt-5 text-2xl font-bold text-white">
              AI Study Coach Loading
            </h2>

            <p className="mt-2 text-slate-400">
              Analyzing your exams, targets, checkpoints, skills, timetable and learning logs.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8">
          <div className="flex items-center gap-4 text-red-300">
            <AlertTriangle size={30} />

            <div>
              <h2 className="text-2xl font-bold">
                AI Study Coach failed
              </h2>

              <p className="mt-2 text-red-200">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchCoach}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-red-400 px-5 py-3 font-semibold text-black"
          >
            <RefreshCcw size={18} />
            Retry Analysis
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[36px] border border-cyan-400/20 bg-white/10 p-8 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500 text-black shadow-lg shadow-cyan-500/20">
                <Sparkles size={42} />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                  <Brain size={16} />
                  Academic Command Center
                </div>

                <h1 className="text-4xl font-bold text-white md:text-5xl">
                  AI Study Coach
                </h1>

                <p className="mt-4 max-w-3xl text-slate-300">
                  Your AI-powered academic intelligence layer. It analyzes your real saved data and gives focused study directions.
                </p>
              </div>
            </div>

            <CommandScore value={commandScore} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            label="Upcoming Exams"
            value={summary.upcomingExams || 0}
            icon={CalendarDays}
          />

          <MetricCard
            label="Pending Targets"
            value={summary.pendingTargets || 0}
            icon={Target}
          />

          <MetricCard
            label="Checkpoints"
            value={summary.pendingCheckpoints || 0}
            icon={ClipboardCheck}
          />

          <MetricCard
            label="Weak Skills"
            value={summary.weakSkills || 0}
            icon={BarChart3}
          />

          <MetricCard
            label="Study Hours"
            value={`${summary.recentStudyHours || 0}h`}
            icon={Clock3}
          />

          <MetricCard
            label="Avg Focus"
            value={`${summary.avgFocus || 0}/5`}
            icon={Activity}
          />
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <Zap className="text-cyan-300" size={30} />

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Smart Recommendations
                </h2>

                <p className="text-sm text-slate-400">
                  Generated from your real Student Life OS data.
                </p>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <EmptyState
                title="No recommendations yet"
                text="Add exams, targets, checkpoints, skills, timetable blocks, and learning logs to activate deeper AI analysis."
              />
            ) : (
              <div className="space-y-5">
                {recommendations.map((item, index) => (
                  <RecommendationCard
                    key={`${item.title}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">
              Today’s AI Focus
            </h2>

            <p className="mt-3 text-slate-400">
              Based on your current academic data.
            </p>

            <div className="mt-6 space-y-4">
              <FocusItem
                label="First Priority"
                value={
                  upcomingExams[0]?.subject ||
                  pendingTargets[0]?.title ||
                  "Add more data"
                }
              />

              <FocusItem
                label="Skill Focus"
                value={
                  weakSkills[0]?.skillName ||
                  "No weak skill detected"
                }
              />

              <FocusItem
                label="Next Checkpoint"
                value={
                  pendingCheckpoints[0]?.title ||
                  "No pending checkpoint"
                }
              />

              <FocusItem
                label="Recent Learning"
                value={
                  recentLogs[0]?.subjectsStudied?.[0]?.subject ||
                  "No recent log"
                }
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <DataPanel
            title="Upcoming Exams Intelligence"
            icon={CalendarDays}
            empty="No upcoming exams found."
            items={upcomingExams}
            render={(exam) => (
              <div>
                <h3 className="text-xl font-bold text-white">
                  {exam.subject}
                </h3>

                <p className="mt-2 text-slate-400">
                  Preparation: {exam.preparationLevel || 0}% · Priority: {exam.priority}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Exam Date: {formatDate(exam.examDate)}
                </p>
              </div>
            )}
          />

          <DataPanel
            title="Weak Skill Intelligence"
            icon={BarChart3}
            empty="No weak skills found."
            items={weakSkills}
            render={(skill) => (
              <div>
                <h3 className="text-xl font-bold text-white">
                  {skill.skillName}
                </h3>

                <p className="mt-2 text-slate-400">
                  Current Level: {skill.currentLevel || 0}% · Target: {skill.targetLevel || 100}%
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Category: {skill.category}
                </p>
              </div>
            )}
          />

          <DataPanel
            title="Pending Targets"
            icon={Target}
            empty="No pending targets."
            items={pendingTargets}
            render={(target) => (
              <div>
                <h3 className="text-xl font-bold text-white">
                  {target.title}
                </h3>

                <p className="mt-2 text-slate-400">
                  Progress: {target.progress || 0}% · Priority: {target.priority}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Due: {formatDate(target.dueDate)}
                </p>
              </div>
            )}
          />

          <DataPanel
            title="Pending Checkpoints"
            icon={ClipboardCheck}
            empty="No pending checkpoints."
            items={pendingCheckpoints}
            render={(checkpoint) => (
              <div>
                <h3 className="text-xl font-bold text-white">
                  {checkpoint.title}
                </h3>

                <p className="mt-2 text-slate-400">
                  Category: {checkpoint.category} · Weight: {checkpoint.progressWeight || 0}%
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Due: {formatDate(checkpoint.dueDate)}
                </p>
              </div>
            )}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}

function CommandScore({ value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
      <div
        className="mx-auto flex h-32 w-32 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(rgb(34 211 238) ${value}%, rgba(255,255,255,0.1) 0)`,
        }}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950">
          <span className="text-3xl font-bold text-white">
            {value}%
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        AI Command Score
      </p>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
        <Icon size={22} />
      </div>

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <h2 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h2>
    </div>
  )
}

function RecommendationCard({ item }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
              priorityStyles[item.priority] ||
              priorityStyles.Medium
            }`}
          >
            {item.priority} Priority
          </span>

          <h3 className="mt-4 text-2xl font-bold text-white">
            {item.title}
          </h3>

          <p className="mt-3 leading-7 text-slate-300">
            {item.message}
          </p>
        </div>
      </div>
    </div>
  )
}

function FocusItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <h3 className="mt-1 font-bold text-white">
        {value}
      </h3>
    </div>
  )
}

function DataPanel({
  title,
  icon: Icon,
  empty,
  items,
  render,
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <Icon className="text-cyan-300" size={28} />

        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>
      </div>

      {items.length === 0 ? (
        <EmptyState title={empty} text="Add related data to improve AI analysis." />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              {render(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
      <BookOpen size={46} className="mx-auto text-slate-600" />

      <h3 className="mt-4 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-slate-400">
        {text}
      </p>
    </div>
  )
}

function formatDate(value) {
  if (!value) return "No date"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default AIStudyCoach