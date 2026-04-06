import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductPage } from "./pages/ProductPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { EstimatePage } from "./pages/EstimatePage";
import { BrandsPage } from "./pages/BrandsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { SearchPage } from "./pages/SearchPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "categories/:categoryId", Component: CategoryPage },
      { path: "products/:productId", Component: ProductPage },
      { path: "services", Component: ServicesPage },
      { path: "services/:serviceId", Component: ServiceDetailPage },
      { path: "estimate", Component: EstimatePage },
      { path: "brands", Component: BrandsPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "search", Component: SearchPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
