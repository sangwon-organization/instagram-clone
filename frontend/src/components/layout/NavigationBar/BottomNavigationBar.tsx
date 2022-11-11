import React from 'react';
import styled from 'styled-components';
import HomeIcon from './HomeIcon';

const Container = styled.nav`
  width: 100vw;
  height: 60px;
  background: ${({ theme }) => theme.bgColor};
  /* position: fixed; */
  z-index: 10000;
  @media ${({ theme }) => theme.mobile} {
    display: flex;
    justify-content: center;
    align-items: center;
    background: red;
  }
`;

const Wrapper = styled.div`
  width: 90%;
  height: 100%;
`;

const BottomNavigationBar = () => {
  return (
    <Container>
      <Wrapper>
        <HomeIcon />
        ㅇㄹㅇ
      </Wrapper>
    </Container>
  );
};

export default BottomNavigationBar;
