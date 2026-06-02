import {
  LayoutDashboard,
  NotebookPen,
  Bell,
  Smile,
  Folder,
  Bot,
  Settings,
  GraduationCap,
} from "lucide-react"

import { Link, useLocation } from "react-router-dom"

function Sidebar() {
  const location = useLocation()

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Student Life OS",
      icon: GraduationCap,
      path: "/student-life",
    },
    {
      name: "Notes",
      icon: NotebookPen,
      path: "/notes",
    },
    {
      name: "Reminders",
      icon: Bell,
      path: "/reminders",
    },
    {
      name: "Mood",
      icon: Smile,
      path: "/mood",
    },
    {
      name: "Files",
      icon: Folder,
      path: "/files",
    },
    {
      name: "AI Assistant",
      icon: Bot,
      path: "/assistant",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ]

  return (
    <aside className="w-72 h-screen bg-white/5 border-r border-white/10 backdrop-blur-xl fixed left-0 top-0 p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Second<span className="text-cyan-400">Brain</span>
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Your AI productivity OS
        </p>
      </div>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500 text-black font-semibold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar