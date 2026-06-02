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
  High: "bg-red-500/20 text-red-200 border-red-400/20",
  Medium: "bg-yellow-500/20 text-yellow-200 border-yellow-400/20",
  Low: "bg-green-500/20 text-green-200 border-green-400/20",
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
          "Failed to load Daily Success Rate"
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
  const pendingCheckpoints =
    successData?.pendingCheckpoints || []
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
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-xl">
            <Loader2
              className="mx-auto animate-spin text-yellow-300"
              size={42}
            />

            <h2 className="mt-5 text-2xl font-bold text-white">
              Calculating Daily Success Rate
            </h2>

            <p className="mt-2 text-slate-400">
              Measuring checkpoints, targets, study logs, and productivity.
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
                Daily Success Rate failed
              </h2>

              <p className="mt-2 text-red-200">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchSuccessRate}
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
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-400 text-black">
                <Trophy size={42} />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-200">
                  <Flame size={16} />
                  Performance Analytics
                </div>

                <h1 className="text-4xl font-bold text-white md:text-5xl">
                  Daily Success Rate
                </h1>

                <p className="mt-4 max-w-3xl text-slate-300">
                  Measure today’s productivity using completed checkpoints,
                  target progress, study logs, and learning performance.
                </p>
              </div>
            </div>

            <SuccessRing
              value={scores.overallScore || 0}
              level={successData?.productivityLevel || "No Data"}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {scoreCards.map((card) => (
            <ScoreCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
            />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
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

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Success Insights
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  AI-ready productivity feedback generated from real data.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchSuccessRate}
                className="flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 font-bold text-black"
              >
                <RefreshCcw size={18} />
                Refresh Score
              </button>
            </div>

            {insights.length === 0 ? (
              <EmptyState
                title="No insights yet"
                text="Add checkpoints, targets, timetable blocks, and learning logs to calculate productivity insights."
              />
            ) : (
              <div className="space-y-5">
                {insights.map((insight, index) => (
                  <InsightCard
                    key={`${insight.type}-${index}`}
                    insight={insight}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">
              Today Breakdown
            </h2>

            <div className="mt-6 space-y-4">
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

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <DataColumn
            title="Pending Checkpoints"
            icon={ClipboardCheck}
            empty="No pending checkpoints."
            items={pendingCheckpoints}
            render={(item) => (
              <>
                <h3 className="font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Status: {item.status}
                </p>
              </>
            )}
          />

          <DataColumn
            title="Pending Targets"
            icon={Target}
            empty="No pending targets."
            items={pendingTargets}
            render={(item) => (
              <>
                <h3 className="font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Progress: {item.progress || 0}% · {item.priority}
                </p>
              </>
            )}
          />

          <DataColumn
            title="Recent Learning Logs"
            icon={BookOpen}
            empty="No learning logs."
            items={recentLogs}
            render={(item) => (
              <>
                <h3 className="font-bold text-white">
                  {item.subjectsStudied?.[0]?.subject || "Study Log"}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {item.totalStudyMinutes || 0} min · Success{" "}
                  {item.successRate || 0}%
                </p>
              </>
            )}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}

function SuccessRing({ value, level }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
      <div
        className="mx-auto flex h-32 w-32 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(rgb(250 204 21) ${value}%, rgba(255,255,255,0.1) 0)`,
        }}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950">
          <span className="text-3xl font-bold text-white">
            {value}%
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {level}
      </p>
    </div>
  )
}

function ScoreCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-yellow-300">
        <Icon size={24} />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {label}
        </p>

        <p className="font-bold text-white">
          {value}%
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full rounded-full bg-yellow-400"
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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-yellow-300">
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

function InsightCard({ insight }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
          priorityStyle[insight.priority] || priorityStyle.Medium
        }`}
      >
        {insight.priority} Priority
      </span>

      <h3 className="mt-4 text-xl font-bold text-white">
        {insight.type}
      </h3>

      <p className="mt-3 leading-7 text-slate-300">
        {insight.message}
      </p>
    </div>
  )
}

function BreakdownItem({ label, value }) {
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

function DataColumn({
  title,
  icon: Icon,
  empty,
  items,
  render,
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <Icon className="text-yellow-300" size={26} />

        <h2 className="text-xl font-bold text-white">
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
              key={item._id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
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
      <Trophy size={54} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-2xl font-bold text-white">
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

export default DailySuccessRate