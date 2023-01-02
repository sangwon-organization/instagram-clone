import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { followingUser } from '../../../api/api';
import Loader from 'react-loader';

const UserAvatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /* background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, red 0%, orange 100%); */
  /* background-origin: border-box;
  background-clip: content-box, border-box; */
  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const SuggestionItem = styled.div`
  width: 100%;
  height: 60px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;

const UserInfo = styled.div`
  width: 288px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  div:first-child {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
  div {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const FollowButton = styled.button<{ followbuttonclicked: boolean }>`
  width: fit-content;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, followbuttonclicked }) =>
    followbuttonclicked ? theme.textColor : theme.whiteColor};
  background-color: ${({ theme, followbuttonclicked }) =>
    followbuttonclicked ? theme.ultraLightGreyColor : theme.buttonColor};
  outline: none;
  border: none;
  border-radius: 8px;
  position: relative;
  &:hover {
    background: ${({ followbuttonclicked }) =>
      followbuttonclicked ? '#dbdbdb' : '#1877f2'};
  }
  &:active {
    filter: brightness(0.8);
  }
`;

const AllSugesstionsListItem = ({
  list,
  setShowGetStarted,
}: {
  list: any;
  setShowGetStarted: any;
}) => {
  const navigate = useNavigate();
  const [followButtonClicked, setFollowButtonClicked] = useState(false);

  const userFollowingUnFollowing = (userId: number) => {
    if (followButtonClicked) {
      followingUserMutate({
        followUserId: userId,
        followYn: 'N',
      });
    } else {
      followingUserMutate({
        followUserId: userId,
        followYn: 'Y',
      });
    }
  };

  const { mutate: followingUserMutate, isLoading: followingUserIsLoading } =
    useMutation<ResponseData, AxiosError, FollowingUserType>(followingUser, {
      onError: (err) => {
        console.log('유저 팔로우/언팔로우 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('유저 팔로우/언팔로우 성공!');
      },
    });
  return (
    <SuggestionItem>
      <UserAvatar>
        <img
          src={list.profileImage}
          alt="유저아바타"
          onClick={() => navigate(`/user/${list.userId}`)}
        />
      </UserAvatar>
      <UserInfo>
        <div onClick={() => navigate(`/user/${list.userId}`)}>
          {list.username}
        </div>
        <div>{list.name}</div>
        <p>Suggested for you</p>
      </UserInfo>
      <FollowButton
        followbuttonclicked={followButtonClicked}
        onClick={() => {
          userFollowingUnFollowing(list.userId);
          setFollowButtonClicked((prev) => !prev);
          setShowGetStarted(true);
        }}>
        {followingUserIsLoading ? (
          <Loader
            loaded={!followingUserIsLoading}
            color="#8e8e8e"
            scale={0.5}
            top="50%"
            left="50%"
          />
        ) : followButtonClicked ? (
          'Following'
        ) : (
          'Follow'
        )}
      </FollowButton>
    </SuggestionItem>
  );
};

export default AllSugesstionsListItem;
