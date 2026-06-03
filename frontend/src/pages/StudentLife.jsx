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
  Database,
  Lock,
  Cpu,
  Activity,
  CheckCircle2,
  Layers,
  ArrowRight,
  Construction,
  Server,
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
      description:
        "Store and organize marksheets, admit cards, certificates, ID cards, PDFs, syllabus, and academic files.",
      backendKey: "documentVault",
      status: "Active",
      futureData:
        "Student documents, categories, upload history, extracted text, AI-searchable records.",
    },
    {
      title: "Notes Collection",
      icon: FileText,
      route: "/student-life/notes-collection",
      description:
        "Keep subject notes, chapter notes, short revision notes, formulas, definitions, and exam material.",
      backendKey: "notesCollection",
      status: "Active",
      futureData:
        "Subject-wise notes, tags, chapters, revision priority, AI summaries.",
    },
    {
      title: "Exam Schedule",
      icon: CalendarDays,
      route: "/student-life/exams",
      description:
        "Track exam dates, syllabus completion, subject priority, preparation level, and deadline pressure.",
      backendKey: "examSchedule",
      status: "Active",
      futureData:
        "Exam date, subject, syllabus status, difficulty, preparation percentage.",
    },
    {
      title: "Daily Timetable",
      icon: Clock3,
      route: "/student-life/timetable",
      description:
        "Manage college hours, study time, skill practice, breaks, revision windows, and personal routines.",
      backendKey: "dailyTimetable",
      status: "Active",
      futureData:
        "Time blocks, task slots, recurring schedule, completion status.",
    },
    {
      title: "Targets & Goals",
      icon: Target,
      route: "/student-life/targets",
      description:
        "Create daily, weekly, semester, career, internship, coding, exam, and skill goals.",
      backendKey: "targetsGoals",
      status: "Active",
      futureData:
        "Goal title, category, deadline, progress, priority, completion status.",
    },
    {
      title: "Daily Study Map",
      icon: Map,
      route: "/student-life/daily-study-map",
      description:
        "Know what to study today, what is pending, what is urgent, and what improves your academic progress.",
      backendKey: "dailyStudyMap",
      status: "Active",
      futureData:
        "Today plan, AI priority, study tasks, recommended order, progress checkpoints.",
    },
    {
      title: "Daily Success Rate",
      icon: Trophy,
      route: "/student-life/daily-success-rate",
      description:
        "Measure daily performance based on completed study tasks, checkpoints, timetable, and targets.",
      backendKey: "dailySuccessRate",
      status: "Active",
      futureData:
        "Completion percentage, task score, consistency score, productivity result.",
    },
    {
      title: "Checkpoints",
      icon: ClipboardCheck,
      route: "/student-life/checkpoints",
      description:
        "Break big academic goals into small measurable checkpoints like lectures, notes, tests, and practice sets.",
      backendKey: "checkpoints",
      status: "Active",
      futureData:
        "Checkpoint title, linked target, completed status, due date, progress weight.",
    },
    {
      title: "Skills Monitor",
      icon: BarChart3,
      route: "/student-life/skills",
      description:
        "Track technical skills, coding skills, aptitude, communication, projects, and career readiness.",
      backendKey: "skillsMonitor",
      status: "Active",
      futureData:
        "Skill name, level, target level, practice logs, progress score.",
    },
    {
      title: "Student Data Holder",
      icon: UserRound,
      route: "/student-life/profile",
      description:
        "Store academic profile, college details, course, semester, subjects, roll number, goals, and career direction.",
      backendKey: "studentDataHolder",
      status: "Active",
      futureData:
        "College, course, semester, subjects, academic profile, career goal.",
    },
    {
      title: "Study Improver",
      icon: Brain,
      route: "/student-life/study-improver",
      description:
        "AI will identify weak areas, poor consistency, incomplete targets, and suggest improvement plans.",
      backendKey: "studyImprover",
      status: "Active",
      futureData:
        "Weak subjects, skipped tasks, study gaps, AI recommendations.",
    },
    {
      title: "Learning Monitor",
      icon: LineChart,
      route: "/student-life/learning",
      description:
        "Monitor long-term learning consistency, subject progress, focus trend, and academic improvement.",
      backendKey: "learningMonitor",
      status: "Active",
      futureData:
        "Learning logs, streaks, progress trends, performance history.",
    },
    {
      title: "AI Study Coach",
      icon: Sparkles,
      route: "/student-life/coach",
      description:
        "Ask AI what to study, how to improve, how to prepare for exams, and how to manage college life.",
      backendKey: "aiStudyCoach",
      status: "Active",
      futureData:
        "AI actions, study recommendations, timetable generation, academic guidance.",
    },
  ]

  const backendPlan = [
    {
      title: "Student Profile Model",
      icon: UserRound,
      description:
        "Stores college, course, semester, subjects, academic goals, and profile data.",
    },
    {
      title: "Study Session Model",
      icon: BookOpen,
      description:
        "Tracks study logs, subject sessions, duration, focus level, and revision history.",
    },
    {
      title: "Exam Schedule Model",
      icon: CalendarDays,
      description:
        "Stores exam dates, subject details, syllabus status, and preparation priority.",
    },
    {
      title: "Timetable Model",
      icon: Clock3,
      description:
        "Stores daily and recurring time blocks for classes, study, skills, and breaks.",
    },
    {
      title: "Target Model",
      icon: Target,
      description:
        "Stores daily, weekly, semester, and career goals with progress tracking.",
    },
    {
      title: "Checkpoint Model",
      icon: ClipboardCheck,
      description:
        "Stores small measurable tasks linked with targets, plans, and study maps.",
    },
    {
      title: "Skill Progress Model",
      icon: BarChart3,
      description:
        "Stores skill levels, practice history, target level, and growth analysis.",
    },
    {
      title: "Learning Log Model",
      icon: LineChart,
      description:
        "Stores daily learning activity, performance trend, consistency, and improvement data.",
    },
  ]

  const aiCapabilities = [
    "AI will generate study plans from student profile, subjects, and exams.",
    "AI will analyze weak areas from notes, files, tasks, and study logs.",
    "AI will create daily study maps using targets, timetable, and deadlines.",
    "AI will calculate success insights from completed checkpoints.",
    "AI will suggest skill improvement based on current skill level and career goal.",
    "AI will answer academic questions using uploaded files, notes, and profile data.",
    "AI will never show fake values; it will depend on backend data only.",
  ]

  const dataRules = [
    {
      icon: Database,
      title: "No Fake Stats",
      text: "No hardcoded study hours, streak, success percentage, or progress data.",
    },
    {
      icon: Server,
      title: "Backend Connected",
      text: "All values will come from MongoDB models and analytics APIs.",
    },
    {
      icon: Cpu,
      title: "AI Powered",
      text: "AI will analyze real student data and return structured actions.",
    },
    {
      icon: Lock,
      title: "Student Data Safe",
      text: "Every document, note, exam, target, and profile record belongs to logged-in user only.",
    },
  ]

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getStudentLifeDashboard()
      setDashboardData(data)
    } catch (err) {
      console.log(err)
      setError(
        err.response?.data?.message ||
          "Failed to load Student Life OS dashboard."
      )
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
      value:
        hasAnalytics && analytics.totalStudyHours !== undefined
          ? `${analytics.totalStudyHours}h`
          : "No data",
      icon: BookOpen,
      description: "Calculated from saved study sessions.",
    },
    {
      title: "Targets Progress",
      value:
        hasAnalytics && analytics.targetProgressRate !== undefined
          ? `${analytics.targetProgressRate}%`
          : "No data",
      icon: Target,
      description: "Based on completed targets.",
    },
    {
      title: "Daily Success Rate",
      value:
        hasAnalytics && analytics.successRate !== undefined
          ? `${analytics.successRate}%`
          : "No data",
      icon: Trophy,
      description: "Based on completed checkpoints.",
    },
    {
      title: "Skills Tracked",
      value:
        hasAnalytics && analytics.totalSkills !== undefined
          ? analytics.totalSkills
          : "No data",
      icon: BarChart3,
      description: "Based on skill progress records.",
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[75vh] items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-white/5 p-6 text-center backdrop-blur-lg sm:max-w-md sm:p-8">
            <Loader2 className="mx-auto animate-spin text-cyan-400" size={32} />
            <h2 className="mt-4 text-lg font-bold text-white sm:text-xl">
              Loading Student Life OS
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Fetching real student data from backend...
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-500/20 bg-red-500/10 p-5 sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 text-red-300 sm:flex-row sm:items-start sm:gap-4">
            <AlertTriangle size={24} className="shrink-0 mt-0.5 text-red-400" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold sm:text-xl">
                Student Life OS failed to load
              </h2>
              <p className="mt-1.5 text-sm text-red-200/80 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-4 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-red-400 active:scale-95"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full mx-auto max-w-[1600px] space-y-5 px-2 py-3 sm:space-y-6 sm:px-4 md:space-y-8 md:py-4">
        
        {/* Banner Section */}
        <HeroSection profile={profile} />

        {/* Analytics Statistics Grid */}
        <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {statCards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </section>

        {/* Data Integration & Principles Grid */}
        <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {dataRules.map((rule) => (
            <RuleCard key={rule.title} rule={rule} />
          ))}
        </section>

        {/* Main Operational Core Modules Grid */}
        <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md sm:p-6 md:p-8">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/[0.04] pb-5">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl tracking-tight">
                Student Life Modules
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                Each module is connected with backend APIs and real MongoDB data.
              </p>
            </div>

            <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-300">
              <PlugZap size={16} className="shrink-0 text-cyan-400 animate-pulse" />
              <span className="truncate font-medium">MongoDB dashboard API connected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {modules.map((module) => (
              <ModuleCard key={module.backendKey} module={module} />
            ))}
          </div>
        </section>

        {/* Dynamic Aggregated Upcoming Tasks & Schedules lists */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
          <DataListCard
            title="Upcoming Exams"
            emptyText="No upcoming exams found."
            items={upcoming?.exams || []}
            renderItem={(exam) => (
              <div className="min-w-0 w-full">
                <h3 className="truncate text-sm font-bold text-white">{exam.subject}</h3>
                <p className="mt-1 text-xs text-slate-400 font-medium">
                  {formatDate(exam.examDate)}
                </p>
              </div>
            )}
          />

          <DataListCard
            title="Active Targets"
            emptyText="No active targets found."
            items={upcoming?.targets || []}
            renderItem={(target) => (
              <div className="min-w-0 w-full">
                <h3 className="truncate text-sm font-bold text-white">{target.title}</h3>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(target.progress || 0, 100)}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-cyan-400 shrink-0">
                    {target.progress || 0}%
                  </span>
                </div>
              </div>
            )}
          />

          <DataListCard
            title="Pending Checkpoints"
            emptyText="No pending checkpoints found."
            items={upcoming?.checkpoints || []}
            renderItem={(checkpoint) => (
              <div className="min-w-0 w-full flex items-center justify-between gap-3">
                <h3 className="truncate text-sm font-bold text-white">{checkpoint.title}</h3>
                <span className="shrink-0 px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-xs font-medium text-amber-300">
                  {checkpoint.status || "Pending"}
                </span>
              </div>
            )}
          />
        </section>

        {/* Database Modeling Structure & Predictive Analysis Engine Panel */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-5">
          <InfoPanel
            icon={Layers}
            title="Backend Models Plan"
            subtitle="These collections power the real data."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {backendPlan.map((item) => (
                <BackendPlanItem key={item.title} item={item} />
              ))}
            </div>
          </InfoPanel>

          <InfoPanel
            icon={Sparkles}
            title="AI Study Engine"
            subtitle="AI actions will work only on real saved data."
          >
            <div className="space-y-3">
              {aiCapabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-4"
                >
                  <div className="mt-0.5 shrink-0 text-cyan-400">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {capability}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <Activity size={16} className="shrink-0 text-cyan-400" />
                <h3 className="text-sm font-bold">Next Development Phase</h3>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Next upgrades can include real AI timetable generation, OCR document reading,
                notes summarization, revision reminders, and skill-based study recommendations.
              </p>
            </div>
          </InfoPanel>
        </section>
      </div>
    </DashboardLayout>
  )
}

function HeroSection({ profile }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md sm:p-6 md:p-8">
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4 md:gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-black shadow-lg shadow-cyan-500/10 sm:h-14 sm:w-14 sm:rounded-2xl">
            <GraduationCap size={24} />
          </div>

          <div className="min-w-0">
            <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <ShieldCheck size={14} className="shrink-0" />
              <span className="truncate">Live Production Environment</span>
            </div>

            <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl tracking-tight">
              Student Life OS
            </h1>

            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-400">
              A complete AI-powered academic life management system for college
              students. This dashboard uses backend data only and avoids fake
              static statistics.
            </p>
          </div>
        </div>

        <div className="w-full rounded-xl border border-white/5 bg-white/[0.02] p-4 lg:w-auto lg:min-w-[260px] shrink-0">
          <div className="flex items-center gap-3 text-slate-300">
            <Construction size={18} className="shrink-0 text-amber-400" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Profile</p>
              <p className="truncate text-sm font-semibold text-white mt-1">
                {profile?.courseName || "Profile not completed"}
              </p>
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
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md hover:border-white/10 transition-colors">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
        <Icon size={18} />
      </div>

      <p className="text-sm font-medium text-slate-400">{card.title}</p>

      <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl tracking-tight">
        {card.value}
      </h2>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        {card.description}
      </p>
    </div>
  )
}

function RuleCard({ rule }) {
  const Icon = rule.icon

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
        <Icon size={18} />
      </div>

      <h2 className="text-sm font-bold text-white sm:text-base">
        {rule.title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {rule.text}
      </p>
    </div>
  )
}

function ModuleCard({ module }) {
  const Icon = module.icon

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-5 transition-all duration-300 hover:bg-white/[0.03] hover:border-white/10 md:hover:-translate-y-0.5">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-500/[0.02] blur-2xl pointer-events-none transition group-hover:bg-cyan-500/5" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
              <Icon size={20} />
            </div>

            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 tracking-wide uppercase">
              {module.status}
            </span>
          </div>

          <h3 className="mt-4 text-base font-bold text-white tracking-tight">
            {module.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-400 lg:min-h-[72px]">
            {module.description}
          </p>

          <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Backend Properties
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {module.futureData}
            </p>
          </div>
        </div>

        <Link
          to={module.route}
          className="mt-5 flex w-full items-center justify-between rounded-xl bg-cyan-500 px-4 py-3 text-left text-sm font-bold text-black shadow-md shadow-cyan-500/5 transition hover:bg-cyan-400 active:scale-[0.98]"
        >
          <span>Open Module</span>
          <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

function InfoPanel({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md sm:p-6">
      <SectionHeader icon={Icon} title={title} subtitle={subtitle} />
      <div className="mt-5">{children}</div>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.04] pb-4 w-full">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-bold text-white tracking-tight">
          {title}
        </h2>
        <p className="truncate text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

function BackendPlanItem({ item }) {
  const Icon = item.icon

  return (
    <div className="flex gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 w-full">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-white">{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          {item.description}
        </p>
      </div>
    </div>
  )
}

function DataListCard({ title, emptyText, items, renderItem }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md flex flex-col min-w-0 w-full">
      <h2 className="text-base font-bold text-white tracking-tight border-b border-white/[0.04] pb-3">
        {title}
      </h2>

      <div className="mt-4 space-y-3 flex-1 overflow-hidden">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 flex w-full"
            >
              {renderItem(item)}
            </div>
          ))
        ) : (
          <div className="py-4 text-left">
            <p className="text-sm text-slate-500 font-medium">{emptyText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(value) {
  if (!value) return "No date"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default StudentLife