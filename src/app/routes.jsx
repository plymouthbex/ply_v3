import AuthGuard from "./auth/AuthGuard";
import AppLayout from "./components/appLayout/AppLayout";
import sessionRoutes from "./views/Control-Panel/sessions/SessionRoutes";
import { Navigate } from "react-router-dom";
import NotFound from "./views/Pricing-Portal/sessions/NotFound";
import HomePage from "./views/Control-Panel/Home/Home";
import HomePagePricing from "./views/Pricing-Portal/Home/Home";
import UnderDevelopment from "./views/Pricing-Portal/sessions/UnderDevelopment";
import priceBookRoutes from "./views/Pricing-Portal/priceBook/priceBookRoutes";
import QuoteRoutes from "./views/Pricing-Portal/quote/QuoteRoutes";
import profileRoutes from "./views/Pricing-Portal/profile/ProfileRoutes";
import mailRoutes from "./views/Pricing-Portal/Mail/mailRoutes";

import controlPanelRoutes from "./views/Control-Panel/PriceBook/PriceBookRoutes";
import SecurityRoutes from "./views/Security/SecurityRoutes";

// import { PDF8 } from "./components/Template/pdfs/CustomerTemp";



const routes = [
    {
      element: (
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      ),
      children: [
        //  { path: '/control-panel/home', element:<HomePage/> },
         { path: '/home', element:<HomePagePricing/> },
        //  { path: '/PDF8', element:<PDF8/> },
         { path: '/favorite/pricing-portal/home', element:<HomePage/> },
        ...priceBookRoutes,
        ...QuoteRoutes,
        ...profileRoutes,
        ...mailRoutes,
        ...controlPanelRoutes,
        ...SecurityRoutes,
        { path: '*', element: <UnderDevelopment /> },
      ],
    },
    ...sessionRoutes,
    { path: '/', element: <Navigate to="/session/signin" /> },
    { path: '*', element: <NotFound /> },


    





  ];
  
  export default routes;