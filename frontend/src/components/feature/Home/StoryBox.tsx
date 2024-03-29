import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';
import { useQuery } from '@tanstack/react-query';
import { getFollowingList } from '../../../api/api';

const StoryBoxContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 470px;
  height: 119px;
  margin-bottom: 4px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 10px;
  background: ${({ theme }) => theme.searchBarBgColor};
`;

const StoryBoxWrapper = styled.ul`
  display: flex;
  gap: 0 15px;
  width: 100%;
  height: 90px;
  padding: 0 15px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StoryItem = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 5px 0;
  width: 64px;
  height: 88px;
  border: none;
  background: transparent;
  p {
    width: 74px;
    height: 16px;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.12px;
    color: ${({ theme }) => theme.textColor};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const UserAvatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 66px;
  height: 66px;
  border: 2px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const LeftArrowIcon = styled(IoIosArrowDropleftCircle)`
  position: absolute;
  top: 50%;
  left: 15px;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.whiteColor};
  transform: translate3d(0, -50%, 0);
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  z-index: 200;
  cursor: pointer;
`;

const RightArrowIcon = styled(IoIosArrowDroprightCircle)`
  position: absolute;
  top: 50%;
  right: 15px;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.whiteColor};
  transform: translate3d(0, -50%, 0);
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  cursor: pointer;
  z-index: 200;
`;

const StoryBox = () => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const ref = useRef(null);

  const { data: getFollowingListData } = useQuery(['getFollowingList'], () =>
    getFollowingList({ page: 1 }),
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const getScrollState = () => {
      const element = ref.current;
      if (element.scrollWidth > element.clientWidth) {
        setShowRightArrow(true);
      }
      if (element.scrollLeft === element.scrollWidth - element.clientWidth) {
        setShowRightArrow(false);
      }
      if (element.scrollLeft !== 0) {
        setShowLeftArrow(true);
      } else {
        setShowLeftArrow(false);
      }
    };
    getScrollState();

    ref.current?.addEventListener('scroll', getScrollState);
    return () => {
      ref.current?.removeEventListener('scroll', getScrollState);
    };
  });

  const moveLeft = () => {
    ref.current.scrollBy({
      top: 0,
      left: 200,
      behavior: 'smooth',
    });
  };

  const moveRight = () => {
    ref.current.scrollBy({
      top: 0,
      left: -200,
      behavior: 'smooth',
    });
  };

  return (
    <StoryBoxContainer>
      <StoryBoxWrapper ref={ref}>
        {showLeftArrow && <LeftArrowIcon onClick={() => moveRight()} />}
        {getFollowingListData?.followingList.map(
          (list: followerImFollowingListType) => (
            <StoryItem key={list.userId}>
              <UserAvatar>
                <img src={list.profileImage} alt="유저아바타" />
              </UserAvatar>
              <p>{list.username}</p>
            </StoryItem>
          ),
        )}
        {showRightArrow && (
          <RightArrowIcon
            onClick={() => {
              moveLeft();
            }}
          />
        )}
      </StoryBoxWrapper>
    </StoryBoxContainer>
  );
};

export default StoryBox;
