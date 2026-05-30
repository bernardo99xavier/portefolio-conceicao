import { useRef, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import gsap from "gsap"
import logo from "../assets/logo_cf.svg"
import { useTransition } from "../context/TransitionContext"
import { COLORS } from "../data/colors"

function Navbar({ lang, setLang, activeCategory, setActiveCategory, activeColor, setActiveColor }) {
  const { transitionTo } = useTransition()
  const location = useLocation()
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)
  const dropdownRef = useRef(null)

  const handleNavigate = (path) => {
    if (location.pathname === path) return
    transitionTo(path)
  }

  const openFilter = () => {
    setFilterOpen(true)
  }

  const closeFilter = () => {
    if (!dropdownRef.current) return
    gsap.to(dropdownRef.current, {
      opacity: 0,
      y: -6,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => setFilterOpen(false),
    })
  }

  useEffect(() => {
    if (filterOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
      )
    }
  }, [filterOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        closeFilter()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleColorClick = (colorId) => {
    if (colorId === "multi") {
      setActiveColor(null)
    } else {
      setActiveColor(activeColor === colorId ? null : colorId)
    }
  }

  const isSwatchActive = (colorId) =>
    colorId === "multi" ? activeColor === null : activeColor === colorId

  return (
    <nav>
      <h1 className="nav-logo" onClick={() => handleNavigate("/")}>
        <img src={logo} alt="Logo" />
      </h1>

      {location.pathname === "/catalogo" && (
        <div className="nav-filter-wrapper" ref={filterRef}>
          <button
            className="nav-filter-btn"
            onClick={() => filterOpen ? closeFilter() : openFilter()}
          >
            FILTRAR
          </button>

          {filterOpen && (
            <div className="filter-dropdown" ref={dropdownRef}>
              <div className="filter-categories">
                {["malas", "colares", "tudo"].map(cat => (
                  <span
                    key={cat}
                    className={`filter-cat${activeCategory === cat ? " active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="filter-swatches">
                {COLORS.map(color => (
                  <div
                    key={color.id}
                    className={`swatch swatch--${color.id}${isSwatchActive(color.id) ? " active" : ""}`}
                    style={color.css ? { background: color.css } : undefined}
                    onClick={() => handleColorClick(color.id)}
                    title={color.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ul className="nav-links">
        <li>
          <a href="/catalogo" onClick={(e) => { e.preventDefault(); handleNavigate("/catalogo") }}>
            CATÁLOGO
          </a>
        </li>
        <li>
          <a href="/sobre" onClick={(e) => { e.preventDefault(); handleNavigate("/sobre") }}>
            SOBRE
          </a>
        </li>
        <li className="lang-switch">
          <span onClick={() => setLang("en")}>EN</span>
          <span> | </span>
          <span onClick={() => setLang("pt")}>PT</span>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
