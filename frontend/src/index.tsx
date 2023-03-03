import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import store from './redux/store/configureStore';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error: any) => {
        if (error.response?.data.code === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          window.location.reload();
          if (window.location.pathname !== '/') {
            window.location.replace('/');
          }
        }
      },
      enabled: !!localStorage.getItem('accessToken'),
    },
  },
});

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>,
);
