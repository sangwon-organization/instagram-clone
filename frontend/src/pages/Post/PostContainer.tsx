import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { commentPost, getPost, likePost } from '../../api/api';
import MetaTag from '../../meta/MetaTag';
import PostPresenter from './PostPresenter';

const PostContainer = () => {
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const textareaRef = useRef(null);
  const postButtonRef = useRef(null);
  const slideRef = useRef(null);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  let params = useParams();

  let postId = parseInt(params.postId);

  const myUserId = parseInt(localStorage.getItem('userId'));

  const {
    data: getUserPostData,
    error: getPostError,
    isLoading: getPostLoading,
  } = useQuery<GetPostQueryType, AxiosError<Error>>(
    ['getPost', postId],
    () => getPost(postId),
    {
      refetchOnWindowFocus: false,
    },
  );

  const isMyPost = myUserId === getUserPostData?.userId;

  const totalSlide = getUserPostData?.postImageList.length;

  const doubleClickImage = () => {
    setLikeButtonClicked(true);
    setTimeout(() => {
      setLikeButtonClicked(false);
    }, 1200);
  };

  const nextSlide = () => {
    if (currentSlide >= totalSlide) {
      return;
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      return;
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<CommentPostFormValues>({ mode: 'onChange' });

  const { ref: commentRef, ...rest } = register('commentInput', {
    required: true,
  });

  const {
    mutate: commentPostMutate,
    data,
    error,
    reset,
    isLoading: commentPostIsLoading,
  } = useMutation<ResponseData, AxiosError, CommentPostType>(commentPost, {
    onError: (err) => {
      console.log('댓글 등록 실패!', err.response.data);
    },
    onSuccess: (e) => {
      console.log('댓글 등록 성공!');
      queryClient.invalidateQueries(['getPost']);
      textareaRef.current.value = '';
      textareaRef.current.focus();
    },
  });

  const onSubmit = (dataInput: CommentPostFormValues) => {
    console.log(dataInput);
    commentPostMutate({
      postId: postId,
      parentCommentId: '',
      content: dataInput.commentInput,
    });
  };

  const likePostFunction = () => {
    if (getUserPostData?.likeYn === 'Y') {
      mutateLikePost.mutate({
        postId: getUserPostData?.postId,
        likeYn: 'N',
      });
    } else {
      mutateLikePost.mutate({
        postId: getUserPostData?.postId,
        likeYn: 'Y',
      });
    }
  };

  const mutateLikePost = useMutation<ResponseData, AxiosError, LikePostType>(
    likePost,
    {
      onError: (err) => {
        console.log('포스트 좋아요 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('포스트 좋아요 성공!');
        queryClient.invalidateQueries(['getPost']);
      },
    },
  );

  // useEffect(() => {
  //   slideRef.current.style.transition = 'all 0.5s ease-in-out';
  //   slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  // }, [currentSlide]);

  const [showPostDropdown, setShowPostDropdown] = useState(false);
  const openModal = () => {
    setShowPostDropdown(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowPostDropdown(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <MetaTag
        title={`@${getUserPostData?.username} on Clonestagram: "${getUserPostData?.content}"`}
        description={`${getUserPostData?.likeCount} Likes, ${getUserPostData?.commentCount} Comments - @${getUserPostData?.username} on Clonestagram: "${getUserPostData?.content}"`}
        keywords="클론코딩, 인스타그램, clone coding"
        url={`https://instagram-clone-sangwon.com/post/${postId}`}
        imgsrc={getUserPostData?.postImageList[0]}
      />
      <PostPresenter
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        commentPostMutate={commentPostMutate}
        commentPostIsLoading={commentPostIsLoading}
        navigate={navigate}
        currentSlide={currentSlide}
        slideRef={slideRef}
        totalSlide={totalSlide}
        textareaRef={textareaRef}
        onSubmit={onSubmit}
        isValid={isValid}
        postButtonRef={postButtonRef}
        register={register}
        handleSubmit={handleSubmit}
        commentRef={commentRef}
        rest={rest}
        likePostFunction={likePostFunction}
        mutateLikePost={mutateLikePost}
        likeButtonClicked={likeButtonClicked}
        doubleClickImage={doubleClickImage}
        showPostDropdown={showPostDropdown}
        openModal={openModal}
        closeModal={closeModal}
        isMyPost={isMyPost}
        postId={postId}
        getPostError={getPostError}
        getPostLoading={getPostLoading}
      />
    </>
  );
};

export default PostContainer;
