import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import {
  Brain,
  KeyRound,
  Lock,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react"

import { resetPassword } from "../services/authService"

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (!token) {
      setError("Reset token missing. Please generate a new reset link.")
      return
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill both password fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      const data = await resetPassword(token, password)

      setSuccess(data.message || "Password reset successful. Please login.")

      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B1A] px-4 py-10 text-white md:px-6">
      <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl md:h-[500px] md:w-[500px]" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-3xl md:h-[500px] md:w-[500px]" />

      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl md:p-8">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500 text-black shadow-lg shadow-cyan-500/20">
            <KeyRound size={34} />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold md:text-4xl">
            Reset Password
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
            Create a new secure password for your Second Brain account.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/20 px-4 py-3 text-sm text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex gap-3 rounded-2xl border border-green-500/30 bg-green-500/20 px-4 py-3 text-sm text-green-300">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              New Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-12 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/15 md:text-base"
                required
                minLength={6}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password && (
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Password strength</span>
                  <span className={passwordStrength.textClass}>
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${passwordStrength.barClass}`}
                    style={{ width: `${passwordStrength.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-12 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/15 md:text-base"
                required
                minLength={6}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {confirmPassword && (
              <p
                className={`mt-2 text-xs ${
                  password === confirmPassword
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 md:text-base"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-sm leading-7 text-slate-400">
            Link expired?{" "}
            <Link
              to="/forgot-password"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Generate new link
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function getPasswordStrength(password) {
  let score = 0

  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (!password) {
    return {
      label: "Empty",
      percent: 0,
      textClass: "text-slate-500",
      barClass: "bg-slate-500",
    }
  }

  if (score <= 2) {
    return {
      label: "Weak",
      percent: 35,
      textClass: "text-red-300",
      barClass: "bg-red-400",
    }
  }

  if (score <= 4) {
    return {
      label: "Medium",
      percent: 70,
      textClass: "text-yellow-300",
      barClass: "bg-yellow-400",
    }
  }

  return {
    label: "Strong",
    percent: 100,
    textClass: "text-green-300",
    barClass: "bg-green-400",
  }
}

export default ResetPassword