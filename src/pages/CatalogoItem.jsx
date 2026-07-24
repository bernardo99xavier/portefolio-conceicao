import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { catalogue } from "../data/catalogue"
import { getItemDetails } from "../data/itemDisplay"
import { CONTACT } from "../data/contact"
import { useLang } from "../context/LangContext"

export default function CatalogoItem() {
  const { id } = useParams()
  const item = catalogue.find(i => i.id === id)
  const { lang, t } = useLang()
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Lock background scroll while the contact overlay is open
  useEffect(() => {
    document.body.style.overflow = showContact ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [showContact])

  if (!item) return <div className="page-grid"><p>{t("item.naoEncontrado")}</p></div>

  const details = getItemDetails(item, t)
  const pageTitle = `${details.title} — Conceição`
  const metaDesc = details.sold
    ? t("item.meta.descSold", { title: details.title })
    : details.description

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={item.photos[0]} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="page-grid page-grid--item">
        <div className="item-photos">
          {item.photos.map((photo, i) => (
            <div key={i} className="item-photo">
              <img
                src={photo}
                alt={`${item.id} — foto ${i + 1}`}
                /* the first shot is above the fold; the rest load on scroll */
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>

        <aside className="item-info">
          <h1 className="item-info__title">{details.title}</h1>
          <p className="item-info__ref">{t("item.ref")} {details.reference}</p>

          <div className="item-info__panel">
            <div className={`item-info__body${details.sold ? " item-info__body--sold" : ""}`}>
              <p className="item-info__desc">{details.description}</p>

              <ul className="item-info__specs">
                {details.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>

              <div className="item-buy">
                <span className="item-buy__price">
                  {details.price != null ? `€${details.price}` : t("item.sobConsulta")}
                </span>
                <button className="item-buy__btn" onClick={() => setShowContact(true)}>
                  {t("item.comprar")}
                </button>
              </div>
            </div>

            {details.sold && <div className="item-info__sold-badge">{t("item.vendida")}</div>}
          </div>
        </aside>
      </div>

      {showContact && (
        <div className="contact-overlay" onClick={() => setShowContact(false)}>
          <div className="contact-overlay__box" onClick={e => e.stopPropagation()}>
            <p className="contact-overlay__msg">{t("item.overlay.msg")}</p>

            <div className="contact-overlay__links">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={CONTACT.facebook} target="_blank" rel="noreferrer">Facebook</a>
            </div>

            <p className="contact-overlay__email">{CONTACT.email}</p>
          </div>
        </div>
      )}
    </>
  )
}
