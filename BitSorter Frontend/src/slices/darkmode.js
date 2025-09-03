import { createSlice } from "@reduxjs/toolkit";


const counterSlice = createSlice({
    name: 'isDark',
    initialState: {
      isDark: false,
    },
    reducers: {
      toggleMode: (state) => {
        state.isDark = !state.isDark;
      }
    }
})
export const { toggleMode } = counterSlice.actions;
export default counterSlice.reducer;