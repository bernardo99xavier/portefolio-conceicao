import { useEffect } from "react"
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

import Hero from "../sections/Hero"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const { lang } = useOutletContext()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const logo = document.querySelector(".nav-logo")

    const tween = gsap.fromTo(
      logo,
      {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        scale: () => (window.innerWidth * 0.4) / logo.offsetWidth,
        filter: "brightness(0) invert(1)",
      },
      {
        xPercent: 0,
        yPercent: 0,
        x: () => NAV_LOGO_LEFT - window.innerWidth / 2,
        y: () => NAV_LOGO_TOP - window.innerHeight / 2,
        scale: 1,
        filter: "brightness(1) invert(0)",
        ease: "none",

        scrollTrigger: {
          trigger: ".page-grid",
          start: "top bottom",
          end: "top top",
          scrub: 1.2,
          invalidateOnRefresh: true,

          onLeave: () => { logo.classList.add("is-active") },
          onEnterBack: () => { logo.classList.remove("is-active") },
        },
      }
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

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
          trigger: ".hero-video",
          start: "top top",
          end: "50% top",
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

  return (
    <>
      <Helmet>
        <title>Conceição</title>
        <meta name="description" content="Prática artística visual de Conceição." />
        <meta property="og:title" content="Conceição" />
        <meta property="og:description" content="Prática artística visual de Conceição." />
        <meta property="og:type" content="website" />
      </Helmet>

      <video className="hero-video" autoPlay muted loop playsInline>
        <source src={heroVideo} type="video/webm" />
      </video>

      <div className="page-grid">
        <div className="image-block"><img src={img1} /></div>
        <div className="image-block"><img src={img2} /></div>
        <div className="image-block"><img src={img3} /></div>
        <div className="image-block"><img src={img4} /></div>
        <div className="image-block"><img src={img4} /></div>
        <div className="image-block"><img src={img3} /></div>
        <div className="image-block"><img src={img2} /></div>
        <div className="image-block"><img src={img1} /></div>
        <div className="image-block"><img src={img1} /></div>
        <div className="image-block"><img src={img2} /></div>
        <div className="image-block"><img src={img3} /></div>
        <div className="image-block"><img src={img4} /></div>

        <Hero lang={lang} />
      </div>
    </>
  )
}
