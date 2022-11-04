import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginReducer from '../slices/loginSlice';

const rootReducer = combineReducers({
  login: loginReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
