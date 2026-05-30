import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import gsap from "gsap"

import { TransitionProvider } from "./context/TransitionContext"
import Navbar from "./components/Navbar"

export const NAV_LOGO_LEFT = 15
export const NAV_LOGO_TOP = 10

function App() {
  const [lang, setLang] = useState("pt")
  const [activeCategory, setActiveCategory] = useState("tudo")
  const [activeColor, setActiveColor] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/catalogo") {
      setActiveCategory("tudo")
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
          activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          activeColor={activeColor} setActiveColor={setActiveColor}
        />
        <Outlet context={{ lang, activeCategory, activeColor }} />
      </TransitionProvider>
    </HelmetProvider>
  )
}

export default App
