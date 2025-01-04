import Loadable from "app/components/Loadable";
import { lazy } from "react";



const Quote=Loadable(lazy(()=>import('./Quote')));
const QuoteForm=Loadable(lazy(()=>import('./QuoteForm')));
const ItemAttributesEdit = Loadable(lazy(() => import('./ItemAttributesEdit')));
const QuoteTemplate=Loadable(lazy(()=>import('./QuoteTemplate')))
const NewProspect=Loadable(lazy(()=>import('./newProspect')))
const ExistingCustomer=Loadable(lazy(()=>import('./existingcustomer')))
const QuoteList=Loadable(lazy(()=>import('./quoteList')))
const QuoteRoutes = [
    { path: '/pages/pricing-portal/quote', element: <Quote /> },
    { path: '/pages/pricing-portal/quote/item-attributes/:itemMode', element: <ItemAttributesEdit /> },
    { path: '/pages/pricing-portal/quote-form/:mode', element: <QuoteForm /> },
    { path: '/favorite/pages/pricing-portal/quote', element: <Quote /> },
    { path: '/pages/pricing-portal/quote-template', element: <QuoteTemplate/> },
    { path: '/favorite/pages/pricing-portal/quote-template', element: <QuoteTemplate/> },
    { path: '/pages/pricing-portal/new-prospect-quote', element: <NewProspect/> },
    { path: '/pages/pricing-portal/existing-customer-quote', element: <ExistingCustomer/> },
    { path: '/pages/pricing-portal/quote-list', element: <QuoteList/> },
  ];
    
  export default QuoteRoutes;