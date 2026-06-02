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
} from "lucide-react"

import { Link, useNavigate } from "react-router-dom"

import { globalSearch } from "../services/authService"

function Navbar() {
  const navigate = useNavigate()

  const searchBoxRef = useRef(null)

  const user = JSON.parse(localStorage.getItem("user"))

  const [query, setQuery] = useState("")
  const [results, setResults] = useState({
    notes: [],
    chats: [],
  })
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

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
    localStorage.setItem("activeNoteId", noteId)

    clearSearch()

    navigate("/notes")
  }

  const handleOpenChat = (chatId) => {
    localStorage.setItem("activeChatId", chatId)
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
        !searchBoxRef.current.contains(e.target)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const totalResults =
    results.notes.length + results.chats.length

  return (
    <header className="w-full h-20 border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 flex items-center justify-between">
      <div
        ref={searchBoxRef}
        className="relative w-[420px]"
      >
        <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
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
              if (query.trim()) setShowResults(true)
            }}
            placeholder="Search notes, chats, memories..."
            className="bg-transparent outline-none text-white w-full placeholder:text-slate-500"
          />

          {loading && (
            <Loader2
              size={18}
              className="text-cyan-400 animate-spin"
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

        {showResults && query.trim() && (
          <div className="absolute top-16 left-0 w-full bg-[#0B1024] border border-white/10 rounded-3xl shadow-2xl p-4 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                Search Results
              </h3>

              <span className="text-xs text-slate-400">
                {totalResults} found
              </span>
            </div>

            {loading && (
              <p className="text-slate-400 text-sm">
                Searching your second brain...
              </p>
            )}

            {!loading && totalResults === 0 && (
              <p className="text-slate-400 text-sm">
                No matching notes or chats found.
              </p>
            )}

            {!loading && results.notes.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase text-cyan-400 mb-2">
                  Notes
                </p>

                <div className="space-y-2">
                  {results.notes.map((note) => (
                    <button
                      key={note._id}
                      onClick={() => handleOpenNote(note._id)}
                      className="w-full text-left p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition"
                    >
                      <div className="flex items-start gap-3">
                        <FileText
                          size={18}
                          className="text-cyan-400 mt-1"
                        />

                        <div>
                          <h4 className="text-white font-medium line-clamp-1">
                            {note.title}
                          </h4>

                          <p className="text-slate-400 text-sm line-clamp-2">
                            {note.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!loading && results.chats.length > 0 && (
              <div>
                <p className="text-xs uppercase text-purple-400 mb-2">
                  AI Chats
                </p>

                <div className="space-y-2">
                  {results.chats.map((chat) => (
                    <button
                      key={chat._id}
                      onClick={() => handleOpenChat(chat._id)}
                      className="w-full text-left p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition"
                    >
                      <div className="flex items-start gap-3">
                        <MessageCircle
                          size={18}
                          className="text-purple-400 mt-1"
                        />

                        <div>
                          <h4 className="text-white font-medium line-clamp-1">
                            {chat.title || "New Chat"}
                          </h4>

                          <p className="text-slate-400 text-sm line-clamp-2">
                            {chat.messages?.[chat.messages.length - 1]?.text ||
                              "Open chat conversation"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-3 rounded-2xl text-white font-medium"
        >
          <Home size={18} />
          Home
        </Link>

        <button className="relative p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition">
          <Bell
            className="text-white"
            size={20}
          />

          <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full"></span>
        </button>

        <Link
          to="/profile"
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-2xl"
        >
          <UserCircle2
            className="text-cyan-400"
            size={34}
          />

          <div>
            <h4 className="text-white font-medium">
              {user?.name || "User"}
            </h4>

            <p className="text-slate-400 text-sm">
              Personal Workspace
            </p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-400 transition px-4 py-3 rounded-2xl text-white font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar