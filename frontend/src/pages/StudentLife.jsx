import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  GraduationCap,
  BookOpen,
  FolderOpen,
  FileText,
  CalendarDays,
  Clock3,
  Target,
  Map,
  Trophy,
  ClipboardCheck,
  BarChart3,
  UserRound,
  Brain,
  LineChart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Construction,
  PlugZap,
  Loader2,
  AlertTriangle,
} from "lucide-react"

import { getStudentLifeDashboard } from "../services/api"

function StudentLife() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const modules = [
    {
      title: "Digital Document Vault",
      icon: FolderOpen,
      route: "/student-life/document-vault",
      description: "Store and organize marksheets, admit cards, certificates, ID cards, and academic files.",
      backendKey: "documentVault",
      status: "Active",
      futureData: "Categories, upload history, extracted text, AI search.",
    },
    {
      title: "Notes Collection",
      icon: FileText,
      route: "/student-life/notes-collection",
      description: "Keep subject notes, formulas, definitions, and short revision material.",
      backendKey: "notesCollection",
      status: "Active",
      futureData: "Tags, revision priority tracking, AI summaries.",
    },
    {
      title: "Exam Schedule",
      icon: CalendarDays,
      route: "/student-life/exams",
      description: "Track exam dates, syllabus completion tracking, and overall preparation level.",
      backendKey: "examSchedule",
      status: "Active",
      futureData: "Syllabus metrics, target weights, difficulty ratios.",
    },
    {
      title: "Daily Timetable",
      icon: Clock3,
      route: "/student-life/timetable",
      description: "Manage college hours, focus time blocks, and standard revision windows.",
      backendKey: "dailyTimetable",
      status: "Active",
      futureData: "Time slots, recurring routines, completion status.",
    },
    {
      title: "Targets & Goals",
      icon: Target,
      route: "/student-life/targets",
      description: "Create daily, weekly, semester, interview prep, and core skill goals.",
      backendKey: "targetsGoals",
      status: "Active",
      futureData: "Category, deadlines, live priority matrix markers.",
    },
    {
      title: "Daily Study Map",
      icon: Map,
      route: "/student-life/daily-study-map",
      description: "Know what to study today based on urgency and academic progress pipelines.",
      backendKey: "dailyStudyMap",
      status: "Active",
      futureData: "AI pipeline queue order, progress checkpoints.",
    },
    {
      title: "Daily Success Rate",
      icon: Trophy,
      route: "/student-life/daily-success-rate",
      description: "Measure execution performance based on scheduled tasks and checkpoints.",
      backendKey: "dailySuccessRate",
      status: "Active",
      futureData: "Task consistency score, performance logs.",
    },
    {
      title: "Checkpoints Monitor",
      icon: ClipboardCheck,
      route: "/student-life/checkpoints",
      description: "Break big goals into small metrics like lectures, code labs, and mocks.",
      backendKey: "checkpoints",
      status: "Active",
      futureData: "Linked targets, target completion weights.",
    },
    {
      title: "Skills Monitor",
      icon: BarChart3,
      route: "/student-life/skills",
      description: "Track developer logic matrices, technical stacks, and industry preparation.",
      backendKey: "skillsMonitor",
      status: "Active",
      futureData: "Skill tier indexes, milestone history parameters.",
    },
    {
      title: "Student Profile Hub",
      icon: UserRound,
      route: "/student-life/profile",
      description: "Store academic records, registration data, course branches, and career direction.",
      backendKey: "studentDataHolder",
      status: "Active",
      futureData: "Course info, primary targets, industry paths.",
    },
    {
      title: "Study Improver Engine",
      icon: Brain,
      route: "/student-life/study-improver",
      description: "AI diagnosis tool to catch system blindspots, gaps, and consistency drops.",
      backendKey: "studyImprover",
      status: "Active",
      futureData: "Weak areas mapping, skipped schedules analytics.",
    },
    {
      title: "AI Study Coach",
      icon: Sparkles,
      route: "/student-life/coach",
      description: "Conversational companion to parse documents, plan sprints, and optimize schedule grids.",
      backendKey: "aiStudyCoach",
      status: "Active",
      futureData: "Context recommendations, system actions pipeline.",
    },
  ]

  const backendPlan = [
    { title: "Student Profile Model", icon: UserRound, description: "Stores metadata fields, university indexing, and career tracks." },
    { title: "Study Session Model", icon: BookOpen, description: "Tracks active timestamp sessions, durations, and focus focus states." },
    { title: "Exam Schedule Model", icon: CalendarDays, description: "Stores absolute target datelines, syllabus depth, and constraints." },
    { title: "Timetable Model", icon: Clock3, description: "Defines routine time blocks, calendar mappings, and repetitions." },
    { title: "Target Model", icon: Target, description: "Calculates metric progress parameters across custom periodic windows." },
    { title: "Checkpoint Model", icon: ClipboardCheck, description: "Maintains granular atomic lists coupled with higher goal nodes." },
  ]

  const aiCapabilities = [
    "Compiles study dynamic strategies directly via active target profiles and exam timelines.",
    "Identifies structural knowledge gaps by auditing dynamic notes data and repository files.",
    "Calculates clean performance insights without visual noise based on validated checkpoints data.",
  ]

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getStudentLifeDashboard()
      setDashboardData(data)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to load Student Life OS dashboard.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const analytics = dashboardData?.analytics || null
  const profile = dashboardData?.profile || null
  const upcoming = dashboardData?.upcoming || {}
  const hasAnalytics = Boolean(analytics)

  const statCards = [
    {
      title: "Study Hours",
      value: hasAnalytics && analytics.totalStudyHours !== undefined ? `${analytics.totalStudyHours}h` : "No data",
      icon: BookOpen,
      description: "Aggregated via logged study blocks.",
    },
    {
      title: "Targets Progress",
      value: hasAnalytics && analytics.targetProgressRate !== undefined ? `${analytics.targetProgressRate}%` : "No data",
      icon: Target,
      description: "Evaluated across current targets.",
    },
    {
      title: "Daily Success Rate",
      value: hasAnalytics && analytics.successRate !== undefined ? `${analytics.successRate}%` : "No data",
      icon: Trophy,
      description: "Calculated via closed checkpoints.",
    },
    {
      title: "Skills Tracked",
      value: hasAnalytics && analytics.totalSkills !== undefined ? analytics.totalSkills : "No data",
      icon: BarChart3,
      description: "Active system technical profiles.",
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[75vh] items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center backdrop-blur-md">
            <Loader2 className="mx-auto animate-spin text-cyan-400" size={26} />
            <h2 className="mt-3 text-base font-bold text-white">Initializing Engine Node</h2>
            <p className="mt-1 text-xs text-slate-500">Querying verified schema assets from cluster...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex gap-3 text-red-300">
            <AlertTriangle size={18} className="shrink-0 text-red-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-white">System Environment Interrupted</h2>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
          >
            Retry Pipeline Connection
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full mx-auto max-w-[1500px] space-y-4 px-2 py-3 sm:space-y-5 sm:px-4 md:space-y-6">
        
        {/* Simplified Structural Banner */}
        <HeroSection profile={profile} />

        {/* Clean Performance Analytics Deck */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </section>

        {/* Master Active Modules Grid */}
        <section className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 backdrop-blur-md sm:p-5 md:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.04] pb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Academic Operation Modules</h2>
              <p className="text-xs text-slate-500 mt-0.5">Functional operational blocks linked directly via API gateways.</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-400 font-medium">
              <PlugZap size={14} className="text-cyan-400 animate-pulse" />
              <span>DB Cluster Linked</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
            {modules.map((module) => (
              <ModuleCard key={module.backendKey} module={module} />
            ))}
          </div>
        </section>

        {/* Operational Flow Streaming Grid */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
          <DataListCard
            title="Schedules & Exams"
            emptyText="No absolute dates configured."
            items={upcoming?.exams || []}
            renderItem={(exam) => (
              <div className="min-w-0 w-full">
                <h3 className="truncate text-xs font-bold text-white">{exam.subject}</h3>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">{formatDate(exam.examDate)}</span>
              </div>
            )}
          />

          <DataListCard
            title="Sprints Progress Logs"
            emptyText="No targets initialized."
            items={upcoming?.targets || []}
            renderItem={(target) => (
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between text-xs font-medium text-slate-400 gap-2 mb-1">
                  <h3 className="truncate text-white">{target.title}</h3>
                  <span className="text-cyan-400 font-bold shrink-0">{target.progress || 0}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all" style={{ width: `${Math.min(target.progress || 0, 100)}%` }} />
                </div>
              </div>
            )}
          />

          <DataListCard
            title="Granular Checkpoints"
            emptyText="All execution checkpoints clear."
            items={upcoming?.checkpoints || []}
            renderItem={(checkpoint) => (
              <div className="min-w-0 w-full flex items-center justify-between gap-3 text-xs">
                <h3 className="truncate font-bold text-white">{checkpoint.title}</h3>
                <span className="shrink-0 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 font-bold text-amber-400 text-[10px]">
                  {checkpoint.status || "Pending"}
                </span>
              </div>
            )}
          />
        </section>

        {/* Dynamic Architectural Metadata Panels */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-4">
          <InfoPanel icon={Layers} title="Infrastructure Models Layout" subtitle="Validated target backend endpoints parameters.">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {backendPlan.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-2.5 rounded-xl border border-white/[0.03] bg-black/20 p-3 min-w-0 w-full">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/5 text-cyan-400"><Icon size={14} /></div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </InfoPanel>

          <InfoPanel icon={Sparkles} title="Optimization AI Capabilities" subtitle="Automated analytics generated processing matrix.">
            <div className="space-y-2">
              {aiCapabilities.map((capability, idx) => (
                <div key={idx} className="flex gap-2.5 rounded-xl border border-white/[0.03] bg-black/20 p-3 items-start">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">{capability}</p>
                </div>
              ))}
            </div>
          </InfoPanel>
        </section>

      </div>
    </DashboardLayout>
  )
}

function HeroSection({ profile }) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.01] p-4 backdrop-blur-md sm:p-5">
      <div className="absolute -right-24 -top-24 h-44 w-44 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-black shadow-md"><GraduationCap size={20} /></div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              <ShieldCheck size={12} /><span>Production Node Active</span>
            </div>
            <h1 className="text-lg font-black text-white mt-1 tracking-tight truncate">Student Life Architecture OS</h1>
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-black/20 p-2.5 sm:min-w-[200px] shrink-0">
          <div className="flex items-center gap-2">
            <Construction size={14} className="text-amber-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Target Profile</p>
              <p className="truncate text-xs font-semibold text-white mt-0.5">{profile?.courseName || "Awaiting Setup"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ card }) {
  const Icon = card.icon
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.title}</span>
        <div className="text-cyan-400 bg-white/5 p-1.5 rounded-lg shrink-0"><Icon size={14} /></div>
      </div>
      <h2 className="mt-2 text-xl font-black text-white tracking-tight truncate">{card.value}</h2>
      <p className="mt-1 text-[10px] text-slate-500 truncate">{card.description}</p>
    </div>
  )
}

function ModuleCard({ module }) {
  const Icon = module.icon
  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4 transition hover:bg-white/[0.02]">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="text-cyan-400 bg-white/5 p-2 rounded-xl shrink-0"><Icon size={16} /></div>
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 tracking-wider uppercase">{module.status}</span>
        </div>
        <h3 className="mt-3 text-sm font-bold text-white tracking-tight truncate">{module.title}</h3>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">{module.description}</p>
        
        <div className="mt-3 rounded-lg border border-white/[0.03] bg-black/10 p-2.5">
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Schema Elements</span>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{module.futureData}</p>
        </div>
      </div>

      <Link to={module.route} className="mt-4 flex items-center justify-between rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-black transition hover:bg-cyan-400 active:scale-[0.98]">
        <span>Execute Portal</span>
        <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  )
}

function InfoPanel({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 backdrop-blur-md">
      <div className="flex items-center gap-2.5 border-b border-white/[0.04] pb-2.5 mb-3.5 w-full">
        <div className="text-cyan-400 shrink-0"><Icon size={16} /></div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xs font-bold text-white uppercase tracking-wider">{title}</h2>
          <p className="truncate text-[10px] text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function DataListCard({ title, emptyText, items, renderItem }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 backdrop-blur-md flex flex-col min-w-0 w-full">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/[0.04] pb-2 mb-3 shrink-0">{title}</h2>
      <div className="space-y-2 flex-1 overflow-hidden">
        {items.length > 0 ? (
          items.slice(0, 3).map((item) => (
            <div key={item._id} className="rounded-lg border border-white/[0.03] bg-black/20 p-3 min-w-0 w-full flex">
              {renderItem(item)}
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-600 font-medium py-2">{emptyText}</p>
        )}
      </div>
    </div>
  )
}

function formatDate(value) {
  if (!value) return "No configuration date"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Invalid timeline"
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

export default StudentLife