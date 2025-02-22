import Loadable from 'app/components/Loadable';
import { lazy } from 'react';


const MailAnalytics = Loadable(lazy(() => import('./MailAnalytics')));


const AnalyticsRoutes = [
  { path: '/pages/analytics/mail-analytics', element: <MailAnalytics /> },


];

export default AnalyticsRoutes;
