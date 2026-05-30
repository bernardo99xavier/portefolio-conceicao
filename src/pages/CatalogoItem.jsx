import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { catalogue } from "../data/catalogue"

export default function CatalogoItem() {
  const { id } = useParams()
  const item = catalogue.find(i => i.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!item) return <div className="page-grid"><p>Item não encontrado.</p></div>

  const title = `${item.color} ${item.code} — Conceição`
  const description = `${item.code} na cor ${item.color}. Peça artesanal de Conceição.`

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={item.photos[0]} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="page-grid">
        {item.photos.map((photo, i) => (
          <div key={i} className="item-photo">
            <img src={photo} alt={`${item.id} — foto ${i + 1}`} />
          </div>
        ))}
      </div>
    </>
  )
}
