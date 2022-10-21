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
  height: fit-content;
  /* border: 1px solid red; */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StoryAndFeedSection = styled.section`
  width: 470px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 14px 0;
`;

const HomePresenter = () => {
  return (
    <>
      <NavigationBar />
      <MainContainer>
        <MainWrapper>
          <StoryAndFeedSection>
            <StoryBox />
            <FeedCard />
            <FeedCard />
          </StoryAndFeedSection>
          <HomeAside />
        </MainWrapper>
      </MainContainer>
    </>
  );
};

export default HomePresenter;
