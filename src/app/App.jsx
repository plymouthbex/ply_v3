import { useRoutes } from "react-router-dom";
import { Apptheme } from "./components";
import { AuthProvider } from "./contexts/JWTAuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import routes from "./routes";
import "../fake-db";

const App = () => {
    const content = useRoutes(routes);
  
    return (
      // <Provider store={Store}>
      <SettingsProvider>
          <Apptheme>
            <AuthProvider>{content}</AuthProvider>
          </Apptheme>
        </SettingsProvider>
      // {/* </Provider> */}
    );
  };
  
  export default App;