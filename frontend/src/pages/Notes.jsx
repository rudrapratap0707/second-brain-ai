import { useEffect, useRef, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  createNote,
  getNotes,
  deleteNote,
  summarizeNote,
} from "../services/authService"

import {
  FileText,
  Trash2,
  Sparkles,
  Plus,
  Search,
  X,
  Clock3,
  Brain,
  Loader2,
} from "lucide-react"

function Notes() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeNoteId, setActiveNoteId] = useState(null)

  const noteRefs = useRef({})

  const fetchNotes = async () => {
    try {
      const data = await getNotes()
      setNotes(data.notes || [])

      const savedNoteId = localStorage.getItem("activeNoteId")

      if (savedNoteId) {
        setActiveNoteId(savedNoteId)

        setTimeout(() => {
          const element = noteRefs.current[savedNoteId]

          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
        }, 500)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleCreateNote = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) return

    setLoading(true)

    try {
      await createNote({
        title,
        content,
      })

      setTitle("")
      setContent("")

      fetchNotes()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNote(id)

      if (activeNoteId === id) {
        setActiveNoteId(null)
        localStorage.removeItem("activeNoteId")
      }

      fetchNotes()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSummarize = async (noteContent) => {
    try {
      setAiLoading(true)
      setSummary("")

      const data = await summarizeNote(noteContent)

      setSummary(data.summary)
    } catch (error) {
      console.log(error)
      setSummary("AI summary failed. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase()

    return (
      note.title?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-7xl space-y-5 md:space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 md:h-16 md:w-16">
                <Brain size={34} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
                  Smart Notes
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Save ideas, organize memories, and summarize your notes with AI.
                </p>
              </div>
            </div>

            <div className="relative w-full lg:max-w-md">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 md:px-5 md:py-4">
                <Search size={20} className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="shrink-0"
                  >
                    <X size={18} className="text-slate-400 hover:text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MiniStat title="Total Notes" value={notes.length} />
          <MiniStat title="Filtered Results" value={filteredNotes.length} />
          <MiniStat title="AI Workspace" value="Active" highlight />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Plus className="text-cyan-400" size={24} />

              <h2 className="text-xl font-bold text-white md:text-2xl">
                Create New Note
              </h2>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:px-5 md:py-4 md:text-base"
              />

              <textarea
                placeholder="Write your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="7"
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:px-5 md:py-4 md:text-base"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 md:w-fit md:px-7 md:py-4 md:text-base"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Creating..." : "Create Note"}
              </button>
            </form>

            {(summary || aiLoading) && (
              <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4 md:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles className="text-cyan-300" size={22} />

                  <h2 className="text-xl font-bold text-cyan-300 md:text-2xl">
                    AI Summary
                  </h2>
                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-slate-200 md:text-base">
                  {aiLoading ? "Generating summary..." : summary}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  Notes Library
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {filteredNotes.length} note(s) found
                </p>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <EmptyNotes />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    active={activeNoteId === note._id}
                    noteRefs={noteRefs}
                    onDelete={handleDelete}
                    onSummarize={handleSummarize}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function MiniStat({ title, value, highlight }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
      <h3 className="text-sm text-slate-400">{title}</h3>

      <p
        className={`mt-3 text-2xl font-bold md:text-4xl ${
          highlight ? "text-cyan-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function NoteCard({ note, active, noteRefs, onDelete, onSummarize }) {
  return (
    <article
      ref={(el) => {
        noteRefs.current[note._id] = el
      }}
      className={`flex min-h-full flex-col rounded-3xl border p-4 transition duration-300 md:p-5 ${
        active
          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.2)]"
          : "border-white/10 bg-black/20 hover:bg-white/10"
      }`}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-1 shrink-0 text-cyan-400">
          <FileText size={22} />
        </div>

        <div className="min-w-0">
          <h2 className="line-clamp-2 text-lg font-bold text-white md:text-xl">
            {note.title}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <Clock3 size={14} />

            <span className="line-clamp-1">
              {formatDate(note.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <p className="line-clamp-7 flex-1 whitespace-pre-line text-sm leading-7 text-slate-300">
        {note.content}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onDelete(note._id)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
        >
          <Trash2 size={17} />
          Delete
        </button>

        <button
          type="button"
          onClick={() => onSummarize(note.content)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400"
        >
          <Sparkles size={17} />
          AI Summary
        </button>
      </div>
    </article>
  )
}

function EmptyNotes() {
  return (
    <div className="rounded-3xl border border-dashed border-white/20 p-8 text-center md:p-12">
      <FileText size={52} className="mx-auto mb-5 text-slate-500" />

      <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
        No Notes Found
      </h2>

      <p className="mx-auto max-w-md text-sm leading-6 text-slate-400 md:text-base">
        Create a new note or try another search keyword.
      </p>
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
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default Notes