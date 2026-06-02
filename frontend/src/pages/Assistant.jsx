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

      setMessages([
        ...(data.chat.messages || []),
      ])

      localStorage.setItem(
        "activeChatId",
        id
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleNewChat = async () => {
    try {
      const data = await createChat()

      setActiveChat(data.chat)

      setMessages([])

      localStorage.setItem(
        "activeChatId",
        data.chat._id
      )

      await loadChats()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteChat = async (
    id,
    e
  ) => {
    if (e) {
      e.stopPropagation()
    }

    try {
      await deleteChat(id)

      if (activeChat?._id === id) {
        setActiveChat(null)
        setMessages([])

        localStorage.removeItem(
          "activeChatId"
        )
      }

      await loadChats()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSend = async () => {
    if (!message.trim() || loading)
      return

    let currentChat = activeChat

    try {
      if (!currentChat) {
        const data = await createChat()

        currentChat = data.chat

        setActiveChat(data.chat)

        localStorage.setItem(
          "activeChatId",
          data.chat._id
        )

        await loadChats()
      }

      const userMessage = {
        role: "user",
        text: message,
      }

      const currentMessage = message

      setMessages((prev) => [
        ...prev,
        userMessage,
      ])

      setMessage("")

      setLoading(true)

      const data =
        await sendMessageToChat(
          currentChat._id,
          currentMessage
        )

      setActiveChat(data.chat)

      setMessages([
        ...(data.chat.messages || []),
      ])

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
    const initializeChats =
      async () => {
        try {
          const data = await getChats()

          const allChats =
            data.chats || []

          setChats(allChats)

          const savedChatId =
            localStorage.getItem(
              "activeChatId"
            )

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
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        {/* CHAT HISTORY */}
        <div className="responsive-card border border-white/10 bg-white/10 p-4 md:p-5">
          <button
            onClick={handleNewChat}
            className="mb-5 w-full rounded-2xl bg-cyan-500 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            + New Chat
          </button>

          <h2 className="mb-4 text-xl font-bold md:text-2xl">
            Chat History
          </h2>

          <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1 xl:max-h-[700px]">
            {chats.length === 0 && (
              <p className="text-sm text-slate-400">
                No chats yet.
              </p>
            )}

            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() =>
                  openChat(chat._id)
                }
                className={`cursor-pointer rounded-2xl border p-3 transition ${
                  activeChat?._id ===
                  chat._id
                    ? "border-cyan-400 bg-cyan-500 text-black"
                    : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <div className="truncate font-medium">
                  {chat.title ||
                    "New Chat"}
                </div>

                <button
                  onClick={(e) =>
                    handleDeleteChat(
                      chat._id,
                      e
                    )
                  }
                  className="mt-2 text-xs text-red-300 hover:text-red-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CHAT */}
        <div className="flex min-h-[70vh] flex-col">
          <div className="mb-6">
            <h1 className="responsive-title">
              AI Assistant
            </h1>

            <p className="mt-3 max-w-3xl text-sm text-slate-400 md:text-base">
              Ask questions about your
              notes, reminders, mood,
              productivity, exams, and
              study goals.
            </p>
          </div>

          <div className="flex flex-1 flex-col rounded-[28px] border border-white/10 bg-white/10 p-3 backdrop-blur-xl md:p-5">
            {/* MESSAGES */}
            <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-dashed border-white/20 p-3 text-slate-300 md:p-5">
              {messages.length === 0 && (
                <div className="flex min-h-[300px] items-center justify-center text-center">
                  <p className="max-w-md text-sm text-slate-400 md:text-base">
                    Your AI conversation
                    will appear here.
                  </p>
                </div>
              )}

              {messages.map(
                (msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    className={`w-fit max-w-full overflow-hidden rounded-3xl px-4 py-3 text-sm md:max-w-[85%] md:px-5 md:py-4 md:text-base ${
                      msg.role === "user"
                        ? "ml-auto bg-cyan-500 text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <div className="prose prose-invert max-w-none break-words prose-p:my-2 prose-pre:overflow-x-auto prose-code:break-words">
                        <ReactMarkdown>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="break-words whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    )}
                  </div>
                )
              )}

              {loading && (
                <p className="text-sm text-cyan-400 md:text-base">
                  AI is thinking...
                </p>
              )}
            </div>

            {/* INPUT */}
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                placeholder="Ask your Second Brain..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    handleSend()
                  }
                }}
                className="min-h-[54px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="min-h-[54px] rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-60 md:px-8 md:text-base"
              >
                {loading
                  ? "Sending..."
                  : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Assistant