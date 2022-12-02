import React, { useState } from 'react';
import styled from 'styled-components';
import { BsHeartFill } from 'react-icons/bs';
import { IoChatbubble } from 'react-icons/io5';
import userImage from '../../../assets/image/userImage.png';
import { useNavigate } from 'react-router-dom';
import { IoIosPhotos } from 'react-icons/io';

const PostContainer = styled.div`
  width: 293px;
  height: 293px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  position: relative;
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

const ImagesIcon = styled(IoIosPhotos)`
  color: #fff;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
`;

interface PostType {
  postImageList: string[];
  postId: number;
  likeCount: number;
  commentCount: number;
}

const Post = ({ postImageList, postId, likeCount, commentCount }: PostType) => {
  const [postHover, setPostHover] = useState(false);

  const navigate = useNavigate();
  return (
    <PostContainer
      onMouseOver={() => setPostHover(true)}
      onMouseOut={() => setPostHover(false)}
      onClick={() => navigate(`/post/${postId}`)}>
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
    </PostContainer>
  );
};

export default Post;
