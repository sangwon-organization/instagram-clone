import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  followingUser,
  getNotFollowingList,
  getUserInformation,
} from '../../../api/api';
import { AxiosError } from 'axios';
import SugesstionItem from './SugesstionItem';

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

  const queryClient = useQueryClient();

  const { data: getNotFollowingListData } = useQuery<
    getNotFollowingListType,
    AxiosError
  >(['getNotFollowingList'], () => getNotFollowingList(), {
    refetchOnWindowFocus: false,
  });
  console.log(getNotFollowingListData);
  const { data: getUserInformData } = useQuery<
    GetUserInformationDataType,
    AxiosError
  >(['getUserInform'], () => {
    const userId = Number(localStorage.getItem('userId'));
    return getUserInformation({ targetUserId: userId });
  });

  const userId = localStorage.getItem('userId');

  // const toggleIsFollowing = () => {
  //   const [isFollowing, setIsFollowing] = useState(false);
  //   setIsFollowing((prev) => !prev);

  // };

  return (
    <HomeAsideContainer>
      <UserAccountWrapper>
        <img
          src={getUserInformData?.profileImage}
          alt="유저아바타"
          onClick={() => navigate(`/user/${userId}`)}
        />
        <UserInfoWrapper>
          <p onClick={() => navigate(`/user/${userId}`)}>
            {getUserInformData?.username}
          </p>
          <p>{getUserInformData?.name}</p>
        </UserInfoWrapper>
        <button>Switch</button>
      </UserAccountWrapper>
      <SuggestionsWrapper>
        <SuggestionsHeader>
          <p>Suggestions For You</p>
          <button>See All</button>
        </SuggestionsHeader>
        {getNotFollowingListData?.followingList.map(
          (list: followerImFollowingListType) => (
            <SugesstionItem key={list.userId} list={list} />
          ),
        )}
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
