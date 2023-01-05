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

const CommentKebabMenuIcon = styled(GoKebabHorizontal)<{
  $showCommentMenuIcon: boolean;
}>`
  width: 15px;
  height: 15px;
  cursor: pointer;
  padding: 0;
  color: ${({ theme }) => theme.greyTextColor};
  display: ${({ $showCommentMenuIcon }) =>
    $showCommentMenuIcon ? 'block' : 'none'};
`;

const SmallHeartIcon = styled(BsHeart)`
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
  setShowPostModal,
}: CommentItemType) => {
  const [showCommentMenuIcon, setShowCommentMenuIcon] = useState(false);
  const [showCommentDropDown, setShowCommentDropDown] = useState(false);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: commentLikeMutate } = useMutation<
    ResponseData,
    AxiosError,
    LikeCommentType
  >(likeComment, {
    onError: (err) => {
      console.log('댓글 좋아요 실패!', err.response.data);
    },
    onSuccess: () => {
      console.log('댓글 좋아요 성공!');
      queryClient.invalidateQueries(['getCommentsList']);
    },
  });

  const likeCommentFunction = (likeYn: string, commentId: number) => {
    if (likeYn === 'Y') {
      commentLikeMutate({ commentId: commentId, likeYn: 'N' });
    } else {
      commentLikeMutate({ commentId: commentId, likeYn: 'Y' });
    }
  };

  return (
    <Container
      key={commentId}
      onMouseOver={() => setShowCommentMenuIcon(true)}
      onMouseOut={() => setShowCommentMenuIcon(false)}>
      <UserAvatar>
        <img
          src={profileImage}
          alt="유저아바타"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${userId}`);
            setShowPostModal(false);
            document.body.style.overflow = 'unset';
          }}
        />
      </UserAvatar>
      <Comment>
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${userId}`);
            setShowPostModal(false);
            document.body.style.overflow = 'unset';
          }}>
          {username}
        </span>
        <p>{content}</p>
        <OptionBox>
          <button>{timeForToday(createdAt)}</button>
          {likeCount > 0 && <button>{likeCount + ' like'}</button>}
          <CommentKebabMenuIcon
            onClick={() => setShowCommentDropDown(true)}
            $showCommentMenuIcon={showCommentMenuIcon}
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
          <ModalContainer closeModal={() => setShowCommentDropDown(false)}>
            <CommentDropDownModal
              commentId={commentId}
              userId={userId}
              setShowCommentDropDown={setShowCommentDropDown}
            />
          </ModalContainer>
        </ModalPortal>
      )}
    </Container>
  );
};

export default CommentItem;
