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
  CheckCircle2,
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
  const [subjectFilter, setSubjectFilter] = useState("All")

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

  useEffect(() => {
    fetchNotes()
  }, [])

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
      important: notes.filter((note) => note.isImportant)
        .length,
      needRevision: notes.filter(
        (note) => note.revisionStatus === "Need Revision"
      ).length,
    }
  }, [notes])

  const toArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const handleCreateNote = async () => {
    try {
      if (!form.title || !form.subject || !form.content) {
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

  const updateRevisionStatus = async (note, status) => {
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
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500 text-black">
                <FileText size={42} />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                  <BookOpen size={16} />
                  Academic Notes Engine
                </div>

                <h1 className="text-4xl font-bold text-white md:text-5xl">
                  Notes Collection
                </h1>

                <p className="mt-4 max-w-3xl text-slate-300">
                  Store subject-wise notes, formulas, definitions,
                  PYQs, revision notes, and important exam material.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="Notes" value={analytics.total} />
              <Metric label="Subjects" value={analytics.subjects} />
              <Metric label="Important" value={analytics.important} />
              <Metric label="Need Revision" value={analytics.needRevision} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Add Academic Note
            </h2>

            <div className="space-y-5">
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

              <Select
                label="Priority"
                value={form.priority}
                onChange={(v) =>
                  setForm({
                    ...form,
                    priority: v,
                  })
                }
                options={["Low", "Medium", "High"]}
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

              <Textarea
                label="Content"
                rows="8"
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
                placeholder="Comma separated: exam, unit1, important"
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-bold text-black disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                Save Note
              </button>
            </div>
          </section>

          <section className="space-y-6 xl:col-span-2">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={20}
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search notes, subjects, tags, content..."
                    className="w-full rounded-2xl border border-white/10 bg-black/20 py-4 pl-12 pr-4 text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <select
                  value={subjectFilter}
                  onChange={(e) =>
                    setSubjectFilter(e.target.value)
                  }
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none"
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

            <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Academic Notes Library
                </h2>

                <span className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                  {filteredNotes.length} Notes
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-cyan-300" size={42} />
                </div>
              ) : filteredNotes.length === 0 ? (
                <EmptyNotes />
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onDelete={handleDelete}
                      onImportant={toggleImportant}
                      onRevisionUpdate={updateRevisionStatus}
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
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold text-white">
                {note.title}
              </h3>

              {note.isImportant && (
                <Badge icon={Star} text="Important" />
              )}

              <Badge icon={Layers} text={note.noteType} />
              <Badge icon={RefreshCcw} text={note.revisionStatus} />
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {note.subject}
              {note.chapter ? ` · ${note.chapter}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDelete(note._id)}
            className="rounded-2xl bg-red-500/20 p-3 text-red-300 hover:bg-red-500/30"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="whitespace-pre-wrap leading-7 text-slate-300">
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

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onImportant(note)}
            className="rounded-2xl bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-200"
          >
            Toggle Important
          </button>

          {revisionStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                onRevisionUpdate(note, status)
              }
              className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
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
    </div>
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
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>

      <h3 className="mt-1 text-xl font-bold text-white">
        {value}
      </h3>
    </div>
  )
}

function EmptyNotes() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
      <FileText size={54} className="mx-auto text-slate-600" />

      <h3 className="mt-5 text-2xl font-bold text-white">
        Notes Collection is Empty
      </h3>

      <p className="mt-2 text-slate-400">
        Add your first academic note.
      </p>
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
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
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
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

export default NotesCollection