import { useEffect, useMemo, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  FileText,
  Plus,
  Trash2,
  Loader2,
  Search,
  Star,
  BookOpen,
  Layers,
  Tags,
  RefreshCcw,
} from "lucide-react"

import {
  createAcademicNote,
  getAcademicNotes,
  updateAcademicNote,
  deleteAcademicNote,
} from "../services/api"

const noteTypes = [
  "Class Note",
  "Short Note",
  "Formula",
  "Definition",
  "PYQ",
  "Important Question",
  "Revision",
  "Other",
]

const revisionStatuses = [
  "Not Revised",
  "Need Revision",
  "Revised",
  "Mastered",
]

function NotesCollection() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState("")
  const [subjectFilter, setSubjectFilter] =
    useState("All")

  const [form, setForm] = useState({
    title: "",
    subject: "",
    chapter: "",
    noteType: "Class Note",
    content: "",
    tagsText: "",
    priority: "Medium",
    revisionStatus: "Not Revised",
    isImportant: false,
  })

  const fetchNotes = async () => {
    try {
      setLoading(true)

      const data = await getAcademicNotes()

      console.log("Academic Notes Response:", data) // <-- Add this line

      setNotes(data.notes || [])
    } catch (error) {
      console.log(error)
      alert(
        error.response?.data?.message ||
          "Failed to fetch notes"
      )
    } finally {
      setLoading(false)
    }
  }

  const subjects = useMemo(() => {
    return [
      "All",
      ...new Set(
        notes
          .map((note) => note.subject)
          .filter(Boolean)
      ),
    ]
  }, [notes])

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const text = `
      ${note.title || ""}
      ${note.subject || ""}
      ${note.chapter || ""}
      ${note.noteType || ""}
      ${note.tags?.join(" ") || ""}
      ${note.content || ""}
      `.toLowerCase()

      const matchesSearch = text.includes(
        search.toLowerCase()
      )

      const matchesSubject =
        subjectFilter === "All" ||
        note.subject === subjectFilter

      return matchesSearch && matchesSubject
    })
  }, [notes, search, subjectFilter])

  const analytics = useMemo(() => {
    return {
      total: notes.length,
      subjects: new Set(
        notes.map((note) => note.subject).filter(Boolean)
      ).size,
      important: notes.filter(
        (note) => note.isImportant
      ).length,
      needRevision: notes.filter(
        (note) =>
          note.revisionStatus === "Need Revision"
      ).length,
    }
  }, [notes])

  const toArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const resetForm = () => {
    setForm({
      title: "",
      subject: "",
      chapter: "",
      noteType: "Class Note",
      content: "",
      tagsText: "",
      priority: "Medium",
      revisionStatus: "Not Revised",
      isImportant: false,
    })
  }

  const handleCreateNote = async () => {
    try {
      if (
        !form.title ||
        !form.subject ||
        !form.content
      ) {
        return alert(
          "Title, subject, and content are required"
        )
      }

      setSaving(true)

      await createAcademicNote({
        title: form.title,
        subject: form.subject,
        chapter: form.chapter,
        noteType: form.noteType,
        content: form.content,
        tags: toArray(form.tagsText),
        priority: form.priority,
        revisionStatus: form.revisionStatus,
        isImportant: form.isImportant,
      })

      resetForm()
      fetchNotes()
    } catch (error) {
      console.log(error)

      alert(
        error.response?.data?.message ||
          "Failed to create note"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteAcademicNote(id)
      fetchNotes()
    } catch (error) {
      console.log(error)
    }
  }

  const toggleImportant = async (note) => {
    try {
      await updateAcademicNote(note._id, {
        isImportant: !note.isImportant,
      })

      fetchNotes()
    } catch (error) {
      console.log(error)
    }
  }

  const updateRevisionStatus = async (
    note,
    status
  ) => {
    try {
      await updateAcademicNote(note._id, {
        revisionStatus: status,
      })

      fetchNotes()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-5 md:space-y-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-black md:h-16 md:w-16">
                <FileText size={28} />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300 md:text-sm">
                  <BookOpen size={14} />
                  Academic Notes Engine
                </div>

                <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl">
                  Notes Collection
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  Store formulas, revision notes,
                  definitions, PYQs, and important
                  exam content.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric
                label="Notes"
                value={analytics.total}
              />

              <Metric
                label="Subjects"
                value={analytics.subjects}
              />

              <Metric
                label="Important"
                value={analytics.important}
              />

              <Metric
                label="Revision"
                value={analytics.needRevision}
              />
            </div>
          </div>
        </section>

        {/* MAIN */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* FORM */}
          <section className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
            <h2 className="mb-5 text-xl font-bold text-white md:text-2xl">
              Add Academic Note
            </h2>

            <div className="space-y-4">
              <Input
                label="Note Title"
                value={form.title}
                onChange={(v) =>
                  setForm({
                    ...form,
                    title: v,
                  })
                }
              />

              <Input
                label="Subject"
                value={form.subject}
                onChange={(v) =>
                  setForm({
                    ...form,
                    subject: v,
                  })
                }
              />

              <Input
                label="Chapter / Unit"
                value={form.chapter}
                onChange={(v) =>
                  setForm({
                    ...form,
                    chapter: v,
                  })
                }
              />

              <Select
                label="Note Type"
                value={form.noteType}
                onChange={(v) =>
                  setForm({
                    ...form,
                    noteType: v,
                  })
                }
                options={noteTypes}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      priority: v,
                    })
                  }
                  options={[
                    "Low",
                    "Medium",
                    "High",
                  ]}
                />

                <Select
                  label="Revision Status"
                  value={form.revisionStatus}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      revisionStatus: v,
                    })
                  }
                  options={revisionStatuses}
                />
              </div>

              <Textarea
                label="Content"
                rows="7"
                value={form.content}
                onChange={(v) =>
                  setForm({
                    ...form,
                    content: v,
                  })
                }
              />

              <Textarea
                label="Tags"
                value={form.tagsText}
                onChange={(v) =>
                  setForm({
                    ...form,
                    tagsText: v,
                  })
                }
                placeholder="exam, unit1, important"
              />

              <Toggle
                label="Mark Important"
                checked={form.isImportant}
                onChange={(v) =>
                  setForm({
                    ...form,
                    isImportant: v,
                  })
                }
              />

              <button
                type="button"
                onClick={handleCreateNote}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 md:py-4 md:text-base"
              >
                {saving ? (
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                ) : (
                  <Plus size={18} />
                )}

                {saving
                  ? "Saving..."
                  : "Save Note"}
              </button>
            </div>
          </section>

          {/* NOTES */}
          <section className="space-y-5 xl:col-span-2">
            {/* SEARCH */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search notes..."
                    className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 md:text-base"
                  />
                </div>

                <select
                  value={subjectFilter}
                  onChange={(e) =>
                    setSubjectFilter(
                      e.target.value
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none md:text-base"
                >
                  {subjects.map((subject) => (
                    <option
                      key={subject}
                      value={subject}
                      className="bg-slate-900"
                    >
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LIST */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white md:text-2xl">
                    Academic Notes Library
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {filteredNotes.length} note(s)
                  </p>
                </div>

                <span className="w-fit rounded-2xl bg-white/10 px-4 py-2 text-xs text-slate-300 md:text-sm">
                  {subjectFilter}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2
                    className="animate-spin text-cyan-300"
                    size={36}
                  />
                </div>
              ) : filteredNotes.length === 0 ? (
                <EmptyNotes />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onDelete={handleDelete}
                      onImportant={
                        toggleImportant
                      }
                      onRevisionUpdate={
                        updateRevisionStatus
                      }
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

function NoteCard({
  note,
  onDelete,
  onImportant,
  onRevisionUpdate,
}) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4 md:p-5">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-lg font-bold text-white md:text-2xl">
                {note.title}
              </h3>

              {note.isImportant && (
                <Badge
                  icon={Star}
                  text="Important"
                />
              )}

              <Badge
                icon={Layers}
                text={note.noteType}
              />

              <Badge
                icon={RefreshCcw}
                text={note.revisionStatus}
              />
            </div>

            <p className="mt-2 text-xs text-slate-400 md:text-sm">
              {note.subject}
              {note.chapter
                ? ` · ${note.chapter}`
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onDelete(note._id)
            }
            className="flex w-full items-center justify-center rounded-2xl bg-red-500/20 p-3 text-red-300 transition hover:bg-red-500/30 sm:w-auto"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300 md:text-base">
            {note.content}
          </p>
        </div>

        {note.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300"
              >
                <Tags size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() =>
              onImportant(note)
            }
            className="rounded-2xl bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-200"
          >
            Toggle Important
          </button>

          {revisionStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                onRevisionUpdate(
                  note,
                  status
                )
              }
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                note.revisionStatus === status
                  ? "bg-cyan-500 text-black"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

function Badge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
      <Icon size={13} />
      {text}
    </span>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 md:px-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <h3 className="mt-1 text-lg font-bold text-white md:text-xl">
        {value}
      </h3>
    </div>
  )
}

function EmptyNotes() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center md:p-12">
      <FileText
        size={50}
        className="mx-auto text-slate-600"
      />

      <h3 className="mt-5 text-xl font-bold text-white md:text-2xl">
        Notes Collection is Empty
      </h3>

      <p className="mt-2 text-sm text-slate-400 md:text-base">
        Add your first academic note.
      </p>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
      />
    </label>
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
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none md:text-base"
      />
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = "4",
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 md:text-base"
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
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none md:text-base"
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

export default NotesCollection