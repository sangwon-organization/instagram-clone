import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { followingUser } from '../../../api/api';
import Loader from 'react-loader';
import { AxiosError } from 'axios';

const SuggestionsItem = styled.div<{ followbuttonclicked: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 8px 0 8px 3px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  button {
    position: relative;
    width: 38px;
    height: 16px;
    border: none;
    background: transparent;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme, followbuttonclicked }) =>
      followbuttonclicked ? theme.textColor : theme.buttonColor};
  }
`;

const ItemUserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px 0;
  width: 209px;
  height: 30px;

  p:nth-child(1) {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
  p:nth-child(2) {
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const SugesstionItem = ({ list }: SugesstionItemType) => {
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
    <SuggestionsItem
      key={list.userId}
      followbuttonclicked={followButtonClicked}>
      <img
        src={list.profileImage}
        alt="유저아바타"
        onClick={() => navigate(`/user/${list.userId}`)}
      />
      <ItemUserInfoWrapper>
        <p onClick={() => navigate(`/user/${list.userId}`)}>{list.username}</p>
        <p>Suggested for you</p>
      </ItemUserInfoWrapper>
      <button
        onClick={() => {
          userFollowingUnFollowing(list.userId);
          setFollowButtonClicked((prev) => !prev);
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
      </button>
    </SuggestionsItem>
  );
};

export default SugesstionItem;
