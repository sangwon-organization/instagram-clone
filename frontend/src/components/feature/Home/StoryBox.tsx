import React from 'react';
import styled from 'styled-components';
import userAvatar from '../../../assets/image/userAvatar.png';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';

const StoryBoxContainer = styled.section`
  width: 470px;
  height: 119px;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 28px;
  margin-bottom: 4px;
`;

const StoryBoxWrapper = styled.ul`
  width: 100%;
  height: 85px;
  /* border: 1px solid blue; */
  display: flex;
  gap: 0 15px;
  padding: 0 15px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StoryItem = styled.button`
  width: 64px;
  height: 84px;
  /* border: 1px solid blue; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: none;
  background: transparent;
  p {
    width: 74px;
    height: 16px;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.12px;
    /* border: 1px solid red; */
  }
`;

const UserAvatar = styled.div`
  width: 66px;
  height: 66px;
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
    width: 57px;
    height: 57px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const LeftArrowIcon = styled(IoIosArrowDropleftCircle)`
  width: 30px;
  height: 30px;
  color: #fff;
  position: absolute;
  z-index: 200;
  top: 44px;
  left: 15px;
  cursor: pointer;
`;
const RightArrowIcon = styled(IoIosArrowDroprightCircle)`
  width: 30px;
  height: 30px;
  color: #fff;
  position: absolute;
  z-index: 200;
  top: 44px;
  right: 15px;
  cursor: pointer;
`;

const StoryBox = () => {
  return (
    <StoryBoxContainer>
      <StoryBoxWrapper>
        <StoryItem>
          <LeftArrowIcon />
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <StoryItem>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <StoryItem>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <StoryItem>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <StoryItem>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <StoryItem>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <StoryItem>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <StoryItem>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <StoryItem>
          <UserAvatar>
            <img src={userAvatar} alt="유저아바타" />
          </UserAvatar>
          <p>username</p>
        </StoryItem>
        <RightArrowIcon />
      </StoryBoxWrapper>
    </StoryBoxContainer>
  );
};

export default StoryBox;
