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
      <p>Pereira Rute (n.2000, Fradelos), atualmente, reside no Porto, onde desenvolve os seus estudos, trabalho artístico e prática pedagógica na Escola Utopia e na Faculdade de Belas Artes da Universidade do Porto (FBAUP). Em 2018 ingressou no curso de Artes Plásticas da FBAUP, especializando-se em pintura a óleo. Encontra-se, de momento, a concluir o mestrado na mesma área e instituição.</p>
      <p>Desde 2019 expõe regularmente, sobretudo no norte de Portugal. Destaca-se a participação na exposição inaugural "Minha Senhora de Mim" da Galeria Helena Rodrigues (2025, Porto), na Bienal Internacional de Arte de Espinho (2023) e na III Bienal da Ardósia de Valongo (2023, Residências Artísticas e Tecnológicas GroundLab). Foi distinguida com o 1º lugar no Prémio Joaquim Afonso Madeira (2024, XI Bienal de Pintura de Pequeno Formato, Moita) e no Prémio Árvore das Virtudes 2024 (Árvore - Cooperativa de Atividades Artísticas, Porto).</p>
      <p>A sua prática artística investiga a relação entre indivíduo e sociedade, refletindo sobre a condição humana a partir de uma perspetiva informada pelo absurdo existencial. Interessa-lhe as tensões entre presença e ausência, o momento de suspensão e de confronto com o inevitável — espaços onde a identidade vacila e a experiência humana revela a sua fragilidade. Através da pintura, da impressão e do desenho, constrói imagens que exploram essa relação entre consciência individual e realidade quotidiana, integrando já coleções privadas.</p>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Sobre — Conceição</title>
        <meta name="description" content="Sobre Conceição — prática artística visual." />
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
