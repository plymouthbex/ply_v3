import Loadable from 'app/components/Loadable';
import { lazy } from 'react';


const ItemsList = Loadable(lazy(() => import('./items/ItemsList')));

const PriceList = Loadable(lazy(() => import('./price-list/PriceList')));
const PriceListEdit = Loadable(lazy(() => import('./price-list/PriceListEdit')));
const ItemAttributesEdit = Loadable(lazy(() => import('./price-list/ItemAttributesEdit')));
const PriceListItems = Loadable(lazy(() => import('./price-list/PriceListItems')));

const PrintGroup = Loadable(lazy(() => import('./print-group/PrintGroup')));
const PrintGroupEdit = Loadable(lazy(() => import('./print-group/PrintGroupEdit')));

const CustomerPriceLists = Loadable(lazy(() => import('./customer-price-lists/CustomerPriceLists')));
const CustomerPriceListsEdit = Loadable(lazy(() => import('./customer-price-lists/CustomerPriceListsEdit')));
const PPBCustomerItems = Loadable(lazy(() => import('./customer-price-lists/PPBCustomerItems')));

const RunGroup = Loadable(lazy(() => import('./run-group/RunGroup')));
const RunGroupEdit = Loadable(lazy(() => import('./run-group/RunGroupEdit')));

const CompanyList=Loadable(lazy(()=>import("./price-list/CompanyList")));
const CompanyRunGroup=Loadable(lazy(()=>import("./run-group/CompanyRunGroup")));




const Company = Loadable(lazy(() => import('./Company/companyListView')));
const Customer = Loadable(lazy(() => import('./Customer/customerListView')));
const Address=Loadable(lazy(() => import('./Customer/Address/addressListview')));
const Contacts=Loadable(lazy(() => import('./Customer/Contact/contactListview')));
const ConfigureCustomerEdit=Loadable(lazy(() => import('./Customer/Configure/configureEdit')));
const ConfigureCompanyEdit=Loadable(lazy(() => import('./Company/ConfigureCompanyEdit')));
const Items=Loadable(lazy(() => import('./Price-List-Items/priceListItemss')));




const controlPanelRoutes = [
  { path: '/pages/control-panel/items', element: <ItemsList /> },


  { path: '/pages/control-panel/company-price-list', element: <CompanyList /> },
  { path: '/pages/control-panel/price-list', element: <PriceList /> },
  { path: '/pages/control-panel/price-list/price-list-items', element: <PriceListItems /> },
  { path: '/pages/control-panel/price-list/price-list-detail/:mode', element: <PriceListEdit /> },
  { path: '/pages/control-panel/price-list/price-list-detail/:mode/item-attributes/:itemMode', element: <ItemAttributesEdit /> },

  { path: '/pages/control-panel/print-group', element: <PrintGroup /> },
  { path: '/pages/control-panel/print-group/print-group-detail/:mode' , element: <PrintGroupEdit /> },

  { path: '/pages/control-panel/customer-price-lists', element: <CustomerPriceLists /> },
  { path: '/pages/control-panel/customer-price-lists/customer-price-lists-detail/:mode', element: <CustomerPriceListsEdit /> },
  { path: '/pages/control-panel/customer-price-lists/customer-price-lists-detail/:mode/ppb-customer-items', element: <PPBCustomerItems /> },


  { path: '/pages/control-panel/company-run-group', element: <CompanyRunGroup /> },
  { path: '/pages/control-panel/run-group', element: <RunGroup /> },
  { path: '/pages/control-panel/run-group/run-group-getail/:mode', element: <RunGroupEdit /> },




  { path: '/pages/control-panel/configure-price-book/company', element: <Company /> },
  { path: '/pages/control-panel/configure-price-book/customer', element: <Customer /> },
  { path: '/pages/control-panel/configure-price-book/customer/address', element: <Address /> },
  { path: '/pages/control-panel/configure-price-book/customer/contact', element: <Contacts /> },
  { path: '/pages/control-panel/configure-price-book/customer/:mode/configureEdit', element: <ConfigureCustomerEdit /> },
  { path: '/pages/control-panel/configure-price-book/configure-company-edit/:mode', element: <ConfigureCompanyEdit /> },
  { path: '/pages/control-panel/configure-price-book/price-list-items/:mode', element: <Items /> },

 



];

export default controlPanelRoutes;
