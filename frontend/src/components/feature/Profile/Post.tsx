import React, { useState } from 'react';
import styled from 'styled-components';
import { BsHeartFill } from 'react-icons/bs';
import { IoChatbubble } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { IoIosPhotos } from 'react-icons/io';
import ModalPortal from '../Modal/ModalPortal';
import ModalContainer from '../Modal/ModalContainer';
import PostWrapper from '../Post/PostWrapper';

const PostContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 293px;
  height: 293px;
  cursor: pointer;
  aspect-ratio: 1/1;
  img {
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.blackColor};
    object-fit: cover;
    &:hover {
      filter: brightness(0.7);
    }
    &:active {
      opacity: 0.7;
    }
  }
`;

const LikeAndCommentWrapper = styled.div<{ postHover: boolean }>`
  display: ${({ postHover }) => (postHover ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 230px;
  height: fit-content;
`;

const ItemBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: fit-content;
  p {
    color: ${({ theme }) => theme.whiteColor};
    font-size: 16px;
    font-weight: 600;
  }
`;

const HeartIcon = styled(BsHeartFill)`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  color: ${({ theme }) => theme.whiteColor};
`;

const CommentIcon = styled(IoChatbubble)`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  color: ${({ theme }) => theme.whiteColor};
`;

const ImagesIcon = styled(IoIosPhotos)`
  color: ${({ theme }) => theme.whiteColor};
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
`;

const Post = ({
  postImageList,
  postId,
  likeCount,
  commentCount,
  userId,
}: PostType) => {
  const [postHover, setPostHover] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const navigate = useNavigate();

  const openPost = () => {
    setShowPostModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePost = () => {
    setShowPostModal(false);
    document.body.style.overflow = 'unset';
    navigate(`/user/${userId}`);
  };

  return (
    <PostContainer
      onMouseOver={() => setPostHover(true)}
      onMouseOut={() => setPostHover(false)}
      onClick={() => {
        window.history.pushState('', '', `/post/${postId}`);
        openPost();
      }}>
      {postImageList.length > 1 ? <ImagesIcon /> : null}
      <img src={postImageList[0]} alt="포스트" />
      <LikeAndCommentWrapper postHover={postHover}>
        <ItemBox>
          <HeartIcon />
          <p>{likeCount}</p>
        </ItemBox>
        <ItemBox>
          <CommentIcon />
          <p>{commentCount}</p>
        </ItemBox>
      </LikeAndCommentWrapper>
      {showPostModal && (
        <ModalPortal>
          <ModalContainer closeIcon closeModal={closePost}>
            <PostWrapper postId={postId} setShowPostModal={setShowPostModal} />
          </ModalContainer>
        </ModalPortal>
      )}
    </PostContainer>
  );
};

export default Post;
