import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import clonestagramLogoBlack from '../../../assets/image/clonestagramLogoBlack.png';
import clonestagramLogoWhite from '../../../assets/image/clonestagramLogoWhite.png';
import userAvatar from '../../../assets/image/userAvatar.png';
import { FiSearch, FiPlusSquare, FiHeart } from 'react-icons/fi';
import { MdCancel } from 'react-icons/md';
import { ImCompass2 } from 'react-icons/im';
import { TbLocation } from 'react-icons/tb';
import SearchBarTooltip from './SearchBarTooltip';
import { useNavigate } from 'react-router-dom';
import HomeIcon from './HomeIcon';
import AvatarDropdown from './AvatarDropdown';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { useSelector } from 'react-redux';
import ModalPortal from '../../feature/Modal/ModalPortal';
import ModalContainer from '../../feature/Modal/ModalContainer';

const NavigationBarContainer = styled.nav`
  width: 100vw;
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.searchBarBgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 500;
  @media ${({ theme }) => theme.tablet} {
    width: 100vw;
  }
  @media ${({ theme }) => theme.mobile} {
    width: 100vw;
  }
`;

const NavigationBarWrapper = styled.div`
  width: 967px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  @media ${({ theme }) => theme.tablet} {
    width: 90vw;
  }
  @media ${({ theme }) => theme.mobile} {
    width: 90vw;
  }
`;

const LogoWrapper = styled.div`
  width: fit-content;
  height: fit-content;
  img {
    width: 100px;
    height: 30px;
  }
  cursor: pointer;
  /* border: 1px solid red; */
`;

const SearchBarWrapper = styled.div<{ searchbarclicked: string }>`
  width: 270px;
  height: 35px;
  background: ${({ theme }) => theme.searchBarInputColor};
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  input {
    width: 100%;
    height: 100%;
    background: transparent;
    padding-left: 40px;
    padding-left: ${({ searchbarclicked }) =>
      searchbarclicked ? '15px' : '40px'};
    border: none;
    z-index: 10;
    font-size: 16px;
  }
`;

const MenuWrapper = styled.div`
  width: 286px;
  height: 52px;
  /* border: 1px solid red; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const SearchIcon = styled(FiSearch)<{ searchbarclicked: string }>`
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.greyTextColor};
  position: absolute;
  top: 8px;
  left: 12px;
  display: ${({ searchbarclicked }) => (searchbarclicked ? 'none' : 'block')};
`;

const UserImage = styled.img<{ showDropdown: boolean }>`
  width: 29px;
  height: 29px;
  border-radius: 50%;
  cursor: pointer;
  padding: 1px;
  border: 1px solid
    ${({ showDropdown }) => (showDropdown ? '#6f6f6f' : 'transparent')};
`;

const LocationIcon = styled(TbLocation)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const PlusSquareIcon = styled(FiPlusSquare)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const CompassIcon = styled(ImCompass2)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const HeartIcon = styled(FiHeart)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const CancelButton = styled(MdCancel)<{ searchbarclicked: string }>`
  width: 17px;
  height: 17px;
  position: absolute;
  right: 15px;
  color: ${({ theme }) => theme.greyTextColor};
  cursor: pointer;
  z-index: 10;
  display: ${({ searchbarclicked }) => (searchbarclicked ? 'block' : 'none')};
`;

const NavigationBar = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchBarClicked, setSearchBarClicked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);

  const isDarkMode = useSelector((state: any) => state.themeMode.darkMode);

  const openModal = () => {
    setCreatePostModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setCreatePostModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const navigate = useNavigate();

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
          />
          <CancelButton searchbarclicked={searchBarClicked.toString()} />
        </SearchBarWrapper>
        <SearchBarTooltip
          showTooltip={showTooltip}
          setShowTooltip={setShowTooltip}
          setSearchBarClicked={setSearchBarClicked}
        />
        <MenuWrapper>
          <HomeIcon />
          <LocationIcon />
          <PlusSquareIcon onClick={openModal} />
          <CompassIcon />
          <HeartIcon />
          <UserImage
            src={userAvatar}
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
          <ModalContainer closeModal={closeModal} />
        </ModalPortal>
      )}
    </NavigationBarContainer>
  );
};

export default NavigationBar;
