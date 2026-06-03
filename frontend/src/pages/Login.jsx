import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import {
  Brain,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react"

import { loginUser } from "../services/authService"

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] =
    useState(false)

  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const data = await loginUser(
        formData
      )

      localStorage.setItem(
        "token",
        data.token
      )

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      navigate("/dashboard")
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Login failed"
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

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl md:p-8">
        {/* LOGO */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-black">
            <Brain size={30} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Login to continue your
              Second Brain workspace.
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* EMAIL */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/40 md:text-base"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={
                formData.password
              }
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/40 md:text-base"
              required
            />
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-cyan-400 transition hover:text-cyan-300"
            >
              Forgot password?
            </Link>
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
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight
                  size={18}
                />
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-7 text-center text-sm text-slate-400 md:text-base">
          Don&apos;t have an
          account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login