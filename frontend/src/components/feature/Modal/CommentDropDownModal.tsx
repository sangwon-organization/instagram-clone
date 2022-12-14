import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import styled from 'styled-components';
import { deleteComment } from '../../../api/api';

const Container = styled.div<{
  ismypost: boolean;
}>`
  width: 400px;
  height: fit-content;
  background: ${({ theme }) => theme.dropDownBgColor};
  border-radius: 10px;
`;

const Button = styled.button<{
  first?: boolean;
  last?: boolean;
  redColor?: boolean;
}>`
  width: 100%;
  height: 48px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  background: transparent;
  font-size: 14px;
  font-weight: ${({ redColor }) => (redColor ? 700 : 400)};
  color: ${({ theme, redColor }) =>
    redColor ? theme.errorColor : theme.textColor};
  &:active {
    border-top-left-radius: ${({ first }) => first && '10px'};
    border-top-right-radius: ${({ first }) => first && '10px'};
    border-bottom-left-radius: ${({ last }) => last && '10px'};
    border-bottom-right-radius: ${({ last }) => last && '10px'};
    backdrop-filter: brightness(0.9);
  }
  &:first-child {
    border-top: none;
  }
`;

const CommentDropDownModal = ({
  commentId,
  userId,
  setShowCommentDropDown,
}: CommentDropDownModalType) => {
  const isMyPost = userId === parseInt(localStorage.getItem('userId'));

  const queryClient = useQueryClient();

  const { mutate: commentDeleteMutate } = useMutation<
    ResponseData,
    AxiosError,
    DeleteCommentType
  >(deleteComment, {
    onError: (err) => {
      console.log('댓글 삭제 실패!', err.response.data);
    },
    onSuccess: () => {
      console.log('댓글 삭제 성공!');
      Promise.all([
        queryClient.invalidateQueries(['getCommentsList']),
        queryClient.invalidateQueries(['getUserInformation']),
      ]);
    },
  });

  return (
    <Container ismypost={isMyPost}>
      <Button first redColor>
        Report
      </Button>
      {isMyPost && (
        <Button
          redColor
          onClick={() => {
            commentDeleteMutate({ commentId: commentId });
          }}>
          Delete
        </Button>
      )}
      <Button last onClick={() => setShowCommentDropDown(false)}>
        Cancel
      </Button>
    </Container>
  );
};

export default CommentDropDownModal;
