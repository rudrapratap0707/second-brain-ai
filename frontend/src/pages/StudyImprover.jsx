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
  High: "bg-red-500/10 text-red-300 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  Low: "bg-green-500/10 text-green-300 border-green-500/20",
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
          "Failed to load Study Improver analysis data"
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
        <div className="flex min-h-[65vh] sm:min-h-[70vh] items-center justify-center px-3 sm:px-4">
          <div className="w-full max-w-md rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.04] p-6 sm:p-8 text-center backdrop-blur-md">
            <Loader2 className="mx-auto animate-spin text-purple-300 h-9 w-9 sm:h-11 sm:w-11" size={42} />

            <h2 className="mt-4 sm:mt-5 text-lg sm:text-2xl font-bold text-white tracking-tight">
              Analyzing Your Study Pattern
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
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
        <div className="max-w-xl mx-auto px-2 sm:px-4">
          <div className="rounded-2xl md:rounded-3xl border border-red-500/10 bg-red-500/[0.05] p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 text-red-300">
              <div className="p-2 rounded-xl bg-red-500/10 shrink-0">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8" size={30} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Study Improver Failed
                </h2>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-200/80 leading-relaxed break-words">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchImprover}
              className="mt-6 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-red-400 px-5 py-3 text-xs sm:text-sm font-bold text-black transition-transform active:scale-[0.99]"
            >
              <RefreshCcw size={18} className="h-4 w-4" />
              <span>Retry Processing</span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto px-1 sm:px-4">
        
        {/* Main Header Strategic Dashboard Banner */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-[36px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-8 backdrop-blur-md">
          <div className="absolute -right-24 -top-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl md:rounded-3xl bg-purple-500 text-white shadow-md">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" size={42} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-purple-400/20 bg-purple-400/5 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-purple-200">
                  <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" size={16} />
                  <span>Weakness Diagnosis Engine</span>
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  Study Improver
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Detect weak areas, skipped tasks, low preparation subjects, poor focus patterns, and generate core improvement actions dynamically.
                </p>
              </div>
            </div>

            <div className="self-start sm:self-center lg:self-auto w-full sm:w-auto shrink-0">
              <DiagnosisCard summary={summary} />
            </div>
          </div>
        </section>

        {/* Primary Analytical Focus Score Metrics Matrix Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
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

        {/* Core Content Analysis Segment Blocks Panel */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 items-start">
          
          {/* Main Actionable AI Treatment Layout Container */}
          <div className="lg:col-span-2 rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-7 backdrop-blur-md">
            <div className="mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                  AI Improvement Plan
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Actionable plan generated comprehensively from your real academic workflow data.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchImprover}
                className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-purple-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition-transform active:scale-[0.99] w-full sm:w-auto shrink-0"
              >
                <RefreshCcw size={18} className="h-3.5 w-3.5" />
                <span>Refresh Analysis</span>
              </button>
            </div>

            {improvementPlan.length === 0 ? (
              <EmptyState
                title="No improvement plan yet"
                text="Add exams, notes, skills, learning logs, targets and checkpoints to generate structural dynamic improvement actions."
              />
            ) : (
              <div className="space-y-3 sm:space-y-4">
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

          {/* Quick Critical Priority Target Selection Focus List Block */}
          <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-7 backdrop-blur-md">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Improvement Focus
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Start processing with these critical high-risk target spaces first.
            </p>

            <div className="mt-4 sm:mt-6 space-y-3">
              <FocusBox
                label="First Weak Subject"
                value={weakSubjects[0]?.name || "No weak subject discovered"}
              />

              <FocusBox
                label="Next Target Allocation"
                value={incompleteTargets[0]?.title || "No pending target specified"}
              />

              <FocusBox
                label="Next Checkpoint Block"
                value={skippedCheckpoints[0]?.title || "No skipped checkpoints found"}
              />

              <FocusBox
                label="Weak Skill Matrix"
                value={weakSkills[0]?.skillName || "No weak skill identified"}
              />

              <FocusBox
                label="Exam Risk Level"
                value={lowPreparedExams[0]?.subject || "No exam risk identified"}
              />
            </div>
          </div>
        </section>

        {/* Detailed Individual Weak Points Component Streams Panel */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <DataPanel
            title="Weak Subjects / Topics"
            icon={BookOpen}
            empty="No weak subjects or chapters detected inside metrics logs."
            items={weakSubjects}
            render={(item) => (
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight break-words">
                  {item.name}
                </h3>

                <p className="text-xs font-semibold text-purple-300">
                  Discovered Logged Occurrence Count: {item.count} times
                </p>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">
                  {item.reason}
                </p>
              </div>
            )}
          />

          <DataPanel
            title="Low Prepared Exams"
            icon={CalendarDays}
            empty="No low-prepared exams detected inside systems schedules."
            items={lowPreparedExams}
            render={(item) => (
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight break-words">
                  {item.subject}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300">
                  Preparation Baseline Status Level: <span className="text-red-400 font-bold">{item.preparationLevel || 0}%</span>
                </p>

                <p className="text-xs text-slate-400">
                  Assigned Engine Priority Matrix: <span className="text-yellow-300 font-medium">{item.priority}</span>
                </p>
              </div>
            )}
          />

          <DataPanel
            title="Incomplete Targets"
            icon={Target}
            empty="No incomplete targets or objectives remaining current."
            items={incompleteTargets}
            render={(item) => (
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight break-words">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300">
                  Current Trajectory Progress: <span className="text-purple-300 font-bold">{item.progress || 0}%</span> · Priority: <span className="text-slate-400">{item.priority}</span>
                </p>
              </div>
            )}
          />

          <DataPanel
            title="Weak Skills"
            icon={BarChart3}
            empty="No weak skill parameters identified inside logs database."
            items={weakSkills}
            render={(item) => (
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight break-words">
                  {item.skillName}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300">
                  Current Level: <span className="text-red-400 font-bold">{item.currentLevel || 0}%</span> · Target Threshold Goal: <span className="text-green-400 font-bold">{item.targetLevel || 100}%</span>
                </p>

                <p className="text-xs text-slate-400 tracking-wide">
                  Skill Category Class: <span className="text-slate-300 font-medium">{item.category}</span>
                </p>
              </div>
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
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/30 p-4 sm:p-6 text-center flex items-center sm:flex-col justify-between sm:justify-center gap-4 max-w-full sm:min-w-[170px]">
      <div className="p-2 sm:p-0 rounded-xl bg-white/5 sm:bg-transparent shrink-0">
        <Flame className="mx-auto text-purple-300 h-6 w-6 sm:h-9 sm:w-9" size={36} />
      </div>

      <div className="text-right sm:text-center min-w-0">
        <h2 className="text-base sm:text-2xl font-black text-white tracking-tight truncate">
          {level}
        </h2>

        <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-medium tracking-wider mt-0.5 whitespace-nowrap">
          Improvement Status
        </p>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.04] p-3.5 sm:p-5 backdrop-blur-md flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
      <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white/5 text-purple-300">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" size={22} />
      </div>

      <div className="min-w-0 flex-1">
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

function PlanCard({ item, index }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-6 transition-colors duration-150 hover:border-white/10">
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-sm">
            {index + 1}
          </span>

          <span
            className={`rounded-full border px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold ${
              priorityStyle[item.priority] || priorityStyle.Medium
            }`}
          >
            {item.priority} Priority
          </span>

          <span className="rounded-full bg-purple-500/10 border border-purple-500/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-purple-200 uppercase tracking-wide">
            {item.type}
          </span>
        </div>

        <div className="min-w-0 space-y-1.5">
          <h3 className="text-base sm:text-xl font-bold text-white tracking-tight break-words">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-300 break-words">
            {item.action}
          </p>
        </div>
      </div>
    </div>
  )
}

function FocusBox({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-3 sm:p-4 flex items-center justify-between gap-4">
      <p className="text-xs sm:text-sm font-medium text-slate-400 truncate">
        {label}
      </p>

      <h3 className="text-xs sm:text-sm font-bold text-white text-right break-all max-w-[60%]">
        {value}
      </h3>
    </div>
  )
}

function DataPanel({ title, icon: Icon, empty, items, render }) {
  return (
    <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-7 backdrop-blur-md flex flex-col h-full">
      <div className="mb-4 sm:mb-5 flex items-center gap-2.5">
        <Icon className="text-purple-300 h-5 w-5 sm:h-6 sm:w-6 shrink-0" size={28} />

        <h2 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
          {title}
        </h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {items.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-400 py-4 italic">
            {empty}
          </p>
        ) : (
          <div className="space-y-3 w-full">
            {items.map((item, index) => (
              <div
                key={item._id || item.name || index}
                className="rounded-xl border border-white/5 bg-black/20 p-4 transition-all duration-150 hover:border-white/10"
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
    <div className="rounded-xl sm:rounded-2xl border border-dashed border-white/5 p-6 sm:p-12 text-center my-auto w-full">
      <Brain className="mx-auto text-slate-600 h-8 w-8 sm:h-12 sm:w-12" size={54} />

      <h3 className="mt-4 text-base sm:text-xl font-bold text-white truncate">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
        {text}
      </p>
    </div>
  )
}

export default StudyImprover