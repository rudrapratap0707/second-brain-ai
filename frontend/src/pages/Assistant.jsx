import { useEffect, useRef, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import ReactMarkdown from "react-markdown"

import {
  createChat,
  getChats,
  getChatById,
  deleteChat,
  sendMessageToChat,
} from "../services/authService"

import {
  Bot,
  Plus,
  Trash2,
  MessageCircle,
  Send,
  Loader2,
  ChevronDown,
  X,
} from "lucide-react"

function Assistant() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false)

  const messagesEndRef = useRef(null)

  const loadChats = async () => {
    try {
      const data = await getChats()
      setChats(data.chats || [])
    } catch (error) {
      console.log(error)
    }
  }

  const openChat = async (id) => {
    try {
      const data = await getChatById(id)

      setActiveChat(data.chat)
      setMessages([...(data.chat.messages || [])])
      setMobileHistoryOpen(false)

      localStorage.setItem("activeChatId", id)
    } catch (error) {
      console.log(error)
    }
  }

  const handleNewChat = async () => {
    try {
      const data = await createChat()

      setActiveChat(data.chat)
      setMessages([])
      setMobileHistoryOpen(false)

      localStorage.setItem("activeChatId", data.chat._id)

      await loadChats()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteChat = async (id, e) => {
    if (e) e.stopPropagation()

    try {
      await deleteChat(id)

      if (activeChat?._id === id) {
        setActiveChat(null)
        setMessages([])
        localStorage.removeItem("activeChatId")
      }

      await loadChats()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSend = async () => {
    if (!message.trim() || loading) return

    let currentChat = activeChat

    try {
      if (!currentChat) {
        const data = await createChat()

        currentChat = data.chat
        setActiveChat(data.chat)

        localStorage.setItem("activeChatId", data.chat._id)

        await loadChats()
      }

      const userMessage = {
        role: "user",
        text: message,
      }

      const currentMessage = message

      setMessages((prev) => [...prev, userMessage])
      setMessage("")
      setLoading(true)

      const data = await sendMessageToChat(
        currentChat._id,
        currentMessage
      )

      setActiveChat(data.chat)
      setMessages([...(data.chat.messages || [])])

      await loadChats()
    } catch (error) {
      console.log(error)

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "AI response failed. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initializeChats = async () => {
      try {
        const data = await getChats()
        const allChats = data.chats || []

        setChats(allChats)

        const savedChatId = localStorage.getItem("activeChatId")

        if (savedChatId) {
          await openChat(savedChatId)
        }
      } catch (error) {
        console.log(error)
      }
    }

    initializeChats()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages, loading])

  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-7xl space-y-4 md:space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-black md:h-14 md:w-14">
                <Bot size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-white md:text-4xl">
                  AI Assistant
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                  Ask questions about notes, reminders, mood, productivity,
                  exams, and study goals.
                </p>
              </div>
            </div>

            <button
              onClick={handleNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 sm:w-auto"
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_1fr]">
          <div className="hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl xl:block">
            <ChatHistory
              chats={chats}
              activeChat={activeChat}
              openChat={openChat}
              handleDeleteChat={handleDeleteChat}
              handleNewChat={handleNewChat}
            />
          </div>

          <div className="xl:hidden">
            <button
              onClick={() => setMobileHistoryOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white"
            >
              <span>
                {activeChat?.title || "Chat History"}
              </span>

              <ChevronDown
                size={18}
                className={`transition ${
                  mobileHistoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileHistoryOpen && (
              <div className="mt-3 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <ChatHistory
                  chats={chats}
                  activeChat={activeChat}
                  openChat={openChat}
                  handleDeleteChat={handleDeleteChat}
                  handleNewChat={handleNewChat}
                  compact
                />
              </div>
            )}
          </div>

          <div className="flex min-h-[calc(100vh-260px)] flex-col rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl md:min-h-[calc(100vh-230px)] md:p-5">
            <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              <div className="h-[54vh] space-y-3 overflow-y-auto p-3 md:h-[62vh] md:p-5">
                {messages.length === 0 && (
                  <EmptyChat />
                )}

                {messages.map((msg, index) => (
                  <ChatBubble
                    key={`${msg.role}-${index}`}
                    msg={msg}
                  />
                ))}

                {loading && (
                  <div className="flex w-fit max-w-[85%] items-center gap-2 rounded-3xl bg-white/10 px-4 py-3 text-sm text-cyan-300">
                    <Loader2 size={16} className="animate-spin" />
                    AI is thinking...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Ask your Second Brain..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend()
                  }
                }}
                className="min-h-[50px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
              />

              <button
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 sm:w-[130px]"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}

                <span>{loading ? "Wait" : "Send"}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function ChatHistory({
  chats,
  activeChat,
  openChat,
  handleDeleteChat,
  handleNewChat,
  compact = false,
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white md:text-xl">
          Chat History
        </h2>

        {compact && (
          <button
            onClick={handleNewChat}
            className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-black"
          >
            New
          </button>
        )}
      </div>

      {!compact && (
        <button
          onClick={handleNewChat}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
        >
          <Plus size={18} />
          New Chat
        </button>
      )}

      <div className="max-h-[280px] space-y-3 overflow-y-auto pr-1 md:max-h-[420px] xl:max-h-[620px]">
        {chats.length === 0 && (
          <p className="text-sm text-slate-400">
            No chats yet.
          </p>
        )}

        {chats.map((chat) => {
          const isActive = activeChat?._id === chat._id

          return (
            <div
              key={chat._id}
              onClick={() => openChat(chat._id)}
              className={`cursor-pointer rounded-2xl border p-3 transition ${
                isActive
                  ? "border-cyan-400 bg-cyan-500 text-black"
                  : "border-white/10 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {chat.title || "New Chat"}
                  </div>

                  <p
                    className={`mt-1 line-clamp-1 text-xs ${
                      isActive ? "text-black/70" : "text-slate-400"
                    }`}
                  >
                    {chat.messages?.[chat.messages.length - 1]?.text ||
                      "Open conversation"}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                  className={`shrink-0 rounded-xl p-2 ${
                    isActive
                      ? "bg-black/10 text-black"
                      : "bg-red-500/10 text-red-300 hover:bg-red-500/20"
                  }`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChatBubble({ msg }) {
  const isUser = msg.role === "user"

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[92%] overflow-hidden rounded-3xl px-4 py-3 text-sm leading-7 md:max-w-[82%] md:px-5 md:py-4 md:text-base ${
          isUser
            ? "bg-cyan-500 text-black"
            : "bg-white/10 text-white"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words">
            {msg.text}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none break-words prose-p:my-2 prose-pre:max-w-full prose-pre:overflow-x-auto prose-code:break-words">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyChat() {
  return (
    <div className="flex min-h-[260px] items-center justify-center text-center md:min-h-[360px]">
      <div className="max-w-sm rounded-3xl border border-dashed border-white/10 p-6">
        <MessageCircle size={42} className="mx-auto text-slate-500" />

        <h3 className="mt-4 text-xl font-bold text-white">
          Start a conversation
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Ask anything about your notes, files, reminders, mood, or study
          goals.
        </p>
      </div>
    </div>
  )
}

export default Assistant