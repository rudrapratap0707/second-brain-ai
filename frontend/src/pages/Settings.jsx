import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import { applySettings } from "../utils/applySettings"

import {
  getSettings,
  updateSettings,
} from "../services/authService"

import {
  Settings as SettingsIcon,
  Brain,
  Bell,
  Mail,
  Moon,
  Sun,
  Smile,
  Clock,
  Sparkles,
  LayoutDashboard,
  Type,
  Save,
  Loader2,
  CheckCircle2,
  X,
  Shield,
} from "lucide-react"

function Settings() {
  const [settings, setSettings] = useState({
    theme: "dark",
    aiMemory: true,
    notifications: true,
    emailAlerts: false,
    moodTracking: true,
    reminderAlerts: true,
    dashboardAnimations: true,
    compactMode: false,
    fontSize: "medium",
    aiPersonality: "friendly",
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getSettings()

      setSettings(data.settings)

      // APPLY SETTINGS GLOBALLY
      applySettings(data.settings)
    } catch (error) {
      console.log(error)
      setError("Failed to load settings.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleToggle = (field) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError("")
      setSuccess("")

      if (
        settings.notifications &&
        "Notification" in window &&
        Notification.permission === "default"
      ) {
        await Notification.requestPermission()
      }

      const data = await updateSettings(settings)

      setSettings(data.settings)

      // APPLY UPDATED SETTINGS
      applySettings(data.settings)

      setSuccess("Settings saved successfully.")
    } catch (error) {
      console.log(error)
      setError("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  const resetDefaults = () => {
    setSettings({
      theme: "dark",
      aiMemory: true,
      notifications: true,
      emailAlerts: false,
      moodTracking: true,
      reminderAlerts: true,
      dashboardAnimations: true,
      compactMode: false,
      fontSize: "medium",
      aiPersonality: "friendly",
    })
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4">
              <SettingsIcon className="text-cyan-400" size={44} />

              <h1 className="text-5xl font-bold">
                Settings
              </h1>
            </div>

            <p className="text-slate-400 mt-4 text-lg">
              Customize your SecondBrain workspace, AI behavior, and productivity preferences.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}

            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {loading && (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-8 mb-8 flex items-center gap-3 text-cyan-300">
            <Loader2 className="animate-spin" />
            Loading settings...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-400/20 text-red-300 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
            <span>{error}</span>

            <button onClick={() => setError("")}>
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-400/20 text-green-300 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
            <span>{success}</span>

            <button onClick={() => setSuccess("")}>
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-6">
          <div className="space-y-6">
            <SectionCard
              icon={<Brain className="text-cyan-400" size={28} />}
              title="AI Preferences"
              description="Control how your assistant uses memory and responds."
            >
              <ToggleRow
                icon={<Brain size={22} />}
                title="AI Memory"
                description="Allow AI to use your notes, files, moods, reminders, and chat history."
                checked={settings.aiMemory}
                onClick={() => handleToggle("aiMemory")}
              />

              <SelectRow
                icon={<Sparkles size={22} />}
                title="AI Personality"
                description="Choose how SecondBrain AI should respond."
                value={settings.aiPersonality}
                onChange={(value) =>
                  handleChange("aiPersonality", value)
                }
                options={[
                  "friendly",
                  "professional",
                  "motivational",
                  "minimal",
                ]}
              />
            </SectionCard>

            <SectionCard
              icon={<Bell className="text-purple-400" size={28} />}
              title="Notifications"
              description="Manage alerts and reminder preferences."
            >
              <ToggleRow
                icon={<Bell size={22} />}
                title="App Notifications"
                description="Enable general in-app notifications."
                checked={settings.notifications}
                onClick={() => handleToggle("notifications")}
              />

              <ToggleRow
                icon={<Clock size={22} />}
                title="Reminder Alerts"
                description="Show alerts for due reminders and deadlines."
                checked={settings.reminderAlerts}
                onClick={() => handleToggle("reminderAlerts")}
              />

              <ToggleRow
                icon={<Mail size={22} />}
                title="Email Alerts"
                description="Receive important productivity alerts by email."
                checked={settings.emailAlerts}
                onClick={() => handleToggle("emailAlerts")}
              />
            </SectionCard>

            <SectionCard
              icon={<Smile className="text-green-400" size={28} />}
              title="Mood & Productivity"
              description="Personalize emotional tracking and dashboard behavior."
            >
              <ToggleRow
                icon={<Smile size={22} />}
                title="Mood Tracking"
                description="Enable mood history and emotional insights."
                checked={settings.moodTracking}
                onClick={() => handleToggle("moodTracking")}
              />

              <ToggleRow
                icon={<LayoutDashboard size={22} />}
                title="Dashboard Animations"
                description="Enable smooth dashboard animations and transitions."
                checked={settings.dashboardAnimations}
                onClick={() => handleToggle("dashboardAnimations")}
              />

              <ToggleRow
                icon={<LayoutDashboard size={22} />}
                title="Compact Mode"
                description="Reduce spacing and make the dashboard more compact."
                checked={settings.compactMode}
                onClick={() => handleToggle("compactMode")}
              />
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              icon={<Moon className="text-yellow-300" size={28} />}
              title="Appearance"
              description="Customize theme and reading comfort."
            >
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChange("theme", "dark")}
                  className={`rounded-3xl border p-5 text-left transition ${
                    settings.theme === "dark"
                      ? "bg-cyan-500 text-black border-cyan-400"
                      : "bg-white/10 border-white/10 hover:bg-white/20"
                  }`}
                >
                  <Moon size={28} />

                  <h3 className="font-bold text-xl mt-4">
                    Dark
                  </h3>

                  <p
                    className={`text-sm mt-2 ${
                      settings.theme === "dark"
                        ? "text-black/70"
                        : "text-slate-400"
                    }`}
                  >
                    Futuristic dark workspace.
                  </p>
                </button>

                <button
                  onClick={() => handleChange("theme", "light")}
                  className={`rounded-3xl border p-5 text-left transition ${
                    settings.theme === "light"
                      ? "bg-cyan-500 text-black border-cyan-400"
                      : "bg-white/10 border-white/10 hover:bg-white/20"
                  }`}
                >
                  <Sun size={28} />

                  <h3 className="font-bold text-xl mt-4">
                    Light
                  </h3>

                  <p
                    className={`text-sm mt-2 ${
                      settings.theme === "light"
                        ? "text-black/70"
                        : "text-slate-400"
                    }`}
                  >
                    Clean light workspace.
                  </p>
                </button>
              </div>

              <SelectRow
                icon={<Type size={22} />}
                title="Font Size"
                description="Adjust interface text size."
                value={settings.fontSize}
                onChange={(value) =>
                  handleChange("fontSize", value)
                }
                options={["small", "medium", "large"]}
              />
            </SectionCard>

            <SectionCard
              icon={<Shield className="text-red-400" size={28} />}
              title="Account Safety"
              description="Important local session controls."
            >
              <div className="bg-black/20 border border-white/5 rounded-3xl p-5">
                <h3 className="text-xl font-bold">
                  Local Session
                </h3>

                <p className="text-slate-400 mt-2">
                  Your token and active chat are stored locally in this browser.
                </p>

                <button
                  onClick={() => {
                    localStorage.removeItem("activeChatId")
                    setSuccess("Active chat session cleared.")
                  }}
                  className="mt-5 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10"
                >
                  Clear Active Chat
                </button>
              </div>

              <div className="bg-red-500/10 border border-red-400/20 rounded-3xl p-5 mt-5">
                <h3 className="text-xl font-bold text-red-300">
                  Reset Unsaved Changes
                </h3>

                <p className="text-slate-400 mt-2">
                  This resets settings form to default values. Click save to persist.
                </p>

                <button
                  onClick={resetDefaults}
                  className="mt-5 px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-semibold"
                >
                  Reset Defaults
                </button>
              </div>
            </SectionCard>

            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-[32px] p-7">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-300" size={28} />

                <h2 className="text-2xl font-bold text-cyan-300">
                  Current Setup
                </h2>
              </div>

              <div className="mt-6 space-y-3 text-slate-300">
                <SummaryItem
                  label="Theme"
                  value={settings.theme}
                />

                <SummaryItem
                  label="AI Memory"
                  value={settings.aiMemory ? "Enabled" : "Disabled"}
                />

                <SummaryItem
                  label="Notifications"
                  value={settings.notifications ? "Enabled" : "Disabled"}
                />

                <SummaryItem
                  label="AI Personality"
                  value={settings.aiPersonality}
                />

                <SummaryItem
                  label="Font Size"
                  value={settings.fontSize}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function SectionCard({ icon, title, description, children }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
      <div className="flex items-start gap-4 mb-7">
        <div className="p-3 bg-white/10 rounded-2xl">
          {icon}
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            {title}
          </h2>

          <p className="text-slate-400 mt-2">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between gap-5 bg-black/20 border border-white/5 rounded-3xl p-5">
      <div className="flex items-start gap-4">
        <div className="text-cyan-400 mt-1">
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold">
            {title}
          </h3>

          <p className="text-slate-400 mt-1">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onClick}
        className={`relative w-16 h-8 rounded-full transition ${
          checked ? "bg-cyan-500" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${
            checked ? "left-9" : "left-1"
          }`}
        ></span>
      </button>
    </div>
  )
}

function SelectRow({
  icon,
  title,
  description,
  value,
  onChange,
  options,
}) {
  return (
    <div className="bg-black/20 border border-white/5 rounded-3xl p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-cyan-400 mt-1">
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold">
            {title}
          </h3>

          <p className="text-slate-400 mt-1">
            {description}
          </p>
        </div>
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#11162A] border border-white/10 rounded-2xl px-4 py-3 outline-none text-white"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-black/20 border border-white/5 rounded-2xl px-4 py-3">
      <span className="text-slate-400">
        {label}
      </span>

      <span className="font-semibold capitalize">
        {value}
      </span>
    </div>
  )
}

export default Settings