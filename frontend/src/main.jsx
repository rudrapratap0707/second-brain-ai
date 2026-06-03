import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { applySettings } from "./utils/applySettings"
import "./clean-ui.css"

const savedSettings = JSON.parse(
  localStorage.getItem("appSettings")
)

applySettings(savedSettings)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)