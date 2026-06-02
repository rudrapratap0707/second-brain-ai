import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen app-bg app-text">
      <Sidebar />

      <div className="ml-72 min-h-screen">
        <Navbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout