import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import { getProfile } from "../services/authService"

function Profile() {
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile()

        setUser(data.user)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <h1 className="text-white text-3xl">
          Loading profile...
        </h1>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        
        <h1 className="text-5xl font-bold text-white mb-8">
          My Profile
        </h1>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          
          <div className="mb-6">
            <p className="text-slate-400 mb-2">
              Full Name
            </p>

            <h2 className="text-2xl text-white font-semibold">
              {user?.name}
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-slate-400 mb-2">
              Email Address
            </p>

            <h2 className="text-2xl text-white font-semibold">
              {user?.email}
            </h2>
          </div>

          <div>
            <p className="text-slate-400 mb-2">
              Account Created
            </p>

            <h2 className="text-2xl text-white font-semibold">
              {new Date(user?.createdAt).toLocaleDateString()}
            </h2>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile