"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system"
  return (localStorage.getItem("theme") as Theme) || "system"
}

function applyThemeToDom(resolved: "light" | "dark") {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

function subscribeSystemTheme(callback: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

function getSystemSnapshot() {
  return getSystemTheme()
}

function getServerSnapshot() {
  return "light" as const
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemSnapshot,
    getServerSnapshot,
  )
  const resolvedTheme: "light" | "dark" =
    theme === "system" ? systemTheme : theme

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyThemeToDom(resolveTheme(newTheme))
    try {
      localStorage.setItem("theme", newTheme)
    } catch {}
  }, [])

  useEffect(() => {
    applyThemeToDom(resolvedTheme)
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
