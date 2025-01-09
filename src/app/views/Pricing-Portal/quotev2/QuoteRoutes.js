import Loadable from "app/components/Loadable";
import { lazy } from "react";




const NewProspect = Loadable(lazy(()=>import('./NewProspect')));
const Quote = Loadable(lazy(()=>import('./Quote')));
const BuildPriceList = Loadable(lazy(()=>import('./BuildPriceList')));
const ItemAttributesEdit = Loadable(lazy(()=>import('./ItemAttributesEdit')));
const QuoteList = Loadable(lazy(()=>import('./QuoteList')));
const SavedPriceList = Loadable(lazy(()=>import('./SavedPriceList')));

const QuoteRoutes = [
    { path: '/pages/pricing-portal/new-quote', element: <NewProspect/> },
    { path: '/pages/pricing-portal/build-new-quote', element: <Quote/> },
    { path: '/pages/pricing-portal/build-price-list/:mode', element: <BuildPriceList/> },
    { path: '/pages/pricing-portal/build-price-list/:mode/item-attributes/:itemMode', element: <ItemAttributesEdit/> },
    { path: '/pages/pricing-portal/templates', element: <QuoteList/> },
    { path: '/pages/pricing-portal/saved-price-list', element: <SavedPriceList/> },
  ];
    
  export default QuoteRoutes;