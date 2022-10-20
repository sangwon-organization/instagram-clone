import React from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';

const SearchBarTooltipContainer = styled.div<{ showTooltip: boolean }>`
  display: ${({ showTooltip }) => (showTooltip ? 'block' : 'none')};
  width: 374px;
  height: 362px;
  border: 1px solid red;
  position: absolute;
  top: 60px;
  left: 220px;
  overflow-y: auto;
  &:after {
    border-color: white transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: '';
    display: block;
    right: 45px;
    position: absolute;
    top: -8px;
    width: 1px;
    z-index: 1;
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
    background: #ececec;
    cursor: pointer;
  }
  &:active {
    opacity: 0.7;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: grey;
`;

const UserInfo = styled.div`
  width: 250px;
  height: 100%;
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px 0;
  p:nth-child(1) {
    color: #262626;
    font-size: 14px;
    font-weight: 600;
  }
  p:nth-child(2) {
    color: #8e8e8e;
    font-size: 14px;
    font-weight: 400;
  }
`;

const CloseIcon = styled(IoClose)`
  width: 25px;
  height: 25px;
  color: rgb(142, 142, 142);
`;

const SearchBarTooltip = ({ showTooltip }: any) => {
  return (
    <SearchBarTooltipContainer showTooltip={showTooltip}>
      <TooltipHeader>
        <p>Recent</p>
        <button>Clear all</button>
      </TooltipHeader>
      <RecentSearchItem>
        <UserAvatar />
        <UserInfo>
          <p>username</p>
          <p>userDescription</p>
        </UserInfo>
        <CloseIcon />
      </RecentSearchItem>
      <RecentSearchItem>
        <UserAvatar />
        <UserInfo>
          <p>username</p>
          <p>userDescription</p>
        </UserInfo>
        <CloseIcon />
      </RecentSearchItem>
      <RecentSearchItem>
        <UserAvatar />
        <UserInfo>
          <p>username</p>
          <p>userDescription</p>
        </UserInfo>
        <CloseIcon />
      </RecentSearchItem>
      <RecentSearchItem>
        <UserAvatar />
        <UserInfo>
          <p>username</p>
          <p>userDescription</p>
        </UserInfo>
        <CloseIcon />
      </RecentSearchItem>
      <RecentSearchItem>
        <UserAvatar />
        <UserInfo>
          <p>username</p>
          <p>userDescription</p>
        </UserInfo>
        <CloseIcon />
      </RecentSearchItem>

      <RecentSearchItem>
        <UserAvatar />
        <UserInfo>
          <p>username</p>
          <p>userDescription</p>
        </UserInfo>
        <CloseIcon />
      </RecentSearchItem>
    </SearchBarTooltipContainer>
  );
};

export default SearchBarTooltip;
