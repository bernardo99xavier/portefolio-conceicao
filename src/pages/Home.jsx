import { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { NAV_LOGO_LEFT, NAV_LOGO_TOP } from "../App"
import VerColecaoButton from "../components/VerColecaoButton"
import { useTransition } from "../context/TransitionContext"
import { useLang } from "../context/LangContext"
import { catalogue } from "../data/catalogue"

import heroVideo from "../assets/videos/hp_v002.webm"
import heroVideoMobile from "../assets/videos/hp_v002.mobile.webm"
import malasVideo from "../assets/videos/hp_v003.webm"
import malasVideo2 from "../assets/videos/hp_v004.webm"

// First frame of each video — shows instantly while the video loads, and is all
// the story sections fetch until scrolled into view (they use preload="none")
import heroPoster from "../assets/img/posters/hero.webp"
import story1Poster from "../assets/img/posters/story1.webp"
import story2Poster from "../assets/img/posters/story2.webp"

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
  const { lang, t } = useLang()
  const taglineRef = useRef(null)
  const heroVideoRef = useRef(null)

  // The hero shows only its poster at first; the video (1.7MB on phones, 5MB on
  // desktop) is fetched once the browser is idle, so it never competes with the
  // initial render. Phones get the lighter encode.
  const [heroSrc, setHeroSrc] = useState(null)

  useEffect(() => {
    const src = window.innerWidth < 768 ? heroVideoMobile : heroVideo
    const start = () => setHeroSrc(src)
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(start, { timeout: 2500 })
      return () => window.cancelIdleCallback?.(id)
    }
    const id = setTimeout(start, 700)
    return () => clearTimeout(id)
  }, [])

  // Kick off playback once the source has been attached
  useEffect(() => {
    if (heroSrc && heroVideoRef.current) {
      heroVideoRef.current.load()
      heroVideoRef.current.play().catch(() => {})
    }
  }, [heroSrc])

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
    .filter(item => item.code.startsWith("M") && item.thumbs[0])
    .map(item => ({ id: item.id, src: item.thumbs[0] }))
  const malaPool = [...malaItems, ...malaItems]
  const malaTrackRef = useRef(null)

  const moveMalas = (dir) => {
    const track = malaTrackRef.current
    if (!track || gsap.isTweening(track)) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const step = track.children[0].offsetWidth + gap
    const loop = step * malaItems.length
    // advance by however many photos are visible (3 on desktop, 1 on mobile)
    const visible = Math.max(1, Math.round(track.parentElement.offsetWidth / step))
    gsap.to(track, {
      x: `-=${dir * step * visible}`,
      duration: 1,
      ease: "power2.inOut",
      modifiers: {
        x: gsap.utils.unitize(gsap.utils.wrap(-loop, 0)),
      },
    })
  }

  // Scroll hint: a blinking arrow shown on load, gone for good after the first scroll
  const [showScrollHint, setShowScrollHint] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10) {
        setShowScrollHint(false)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
    { src: imgNervuras, title: t("colecoes.nervuras.title") },
    { src: imgFolhas, title: t("colecoes.folhas.title") },
    { src: imgPrimaveras, title: t("colecoes.primaveras.title") },
    { src: imgChavetas, title: t("colecoes.chavetas.title") },
    { src: imgPregas, title: t("colecoes.pregas.title") },
    { src: imgPastas, title: t("colecoes.pastas.title") },
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
        <html lang={lang} />
        <title>{t("home.meta.title")}</title>
        <meta name="description" content={t("home.meta.desc")} />
        <meta property="og:title" content={t("home.meta.title")} />
        <meta property="og:description" content={t("home.meta.desc")} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="hero-scene">
        <div className="hero-sticky">
          <video ref={heroVideoRef} className="hero-video" autoPlay muted loop playsInline poster={heroPoster}>
            {heroSrc && <source src={heroSrc} type="video/webm" />}
          </video>
          <p className="hero-tagline" ref={taglineRef}>{t("home.tagline")}</p>
        </div>
      </div>

      <div
        className={`scroll-hint${showScrollHint ? "" : " scroll-hint--hidden"}`}
        aria-hidden="true"
      >
        <svg className="scroll-hint__icon" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M7.5 10.5 L12 15 L16.5 10.5" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="page-grid page-grid--home">

        <div className="story-section">
          <div className="story-section__video-wrap">
            <video autoPlay muted loop playsInline preload="none" poster={story1Poster}>
              <source src={malasVideo} type="video/webm" />
            </video>
          </div>
          <div className="story-section__text">
            <p>{t("home.story1")}</p>
          </div>
        </div>

        <div className="mala-gallery">
          <button
            className="gallery-arrow gallery-arrow--left"
            onClick={() => moveMalas(-1)}
            aria-label={t("home.arrowPrevMalas")}
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
                <img src={item.src} alt={item.id} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>

          <button
            className="gallery-arrow gallery-arrow--right"
            onClick={() => moveMalas(1)}
            aria-label={t("home.arrowNextMalas")}
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
            <p>{t("home.story2")}</p>
          </div>
          <div className="story-section__video-wrap">
            <video autoPlay muted loop playsInline preload="none" poster={story2Poster}>
              <source src={malasVideo2} type="video/webm" />
            </video>
          </div>
        </div>

        <div className="collections-gallery">
          <button
            className="gallery-arrow gallery-arrow--left"
            onClick={() => moveGallery(-1)}
            aria-label={t("home.arrowPrevColecoes")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 2 L4 7 L9 12" />
            </svg>
          </button>

          <div className="collections-gallery__track" ref={galleryTrackRef}>
            {galleryPool.map(({ src, title }, i) => (
              <div key={`slot-${i}`} className="image-block image-block--collection">
                <img src={src} loading="lazy" decoding="async" />
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
            aria-label={t("home.arrowNextColecoes")}
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
