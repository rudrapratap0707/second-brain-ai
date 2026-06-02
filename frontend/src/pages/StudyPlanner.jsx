import DashboardLayout from "../layouts/DashboardLayout"
import { BookOpen } from "lucide-react"
import { Link } from "react-router-dom"

function StudyPlanner() {
  return (
    <DashboardLayout>
      <Page title="Study Planner" icon={BookOpen} />
    </DashboardLayout>
  )
}

function Page({ title, icon: Icon }) {
  return (
    <div className="space-y-6">
      <Link to="/student-life" className="text-slate-400 hover:text-white">
        ← Back to Student Life OS
      </Link>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-8">
        <Icon size={42} className="text-cyan-400" />
        <h1 className="mt-4 text-4xl font-bold text-white">{title}</h1>
        <p className="mt-3 text-slate-400">
          Backend CRUD and AI automation will be connected here.
        </p>
      </div>
    </div>
  )
}

export default StudyPlanner