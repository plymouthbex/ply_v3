import { AppLoading } from 'app/components';
import { Suspense } from 'react';

const AppSuspense = ({ children }) => {
  return <Suspense fallback={<AppLoading />}>{children}</Suspense>;
};

export default AppSuspense;
