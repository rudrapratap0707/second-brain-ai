import { useEffect } from "react"

import AppRoutes from "./routes/AppRoutes"

import { applySettings } from "./utils/applySettings"

import { getReminders } from "./services/authService"

function App() {
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings")

    if (savedSettings) {
      applySettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    const checkReminderNotifications = async () => {
      try {
        const savedSettings = JSON.parse(
          localStorage.getItem("appSettings")
        )

        if (!savedSettings?.notifications || !savedSettings?.reminderAlerts) {
          return
        }

        if (!("Notification" in window)) {
          return
        }

        if (Notification.permission !== "granted") {
          return
        }

        const data = await getReminders()

        const now = new Date()

        const dueSoon = (data.reminders || []).filter((item) => {
          if (item.completed) return false

          const due = new Date(item.dueDate)
          const diff = due - now

          return diff > 0 && diff <= 5 * 60 * 1000
        })

        dueSoon.forEach((item) => {
          new Notification("SecondBrain Reminder", {
            body: item.title,
          })
        })
      } catch (error) {
        console.log(error)
      }
    }

    checkReminderNotifications()

    const interval = setInterval(
      checkReminderNotifications,
      60 * 1000
    )

    return () => clearInterval(interval)
  }, [])

  return <AppRoutes />
}

export default App