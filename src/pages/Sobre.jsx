import { Helmet } from "react-helmet-async"
import { useState, useEffect, useRef } from "react"
import { useLang } from "../context/LangContext"
// Picked up automatically, so adding/removing an about_*.webp never breaks the build
const photos = Object.entries(
  import.meta.glob("../assets/img/about/about_*.webp", { eager: true, import: "default" })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src)

export default function Sobre() {
  const { lang, t } = useLang()
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % photos.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isMobile])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        setCurrentIndex(i => (i + 1) % photos.length)
      } else {
        setCurrentIndex(i => (i - 1 + photos.length) % photos.length)
      }
    }
    touchStartX.current = null
  }

  const sobreText = (
    // --sobre-rows keeps the text's row span equal to the photo count, so the
    // grid gains no empty trailing row (which would leave a gap at the bottom)
    <div className="sobre-text" style={{ "--sobre-rows": photos.length }}>
      {t("sobre.paragraphs").map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  )

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t("sobre.meta.title")}</title>
        <meta name="description" content={t("sobre.meta.desc")} />
        <meta property="og:title" content={t("sobre.meta.title")} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-grid">
        {isMobile ? (
          <>
            <div
              className="sobre-gallery"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Conceição — foto ${i + 1}`}
                  className={i === currentIndex ? "active" : ""}
                />
              ))}
              <div className="sobre-gallery__dots">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={`sobre-gallery__dot${i === currentIndex ? " active" : ""}`}
                    onClick={() => setCurrentIndex(i)}
                  />
                ))}
              </div>
            </div>
            {sobreText}
          </>
        ) : (
          <>
            {photos.map((photo, i) => (
              <div key={i} className="item-photo">
                <img src={photo} alt={`Conceição — foto ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              </div>
            ))}
            {sobreText}
          </>
        )}
      </div>
    </>
  )
}
