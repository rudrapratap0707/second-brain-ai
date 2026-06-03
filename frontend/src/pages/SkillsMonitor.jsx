import { useEffect, useMemo, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import {
  BarChart3,
  Plus,
  Trash2,
  Loader2,
  Code2,
  Brain,
  MessageCircle,
  Database,
  Cloud,
  Palette,
  BookOpen,
  Target,
  Zap,
  TrendingUp,
  Trophy,
} from "lucide-react"
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../services/api"

const skillCategories = [
  "Programming",
  "Web Development",
  "Aptitude",
  "Communication",
  "Design",
  "Database",
  "AI",
  "Cloud",
  "College Subject",
  "Other",
]

const categoryConfig = {
  Programming: {
    icon: Code2,
    className: "from-cyan-500/20 to-blue-500/10 border-cyan-400/20 text-cyan-200",
  },
  "Web Development": {
    icon: Code2,
    className: "from-violet-500/20 to-purple-500/10 border-violet-400/20 text-violet-200",
  },
  Aptitude: {
    icon: Brain,
    className: "from-yellow-500/20 to-orange-500/10 border-yellow-400/20 text-yellow-200",
  },
  Communication: {
    icon: MessageCircle,
    className: "from-pink-500/20 to-rose-500/10 border-pink-400/20 text-pink-200",
  },
  Design: {
    icon: Palette,
    className: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-400/20 text-fuchsia-200",
  },
  Database: {
    icon: Database,
    className: "from-green-500/20 to-emerald-500/10 border-green-400/20 text-green-200",
  },
  AI: {
    icon: Zap,
    className: "from-indigo-500/20 to-blue-500/10 border-indigo-400/20 text-indigo-200",
  },
  Cloud: {
    icon: Cloud,
    className: "from-sky-500/20 to-cyan-500/10 border-sky-400/20 text-sky-200",
  },
  "College Subject": {
    icon: BookOpen,
    className: "from-lime-500/20 to-green-500/10 border-lime-400/20 text-lime-200",
  },
  Other: {
    icon: Target,
    className: "from-slate-500/20 to-slate-500/10 border-slate-400/20 text-slate-200",
  },
}

function SkillsMonitor() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    skillName: "",
    category: "Programming",
    currentLevel: 0,
    targetLevel: 100,
    confidenceLevel: 3,
    totalPracticeHours: 0,
    learningSource: "",
    weakTopicsText: "",
    strongTopicsText: "",
  })

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const data = await getSkills()
      setSkills(data.skills || [])
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Failed to fetch skills")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const analytics = useMemo(() => {
    const total = skills.length

    const avgCurrent =
      total > 0
        ? Math.round(
            skills.reduce((sum, skill) => sum + Number(skill.currentLevel || 0), 0) / total
          )
        : 0

    const avgTarget =
      total > 0
        ? Math.round(
            skills.reduce((sum, skill) => sum + Number(skill.targetLevel || 0), 0) / total
          )
        : 0

    const totalHours = skills.reduce(
      (sum, skill) => sum + Number(skill.totalPracticeHours || 0),
      0
    )

    const highSkills = skills.filter(
      (skill) => Number(skill.currentLevel || 0) >= 70
    ).length

    const readiness =
      avgTarget > 0
        ? Math.min(100, Math.round((avgCurrent / avgTarget) * 100))
        : 0

    return {
      total,
      avgCurrent,
      avgTarget,
      totalHours,
      highSkills,
      readiness,
    }
  }, [skills])

  const groupedSkills = useMemo(() => {
    return skillCategories.map((category) => ({
      category,
      skills: skills.filter((skill) => skill.category === category),
    }))
  }, [skills])

  const toArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const handleCreateSkill = async () => {
    try {
      if (!form.skillName) {
        return alert("Skill name required")
      }

      setSaving(true)

      await createSkill({
        skillName: form.skillName,
        category: form.category,
        currentLevel: Number(form.currentLevel || 0),
        targetLevel: Number(form.targetLevel || 100),
        confidenceLevel: Number(form.confidenceLevel || 3),
        totalPracticeHours: Number(form.totalPracticeHours || 0),
        learningSource: form.learningSource,
        weakTopics: toArray(form.weakTopicsText),
        strongTopics: toArray(form.strongTopicsText),
        lastPracticedAt: new Date(),
      })

      setForm({
        skillName: "",
        category: "Programming",
        currentLevel: 0,
        targetLevel: 100,
        confidenceLevel: 3,
        totalPracticeHours: 0,
        learningSource: "",
        weakTopicsText: "",
        strongTopicsText: "",
      })

      fetchSkills()
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Failed to create skill")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id)
      fetchSkills()
    } catch (error) {
      console.log(error)
    }
  }

  const handleLevelUpdate = async (skill, value) => {
    try {
      await updateSkill(skill._id, {
        currentLevel: Number(value),
        lastPracticedAt: new Date(),
      })
      fetchSkills()
    } catch (error) {
      console.log(error)
    }
  }

  const handlePracticeHourAdd = async (skill) => {
    try {
      await updateSkill(skill._id, {
        totalPracticeHours: Number(skill.totalPracticeHours || 0) + 1,
        lastPracticedAt: new Date(),
      })
      fetchSkills()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 px-2 sm:px-0 max-w-full overflow-x-hidden">
        {/* Top Header Card */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-white/10 bg-white/5 p-4 sm:p-6 lg:p-8 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-500 text-black">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  Skills Monitor
                </h1>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm max-w-2xl text-slate-400 leading-relaxed">
                  Career-readiness dashboard for technical, aptitude, communication, and academic skill growth.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0">
              <ReadinessRing value={analytics.readiness} />
            </div>
          </div>
        </section>

        {/* Analytics Grid */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          <MetricCard label="Skills" value={analytics.total} icon={BarChart3} />
          <MetricCard label="Avg Level" value={`${analytics.avgCurrent}%`} icon={TrendingUp} />
          <MetricCard label="Target Avg" value={`${analytics.avgTarget}%`} icon={Target} />
          <MetricCard label="Practice Hours" value={analytics.totalHours} icon={Zap} />
          <div className="col-span-2 sm:col-span-1 md:col-span-1">
            <MetricCard label="Strong Skills" value={analytics.highSkills} icon={Trophy} />
          </div>
        </section>

        {/* Main Content Layout splits form and data display dynamically */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-3 items-start">
          {/* Add Skill Form Section */}
          <section className="rounded-2xl sm:rounded-[32px] border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl xl:sticky xl:top-6">
            <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white">
              Add New Skill
            </h2>

            <div className="space-y-4 sm:space-y-5">
              <Input
                label="Skill Name"
                value={form.skillName}
                onChange={(v) => setForm({ ...form, skillName: v })}
              />

              <Select
                label="Category"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                options={skillCategories}
              />

              <RangeInput
                label="Current Level"
                value={form.currentLevel}
                onChange={(v) => setForm({ ...form, currentLevel: v })}
              />

              <RangeInput
                label="Target Level"
                value={form.targetLevel}
                onChange={(v) => setForm({ ...form, targetLevel: v })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Confidence (1-5)"
                  value={form.confidenceLevel}
                  onChange={(v) => setForm({ ...form, confidenceLevel: v })}
                />
                <Input
                  type="number"
                  label="Practice Hours"
                  value={form.totalPracticeHours}
                  onChange={(v) => setForm({ ...form, totalPracticeHours: v })}
                />
              </div>

              <Input
                label="Learning Source"
                value={form.learningSource}
                onChange={(v) => setForm({ ...form, learningSource: v })}
              />

              <Textarea
                label="Weak Topics"
                value={form.weakTopicsText}
                onChange={(v) => setForm({ ...form, weakTopicsText: v })}
                placeholder="hooks, routing, state"
              />

              <Textarea
                label="Strong Topics"
                value={form.strongTopicsText}
                onChange={(v) => setForm({ ...form, strongTopicsText: v })}
                placeholder="components, props"
              />

              <button
                type="button"
                onClick={handleCreateSkill}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-cyan-500 px-4 py-3.5 text-sm sm:text-base font-bold text-black transition active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                Add Skill
              </button>
            </div>
          </section>

          {/* Growth Board Section */}
          <section className="xl:col-span-2 w-full">
            <div className="rounded-2xl sm:rounded-[32px] border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
              <div className="mb-5 sm:mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Skill Growth Board
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
                    RPG-style progress cards grouped by category.
                  </p>
                </div>

                <div className="self-start sm:self-auto rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  {skills.length} Skills Tracked
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12 sm:py-16">
                  <Loader2 className="animate-spin text-cyan-400" size={36} />
                </div>
              ) : skills.length === 0 ? (
                <EmptySkills />
              ) : (
                <div className="space-y-6 sm:space-y-8">
                  {groupedSkills
                    .filter((group) => group.skills.length > 0)
                    .map((group) => (
                      <SkillGroup
                        key={group.category}
                        category={group.category}
                        skills={group.skills}
                        onDelete={handleDelete}
                        onLevelUpdate={handleLevelUpdate}
                        onPracticeHourAdd={handlePracticeHourAdd}
                      />
                    ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}

function SkillGroup({
  category,
  skills,
  onDelete,
  onLevelUpdate,
  onPracticeHourAdd,
}) {
  const config = categoryConfig[category] || categoryConfig.Other
  const Icon = config.icon

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border bg-gradient-to-br ${config.className}`}>
          <Icon size={16} className="sm:scale-110" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {category}
        </h3>

        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
          {skills.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {skills.map((skill) => (
          <SkillCard
            key={skill._id}
            skill={skill}
            config={config}
            onDelete={onDelete}
            onLevelUpdate={onLevelUpdate}
            onPracticeHourAdd={onPracticeHourAdd}
          />
        ))}
      </div>
    </div>
  )
}

function SkillCard({
  skill,
  config,
  onDelete,
  onLevelUpdate,
  onPracticeHourAdd,
}) {
  const current = Number(skill.currentLevel || 0)
  const target = Number(skill.targetLevel || 100)
  const gap = Math.max(target - current, 0)

  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-gradient-to-br p-4 sm:p-5 lg:p-6 ${config.className}`}>
      <div className="absolute -right-12 -top-12 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-xl sm:text-2xl font-bold text-white truncate group-hover:text-clip">
                {skill.skillName}
              </h4>
              <p className="mt-0.5 text-xs sm:text-sm opacity-75 truncate">
                {skill.learningSource || "No learning source"}
              </p>
            </div>

            <button
              onClick={() => onDelete(skill._id)}
              className="rounded-xl bg-red-500/10 p-2 sm:p-2.5 text-red-300 transition hover:bg-red-500/20 shrink-0"
              aria-label="Delete Skill"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Stats Badges Dashboard Grid */}
          <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2">
            <MiniStat label="Level" value={`${current}%`} />
            <MiniStat label="Target" value={`${target}%`} />
            <MiniStat label="Gap" value={`${gap}%`} />
          </div>

          {/* Progress Slider Wrapper */}
          <div className="mt-4 sm:mt-5">
            <div className="mb-1.5 flex justify-between text-xs sm:text-sm font-medium">
              <span className="opacity-80">Progress</span>
              <span className="font-bold">{current}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${current}%` }}
              />
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={current}
              onChange={(e) => onLevelUpdate(skill, e.target.value)}
              className="mt-3 w-full h-1.5 bg-transparent accent-white cursor-pointer"
            />
          </div>

          {/* Core Info Row */}
          <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2">
            <MiniStat label="Practice" value={`${skill.totalPracticeHours || 0}h`} />
            <MiniStat label="Confidence" value={`${skill.confidenceLevel || 3}/5`} />
          </div>
        </div>

        <div>
          {skill.weakTopics?.length > 0 && (
            <TagSection title="Weak Topics" tags={skill.weakTopics} />
          )}

          {skill.strongTopics?.length > 0 && (
            <TagSection title="Strong Topics" tags={skill.strongTopics} />
          )}

          <button
            type="button"
            onClick={() => onPracticeHourAdd(skill)}
            className="mt-5 sm:mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl bg-black/15 px-3 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-black/25 active:scale-[0.99]"
          >
            <Plus size={16} />
            Add 1 Practice Hour
          </button>
        </div>
      </div>
    </div>
  )
}

function ReadinessRing({ value }) {
  return (
    <div className="flex sm:flex-row lg:flex-col items-center justify-between sm:justify-start lg:justify-center gap-4 rounded-xl sm:rounded-2xl border border-white/5 bg-black/10 p-3.5 sm:p-4 text-left lg:text-center w-full lg:w-40">
      <div
        className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 shrink-0 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(rgb(34 211 238) ${value}%, rgba(255,255,255,0.08) 0)`,
        }}
      >
        <div className="flex h-12 w-12 sm:h-15 sm:w-15 lg:h-18 lg:w-18 items-center justify-center rounded-full bg-slate-950">
          <span className="text-sm sm:text-base lg:text-xl font-bold text-white">
            {value}%
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs sm:text-sm font-medium text-slate-300">
          Career Readiness
        </p>
        <p className="block sm:hidden lg:hidden text-[10px] text-slate-500 mt-0.5">
          Overall metrics summary
        </p>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-5 backdrop-blur-xl flex flex-col justify-between">
      <div className="mb-2 sm:mb-4 flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 text-cyan-300 shrink-0">
        <Icon size={18} className="sm:scale-110" />
      </div>

      <div>
        <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate">
          {label}
        </p>
        <h2 className="mt-0.5 sm:mt-1 text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {value}
        </h2>
      </div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-black/20 p-2 sm:p-2.5 min-w-0">
      <p className="text-[10px] sm:text-xs text-slate-400 truncate">{label}</p>
      <p className="mt-0.5 text-xs sm:text-sm font-bold text-white truncate">{value}</p>
    </div>
  )
}

function TagSection({ title, tags }) {
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-xs font-semibold text-white/90">
        {title}
      </p>

      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-black/20 px-2 py-0.5 text-[10px] sm:text-xs text-slate-200 border border-white/5 whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function EmptySkills() {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 sm:p-12 text-center">
      <BarChart3 size={40} className="mx-auto text-slate-600 sm:scale-125" />
      <h3 className="mt-4 text-lg sm:text-xl font-bold text-white">
        No Skills Added Yet
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
        Add your first skill to start tracking your career growth milestones.
      </p>
    </div>
  )
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block w-full">
      <span className="text-xs sm:text-sm font-medium text-slate-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40 focus:bg-white/10 transition"
      />
    </label>
  )
}

function RangeInput({ label, value, onChange }) {
  return (
    <label className="block w-full">
      <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-400">
        <span>{label}</span>
        <span className="font-bold text-white">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-1.5 bg-white/10 rounded-full accent-cyan-400 cursor-pointer"
      />
    </label>
  )
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block w-full">
      <span className="text-xs sm:text-sm font-medium text-slate-400">
        {label}
      </span>
      <textarea
        rows="2"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500/40 focus:bg-white/10 transition"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block w-full">
      <span className="text-xs sm:text-sm font-medium text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40 focus:bg-white/10 transition"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SkillsMonitor