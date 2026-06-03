import { useEffect, useMemo, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import {
  Map,
  Loader2,
  AlertTriangle,
  Clock3,
  Target,
  Zap,
  Brain,
  BookOpen,
  Flame,
  CalendarDays,
  ClipboardCheck,
  RefreshCcw,
} from "lucide-react"

import { getDailyStudyMap } from "../services/api"

const priorityStyle = {
  High: "bg-red-500/10 text-red-300 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  Low: "bg-green-500/10 text-green-300 border-green-500/20",
}

function DailyStudyMap() {
  const [mapData, setMapData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchMap = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getDailyStudyMap()
      setMapData(data)
    } catch (err) {
      console.log(err)
      setError(
        err.response?.data?.message ||
          "Failed to load Daily Study Map configurations"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMap()
  }, [])

  const summary = mapData?.summary || {}
  const todayPlan = mapData?.todayPlan || []
  const urgentItems = mapData?.urgentItems || []
  const improvementFocus = mapData?.improvementFocus || []
  const pendingTargets = mapData?.pendingTargets || []
  const pendingCheckpoints = mapData?.pendingCheckpoints || []
  const revisionNotes = mapData?.revisionNotes || []

  const planScore = useMemo(() => {
    const tasks = Number(summary.totalTasks || 0)
    const urgent = Number(summary.urgentItems || 0)
    const focus = Number(summary.avgFocus || 0) * 20

    if (tasks === 0) return 0

    return Math.min(
      100,
      Math.round(tasks * 10 + urgent * 8 + focus * 0.4)
    )
  }, [summary])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[65vh] sm:min-h-[70vh] items-center justify-center px-3 sm:px-4">
          <div className="w-full max-w-md rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.04] p-6 sm:p-8 text-center backdrop-blur-md">
            <Loader2 className="mx-auto animate-spin text-cyan-400 h-9 w-9 sm:h-11 sm:w-11" />
            <h2 className="mt-4 sm:mt-5 text-lg sm:text-2xl font-bold text-white tracking-tight">
              Building Today’s Study Map
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Analyzing exams, targets, checkpoints, skills, notes, timetable, and learning logs.
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
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Daily Study Map Failed
                </h2>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-200/80 leading-relaxed break-words">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchMap}
              className="mt-6 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-red-400 px-5 py-3 text-xs sm:text-sm font-bold text-black transition-transform active:scale-[0.99]"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Retry Integration</span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto px-1 sm:px-4">
        
        {/* Core Tactical Map Workspace Header */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-[36px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-8 backdrop-blur-md">
          <div className="absolute -right-24 -top-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl md:rounded-3xl bg-cyan-500 text-black shadow-md">
                <Map className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>

              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-cyan-300">
                  <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>Today Command Plan</span>
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  Daily Study Map
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Smart daily study direction generated from your real exams, targets, checkpoints, weak skills, notes, and learning logs.
                </p>
              </div>
            </div>

            <div className="self-start sm:self-center lg:self-auto w-full sm:w-auto shrink-0">
              <CommandRing value={planScore} />
            </div>
          </div>
        </section>

        {/* Distributed Performance Metric Widgets */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            icon={Target}
            label="Tasks"
            value={summary.totalTasks || 0}
          />
          <MetricCard
            icon={Clock3}
            label="Planned Time"
            value={`${summary.totalPlannedMinutes || 0}m`}
          />
          <MetricCard
            icon={Flame}
            label="Urgent"
            value={summary.urgentItems || 0}
          />
          <MetricCard
            icon={Brain}
            label="Focus Avg"
            value={`${summary.avgFocus || 0}/5`}
          />
          <MetricCard
            icon={BookOpen}
            label="Recent Study"
            value={`${summary.recentStudyHours || 0}h`}
          />
        </section>

        {/* Central Core Adaptive Processing Panels */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 items-start">
          
          {/* Main Chronological Recommender Core */}
          <div className="lg:col-span-2 rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 md:p-7 backdrop-blur-md">
            <div className="mb-5 sm:mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                  Today’s Recommended Study Order
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Sorted by urgency, weak areas, deadlines, and revision need.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchMap}
                className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-cyan-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-black transition-transform active:scale-[0.99] w-full sm:w-auto shrink-0"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Refresh Map</span>
              </button>
            </div>

            {todayPlan.length === 0 ? (
              <EmptyState
                title="No study map yet"
                text="Add exams, targets, checkpoints, skills, learning logs, and notes to generate today’s plan."
              />
            ) : (
              <div className="relative space-y-4 sm:space-y-5 pl-2 sm:pl-0">
                <div className="absolute left-4 sm:left-6 top-0 h-full w-px bg-white/10 pointer-events-none" />

                {todayPlan.map((task, index) => (
                  <PlanTask
                    key={`${task.title}-${index}`}
                    task={task}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Secondary Analytical Insights Sidebar Column */}
          <div className="space-y-4 sm:space-y-6">
            <InfoPanel
              title="Urgent Items"
              icon={Flame}
              empty="No urgent item found."
              items={urgentItems}
              render={(item) => (
                <SmallInsight
                  title={item.title}
                  subtitle={item.reason}
                  priority={item.priority}
                />
              )}
            />

            <InfoPanel
              title="Improvement Focus"
              icon={Zap}
              empty="No weak focus detected."
              items={improvementFocus}
              render={(item) => (
                <SmallInsight
                  title={item.title}
                  subtitle={item.reason}
                  priority={item.priority}
                />
              )}
            />
          </div>
        </section>

        {/* Detailed Target Real-Time Execution Blocks */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  Progress Status: <span className="text-cyan-300 font-semibold">{item.progress || 0}%</span> · Priority: <span className="text-slate-300 font-medium">{item.priority}</span>
                </p>
              </div>
            )}
          />

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
                  {item.category || "General Context"} · <span className="text-cyan-300 font-medium">{item.status}</span>
                </p>
              </div>
            )}
          />

          <DataColumn
            title="Revision Notes"
            icon={BookOpen}
            empty="No revision notes found."
            items={revisionNotes}
            render={(item) => (
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {item.subject} · <span className="text-slate-300 font-medium">{item.revisionStatus}</span>
                </p>
              </div>
            )}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}

function PlanTask({ task, index }) {
  return (
    <div className="relative flex gap-3 sm:gap-5 group">
      <div className="relative z-10 flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950 text-xs sm:text-sm font-bold text-cyan-300 shadow-sm mt-1 sm:mt-0">
        {index + 1}
      </div>

      <div className="flex-1 rounded-2xl sm:rounded-3xl border border-white/5 bg-black/20 p-4 sm:p-6 transition-colors duration-200 group-hover:border-white/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold tracking-wide ${
                  priorityStyle[task.priority] || priorityStyle.Medium
                }`}
              >
                {task.priority} Priority
              </span>

              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-cyan-300">
                {task.type}
              </span>
            </div>

            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight break-words">
              {task.title}
            </h3>

            <p className="text-xs sm:text-sm text-cyan-300/80 font-medium">
              {task.subject}
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 break-words pt-1">
              {task.reason}
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-white/[0.04] p-3 text-center flex lg:flex-col items-center justify-between lg:justify-center gap-2 lg:min-w-[100px] shrink-0 border border-white/5">
            <div className="flex items-center justify-center rounded-lg bg-white/5 p-1.5 text-cyan-300 shrink-0">
              <Clock3 className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-white">
              {task.estimatedMinutes || 0} min
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoPanel({ title, icon: Icon, empty, items, render }) {
  return (
    <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 backdrop-blur-md flex flex-col h-full">
      <div className="mb-4 flex items-center gap-2.5">
        <Icon className="text-cyan-300 h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
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
              <div key={`${item.title}-${index}`} className="w-full">
                {render(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SmallInsight({ title, subtitle, priority }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/20 p-3.5 sm:p-4">
      <div className="space-y-2">
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
            priorityStyle[priority] || priorityStyle.Medium
          }`}
        >
          {priority}
        </span>

        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight break-words">
          {title}
        </h3>

        <p className="text-[11px] sm:text-xs leading-relaxed text-slate-400 break-words">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function DataColumn({ title, icon: Icon, empty, items, render }) {
  return (
    <div className="rounded-2xl md:rounded-[32px] border border-white/5 bg-white/[0.05] p-4 sm:p-6 backdrop-blur-md flex flex-col h-full">
      <div className="mb-4 flex items-center gap-2.5">
        <Icon className="text-cyan-300 h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
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

function CommandRing({ value }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-black/30 p-4 sm:p-6 text-center flex items-center sm:flex-col justify-between sm:justify-center gap-4 max-w-full sm:min-w-[170px]">
      <div
        className="flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-full mx-auto"
        style={{
          background: `conic-gradient(rgb(34 211 238) ${value}%, rgba(255,255,255,0.05) 0)`,
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
          Today Map Score
        </p>
      </div>
    </div>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-dashed border-white/5 p-6 sm:p-10 text-center my-auto w-full">
      <Map className="mx-auto text-slate-600 h-8 w-8 sm:h-11 sm:w-11" />
      <h3 className="mt-3.5 text-base sm:text-xl font-bold text-white truncate">
        {title}
      </h3>
      <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
        {text}
      </p>
    </div>
  )
}

export default DailyStudyMap