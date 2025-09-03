import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import darkModeSlice from "../slices/darkmode";
export const store = configureStore({
    reducer:{
        auth:authReducer,
        isDark:darkModeSlice,
    }
})
