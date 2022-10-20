import React from 'react'
import styled from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

const LoggedOutRoutes = () => (
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );

const AppRouter = () => {
  return (
    <>
      <LoggedOutRoutes />
    </>
  )
}

export default AppRouter
