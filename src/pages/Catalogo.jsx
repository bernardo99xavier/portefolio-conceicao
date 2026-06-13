import { useEffect, useLayoutEffect, useRef, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { useTransition } from "../context/TransitionContext"
import { catalogue } from "../data/catalogue"

gsap.registerPlugin(Flip)

export default function Catalogo() {
  const { activeCategory, activeColor, gridView, flipCaptureRef } = useOutletContext()
  const { transitionTo } = useTransition()
  const gridRef = useRef(null)
  const flipStateRef = useRef(null)

  useEffect(() => {
    catalogue.forEach(item => {
      item.photos.forEach(src => {
        if (src) {
          const img = new Image()
          img.src = src
        }
      })
    })
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useLayoutEffect(() => {
    if (!gridRef.current) return
    const items = gridRef.current.querySelectorAll(".catalog-item")
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.04,
      })
    }, gridRef)
    return () => ctx.revert()
  }, [activeCategory, activeColor])

  useEffect(() => {
    flipCaptureRef.current = () => {
      if (gridRef.current) {
        flipStateRef.current = Flip.getState(gridRef.current.querySelectorAll(".catalog-item"))
      }
    }
    return () => { flipCaptureRef.current = null }
  }, [flipCaptureRef])

  useLayoutEffect(() => {
    if (!flipStateRef.current) return
    Flip.from(flipStateRef.current, {
      duration: 0.55,
      ease: "power2.inOut",
      absolute: true,
      stagger: 0.02,
    })
    flipStateRef.current = null
  }, [gridView])

  const shuffled = useMemo(() => [...catalogue].sort(() => Math.random() - 0.5), [])

  const categoryPrefix = { malas: "M", sapatos: "S", "acessórios": "A" }

  const filtered = shuffled.filter(item => {
    const prefix = categoryPrefix[activeCategory]
    if (prefix && !item.code.startsWith(prefix)) return false
    if (activeColor && item.color !== activeColor) return false
    return true
  })

  return (
    <>
      <Helmet>
        <title>Catálogo — Conceição</title>
        <meta name="description" content="Explorar o catálogo de Conceição — malas, colares e acessórios artesanais." />
        <meta property="og:title" content="Catálogo — Conceição" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`page-grid catalog-grid--${gridView}`} ref={gridRef}>
        {filtered.map(item => (
          <div
            key={item.id}
            className="catalog-item"
            onClick={() => transitionTo(`/catalogo/${item.id}`)}
          >
            <img className="main-img" src={item.photos[0]} alt={item.id} />
            {item.photos[1] && (
              <img className="hover-img" src={item.photos[1]} alt={item.id} />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
