import { useRef, useState, useEffect } from "react"
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

function Navbar({ lang, setLang, activeColor, setActiveColor, gridView, changeView }) {
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
  const mobileBarRef = useRef(null)
  const mobileSwatchesRef = useRef(null)

  const handleNavigate = (path) => {
    if (location.pathname === path) return
    transitionTo(path)
  }

  const openFilter = () => {
    setFilterOpen(true)
  }

  const closeFilter = () => {
    // Animate whichever filter UI is currently mounted (mobile bar or desktop dropdown)
    if (mobileSwatchesRef.current) {
      gsap.to(mobileSwatchesRef.current, {
        opacity: 0,
        x: 30,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setFilterOpen(false),
      })
    } else if (dropdownRef.current) {
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: -6,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => setFilterOpen(false),
      })
    } else {
      setFilterOpen(false)
    }
  }

  useEffect(() => {
    if (!filterOpen) return
    if (mobileSwatchesRef.current) {
      gsap.fromTo(
        mobileSwatchesRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      )
    } else if (dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
      )
    }
  }, [filterOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop = filterRef.current && filterRef.current.contains(e.target)
      const inMobile = mobileBarRef.current && mobileBarRef.current.contains(e.target)
      if (!inDesktop && !inMobile) {
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

  const isCatalog = location.pathname === "/catalogo"

  const swatches = COLORS.map(color => (
    <div
      key={color.id}
      className={`swatch swatch--${color.id}${isSwatchActive(color.id) ? " active" : ""}`}
      style={color.css ? { background: color.css } : undefined}
      onClick={() => handleColorClick(color.id)}
      title={color.id}
    />
  ))

  const viewControls = (
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
  )

  return (
    <>
      <nav>
        <h1 className="nav-logo" onClick={() => handleNavigate("/")}>
          <img src={logo} alt="Logo" />
        </h1>

        {isCatalog && !isMobile && (
          <div className="nav-filter-wrapper" ref={filterRef}>
            <button
              className="nav-filter-btn"
              onClick={() => filterOpen ? closeFilter() : openFilter()}
            >
              FILTROS
            </button>

            {filterOpen && (
              <div className="filter-dropdown" ref={dropdownRef}>
                <div className="filter-swatches">{swatches}</div>
              </div>
            )}
          </div>
        )}

        <div className="nav-right">
          {isCatalog && !isMobile && viewControls}

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

      {isCatalog && isMobile && (
        <div className="mobile-filter-bar" ref={mobileBarRef}>
          {viewControls}

          <div className="mobile-filter-swatches-wrap">
            <div
              className={`filter-swatches mobile-filter-swatches${filterOpen ? " is-open" : ""}`}
              ref={mobileSwatchesRef}
            >
              {swatches}
            </div>
          </div>

          <button
            className="nav-filter-btn"
            onClick={() => filterOpen ? closeFilter() : openFilter()}
          >
            FILTROS
          </button>
        </div>
      )}
    </>
  )
}

export default Navbar
