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
  High: "bg-red-500/10 text-red-300 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  Low: "bg-green-500/10 text-green-300 border-green-500/20",
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
          "Failed to load AI Study Coach vectors"
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
  const pendingCheckpoints = coachData?.pendingCheckpoints || []
  const recentLogs = coachData?.recentLogs || []

  const commandScore = useMemo(() => {
    const success = Number(summary.avgSuccess || 0)
    const focus = Number(summary.avgFocus || 0) * 20
    const studyHours = Math.min(
      100,
      Number(summary.recentStudyHours || 0) * 10
    )

    return Math.round((success + focus + studyHours) / 3)
  }, [summary])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] sm:min-h-[70vh] items-center justify-center px-2">
          <div className="w-full max-w-md rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.04] p-6 sm:p-8 text-center backdrop-blur-md">
            <Loader2 className="mx-auto animate-spin text-cyan-400 h-8 w-8 sm:h-10 sm:w-10" />
            <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-white tracking-tight">
              AI Study Coach Loading
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
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
        <div className="max-w-xl mx-auto px-2">
          <div className="rounded-2xl md:rounded-3xl border border-red-500/10 bg-red-500/[0.06] p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 text-red-300">
              <div className="p-2 rounded-xl bg-red-500/10 shrink-0">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  AI Study Coach Failed
                </h2>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-200/80 leading-relaxed break-words">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchCoach}
              className="mt-6 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-red-400 px-5 py-3 text-xs sm:text-sm font-bold text-black transition-transform active:scale-[0.99]"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Retry Analysis</span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto px-1 sm:px-4">
        
        {/* Main Header / Command Card */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-[36px] border border-cyan-400/10 bg-white/[0.06] p-4 sm:p-6 md:p-8 backdrop-blur-md">
          <div className="absolute -right-24 -top-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl md:rounded-3xl bg-cyan-500 text-black shadow-lg shadow-cyan-500/10">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>

              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-cyan-300">
                  <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>Academic Command Center</span>
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  AI Study Coach
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Your AI-powered academic intelligence layer. It analyzes your real saved data and gives focused study directions.
                </p>
              </div>
            </div>

            <div className="self-start sm:self-center lg:self-auto w-full sm:w-auto shrink-0">
              <CommandScore value={commandScore} />
            </div>
          </div>
        </section>

        {/* Modular KPI Metric Counters */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
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

        {/* Dashboard Core Intelligence Grid */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 items-start">
          
          {/* Smart Recommendation Engine */}
          <div className="lg:col-span-2 rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.06] p-4 sm:p-6 md:p-7 backdrop-blur-md space-y-4 sm:space-y-6">
            <div className="flex items-start gap-3">
              <Zap className="text-cyan-300 h-5 w-5 sm:h-7 sm:w-7 mt-0.5 shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                  Smart Recommendations
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generated from your real Student Life OS data pipeline.
                </p>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <EmptyState
                title="No recommendations yet"
                text="Add exams, targets, checkpoints, skills, timetable blocks, and learning logs to activate deeper AI analysis."
              />
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recommendations.map((item, index) => (
                  <RecommendationCard
                    key={`${item.title}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Core Daily Target Priorities Column */}
          <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.06] p-4 sm:p-6 md:p-7 backdrop-blur-md">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
              Today’s AI Focus
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Based on your current real-time academic vectors.
            </p>

            <div className="mt-4 sm:mt-6 space-y-3">
              <FocusItem
                label="First Priority"
                value={
                  upcomingExams[0]?.subject ||
                  pendingTargets[0]?.title ||
                  "Add more profiles"
                }
              />

              <FocusItem
                label="Skill Focus"
                value={
                  weakSkills[0]?.skillName ||
                  "No weak skill profile flagged"
                }
              />

              <FocusItem
                label="Next Checkpoint"
                value={
                  pendingCheckpoints[0]?.title ||
                  "No pending checkpoint profiles"
                }
              />

              <FocusItem
                label="Recent Learning"
                value={
                  recentLogs[0]?.subjectsStudied?.[0]?.subject ||
                  "No active logs saved"
                }
              />
            </div>
          </div>
        </section>

        {/* Detailed Data Intelligence Panel Grid */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          
          <DataPanel
            title="Upcoming Exams Intelligence"
            icon={CalendarDays}
            empty="No upcoming exams found."
            items={upcomingExams}
            render={(exam) => (
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {exam.subject}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Prep Status: <span className="text-cyan-300 font-semibold">{exam.preparationLevel || 0}%</span> · Priority: <span className="text-slate-300 font-medium">{exam.priority}</span>
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 pt-0.5">
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
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {skill.skillName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Current: {skill.currentLevel || 0}% · Target Vector: {skill.targetLevel || 100}%
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 pt-0.5">
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
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {target.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Progress: <span className="text-cyan-300 font-semibold">{target.progress || 0}%</span> · Priority: <span className="text-slate-300 font-medium">{target.priority}</span>
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 pt-0.5">
                  Target Limit: {formatDate(target.dueDate)}
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
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {checkpoint.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Category: {checkpoint.category} · System Weight: {checkpoint.progressWeight || 0}%
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 pt-0.5">
                  Deadline: {formatDate(checkpoint.dueDate)}
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
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/30 p-4 sm:p-6 text-center flex items-center sm:flex-col justify-between sm:justify-center gap-4 max-w-full sm:min-w-[170px]">
      <div
        className="flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-full mx-auto"
        style={{
          background: `conic-gradient(rgb(34 211 238) ${value}%, rgba(255,255,255,0.06) 0)`,
        }}
      >
        <div className="flex h-16 w-16 sm:h-18 sm:w-18 md:h-22 md:w-22 items-center justify-center rounded-full bg-slate-950">
          <span className="text-xl sm:text-2xl font-black text-white">
            {value}%
          </span>
        </div>
      </div>

      <div className="text-right sm:text-center">
        <p className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
          AI Command Score
        </p>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.04] p-3.5 sm:p-5 backdrop-blur-md flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
      <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white/5 text-cyan-300">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate">
          {label}
        </p>
        <h2 className="mt-0.5 text-base sm:text-xl md:text-2xl font-black text-white tracking-tight truncate">
          {value}
        </h2>
      </div>
    </div>
  )
}

function RecommendationCard({ item }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-5">
      <div className="space-y-2.5">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold ${
            priorityStyles[item.priority] || priorityStyles.Medium
          }`}
        >
          {item.priority} Priority
        </span>

        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight break-words">
          {item.title}
        </h3>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          {item.message}
        </p>
      </div>
    </div>
  )
}

function FocusItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-3.5 flex flex-col justify-center">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </p>
      <h3 className="mt-0.5 font-bold text-xs sm:text-sm text-white truncate">
        {value}
      </h3>
    </div>
  )
}

function DataPanel({ title, icon: Icon, empty, items, render }) {
  return (
    <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.06] p-4 sm:p-6 backdrop-blur-md flex flex-col h-full">
      <div className="mb-4 flex items-center gap-2.5">
        <Icon className="text-cyan-300 h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">
          {title}
        </h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {items.length === 0 ? (
          <EmptyState title={empty} text="Add related data profiles to improve AI analysis." />
        ) : (
          <div className="space-y-3 w-full">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-white/5 bg-black/20 p-3.5 sm:p-4 transition-colors duration-150 hover:border-white/10"
              >
                {render(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-dashed border-white/5 p-6 sm:p-8 text-center my-auto w-full">
      <BookOpen className="mx-auto text-slate-600 h-8 w-8 sm:h-10 sm:w-10" />
      <h3 className="mt-3 text-sm sm:text-base font-bold text-white truncate">
        {title}
      </h3>
      <p className="mt-1 text-[11px] sm:text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
        {text}
      </p>
    </div>
  )
}

function formatDate(value) {
  if (!value) return "No timeline profile"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Invalid entry"
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default AIStudyCoach