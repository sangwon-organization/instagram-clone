import React from 'react';
import styled from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignUp from './components/feature/SignUp/SignUp';

const LoggedOutRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/home" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

const AppRouter = () => {
  return (
    <>
      <LoggedOutRoutes />
    </>
  );
};

export default AppRouter;
