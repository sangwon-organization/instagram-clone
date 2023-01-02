import React from 'react';
import styled from 'styled-components';
import Footer from '../../components/layout/footer/Footer';
import NavigationBar from '../../components/layout/NavigationBar/NavigationBar';
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

interface PostPresenterType {
  nextSlide: () => void;
  prevSlide: () => void;
  commentPostMutate: Function;
  commentPostIsLoading: boolean;
  navigate: any;
  currentSlide: number;
  slideRef: any;
  totalSlide: number;
  textareaRef: any;
  onSubmit: Function;
  isValid: any;
  postButtonRef: any;
  register: any;
  handleSubmit: any;
  commentRef: any;
  rest: any;
  likePostFunction: any;
  mutateLikePost: any;
  likeButtonClicked: any;
  doubleClickImage: any;
  showPostDropdown: any;
  openModal: any;
  closeModal: any;
  isMyPost: any;
  postId: any;
  getPostError: any;
  getPostLoading: any;
}

const PostPresenter = ({
  nextSlide,
  prevSlide,
  commentPostMutate,
  commentPostIsLoading,
  navigate,
  currentSlide,
  slideRef,
  totalSlide,
  textareaRef,
  onSubmit,
  isValid,
  postButtonRef,
  register,
  handleSubmit,
  commentRef,
  rest,
  likePostFunction,
  mutateLikePost,
  likeButtonClicked,
  doubleClickImage,
  showPostDropdown,
  openModal,
  closeModal,
  isMyPost,
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
