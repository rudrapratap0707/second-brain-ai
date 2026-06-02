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
      title: "Study Planner",
      icon: BookOpen,
      route: "/student-life/study-planner",
      description:
        "Plan subject-wise study sessions, weekly learning flow, backlog recovery, and revision cycles.",
      backendKey: "studyPlanner",
      status: "Active",
      futureData:
        "Study sessions, subject plans, study hours, revision status, backlog progress.",
    },
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
        <div className="flex min-h-[70vh] items-center justify-center px-2">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-xl md:p-8">
            <Loader2 className="mx-auto animate-spin text-cyan-400" size={42} />

            <h2 className="mt-5 text-xl font-bold text-white md:text-2xl">
              Loading Student Life OS
            </h2>

            <p className="mt-2 text-sm text-slate-400 md:text-base">
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
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 md:p-8">
          <div className="flex flex-col gap-4 text-red-300 sm:flex-row sm:items-center">
            <AlertTriangle size={30} />

            <div>
              <h2 className="text-xl font-bold md:text-2xl">
                Student Life OS failed to load
              </h2>

              <p className="mt-2 text-sm text-red-200 md:text-base">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-6 rounded-2xl bg-red-400 px-5 py-3 text-sm font-semibold text-black md:text-base"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-shell space-y-5 md:space-y-8">
        <HeroSection profile={profile} />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dataRules.map((rule) => (
            <RuleCard key={rule.title} rule={rule} />
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-7">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white md:text-2xl">
                Student Life Modules
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400 md:text-base">
                Each module is connected with backend APIs and real MongoDB data.
              </p>
            </div>

            <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs text-slate-300 md:text-sm">
              <PlugZap size={18} className="shrink-0 text-cyan-300" />
              <span>MongoDB dashboard API connected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {modules.map((module) => (
              <ModuleCard key={module.backendKey} module={module} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <DataListCard
            title="Upcoming Exams"
            emptyText="No upcoming exams found."
            items={upcoming?.exams || []}
            renderItem={(exam) => (
              <>
                <h3 className="font-bold text-white">{exam.subject}</h3>
                <p className="mt-1 text-sm text-slate-400">
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
                <h3 className="font-bold text-white">{target.title}</h3>
                <p className="mt-1 text-sm text-slate-400">
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
                <h3 className="font-bold text-white">{checkpoint.title}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {checkpoint.status}
                </p>
              </>
            )}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <InfoPanel
            icon={Layers}
            title="Backend Models Plan"
            subtitle="These collections power the real data."
          >
            <div className="space-y-4">
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
            <div className="space-y-4">
              {aiCapabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:gap-4"
                >
                  <div className="mt-1 shrink-0 text-cyan-300">
                    <CheckCircle2 size={20} />
                  </div>

                  <p className="text-sm leading-6 text-slate-300">
                    {capability}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 md:p-5">
              <div className="flex items-center gap-3 text-cyan-200">
                <Activity size={22} />
                <h3 className="font-bold">Next Development Phase</h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">
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
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
      <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl md:h-72 md:w-72" />
      <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl md:h-72 md:w-72" />

      <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start md:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 md:h-16 md:w-16">
            <GraduationCap size={30} />
          </div>

          <div>
            <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300 md:px-4 md:text-sm">
              <ShieldCheck size={16} className="shrink-0" />
              <span>Backend connected dashboard</span>
            </div>

            <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
              Student Life OS
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:mt-4 md:text-base">
              A complete AI-powered academic life management system for college
              students. This dashboard uses backend data only and avoids fake
              static statistics.
            </p>
          </div>
        </div>

        <div className="w-full rounded-3xl border border-white/10 bg-black/20 p-4 md:w-auto md:min-w-[260px] md:p-5">
          <div className="flex items-center gap-3 text-slate-300">
            <Construction size={22} className="shrink-0 text-yellow-300" />

            <div className="min-w-0">
              <p className="text-sm text-slate-400">Current Profile</p>
              <p className="truncate font-semibold text-white">
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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 md:mb-5 md:h-12 md:w-12">
        <Icon size={24} />
      </div>

      <p className="text-sm text-slate-400">{card.title}</p>

      <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
        {card.value}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {card.description}
      </p>
    </div>
  )
}

function RuleCard({ rule }) {
  const Icon = rule.icon

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 md:mb-5 md:h-12 md:w-12">
        <Icon size={24} />
      </div>

      <h2 className="text-base font-bold text-white md:text-lg">
        {rule.title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {rule.text}
      </p>
    </div>
  )
}

function ModuleCard({ module }) {
  const Icon = module.icon

  return (
    <article className="group relative flex min-h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/10 md:p-6">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl transition group-hover:bg-cyan-500/20" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 md:h-14 md:w-14">
            <Icon size={26} />
          </div>

          <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-200">
            {module.status}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-white md:mt-5 md:text-xl">
          {module.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400 md:min-h-[72px]">
          {module.description}
        </p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Backend Data
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            {module.futureData}
          </p>
        </div>

        <Link
          to={module.route}
          className="mt-5 flex w-full items-center justify-between rounded-2xl bg-cyan-500 px-4 py-3 text-left text-sm font-bold text-black transition hover:scale-[1.02]"
        >
          Open Module
          <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  )
}

function InfoPanel({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-7">
      <SectionHeader icon={Icon} title={title} subtitle={subtitle} />
      {children}
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-start gap-3 md:mb-6 md:items-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 md:h-12 md:w-12">
        <Icon size={24} />
      </div>

      <div className="min-w-0">
        <h2 className="text-xl font-bold text-white md:text-2xl">
          {title}
        </h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
  )
}

function BackendPlanItem({ item }) {
  const Icon = item.icon

  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
        <Icon size={22} />
      </div>

      <div className="min-w-0">
        <h3 className="font-bold text-white">{item.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          {item.description}
        </p>
      </div>
    </div>
  )
}

function DataListCard({ title, emptyText, items, renderItem }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-7">
      <h2 className="text-xl font-bold text-white md:text-2xl">
        {title}
      </h2>

      <div className="mt-5 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              {renderItem(item)}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">{emptyText}</p>
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