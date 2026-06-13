import { useRef, useState, useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"
import gsap from "gsap"
import logo from "../assets/logo_cf.svg"
import { useTransition } from "../context/TransitionContext"
import { COLORS } from "../data/colors"

function GridIcon({ cols }) {
  const totalWidth = 16
  const height = 13
  const gap = 2
  const rectWidth = (totalWidth - gap * (cols - 1)) / cols

  return (
    <svg width={totalWidth} height={height} viewBox={`0 0 ${totalWidth} ${height}`} fill="currentColor">
      {Array.from({ length: cols }).map((_, i) => (
        <rect
          key={i}
          x={i * (rectWidth + gap)}
          y={0}
          width={rectWidth}
          height={height}
          rx="0.5"
        />
      ))}
    </svg>
  )
}

function Navbar({ lang, setLang, activeCategory, setActiveCategory, activeColor, setActiveColor, gridView, changeView }) {
  const { transitionTo } = useTransition()
  const location = useLocation()
  const [filterOpen, setFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768
  )

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const viewOptions = isMobile ? [1, 2, 3] : [2, 3, 4]
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
            FILTROS
          </button>

          {filterOpen && (
            <div className="filter-dropdown" ref={dropdownRef}>
              <div className="filter-categories">
                {["tudo", "malas", "sapatos", "acessórios"].map(cat => (
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

      <div className="nav-right">
        {location.pathname === "/catalogo" && (
          <div className="nav-view-controls">
            {viewOptions.map(n => (
              <button
                key={n}
                className={`nav-view-btn${gridView === n ? " active" : ""}`}
                onClick={() => changeView(n)}
                title={`${n} columns`}
              >
                <GridIcon cols={n} />
              </button>
            ))}
          </div>
        )}

        <ul className="nav-links">
          <li>
            <a href="/catalogo" onClick={(e) => { e.preventDefault(); handleNavigate("/catalogo") }}>
              CATÁLOGO
            </a>
          </li>
          <li>
            <a href="/colecoes" onClick={(e) => { e.preventDefault(); handleNavigate("/colecoes") }}>
              COLEÇÕES
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
      </div>
    </nav>
  )
}

export default Navbar
