import React from 'react';
import styled from 'styled-components';
import Login from '../../components/feature/LoginSignUp/Login';
import SignUp from '../../components/feature/LoginSignUp/SignUp';
import Footer from '../../components/feature/Footer/Footer';

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

const LoginPresenter = ({ isLogin }: { isLogin: boolean }) => {
  return (
    <>
      <LoginWrapper>{isLogin ? <Login /> : <SignUp />}</LoginWrapper>
      <Footer />
    </>
  );
};

export default LoginPresenter;
