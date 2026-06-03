import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"

import {
  getProfile,
  updateProfile,
  forgotPassword,
} from "../services/authService"

import {
  UserCircle2,
  Mail,
  CalendarDays,
  LogOut,
  Save,
  Loader2,
  ShieldCheck,
  KeyRound,
  Settings,
} from "lucide-react"

function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const fetchProfile = async () => {
    try {
      setLoading(true)

      const data = await getProfile()

      setUser(data.user)
      setName(data.user?.name || "")
    } catch (error) {
      console.log(error)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleUpdateName = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty")
      return
    }

    try {
      setSaving(true)
      setError("")
      setMessage("")

      const data = await updateProfile({
        name,
      })

      setUser(data.user)

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      setMessage("Profile updated successfully")
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      )
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return

    try {
      setResetLoading(true)
      setError("")
      setMessage("")

      const data = await forgotPassword(user.email)

      setMessage(
        data.message ||
          "Password reset link sent to your email"
      )
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to send reset link"
      )
    } finally {
      setResetLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("activeChatId")
    localStorage.removeItem("activeNoteId")

    navigate("/")
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <Loader2 className="animate-spin text-cyan-400" size={36} />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full mx-auto max-w-6xl space-y-4 px-2 py-3 sm:space-y-6 sm:px-4 md:space-y-8 md:py-4">
        
        {/* Header Hero Control Section */}
        <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md sm:p-6 md:rounded-3xl md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-black shadow-lg shadow-cyan-500/10 sm:h-14 sm:w-14 sm:rounded-2xl">
              <UserCircle2 className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-black text-white sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">
                Account Control Center
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-400">
                Manage your profile, security, password, and account access.
              </p>
            </div>
          </div>
        </section>

        {/* Global Feedback Notifications */}
        {error && <AlertBox type="error" text={error} />}
        {message && <AlertBox type="success" text={message} />}

        {/* Operational Split Grid Area */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-5">
          
          {/* Left Block: Meta Snapshot Panel */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md sm:p-5 md:p-6 flex flex-col justify-start">
            <div className="flex flex-col items-center text-center pb-5 border-b border-white/[0.04]">
              <div className="p-2 rounded-full bg-white/5">
                <UserCircle2 size={64} className="text-cyan-400 sm:w-[76px] sm:h-[76px]" />
              </div>

              <h2 className="mt-3 text-lg font-bold text-white sm:text-xl truncate max-w-full">
                {user?.name}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-400 font-medium px-2 bg-white/5 py-0.5 rounded-md">
                {user?.email}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <InfoRow icon={Mail} label="Email" value={user?.email} />

              <InfoRow
                icon={CalendarDays}
                label="Joined"
                value={formatDate(user?.createdAt)}
              />

              <InfoRow
                icon={ShieldCheck}
                label="Status"
                value="Active Account"
              />
            </div>
          </div>

          {/* Right Block: Dynamic Workstations Forms */}
          <div className="space-y-4 lg:col-span-2 md:space-y-5">
            
            {/* Input Modification Block */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md sm:p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <Settings size={18} className="text-cyan-400 shrink-0" />
                <h2 className="text-base font-bold text-white sm:text-lg">
                  Profile Settings
                </h2>
              </div>

              <div className="space-y-1.5 w-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Name
                </span>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-black/20 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-500/30 focus:bg-black/40"
                  placeholder="Enter your name"
                />
              </div>

              <button
                type="button"
                onClick={handleUpdateName}
                disabled={saving}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 sm:w-fit active:scale-[0.98]"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>

            {/* Micro Dual Action Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
              <ActionCard
                icon={KeyRound}
                title="Reset Password"
                text="Send password reset link to your registered email address."
                buttonText={resetLoading ? "Sending..." : "Send Reset Link"}
                onClick={handlePasswordReset}
                loading={resetLoading}
              />

              <ActionCard
                icon={LogOut}
                title="Logout"
                text="Securely logout and terminate current access session."
                buttonText="Logout"
                onClick={handleLogout}
                danger
              />
            </div>

            {/* Direct Routing Control Deck */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md sm:p-5 md:p-6">
              <h2 className="text-base font-bold text-white sm:text-lg mb-4">
                More Controls
              </h2>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Link
                  to="/settings"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 text-xs sm:text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <span>Open App Settings</span>
                </Link>

                <Link
                  to="/forgot-password"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 text-xs sm:text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <span>Forgot Password Page</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 text-xs sm:text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/student-life"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 text-xs sm:text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <span>Student Life OS</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-black/20 p-3.5 flex flex-col min-w-0 w-full">
      <div className="mb-1 flex items-center gap-2 text-slate-500">
        <Icon size={14} className="shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>

      <p className="break-all text-sm font-semibold text-white truncate max-w-full">
        {value || "Not available"}
      </p>
    </div>
  )
}

function ActionCard({
  icon: Icon,
  title,
  text,
  buttonText,
  onClick,
  danger,
  loading,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md flex flex-col justify-between">
      <div>
        <div
          className={`mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-500/10 text-red-400"
              : "bg-cyan-500/10 text-cyan-400"
          }`}
        >
          <Icon size={18} />
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>

        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-400">
          {text}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[0.98] disabled:opacity-60 ${
          danger
            ? "bg-red-500 text-white hover:bg-red-400"
            : "bg-cyan-500 text-black hover:bg-cyan-400"
        }`}
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        <span>{buttonText}</span>
      </button>
    </div>
  )
}

function AlertBox({ type, text }) {
  const styles =
    type === "error"
      ? "border-red-500/20 bg-red-500/10 text-red-300"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"

  return (
    <div className={`rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-medium w-full ${styles}`}>
      {text}
    </div>
  )
}

function formatDate(value) {
  if (!value) return "No date"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Invalid date"

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default Profile