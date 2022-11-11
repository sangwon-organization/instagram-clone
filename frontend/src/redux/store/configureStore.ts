import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginReducer from '../slices/loginSlice';
import themeModeReducer from '../slices/themeModeSlice';

const rootReducer = combineReducers({
  login: loginReducer,
  themeMode: themeModeReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
