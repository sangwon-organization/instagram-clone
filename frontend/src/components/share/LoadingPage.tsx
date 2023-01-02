import React from 'react';
import styled from 'styled-components';
import favicon from '../../assets/image/thumbnail.png';
import clonestagramLogo from '../../assets/image/clonestagramLogoBlack.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.whiteColor};
  img {
    width: 100px;
    height: 100px;
  }
`;

const LogoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 7px 0;
  position: absolute;
  bottom: 30px;
  width: fit-content;
  height: fit-content;
  p {
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
  img {
    width: 100px;
    height: 30px;
  }
`;

const LoadingPage = () => {
  return (
    <Container>
      <img src={favicon} alt="클론스타그램파비콘" />
      <LogoBox>
        <p>from</p>
        <img src={clonestagramLogo} alt="클론스타그램로고" />
      </LogoBox>
    </Container>
  );
};

export default LoadingPage;
