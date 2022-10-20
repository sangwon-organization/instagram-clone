import React from 'react';
import styled from 'styled-components';
import FeedCard from '../../components/feature/Home/FeedCard';
import HomeAside from '../../components/feature/Home/HomeAside';
import StoryBox from '../../components/feature/Home/StoryBox';
import NavigationBar from '../../components/layout/NavigationBar/NavigationBar';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
`;

const MainWrapper = styled.main`
  width: 848px;
  height: 1000px;
  border: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HomePresenter = () => {
  return (
    <>
      <NavigationBar />
      <MainContainer>
        <MainWrapper>
          <StoryBox />
          <FeedCard />
          <HomeAside />
        </MainWrapper>
      </MainContainer>
    </>
  );
};

export default HomePresenter;
