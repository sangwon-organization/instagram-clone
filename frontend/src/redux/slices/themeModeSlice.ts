import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: 'light',
};

export const themeModeSlice = createSlice({
  name: 'themeMode',
  initialState,
  reducers: {
    changeThemeMode: (state) => {
      state.darkMode = state.darkMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.darkMode);
    },
    persistThemeMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { changeThemeMode, persistThemeMode } = themeModeSlice.actions;
export default themeModeSlice.reducer;
