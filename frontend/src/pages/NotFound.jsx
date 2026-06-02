import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="min-h-screen bg-[#070B1A] text-white flex items-center justify-center px-6">
      <div className="text-center bg-white/10 border border-white/10 rounded-3xl p-10 backdrop-blur-xl max-w-xl">
        <h1 className="text-7xl font-bold text-cyan-400">404</h1>

        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>

        <p className="text-slate-400 mt-4">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-8 px-6 py-3 rounded-2xl bg-cyan-500 text-black font-semibold"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound