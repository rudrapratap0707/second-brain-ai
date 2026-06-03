import { useState } from "react"

import { Link } from "react-router-dom"

import {
  Brain,
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import {
  forgotPassword,
} from "../services/authService"

function ForgotPassword() {
  const [email, setEmail] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [resetUrl, setResetUrl] =
    useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")
    setResetUrl("")

    if (!email.trim()) {
      setError(
        "Please enter your email"
      )

      return
    }

    try {
      setLoading(true)

      const data =
        await forgotPassword(email)

      setSuccess(
        data.message ||
          "Reset link generated successfully"
      )

      if (data.resetUrl) {
        setResetUrl(data.resetUrl)
      }
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Failed to generate reset link"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B1A] px-4 py-10 text-white md:px-6">
      {/* BACKGROUND */}
      <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl md:h-[500px] md:w-[500px]" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-3xl md:h-[500px] md:w-[500px]" />

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl md:p-8">
        {/* BACK BUTTON */}
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500 text-black shadow-lg shadow-cyan-500/20">
            <ShieldCheck size={34} />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold md:text-4xl">
            Forgot Password
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
            Enter your registered email
            address to generate a secure
            password reset link.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-5 rounded-2xl border border-green-500/30 bg-green-500/20 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* DEV RESET LINK */}
        {resetUrl && (
          <div className="mb-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                size={16}
                className="text-cyan-400"
              />

              <p className="text-sm font-semibold text-cyan-300">
                Development Reset Link
              </p>
            </div>

            <a
              href={resetUrl}
              className="block break-all text-sm leading-7 text-slate-300 transition hover:text-cyan-300"
            >
              {resetUrl}
            </a>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/15 md:text-base"
                required
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60 md:text-base"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Generating...
              </>
            ) : (
              <>
                Generate Reset Link

                <ArrowRight
                  size={18}
                />
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-sm leading-7 text-slate-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword