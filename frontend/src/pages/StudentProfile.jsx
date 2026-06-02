import DashboardLayout from "../layouts/DashboardLayout"

function StudentProfile() {
  return (
    <DashboardLayout>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-8">
        <h1 className="text-4xl font-bold text-white">
          Student Profile
        </h1>

        <p className="mt-4 text-slate-400">
          Student academic profile system.
        </p>
      </div>
    </DashboardLayout>
  )
}

export default StudentProfile