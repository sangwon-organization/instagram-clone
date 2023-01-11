import React, { useLayoutEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyles';
import AppRouter from './AppRouter';
import GlobalFont from './styles/GlobalFont';
import { useSelector, useDispatch } from 'react-redux';
import { persistThemeMode } from '../src/redux/slices/themeModeSlice';
import { RootState } from './redux/store/configureStore';

function App() {
  const darkMode = useSelector((state: RootState) => state.themeMode.darkMode);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const dispatch = useDispatch();

  const previousLoading = () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
      dispatch(persistThemeMode(savedTheme));
    }
    previousLoading();
  }, [dispatch]);

  return (
    <ThemeProvider
      theme={
        darkMode === 'dark' && isLoggedIn ? theme.darkTheme : theme.lightTheme
      }>
      <GlobalFont />
      <GlobalStyle />
      <AppRouter isLoggedIn={isLoggedIn} />
    </ThemeProvider>
  );
}

export default App;
