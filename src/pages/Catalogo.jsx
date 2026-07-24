import { useEffect, useLayoutEffect, useRef, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { useTransition } from "../context/TransitionContext"
import { useLang } from "../context/LangContext"
import { catalogue } from "../data/catalogue"

gsap.registerPlugin(Flip)

export default function Catalogo() {
  const { activeColor, gridView, flipCaptureRef } = useOutletContext()
  const { transitionTo } = useTransition()
  const { lang, t } = useLang()
  const gridRef = useRef(null)
  const flipStateRef = useRef(null)

  // The grid only shows each item's first two photos; the rest belong to the
  // item page. Warm those on hover/touch so opening a piece still feels
  // instant, without the catalogue downloading the whole catalogue up front.
  const prefetched = useRef(new Set())

  const prefetchItem = (item) => {
    if (prefetched.current.has(item.id)) return
    prefetched.current.add(item.id)
    item.photos.slice(2).forEach(src => {
      if (src) {
        const img = new Image()
        img.src = src
      }
    })
  }

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
  }, [activeColor])

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

  const filtered = shuffled.filter(item => {
    if (activeColor && item.color !== activeColor) return false
    return true
  })

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t("catalogo.meta.title")}</title>
        <meta name="description" content={t("catalogo.meta.desc")} />
        <meta property="og:title" content={t("catalogo.meta.title")} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`page-grid catalog-grid--${gridView}`} ref={gridRef}>
        {filtered.map(item => (
          <div
            key={item.id}
            className="catalog-item"
            onClick={() => transitionTo(`/catalogo/${item.id}`)}
            onPointerEnter={() => prefetchItem(item)}
          >
            <img
              className="main-img"
              src={item.thumbs[0]}
              alt={item.id}
              loading="lazy"
              decoding="async"
            />
            {item.thumbs[1] && (
              <img
                className="hover-img"
                src={item.thumbs[1]}
                alt={item.id}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        ))}

        <div className="catalog-more">{t("catalogo.maisEmBreve")}</div>
      </div>
    </>
  )
}
