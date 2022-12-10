import React from 'react';
import { BsCamera } from 'react-icons/bs';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid red; */
`;

const Wrapper = styled.div`
  width: 350px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  justify-content: center;
  align-items: center;
  /* border: 1px solid red; */
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
    font-size: 14px;
    font-weight: 600;
    color: #0095f6;
    &:hover {
      color: #00376b;
    }
    border: none;
    background: transparent;
  }
`;

const Circle = styled.div`
  width: 62px;
  height: 62px;
  border: 2px solid ${({ theme }) => theme.textColor};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
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
