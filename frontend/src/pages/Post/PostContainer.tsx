import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { commentPost, getPost } from '../../api/api';
import PostPresenter from './PostPresenter';

type FormValues = {
  content: string;
};

const PostContainer = () => {
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

  const isDisabled = (e: any) => {
    if (e.target.value === '') {
      postButtonRef.current.disabled = true;
    } else {
      postButtonRef.current.disabled = false;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<FormValues>({ mode: 'onSubmit' });

  const registerComment = (e: any) => {
    e.preventDefault();
    commentPostMutate({
      postId: params.postId,
      parentCommentId: '',
      content: textareaRef.current.value,
    });
    if (commentPostIsLoading) {
      postButtonRef.current.disabled = true;
    }
  };

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
      textareaRef.current.value = '';
      textareaRef.current.focus();
    },
  });

  const onSubmit = (dataInput: any) => {
    console.log(dataInput);
    // console.log(data);
    commentPostMutate({
      postId: params.postId,
      parentCommentId: '',
      content: dataInput.content,
    });
  };

  const onError = (err: any) => {
    console.log(err);
  };

  useEffect(() => {
    slideRef.current.style.transition = 'all 0.5s ease-in-out';
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  }, [currentSlide]);
  return (
    <>
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
      />
    </>
  );
};

export default PostContainer;
