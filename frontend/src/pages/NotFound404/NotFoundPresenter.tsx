import React from 'react';
import styled from 'styled-components';
import Footer from '../../components/feature/Footer/Footer';
import NavigationBar from '../../components/feature/NavigationBar/NavigationBar';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 40px;
  width: 100%;
  height: 80vh;
  padding-top: 200px;
  h2 {
    font-size: 22px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
  p {
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
  }
`;
const NotFoundPresenter = () => {
  return (
    <>
      <NavigationBar />
      <Container>
        <h2>Sorry, this page isn't available.</h2>
        <p>
          The link you followed may be broken, or the page may have been
          removed. Go back to Instagram.
        </p>
      </Container>
      <Footer />
    </>
  );
};

export default NotFoundPresenter;
