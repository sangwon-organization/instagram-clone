import React, { useState } from 'react';
import styled from 'styled-components';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCommentsList, likeComment } from '../../../api/api';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: fit-content;
  margin: 0 10px 10px 10px;
  font-size: 14px;
  font-weight: 400;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 5px;
  div {
    width: fit-content;
    height: fit-content;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
  p {
    width: 340px;
    height: fit-content;
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
    span {
      width: fit-content;
      height: fit-content;
      margin-right: 5px;
      color: ${({ theme }) => theme.hashTagColor};
      cursor: pointer;
    }
  }
`;

const SmallHeartIcon = styled(BsHeart)`
  width: 10px;
  height: 10px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const ColoredHeartIcon = styled(BsHeartFill)<{ likebuttonclicked: string }>`
  width: 10px;
  height: 10px;
  color: ${({ theme }) => theme.errorColor};
  cursor: pointer;
  animation: ${({ likebuttonclicked }) =>
    likebuttonclicked === 'Y' ? 'likeHeart 1s ease-in-out' : ''};
  @keyframes likeHeart {
    0% {
      transform: scale(1);
    }
    15% {
      transform: scale(1.2);
    }
    30% {
      transform: scale(0.95);
    }
    45%,
    80% {
      transform: scale(1);
    }
  }
`;

interface CommentsListBoxType {
  postId: number;
}

const CommentsListBox = ({ postId }: CommentsListBoxType) => {
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);

  const getCommentsListQuery = useQuery(['getCommentsList', postId], () =>
    getCommentsList({ page: 1, postId: postId }),
  );

  const { mutate: commentLikeMutate, isLoading: commentLikeIsLoading } =
    useMutation(likeComment, {
      onError: (err: any) => {
        console.log(err.response.data);
      },
      onSuccess: (e: any) => {
        console.log('댓글 좋아요 성공!');
        getCommentsListQuery.refetch();
      },
    });

  const likeCommentFunction = (commentId: number) => {
    if (getCommentsListQuery.data?.data.commentList[0].likeYn === 'Y') {
      commentLikeMutate({ commentId: commentId, likeYn: 'N' });
    } else {
      commentLikeMutate({ commentId: commentId, likeYn: 'Y' });
    }
  };

  // console.log(getCommentsListQuery.data?.data);
  return (
    <>
      {getCommentsListQuery.data?.data.commentList.length > 0 && (
        <Container>
          <Wrapper>
            <div>{getCommentsListQuery.data?.data.commentList[0].username}</div>
            <p>{getCommentsListQuery.data?.data.commentList[0].content}</p>
          </Wrapper>
          {getCommentsListQuery.data?.data.commentList[0].likeYn === 'Y' ? (
            <ColoredHeartIcon
              likebuttonclicked={
                getCommentsListQuery.data?.data.commentList[0].likeYn
              }
              onClick={() =>
                likeCommentFunction(
                  getCommentsListQuery.data?.data.commentList[0].commentId,
                )
              }
            />
          ) : (
            <SmallHeartIcon
              onClick={() =>
                likeCommentFunction(
                  getCommentsListQuery.data?.data.commentList[0].commentId,
                )
              }
            />
          )}
        </Container>
      )}
    </>
  );
};

export default CommentsListBox;
