import React, { useState } from 'react';
import styled from 'styled-components';
import { BsHeartFill } from 'react-icons/bs';
import { IoChatbubble } from 'react-icons/io5';
import userImage from '../../../assets/image/userImage.png';

const PostContainer = styled.div`
  width: 293px;
  height: 293px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  img {
    width: 293px;
    height: 293px;
    object-fit: contain;
    background: black;
    &:hover {
      filter: brightness(0.7);
    }
    &:active {
      opacity: 0.7;
    }
  }
`;

const LikeAndCommentWrapper = styled.div<{ postHover: boolean }>`
  width: 230px;
  height: fit-content;
  display: ${({ postHover }) => (postHover ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  position: absolute;
`;
const HeartIcon = styled(BsHeartFill)`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  color: #fff;
`;

const CommentIcon = styled(IoChatbubble)`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  color: #fff;
`;

const ItemBox = styled.div`
  width: 100px;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }
`;

const Post = () => {
  const [postHover, setPostHover] = useState(false);
  return (
    <PostContainer
      onMouseOver={() => setPostHover(true)}
      onMouseOut={() => setPostHover(false)}>
      <img src={userImage} alt="포스트" />
      <LikeAndCommentWrapper postHover={postHover}>
        <ItemBox>
          <HeartIcon />
          <p>28.2K</p>
        </ItemBox>
        <ItemBox>
          <CommentIcon />
          <p>3,146</p>
        </ItemBox>
      </LikeAndCommentWrapper>
    </PostContainer>
  );
};

export default Post;
