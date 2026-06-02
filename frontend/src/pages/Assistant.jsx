import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import ReactMarkdown from "react-markdown"

import {
  createChat,
  getChats,
  getChatById,
  deleteChat,
  sendMessageToChat,
} from "../services/authService"

function Assistant() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [loading, setLoading] = useState(false)

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

      localStorage.setItem("activeChatId", data.chat._id)

      await loadChats()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteChat = async (id, e) => {
    if (e) {
      e.stopPropagation()
    }

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

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* CHAT HISTORY SIDEBAR */}
        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 h-[680px] overflow-y-auto">
          <button
            onClick={handleNewChat}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-2xl mb-5"
          >
            + New Chat
          </button>

          <h2 className="text-xl font-bold mb-4">
            Chat History
          </h2>

          <div className="space-y-3">
            {chats.length === 0 && (
              <p className="text-slate-400 text-sm">
                No chats yet.
              </p>
            )}

            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => openChat(chat._id)}
                className={`p-3 rounded-2xl cursor-pointer border transition ${
                  activeChat?._id === chat._id
                    ? "bg-cyan-500 text-black border-cyan-400"
                    : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                }`}
              >
                <div className="font-medium truncate">
                  {chat.title || "New Chat"}
                </div>

                <button
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                  className="text-xs mt-2 text-red-300 hover:text-red-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div>
          <h1 className="text-4xl font-bold">
            AI Assistant
          </h1>

          <p className="text-slate-400 mt-3">
            Ask questions about your notes, reminders, mood, and productivity.
          </p>

          <div className="mt-10 bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl min-h-[600px] flex flex-col">
            <div className="flex-1 border border-dashed border-white/20 rounded-2xl p-6 text-slate-300 overflow-y-auto space-y-4">
              {messages.length === 0 && (
                <p className="text-slate-400">
                  AI conversation will appear here.
                </p>
              )}

              {messages.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={`p-4 rounded-2xl max-w-[80%] overflow-x-auto ${
                    msg.role === "user"
                      ? "bg-cyan-500 text-black ml-auto"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <div className="prose prose-invert max-w-none prose-p:my-2 prose-li:my-1 prose-headings:text-white prose-strong:text-white">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-3xl font-bold mb-4 text-white">
                              {children}
                            </h1>
                          ),

                          h2: ({ children }) => (
                            <h2 className="text-2xl font-bold mb-3 text-white">
                              {children}
                            </h2>
                          ),

                          h3: ({ children }) => (
                            <h3 className="text-xl font-bold mb-2 text-white">
                              {children}
                            </h3>
                          ),

                          p: ({ children }) => (
                            <p className="mb-3 leading-7 text-slate-200">
                              {children}
                            </p>
                          ),

                          ul: ({ children }) => (
                            <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-200">
                              {children}
                            </ul>
                          ),

                          ol: ({ children }) => (
                            <ol className="list-decimal pl-6 space-y-2 mb-4 text-slate-200">
                              {children}
                            </ol>
                          ),

                          li: ({ children }) => (
                            <li className="leading-7">
                              {children}
                            </li>
                          ),

                          strong: ({ children }) => (
                            <strong className="font-bold text-white">
                              {children}
                            </strong>
                          ),

                          code: ({ children }) => (
                            <code className="bg-black/30 px-2 py-1 rounded text-cyan-300">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}

              {loading && (
                <p className="text-cyan-400">
                  AI is thinking...
                </p>
              )}
            </div>

            <div className="mt-5 flex gap-4">
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
                className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-white placeholder:text-slate-500"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="px-8 py-3 rounded-2xl bg-cyan-500 text-black font-semibold disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Assistant