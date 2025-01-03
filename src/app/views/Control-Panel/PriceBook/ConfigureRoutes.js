import Loadable from 'app/components/Loadable';
import { lazy } from 'react';


const ConfigurePriceBook = Loadable(lazy(() => import('./configurePriceBook')));
const Company = Loadable(lazy(() => import('./Company/companyListView')));
const Customer = Loadable(lazy(() => import('./Customer/customerListView')));
const Address=Loadable(lazy(() => import('./Customer/Address/addressListview')));
const Contacts=Loadable(lazy(() => import('./Customer/Contact/contactListview')));
const ConfigureCustomerEdit=Loadable(lazy(() => import('./Customer/Configure/configureEdit')));
const ConfigureCompanyEdit=Loadable(lazy(() => import('./Company/ConfigureCompanyEdit')));
const Items=Loadable(lazy(() => import('./Price-List-Items/priceListItemss')));

const ConfigureRoutes = [
  // { path: '/pages/configure-price-book', element: <ConfigurePriceBook /> },
  { path: '/pages/configure-price-book/company', element: <Company /> },
  { path: '/pages/configure-price-book/customer', element: <Customer /> },
  { path: '/pages/configure-price-book/customer/address', element: <Address /> },
  { path: '/pages/configure-price-book/customer/contact', element: <Contacts /> },
  { path: '/pages/configure-price-book/customer/:mode/configureEdit', element: <ConfigureCustomerEdit /> },
  { path: '/pages/configure-price-book/configure-company-edit/:mode', element: <ConfigureCompanyEdit /> },
  { path: '/pages/configure-price-book/price-list-items/:mode', element: <Items /> },

];

export default ConfigureRoutes;
