import React from 'react';
import styled from 'styled-components';
import AppStoreImage from '../../assets/image/AppStoreImage.png';
import GooglePlayImage from '../../assets/image/GooglePlayImage.png';

const Container = styled.div`
  width: 100%;
  height: 99.7px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20.5px 0;
  p {
    font-size: 13.7px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #262626;
  }
`;

const ButtonWrapper = styled.div`
  width: fit-content;
  height: 43px;
  display: flex;
  gap: 0 7.8px;
  img {
    width: 131.3px;
    height: 39.1px;
  }
`;

const LoginSignUpBottomBox = () => {
  return (
    <Container>
      <p>Get the app.</p>
      <ButtonWrapper>
        <img src={AppStoreImage} alt="앱스토어로고" />
        <img src={GooglePlayImage} alt="구글플레이로고" />
      </ButtonWrapper>
    </Container>
  );
};

export default LoginSignUpBottomBox;
