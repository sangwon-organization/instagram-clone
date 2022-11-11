import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import userAvatar from '../../../assets/image/userAvatar.png';
import useOutsideClick from '../../../hooks/useOutsideClick';

const SearchBarTooltipContainer = styled.div<{
  showTooltip: boolean;
  ref: any;
}>`
  display: ${({ showTooltip }) => (showTooltip ? 'block' : 'none')};
  width: 374px;
  height: 362px;
  /* border: 1px solid red; */
  border-radius: 5px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
  position: absolute;
  background: ${({ theme }) => theme.dropDownBgColor};
  top: 60px;
  left: 220px;
  z-index: 500;
  &:after {
    border-color: ${({ theme }) => theme.dropDownBgColor} transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: '';
    display: block;
    position: absolute;
    top: -8px;
    right: 150px;
    width: 1px;
    z-index: 1;
  }
`;

const SearchBarTooltipWrapper = styled.div`
  width: 374px;
  height: 362px;
  overflow-y: auto;
  &::-webkit-scrollbar-thumb {
    background: rgba(147, 147, 147, 0.7);
    border-radius: 10px;
    background-clip: padding-box;
    border: 4px solid transparent;
    &:hover {
      background: #939393;
      border-radius: 10px;
      background-clip: padding-box;
      border: 4px solid transparent;
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
  /* border: 1px solid blue; */
  p {
    font-size: 16px;
    font-weight: 600;
    /* border: 1px solid green; */
    color: ${({ theme }) => theme.textColor};
  }
  button {
    font-size: 14px;
    font-weight: 600;
    color: #0095f6;
    border: none;
    background: transparent;
    /* border: 1px solid green; */
  }
`;

const RecentSearchItem = styled.div`
  width: 100%;
  height: 60px;
  /* border: 1px solid pink; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0 10px;
  &:hover {
    background: ${({ theme }) => theme.bgColor};
    cursor: pointer;
  }
  &:active {
    opacity: 0.7;
  }
`;

const UserAvatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const UserInfo = styled.div`
  width: 250px;
  height: 100%;
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px 0;
  margin-left: 10px;
  p:nth-child(1) {
    color: ${({ theme }) => theme.textColor};
    font-size: 14px;
    font-weight: 600;
  }
  p:nth-child(2) {
    color: ${({ theme }) => theme.greyTextColor};
    font-size: 14px;
    font-weight: 400;
  }
`;

const CloseIcon = styled(IoClose)`
  width: 25px;
  height: 25px;
  color: ${({ theme }) => theme.greyTextColor};
`;

const EmptyRecentSearch = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

interface SearchBarTooltipProps {
  showTooltip: boolean;
  setShowTooltip: Function;
  setSearchBarClicked: Function;
}

const SearchBarTooltip = ({
  showTooltip,
  setShowTooltip,
  setSearchBarClicked,
}: SearchBarTooltipProps) => {
  const outsideRef = useRef();
  const [recentSearch, setRecentSearch] = useState(true);

  useOutsideClick(outsideRef, () => {
    setShowTooltip(false);
    setSearchBarClicked(false);
  });
  return (
    <SearchBarTooltipContainer showTooltip={showTooltip} ref={outsideRef}>
      <SearchBarTooltipWrapper>
        <TooltipHeader>
          <p>Recent</p>
          <button>Clear all</button>
        </TooltipHeader>
        {recentSearch ? (
          <>
            <RecentSearchItem>
              <UserAvatar>
                <img src={userAvatar} alt="유저아바타" />
              </UserAvatar>
              <UserInfo>
                <p>username</p>
                <p>userDescription</p>
              </UserInfo>
              <CloseIcon />
            </RecentSearchItem>
            <RecentSearchItem>
              <UserAvatar>
                <img src={userAvatar} alt="유저아바타" />
              </UserAvatar>
              <UserInfo>
                <p>username</p>
                <p>userDescription</p>
              </UserInfo>
              <CloseIcon />
            </RecentSearchItem>
            <RecentSearchItem>
              <UserAvatar>
                <img src={userAvatar} alt="유저아바타" />
              </UserAvatar>
              <UserInfo>
                <p>username</p>
                <p>userDescription</p>
              </UserInfo>
              <CloseIcon />
            </RecentSearchItem>
            <RecentSearchItem>
              <UserAvatar>
                <img src={userAvatar} alt="유저아바타" />
              </UserAvatar>
              <UserInfo>
                <p>username</p>
                <p>userDescription</p>
              </UserInfo>
              <CloseIcon />
            </RecentSearchItem>
            <RecentSearchItem>
              <UserAvatar>
                <img src={userAvatar} alt="유저아바타" />
              </UserAvatar>
              <UserInfo>
                <p>username</p>
                <p>userDescription</p>
              </UserInfo>
              <CloseIcon />
            </RecentSearchItem>
            <RecentSearchItem>
              <UserAvatar>
                <img src={userAvatar} alt="유저아바타" />
              </UserAvatar>
              <UserInfo>
                <p>username</p>
                <p>userDescription</p>
              </UserInfo>
              <CloseIcon />
            </RecentSearchItem>
          </>
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
