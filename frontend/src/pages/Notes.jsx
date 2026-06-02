import {
  useEffect,
  useRef,
  useState,
} from "react"

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
} from "lucide-react"

function Notes() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const [notes, setNotes] = useState([])

  const [loading, setLoading] = useState(false)

  const [summary, setSummary] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  const [searchQuery, setSearchQuery] =
    useState("")

  const [activeNoteId, setActiveNoteId] =
    useState(null)

  const noteRefs = useRef({})

  // FETCH NOTES
  const fetchNotes = async () => {
    try {
      const data = await getNotes()

      setNotes(data.notes || [])

      const savedNoteId =
        localStorage.getItem("activeNoteId")

      if (savedNoteId) {
        setActiveNoteId(savedNoteId)

        setTimeout(() => {
          const element =
            noteRefs.current[savedNoteId]

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

  // CREATE NOTE
  const handleCreateNote = async (e) => {
    e.preventDefault()

    if (!title || !content) return

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

  // DELETE NOTE
  const handleDelete = async (id) => {
    try {
      await deleteNote(id)

      if (activeNoteId === id) {
        setActiveNoteId(null)
        localStorage.removeItem(
          "activeNoteId"
        )
      }

      fetchNotes()
    } catch (error) {
      console.log(error)
    }
  }

  // AI SUMMARY
  const handleSummarize = async (
    content
  ) => {
    try {
      setAiLoading(true)

      const data = await summarizeNote(
        content
      )

      setSummary(data.summary)
    } catch (error) {
      console.log(error)
    } finally {
      setAiLoading(false)
    }
  }

  // FILTERED NOTES
  const filteredNotes = notes.filter(
    (note) =>
      note.title
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        ) ||
      note.content
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
  )

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <Brain
                className="text-cyan-400"
                size={42}
              />

              <h1 className="text-5xl font-bold text-white">
                Smart Notes
              </h1>
            </div>

            <p className="text-slate-400 mt-4 text-lg">
              Save ideas, organize
              memories, and summarize
              notes using AI.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full lg:w-[400px]">
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
              <Search
                size={20}
                className="text-slate-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search notes..."
                className="bg-transparent outline-none text-white w-full placeholder:text-slate-500"
              />

              {searchQuery && (
                <button
                  onClick={() =>
                    setSearchQuery("")
                  }
                >
                  <X
                    size={18}
                    className="text-slate-400 hover:text-white"
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CREATE NOTE FORM */}
        <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Plus
              className="text-cyan-400"
              size={26}
            />

            <h2 className="text-2xl font-bold">
              Create New Note
            </h2>
          </div>

          <form
            onSubmit={handleCreateNote}
          >
            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 mb-5 text-white outline-none placeholder:text-slate-500"
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              rows="6"
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 mb-5 text-white outline-none placeholder:text-slate-500 resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 transition text-black font-bold px-7 py-4 rounded-2xl"
            >
              {loading
                ? "Creating..."
                : "Create Note"}
            </button>
          </form>
        </div>

        {/* AI SUMMARY */}
        {summary && (
          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-[32px] p-8 mb-10">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles
                className="text-cyan-300"
                size={28}
              />

              <h2 className="text-3xl font-bold text-cyan-300">
                AI Summary
              </h2>
            </div>

            <p className="text-slate-200 whitespace-pre-line leading-relaxed">
              {aiLoading
                ? "Generating summary..."
                : summary}
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="text-slate-400">
              Total Notes
            </h3>

            <p className="text-5xl font-bold mt-4">
              {notes.length}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="text-slate-400">
              Filtered Results
            </h3>

            <p className="text-5xl font-bold mt-4">
              {filteredNotes.length}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="text-slate-400">
              AI Workspace
            </h3>

            <p className="text-3xl font-bold mt-5 text-cyan-300">
              Active
            </p>
          </div>
        </div>

        {/* NOTES GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {filteredNotes.length === 0 && (
            <div className="col-span-full bg-white/10 border border-white/10 rounded-3xl p-12 text-center">
              <FileText
                size={60}
                className="mx-auto text-slate-500 mb-5"
              />

              <h2 className="text-3xl font-bold mb-4">
                No Notes Found
              </h2>

              <p className="text-slate-400">
                Create a new note or try
                another search keyword.
              </p>
            </div>
          )}

          {filteredNotes.map((note) => (
            <div
              key={note._id}
              ref={(el) =>
                (noteRefs.current[
                  note._id
                ] = el)
              }
              className={`rounded-[32px] p-7 backdrop-blur-xl border transition duration-300 ${
                activeNoteId === note._id
                  ? "bg-cyan-500/10 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                  : "bg-white/10 border-white/10 hover:bg-white/15"
              }`}
            >
              {/* NOTE HEADER */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <FileText
                    size={24}
                    className="text-cyan-400 mt-1"
                  />

                  <div>
                    <h2 className="text-2xl font-bold text-white line-clamp-2">
                      {note.title}
                    </h2>

                    <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                      <Clock3 size={14} />

                      <span>
                        {new Date(
                          note.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NOTE CONTENT */}
              <div className="mb-7">
                <p className="text-slate-300 whitespace-pre-line leading-relaxed line-clamp-8">
                  {note.content}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    handleDelete(note._id)
                  }
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-400 transition px-5 py-3 rounded-2xl text-white font-medium"
                >
                  <Trash2 size={18} />
                  Delete
                </button>

                <button
                  onClick={() =>
                    handleSummarize(
                      note.content
                    )
                  }
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-2xl text-black font-semibold"
                >
                  <Sparkles size={18} />
                  AI Summary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Notes