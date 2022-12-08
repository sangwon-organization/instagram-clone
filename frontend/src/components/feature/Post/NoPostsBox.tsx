import React from 'react';
import styled from 'styled-components';
import { BsCamera } from 'react-icons/bs';

const Container = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  justify-content: center;
  align-items: center;
  p {
    font-size: 28px;
    font-weight: 300;
  }
`;
const Circle = styled.div`
  width: 62px;
  height: 62px;
  border: 2px solid black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CameraIcon = styled(BsCamera)`
  font-size: 25px;
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
