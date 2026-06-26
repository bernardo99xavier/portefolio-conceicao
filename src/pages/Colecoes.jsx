import { useEffect, useRef } from "react"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import VerColecaoButton from "../components/VerColecaoButton"

gsap.registerPlugin(ScrollTrigger)

import imgNervuras from "../assets/img/collections/nervuras_thumbnail.webp"
import imgFolhas from "../assets/img/collections/folhas_thumbnail.webp"
import imgPrimaveras from "../assets/img/collections/primaveras_thumbnail.webp"
import imgChavetas from "../assets/img/collections/chavetas_thumbnail.webp"
import imgPregas from "../assets/img/collections/pregas_thumbnail.webp"
import imgPastas from "../assets/img/collections/pastas_thumbnail.webp"

const collections = [
  {
    src: imgNervuras,
    title: "Nervuras",
    description: "Inspirada nas nervuras das folhas, explora linhas que se ramificam com delicadeza pela natureza.",
  },
  {
    src: imgFolhas,
    title: "Folhas",
    description: "Formas orgânicas colhidas do mundo vegetal, traduzidas em peças que celebram a simplicidade da natureza.",
  },
  {
    src: imgPrimaveras,
    title: "Primaveras",
    description: "A alegria e a leveza das flores silvestres ganham forma numa coleção luminosa e cheia de movimento.",
    objectPosition: "center 100%",
  },
  {
    src: imgChavetas,
    title: "Chavetas",
    description: "Geometrias que abrem portas — uma coleção que brinca com símbolos de acesso, mistério e descoberta.",
  },
  {
    src: imgPregas,
    title: "Pregas",
    description: "Em dobras sucessivas, o tecido encontra a sua forma — vincos onde a luz desliza e repousa em silêncio.",
  },
  {
    src: imgPastas,
    title: "Pastas",
    description: "De ângulos firmes e linhas assumidas, guardam o porte sóbrio do ofício — uma geometria que se carrega.",
  },
]

export default function Colecoes() {
  const gridRef = useRef(null)

  useEffect(() => {
    const groups = gsap.utils.toArray(
      gridRef.current.querySelectorAll(".collection-group")
    )

    // Respect users who prefer reduced motion — show everything, no animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(groups, { x: 0, opacity: 1 })
      return
    }

    gsap.set(groups, { x: -60, opacity: 0 })

    // Reveal (staggered per row) when a group scrolls into view
    const revealTriggers = ScrollTrigger.batch(groups, {
      start: "top 88%",
      onEnter: batch =>
        gsap.to(batch, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          overwrite: true,
        }),
    })

    // Re-arm only once the group is fully below the viewport, so the
    // reset is never visible and it replays next time you scroll down
    const resetTriggers = groups.map(group =>
      ScrollTrigger.create({
        trigger: group,
        start: "top bottom",
        onLeaveBack: () =>
          gsap.set(group, { x: -60, opacity: 0, overwrite: true }),
      })
    )

    return () => {
      revealTriggers.forEach(t => t.kill())
      resetTriggers.forEach(t => t.kill())
    }
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
              <VerColecaoButton className="collection-group__cta" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
