import { useEffect, useRef } from "react"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"

import imgVeias from "../assets/img/collections/veias_thumbnail.webp"
import imgFolhas from "../assets/img/collections/folhas_thumbnail.webp"
import imgMargaridas from "../assets/img/collections/margaridas_thumbnail.webp"
import imgChaves from "../assets/img/collections/chaves_thumbnail.webp"

const collections = [
  {
    src: imgVeias,
    title: "Veias",
    description: "Inspirada nas nervuras das folhas e nos traços que percorrem a natureza, esta coleção explora linhas que se ramificam com delicadeza.",
  },
  {
    src: imgFolhas,
    title: "Folhas",
    description: "Formas orgânicas colhidas do mundo vegetal, traduzidas em peças que celebram a simplicidade da natureza.",
  },
  {
    src: imgMargaridas,
    title: "Margaridas",
    description: "A alegria e a leveza das flores silvestres ganham forma numa coleção luminosa e cheia de movimento.",
    objectPosition: "center 100%",
  },
  {
    src: imgChaves,
    title: "Chaves",
    description: "Geometrias que abrem portas — uma coleção que brinca com símbolos de acesso, mistério e descoberta.",
  },
]

export default function Colecoes() {
  const gridRef = useRef(null)

  useEffect(() => {
    const groups = gridRef.current.querySelectorAll(".collection-group")
    gsap.fromTo(
      groups,
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
      }
    )
  }, [])

  return (
    <>
      <Helmet>
        <title>Coleções — Conceição</title>
        <meta name="description" content="Coleções de Conceição — peças artesanais inspiradas pela natureza." />
        <meta property="og:title" content="Coleções — Conceição" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-grid page-grid--colecoes" ref={gridRef}>
        {collections.map(({ src, title, description, objectPosition }) => (
          <div key={title} className="collection-group">
            <div className="collection-group__image-wrap">
              <img src={src} alt={title} style={objectPosition ? { objectPosition } : undefined} />
            </div>
            <div className="collection-group__text">
              <h2 className="collection-group__title">{title}</h2>
              <p className="collection-group__desc" lang="pt">{description}</p>
              <span className="image-caption__cta collection-group__cta">Ver coleção</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
