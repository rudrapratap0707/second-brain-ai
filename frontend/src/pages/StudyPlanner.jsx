import DashboardLayout from "../layouts/DashboardLayout"
import { BookOpen, ArrowLeft, Construction } from "lucide-react"
import { Link } from "react-router-dom"

function StudyPlanner() {
  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-5xl space-y-5">
        <Link
          to="/student-life"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Student Life OS
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-black md:h-16 md:w-16">
              <BookOpen size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl md:text-5xl">
              Study Planner
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              This module will manage study plans, subject-wise sessions,
              revision cycles, backlog recovery, and AI-based study planning.
            </p>

            <div className="mt-6 rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-4 md:p-5">
              <div className="flex items-center gap-3 text-yellow-200">
                <Construction size={22} />
                <h2 className="text-lg font-bold md:text-xl">
                  Module Page Coming Next
                </h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Backend CRUD and AI automation will be connected here.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default StudyPlanner