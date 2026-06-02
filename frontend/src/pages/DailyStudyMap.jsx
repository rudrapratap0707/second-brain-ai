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
  High: "bg-red-500/20 text-red-200 border-red-400/20",
  Medium: "bg-yellow-500/20 text-yellow-200 border-yellow-400/20",
  Low: "bg-green-500/20 text-green-200 border-green-400/20",
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
          "Failed to load Daily Study Map"
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
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-xl">
            <Loader2 className="mx-auto animate-spin text-cyan-400" size={42} />

            <h2 className="mt-5 text-2xl font-bold text-white">
              Building Today’s Study Map
            </h2>

            <p className="mt-2 text-slate-400">
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
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8">
          <div className="flex items-center gap-4 text-red-300">
            <AlertTriangle size={30} />

            <div>
              <h2 className="text-2xl font-bold">
                Daily Study Map failed
              </h2>

              <p className="mt-2 text-red-200">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchMap}
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
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500 text-black">
                <Map size={42} />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                  <Brain size={16} />
                  Today Command Plan
                </div>

                <h1 className="text-4xl font-bold text-white md:text-5xl">
                  Daily Study Map
                </h1>

                <p className="mt-4 max-w-3xl text-slate-300">
                  Smart daily study direction generated from your real exams,
                  targets, checkpoints, weak skills, notes, and learning logs.
                </p>
              </div>
            </div>

            <CommandRing value={planScore} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
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

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Today’s Recommended Study Order
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Sorted by urgency, weak areas, deadlines, and revision need.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchMap}
                className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-bold text-black"
              >
                <RefreshCcw size={18} />
                Refresh Map
              </button>
            </div>

            {todayPlan.length === 0 ? (
              <EmptyState
                title="No study map yet"
                text="Add exams, targets, checkpoints, skills, learning logs, and notes to generate today’s plan."
              />
            ) : (
              <div className="relative space-y-5">
                <div className="absolute left-6 top-0 h-full w-px bg-white/10" />

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

          <div className="space-y-8">
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

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
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
                  Progress: {item.progress || 0}% · Priority: {item.priority}
                </p>
              </>
            )}
          />

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
                  {item.category || "General"} · {item.status}
                </p>
              </>
            )}
          />

          <DataColumn
            title="Revision Notes"
            icon={BookOpen}
            empty="No revision notes found."
            items={revisionNotes}
            render={(item) => (
              <>
                <h3 className="font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {item.subject} · {item.revisionStatus}
                </p>
              </>
            )}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}

function PlanTask({ task, index }) {
  return (
    <div className="relative flex gap-5">
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-cyan-300">
        {index + 1}
      </div>

      <div className="flex-1 rounded-3xl border border-white/10 bg-black/20 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  priorityStyle[task.priority] ||
                  priorityStyle.Medium
                }`}
              >
                {task.priority} Priority
              </span>

              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                {task.type}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-bold text-white">
              {task.title}
            </h3>

            <p className="mt-2 text-slate-400">
              {task.subject}
            </p>

            <p className="mt-4 leading-7 text-slate-300">
              {task.reason}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
            <Clock3 size={20} className="mx-auto text-cyan-300" />

            <p className="mt-1 text-sm font-semibold text-white">
              {task.estimatedMinutes || 0} min
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoPanel({
  title,
  icon: Icon,
  empty,
  items,
  render,
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <Icon className="text-cyan-300" size={26} />

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
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`}>
              {render(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SmallInsight({ title, subtitle, priority }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
          priorityStyle[priority] || priorityStyle.Medium
        }`}
      >
        {priority}
      </span>

      <h3 className="mt-3 font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {subtitle}
      </p>
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
        <Icon className="text-cyan-300" size={26} />

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

function CommandRing({ value }) {
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
        Today Map Score
      </p>
    </div>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
      <Map size={54} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-slate-400">
        {text}
      </p>
    </div>
  )
}

export default DailyStudyMap