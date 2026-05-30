import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { useTransition } from "../context/TransitionContext"
import { catalogue } from "../data/catalogue"

export default function Catalogo() {
  const { activeCategory, activeColor } = useOutletContext()
  const { transitionTo } = useTransition()

  useEffect(() => {
    catalogue.forEach(item => {
      if (item.photos[1]) {
        const img = new Image()
        img.src = item.photos[1]
      }
    })
  }, [])

  const filtered = catalogue.filter(item => {
    if (activeCategory === "malas" && !item.code.startsWith("M")) return false
    if (activeColor && item.color !== activeColor) return false
    return true
  })

  return (
    <>
      <Helmet>
        <title>Catálogo — Conceição</title>
        <meta name="description" content="Explorar o catálogo de Conceição — malas, colares e acessórios artesanais." />
        <meta property="og:title" content="Catálogo — Conceição" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-grid">
        {filtered.map(item => (
          <div
            key={item.id}
            className="catalog-item"
            onClick={() => transitionTo(`/catalogo/${item.id}`)}
          >
            <img className="main-img" src={item.photos[0]} alt={item.id} />
            {item.photos[1] && (
              <img className="hover-img" src={item.photos[1]} alt={item.id} />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
