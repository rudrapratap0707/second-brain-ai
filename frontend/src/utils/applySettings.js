export const applySettings = (settings) => {
  if (!settings) return

  const root = document.documentElement

  root.classList.remove(
    "theme-dark",
    "theme-light",
    "font-small",
    "font-medium",
    "font-large",
    "compact-mode"
  )

  root.classList.add(
    settings.theme === "light"
      ? "theme-light"
      : "theme-dark"
  )

  root.classList.add(
    settings.fontSize === "small"
      ? "font-small"
      : settings.fontSize === "large"
      ? "font-large"
      : "font-medium"
  )

  if (settings.compactMode) {
    root.classList.add("compact-mode")
  }

  localStorage.setItem(
    "appSettings",
    JSON.stringify(settings)
  )
}