import {
  LayoutDashboard,
  NotebookPen,
  Bell,
  Smile,
  Folder,
  Bot,
  Settings,
  GraduationCap,
  X,
} from "lucide-react"

import { Link, useLocation } from "react-router-dom"

function Sidebar({ sidebarOpen, setSidebarOpen }) {
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

  const closeSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10 bg-slate-950/95 p-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:bg-white/5 lg:p-6 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Second
              <span className="text-cyan-400">Brain</span>
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Your AI productivity OS
            </p>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-xl bg-white/10 p-2 text-slate-300 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`)

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${
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
    </>
  )
}

export default Sidebar