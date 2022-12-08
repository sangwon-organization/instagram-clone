import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import styled from 'styled-components';
import { deletePost } from '../../../api/api';
import DeleteConfirmModal from './DeleteConfirmModal';
import ModalContainer from './ModalContainer';
import ModalPortal from './ModalPortal';
import SecondModalContainer from './SecondModalContainer';

const Container = styled.div<{ ismypost: boolean }>`
  width: 400px;
  height: ${({ ismypost }) => (ismypost ? '435px' : '288px')};
  background: ${({ theme }) => theme.dropDownBgColor};
  border-radius: 10px;
`;

const Button = styled.button<{ first?: boolean; last?: boolean }>`
  width: 100%;
  height: 48px;
  border: none;
  background: transparent;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.textColor};
  &:active {
    background: ${({ theme }) => theme.ultraLightGreyColor};
    border-top-left-radius: ${({ first }) => first && '10px'};
    border-top-right-radius: ${({ first }) => first && '10px'};
    border-bottom-left-radius: ${({ last }) => last && '10px'};
    border-bottom-right-radius: ${({ last }) => last && '10px'};
  }
  &:first-child {
    border-top: none;
    color: #ed4956;
    font-weight: 700;
  }
`;

interface PostDropDownModalType {
  isMyPost: boolean;
  postId: number;
  closeFristModal: any;
  setdeleteButtonClicked?: any;
}

const PostDropDownModal = ({
  isMyPost,
  postId,
  closeFristModal,
  setdeleteButtonClicked,
}: PostDropDownModalType) => {
  const {
    mutate: deletePostMutate,
    data,
    error,
    reset,
    isLoading,
  } = useMutation(deletePost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('포스트 삭제 성공!');
      console.log(e);
    },
  });
  //   deletePostMutate(postId);

  const openModal = () => {
    setdeleteButtonClicked(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setdeleteButtonClicked(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <Container ismypost={isMyPost}>
      {isMyPost ? (
        <Button first onClick={() => setdeleteButtonClicked(true)}>
          Delete
        </Button>
      ) : (
        <Button first>Report</Button>
      )}
      {isMyPost && <Button>Edit</Button>}
      {isMyPost && <Button>Unhide like count</Button>}
      {isMyPost && <Button>Turn on Commenting</Button>}
      <Button>Go to post</Button>
      <Button>Share to...</Button>
      <Button>Copy link</Button>
      <Button>Embed</Button>
      <Button last>Cancel</Button>
    </Container>
  );
};

export default PostDropDownModal;
