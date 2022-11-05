import React from 'react';
import GlobalStyle from './styles/GlobalStyles';
import AppRouter from './AppRouter';
import GlobalFont from './styles/GlobalFont';

function App() {
  return (
    <>
      <GlobalFont />
      <GlobalStyle />
      <AppRouter />
    </>
  );
}

export default App;
