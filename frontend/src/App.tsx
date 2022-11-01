import React from 'react';
import { Helmet } from 'react-helmet-async';
import GlobalStyle from './styles/GlobalStyles';
import AppRouter from './AppRouter';

function App() {
  return (
    <>
      <Helmet>
        <title>Instagram-Clone</title>
      </Helmet>
      <GlobalStyle />
      <AppRouter />
    </>
  );
}

export default App;
