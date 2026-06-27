import { Helmet } from "react-helmet-async"
import { useState, useEffect, useRef } from "react"
import about1 from "../assets/img/about/about_1.webp"
import about2 from "../assets/img/about/about_2.webp"
import about3 from "../assets/img/about/about_3.webp"
import about4 from "../assets/img/about/about_4.webp"

const photos = [about1, about2, about3, about4]

export default function Sobre() {
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
    <div className="sobre-text">
      <p>Conceição Fernandes é artesã do couro como quem cultiva raízes: com paciência, com as mãos e com o tempo. Cresceu numa família ligada à indústria pesqueira, mas desde cedo soube que o seu caminho seria outro. Aos 15 anos já cosia as roupas e as malas que levava para a escola. O talento estava presente; só precisava de espaço para crescer.</p>
      <p>Hoje, cada peça que cria é única e intemporal. Inspirada pela natureza e pelo ritmo profundo do universo, trabalha exclusivamente com couro reutilizado, dando uma nova vida a peles descontinuadas da indústria do calçado que, de outra forma, seriam desperdiçadas. Este processo reflete os princípios da economia circular, mas representa também um gesto de beleza, mostrando que aquilo que parece perdido pode voltar a florescer.</p>
      <p>Há quase 30 anos que leva este trabalho às feiras medievais, onde as suas peças encontram quem as reconhece pelo que verdadeiramente são: feitas à mão, feitas para durar e feitas com alma.</p>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Sobre — Conceição</title>
        <meta name="description" content="Sobre Conceição Fernandes — artesã do couro, com peças únicas em couro reutilizado." />
        <meta property="og:title" content="Sobre — Conceição" />
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
                <img src={photo} alt={`Conceição — foto ${i + 1}`} />
              </div>
            ))}
            {sobreText}
          </>
        )}
      </div>
    </>
  )
}
