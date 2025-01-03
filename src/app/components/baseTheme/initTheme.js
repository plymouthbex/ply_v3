import { createTheme } from "@mui/material";
import { forEach, merge, values } from "lodash";
import { themeColors } from "./themeColors";
import themeOptions from "./themeOptions";

function createAppThemes() {
    let themes = {};
    
    forEach(themeColors,(values, key) =>{
        themes[key] = createTheme(merge({},themeOptions, values));

    });

    return themes
}

export const themes = createAppThemes();