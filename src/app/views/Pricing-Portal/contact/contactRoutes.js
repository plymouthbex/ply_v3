import Loadable from 'app/components/Loadable';
import { lazy } from 'react';



const CustomerList=Loadable(lazy(()=>import('./contactList')));
const Customeredit=Loadable(lazy(()=>import('./contactEdit')));
const ViewContact=Loadable(lazy(()=>import('./viewContact')));

const contactRoutes = [
  { path: '/pages/pricing-portal/contact-directory/', element: <CustomerList /> },

  { path: '/pages/pricing-portal/contact-directory/contacts', element: <Customeredit /> },
  { path: '/pages/pricing-portal/contact-directory/contacts/:mode', element: <ViewContact /> },

];
  
export default contactRoutes;