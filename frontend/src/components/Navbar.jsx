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
  Brain,
} from "lucide-react"

import { Link, useNavigate } from "react-router-dom"

import { globalSearch } from "../services/authService"

function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate()
  const searchBoxRef = useRef(null)

  const user = JSON.parse(localStorage.getItem("user"))

  const [query, setQuery] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
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

  const closeMobileSearch = () => {
    setMobileSearchOpen(false)
    clearSearch()
  }

  const handleOpenNote = (noteId) => {
    localStorage.setItem("activeNoteId", noteId)
    clearSearch()
    setMobileSearchOpen(false)
    navigate("/notes")
  }

  const handleOpenChat = (chatId) => {
    localStorage.setItem("activeChatId", chatId)
    clearSearch()
    setMobileSearchOpen(false)
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

  const totalResults = results.notes.length + results.chats.length

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#081028]/95 backdrop-blur-xl">
      {/* MOBILE NAVBAR */}
      <div className="flex h-16 items-center justify-between gap-2 px-3 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white"
        >
          <Menu size={20} />
        </button>

        <Link
          to="/dashboard"
          className="flex min-w-0 flex-1 items-center justify-center gap-2"
        >
          <Brain size={22} className="shrink-0 text-cyan-400" />
          <span className="truncate text-lg font-extrabold text-white">
            Second<span className="text-cyan-400">Brain</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white"
          >
            <Search size={18} />
          </button>

          <Link
            to="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-cyan-400"
          >
            <UserCircle2 size={22} />
          </Link>
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="hidden px-6 py-4 md:flex md:items-center md:justify-between lg:px-8">
        <div
          ref={searchBoxRef}
          className="relative w-full max-w-[420px]"
        >
          <SearchBox
            query={query}
            setQuery={setQuery}
            loading={loading}
            clearSearch={clearSearch}
            setShowResults={setShowResults}
          />

          {showResults && query.trim() && (
            <SearchResults
              totalResults={totalResults}
              loading={loading}
              results={results}
              handleOpenNote={handleOpenNote}
              handleOpenChat={handleOpenChat}
            />
          )}
        </div>

        <div className="ml-4 flex items-center gap-3">
          <Link
            to="/"
            className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <Home size={17} />
            <span className="hidden lg:block">Home</span>
          </Link>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20">
            <Bell size={18} />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-cyan-400" />
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 transition hover:bg-white/20"
          >
            <UserCircle2 size={32} className="shrink-0 text-cyan-400" />

            <div className="hidden lg:block">
              <h4 className="max-w-[140px] truncate text-sm font-medium text-white">
                {user?.name || "User"}
              </h4>
              <p className="text-xs text-slate-400">Workspace</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex h-11 items-center gap-2 rounded-2xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-400"
          >
            <LogOut size={17} />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#070B1A]/95 p-4 backdrop-blur-xl md:hidden">
          <div
            ref={searchBoxRef}
            className="mx-auto max-w-md space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <SearchBox
                  query={query}
                  setQuery={setQuery}
                  loading={loading}
                  clearSearch={clearSearch}
                  setShowResults={setShowResults}
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={closeMobileSearch}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white"
              >
                <X size={20} />
              </button>
            </div>

            {query.trim() ? (
              <div className="max-h-[75vh] overflow-y-auto rounded-3xl border border-white/10 bg-white/10 p-3">
                <SearchResults
                  totalResults={totalResults}
                  loading={loading}
                  results={results}
                  handleOpenNote={handleOpenNote}
                  handleOpenChat={handleOpenChat}
                  mobile
                />
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center">
                <Search size={42} className="mx-auto text-slate-500" />
                <h3 className="mt-4 text-xl font-bold text-white">
                  Search SecondBrain
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Search your notes and AI chats instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function SearchBox({
  query,
  setQuery,
  loading,
  clearSearch,
  setShowResults,
  autoFocus = false,
}) {
  return (
    <div className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 transition focus-within:border-cyan-400/40 focus-within:bg-white/15">
      <Search size={18} className="shrink-0 text-slate-400" />

      <input
        autoFocus={autoFocus}
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
        <Loader2 size={18} className="shrink-0 animate-spin text-cyan-400" />
      )}

      {query && !loading && (
        <button type="button" onClick={clearSearch} className="shrink-0">
          <X size={18} className="text-slate-400 hover:text-white" />
        </button>
      )}
    </div>
  )
}

function SearchResults({
  totalResults,
  loading,
  results,
  handleOpenNote,
  handleOpenChat,
}) {
  return (
    <div className="md:absolute md:left-0 md:top-14 md:z-50 md:max-h-[65vh] md:w-full md:overflow-y-auto md:rounded-3xl md:border md:border-white/10 md:bg-[#0B1024] md:p-4 md:shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          Search Results
        </h3>

        <span className="text-xs text-slate-400">
          {totalResults} found
        </span>
      </div>

      {loading && (
        <p className="text-sm text-slate-400">Searching...</p>
      )}

      {!loading && totalResults === 0 && (
        <p className="text-sm text-slate-400">No matching results.</p>
      )}

      {!loading && results.notes.length > 0 && (
        <ResultGroup
          title="Notes"
          color="text-cyan-400"
          items={results.notes}
          icon={FileText}
          onOpen={handleOpenNote}
          getTitle={(item) => item.title}
          getText={(item) => item.content}
        />
      )}

      {!loading && results.chats.length > 0 && (
        <ResultGroup
          title="AI Chats"
          color="text-purple-400"
          items={results.chats}
          icon={MessageCircle}
          onOpen={handleOpenChat}
          getTitle={(item) => item.title || "New Chat"}
          getText={(item) =>
            item.messages?.[item.messages.length - 1]?.text || "Open chat"
          }
        />
      )}
    </div>
  )
}

function ResultGroup({
  title,
  color,
  items,
  icon: Icon,
  onOpen,
  getTitle,
  getText,
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className={`mb-2 text-[11px] uppercase tracking-wider ${color}`}>
        {title}
      </p>

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item._id}
            onClick={() => onOpen(item._id)}
            className="w-full rounded-2xl border border-white/5 bg-white/5 p-3 text-left transition hover:bg-white/10"
          >
            <div className="flex items-start gap-3">
              <Icon size={18} className={`mt-0.5 shrink-0 ${color}`} />

              <div className="min-w-0">
                <h4 className="truncate text-sm font-medium text-white">
                  {getTitle(item)}
                </h4>

                <p className="mt-1 line-clamp-2 text-xs leading-6 text-slate-400">
                  {getText(item)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Navbar