import App from "./App"
import Home from "./pages/Home"
import Catalogo from "./pages/Catalogo"
import CatalogoItem from "./pages/CatalogoItem"
import Sobre from "./pages/Sobre"
import { catalogue } from "./data/catalogue"

export const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "catalogo", element: <Catalogo /> },
      {
        path: "catalogo/:id",
        element: <CatalogoItem />,
        getStaticPaths: () => catalogue.map(item => `/catalogo/${item.id}`),
      },
      { path: "sobre", element: <Sobre /> },
    ],
  },
]
