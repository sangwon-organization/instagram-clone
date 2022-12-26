import React from 'react';
import styled from 'styled-components';
import FeedCard from '../../components/feature/Home/FeedCard';
import HomeAside from '../../components/feature/Home/HomeAside';
import StoryBox from '../../components/feature/Home/StoryBox';
import NavigationBar from '../../components/layout/NavigationBar/NavigationBar';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
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
  gap: 14px 0;
  width: 470px;
  height: fit-content;
`;

const HomePresenter = ({ getPostsData, scrollRef }: HomePresenterType) => {
  return (
    <>
      <NavigationBar />
      <MainContainer>
        <MainWrapper>
          <StoryAndFeedSection>
            <StoryBox />
            {getPostsData?.pages.flatMap((page: PageType) =>
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
          </StoryAndFeedSection>
          <HomeAside />
        </MainWrapper>
      </MainContainer>
      <div
        style={{ background: 'black', width: '30px', height: '30px' }}
        ref={scrollRef}
      />
    </>
  );
};

export default HomePresenter;
