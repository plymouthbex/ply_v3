
import Loadable from "app/components/Loadable";
import { lazy } from "react";



const MailSidebar=Loadable(lazy(()=>import('./mail')));


const mailRoutes = [
    { path: '/sent-mail', element: <MailSidebar/> },
  
  
  ];
    
  export default mailRoutes;