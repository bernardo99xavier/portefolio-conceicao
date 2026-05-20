import logo from "../assets/logo_cf.svg"
import { content } from "../data/content"

function Navbar({ lang, setLang }) {
  return (
    <nav>
      <h1>
        <a href="/">
          <img className="nav-logo" src={logo} alt="Logo" />
        </a>
      </h1>

      <ul>
        <li>{content.nav.work[lang]}</li>
        <li>{content.nav.about[lang]}</li>

        <li className="lang-switch">
          <span
            onClick={() => setLang("en")}
            style={{ opacity: lang === "en" ? 1 : 0.5, cursor: "pointer" }}
          >
            EN
          </span>

          <span> | </span>

          <span
            onClick={() => setLang("pt")}
            style={{ opacity: lang === "pt" ? 1 : 0.5, cursor: "pointer" }}
          >
            PT
          </span>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar