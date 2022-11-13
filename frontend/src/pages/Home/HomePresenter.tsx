import React from 'react';
import styled from 'styled-components';
import FeedCard from '../../components/feature/Home/FeedCard';
import HomeAside from '../../components/feature/Home/HomeAside';
import StoryBox from '../../components/feature/Home/StoryBox';
import BottomNavigationBar from '../../components/layout/NavigationBar/BottomNavigationBar';
import NavigationBar from '../../components/layout/NavigationBar/NavigationBar';

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.bgColor};
  padding-top: 60px;
  @media ${({ theme }) => theme.tablet} {
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  @media ${({ theme }) => theme.mobile} {
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const MainWrapper = styled.main`
  width: 848px;
  height: fit-content;
  /* border: 1px solid red; */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @media ${({ theme }) => theme.tablet} {
    width: 80vw;
    align-items: center;
    justify-content: center;
  }
  @media ${({ theme }) => theme.mobile} {
    width: 100vw;
    align-items: center;
    justify-content: center;
  }
`;

const StoryAndFeedSection = styled.section`
  width: 470px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 14px 0;
  @media ${({ theme }) => theme.tablet} {
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media ${({ theme }) => theme.mobile} {
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
      <BottomNavigationBar />
    </>
  );
};

export default HomePresenter;
