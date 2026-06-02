import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import {
  Brain,
  Sparkles,
  Shield,
  Zap,
  Bot,
  FileText,
  ArrowRight,
} from "lucide-react"

function Landing() {
  const token = localStorage.getItem("token")

  return (
    <div className="min-h-screen bg-[#070B1A] text-white overflow-hidden relative">
      {/* BACKGROUND */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl top-[-100px] left-[-100px]" />

      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#070B1A]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <Brain
              className="text-cyan-400"
              size={36}
            />

            <div>
              <h1 className="font-bold text-xl">
                SecondBrain
              </h1>

              <p className="text-xs text-slate-400">
                Your AI productivity OS
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to={token ? "/notes" : "/login"}
              className="text-slate-300 hover:text-white transition"
            >
              Notes
            </Link>

            <Link
              to={token ? "/assistant" : "/login"}
              className="text-slate-300 hover:text-white transition"
            >
              AI Assistant
            </Link>

            <Link
              to={token ? "/dashboard" : "/login"}
              className="px-5 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
            >
              {token ? "Dashboard" : "Login"}
            </Link>

            {!token && (
              <Link
                to="/signup"
                className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="max-w-6xl mx-auto text-center"
        >
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
            <Sparkles
              size={18}
              className="text-cyan-400"
            />

            <span className="text-sm text-slate-300">
              AI Personal Productivity Dashboard
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Build Your Own{" "}

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
              Second Brain
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Save notes, chat with AI, summarize ideas,
            organize files, and create your own memory-powered
            productivity workspace with persistent AI memory.
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to={token ? "/dashboard" : "/signup"}
              className="group px-8 py-4 rounded-2xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition flex items-center gap-2"
            >
              {token
                ? "Open Dashboard"
                : "Start Building"}

              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition"
              />
            </Link>

            <Link
              to={token ? "/assistant" : "/login"}
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
            >
              Try AI Assistant
            </Link>
          </div>

          {/* FEATURE GRID */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={
                <Brain
                  className="text-cyan-400 mb-4"
                  size={34}
                />
              }
              title="Smart Notes"
              text="Create, organize, and summarize notes using AI-powered workflows."
              link={token ? "/notes" : "/login"}
            />

            <FeatureCard
              icon={
                <Bot
                  className="text-purple-400 mb-4"
                  size={34}
                />
              }
              title="Memory AI Assistant"
              text="AI remembers your saved notes and previous conversations."
              link={token ? "/assistant" : "/login"}
            />

            <FeatureCard
              icon={
                <Shield
                  className="text-green-400 mb-4"
                  size={34}
                />
              }
              title="Private Workspace"
              text="All chats, notes, and productivity data stay linked to your account."
              link={token ? "/dashboard" : "/login"}
            />
          </div>

          {/* SECOND GRID */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <FeatureCard
              icon={
                <Zap
                  className="text-yellow-400 mb-4"
                  size={34}
                />
              }
              title="Fast Workflow"
              text="Switch instantly between AI, notes, reminders, and productivity tools."
              link={token ? "/dashboard" : "/login"}
            />

            <FeatureCard
              icon={
                <FileText
                  className="text-pink-400 mb-4"
                  size={34}
                />
              }
              title="Persistent Database"
              text="Everything is securely stored inside MongoDB Atlas with backend APIs."
              link={token ? "/profile" : "/login"}
            />

            <FeatureCard
              icon={
                <Sparkles
                  className="text-cyan-300 mb-4"
                  size={34}
                />
              }
              title="AI Summaries"
              text="Convert long lecture notes into short revision-ready study points."
              link={token ? "/notes" : "/login"}
            />
          </div>
        </motion.div>
      </section>
    </div>
  )
}

/* FEATURE CARD */
function FeatureCard({
  icon,
  title,
  text,
  link,
}) {
  return (
    <Link
      to={link}
      className="group text-left p-7 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl hover:bg-white/20 hover:border-cyan-400/30 transition duration-300"
    >
      {icon}

      <h3 className="text-2xl font-semibold">
        {title}
      </h3>

      <p className="text-slate-400 mt-3 leading-relaxed">
        {text}
      </p>

      <div className="flex items-center gap-2 mt-5 text-cyan-400 group-hover:translate-x-1 transition">
        <span className="text-sm font-medium">
          Explore
        </span>

        <ArrowRight size={16} />
      </div>
    </Link>
  )
}

export default Landing