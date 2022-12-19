import React, { useState } from 'react';
import styled from 'styled-components';
import clonestagramLogoBlack from '../../../assets/image/clonestagramLogoBlack.png';
import clonestagramLogoWhite from '../../../assets/image/clonestagramLogoWhite.png';
import { FiSearch, FiPlusSquare, FiHeart } from 'react-icons/fi';
import { MdCancel } from 'react-icons/md';
import { ImCompass2 } from 'react-icons/im';
import { TbLocation } from 'react-icons/tb';
import SearchBarTooltip from './SearchBarTooltip';
import { useNavigate } from 'react-router-dom';
import HomeIcon from './HomeIcon';
import AvatarDropdown from './AvatarDropdown';
import { useSelector } from 'react-redux';
import ModalPortal from '../../feature/Modal/ModalPortal';
import ModalContainer from '../../feature/Modal/ModalContainer';
import { useQuery } from '@tanstack/react-query';
import {
  getRecentSearchUsersList,
  getUserInformation,
  searchUser,
} from '../../../api/api';
import CreatePostModal from '../../feature/Modal/CreatePostModal';
import Loader from 'react-loader';

const NavigationBarContainer = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100vw;
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.searchBarBgColor};
  z-index: 500;
`;

const NavigationBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 967px;
  height: 100%;
`;

const LogoWrapper = styled.div`
  width: fit-content;
  height: fit-content;
  img {
    width: 100px;
    height: 30px;
  }
  cursor: pointer;
`;

const SearchBarWrapper = styled.div<{ searchbarclicked: string }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 270px;
  height: 35px;
  border-radius: 10px;
  background: ${({ theme }) => theme.searchBarInputColor};
  input {
    width: 100%;
    height: 100%;
    padding-left: ${({ searchbarclicked }) =>
      searchbarclicked === 'true' ? '15px' : '40px'};
    border: none;
    background: transparent;
    font-size: 16px;
    color: ${({ theme }) => theme.textColor};
    z-index: 10;
  }
`;

const MenuWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 286px;
  height: 52px;
`;

const SearchIcon = styled(FiSearch)<{ searchbarclicked: string }>`
  display: ${({ searchbarclicked }) =>
    searchbarclicked === 'true' ? 'none' : 'block'};
  position: absolute;
  top: 8px;
  left: 12px;
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.greyTextColor};
`;

const UserImage = styled.img<{ showDropdown: boolean }>`
  width: 29px;
  height: 29px;
  padding: 1px;
  border: 1px solid
    ${({ showDropdown, theme }) =>
      showDropdown ? theme.greyTextColor : 'transparent'};
  border-radius: 50%;
  cursor: pointer;
`;

const LocationIcon = styled(TbLocation)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const PlusSquareIcon = styled(FiPlusSquare)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const CompassIcon = styled(ImCompass2)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const HeartIcon = styled(FiHeart)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const CancelButton = styled(MdCancel)<{ searchbarclicked: string }>`
  display: ${({ searchbarclicked }) =>
    searchbarclicked === 'true' ? 'block' : 'none'};
  position: absolute;
  right: 15px;
  width: 17px;
  height: 17px;
  color: ${({ theme }) => theme.greyTextColor};
  cursor: pointer;
  z-index: 10;
`;

const NavigationBar = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchBarClicked, setSearchBarClicked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [userKeyword, setUserKeyword] = useState('');

  const navigate = useNavigate();

  const isDarkMode = useSelector((state: any) => state.themeMode.darkMode);

  const openModal = () => {
    setCreatePostModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setCreatePostModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const searchUserQuery = useQuery(['searchUser', userKeyword], () =>
    searchUser({ page: 1, keyword: userKeyword }),
  );

  const getRecentSearchUserListQuery = useQuery(['getSearchUserList'], () =>
    getRecentSearchUsersList(),
  );

  const { data: getUserProfileImage } = useQuery(['getUserProfile'], () => {
    const userId = Number(localStorage.getItem('userId'));
    return getUserInformation({ targetUserId: userId });
  });

  return (
    <NavigationBarContainer>
      <NavigationBarWrapper>
        <LogoWrapper onClick={() => navigate('/')}>
          <img
            src={
              isDarkMode === 'dark'
                ? clonestagramLogoWhite
                : clonestagramLogoBlack
            }
            alt="인스타그램로고"
          />
        </LogoWrapper>
        <SearchBarWrapper searchbarclicked={searchBarClicked.toString()}>
          <SearchIcon searchbarclicked={searchBarClicked.toString()} />
          <input
            type="text"
            placeholder="Search"
            onClick={() => {
              setShowTooltip(true);
              setSearchBarClicked(true);
            }}
            onBlurCapture={(e) => (e.target.value = '')}
            onChange={(e) => {
              setUserKeyword(e.target.value);
              console.log(e.target.value);
              searchUserQuery.refetch();
            }}
          />
          {searchUserQuery.isLoading ? (
            <Loader
              loaded={!searchUserQuery.isLoading}
              color="grey"
              scale={0.4}
              top="50%"
              left="90%"
            />
          ) : (
            <CancelButton searchbarclicked={searchBarClicked.toString()} />
          )}
        </SearchBarWrapper>
        <SearchBarTooltip
          showTooltip={showTooltip}
          setShowTooltip={setShowTooltip}
          setSearchBarClicked={setSearchBarClicked}
          userList={searchUserQuery.data?.data.userList}
          searchUserQuery={searchUserQuery}
          getRecentSearchUserListData={
            getRecentSearchUserListQuery.data?.data.userSearchLogList
          }
          getRecentSearchUserListQuery={getRecentSearchUserListQuery}
        />
        <MenuWrapper>
          <HomeIcon />
          <LocationIcon />
          <PlusSquareIcon onClick={openModal} />
          <CompassIcon />
          <HeartIcon />
          <UserImage
            src={getUserProfileImage?.data.profileImage}
            alt="유저아바타"
            onClick={() => setShowDropdown(true)}
            showDropdown={showDropdown}
          />
        </MenuWrapper>
        <AvatarDropdown
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      </NavigationBarWrapper>
      {createPostModalOpen && (
        <ModalPortal>
          <ModalContainer createPost closeModal={closeModal}>
            <CreatePostModal />
          </ModalContainer>
        </ModalPortal>
      )}
    </NavigationBarContainer>
  );
};

export default NavigationBar;
