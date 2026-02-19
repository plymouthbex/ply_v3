import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotFound = Loadable(lazy(() => import('./NotFound')));
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('./ResetPassword')));
const JwtLogin = Loadable(lazy(() => import('./JwtLogin')));
const Callback = Loadable(lazy(() => import('./Callback')));
const JwtRegister = Loadable(lazy(() => import('./JwtRegister')));
const UnlockPassword = Loadable(lazy(() => import('./UnLockPassword')));
const Notification = Loadable(lazy(() => import('./Notificaion')));

const sessionRoutes = [
  { path: '/session/signup', element: <JwtRegister /> },
  { path: '/session/signin', element: <JwtLogin /> },
  { path: '/session/forgot-password', element: <ForgotPassword /> },
  { path: '/session/reset-password', element: <ResetPassword /> },
  { path: '/session/unlock-password', element: <UnlockPassword /> },
  { path: '/session/unlock-password/:notificationName', element: <Notification/> },
  { path: '/auth/callback', element: <Callback/> },
  { path: '/session/404', element: <NotFound /> },
];

export default sessionRoutes;
