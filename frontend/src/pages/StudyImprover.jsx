import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  Brain,
  Loader2,
  AlertTriangle,
  Target,
  ClipboardCheck,
  BarChart3,
  CalendarDays,
  BookOpen,
  Zap,
  RefreshCcw,
  TrendingDown,
  Flame,
  Activity,
} from "lucide-react"

import { getStudyImprover } from "../services/api"

const priorityStyle = {
  High: "bg-red-500/20 text-red-200 border-red-400/20",
  Medium: "bg-yellow-500/20 text-yellow-200 border-yellow-400/20",
  Low: "bg-green-500/20 text-green-200 border-green-400/20",
}

function StudyImprover() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchImprover = async () => {
    try {
      setLoading(true)
      setError("")

      const result = await getStudyImprover()

      setData(result)
    } catch (err) {
      console.log(err)

      setError(
        err.response?.data?.message ||
          "Failed to load Study Improver"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImprover()
  }, [])

  const summary = data?.summary || {}
  const improvementPlan = data?.improvementPlan || []
  const weakSubjects = data?.weakSubjects || []
  const incompleteTargets = data?.incompleteTargets || []
  const skippedCheckpoints = data?.skippedCheckpoints || []
  const weakSkills = data?.weakSkills || []
  const lowPreparedExams = data?.lowPreparedExams || []

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-xl">
            <Loader2 className="mx-auto animate-spin text-purple-300" size={42} />

            <h2 className="mt-5 text-2xl font-bold text-white">
              Analyzing Your Study Pattern
            </h2>

            <p className="mt-2 text-slate-400">
              Detecting weak subjects, incomplete targets, skipped checkpoints and low preparation areas.
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
                Study Improver failed
              </h2>

              <p className="mt-2 text-red-200">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchImprover}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-red-400 px-5 py-3 font-semibold text-black"
          >
            <RefreshCcw size={18} />
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500 text-white">
                <Brain size={42} />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm font-semibold text-purple-200">
                  <TrendingDown size={16} />
                  Weakness Diagnosis Engine
                </div>

                <h1 className="text-4xl font-bold text-white md:text-5xl">
                  Study Improver
                </h1>

                <p className="mt-4 max-w-3xl text-slate-300">
                  Detect weak areas, skipped tasks, low preparation subjects,
                  poor focus patterns, and generate improvement actions.
                </p>
              </div>
            </div>

            <DiagnosisCard summary={summary} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            icon={BookOpen}
            label="Weak Subjects"
            value={summary.weakSubjects || 0}
          />

          <MetricCard
            icon={Target}
            label="Incomplete Targets"
            value={summary.incompleteTargets || 0}
          />

          <MetricCard
            icon={ClipboardCheck}
            label="Skipped CP"
            value={summary.skippedCheckpoints || 0}
          />

          <MetricCard
            icon={BarChart3}
            label="Weak Skills"
            value={summary.weakSkills || 0}
          />

          <MetricCard
            icon={CalendarDays}
            label="Low Prepared Exams"
            value={summary.lowPreparedExams || 0}
          />

          <MetricCard
            icon={Activity}
            label="Avg Focus"
            value={`${summary.avgFocus || 0}/5`}
          />
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  AI Improvement Plan
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Actionable plan generated from your real academic data.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchImprover}
                className="flex items-center gap-2 rounded-2xl bg-purple-500 px-4 py-3 font-bold text-white"
              >
                <RefreshCcw size={18} />
                Refresh Analysis
              </button>
            </div>

            {improvementPlan.length === 0 ? (
              <EmptyState
                title="No improvement plan yet"
                text="Add exams, notes, skills, learning logs, targets and checkpoints to generate improvement actions."
              />
            ) : (
              <div className="space-y-5">
                {improvementPlan.map((item, index) => (
                  <PlanCard
                    key={`${item.title}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">
              Improvement Focus
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Start with these areas first.
            </p>

            <div className="mt-6 space-y-4">
              <FocusBox
                label="First Weak Subject"
                value={weakSubjects[0]?.name || "No weak subject"}
              />

              <FocusBox
                label="Next Target"
                value={incompleteTargets[0]?.title || "No pending target"}
              />

              <FocusBox
                label="Next Checkpoint"
                value={skippedCheckpoints[0]?.title || "No skipped checkpoint"}
              />

              <FocusBox
                label="Weak Skill"
                value={weakSkills[0]?.skillName || "No weak skill"}
              />

              <FocusBox
                label="Exam Risk"
                value={lowPreparedExams[0]?.subject || "No exam risk"}
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <DataPanel
            title="Weak Subjects / Topics"
            icon={BookOpen}
            empty="No weak subjects detected."
            items={weakSubjects}
            render={(item) => (
              <>
                <h3 className="text-xl font-bold text-white">
                  {item.name}
                </h3>

                <p className="mt-2 text-slate-400">
                  Found {item.count} times
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {item.reason}
                </p>
              </>
            )}
          />

          <DataPanel
            title="Low Prepared Exams"
            icon={CalendarDays}
            empty="No low-prepared exams."
            items={lowPreparedExams}
            render={(item) => (
              <>
                <h3 className="text-xl font-bold text-white">
                  {item.subject}
                </h3>

                <p className="mt-2 text-slate-400">
                  Preparation: {item.preparationLevel || 0}%
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Priority: {item.priority}
                </p>
              </>
            )}
          />

          <DataPanel
            title="Incomplete Targets"
            icon={Target}
            empty="No incomplete targets."
            items={incompleteTargets}
            render={(item) => (
              <>
                <h3 className="text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-slate-400">
                  Progress: {item.progress || 0}% · {item.priority}
                </p>
              </>
            )}
          />

          <DataPanel
            title="Weak Skills"
            icon={BarChart3}
            empty="No weak skills detected."
            items={weakSkills}
            render={(item) => (
              <>
                <h3 className="text-xl font-bold text-white">
                  {item.skillName}
                </h3>

                <p className="mt-2 text-slate-400">
                  Current: {item.currentLevel || 0}% · Target: {item.targetLevel || 100}%
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Category: {item.category}
                </p>
              </>
            )}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}

function DiagnosisCard({ summary }) {
  const risk =
    (summary.weakSubjects || 0) +
    (summary.skippedCheckpoints || 0) +
    (summary.weakSkills || 0) +
    (summary.lowPreparedExams || 0)

  const level =
    risk >= 12
      ? "High Risk"
      : risk >= 6
      ? "Needs Attention"
      : risk > 0
      ? "Stable"
      : "No Data"

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
      <Flame className="mx-auto text-purple-300" size={36} />

      <h2 className="mt-3 text-3xl font-bold text-white">
        {level}
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Improvement Status
      </p>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-purple-300">
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

function PlanCard({ item, index }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500 text-white font-bold">
              {index + 1}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                priorityStyle[item.priority] || priorityStyle.Medium
              }`}
            >
              {item.priority} Priority
            </span>

            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200">
              {item.type}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-white">
            {item.title}
          </h3>

          <p className="mt-3 leading-7 text-slate-300">
            {item.action}
          </p>
        </div>
      </div>
    </div>
  )
}

function FocusBox({ label, value }) {
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
        <Icon className="text-purple-300" size={28} />

        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">
          {empty}
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id || item.name}
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
    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
      <Brain size={54} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-slate-400">
        {text}
      </p>
    </div>
  )
}

export default StudyImprover