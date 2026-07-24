import { useState, useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import gsap from "gsap"

import { TransitionProvider } from "./context/TransitionContext"
import { AudioProvider } from "./context/AudioContext"
import { LangProvider } from "./context/LangContext"
import Navbar from "./components/Navbar"

export const NAV_LOGO_LEFT = 15
export const NAV_LOGO_TOP = 10

function App() {
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

  // Track the visual viewport so the frame's bottom border stays pinned to the
  // bottom of the *visible* area, following the mobile browser chrome smoothly
  // (dvh alone snaps when the bottom toolbar shows/hides on scroll)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const root = document.documentElement
    const update = () => {
      // While pinch-zoomed (desktop), visualViewport.height shrinks and would
      // drag the frame's bottom border upward — fall back to 100dvh instead.
      if (vv.scale !== 1) {
        root.style.removeProperty("--viewport-h")
      } else {
        root.style.setProperty("--viewport-h", `${vv.height}px`)
      }
    }
    update()
    vv.addEventListener("resize", update)
    vv.addEventListener("scroll", update)
    return () => {
      vv.removeEventListener("resize", update)
      vv.removeEventListener("scroll", update)
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

    // top-left anchored, fixed pixels (see .nav-logo in index.css)
    gsap.set(logo, {
      xPercent: 0,
      yPercent: 0,
      x: NAV_LOGO_LEFT,
      y: NAV_LOGO_TOP,
      scale: 1,
      filter: "brightness(1) invert(0)",
    })
    logo.classList.add("is-active")
    gsap.set(navLinks, { opacity: 1, y: 0 })
  }, [location.pathname])

  return (
    <HelmetProvider>
      <AudioProvider>
        <LangProvider>
          <TransitionProvider>
            <Navbar
              activeColor={activeColor} setActiveColor={setActiveColor}
              gridView={gridView} changeView={changeView}
            />
            <Outlet context={{ activeColor, gridView, flipCaptureRef }} />
          </TransitionProvider>
        </LangProvider>
      </AudioProvider>
    </HelmetProvider>
  )
}

export default App
