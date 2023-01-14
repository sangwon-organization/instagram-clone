import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Post from './pages/Post';
import NotFound from './pages/NotFound404';

const LoggedOutRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const LoggedInRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<NotFound />} />
    <Route path="/user/:userId" element={<Profile />}></Route>
    <Route path="/post/:postId" element={<Post />} />
  </Routes>
);
// 로그인 전과 후의 라우터를 다르게 설정
const AppRouter = ({ isLoggedIn }: AppRouterType) => {
  return <>{isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</>;
};

export default AppRouter;
