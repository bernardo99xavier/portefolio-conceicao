import { useState, useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import gsap from "gsap"

import { TransitionProvider } from "./context/TransitionContext"
import Navbar from "./components/Navbar"

export const NAV_LOGO_LEFT = 15
export const NAV_LOGO_TOP = 10

function App() {
  const [lang, setLang] = useState("pt")
  const [activeColor, setActiveColor] = useState(null)
  const [gridView, setGridView] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3
  )
  const flipCaptureRef = useRef(null)
  const location = useLocation()

  const changeView = (newView) => {
    if (newView === gridView) return
    if (flipCaptureRef.current) flipCaptureRef.current()
    setGridView(newView)
  }

  // Don't let the browser restore the previous scroll position on navigation
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
  }, [])

  // Always start at the top when the route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname === "/catalogo") {
      setActiveColor(null)
    }
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname === "/") return

    const logo = document.querySelector(".nav-logo")
    const navLinks = document.querySelector(".nav-links")

    const setNavPosition = () => {
      gsap.set(logo, {
        xPercent: 0,
        yPercent: 0,
        x: NAV_LOGO_LEFT - window.innerWidth / 2,
        y: NAV_LOGO_TOP - window.innerHeight / 2,
        scale: 1,
        filter: "brightness(1) invert(0)",
      })
      logo.classList.add("is-active")
      gsap.set(navLinks, { opacity: 1, y: 0 })
    }

    setNavPosition()
    window.addEventListener("resize", setNavPosition)
    return () => window.removeEventListener("resize", setNavPosition)
  }, [location.pathname])

  return (
    <HelmetProvider>
      <TransitionProvider>
        <Navbar
          lang={lang} setLang={setLang}
          activeColor={activeColor} setActiveColor={setActiveColor}
          gridView={gridView} changeView={changeView}
        />
        <Outlet context={{ lang, activeColor, gridView, flipCaptureRef }} />
      </TransitionProvider>
    </HelmetProvider>
  )
}

export default App
