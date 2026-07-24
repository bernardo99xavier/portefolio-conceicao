import { createContext, useContext, useState, useCallback, useMemo } from "react"
import { TRANSLATIONS } from "../data/translations"

const LangContext = createContext()

// Language lives in memory only (no storage), so it survives client-side
// navigation but resets to PT whenever the site is loaded fresh.
export function LangProvider({ children }) {
  const [lang, setLang] = useState("pt")

  // t("key") -> string | string[]; vars fill {placeholders}
  const t = useCallback((key, vars) => {
    const entry = TRANSLATIONS[key]
    if (!entry) {
      if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`)
      return key
    }
    const value = entry[lang] ?? entry.pt
    if (!vars) return value
    const fill = s => s.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)
    return Array.isArray(value) ? value.map(fill) : fill(value)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
