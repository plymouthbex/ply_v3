import Loadable from "app/components/Loadable";
import { lazy } from "react";




const NewProspect = Loadable(lazy(()=>import('./NewProspect')));
const Quote = Loadable(lazy(()=>import('./Quote')));
const BuildPriceList = Loadable(lazy(()=>import('./BuildPriceList')));
const ItemAttributesEdit = Loadable(lazy(()=>import('./ItemAttributesEdit')));
const QuoteList = Loadable(lazy(()=>import('./QuoteList')));
const SavedPriceList = Loadable(lazy(()=>import('./SavedPriceList')));
const SavedQuoteList = Loadable(lazy(()=>import('./SavedQuoteList')));

const QuoteRoutes = [
    { path: '/pages/pricing-portal/new-quote/:mode', element: <NewProspect/> },
    { path: '/pages/pricing-portal/new-quote/:mode/build-quote', element: <Quote/> },
    { path: '/pages/pricing-portal/build-price-list/:mode', element: <BuildPriceList/> },
    { path: '/pages/pricing-portal/build-price-list/:mode/item-attributes/:itemMode', element: <ItemAttributesEdit/> },
    { path: '/pages/pricing-portal/templates', element: <QuoteList/> },
    { path: '/pages/pricing-portal/saved-price-list', element: <SavedPriceList/> },
    { path: '/pages/pricing-portal/saved-quote-list', element: <SavedQuoteList/> },
  ];
    
  export default QuoteRoutes;