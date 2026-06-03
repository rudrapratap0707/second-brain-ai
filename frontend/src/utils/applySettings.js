export const applySettings = (settings) => {
  const root = document.documentElement

  root.classList.remove(
    "theme-dark",
    "theme-light",
    "font-small",
    "font-medium",
    "font-large",
    "compact-mode"
  )

  // DEFAULT SETTINGS
  const finalSettings = {
    theme: settings?.theme || "dark",
    fontSize:
      settings?.fontSize || "medium",
    compactMode:
      settings?.compactMode || false,
  }

  // THEME
  root.classList.add(
    finalSettings.theme === "light"
      ? "theme-light"
      : "theme-dark"
  )

  // FONT SIZE
  root.classList.add(
    finalSettings.fontSize === "small"
      ? "font-small"
      : finalSettings.fontSize ===
        "large"
      ? "font-large"
      : "font-medium"
  )

  // COMPACT MODE
  if (finalSettings.compactMode) {
    root.classList.add("compact-mode")
  }

  localStorage.setItem(
    "appSettings",
    JSON.stringify(finalSettings)
  )
}