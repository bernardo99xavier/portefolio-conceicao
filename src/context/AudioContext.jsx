import { useEffect, useRef } from "react"
import musicSrc from "../assets/cf_background_music.mp3"

const FADE_SECONDS = 2.5
const MASTER_VOLUME = 0.5
const START_EVENTS = ["pointerdown", "touchstart", "keydown"]

export function AudioProvider({ children }) {
  const rafRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(musicSrc)
    audio.loop = false
    audio.preload = "auto"
    audio.volume = 0

    // loop=false + manual restart lets us fade out/in across the seam
    const handleEnded = () => {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
    audio.addEventListener("ended", handleEnded)

    const tick = () => {
      const d = audio.duration
      const t = audio.currentTime
      let factor = 1
      if (d && isFinite(d)) {
        if (t < FADE_SECONDS) factor = t / FADE_SECONDS
        else if (t > d - FADE_SECONDS) factor = (d - t) / FADE_SECONDS
      }
      audio.volume = Math.min(1, Math.max(0, factor)) * MASTER_VOLUME
      rafRef.current = requestAnimationFrame(tick)
    }

    // Browsers block audio-with-sound until a real user gesture happens —
    // start silently on the first click/tap/keypress anywhere on the page
    const start = () => {
      if (startedRef.current) return
      startedRef.current = true
      audio.play()
        .then(() => { rafRef.current = requestAnimationFrame(tick) })
        .catch(() => { startedRef.current = false })
      START_EVENTS.forEach(evt => window.removeEventListener(evt, start))
    }
    START_EVENTS.forEach(evt => window.addEventListener(evt, start))

    return () => {
      audio.removeEventListener("ended", handleEnded)
      cancelAnimationFrame(rafRef.current)
      audio.pause()
      START_EVENTS.forEach(evt => window.removeEventListener(evt, start))
    }
  }, [])

  return children
}
