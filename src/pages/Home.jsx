import { useEffect, useRef, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { NAV_LOGO_LEFT, NAV_LOGO_TOP } from "../App"
import VerColecaoButton from "../components/VerColecaoButton"
import { catalogue } from "../data/catalogue"

import heroVideo from "../assets/videos/hp_v001.webm"

import imgNervuras from "../assets/img/collections/nervuras_thumbnail.webp"
import imgFolhas from "../assets/img/collections/folhas_thumbnail.webp"
import imgPrimaveras from "../assets/img/collections/primaveras_thumbnail.webp"
import imgChavetas from "../assets/img/collections/chavetas_thumbnail.webp"
import imgPregas from "../assets/img/collections/pregas_thumbnail.webp"
import imgPastas from "../assets/img/collections/pastas_thumbnail.webp"


gsap.registerPlugin(ScrollTrigger)

function useScrollReveal(ref) {
  useEffect(() => {
    const el = ref.current
    gsap.set(el, { y: 80, opacity: 0 })
    const tween = gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 110%",
        toggleActions: "play none none reset",
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])
}

export default function Home() {
  const taglineRef = useRef(null)
  const malasRef = useRef(null)

  useScrollReveal(malasRef)

  useEffect(() => {
    const captions = gsap.utils.toArray(".image-caption__text")
    const tweens = captions.map(caption => {
      gsap.set(caption, { y: 80, opacity: 0 })
      return gsap.to(caption, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: caption.closest(".image-block--collection"),
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      })
    })
    return () => {
      tweens.forEach(t => { t.scrollTrigger?.kill(); t.kill() })
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Blur reveal do logo no load inicial
  useEffect(() => {
    const logoImg = document.querySelector(".nav-logo img")
    gsap.set(logoImg, { opacity: 0, filter: "blur(16px)" })
    const tween = gsap.to(logoImg, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.4,
      ease: "power3.out",
      delay: 0.15,
    })
    return () => {
      tween.kill()
      gsap.set(logoImg, { clearProps: "opacity,filter" })
    }
  }, [])

  // Logo: posição (branco, 0→22%) + cor (branco→preto quando vídeo quase sai, 85→94%)
  useEffect(() => {
    const logo = document.querySelector(".nav-logo")

    // Posição + escala: sem tocar na cor
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-scene",
        start: "top top",
        end: "22% top",
        scrub: 1.2,
        invalidateOnRefresh: true,
        onLeave: () => { logo.classList.add("is-active") },
        onEnterBack: () => { logo.classList.remove("is-active") },
      },
    })

    tl.fromTo(logo,
      {
        xPercent: -50, yPercent: -50,
        x: 0, y: 0,
        scale: () => (window.innerWidth * (window.innerWidth < 768 ? 0.7 : 0.4)) / logo.offsetWidth,
      },
      {
        xPercent: 0, yPercent: 0,
        x: () => NAV_LOGO_LEFT - window.innerWidth / 2,
        y: () => NAV_LOGO_TOP - window.innerHeight / 2,
        scale: 1,
        ease: "none",
      }
    )

    // Cor: só muda quando o vídeo está quase fora do ecrã (85%→94% de 350vh ≈ 297→329vh)
    const filterTween = gsap.fromTo(logo,
      { filter: "brightness(0) invert(1)" },
      {
        filter: "brightness(1) invert(0)",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-scene",
          start: "85% top",
          end: "94% top",
          scrub: 1,
        },
      }
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      filterTween.scrollTrigger?.kill()
      filterTween.kill()
    }
  }, [])

  // Nav links: só aparecem quando o frame bege fica visível em cima (S≈250vh = 71% de 350vh)
  useEffect(() => {
    const navLinks = document.querySelector(".nav-links")

    // On mobile the beige page shows up later in the scroll, so reveal later
    const isMobile = window.innerWidth < 768
    const start = isMobile ? "95% top" : "71% top"
    const end = isMobile ? "101% top" : "77% top"

    const tween = gsap.fromTo(
      navLinks,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-scene",
          start,
          end,
          scrub: 1,
        },
      }
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(navLinks, { opacity: 1, y: 0 })
    }
  }, [])

  // Tagline: aparece mais cedo, ainda a overlap com o logo (S≈42vh → S≈98vh = 12% → 28% de 350vh)
  useEffect(() => {
    const el = taglineRef.current

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-scene",
          start: "12% top",
          end: "28% top",
          scrub: 1.2,
        },
      }
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  // 4 random catalogue thumbnails, each a different colour, re-picked per load
  const wideImages = useMemo(() => {
    const byColor = {}
    for (const item of catalogue) {
      if (!item.photos[0]) continue
      ;(byColor[item.color] ||= []).push(item)
    }
    const colors = Object.keys(byColor)
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[colors[i], colors[j]] = [colors[j], colors[i]]
    }
    return colors.slice(0, 4).map(c => {
      const items = byColor[c]
      return items[Math.floor(Math.random() * items.length)].photos[0]
    })
  }, [])

  const collectionImages = [
    { src: imgNervuras, title: "Nervuras" },
    { src: imgFolhas, title: "Folhas" },
    { src: imgPrimaveras, title: "Primaveras" },
    { src: imgChavetas, title: "Chavetas" },
    { src: imgPregas, title: "Pregas" },
    { src: imgPastas, title: "Pastas" },
  ]

  // Gallery — duplicated pool so the strip can slide and loop seamlessly
  const galleryPool = [...collectionImages, ...collectionImages]
  const galleryTrackRef = useRef(null)

  const moveGallery = (dir) => {
    const track = galleryTrackRef.current
    if (!track || gsap.isTweening(track)) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const step = track.children[0].offsetWidth + gap
    const loop = step * collectionImages.length
    gsap.to(track, {
      x: `-=${dir * step}`,
      duration: 0.5,
      ease: "power3.inOut",
      modifiers: {
        x: gsap.utils.unitize(gsap.utils.wrap(-loop, 0)),
      },
    })
  }

  // keep the strip aligned to the grid after a resize
  useEffect(() => {
    const onResize = () => {
      if (galleryTrackRef.current) gsap.set(galleryTrackRef.current, { x: 0 })
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <>
      <Helmet>
        <title>Conceição</title>
        <meta name="description" content="Prática artística visual de Conceição." />
        <meta property="og:title" content="Conceição" />
        <meta property="og:description" content="Prática artística visual de Conceição." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="hero-scene">
        <div className="hero-sticky">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src={heroVideo} type="video/webm" />
          </video>
          <p className="hero-tagline" ref={taglineRef}>Peças inspiradas pela natureza</p>
        </div>
      </div>

      <div className="page-grid page-grid--home">

        <p className="homepage-topic" ref={malasRef}>MALAS</p>

        {wideImages.map((src, i) => (
          <div key={i} className="image-block image-block--wide">
            <img src={src} />
          </div>
        ))}

        <div className="collections-gallery">
          <button
            className="gallery-arrow gallery-arrow--left"
            onClick={() => moveGallery(-1)}
            aria-label="Ver coleções anteriores"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 2 L4 7 L9 12" />
            </svg>
          </button>

          <div className="collections-gallery__track" ref={galleryTrackRef}>
            {galleryPool.map(({ src, title }, i) => (
              <div key={`slot-${i}`} className="image-block image-block--collection">
                <img src={src} />
                <div className="image-caption">
                  <div className="image-caption__text">
                    <span className="image-caption__title">{title}</span>
                    <VerColecaoButton />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="gallery-arrow gallery-arrow--right"
            onClick={() => moveGallery(1)}
            aria-label="Ver coleções seguintes"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 2 L10 7 L5 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
