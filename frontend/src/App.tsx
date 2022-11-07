import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyles';
import AppRouter from './AppRouter';
import GlobalFont from './styles/GlobalFont';
import { useSelector } from 'react-redux';

function App() {
  const darkMode = useSelector((state: any) => state.themeMode.darkMode);

  return (
    <ThemeProvider theme={darkMode ? theme.darkTheme : theme.lightTheme}>
      <GlobalFont />
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
