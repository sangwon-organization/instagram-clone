import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { GoKebabHorizontal } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { likeComment } from '../../../api/api';
import { timeForToday } from '../../../utils/commons';
import CommentDropDownModal from '../Modal/CommentDropDownModal';
import ModalContainer from '../Modal/ModalContainer';
import ModalPortal from '../Modal/ModalPortal';

const Container = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0 10px;
  padding: 10px 0;
`;

const AvatarBox = styled.div`
  /* border: 1px solid red; */
`;

const Comment = styled.div`
  width: 80%;
  height: fit-content;
  margin-top: 5px;
  line-height: 18px;
  white-space: pre-wrap;
  word-break: break-all;
  span {
    float: left;
    margin-right: 5px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.greyTextColor};
    }
  }
  p {
    color: ${({ theme }) => theme.textColor};
    font-size: 14px;
    font-weight: 400;
  }
`;

const OptionBox = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 10px;
  button {
    font-size: 12px;
    font-weight: 400;
    padding: 0;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const CommentKebabMenuIcon = styled(GoKebabHorizontal)<{
  showCommentMenuIcon: boolean;
}>`
  width: 15px;
  height: 15px;
  cursor: pointer;
  padding: 0;
  color: ${({ theme }) => theme.greyTextColor};
  display: ${({ showCommentMenuIcon }) =>
    showCommentMenuIcon ? 'block' : 'none'};
`;

const SmallHeartIcon = styled(BsHeart)`
  /* width: 15px; */
  /* height: 15px; */
  font-size: 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
  margin-top: 15px;
`;

const ColoredSmallHeartIcon = styled(BsHeartFill)<{
  likebuttonclicked: string;
}>`
  /* width: 23px; */
  /* height: 23px; */
  font-size: 12px;
  color: #ed4956;
  cursor: pointer;
  margin-top: 15px;
  animation: ${({ likebuttonclicked }) =>
    likebuttonclicked === 'Y' ? 'commentLike 1s ease-in-out' : ''};
  @keyframes commentLike {
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

const CommentItem = ({
  profileImage,
  username,
  content,
  likeCount,
  commentId,
  createdAt,
  likeYn,
  userId,
}: CommentItemType) => {
  const [showCommentMenuIcon, setShowCommentMenuIcon] = useState(false);
  const [showCommentDropDown, setShowCommentDropDown] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: commentLikeMutate, isLoading: commentLikeIsLoading } =
    useMutation<ResponseData, AxiosError, LikeCommentType>(likeComment, {
      onError: (err) => {
        console.log('댓글 좋아요 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('댓글 좋아요 성공!');
        queryClient.invalidateQueries(['getPost']);
      },
    });

  const likeCommentFunction = (likeYn: string, commentId: number) => {
    if (likeYn === 'Y') {
      commentLikeMutate({ commentId: commentId, likeYn: 'N' });
    } else {
      commentLikeMutate({ commentId: commentId, likeYn: 'Y' });
    }
  };

  const openModal = () => {
    setShowCommentDropDown(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowCommentDropDown(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <Container
      key={commentId}
      onMouseOver={() => setShowCommentMenuIcon(true)}
      onMouseOut={() => setShowCommentMenuIcon(false)}>
      <AvatarBox>
        <UserAvatar>
          <img src={profileImage} alt="유저아바타" />
        </UserAvatar>
      </AvatarBox>
      <Comment>
        <span
          onClick={() => {
            navigate(`/user/${userId}`);
            closeModal();
          }}>
          {username}
        </span>
        <p>{content}</p>
        <OptionBox>
          <button>{timeForToday(createdAt)}</button>
          {likeCount > 0 && <button>{likeCount + ' like'}</button>}
          <CommentKebabMenuIcon
            onClick={openModal}
            showCommentMenuIcon={showCommentMenuIcon}
          />
        </OptionBox>
      </Comment>
      {likeYn === 'Y' ? (
        <ColoredSmallHeartIcon
          likebuttonclicked={likeYn}
          onClick={() => likeCommentFunction(likeYn, commentId)}
        />
      ) : (
        <SmallHeartIcon
          onClick={() => likeCommentFunction(likeYn, commentId)}
        />
      )}
      {showCommentDropDown && (
        <ModalPortal>
          <ModalContainer closeModal={closeModal}>
            <CommentDropDownModal commentId={commentId} userId={userId} />
          </ModalContainer>
        </ModalPortal>
      )}
    </Container>
  );
};

export default CommentItem;
