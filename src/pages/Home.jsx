import { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { NAV_LOGO_LEFT, NAV_LOGO_TOP } from "../App"
import VerColecaoButton from "../components/VerColecaoButton"
import { useTransition } from "../context/TransitionContext"
import { catalogue } from "../data/catalogue"

import heroVideo from "../assets/videos/hp_v002.webm"
import malasVideo from "../assets/videos/hp_v003.webm"
import malasVideo2 from "../assets/videos/hp_v004.webm"

import imgNervuras from "../assets/img/collections/nervuras_thumbnail.webp"
import imgFolhas from "../assets/img/collections/folhas_thumbnail.webp"
import imgPrimaveras from "../assets/img/collections/primaveras_thumbnail.webp"
import imgChavetas from "../assets/img/collections/chavetas_thumbnail.webp"
import imgPregas from "../assets/img/collections/pregas_thumbnail.webp"
import imgPastas from "../assets/img/collections/pastas_thumbnail.webp"

// Ornament photos (hp_o*) for the swapping slideshow
const ornamentImages = Object.values(
  import.meta.glob("../assets/img/homepage/hp_o*.webp", { eager: true, import: "default" })
)


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
  const { transitionTo } = useTransition()
  const taglineRef = useRef(null)

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

    const isMobile = window.innerWidth < 768

    tl.fromTo(logo,
      {
        xPercent: -50, yPercent: -50,
        x: () => window.innerWidth / 2 + (isMobile ? 12 : 0),
        y: () => window.innerHeight / 2,
        scale: () => (window.innerWidth * (window.innerWidth < 768 ? 0.7 : 0.4)) / logo.offsetWidth,
      },
      {
        // fixed-pixel top-left target — no innerHeight dependency, so the
        // docked logo doesn't drift when the mobile address bar toggles
        xPercent: 0, yPercent: 0,
        x: NAV_LOGO_LEFT,
        y: NAV_LOGO_TOP,
        scale: 1,
        ease: "none",
      }
    )

    // Cor: só muda quando o vídeo está quase fora do ecrã
    // (mobile turns a bit later so it doesn't happen too soon)
    const filterTween = gsap.fromTo(logo,
      { filter: "brightness(0) invert(1)" },
      {
        filter: "brightness(1) invert(0)",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-scene",
          start: isMobile ? "90% top" : "85% top",
          end: isMobile ? "98% top" : "94% top",
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

  // Nav links: appear as soon as the logo reaches its final top-left spot,
  // staying white until it turns black — same timing as the logo, on any device
  useEffect(() => {
    const navLinks = document.querySelector(".nav-links")
    const isMobile = window.innerWidth < 768

    gsap.set(navLinks, { color: "white" })

    const tween = gsap.fromTo(
      navLinks,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-scene",
          start: "top top",
          end: "22% top",
          scrub: 1,
        },
      }
    )

    // Text turns black at the same point the logo does
    const colorTween = gsap.fromTo(
      navLinks,
      { color: "white" },
      {
        color: "black",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-scene",
          start: isMobile ? "90% top" : "85% top",
          end: isMobile ? "98% top" : "94% top",
          scrub: 1,
        },
      }
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      colorTween?.scrollTrigger?.kill()
      colorTween?.kill()
      gsap.set(navLinks, { opacity: 1, y: 0, clearProps: "color" })
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

  // Mala strip: first photo (+ id) of every bag from the catalogue
  const malaItems = catalogue
    .filter(item => item.code.startsWith("M") && item.photos[0])
    .map(item => ({ id: item.id, src: item.photos[0] }))
  const malaPool = [...malaItems, ...malaItems]
  const malaTrackRef = useRef(null)

  const moveMalas = (dir) => {
    const track = malaTrackRef.current
    if (!track || gsap.isTweening(track)) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const step = track.children[0].offsetWidth + gap
    const loop = step * malaItems.length
    gsap.to(track, {
      x: `-=${dir * step * 3}`,
      duration: 1,
      ease: "power2.inOut",
      modifiers: {
        x: gsap.utils.unitize(gsap.utils.wrap(-loop, 0)),
      },
    })
  }

  // Ornaments: two slots that swap to new hp_o photos every second (instant, no animation)
  const [ornamentIndex, setOrnamentIndex] = useState(0)

  useEffect(() => {
    ornamentImages.forEach(src => { const im = new Image(); im.src = src }) // preload for instant swap
    const id = setInterval(() => {
      setOrnamentIndex(i => (i + 2) % ornamentImages.length)
    }, 1000)
    return () => clearInterval(id)
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

  // keep the strips aligned to the grid after a resize
  useEffect(() => {
    const onResize = () => {
      if (galleryTrackRef.current) gsap.set(galleryTrackRef.current, { x: 0 })
      if (malaTrackRef.current) gsap.set(malaTrackRef.current, { x: 0 })
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

        <div className="story-section">
          <div className="story-section__video-wrap">
            <video autoPlay muted loop playsInline>
              <source src={malasVideo} type="video/webm" />
            </video>
          </div>
          <div className="story-section__text">
            <p>Conceição Fernandes cresceu numa família ligada à indústria pesqueira, mas desde cedo soube que o seu caminho seria outro. Aos 15 anos já cosia as roupas e as malas que levava para a escola e, desde então, dá continuidade a essa aptidão criando peças únicas e intemporais.</p>
          </div>
        </div>

        <div className="mala-gallery">
          <button
            className="gallery-arrow gallery-arrow--left"
            onClick={() => moveMalas(-1)}
            aria-label="Ver malas anteriores"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 2 L4 7 L9 12" />
            </svg>
          </button>

          <div className="mala-gallery__track" ref={malaTrackRef}>
            {malaPool.map((item, i) => (
              <div
                key={i}
                className="mala-gallery__item"
                onClick={() => transitionTo(`/catalogo/${item.id}`)}
              >
                <img src={item.src} alt={item.id} />
              </div>
            ))}
          </div>

          <button
            className="gallery-arrow gallery-arrow--right"
            onClick={() => moveMalas(1)}
            aria-label="Ver mais malas"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 2 L10 7 L5 12" />
            </svg>
          </button>
        </div>

        <div className="image-block image-block--wide">
          <img src={ornamentImages[ornamentIndex % ornamentImages.length]} alt="" />
        </div>

        <div className="image-block image-block--wide">
          <img src={ornamentImages[(ornamentIndex + 1) % ornamentImages.length]} alt="" />
        </div>

        <div className="story-section story-section--reverse">
          <div className="story-section__text">
            <p>Inspirada pela natureza e pelo ritmo profundo do universo, trabalha exclusivamente com couro reutilizado, dando uma nova vida a peles descontinuadas da indústria do calçado que, de outra forma, seriam desperdiçadas.</p>
          </div>
          <div className="story-section__video-wrap">
            <video autoPlay muted loop playsInline>
              <source src={malasVideo2} type="video/webm" />
            </video>
          </div>
        </div>

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
