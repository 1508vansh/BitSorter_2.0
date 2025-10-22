import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import darkModeSlice from "../slices/darkmode";
import roomReducer from "../slices/roomSlice";
export const store = configureStore({
    reducer:{
        room:roomReducer,
        auth:authReducer,
        isDark:darkModeSlice,
    }
})
