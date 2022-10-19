import React from 'react'
import styled from 'styled-components'
import Login from '../../components/feature/Login/Login'
import Footer from '../../components/layout/footer/Footer'

const LoginWrapper = styled.div`
width: 100%;
height: 829px;
  display: flex;
  flex-direction:column ;
  justify-content: center;
  align-items: center;
  background: #fafafa;
`;

const LoginPresenter = () => {
  return (
    <>
      <LoginWrapper>
        <Login />
      </LoginWrapper>
      <Footer />
    </>
  )
}

export default LoginPresenter
