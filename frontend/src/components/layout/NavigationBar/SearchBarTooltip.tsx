import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRecentSearchUser, deleteRecentSearchUser } from '../../../api/api';
import Loader from 'react-loader';
import { AxiosError } from 'axios';

const SearchBarTooltipContainer = styled.div<{ showTooltip: boolean }>`
  display: ${({ showTooltip }) => (showTooltip ? 'block' : 'none')};
  position: absolute;
  top: 60px;
  left: 220px;
  width: 374px;
  height: 362px;
  border-radius: 5px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
  background: ${({ theme }) => theme.dropDownBgColor};
  z-index: 500;
  &:after {
    display: block;
    position: absolute;
    top: -8px;
    right: 150px;
    width: 1px;
    border-width: 0 6px 8px 6.5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.dropDownBgColor} transparent;
    content: '';
    z-index: 1;
  }
`;

const SearchBarTooltipWrapper = styled.div`
  width: 374px;
  height: 362px;
  overflow-y: auto;
  &::-webkit-scrollbar-thumb {
    border: 4px solid transparent;
    border-radius: 10px;
    background: #939393b2;
    background-clip: padding-box;
    &:hover {
      border: 4px solid transparent;
      border-radius: 10px;
      background: #939393;
      background-clip: padding-box;
    }
  }
  &::-webkit-scrollbar-track {
    background-color: #262626;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  &::-webkit-scrollbar {
    width: 15px;
  }
`;

const TooltipHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 23px 10px 15px 10px;

  p {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
  button {
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.buttonColor};
  }
`;

const RecentSearchItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 15px 0 10px;
  &:hover {
    background: ${({ theme }) => theme.bgColor};
    cursor: pointer;
  }
  &:active {
    opacity: 0.7;
  }
  &:first-child {
    margin-top: 10px;
  }
  &:last-child {
    margin-bottom: 10px;
  }
`;

const UserAvatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 54px;
  height: 54px;
  border: 2px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, #ff0000 0%, #ffa500 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px 0;
  width: 250px;
  height: 100%;
  margin-left: 10px;
  p:nth-child(1) {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
  p:nth-child(2) {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const CloseIcon = styled(IoClose)`
  width: 25px;
  height: 25px;
  color: ${({ theme }) => theme.greyTextColor};
  z-index: 200;
`;

const EmptyRecentSearch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  p {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const SearchBarTooltip = ({
  showTooltip,
  setShowTooltip,
  setSearchBarClicked,
  userList,
  searchUserIsLoading,
  searchUserIsSuccess,
  getRecentSearchUserListData,
}: SearchBarTooltipType) => {
  const outsideRef = useRef();
  const [recentSearch, setRecentSearch] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useOutsideClick(outsideRef, () => {
    setShowTooltip(false);
    setSearchBarClicked(false);
    // searchUserQuery.remove();
  });
  // console.log(getRecentSearchUserListQuery);

  const addSearchUserQuery = useMutation<
    ResponseData,
    AxiosError,
    AddRecentSearchUserType
  >(addRecentSearchUser, {
    onError: (err) => {
      console.log('최근 검색 유저 추가 에러!', err.response.data);
    },
    onSuccess: () => {
      console.log('최근 검색 유저 추가 성공!');
      // console.log(addSearchUserQuery.data);
      queryClient.invalidateQueries(['getSearchUserList']);
    },
  });

  const deleteSearchUserQuery = useMutation<
    ResponseData,
    AxiosError,
    DeleteRecentSearchUserType
  >(deleteRecentSearchUser, {
    onError: (err) => {
      console.log('최근 검색 유저 삭제 에러!', err.response.data);
    },
    onSuccess: () => {
      console.log('최근 검색 유저 삭제 성공!');
      // console.log(deleteSearchUserQuery.data);
      queryClient.invalidateQueries(['getSearchUserList']);
    },
  });

  if (searchUserIsLoading) {
    return (
      <SearchBarTooltipContainer showTooltip={showTooltip} ref={outsideRef}>
        <SearchBarTooltipWrapper>
          <EmptyRecentSearch>
            <Loader
              loaded={!searchUserIsLoading}
              color="#8e8e8e"
              scale={0.5}
              top="50%"
              left="50%"
            />
          </EmptyRecentSearch>
        </SearchBarTooltipWrapper>
      </SearchBarTooltipContainer>
    );
  }

  if (searchUserIsSuccess) {
    return (
      <SearchBarTooltipContainer showTooltip={showTooltip} ref={outsideRef}>
        <SearchBarTooltipWrapper>
          {userList.length > 0 ? (
            userList.map((list: followerImFollowingListType) => (
              <RecentSearchItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${list.userId}`);
                  setShowTooltip(false);
                  // window.location.reload();
                  addSearchUserQuery.mutate({ toUserId: list.userId });
                }}>
                <UserAvatar>
                  <img src={list.profileImage} alt="유저아바타" />
                </UserAvatar>
                <UserInfo>
                  <p>{list.username}</p>
                  <p>{list.name}</p>
                </UserInfo>
              </RecentSearchItem>
            ))
          ) : (
            <EmptyRecentSearch>
              <p>No results found.</p>
            </EmptyRecentSearch>
          )}
        </SearchBarTooltipWrapper>
      </SearchBarTooltipContainer>
    );
  }

  return (
    <SearchBarTooltipContainer showTooltip={showTooltip} ref={outsideRef}>
      <SearchBarTooltipWrapper>
        <TooltipHeader>
          <p>Recent</p>
          <button>Clear all</button>
        </TooltipHeader>
        {getRecentSearchUserListData?.length > 0 ? (
          getRecentSearchUserListData.map(
            (list: followerImFollowingListType) => (
              <RecentSearchItem
                onClick={() => {
                  setShowTooltip(false);
                  navigate(`/user/${list.userId}`);
                  // window.location.reload();
                  addSearchUserQuery.mutate({ toUserId: list.userId });
                }}>
                <UserAvatar>
                  <img src={list.profileImage} alt="유저아바타" />
                </UserAvatar>
                <UserInfo>
                  <p>{list.username}</p>
                  <p>{list.name}</p>
                </UserInfo>
                <CloseIcon
                  onClick={() => {
                    deleteSearchUserQuery.mutate({ toUserId: list.userId });
                  }}
                />
              </RecentSearchItem>
            ),
          )
        ) : (
          <EmptyRecentSearch>
            <p>No recent searches.</p>
          </EmptyRecentSearch>
        )}
      </SearchBarTooltipWrapper>
    </SearchBarTooltipContainer>
  );
};

export default SearchBarTooltip;
