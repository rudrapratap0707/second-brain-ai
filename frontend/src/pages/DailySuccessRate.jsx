import { useEffect, useMemo, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  Trophy,
  Loader2,
  AlertTriangle,
  Target,
  ClipboardCheck,
  Clock3,
  BookOpen,
  Activity,
  Flame,
  RefreshCcw,
  TrendingUp,
  BarChart3,
} from "lucide-react"

import { getDailySuccessRate } from "../services/api"

const priorityStyle = {
  High: "bg-red-500/10 text-red-300 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  Low: "bg-green-500/10 text-green-300 border-green-500/20",
}

function DailySuccessRate() {
  const [successData, setSuccessData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchSuccessRate = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getDailySuccessRate()

      setSuccessData(data)
    } catch (err) {
      console.log(err)

      setError(
        err.response?.data?.message ||
          "Failed to load Daily Success Rate metrics"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuccessRate()
  }, [])

  const scores = successData?.scores || {}
  const stats = successData?.stats || {}
  const insights = successData?.insights || []
  const pendingCheckpoints = successData?.pendingCheckpoints || []
  const pendingTargets = successData?.pendingTargets || []
  const recentLogs = successData?.recentLogs || []

  const scoreCards = useMemo(
    () => [
      {
        label: "Checkpoints",
        value: scores.checkpointScore || 0,
        icon: ClipboardCheck,
      },
      {
        label: "Targets",
        value: scores.targetScore || 0,
        icon: Target,
      },
      {
        label: "Study Time",
        value: scores.studyScore || 0,
        icon: Clock3,
      },
      {
        label: "Log Success",
        value: scores.todayLogSuccess || 0,
        icon: Activity,
      },
    ],
    [scores]
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[65vh] sm:min-h-[70vh] items-center justify-center px-3 sm:px-4">
          <div className="w-full max-w-md rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.04] p-6 sm:p-8 text-center backdrop-blur-md">
            <Loader2
              className="mx-auto animate-spin text-yellow-300 h-9 w-9 sm:h-11 sm:w-11"
              size={42}
            />

            <h2 className="mt-4 sm:mt-5 text-lg sm:text-2xl font-bold text-white tracking-tight">
              Calculating Daily Success Rate
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Measuring checkpoints, targets, study logs, and productivity configurations.
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
                  Daily Success Rate Failed
                </h2>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-200/80 leading-relaxed break-words">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchSuccessRate}
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
        
        {/* Main Strategic Dashboard Header Banner Component */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-[36px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-8 backdrop-blur-md">
          <div className="absolute -right-24 -top-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl md:rounded-3xl bg-yellow-400 text-black shadow-md">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" size={42} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-yellow-200">
                  <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5" size={16} />
                  <span>Performance Analytics</span>
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  Daily Success Rate
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Measure today’s productivity using completed checkpoints, target progress, study logs, and learning performance tracking systems.
                </p>
              </div>
            </div>

            <div className="self-start sm:self-center lg:self-auto w-full sm:w-auto shrink-0">
              <SuccessRing
                value={scores.overallScore || 0}
                level={successData?.productivityLevel || "No Data"}
              />
            </div>
          </div>
        </section>

        {/* Primary Analytical Score Progress Indicators */}
        <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {scoreCards.map((card) => (
            <ScoreCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
            />
          ))}
        </section>

        {/* Deep Dive Horizontal Secondary Micro-Metrics Strip */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <MetricCard
            label="Study Hours"
            value={`${stats.todayStudyHours || 0}h`}
            icon={Clock3}
          />

          <MetricCard
            label="Completed CP"
            value={`${stats.completedCheckpoints || 0}/${
              stats.totalCheckpoints || 0
            }`}
            icon={ClipboardCheck}
          />

          <MetricCard
            label="Completed Targets"
            value={`${stats.completedTargets || 0}/${
              stats.totalTargets || 0
            }`}
            icon={Target}
          />

          <MetricCard
            label="Today Logs"
            value={stats.todayLogs || 0}
            icon={BookOpen}
          />

          <MetricCard
            label="Timetable Blocks"
            value={stats.activeTimetableBlocks || 0}
            icon={BarChart3}
          />
        </section>

        {/* Double Column Processing Segment Layout */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 items-start">
          
          {/* Main Success Insights Data Container */}
          <div className="lg:col-span-2 rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-7 backdrop-blur-md">
            <div className="mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                  Success Insights
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  AI-ready productivity feedback generated from structured operational data.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchSuccessRate}
                className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-yellow-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-black transition-transform active:scale-[0.99] w-full sm:w-auto shrink-0"
              >
                <RefreshCcw size={18} className="h-3.5 w-3.5" />
                <span>Refresh Score</span>
              </button>
            </div>

            {insights.length === 0 ? (
              <EmptyState
                title="No insights yet"
                text="Add checkpoints, targets, timetable blocks, and learning logs to calculate productivity insights analytics data."
              />
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {insights.map((insight, index) => (
                  <InsightCard
                    key={`${insight.type}-${index}`}
                    insight={insight}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Side Segment Block: Real-time Today Breakdown Core */}
          <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-7 backdrop-blur-md">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Today Breakdown
            </h2>

            <div className="mt-4 sm:mt-6 space-y-3">
              <BreakdownItem
                label="Overall Score"
                value={`${scores.overallScore || 0}%`}
              />

              <BreakdownItem
                label="Productivity Level"
                value={successData?.productivityLevel || "No Data"}
              />

              <BreakdownItem
                label="Study Minutes"
                value={`${stats.todayStudyMinutes || 0} min`}
              />

              <BreakdownItem
                label="Today Log Success"
                value={`${scores.todayLogSuccess || 0}%`}
              />

              <BreakdownItem
                label="Date"
                value={formatDate(successData?.date)}
              />
            </div>
          </div>
        </section>

        {/* Tertiary Bottom Multi-Data Pipeline Tracking Streams */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DataColumn
            title="Pending Checkpoints"
            icon={ClipboardCheck}
            empty="No pending checkpoints."
            items={pendingCheckpoints}
            render={(item) => (
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400">
                  Execution Status: <span className="text-yellow-300 font-medium">{item.status}</span>
                </p>
              </div>
            )}
          />

          <DataColumn
            title="Pending Targets"
            icon={Target}
            empty="No pending targets."
            items={pendingTargets}
            render={(item) => (
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400">
                  Progress: <span className="text-yellow-300 font-semibold">{item.progress || 0}%</span> · Priority Group: <span className="text-slate-300 font-medium">{item.priority}</span>
                </p>
              </div>
            )}
          />

          <DataColumn
            title="Recent Learning Logs"
            icon={BookOpen}
            empty="No learning logs discovered."
            items={recentLogs}
            render={(item) => (
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {item.subjectsStudied?.[0]?.subject || "Study Track Log"}
                </h3>

                <p className="text-xs text-slate-400">
                  Duration: <span className="text-slate-200">{item.totalStudyMinutes || 0} min</span> · Yield Rate: <span className="text-yellow-300 font-semibold">{item.successRate || 0}%</span>
                </p>
              </div>
            )}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}

function SuccessRing({ value, level }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/30 p-4 sm:p-6 text-center flex items-center sm:flex-col justify-between sm:justify-center gap-4 max-w-full sm:min-w-[170px]">
      <div
        className="flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-full mx-auto"
        style={{
          background: `conic-gradient(rgb(250 204 21) ${value}%, rgba(255,255,255,0.05) 0)`,
        }}
      >
        <div className="flex h-16 w-16 sm:h-18 sm:w-18 md:h-22 md:w-22 items-center justify-center rounded-full bg-slate-950">
          <span className="text-xl sm:text-2xl font-black text-white">
            {value}%
          </span>
        </div>
      </div>

      <div className="text-right sm:text-center min-w-0">
        <p className="text-[11px] sm:text-xs font-bold text-yellow-300 tracking-wide uppercase truncate">
          {level}
        </p>
      </div>
    </div>
  )
}

function ScoreCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.04] p-4 sm:p-6 backdrop-blur-md transition-colors duration-200 hover:border-white/10">
      <div className="mb-3.5 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-2xl bg-white/5 text-yellow-300 shadow-inner">
        <Icon className="h-4 w-4 sm:h-6 sm:w-6" size={24} />
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs sm:text-sm font-medium text-slate-400 truncate">
          {label}
        </p>

        <p className="text-sm sm:text-base font-black text-white shrink-0">
          {value}%
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-black/40 border border-white/[0.02]">
        <div
          className="h-full rounded-full bg-yellow-400 transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(value, 100)}%`,
          }}
        />
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.04] p-3.5 sm:p-5 backdrop-blur-md flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
      <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white/5 text-yellow-300">
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

function InsightCard({ insight }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-6 transition-colors duration-150 hover:border-white/10">
      <div className="space-y-3 min-w-0">
        <span
          className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold tracking-wide ${
            priorityStyle[insight.priority] || priorityStyle.Medium
          }`}
        >
          {insight.priority} Priority
        </span>

        <h3 className="text-base sm:text-xl font-bold text-white tracking-tight break-words">
          {insight.type}
        </h3>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-300 break-words">
          {insight.message}
        </p>
      </div>
    </div>
  )
}

function BreakdownItem({ label, value }) {
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

function DataColumn({ title, icon: Icon, empty, items, render }) {
  return (
    <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 backdrop-blur-md flex flex-col h-full">
      <div className="mb-4 flex items-center gap-2.5">
        <Icon className="text-yellow-300 h-5 w-5 sm:h-6 sm:w-6 shrink-0" size={26} />

        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
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
                key={item._id || index}
                className="rounded-xl border border-white/5 bg-black/20 p-3.5 sm:p-4 transition-all duration-150 hover:border-white/10"
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
      <Trophy className="mx-auto text-slate-600 h-8 w-8 sm:h-12 sm:w-12" size={54} />

      <h3 className="mt-4 text-base sm:text-xl font-bold text-white truncate">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
        {text}
      </p>
    </div>
  )
}

function formatDate(value) {
  if (!value) return "No data date"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date configuration"
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default DailySuccessRate