import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: true,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginComponent: (state) => {
      state.isLogin = true;
    },
    signupComponent: (state) => {
      state.isLogin = false;
    },
  },
});

export const { loginComponent, signupComponent } = loginSlice.actions;
export default loginSlice.reducer;
