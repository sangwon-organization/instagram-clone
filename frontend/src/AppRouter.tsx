import React from 'react'
import styled from 'styled-components';
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';

const LoggedOutRoutes = () => (
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/" element={<Login />} />
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
