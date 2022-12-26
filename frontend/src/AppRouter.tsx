import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Post from './pages/Post';

const LoggedOutRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
  </Routes>
);

const LoggedInRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/user/:userId" element={<Profile />} />
    <Route path="/post/:postId" element={<Post />} />
  </Routes>
);

const AppRouter = ({ isLoggedIn }: AppRouterType) => {
  return <>{isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</>;
};

export default AppRouter;
