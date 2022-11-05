import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLogin: true,
  isSignup: false,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginComponent: (state) => {
      state.isLogin = true;
      state.isSignup = false;
    },
    signupComponent: (state) => {
      state.isLogin = false;
      state.isSignup = true;
    },
  },
});

export const { loginComponent, signupComponent } = loginSlice.actions;
export default loginSlice.reducer;
