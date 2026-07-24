import { useState, useRef, useEffect } from "react"
import { useLang } from "../context/LangContext"

export default function VerColecaoButton({ className = "" }) {
  const { t } = useLang()
  const [soon, setSoon] = useState(false)
  const timer = useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setSoon(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSoon(false), 2000)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <span
      className={`image-caption__cta${className ? " " + className : ""}`}
      onClick={handleClick}
    >
      {soon ? t("cta.emBreve") : t("cta.verColecao")}
    </span>
  )
}
