import { Helmet } from "react-helmet-async"

export default function Sobre() {
  return (
    <>
      <Helmet>
        <title>Sobre — Conceição</title>
        <meta name="description" content="Sobre Conceição — prática artística visual." />
        <meta property="og:title" content="Sobre — Conceição" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-grid">
        <h1>Sobre</h1>
      </div>
    </>
  )
}
