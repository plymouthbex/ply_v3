import { AppSuspense } from "..";
import useSettings from "app/hooks/useSettings";
import { AppLayouts } from "./index";




const AppLayout = (props) => {

  const { settings } = useSettings();
  const Layout = AppLayouts[settings.activeLayout]

  return (
    <AppSuspense>
       <Layout {...props} />
    </AppSuspense>
  )
}

export default AppLayout