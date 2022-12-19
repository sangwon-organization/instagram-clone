import React from 'react';
import styled from 'styled-components';
import { BsCamera } from 'react-icons/bs';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px 0;
  width: 200px;
  height: 200px;
  p {
    font-size: 28px;
    font-weight: 300;
    color: ${({ theme }) => theme.textColor};
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
`;

const CameraIcon = styled(BsCamera)`
  font-size: 25px;
  color: ${({ theme }) => theme.textColor};
`;

const NoPostsBox = () => {
  return (
    <Container>
      <Wrapper>
        <Circle>
          <CameraIcon />
        </Circle>
        <p>No Posts Yet</p>
      </Wrapper>
    </Container>
  );
};

export default NoPostsBox;
