import React from 'react';
import styled from 'styled-components';
import Footer from '../../components/feature/Footer/Footer';
import NavigationBar from '../../components/feature/NavigationBar/NavigationBar';
import PostWrapper from '../../components/feature/Post/PostWrapper';
import NotFoundContainer from '../NotFound404/NotFoundContainer';
import LoadingPage from '../../components/share/LoadingPage';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75vh;
  padding-top: 60px;
`;

const PostPresenter = ({
  postId,
  getPostError,
  getPostLoading,
}: PostPresenterType) => {
  if (
    getPostError?.response.data.message === '해당 포스트가 존재하지 않습니다.'
  ) {
    return <NotFoundContainer />;
  }

  if (getPostLoading) {
    return <LoadingPage />;
  }
  return (
    <>
      <NavigationBar />
      <Container>
        <PostWrapper postId={postId} />
      </Container>
      <Footer />
    </>
  );
};

export default PostPresenter;
