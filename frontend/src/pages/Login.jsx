import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../services/authService"

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await loginUser(formData)

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070B1A] text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>

        <p className="text-slate-400 mb-8">
          Login to continue your Second Brain workspace.
        </p>

        {error && (
          <div className="mb-5 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none placeholder:text-slate-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-6 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none placeholder:text-slate-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 text-black font-bold py-3 rounded-2xl hover:bg-cyan-400 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-slate-400 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-cyan-400">
            Create account
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login