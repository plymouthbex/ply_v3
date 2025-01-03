import { appLoginTitle, appTitle } from "app/utils/constant";
import { themes } from "../baseTheme/initTheme";
import layout1Settings from "./Layout1/LayoutSettings";


export const AppLayoutSettings = {
  activeLayout: 'layout1', // layout1, layout2
  activeTheme: 'blue', // View all valid theme colors inside themeColors.js
  perfectScrollbar: false,

  themes: themes,
  layout1Settings, // open Layout1/Layout1Settings.js

  secondarySidebar: {
    show: true,
    open: false,
    theme: 'slateDark1', // View all valid theme colors inside themeColors.js
  },
  // Footer options
  footer: {
    show: false,
    fixed: false,
    theme: 'slateDark1', // View all valid theme colors inside themeColors.js
  },
  appCaptionConfig:{
    loginTitle: appLoginTitle,
    title: appTitle,
  }
  };