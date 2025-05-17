import AuthGuard from "./auth/AuthGuard";
import AppLayout from "./components/appLayout/AppLayout";
import sessionRoutes from "./views/sessions/SessionRoutes";
import { Navigate } from "react-router-dom";
import NotFound from "./views/sessions/NotFound";
import HomePage from "./views/Control-Panel/Home/Home";
import HomePagePricing from "./views/Pricing-Portal/Home/Home";
// import UnderDevelopment from "./views/Pricing-Portal/sessions/UnderDevelopment";
import priceBookRoutes from "./views/Pricing-Portal/priceBook/priceBookRoutes";
import QuoteRoutes2 from "./views/Pricing-Portal/quotev2/QuoteRoutes";
import profileRoutes from "./views/Pricing-Portal/profile/ProfileRoutes";
import mailRoutes from "./views/Pricing-Portal/Mail/mailRoutes";
import controlPanelRoutes from "./views/Control-Panel/PriceBook/PriceBookRoutes";
import SecurityRoutes from "./views/Security/SecurityRoutes";
import contactRoutes from "./views/Pricing-Portal/contact/contactRoutes";
import AnalyticsRoutes from "./views/Analytics/AnalyticsRoutes";
import enquiryRoutes from "./views/Pricing-Portal/Enquiry/enquiryRoutes";
const routes = [
  {
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/home", element: <HomePagePricing /> },
      { path: "/favorite/pricing-portal/home", element: <HomePage /> },
      ...priceBookRoutes,
      ...QuoteRoutes2,
      ...profileRoutes,
      ...mailRoutes,
      ...controlPanelRoutes,
      ...SecurityRoutes,
      ...contactRoutes,
      ...AnalyticsRoutes,
      ...enquiryRoutes,
      // { path: '*', element: <UnderDevelopment /> },
    ],
  },
  ...sessionRoutes,
  { path: "/", element: <Navigate to="/session/signin" /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
