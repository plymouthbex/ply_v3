import Loadable from 'app/components/Loadable';
import { lazy } from 'react';


const Profile = Loadable(lazy(() => import('./profile')));
const Settings = Loadable(lazy(() => import('./setting')));


const profileRoutes = [
  { path: '/profile/setting', element: <Settings /> },
  { path: '/user-profile', element: <Profile /> },
 
];

export default profileRoutes;
