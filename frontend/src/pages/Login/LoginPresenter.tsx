import React from 'react';
import styled from 'styled-components';
import Login from '../../components/feature/Login/Login';
import SignUp from '../../components/feature/SignUp/SignUp';
import Footer from '../../components/layout/footer/Footer';
import { useSelector } from 'react-redux';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding: 20px 0;
  background: ${({ theme }) => theme.bgColor};
`;

const LoginPresenter = () => {
  const selector = useSelector((state: any) => state.login.isLogin);
  return (
    <>
      <LoginWrapper>{selector ? <Login /> : <SignUp />}</LoginWrapper>
      <Footer />
    </>
  );
};

export default LoginPresenter;
