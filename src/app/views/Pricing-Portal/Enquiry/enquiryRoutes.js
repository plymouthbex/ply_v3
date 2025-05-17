import Loadable from 'app/components/Loadable';
import { lazy } from 'react';



const Enquiry=Loadable(lazy(()=>import('./enquiry')));


const enquiryRoutes = [
  { path: '/pages/pricing-portal/enquiry', element: <Enquiry /> },


];
  
export default enquiryRoutes;