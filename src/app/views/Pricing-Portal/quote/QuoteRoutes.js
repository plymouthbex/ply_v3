import Loadable from "app/components/Loadable";
import { lazy } from "react";



const Quote=Loadable(lazy(()=>import('./Quote')));
const QuoteForm=Loadable(lazy(()=>import('./QuoteForm')));
const ItemAttributesEdit = Loadable(lazy(() => import('./ItemAttributesEdit')));
const QuoteTemplate=Loadable(lazy(()=>import('./QuoteTemplate')))

const QuoteRoutes = [
    { path: '/pages/pricing-portal/quote', element: <Quote /> },
    { path: '/pages/pricing-portal/quote/item-attributes', element: <ItemAttributesEdit /> },
    { path: '/pages/pricing-portal/quote-form', element: <QuoteForm /> },
    { path: '/favorite/pages/pricing-portal/quote', element: <Quote /> },
    { path: '/pages/pricing-portal/quote-template', element: <QuoteTemplate/> },
    { path: '/favorite/pages/pricing-portal/quote-template', element: <QuoteTemplate/> },
  ];
    
  export default QuoteRoutes;