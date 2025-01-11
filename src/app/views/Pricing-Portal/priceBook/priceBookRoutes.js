import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
const ViewPriceBook=Loadable(lazy(()=>import('./viewPriceBook')));
// const BuildCustomPriceBook = Loadable(lazy(() => import('./BuildCustomPriceBook')));
const RunPriceBook=Loadable(lazy(()=>import('./runPriceBook')));
const EditRunPriceBook=Loadable(lazy(()=>import('./EditRunPriceBook')));
const SendMail=Loadable(lazy(()=>import('../Mail/mail')));

const priceBookRoutes = [
  { path: '/pages/pricing-portal/view-price-book', element: <ViewPriceBook /> },
  { path: '/pages/pricing-portal/view-price-book/send-mail/:id', element: <SendMail /> },

  { path: '/favorite/pages/pricing-portal/view-price-book', element: <ViewPriceBook /> },
  { path: '/pages/pricing-portal/run-price-book', element: <RunPriceBook /> },  
  { path: '/favorite/pages/pricing-portal/run-price-book', element: <RunPriceBook /> },  
  // { path: '/pages/price-book/:screenType', element: <BuildCustomPriceBook /> },
  // { path: '/pages/price-book/:screenType', element: <BuildCustomPriceBook /> },
  // { path: '/favorite/pages/price-book/:screenType', element: <BuildCustomPriceBook /> },
  { path: '/pages/pricing-portal/run-price-book/send-run-price-book', element: <EditRunPriceBook /> },  

];
  
export default priceBookRoutes;