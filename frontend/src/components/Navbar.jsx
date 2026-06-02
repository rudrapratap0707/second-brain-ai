import { useEffect, useRef, useState } from "react"

import {
  Search,
  Bell,
  UserCircle2,
  LogOut,
  Home,
  FileText,
  MessageCircle,
  X,
  Loader2,
  Menu,
} from "lucide-react"

import { Link, useNavigate } from "react-router-dom"

import { globalSearch } from "../services/authService"

function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate()

  const searchBoxRef = useRef(null)

  const user = JSON.parse(localStorage.getItem("user"))

  const [query, setQuery] = useState("")
  const [results, setResults] = useState({
    notes: [],
    chats: [],
  })

  const [loading, setLoading] = useState(false)

  const [showResults, setShowResults] =
    useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("activeChatId")

    navigate("/")
  }

  const clearSearch = () => {
    setQuery("")

    setResults({
      notes: [],
      chats: [],
    })

    setShowResults(false)
  }

  const handleOpenNote = (noteId) => {
    localStorage.setItem(
      "activeNoteId",
      noteId
    )

    clearSearch()

    navigate("/notes")
  }

  const handleOpenChat = (chatId) => {
    localStorage.setItem(
      "activeChatId",
      chatId
    )

    clearSearch()

    navigate("/assistant")
  }

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!query.trim()) {
        setResults({
          notes: [],
          chats: [],
        })

        setShowResults(false)

        return
      }

      try {
        setLoading(true)

        setShowResults(true)

        const data = await globalSearch(query)

        setResults({
          notes: data.notes || [],
          chats: data.chats || [],
        })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(delaySearch)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(
          e.target
        )
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
    }
  }, [])

  const totalResults =
    results.notes.length +
    results.chats.length

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081028]/95 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-2xl bg-white/10 p-3 text-white lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div
            ref={searchBoxRef}
            className="relative w-full lg:w-[420px]"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)

                  setShowResults(true)
                }}
                onFocus={() => {
                  if (query.trim()) {
                    setShowResults(true)
                  }
                }}
                placeholder="Search notes, chats..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />

              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin text-cyan-400"
                />
              )}

              {query && !loading && (
                <button onClick={clearSearch}>
                  <X
                    size={18}
                    className="text-slate-400 hover:text-white"
                  />
                </button>
              )}
            </div>

            {showResults &&
              query.trim() && (
                <div className="absolute left-0 top-16 z-50 max-h-[70vh] w-full overflow-y-auto rounded-3xl border border-white/10 bg-[#0B1024] p-4 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-white">
                      Search Results
                    </h3>

                    <span className="text-xs text-slate-400">
                      {totalResults} found
                    </span>
                  </div>

                  {loading && (
                    <p className="text-sm text-slate-400">
                      Searching...
                    </p>
                  )}

                  {!loading &&
                    totalResults === 0 && (
                      <p className="text-sm text-slate-400">
                        No matching results.
                      </p>
                    )}

                  {!loading &&
                    results.notes.length >
                      0 && (
                      <div className="mb-4">
                        <p className="mb-2 text-xs uppercase text-cyan-400">
                          Notes
                        </p>

                        <div className="space-y-2">
                          {results.notes.map(
                            (note) => (
                              <button
                                key={note._id}
                                onClick={() =>
                                  handleOpenNote(
                                    note._id
                                  )
                                }
                                className="w-full rounded-2xl bg-white/10 p-3 text-left transition hover:bg-white/20"
                              >
                                <div className="flex items-start gap-3">
                                  <FileText
                                    size={18}
                                    className="mt-1 text-cyan-400"
                                  />

                                  <div>
                                    <h4 className="line-clamp-1 font-medium text-white">
                                      {
                                        note.title
                                      }
                                    </h4>

                                    <p className="line-clamp-2 text-sm text-slate-400">
                                      {
                                        note.content
                                      }
                                    </p>
                                  </div>
                                </div>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {!loading &&
                    results.chats.length >
                      0 && (
                      <div>
                        <p className="mb-2 text-xs uppercase text-purple-400">
                          AI Chats
                        </p>

                        <div className="space-y-2">
                          {results.chats.map(
                            (chat) => (
                              <button
                                key={chat._id}
                                onClick={() =>
                                  handleOpenChat(
                                    chat._id
                                  )
                                }
                                className="w-full rounded-2xl bg-white/10 p-3 text-left transition hover:bg-white/20"
                              >
                                <div className="flex items-start gap-3">
                                  <MessageCircle
                                    size={18}
                                    className="mt-1 text-purple-400"
                                  />

                                  <div>
                                    <h4 className="line-clamp-1 font-medium text-white">
                                      {chat.title ||
                                        "New Chat"}
                                    </h4>

                                    <p className="line-clamp-2 text-sm text-slate-400">
                                      {chat
                                        .messages?.[
                                        chat
                                          .messages
                                          .length -
                                          1
                                      ]?.text ||
                                        "Open chat"}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <Home size={18} />
            <span className="hidden sm:block">
              Home
            </span>
          </Link>

          <button className="relative rounded-2xl bg-white/10 p-3 transition hover:bg-white/20">
            <Bell
              className="text-white"
              size={20}
            />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400"></span>
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 transition hover:bg-white/20"
          >
            <UserCircle2
              className="text-cyan-400"
              size={34}
            />

            <div className="hidden sm:block">
              <h4 className="font-medium text-white">
                {user?.name || "User"}
              </h4>

              <p className="text-sm text-slate-400">
                Personal Workspace
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-400"
          >
            <LogOut size={18} />

            <span className="hidden sm:block">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar