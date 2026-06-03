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
    <div className="relative min-h-screen overflow-x-hidden bg-[#070B1A] text-white">
      <div className="absolute left-[-120px] top-[-120px] h-[360px] w-[360px] rounded-full bg-cyan-500/20 blur-3xl md:h-[500px] md:w-[500px]" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[360px] w-[360px] rounded-full bg-purple-600/20 blur-3xl md:h-[500px] md:w-[500px]" />

      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#070B1A]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2 md:gap-3">
            <Brain className="shrink-0 text-cyan-400" size={30} />

            <div className="min-w-0">
              <h1 className="truncate text-base font-extrabold leading-tight text-white md:text-xl">
                Second<span className="text-cyan-400">Brain</span>
              </h1>

              <p className="hidden text-xs text-slate-400 sm:block">
                Your AI productivity OS
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            <Link
              to={token ? "/notes" : "/login"}
              className="hidden text-sm text-slate-300 transition hover:text-white md:block"
            >
              Notes
            </Link>

            <Link
              to={token ? "/assistant" : "/login"}
              className="hidden text-sm text-slate-300 transition hover:text-white md:block"
            >
              AI Assistant
            </Link>

            <Link
              to={token ? "/dashboard" : "/login"}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 md:px-5"
            >
              {token ? "Dashboard" : "Login"}
            </Link>

            {!token && (
              <Link
                to="/signup"
                className="hidden rounded-xl bg-cyan-500 px-5 py-2 text-sm font-bold text-black transition hover:bg-cyan-400 sm:block"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-16 pt-28 md:px-6 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-6xl text-center"
        >
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2">
            <Sparkles size={17} className="shrink-0 text-cyan-400" />
            <span className="text-xs text-slate-300 md:text-sm">
              AI Personal Productivity Dashboard
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-7xl">
            Build Your Own{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Second Brain
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:mt-8 md:text-xl">
            Save notes, chat with AI, summarize ideas, organize files, and
            create your own memory-powered productivity workspace with
            persistent AI memory.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-12">
            <Link
              to={token ? "/dashboard" : "/signup"}
              className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-7 py-4 font-bold text-black transition hover:bg-cyan-400 sm:w-auto"
            >
              {token ? "Open Dashboard" : "Start Building"}
              <ArrowRight size={20} className="transition group-hover:translate-x-1" />
            </Link>

            <Link
              to={token ? "/assistant" : "/login"}
              className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/10 px-7 py-4 font-semibold text-white transition hover:bg-white/20 sm:w-auto"
            >
              Try AI Assistant
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-20 md:gap-6">
            <FeatureCard
              icon={<Brain className="mb-4 text-cyan-400" size={32} />}
              title="Smart Notes"
              text="Create, organize, and summarize notes using AI-powered workflows."
              link={token ? "/notes" : "/login"}
            />

            <FeatureCard
              icon={<Bot className="mb-4 text-purple-400" size={32} />}
              title="Memory AI Assistant"
              text="AI remembers your saved notes and previous conversations."
              link={token ? "/assistant" : "/login"}
            />

            <FeatureCard
              icon={<Shield className="mb-4 text-green-400" size={32} />}
              title="Private Workspace"
              text="All chats, notes, and productivity data stay linked to your account."
              link={token ? "/dashboard" : "/login"}
            />

            <FeatureCard
              icon={<Zap className="mb-4 text-yellow-400" size={32} />}
              title="Fast Workflow"
              text="Switch instantly between AI, notes, reminders, and productivity tools."
              link={token ? "/dashboard" : "/login"}
            />

            <FeatureCard
              icon={<FileText className="mb-4 text-pink-400" size={32} />}
              title="Persistent Database"
              text="Everything is securely stored inside MongoDB Atlas with backend APIs."
              link={token ? "/profile" : "/login"}
            />

            <FeatureCard
              icon={<Sparkles className="mb-4 text-cyan-300" size={32} />}
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

function FeatureCard({ icon, title, text, link }) {
  return (
    <Link
      to={link}
      className="group rounded-3xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur-xl transition duration-300 hover:border-cyan-400/30 hover:bg-white/20 md:p-7"
    >
      {icon}

      <h3 className="text-xl font-bold md:text-2xl">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
        {text}
      </p>

      <div className="mt-5 flex items-center gap-2 text-cyan-400 transition group-hover:translate-x-1">
        <span className="text-sm font-medium">Explore</span>
        <ArrowRight size={16} />
      </div>
    </Link>
  )
}

export default Landing