import { configureStore } from "@reduxjs/toolkit";

import listviewReducer from "./slice/listviewSlice"
import priceListReducer  from "./slice/priceListSlice"
import getSliceReducer from "./slice/getSlice"
import postDataReducer from "./slice/postSlice"
export const store = configureStore({
    reducer:{
     listview: listviewReducer,
     priceList: priceListReducer,
     getSlice:getSliceReducer,
     postData:postDataReducer

    }
})

