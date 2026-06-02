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
    className:
      "from-cyan-500/20 to-blue-500/10 border-cyan-400/20 text-cyan-200",
  },
  "Web Development": {
    icon: Code2,
    className:
      "from-violet-500/20 to-purple-500/10 border-violet-400/20 text-violet-200",
  },
  Aptitude: {
    icon: Brain,
    className:
      "from-yellow-500/20 to-orange-500/10 border-yellow-400/20 text-yellow-200",
  },
  Communication: {
    icon: MessageCircle,
    className:
      "from-pink-500/20 to-rose-500/10 border-pink-400/20 text-pink-200",
  },
  Design: {
    icon: Palette,
    className:
      "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-400/20 text-fuchsia-200",
  },
  Database: {
    icon: Database,
    className:
      "from-green-500/20 to-emerald-500/10 border-green-400/20 text-green-200",
  },
  AI: {
    icon: Zap,
    className:
      "from-indigo-500/20 to-blue-500/10 border-indigo-400/20 text-indigo-200",
  },
  Cloud: {
    icon: Cloud,
    className:
      "from-sky-500/20 to-cyan-500/10 border-sky-400/20 text-sky-200",
  },
  "College Subject": {
    icon: BookOpen,
    className:
      "from-lime-500/20 to-green-500/10 border-lime-400/20 text-lime-200",
  },
  Other: {
    icon: Target,
    className:
      "from-slate-500/20 to-slate-500/10 border-slate-400/20 text-slate-200",
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
      alert(
        error.response?.data?.message ||
          "Failed to fetch skills"
      )
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
            skills.reduce(
              (sum, skill) =>
                sum + Number(skill.currentLevel || 0),
              0
            ) / total
          )
        : 0

    const avgTarget =
      total > 0
        ? Math.round(
            skills.reduce(
              (sum, skill) =>
                sum + Number(skill.targetLevel || 0),
              0
            ) / total
          )
        : 0

    const totalHours = skills.reduce(
      (sum, skill) =>
        sum + Number(skill.totalPracticeHours || 0),
      0
    )

    const highSkills = skills.filter(
      (skill) => Number(skill.currentLevel || 0) >= 70
    ).length

    const readiness =
      avgTarget > 0
        ? Math.min(
            100,
            Math.round((avgCurrent / avgTarget) * 100)
          )
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
      skills: skills.filter(
        (skill) => skill.category === category
      ),
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
        totalPracticeHours: Number(
          form.totalPracticeHours || 0
        ),
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
      alert(
        error.response?.data?.message ||
          "Failed to create skill"
      )
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
        totalPracticeHours:
          Number(skill.totalPracticeHours || 0) + 1,
        lastPracticedAt: new Date(),
      })

      fetchSkills()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-black">
                <BarChart3 size={34} />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white">
                  Skills Monitor
                </h1>

                <p className="mt-2 max-w-3xl text-slate-400">
                  Career-readiness dashboard for technical,
                  aptitude, communication, and academic skill growth.
                </p>
              </div>
            </div>

            <ReadinessRing value={analytics.readiness} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Skills"
            value={analytics.total}
            icon={BarChart3}
          />

          <MetricCard
            label="Avg Level"
            value={`${analytics.avgCurrent}%`}
            icon={TrendingUp}
          />

          <MetricCard
            label="Target Avg"
            value={`${analytics.avgTarget}%`}
            icon={Target}
          />

          <MetricCard
            label="Practice Hours"
            value={analytics.totalHours}
            icon={Zap}
          />

          <MetricCard
            label="Strong Skills"
            value={analytics.highSkills}
            icon={Trophy}
          />
        </section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Add New Skill
            </h2>

            <div className="space-y-5">
              <Input
                label="Skill Name"
                value={form.skillName}
                onChange={(v) =>
                  setForm({
                    ...form,
                    skillName: v,
                  })
                }
              />

              <Select
                label="Category"
                value={form.category}
                onChange={(v) =>
                  setForm({
                    ...form,
                    category: v,
                  })
                }
                options={skillCategories}
              />

              <RangeInput
                label="Current Level"
                value={form.currentLevel}
                onChange={(v) =>
                  setForm({
                    ...form,
                    currentLevel: v,
                  })
                }
              />

              <RangeInput
                label="Target Level"
                value={form.targetLevel}
                onChange={(v) =>
                  setForm({
                    ...form,
                    targetLevel: v,
                  })
                }
              />

              <Input
                type="number"
                label="Confidence Level 1-5"
                value={form.confidenceLevel}
                onChange={(v) =>
                  setForm({
                    ...form,
                    confidenceLevel: v,
                  })
                }
              />

              <Input
                type="number"
                label="Practice Hours"
                value={form.totalPracticeHours}
                onChange={(v) =>
                  setForm({
                    ...form,
                    totalPracticeHours: v,
                  })
                }
              />

              <Input
                label="Learning Source"
                value={form.learningSource}
                onChange={(v) =>
                  setForm({
                    ...form,
                    learningSource: v,
                  })
                }
              />

              <Textarea
                label="Weak Topics"
                value={form.weakTopicsText}
                onChange={(v) =>
                  setForm({
                    ...form,
                    weakTopicsText: v,
                  })
                }
                placeholder="Comma separated: hooks, routing, state"
              />

              <Textarea
                label="Strong Topics"
                value={form.strongTopicsText}
                onChange={(v) =>
                  setForm({
                    ...form,
                    strongTopicsText: v,
                  })
                }
                placeholder="Comma separated: components, props"
              />

              <button
                type="button"
                onClick={handleCreateSkill}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-bold text-black"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                Add Skill
              </button>
            </div>
          </section>

          <section className="xl:col-span-2">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Skill Growth Board
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    RPG-style progress cards grouped by category.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {skills.length} Skills Tracked
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2
                    className="animate-spin text-cyan-400"
                    size={42}
                  />
                </div>
              ) : skills.length === 0 ? (
                <EmptySkills />
              ) : (
                <div className="space-y-8">
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
  const config =
    categoryConfig[category] || categoryConfig.Other

  const Icon = config.icon

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-gradient-to-br ${config.className}`}
        >
          <Icon size={20} />
        </div>

        <h3 className="text-xl font-bold text-white">
          {category}
        </h3>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
          {skills.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 ${config.className}`}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-2xl font-bold text-white">
              {skill.skillName}
            </h4>

            <p className="mt-1 text-sm opacity-80">
              {skill.learningSource || "No learning source"}
            </p>
          </div>

          <button
            onClick={() => onDelete(skill._id)}
            className="rounded-2xl bg-red-500/20 p-3 text-red-200 transition hover:bg-red-500/30"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <MiniStat label="Level" value={`${current}%`} />
          <MiniStat label="Target" value={`${target}%`} />
          <MiniStat label="Gap" value={`${gap}%`} />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>{current}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-white"
              style={{
                width: `${current}%`,
              }}
            />
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={current}
            onChange={(e) =>
              onLevelUpdate(skill, e.target.value)
            }
            className="mt-4 w-full"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniStat
            label="Practice"
            value={`${skill.totalPracticeHours || 0}h`}
          />

          <MiniStat
            label="Confidence"
            value={`${skill.confidenceLevel || 3}/5`}
          />
        </div>

        {skill.weakTopics?.length > 0 && (
          <TagSection
            title="Weak Topics"
            tags={skill.weakTopics}
          />
        )}

        {skill.strongTopics?.length > 0 && (
          <TagSection
            title="Strong Topics"
            tags={skill.strongTopics}
          />
        )}

        <button
          type="button"
          onClick={() => onPracticeHourAdd(skill)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-black/20 px-4 py-3 font-semibold text-white transition hover:bg-black/30"
        >
          <Plus size={18} />
          Add 1 Practice Hour
        </button>
      </div>
    </div>
  )
}

function ReadinessRing({ value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
      <div
        className="mx-auto flex h-28 w-28 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(rgb(34 211 238) ${value}%, rgba(255,255,255,0.1) 0)`,
        }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-950">
          <span className="text-2xl font-bold text-white">
            {value}%
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Career Readiness
      </p>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
        <Icon size={24} />
      </div>

      <p className="text-sm text-slate-400">{label}</p>

      <h2 className="mt-2 text-3xl font-bold text-white">
        {value}
      </h2>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 p-3">
      <p className="text-xs opacity-70">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  )
}

function TagSection({ title, tags }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-semibold text-white">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-black/20 px-3 py-1 text-xs"
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
    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
      <BarChart3 size={54} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-2xl font-bold text-white">
        No Skills Added Yet
      </h3>

      <p className="mt-2 text-slate-400">
        Add your first skill to start tracking your career growth.
      </p>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
      />
    </label>
  )
}

function RangeInput({
  label,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <div className="flex justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full"
      />
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <textarea
        rows="3"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-600"
      />
    </label>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-slate-900"
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SkillsMonitor