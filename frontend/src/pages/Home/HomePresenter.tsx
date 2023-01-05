import React from 'react';
import styled from 'styled-components';
import FeedCard from '../../components/feature/Home/FeedCard';
import HomeAside from '../../components/feature/Home/HomeAside';
import StoryBox from '../../components/feature/Home/StoryBox';
import NavigationBar from '../../components/feature/NavigationBar/NavigationBar';
import Loader from 'react-loader';
import AllSugesstionsList from '../../components/feature/Home/AllSugesstionsList';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 60px;
  background: ${({ theme }) => theme.bgColor};
`;

const MainWrapper = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 848px;
  height: fit-content;
`;

const StoryAndFeedSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px 0;
  width: 470px;
  height: fit-content;
  margin: 28px 0;
`;

const ScrollSensor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
`;

const HomePresenter = ({
  getPostsData,
  scrollRef,
  hasNextPage,
  isFetchingNextPage,
}: HomePresenterType) => {
  return (
    <>
      <NavigationBar />
      <MainContainer>
        <MainWrapper>
          {getPostsData?.pages[0].postList.length > 0 ? (
            <>
              <StoryAndFeedSection>
                <StoryBox />
                {getPostsData?.pages.map((page: PageType) =>
                  page.postList.map((post: PostListType) => (
                    <FeedCard
                      key={post.postId}
                      postId={post.postId}
                      username={post.username}
                      profileImage={post.profileImage}
                      likeYn={post.likeYn}
                      likeCount={post.likeCount}
                      createdAt={post.createdAt}
                      commentCount={post.commentCount}
                      bookmarkYn={post.bookmarkYn}
                      content={post.content}
                      postImageList={post.postImageList}
                      userId={post.userId}
                    />
                  )),
                )}

                {hasNextPage && (
                  <ScrollSensor ref={scrollRef}>
                    <Loader
                      loaded={!isFetchingNextPage}
                      color="#8e8e8e"
                      scale={0.8}
                      top="50%"
                      left="50%"
                      position="relative"
                    />
                  </ScrollSensor>
                )}
              </StoryAndFeedSection>
              <HomeAside />
            </>
          ) : (
            <AllSugesstionsList />
          )}
        </MainWrapper>
      </MainContainer>
    </>
  );
};

export default HomePresenter;
