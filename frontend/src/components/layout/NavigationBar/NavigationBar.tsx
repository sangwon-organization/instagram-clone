import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import instagramLogo from '../../../assets/image/instagram-logo.png';
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

const NavigationBarContainer = styled.nav`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #dbdbdb;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 10000;
`;

const NavigationBarWrapper = styled.div`
  width: 967px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
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

const SearchBarWrapper = styled.div<{ searchBarClicked: boolean }>`
  width: 270px;
  height: 35px;
  background: #efefef;
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
    padding-left: ${({ searchBarClicked }) =>
      searchBarClicked ? '15px' : '40px'};
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

const SearchIcon = styled(FiSearch)<{ searchBarClicked: boolean }>`
  width: 18px;
  height: 18px;
  color: #8e8e8e;
  position: absolute;
  top: 8px;
  left: 12px;
  display: ${({ searchBarClicked }) => (searchBarClicked ? 'none' : 'block')};
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
  &:active {
    color: #8e8e8e;
  }
`;

const PlusSquareIcon = styled(FiPlusSquare)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  &:active {
    color: #8e8e8e;
  }
`;

const CompassIcon = styled(ImCompass2)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  &:active {
    color: #8e8e8e;
  }
`;

const HeartIcon = styled(FiHeart)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  &:active {
    color: #8e8e8e;
  }
`;

const CancelButton = styled(MdCancel)<{ searchBarClicked: boolean }>`
  width: 17px;
  height: 17px;
  position: absolute;
  right: 15px;
  color: #8e8e8e;
  cursor: pointer;
  z-index: 10;
  display: ${({ searchBarClicked }) => (searchBarClicked ? 'block' : 'none')};
`;

const NavigationBar = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchBarClicked, setSearchBarClicked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <NavigationBarContainer>
      <NavigationBarWrapper>
        <LogoWrapper onClick={() => navigate('/home')}>
          <img src={instagramLogo} alt="인스타그램로고" />
        </LogoWrapper>
        <SearchBarWrapper searchBarClicked={searchBarClicked}>
          <SearchIcon searchBarClicked={searchBarClicked} />
          <input
            type="text"
            placeholder="Search"
            onClick={() => {
              setShowTooltip(true);
              setSearchBarClicked(true);
            }}
          />
          <CancelButton searchBarClicked={searchBarClicked} />
        </SearchBarWrapper>
        <SearchBarTooltip
          showTooltip={showTooltip}
          setShowTooltip={setShowTooltip}
          setSearchBarClicked={setSearchBarClicked}
        />
        <MenuWrapper>
          <HomeIcon />
          <LocationIcon />
          <PlusSquareIcon />
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
    </NavigationBarContainer>
  );
};

export default NavigationBar;
