import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { commentPost, getPost, likePost } from '../../api/api';
import MetaTag from '../../meta/MetaTag';
import PostPresenter from './PostPresenter';

type FormValues = {
  commentInput: string;
};

const PostContainer = () => {
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);

  const textareaRef = useRef(null);
  const postButtonRef = useRef(null);
  const slideRef = useRef(null);

  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  let params: any = useParams();

  const getUserPost = useQuery(['getPost', params], () =>
    getPost(params.postId),
  );

  const totalSlide = getUserPost.data?.data.postImageList.length;

  console.log(getUserPost.data?.data);

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
  } = useForm<FormValues>({ mode: 'onChange' });

  const { ref: commentRef, ...rest } = register('commentInput', {
    required: true,
  });

  const {
    mutate: commentPostMutate,
    data,
    error,
    reset,
    isLoading: commentPostIsLoading,
  } = useMutation(commentPost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('댓글 등록 성공!');
      getUserPost.refetch();
      textareaRef.current.value = '';
      textareaRef.current.focus();
    },
  });

  const onSubmit = (dataInput: any) => {
    console.log(dataInput);
    commentPostMutate({
      postId: params.postId,
      parentCommentId: '',
      content: dataInput.commentInput,
    });
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const likePostFunction = (e: any) => {
    e.preventDefault();
    if (getUserPost.data?.data.likeYn === 'Y') {
      mutateLikePost.mutate({
        postId: getUserPost.data?.data.postId,
        likeYn: 'N',
      });
    } else {
      mutateLikePost.mutate({
        postId: getUserPost.data?.data.postId,
        likeYn: 'Y',
      });
    }
  };

  const mutateLikePost = useMutation(likePost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('포스트 좋아요 성공!');
      getUserPost.refetch();
    },
  });

  useEffect(() => {
    slideRef.current.style.transition = 'all 0.5s ease-in-out';
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  }, [currentSlide]);

  const [showPostDropdown, setShowPostDropdown] = useState(false);
  const openModal = () => {
    setShowPostDropdown(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowPostDropdown(false);
    document.body.style.overflow = 'unset';
  };

  const myUserId = parseInt(localStorage.getItem('userId'));

  const isMyPost = myUserId === getUserPost.data?.data.userId;
  return (
    <>
      <MetaTag
        title={`@${getUserPost.data?.data.username} on Clonestagram: "${getUserPost.data?.data.content}"`}
        description={`${getUserPost.data?.data.followerCount} Likes, ${getUserPost.data?.data.followingCount} Comments - @${getUserPost.data?.data.username} on Clonestagram: "${getUserPost.data?.data.content}"`}
        keywords="클론코딩, 인스타그램, clone coding"
        url={`https://instagram-clone-sangwon.com/post/${params.postId}`}
        imgsrc={getUserPost.data?.data.postImageList[0]}
      />
      <PostPresenter
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        commentPostMutate={commentPostMutate}
        commentPostIsLoading={commentPostIsLoading}
        navigate={navigate}
        currentSlide={currentSlide}
        getUserPost={getUserPost}
        slideRef={slideRef}
        totalSlide={totalSlide}
        textareaRef={textareaRef}
        onSubmit={onSubmit}
        onError={onError}
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
        postId={params.postId}
      />
    </>
  );
};

export default PostContainer;
