import { useEffect, useRef } from "react"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import VerColecaoButton from "../components/VerColecaoButton"
import { useLang } from "../context/LangContext"

gsap.registerPlugin(ScrollTrigger)

import imgNervuras from "../assets/img/collections/nervuras_thumbnail.webp"
import imgFolhas from "../assets/img/collections/folhas_thumbnail.webp"
import imgPrimaveras from "../assets/img/collections/primaveras_thumbnail.webp"
import imgChavetas from "../assets/img/collections/chavetas_thumbnail.webp"
import imgPregas from "../assets/img/collections/pregas_thumbnail.webp"
import imgPastas from "../assets/img/collections/pastas_thumbnail.webp"

// `id` is the stable React key and the translation-key stem, so switching
// language re-renders the text without remounting the elements.
const collections = [
  { id: "nervuras", src: imgNervuras },
  { id: "folhas", src: imgFolhas },
  { id: "primaveras", src: imgPrimaveras, objectPosition: "center 100%" },
  { id: "chavetas", src: imgChavetas },
  { id: "pregas", src: imgPregas },
  { id: "pastas", src: imgPastas },
]

export default function Colecoes() {
  const { lang, t } = useLang()
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
      start: "top 95%",
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
        <html lang={lang} />
        <title>{t("colecoes.meta.title")}</title>
        <meta name="description" content={t("colecoes.meta.desc")} />
        <meta property="og:title" content={t("colecoes.meta.title")} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-grid page-grid--colecoes" ref={gridRef}>
        {collections.map(({ id, src, objectPosition }) => (
          <div key={id} className="collection-group">
            <div className="collection-group__image-wrap">
              <img
                src={src}
                alt={t(`colecoes.${id}.title`)}
                style={objectPosition ? { objectPosition } : undefined}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="collection-group__text">
              <h2 className="collection-group__title">{t(`colecoes.${id}.title`)}</h2>
              <p className="collection-group__desc" lang={lang}>{t(`colecoes.${id}.desc`)}</p>
              <VerColecaoButton className="collection-group__cta" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
