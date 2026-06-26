import { useState, useRef, useEffect } from "react"

export default function VerColecaoButton({ className = "" }) {
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
      {soon ? "Em breve" : "Ver coleção"}
    </span>
  )
}
