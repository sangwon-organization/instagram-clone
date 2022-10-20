import React from 'react';
import styled from 'styled-components';
import userAvatar from '../../../assets/image/userAvatar.png';
import userImage from '../../../assets/image/userImage.png';
import { FiHeart } from 'react-icons/fi';
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
    width: 368px;
    font-size: 14px;
    font-weight: 600;
  }
`;

const ImageBoxWrapper = styled.div`
  width: 100%;
  height: 587.5px;
  background-image: url('../../../assets/image/userImage.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background: grey;
`;

const CommentBoxWrapper = styled.div`
  width: 100%;
  height: 291px;
`;

const UserAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
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

const HeartIcon = styled(FiHeart)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  &:active {
    color: grey;
  }
`;

const SmallHeartIcon = styled(FiHeart)`
  width: 10px;
  height: 10px;
  cursor: pointer;
  &:hover {
    color: grey;
  }
`;

const ChatIcon = styled(RiChat3Line)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  &:active {
    color: grey;
  }
`;

const LocationIcon = styled(TbLocation)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  &:active {
    color: grey;
  }
`;

const BookmarkIcon = styled(BiBookmark)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  &:active {
    color: grey;
  }
`;

const LikedMemberBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 14px;
  font-weight: 600;
  padding: 0 10px 10px 10px;
`;
const FeedDescriptionBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 14px;
  font-weight: 600;
  padding: 0 10px 10px 10px;
`;
const ViewAllCommentsBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 14px;
  font-weight: 400;
  color: grey;
  padding: 0 10px 10px 10px;
`;
const CommentsListBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 14px;
  font-weight: 400;
  color: grey;
  padding: 0 10px 10px 10px;
`;
const DateBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 14px;
  font-weight: 400;
  color: grey;
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
    height: fit-content;
    border: none;
    resize: none;
    outline: none;
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
`;

const KebabMenuIcon = styled(GoKebabHorizontal)`
  width: 20px;
  height: 20px;
`;
const FeedCard = () => {
  return (
    <FeedCardContainer>
      <UserInformationWrapper>
        <UserAvatar>
          <img src={userAvatar} alt="유저아바타" />
        </UserAvatar>
        <p>ggumtalkhead</p>
        <KebabMenuIcon />
      </UserInformationWrapper>
      <ImageBoxWrapper></ImageBoxWrapper>
      <CommentBoxWrapper>
        <IconBox>
          <LeftIconBox>
            <HeartIcon />
            <ChatIcon />
            <LocationIcon />
          </LeftIconBox>
          <BookmarkIcon />
        </IconBox>
        <LikedMemberBox>5,960 likes</LikedMemberBox>
        <FeedDescriptionBox>
          ggumtalkhead 자신감이 떨어진다면.... more
        </FeedDescriptionBox>
        <ViewAllCommentsBox>View all 300 comments</ViewAllCommentsBox>
        <CommentsListBox>
          <p>ggumtalkhead @minimal__0 정답...ㅋㅋㅋ 순서가 바뀔 수도 있음!</p>
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
