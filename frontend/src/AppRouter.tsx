import React from 'react';
import styled from 'styled-components';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Post from './pages/Post';
import ModalPortal from './components/feature/Modal/ModalPortal';

const LoggedOutRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
  </Routes>
);

const LoggedInRoutes = ({ location }: LoggedInRoutesType) => (
  <Routes>
    <Route path="/" element={<Home />}>
      {location.background && (
        <Route path="post/:postId" element={<ModalPortal />} />
      )}
    </Route>
    <Route path="/:username" element={<Profile />} />
    <Route path="/post/:postId" element={<Post />} />
  </Routes>
);

interface AppRouterType {
  isLoggedIn: boolean;
}

interface LoggedInRoutesType {
  location: any;
}

const AppRouter = ({ isLoggedIn }: AppRouterType) => {
  const location = useLocation();
  const background = location.state && location.state.background;
  return (
    <>
      {isLoggedIn ? (
        <LoggedInRoutes location={!background || location} />
      ) : (
        <LoggedOutRoutes />
      )}
    </>
  );
};

export default AppRouter;
