import React from 'react';
import { BsCamera } from 'react-icons/bs';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px 0;
  width: 350px;
  height: fit-content;
  h3 {
    font-size: 28px;
    font-weight: 300;
    color: ${({ theme }) => theme.textColor};
  }
  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0.3px;
    text-align: center;
    color: ${({ theme }) => theme.textColor};
  }
  button {
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.buttonColor};
    &:hover {
      color: #00376b;
    }
  }
`;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 62px;
  height: 62px;
  border: 2px solid ${({ theme }) => theme.textColor};
  border-radius: 50%;
  cursor: pointer;
`;

const CameraIcon = styled(BsCamera)`
  font-size: 25px;
  color: ${({ theme }) => theme.textColor};
`;

const SharesPhotosBox = () => {
  return (
    <Container>
      <Wrapper>
        <Circle>
          <CameraIcon />
        </Circle>
        <h3>Share Photos</h3>
        <p>When you share photos, they will appear on your profile.</p>
        <button>Share your first photo</button>
      </Wrapper>
    </Container>
  );
};

export default SharesPhotosBox;
