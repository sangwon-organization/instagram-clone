import React from 'react';
import styled from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';

const LoggedOutRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
  </Routes>
);

const LoggedInRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

interface AppRouterType {
  isLoggedIn: boolean;
}

const AppRouter = ({ isLoggedIn }: AppRouterType) => {
  return <>{isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</>;
};

export default AppRouter;
