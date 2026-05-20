import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import Hero from "./sections/Hero"

import heroVideo from "./assets/videos/hp_v001.webm"
import logo from "./assets/logo_cf.svg"

/* IMAGES */
import img1 from "./assets/img/homepage/hp_p001.jpg"
import img2 from "./assets/img/homepage/hp_p002.jpg"
import img3 from "./assets/img/homepage/hp_p003.jpg"
import img4 from "./assets/img/homepage/hp_p004.jpg"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function GridOverlay({ visible }) {
  if (!visible) return null

  return (
    <div className="grid-overlay">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}></div>
      ))}
    </div>
  )
}

function App() {
  const [showGrid, setShowGrid] = useState(false)
  const [lang, setLang] = useState("pt")

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key.toLowerCase() === "g") {
        setShowGrid(prev => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

useEffect(() => {
  gsap.to(".nav-logo", {
    x: -90,
    y: -35,
    scale: 0.45,
    filter: "brightness(0)",

    ease: "none",

    scrollTrigger: {
      trigger: ".page-grid",
      start: "top 90%",
      end: "120 top",
      scrub: 1
    }
  })
}, [])

useEffect(() => {
  gsap.fromTo(".nav-logo",
    {
      opacity: 0,
      filter: "blur(10px)"
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power2.out"
    }
  )
}, [])

useEffect(() => {
  window.scrollTo(0, 0)
}, [])

  return (
    <>
      <GridOverlay visible={showGrid} />

      <Navbar lang={lang} setLang={setLang} />

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

export default App