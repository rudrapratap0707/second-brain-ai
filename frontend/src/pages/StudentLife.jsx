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
          <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-white/5 p-5 text-center backdrop-blur-lg sm:max-w-md sm:rounded-3xl sm:border-white/10 sm:bg-white/10 sm:p-8">
            <Loader2 className="mx-auto animate-spin text-cyan-400" size={36} />

            <h2 className="mt-4 text-lg font-bold text-white sm:mt-5 sm:text-xl md:text-2xl">
              Loading Student Life OS
            </h2>

            <p className="mt-2 text-xs text-slate-400 sm:text-sm md:text-base">
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
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 sm:rounded-3xl sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 text-red-300 sm:flex-row sm:items-center sm:gap-4">
            <AlertTriangle size={26} className="shrink-0" />

            <div>
              <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
                Student Life OS failed to load
              </h2>

              <p className="mt-1 text-xs text-red-200/80 sm:text-sm md:text-base">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-5 rounded-xl bg-red-400 px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-red-300 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm md:text-base"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-shell space-y-4 sm:space-y-6 md:space-y-8">
        <HeroSection profile={profile} />

        {/* Analytics Statistics Grid */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </section>

        {/* Data Integration & Principles Grid */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {dataRules.map((rule) => (
            <RuleCard key={rule.title} rule={rule} />
          ))}
        </section>

        {/* Main Operational Core Modules Grid */}
        <section className="rounded-2xl border border-white/5 bg-white/5 p-3.5 backdrop-blur-lg sm:rounded-3xl sm:border-white/10 sm:bg-white/10 sm:p-6 md:p-8">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                Student Life Modules
              </h2>

              <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm md:text-base">
                Each module is connected with backend APIs and real MongoDB data.
              </p>
            </div>

            <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-[11px] text-slate-300 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-xs md:text-sm">
              <PlugZap size={16} className="shrink-0 text-cyan-300" />
              <span className="truncate">MongoDB dashboard API connected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:gap-4">
            {modules.map((module) => (
              <ModuleCard key={module.backendKey} module={module} />
            ))}
          </div>
        </section>

        {/* Dynamic Aggregated Upcoming Tasks & Schedules lists */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-5">
          <DataListCard
            title="Upcoming Exams"
            emptyText="No upcoming exams found."
            items={upcoming?.exams || []}
            renderItem={(exam) => (
              <>
                <h3 className="text-sm font-bold text-white sm:text-base">{exam.subject}</h3>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  {formatDate(exam.examDate)}
                </p>
              </>
            )}
          />

          <DataListCard
            title="Active Targets"
            emptyText="No active targets found."
            items={upcoming?.targets || []}
            renderItem={(target) => (
              <>
                <h3 className="text-sm font-bold text-white sm:text-base">{target.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Progress: {target.progress || 0}%
                </p>
              </>
            )}
          />

          <DataListCard
            title="Pending Checkpoints"
            emptyText="No pending checkpoints found."
            items={upcoming?.checkpoints || []}
            renderItem={(checkpoint) => (
              <>
                <h3 className="text-sm font-bold text-white sm:text-base">{checkpoint.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  {checkpoint.status}
                </p>
              </>
            )}
          />
        </section>

        {/* Database Modeling Structure & Predictive Analysis Engine Panel */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-5">
          <InfoPanel
            icon={Layers}
            title="Backend Models Plan"
            subtitle="These collections power the real data."
          >
            <div className="space-y-3 sm:space-y-4">
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
            <div className="space-y-3 sm:space-y-4">
              {aiCapabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex gap-2.5 rounded-xl border border-white/5 bg-black/10 p-3 sm:rounded-2xl sm:border-white/10 sm:bg-black/20 sm:p-4 sm:gap-4"
                >
                  <div className="mt-0.5 shrink-0 text-cyan-300">
                    <CheckCircle2 size={16} className="sm:w-5 sm:h-5" />
                  </div>

                  <p className="text-xs leading-relaxed text-slate-300 sm:text-sm sm:leading-6">
                    {capability}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-3.5 sm:mt-5 sm:rounded-2xl sm:border-cyan-400/20 sm:bg-cyan-400/10 sm:p-5">
              <div className="flex items-center gap-2.5 text-cyan-200">
                <Activity size={18} className="shrink-0 sm:w-5 sm:h-5" />
                <h3 className="text-sm font-bold sm:text-base">Next Development Phase</h3>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:mt-3 sm:text-sm sm:leading-6">
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
    <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-lg sm:rounded-3xl sm:border-white/10 sm:bg-white/10 sm:p-6 md:p-8">
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl sm:h-56 sm:w-56 md:h-72 md:w-72" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl sm:h-56 sm:w-56 md:h-72 md:w-72" />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between sm:gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 md:gap-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-black shadow-md shadow-cyan-500/10 sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16">
            <GraduationCap size={22} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 sm:px-3 sm:py-1.5 sm:text-xs md:text-sm">
              <ShieldCheck size={14} className="shrink-0" />
              <span className="truncate">Backend connected dashboard</span>
            </div>

            <h1 className="text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-4xl lg:text-5xl">
              Student Life OS
            </h1>

            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-300 sm:text-sm sm:leading-6 md:mt-3">
              A complete AI-powered academic life management system for college
              students. This dashboard uses backend data only and avoids fake
              static statistics.
            </p>
          </div>
        </div>

        <div className="w-full rounded-xl border border-white/5 bg-black/10 p-3 sm:rounded-2xl sm:border-white/10 sm:p-4 lg:w-auto lg:min-w-[240px]">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Construction size={18} className="shrink-0 text-yellow-300 sm:w-5 sm:h-5" />

            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 sm:text-xs">Current Profile</p>
              <p className="truncate text-xs font-semibold text-white sm:text-sm">
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
    <div className="rounded-2xl border border-white/5 bg-white/5 p-3.5 backdrop-blur-lg sm:rounded-3xl sm:border-white/10 sm:p-5 md:p-6">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-cyan-300 sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl md:mb-5 md:h-12 md:w-12">
        <Icon size={18} className="sm:w-6 sm:h-6" />
      </div>

      <p className="text-xs text-slate-400 sm:text-sm">{card.title}</p>

      <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">
        {card.value}
      </h2>

      <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
        {card.description}
      </p>
    </div>
  )
}

function RuleCard({ rule }) {
  const Icon = rule.icon

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-3.5 backdrop-blur-lg sm:rounded-3xl sm:border-white/10 sm:p-5 md:p-6">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-cyan-300 sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl md:mb-5 md:h-12 md:w-12">
        <Icon size={18} className="sm:w-6 sm:h-6" />
      </div>

      <h2 className="text-sm font-bold text-white sm:text-base md:text-lg">
        {rule.title}
      </h2>

      <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm sm:leading-6">
        {rule.text}
      </p>
    </div>
  )
}

function ModuleCard({ module }) {
  const Icon = module.icon

  return (
    <article className="group relative flex min-h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-black/10 p-3.5 transition duration-300 hover:bg-white/5 sm:rounded-3xl sm:border-white/10 sm:bg-black/20 sm:p-5 md:p-6 md:hover:-translate-y-1 md:hover:bg-white/10">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl transition group-hover:bg-cyan-500/10 sm:h-32 sm:w-32" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-300 sm:h-12 sm:w-12 sm:rounded-2xl md:h-14 md:w-14">
            <Icon size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>

          <span className="rounded-full border border-green-400/20 bg-green-400/10 px-2 py-0.5 text-[10px] font-semibold text-green-200 sm:px-3 sm:py-1 sm:text-xs">
            {module.status}
          </span>
        </div>

        <h3 className="mt-3.5 text-base font-bold text-white sm:mt-4 md:mt-5 md:text-xl">
          {module.title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm sm:leading-6 lg:min-h-[72px]">
          {module.description}
        </p>

        <div className="mt-3.5 rounded-xl border border-white/5 bg-white/5 p-3 sm:mt-4 sm:rounded-2xl sm:border-white/10 sm:p-4 md:mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
            Backend Data
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm sm:leading-6">
            {module.futureData}
          </p>
        </div>

        <Link
          to={module.route}
          className="mt-4 flex w-full items-center justify-between rounded-xl bg-cyan-500 px-3.5 py-2.5 text-left text-xs font-bold text-black transition active:scale-[0.98] sm:mt-5 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm lg:hover:scale-[1.02]"
        >
          <span>Open Module</span>
          <ArrowRight size={16} className="shrink-0 sm:w-4 sm:h-4" />
        </Link>
      </div>
    </article>
  )
}

function InfoPanel({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-3.5 backdrop-blur-lg sm:rounded-3xl sm:border-white/10 sm:bg-white/10 sm:p-6 md:p-7 text-left">
      <SectionHeader icon={Icon} title={title} subtitle={subtitle} />
      {children}
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-2.5 sm:mb-5 md:mb-6 md:items-center">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-300 sm:h-11 sm:w-11 sm:rounded-2xl md:h-12 md:w-12">
        <Icon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-base font-bold text-white sm:text-xl md:text-2xl">
          {title}
        </h2>
        <p className="truncate text-xs text-slate-400 sm:text-sm">{subtitle}</p>
      </div>
    </div>
  )
}

function BackendPlanItem({ item }) {
  const Icon = item.icon

  return (
    <div className="flex gap-2.5 rounded-xl border border-white/5 bg-black/10 p-3 sm:rounded-2xl sm:border-white/10 sm:bg-black/20 sm:p-4 sm:gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-300 sm:h-11 sm:w-11 sm:rounded-xl">
        <Icon size={18} className="sm:w-5 sm:h-5" />
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-bold text-white sm:text-base">{item.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm sm:leading-6">
          {item.description}
        </p>
      </div>
    </div>
  )
}

function DataListCard({ title, emptyText, items, renderItem }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-3.5 backdrop-blur-lg sm:rounded-3xl sm:border-white/10 sm:bg-white/10 sm:p-6 md:p-7 text-left">
      <h2 className="text-base font-bold text-white sm:text-xl md:text-2xl">
        {title}
      </h2>

      <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-white/5 bg-black/10 p-3 sm:rounded-2xl sm:border-white/10 sm:bg-black/20 sm:p-4"
            >
              {renderItem(item)}
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 sm:text-sm">{emptyText}</p>
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