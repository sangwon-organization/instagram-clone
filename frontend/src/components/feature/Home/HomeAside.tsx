import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  followingUser,
  getNotFollowingList,
  getUserInformation,
} from '../../../api/api';
import Loader from 'react-loader';

const HomeAsideContainer = styled.aside`
  width: 319px;
  height: 984px;
  margin-top: 55px;
`;

const UserAccountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 319px;
  height: 56px;
  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    cursor: pointer;
  }
  button {
    width: 40px;
    height: 16px;
    border: none;
    background: transparent;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.buttonColor};
  }
`;

const UserInfoWrapper = styled.div`
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
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const SuggestionsWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;

const SuggestionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 19px;
  margin-top: 8px;
  p {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.greyTextColor};
  }
  button {
    padding: 0;
    border: none;
    background: transparent;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
`;

const SuggestionsItem = styled.div`
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
    color: ${({ theme }) => theme.buttonColor};
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

const AsideFooter = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 250px;
  height: 74.5px;
  margin-top: 30px;
`;

const FooterItems = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.footerTextColor};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
    &::after {
      content: '∙';
    }
    &:last-child::after {
      content: '';
    }
  }
`;

const Copyright = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.footerTextColor};
`;

const HomeAside = () => {
  const navigate = useNavigate();
  // const [isFollowing, setIsFollowing] = useState();

  const getNotFollowingListQuery = useQuery(
    ['getNotFollowingList'],
    () => getNotFollowingList(),
    { refetchOnWindowFocus: false },
  );

  const { data: getUserInformData } = useQuery(['getUserInform'], () => {
    const userId = Number(localStorage.getItem('userId'));
    return getUserInformation({ targetUserId: userId });
  });

  const userId = localStorage.getItem('userId');

  const userFollowingUnFollowing = (userId: number) => {
    // e.preventDefault();
    if (getNotFollowingListQuery.data?.data.followYn === 'Y') {
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
    useMutation(
      // ['followingMutate', getNotFollowingListQuery.data?.data.userId],
      followingUser,
      {
        onError: (err: any) => {
          console.log(err.response.data);
        },
        onSuccess: (e: any) => {
          console.log('유저 팔로우/언팔로우 성공!');
        },
      },
    );

  // const toggleIsFollowing = () => {
  //   const [isFollowing, setIsFollowing] = useState(false);
  //   setIsFollowing((prev) => !prev);

  // };

  return (
    <HomeAsideContainer>
      <UserAccountWrapper>
        <img
          src={getUserInformData?.data.profileImage}
          alt="유저아바타"
          onClick={() => navigate(`/user/${userId}`)}
        />
        <UserInfoWrapper>
          <p onClick={() => navigate(`/user/${userId}`)}>
            {getUserInformData?.data.username}
          </p>
          <p>{getUserInformData?.data.name}</p>
        </UserInfoWrapper>
        <button>Switch</button>
      </UserAccountWrapper>
      <SuggestionsWrapper>
        <SuggestionsHeader>
          <p>Suggestions For You</p>
          <button>See All</button>
        </SuggestionsHeader>
        {getNotFollowingListQuery.data?.data.followingList.map((list: any) => (
          <SuggestionsItem key={list.userId}>
            <img src={list.profileImage} alt="유저아바타" />
            <ItemUserInfoWrapper>
              <p onClick={() => navigate(`/user/${list.userId}`)}>
                {list.username}
              </p>
              <p>Suggested for you</p>
            </ItemUserInfoWrapper>
            <button onClick={() => userFollowingUnFollowing(list.userId)}>
              {followingUserIsLoading ? (
                <Loader
                  loaded={!followingUserIsLoading}
                  color="#000"
                  scale={0.5}
                  top="50%"
                  left="50%"
                />
              ) : list.followYn ? (
                'Follow'
              ) : (
                'Following'
              )}
            </button>
          </SuggestionsItem>
        ))}
      </SuggestionsWrapper>
      <AsideFooter>
        <FooterItems>
          <li>About</li>
          <li>Help</li>
          <li>Press</li>
          <li>API</li>
          <li>Jobs</li>
          <li>Privacy</li>
          <li>Terms</li>
          <li>Locations</li>
          <li>Language</li>
        </FooterItems>
        <Copyright>© 2022 CLONESTAGRAM</Copyright>
      </AsideFooter>
    </HomeAsideContainer>
  );
};

export default HomeAside;
