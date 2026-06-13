import { useEffect, useRef } from "react"
import { useOutletContext } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { NAV_LOGO_LEFT, NAV_LOGO_TOP } from "../App"

import heroVideo from "../assets/videos/hp_v001.webm"
import img1 from "../assets/img/homepage/hp_p001.webp"
import img2 from "../assets/img/homepage/hp_p002.webp"
import img3 from "../assets/img/homepage/hp_p003.webp"
import img4 from "../assets/img/homepage/hp_p004.webp"
import img5 from "../assets/img/homepage/hp_p005.webp"
import img6 from "../assets/img/homepage/hp_p006.webp"
import img7 from "../assets/img/homepage/hp_p007.webp"
import img8 from "../assets/img/homepage/hp_p008.webp"

import Hero from "../sections/Hero"

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
  const { lang } = useOutletContext()
  const taglineRef = useRef(null)
  const malasRef = useRef(null)
  const collectionsRef = useRef(null)

  useScrollReveal(malasRef)
  useScrollReveal(collectionsRef)

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
        scale: () => (window.innerWidth * 0.4) / logo.offsetWidth,
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

    const tween = gsap.fromTo(
      navLinks,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-scene",
          start: "71% top",
          end: "77% top",
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

  const wideImages = [img5, img6, img7, img8]

  const collectionImages = [
    { src: img1, title: "Veias" },
    { src: img2, title: "Folhas" },
    { src: img3, title: "Margaridas" },
    { src: img4, title: "Chaves" },
  ]

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

        <p className="homepage-topic" ref={collectionsRef}>COLEÇÕES</p>

        {collectionImages.map(({ src, title }) => (
          <div key={title} className="image-block-wrap image-block-wrap--narrow">
            <div className="image-block image-block--collection">
              <img src={src} />
              <div className="image-caption">
                <div className="image-caption__text">
                  <span className="image-caption__title">{title}</span>
                  <span className="image-caption__cta">Ver coleção</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {collectionImages.map(({ src, title }) => (
          <div key={`repeat-${title}`} className="image-block-wrap image-block-wrap--narrow">
            <div className="image-block image-block--collection">
              <img src={src} />
              <div className="image-caption">
                <div className="image-caption__text">
                  <span className="image-caption__title">{title}</span>
                  <span className="image-caption__cta">Ver coleção</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Hero lang={lang} />
      </div>
    </>
  )
}
