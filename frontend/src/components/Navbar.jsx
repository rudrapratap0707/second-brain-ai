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

  // --- State Management ---
  const [query, setQuery] = useState("")
  const [results, setResults] = useState({ notes: [], chats: [] })
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false) // Dynamic Mobile Toggle State

  // --- Auth & Actions Handler ---
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("activeChatId")
    navigate("/")
  }

  const clearSearch = () => {
    setQuery("")
    setResults({ notes: [], chats: [] })
    setShowResults(false)
  }

  const handleOpenNote = (noteId) => {
    localStorage.setItem("activeNoteId", noteId)
    clearSearch()
    setIsMobileSearchOpen(false)
    navigate("/notes")
  }

  const handleOpenChat = (chatId) => {
    localStorage.setItem("activeChatId", chatId)
    clearSearch()
    setIsMobileSearchOpen(false)
    navigate("/assistant")
  }

  // --- Debounced API Search Logic ---
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!query.trim()) {
        setResults({ notes: [], chats: [] })
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
        console.error("Global search error:", error)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(delaySearch)
  }, [query])

  // --- Dropdown Click Outside Listener ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
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
    <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-[#081028]/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        
        {/* BASE HEADER ROW CONTAINER */}
        <div className="flex items-center justify-between gap-4 relative">
          
          {/* LEFT SECTION: Hamburger Toggle + Zero-Wrap Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-xl bg-white/[0.04] p-2 text-slate-300 hover:bg-white/[0.08] hover:text-white active:scale-95 transition-all lg:hidden shrink-0"
              aria-label="Open Sidebar Menu"
            >
              <Menu size={18} />
            </button>
            
            <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent tracking-tight whitespace-nowrap select-none">
              SecondBrain
            </span>
          </div>

          {/* LAPTOP/DESKTOP SEARCH INLINE SYSTEM (Hidden completely on mobile/tablets) */}
          <div ref={searchBoxRef} className="hidden lg:block relative w-full max-w-xs xl:max-w-md mx-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 focus-within:border-cyan-500/40 focus-within:bg-white/[0.05] transition-all">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowResults(true)
                }}
                placeholder="Search notes, chats..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
              {loading && <Loader2 size={16} className="animate-spin text-cyan-400 shrink-0" />}
            </div>

            {/* Desktop UI Results Panel Dropdown */}
            {showResults && query.trim() && (
              <div className="absolute left-0 right-0 top-[115%] z-50 max-h-[60vh] overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0B1024]/98 p-4 shadow-2xl backdrop-blur-xl">
                <div className="mb-2.5 flex items-center justify-between border-b border-white/[0.04] pb-1.5">
                  <h3 className="text-xs font-semibold text-slate-200">Results</h3>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400">{totalResults} found</span>
                </div>
                {/* Search Results Mapping (Reusable identical engine below layout) */}
                <SearchResultsList loading={loading} totalResults={totalResults} results={results} handleOpenNote={handleOpenNote} handleOpenChat={handleOpenChat} />
              </div>
            )}
          </div>

          {/* ULTRA FLEXIBLE UTILITY RIGHT ACTIONS ROW (Adapts intelligently via hidden breakpoints) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* 🔍 Mobile Search Icon Trigger Button (Hidden completely on Desktop) */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="inline-flex lg:hidden items-center justify-center rounded-xl bg-white/[0.03] p-2 text-slate-300 border border-white/[0.04] hover:bg-white/[0.08] hover:text-white transition"
            >
              <Search size={15} />
            </button>

            {/* 🏠 Laptop Only Home Button Group Layout */}
            <Link
              to="/"
              className="hidden md:flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 border border-white/[0.04] hover:bg-white/[0.08] transition"
            >
              <Home size={14} />
              <span>Home</span>
            </Link>

            {/* 🔔 Notification Alert Bell (Persistent on all screens) */}
            <button className="relative flex items-center justify-center rounded-xl bg-white/[0.03] p-2 text-slate-300 border border-white/[0.04] hover:bg-white/[0.08] transition">
              <Bell size={15} />
              <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-cyan-400"></span>
            </button>

            {/* 👤 Workspace Profile Anchor Node */}
            <Link
              to="/profile"
              className="flex items-center gap-1.5 rounded-xl bg-white/[0.03] p-1.5 sm:pr-3 border border-white/[0.04] hover:bg-white/[0.06] transition"
            >
              <UserCircle2 className="text-cyan-400 size-[19px] sm:size-5 shrink-0" />
              {/* Profile string vanishes cleanly on mobile without compressing structural spaces */}
              <span className="hidden md:inline text-xs font-medium text-slate-200 max-w-[80px] truncate">
                {user?.name || "User"}
              </span>
            </Link>

            {/* 🚪 Safe Exit Core Session Logout Control (Text hidden on mobile, turns iconic button) */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 p-2 md:px-3 md:py-2 text-red-400 hover:bg-red-500 hover:text-white transition active:scale-95"
              title="Logout"
            >
              <LogOut size={14} />
              <span className="hidden md:inline text-xs font-medium">Logout</span>
            </button>
          </div>

        </div>
      </div>

      {/* FULL RESPONSIVE EXPANDABLE MOBILE OVERLAY COMPONENT BAR */}
      {isMobileSearchOpen && (
        <div className="absolute inset-x-0 top-0 z-50 w-full bg-[#081028] px-4 py-3 border-b border-white/10 flex flex-col gap-3 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search records database..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
              />
              {loading && <Loader2 size={14} className="animate-spin text-cyan-400" />}
              {query && !loading && (
                <button onClick={clearSearch} className="text-slate-400 hover:text-white">
                  <X size={12} />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => { setIsMobileSearchOpen(false); clearSearch(); }}
              className="text-xs text-slate-400 hover:text-white font-medium whitespace-nowrap px-1"
            >
              Cancel
            </button>
          </div>

          {/* Dynamic Render Pipeline Inside Search Layer Context */}
          {query.trim() && (
            <div className="max-h-[50vh] overflow-y-auto rounded-xl bg-[#0B1024]/50 border border-white/[0.04] p-2">
              <SearchResultsList loading={loading} totalResults={totalResults} results={results} handleOpenNote={handleOpenNote} handleOpenChat={handleOpenChat} />
            </div>
          )}
        </div>
      )}
    </header>
  )
}

/* SUB-HELPER RENDER LOGIC: Reusable Clean Component to keep things optimized */
function SearchResultsList({ loading, totalResults, results, handleOpenNote, handleOpenChat }) {
  if (loading) return <div className="py-4 text-center text-xs text-slate-400">Searching context files...</div>
  if (totalResults === 0) return <div className="py-4 text-center text-xs text-slate-400">No matching indexes found.</div>

  return (
    <>
      {results.notes.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 px-1 text-[9px] font-bold uppercase tracking-wider text-cyan-400">Notes</p>
          <div className="space-y-0.5">
            {results.notes.map((note) => (
              <button key={note._id} onClick={() => handleOpenNote(note._id)} className="flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-white/[0.04] transition">
                <FileText size={12} className="mt-0.5 text-cyan-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-medium text-slate-200">{note.title}</h4>
                  <p className="line-clamp-1 text-[10px] text-slate-500 mt-0.5">{note.content}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {results.chats.length > 0 && (
        <div>
          <p className="mb-1 px-1 text-[9px] font-bold uppercase tracking-wider text-purple-400">AI Chats</p>
          <div className="space-y-0.5">
            {results.chats.map((chat) => (
              <button key={chat._id} onClick={() => handleOpenChat(chat._id)} className="flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-white/[0.04] transition">
                <MessageCircle size={12} className="mt-0.5 text-purple-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-medium text-slate-200">{chat.title || "Untitled Conversation"}</h4>
                  <p className="line-clamp-1 text-[10px] text-slate-500 mt-0.5">{chat.messages?.[chat.messages.length - 1]?.text || "Empty stream log."}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar