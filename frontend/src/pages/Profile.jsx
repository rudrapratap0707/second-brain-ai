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
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-cyan-400" size={40} />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-shell mx-auto max-w-6xl space-y-5 md:space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:rounded-[32px] md:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500 text-black">
              <UserCircle2 size={36} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl md:text-5xl">
                Account Control Center
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
                Manage your profile, security, password, and account access.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <AlertBox type="error" text={error} />
        )}

        {message && (
          <AlertBox type="success" text={message} />
        )}

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
            <div className="flex flex-col items-center text-center">
              <UserCircle2 size={86} className="text-cyan-400" />

              <h2 className="mt-4 text-2xl font-bold text-white">
                {user?.name}
              </h2>

              <p className="mt-2 break-all text-sm text-slate-400">
                {user?.email}
              </p>
            </div>

            <div className="mt-6 space-y-3">
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

          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Settings size={24} className="text-cyan-400" />

                <h2 className="text-xl font-bold text-white md:text-2xl">
                  Profile Settings
                </h2>
              </div>

              <label className="block">
                <span className="text-sm text-slate-400">
                  Full Name
                </span>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
                  placeholder="Enter your name"
                />
              </label>

              <button
                onClick={handleUpdateName}
                disabled={saving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 sm:w-fit"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ActionCard
                icon={KeyRound}
                title="Reset Password"
                text="Send password reset link to your registered email."
                buttonText={resetLoading ? "Sending..." : "Send Reset Link"}
                onClick={handlePasswordReset}
                loading={resetLoading}
              />

              <ActionCard
                icon={LogOut}
                title="Logout"
                text="Securely logout from this device."
                buttonText="Logout"
                onClick={handleLogout}
                danger
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                More Controls
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  to="/settings"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/20 hover:text-white"
                >
                  Open App Settings
                </Link>

                <Link
                  to="/forgot-password"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/20 hover:text-white"
                >
                  Forgot Password Page
                </Link>

                <Link
                  to="/dashboard"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/20 hover:text-white"
                >
                  Dashboard
                </Link>

                <Link
                  to="/student-life"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/20 hover:text-white"
                >
                  Student Life OS
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
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <span className="text-sm">{label}</span>
      </div>

      <p className="break-all text-sm font-semibold text-white md:text-base">
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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:p-6">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
          danger
            ? "bg-red-500/20 text-red-300"
            : "bg-cyan-500/20 text-cyan-300"
        }`}
      >
        <Icon size={24} />
      </div>

      <h3 className="text-xl font-bold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>

      <button
        onClick={onClick}
        disabled={loading}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition disabled:opacity-60 ${
          danger
            ? "bg-red-500 text-white hover:bg-red-400"
            : "bg-cyan-500 text-black hover:bg-cyan-400"
        }`}
      >
        {loading && <Loader2 size={17} className="animate-spin" />}
        {buttonText}
      </button>
    </div>
  )
}

function AlertBox({ type, text }) {
  const styles =
    type === "error"
      ? "border-red-500/30 bg-red-500/20 text-red-300"
      : "border-green-500/30 bg-green-500/20 text-green-300"

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
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