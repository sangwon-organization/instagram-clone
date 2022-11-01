import React from 'react';
import styled from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';

const LoggedOutRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
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
