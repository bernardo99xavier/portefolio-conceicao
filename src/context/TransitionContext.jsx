import { createContext, useContext, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"

const TransitionContext = createContext()

export function TransitionProvider({ children }) {
  const overlayRef = useRef(null)
  const navigate = useNavigate()

  const transitionTo = useCallback((path) => {
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        navigate(path)
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          delay: 0.15,
        })
      },
    })
  }, [navigate])

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {children}
      <div ref={overlayRef} className="page-transition-overlay" />
    </TransitionContext.Provider>
  )
}

export const useTransition = () => useContext(TransitionContext)
