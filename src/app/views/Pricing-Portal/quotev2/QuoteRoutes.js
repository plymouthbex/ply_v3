import Loadable from "app/components/Loadable";
import { lazy } from "react";




const NewProspect = Loadable(lazy(()=>import('./NewProspect')));
const Quote = Loadable(lazy(()=>import('./Quote')));
const BuildPriceList = Loadable(lazy(()=>import('./BuildPriceList')));

const QuoteRoutes = [
    { path: '/pages/pricing-portal/new-quote', element: <NewProspect/> },
    { path: '/pages/pricing-portal/build-new-quote', element: <Quote/> },
    { path: '/pages/pricing-portal/build-price-list', element: <BuildPriceList/> },
  ];
    
  export default QuoteRoutes;