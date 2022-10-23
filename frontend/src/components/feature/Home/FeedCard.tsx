import React, { useState } from 'react';
import styled from 'styled-components';
import userAvatar from '../../../assets/image/userAvatar.png';
import userImage from '../../../assets/image/userImage.png';
import { BsHeart } from 'react-icons/bs';
import { BsHeartFill } from 'react-icons/bs';
import { RiChat3Line } from 'react-icons/ri';
import { TbLocation } from 'react-icons/tb';
import { BiBookmark } from 'react-icons/bi';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { GoKebabHorizontal } from 'react-icons/go';

const FeedCardContainer = styled.div`
  width: 470px;
  height: 855px;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background: #fff;
`;

const UserInformationWrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  p {
    width: fit-content;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const UserInfo = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 10px;
`;

const ImageBoxWrapper = styled.div`
  width: 100%;
  height: 587.5px;
  background-image: url('../../../assets/image/userImage.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background: grey;
  position: relative;
`;

const CommentBoxWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;

const UserAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const IconBox = styled.div`
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`;

const LeftIconBox = styled.div`
  width: 100px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeartIcon = styled(BsHeart)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  &:hover {
    color: grey;
  }
`;

const ColoredHeartIcon = styled(BsHeartFill)<{ likeButtonClicked: boolean }>`
  width: 23px;
  height: 23px;
  color: #ed4956;
  cursor: pointer;
  animation: ${({ likeButtonClicked }) =>
    likeButtonClicked ? 'pop 0.2s linear' : ''};
  @keyframes pop {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
    }
  }
`;

const SmallHeartIcon = styled(BsHeart)`
  width: 10px;
  height: 10px;
  cursor: pointer;
  color: #262626;
  &:hover {
    color: #8e8e8e;
  }
`;

const ChatIcon = styled(RiChat3Line)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  &:hover {
    color: grey;
  }
`;

const LocationIcon = styled(TbLocation)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  &:hover {
    color: grey;
  }
`;

const BookmarkIcon = styled(BiBookmark)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  &:hover {
    color: grey;
  }
`;

const LikedMemberBox = styled.div`
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  font-weight: 600;
  margin: 0 10px 10px 10px;
  cursor: pointer;
`;
const FeedDescriptionBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 14px;
  font-weight: 600;
  margin: 0 10px 10px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 5px;
  div {
    font-size: 14px;
    font-weight: 600;
    color: #262626;
    cursor: pointer;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }
  button {
    font-size: 14px;
    font-weight: 400;
    color: #8e8e8e;
    border: none;
    background: transparent;
  }
`;
const ViewAllCommentsBox = styled.div`
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  font-weight: 400;
  color: #8e8e8e;
  margin: 0 10px 10px 10px;
  cursor: pointer;
`;
const CommentsListBox = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  font-weight: 400;
  margin: 0 10px 10px 10px;
  /* border: 1px solid red; */
`;

const CommentText = styled.div`
  display: flex;
  gap: 0 5px;
  justify-content: flex-start;
  align-items: center;
  /* border: 1px solid blue; */
  div {
    width: fit-content;
    height: fit-content;
    font-size: 14px;
    font-weight: 600;
    color: #262626;
    cursor: pointer;
  }
  p {
    width: 340px;
    height: fit-content;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    span {
      width: fit-content;
      height: fit-content;
      margin-right: 5px;
      color: #00376b;
      cursor: pointer;
    }
  }
`;
const DateBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 10px;
  font-weight: 400;
  color: #8e8e8e;
  padding: 0 10px 10px 10px;
`;

const AddCommentBox = styled.form`
  width: 100%;
  height: fit-content;
  border-top: 1px solid #dbdbdb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  textarea {
    width: 375px;
    height: 20px;
    border: none;
    resize: none;
    outline: none;
    margin-left: 10px;
  }
  button {
    font-size: 14px;
    font-weight: 600;
    color: #0095f6;
    background: transparent;
    border: none;
  }
`;

const SmileIcon = styled(HiOutlineEmojiHappy)`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const KebabMenuIcon = styled(GoKebabHorizontal)`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const BigLikedIcon = styled(BsHeartFill)<{ likeButtonClicked: boolean }>`
  width: 80px;
  height: 80px;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  filter: drop-shadow(5px 5px 30px rgba(0, 0, 0, 0.7));
  opacity: 0.7;
  animation: ${({ likeButtonClicked }) =>
    likeButtonClicked && 'popIcon 0.2s linear 0s 1 alternate'};
  @keyframes popIcon {
    0% {
      transform: scale(0.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;
const FeedCard = () => {
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);

  // const likeDoubleClicked = () => {
  //   setTimeout(() => {
  //     heart.classList.remove('animate-like');
  //   }, 800);
  // }
  return (
    <FeedCardContainer>
      <UserInformationWrapper>
        <UserInfo>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>ggumtalkhead</p>
        </UserInfo>
        <KebabMenuIcon />
      </UserInformationWrapper>
      <ImageBoxWrapper onDoubleClick={() => setLikeButtonClicked(true)}>
        <BigLikedIcon likeButtonClicked={likeButtonClicked} />
      </ImageBoxWrapper>
      <CommentBoxWrapper>
        <IconBox>
          <LeftIconBox>
            {likeButtonClicked ? (
              <ColoredHeartIcon
                likeButtonClicked={likeButtonClicked}
                onClick={() => {
                  setLikeButtonClicked((prev) => !prev);
                }}
              />
            ) : (
              <HeartIcon
                onClick={() => {
                  setLikeButtonClicked((prev) => !prev);
                }}
              />
            )}
            <ChatIcon />
            <LocationIcon />
          </LeftIconBox>
          <BookmarkIcon />
        </IconBox>
        <LikedMemberBox>5,960 likes</LikedMemberBox>
        <FeedDescriptionBox>
          <div>ggumtalkhead</div>
          <span> 자신감이 떨어진다면....</span>
          <button>more</button>
        </FeedDescriptionBox>
        <ViewAllCommentsBox>View all 300 comments</ViewAllCommentsBox>
        <CommentsListBox>
          <CommentText>
            <div>ggumtalkhead</div>
            <p>
              <span>@minimal__0</span>정답...ㅋㅋㅋ 순서가 바뀔 수도 있음!
            </p>
          </CommentText>
          <SmallHeartIcon />
        </CommentsListBox>
        <DateBox>1 DAY AGO</DateBox>
      </CommentBoxWrapper>
      <AddCommentBox>
        <SmileIcon />
        <textarea name="" id="" placeholder="Add a comment..."></textarea>
        <button>Post</button>
      </AddCommentBox>
    </FeedCardContainer>
  );
};

export default FeedCard;
