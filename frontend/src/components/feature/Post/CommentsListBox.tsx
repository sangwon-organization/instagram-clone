import React, { useState } from 'react';
import styled from 'styled-components';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCommentsList, likeComment } from '../../../api/api';
import { AxiosError } from 'axios';

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
  width: 95%;
  height: fit-content;
  word-break: break-all;
  white-space: pre-wrap;
  span:first-child {
    float: left;
    width: fit-content;
    height: fit-content;
    margin-right: 5px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
  p {
    display: inline;
    height: fit-content;
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
  }
  button {
    display: inline-block;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
    cursor: pointer;
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

const CommentsListBox = ({
  postId,
  getCommentsListData,
}: CommentsListBoxType) => {
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);
  const [showMoreText, setShowMoreText] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: commentLikeMutate, isLoading: commentLikeIsLoading } =
    useMutation<ResponseData, AxiosError, LikeCommentType>(likeComment, {
      onError: (err) => {
        console.log('댓글 좋아요 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('댓글 좋아요 성공!');
        queryClient.invalidateQueries(['getCommentsList']);
      },
    });

  const likeCommentFunction = (commentId: number) => {
    if (getCommentsListData?.commentList[0].likeYn === 'Y') {
      commentLikeMutate({ commentId: commentId, likeYn: 'N' });
    } else {
      commentLikeMutate({ commentId: commentId, likeYn: 'Y' });
    }
  };

  // console.log(getCommentsListQuery.data?.data);
  return (
    <>
      {getCommentsListData?.commentList.length > 0 && (
        <Container>
          <Wrapper>
            <span>{getCommentsListData?.commentList[0].username}</span>
            <p>
              {' '}
              {showMoreText
                ? getCommentsListData?.commentList[0].content
                : getCommentsListData?.commentList[0].content.substring(0, 30)}
            </p>
            {getCommentsListData?.commentList[0].content.length > 30 &&
              !showMoreText && (
                <span>
                  ...
                  <button onClick={() => setShowMoreText(true)}>more</button>
                </span>
              )}
          </Wrapper>
          {getCommentsListData?.commentList[0].likeYn === 'Y' ? (
            <ColoredHeartIcon
              likebuttonclicked={getCommentsListData?.commentList[0].likeYn}
              onClick={() =>
                likeCommentFunction(
                  getCommentsListData?.commentList[0].commentId,
                )
              }
            />
          ) : (
            <SmallHeartIcon
              onClick={() =>
                likeCommentFunction(
                  getCommentsListData?.commentList[0].commentId,
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
