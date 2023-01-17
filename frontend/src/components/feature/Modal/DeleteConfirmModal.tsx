import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { deletePost } from '../../../api/api';

const Container = styled.div`
  width: 400px;
  height: 201px;
  border-radius: 10px;
  background: ${({ theme }) => theme.dropDownBgColor};
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px 0;
  width: 400px;
  height: 107px;
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;
const Button = styled.button<{ last?: boolean }>`
  width: 100%;
  height: 47px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.textColor};
  &:active {
    border-bottom-left-radius: ${({ last }) => last && '10px'};
    border-bottom-right-radius: ${({ last }) => last && '10px'};
    backdrop-filter: brightness(0.9);
  }
  &:nth-child(2) {
    color: #ed4956;
    font-weight: 700;
  }
`;

const DeleteConfirmModal = ({
  postId,
  userId,
  closeModal,
}: DeleteConfirmModalType) => {
  const navigate = useNavigate();

  const location = useLocation();

  const queryClient = useQueryClient();

  const { mutate: deletePostMutate } = useMutation<
    ResponseData,
    AxiosError,
    number
  >(deletePost, {
    onError: (err) => {
      console.log('포스트 삭제 실패!', err.response.data);
    },
    onSuccess: () => {
      console.log('포스트 삭제 성공!');
      if (location.pathname === '/') {
        closeModal();
        queryClient.invalidateQueries(['getPosts']);
      } else if (
        location.pathname === `/post/${postId}` ||
        location.pathname === `/user/${userId}`
      ) {
        navigate(-1);
        document.body.style.overflow = 'unset';
        queryClient.invalidateQueries(['getUserInformation']);
      }
    },
  });

  return (
    <Container>
      <Title>
        <h3>Delete post?</h3>
        <p>Are you sure you want to delete this post?</p>
      </Title>
      <Button onClick={() => deletePostMutate(postId)}>Delete</Button>
      <Button last onClick={closeModal}>
        Cancel
      </Button>
    </Container>
  );
};

export default DeleteConfirmModal;
