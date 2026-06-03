import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import {
  CalendarDays,
  Plus,
  Trash2,
  Loader2,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Clock,
  FileText,
  Bookmark,
  Activity,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react"

import {
  createExam,
  getExams,
  updateExam,
  deleteExam,
} from "../services/api"

/**
 * ============================================================================
 * EXAM SCHEDULE COMPONENT
 * ============================================================================
 * Optimized with an ultra-lightweight, mobile-first architecture.
 * Features aggressive fluidity layouts, optimal font rendering scales,
 * minimized layer composite footprints, and high performance touch boundaries.
 */
function ExamSchedule() {
  // --- Core Reactive States ---
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("view") // Mobile View Toggler: 'view' | 'add'

  // --- Monolithic Form Structure State ---
  const [form, setForm] = useState({
    subject: "",
    subjectCode: "",
    examType: "External",
    examDate: "",
    syllabusStatus: "Not Started",
    preparationLevel: 0,
    priority: "Medium",
    notes: "",
  })

  // --- API Middleware & Synchronization Orchestrators ---
  const fetchExams = async () => {
    try {
      setLoading(true)
      const data = await getExams()
      setExams(data.exams || [])
    } catch (error) {
      console.error("Critical error synching remote records:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const handleCreateExam = async () => {
    try {
      if (!form.subject.trim() || !form.examDate) {
        return alert("Validation Mismatch: Subject field & Target Date are mandatory inputs.")
      }

      setSaving(true)

      await createExam({
        subject: form.subject.trim(),
        subjectCode: form.subjectCode.trim().toUpperCase(),
        examType: form.examType,
        examDate: form.examDate,
        syllabusStatus: form.syllabusStatus,
        preparationLevel: Number(form.preparationLevel || 0),
        priority: form.priority,
        notes: form.notes.trim(),
      })

      // Reinitialize Form Fields upon completion
      setForm({
        subject: "",
        subjectCode: "",
        examType: "External",
        examDate: "",
        syllabusStatus: "Not Started",
        preparationLevel: 0,
        priority: "Medium",
        notes: "",
      })

      // Sync state and viewport mutations
      await fetchExams()
      setActiveTab("view")
    } catch (error) {
      console.error("Mutation failure during creation:", error)
      alert(error.response?.data?.message || "Remote dispatch failed. Check your connection configuration.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you positive you wish to remove this permanent entry evaluation schedule?")) return
    try {
      // Optimistic Filter for snappy click reaction times
      setExams(prev => prev.filter(e => e._id !== id))
      await deleteExam(id)
    } catch (error) {
      console.error("Reverting local collection; operation execution failed on remote server:", error)
      fetchExams()
    }
  }

  const handlePreparationUpdate = async (exam, value) => {
    try {
      const numericValue = Math.min(100, Math.max(0, Number(value)))
      let autoStatus = exam.syllabusStatus

      if (numericValue >= 100) {
        autoStatus = "Completed"
      } else if (numericValue > 0 && exam.syllabusStatus === "Not Started") {
        autoStatus = "In Progress"
      }

      // Optimistic Reactive Update Context (Touch-Optimized)
      setExams((prevExams) =>
        prevExams.map((e) =>
          e._id === exam._id
            ? { ...e, preparationLevel: numericValue, syllabusStatus: autoStatus }
            : e
        )
      )

      await updateExam(exam._id, {
        preparationLevel: numericValue,
        syllabusStatus: autoStatus,
      })
    } catch (error) {
      console.error("Slider runtime communication fault encountered:", error)
      fetchExams() // Revert to database state if sync breaks
    }
  }

  // --- Realtime Chrono Utility Calculations ---
  const getDaysLeft = (dateValue) => {
    if (!dateValue) return 0
    const today = new Date()
    const examDate = new Date(dateValue)

    today.setHours(0, 0, 0, 0)
    examDate.setHours(0, 0, 0, 0)

    const diff = examDate - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <DashboardLayout>
      {/* Container Pipeline Configured for Ultra Fluid Responsiveness */}
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-8 space-y-4 antialiased selection:bg-cyan-500/30 text-slate-200">
        
        {/* ============================================================================
         * GLOBAL CONTROLS / TITLE BLOCK HEADER
         * ============================================================================ */}
        <header className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 sm:p-6 transition-all duration-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/10">
                <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl lg:text-2xl truncate">
                  Exam Metrics
                </h1>
                <p className="text-[11px] text-slate-400 sm:text-xs truncate max-w-[240px] xs:max-w-none">
                  Syllabus workflows, timing limits, and status boards.
                </p>
              </div>
            </div>

            {/* Quick Summary Node Badge Visible only above mobile break triggers */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-1.5 text-xs font-medium border border-white/[0.05] text-slate-400">
              <Layers size={13} className="text-cyan-400" />
              Active Target Blocks: <span className="text-white font-bold">{exams.length}</span>
            </div>
          </div>
        </header>

        {/* ============================================================================
         * VIEWPORT SELECTOR TABS BAR (Visible on Mobile/Tablets, Hidden on Desktop xl)
         * ============================================================================ */}
        <nav className="flex rounded-xl bg-white/[0.02] p-1 border border-white/[0.05] xl:hidden" aria-label="Tabs Context Toggle">
          <button
            onClick={() => setActiveTab("view")}
            className={`flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-all duration-200 ${
              activeTab === "view"
                ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Schedules ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-all duration-200 ${
              activeTab === "add"
                ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            New Registration Form
          </button>
        </nav>

        {/* ============================================================================
         * MAIN APP GRID WRAPPER ARCHITECTURE
         * ============================================================================ */}
        <main className="grid grid-cols-1 gap-4 xl:grid-cols-3 items-start">
          
          {/* COMPONENT STREAM COLUMN 1: FORM SCHEDULER */}
          <section 
            className={`rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 sm:p-5 transition-all ${
              activeTab === "add" ? "block" : "hidden xl:block"
            }`}
            aria-label="Add New Course Assessment Form"
          >
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-cyan-400" /> Register Evaluation Target
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Input parameters to synchronize parameters downstream.</p>
            </div>

            {/* Input Stack Framework */}
            <div className="space-y-3.5">
              <Input
                label="Course Nomenclature / Subject Title"
                placeholder="e.g., Computer System Architecture"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
              />

              <Input
                label="Official Catalogue Subject Code"
                placeholder="e.g., CSE-401"
                value={form.subjectCode}
                onChange={(v) => setForm({ ...form, subjectCode: v })}
              />

              <div className="grid grid-cols-2 gap-2.5">
                <Select
                  label="Classification Type"
                  value={form.examType}
                  onChange={(v) => setForm({ ...form, examType: v })}
                  options={["Internal", "External", "Practical", "Viva", "Assignment", "Quiz", "Other"]}
                />

                <Input
                  type="date"
                  label="Target Calendar Date"
                  value={form.examDate}
                  onChange={(v) => setForm({ ...form, examDate: v })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Select
                  label="Syllabus Workflow Flag"
                  value={form.syllabusStatus}
                  onChange={(v) => setForm({ ...form, syllabusStatus: v })}
                  options={["Not Started", "In Progress", "Completed", "Revision Needed"]}
                />

                <Input
                  type="number"
                  label="Initial Base Prep Level %"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={form.preparationLevel || ""}
                  onChange={(v) => setForm({ ...form, preparationLevel: v })}
                />
              </div>

              <Select
                label="Resource Allocation Priority Threshold"
                value={form.priority}
                onChange={(v) => setForm({ ...form, priority: v })}
                options={["Low", "Medium", "High"]}
              />

              <Textarea
                label="Syllabus Notes / Technical Index Log"
                placeholder="Enter modular details, key chapters, reference points, etc."
                value={form.notes}
                onChange={(v) => setForm({ ...form, notes: v })}
              />

              {/* Action Form Dispatch Button Trigger */}
              <button
                onClick={handleCreateExam}
                disabled={saving}
                className="mt-2 flex w-full min-h-[42px] items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-40"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  <Plus size={15} />
                )}
                Save Data Record
              </button>
            </div>
          </section>

          {/* COMPONENT STREAM COLUMN 2 & 3: MAIN LIST FEED AREA */}
          <section 
            className={`xl:col-span-2 space-y-3.5 ${
              activeTab === "view" ? "block" : "hidden xl:block"
            }`}
            aria-label="Active Academic Timelines"
          >
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Schedules Pipeline
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Realtime execution pathways and milestone progression cards.</p>
                </div>

                <div className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] sm:text-xs font-bold text-slate-300 border border-white/[0.05] shrink-0">
                  {exams.length} Tracker{exams.length === 1 ? "" : "s"} Available
                </div>
              </div>

              {/* Feed Logic Switching Layer */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2.5">
                  <Loader2 className="animate-spin text-cyan-500" size={26} />
                  <p className="text-[11px] text-slate-400 font-medium">Querying state pipeline maps...</p>
                </div>
              ) : exams.length === 0 ? (
                /* Fallback Dataset Empty Board UI */
                <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center transition-all bg-white/[0.005]">
                  <CalendarDays size={32} className="mx-auto text-slate-600 mb-2" />
                  <h3 className="text-xs font-bold text-slate-300">
                    No Evaluations Listed
                  </h3>
                  <p className="mx-auto mt-1 max-w-xs text-[11px] text-slate-500 leading-normal">
                    Pipeline index empty. Toggle input viewport fields parameters above to mount active records.
                  </p>
                  <button 
                    onClick={() => setActiveTab("add")}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 xl:hidden"
                  >
                    Instantiate Form Row <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                /* Master Row Grid Mapper Engine */
                <div className="space-y-3">
                  {exams.map((exam) => {
                    const daysLeft = getDaysLeft(exam.examDate)

                    return (
                      <article
                        key={exam._id}
                        className="group relative rounded-xl border border-white/[0.04] bg-white/[0.01] p-3.5 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.02]"
                      >
                        {/* Card Sub Header: Metadata Title Strings and Trigger Actions */}
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1 min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-white tracking-tight break-words max-w-full">
                              {exam.subject}
                            </h3>

                            {/* Badge System Architecture Layout */}
                            <div className="flex flex-wrap items-center gap-1 text-[10px]">
                              <span className="inline-flex items-center gap-1 rounded bg-white/[0.04] px-1.5 py-0.5 font-medium text-slate-300 border border-white/[0.05]">
                                <Bookmark size={10} className="text-cyan-400" />
                                {exam.examType}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold border ${
                                  exam.priority === "High"
                                    ? "bg-red-500/10 text-red-400 border-red-500/10"
                                    : exam.priority === "Medium"
                                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/10"
                                    : "bg-green-500/10 text-green-400 border-green-500/10"
                                }`}
                              >
                                {exam.priority} Priority
                              </span>

                              <span
                                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold border ${
                                  daysLeft < 0
                                    ? "bg-slate-500/10 text-slate-400 border-slate-500/10"
                                    : daysLeft === 0
                                    ? "bg-orange-500/20 text-orange-400 border-orange-500/20 animate-pulse"
                                    : daysLeft <= 3
                                    ? "bg-red-500/10 text-red-400 border-red-500/10"
                                    : daysLeft <= 7
                                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/10"
                                    : "bg-green-500/10 text-green-400 border-green-500/10"
                                }`}
                              >
                                <Clock size={10} />
                                {daysLeft < 0
                                  ? "Terminus Concluded"
                                  : daysLeft === 0
                                  ? "Target Deadline Today"
                                  : `${daysLeft}d Remaining`}
                              </span>
                            </div>
                          </div>

                          {/* Mobile Action Controls Module Header Node */}
                          <div className="flex sm:self-start justify-end border-t border-white/[0.04] pt-2 sm:border-0 sm:pt-0 shrink-0">
                            <button
                              onClick={() => handleDelete(exam._id)}
                              className="flex items-center justify-center gap-1 rounded-lg bg-red-500/5 px-2 py-1 text-[11px] font-semibold text-red-400 border border-red-500/10 transition-colors hover:bg-red-500/10 active:scale-95"
                              aria-label={`Purge record parameters for ${exam.subject}`}
                            >
                              <Trash2 size={12} />
                              <span>Purge</span>
                            </button>
                          </div>
                        </div>

                        {/* Metadata Atomic Cards Sub Matrix */}
                        <div className="mt-3.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                          <InfoCard
                            icon={BookOpen}
                            label="Subject Code"
                            value={exam.subjectCode || "N/A"}
                          />
                          <InfoCard
                            icon={CalendarDays}
                            label="Target Execution"
                            value={exam.examDate ? new Date(exam.examDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : "Unscheduled"}
                          />
                          <InfoCard
                            icon={Activity}
                            label="Track Vector"
                            value={`${exam.preparationLevel || 0}%`}
                          />
                          <InfoCard
                            icon={AlertCircle}
                            label="Workflow State"
                            value={exam.syllabusStatus}
                            statusVariant={exam.syllabusStatus}
                          />
                        </div>

                        {/* Notes Sub Container Node Blocks */}
                        {exam.notes && (
                          <div className="mt-2.5 rounded-lg bg-white/[0.01] p-2 border border-white/[0.03]">
                            <div className="flex items-start gap-1 text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-0.5">
                              <FileText size={10} className="text-slate-600 mt-0.5" />
                              Technical Content Context
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-400 break-words whitespace-pre-wrap">
                              {exam.notes}
                            </p>
                          </div>
                        )}

                        {/* Input Range Integration Progress Sub Module Component Slider */}
                        <div className="mt-3.5 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 flex items-center gap-1">
                              <TrendingUp size={11} className="text-cyan-400" /> Progression Calibration Slider
                            </span>
                            <span className="font-bold text-cyan-400">{exam.preparationLevel || 0}%</span>
                          </div>
                          
                          <div className="relative flex items-center min-h-[24px]">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={exam.preparationLevel || 0}
                              onChange={(e) => handlePreparationUpdate(exam, e.target.value)}
                              className="h-1.5 w-full cursor-pointer appearance-none rounded bg-white/[0.06] outline-none accent-cyan-500 transition-all focus:ring-1 focus:ring-cyan-500/30"
                              aria-label="Calibrate readiness progress percentages values"
                            />
                          </div>
                        </div>

                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

        </main>
      </div>
    </DashboardLayout>
  )
}

/**
 * ============================================================================
 * ATOMIC HELPER COMPONENTS
 * ============================================================================
 */

/**
 * InfoCard Atom Component
 */
function InfoCard({ icon: Icon, label, value, statusVariant }) {
  let statusColor = "text-white"
  if (statusVariant) {
    if (statusVariant === "Completed") statusColor = "text-green-400"
    else if (statusVariant === "In Progress") statusColor = "text-yellow-400"
    else if (statusVariant === "Revision Needed") statusColor = "text-orange-400"
    else statusColor = "text-slate-400"
  }

  return (
    <div className="rounded-lg border border-white/[0.03] bg-white/[0.01] p-2 transition-all">
      <div className="flex items-center gap-1 text-slate-500">
        <Icon size={11} className="shrink-0" />
        <span className="text-[9px] font-medium uppercase tracking-wider truncate">{label}</span>
      </div>
      <p className={`mt-0.5 text-[11px] font-semibold truncate ${statusColor}`}>
        {value}
      </p>
    </div>
  )
}

/**
 * Custom Managed Input Vector Atom Component
 */
function Input({ label, value, onChange, type = "text", placeholder, min, max }) {
  return (
    <label className="block w-full">
      <span className="text-[11px] font-medium text-slate-400 block">
        {label}
      </span>
      <input
        type={type}
        min={min}
        max={max}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full min-h-[38px] rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 text-xs text-white placeholder-slate-600 outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-white/[0.05]"
      />
    </label>
  )
}

/**
 * Custom Textarea Atom Component
 */
function Textarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block w-full">
      <span className="text-[11px] font-medium text-slate-400 block">
        {label}
      </span>
      <textarea
        rows="2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full resize-none rounded-xl border border-white/[0.05] bg-white/[0.03] p-2.5 text-xs text-white placeholder-slate-600 outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-white/[0.05]"
      />
    </label>
  )
}

/**
 * Selection Dropdown Component Matrix Atom Component
 */
function Select({ label, value, onChange, options }) {
  return (
    <label className="block w-full">
      <span className="text-[11px] font-medium text-slate-400 block">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full min-h-[38px] appearance-none rounded-xl border border-white/[0.05] bg-white/[0.03] pl-3 pr-8 text-xs text-white outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-white/[0.05]"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-slate-900 text-slate-200"
            >
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 top-0 flex items-center px-2.5 text-slate-500">
          <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </label>
  )
}

export default ExamSchedule