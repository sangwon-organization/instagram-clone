import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { CgProfile } from 'react-icons/cg';
import { BiBookmark } from 'react-icons/bi';
import { IoMoonOutline } from 'react-icons/io5';
import { IoIosSettings } from 'react-icons/io';
import { BiMessageAltError } from 'react-icons/bi';
import { CgSync } from 'react-icons/cg';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { useDispatch } from 'react-redux';
import { changeThemeMode } from '../../../redux/slices/themeModeSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AvatarDropdownContainer = styled.div<{ showDropdown: boolean; ref: any }>`
  display: ${({ showDropdown }) => (showDropdown ? 'block' : 'none')};
  position: absolute;
  right: -30px;
  top: 57px;
  width: 230px;
  height: fit-content;
  border-radius: 5px;
  background: ${({ theme }) => theme.dropDownBgColor};
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
  &:after {
    display: block;
    position: absolute;
    top: -8px;
    right: 38px;
    width: 1px;
    border-width: 0 6px 8px 6.5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.dropDownBgColor} transparent;
    content: '';
    z-index: 1;
  }
`;

const AvatarDropdownWrapper = styled.div`
  width: 100%;
  height: fit-content;
  border-bottom: ${({ theme }) => theme.greyTextColor};
`;

const ProfileIcon = styled(CgProfile)`
  width: 17px;
  height: 17px;
`;
const SavedIcon = styled(BiBookmark)`
  width: 17px;
  height: 17px;
`;
const SwitchAppearanceIcon = styled(IoMoonOutline)`
  width: 17px;
  height: 17px;
`;
const SettingsIcon = styled(IoIosSettings)`
  width: 17px;
  height: 17px;
`;
const ReportProblemIcon = styled(BiMessageAltError)`
  width: 17px;
  height: 17px;
`;
const SwitchAccountsIcon = styled(CgSync)`
  width: 17px;
  height: 17px;
`;

const DropdownItem = styled.div<{ first?: boolean; last?: boolean }>`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 0 10px;
  width: 230px;
  height: 37px;
  padding: 8px 16px;
  border-top: ${({ last, theme }) => last && `1px solid ${theme.borderColor}`};
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bgColor};
    border-top-left-radius: ${({ first }) => first && '5px'};
    border-top-right-radius: ${({ first }) => first && '5px'};
    border-bottom-left-radius: ${({ last }) => last && '5px'};
    border-bottom-right-radius: ${({ last }) => last && '5px'};
  }
`;

interface AvatarDropdownProps {
  showDropdown: boolean;
  setShowDropdown: Function;
}

const AvatarDropdown = ({
  showDropdown,
  setShowDropdown,
}: AvatarDropdownProps) => {
  const outsideRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useOutsideClick(outsideRef, () => setShowDropdown(false));

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const userId = localStorage.getItem('userId');

  return (
    <AvatarDropdownContainer showDropdown={showDropdown} ref={outsideRef}>
      <AvatarDropdownWrapper>
        <DropdownItem
          first
          onClick={() => {
            navigate(`/user/${userId}`);
            window.location.reload();
          }}>
          <ProfileIcon />
          <p>Profile</p>
        </DropdownItem>
        <DropdownItem>
          <SavedIcon />
          <p>Saved</p>
        </DropdownItem>
        <DropdownItem onClick={() => dispatch(changeThemeMode())}>
          <SwitchAppearanceIcon />
          <p>Switch appearance</p>
        </DropdownItem>
        <DropdownItem>
          <SettingsIcon />
          <p>Settings</p>
        </DropdownItem>
        <DropdownItem>
          <ReportProblemIcon />
          <p>Report a problem</p>
        </DropdownItem>
        <DropdownItem>
          <SwitchAccountsIcon />
          <p>Switch accounts</p>
        </DropdownItem>
      </AvatarDropdownWrapper>
      <DropdownItem last onClick={logout}>
        <p>Log Out</p>
      </DropdownItem>
    </AvatarDropdownContainer>
  );
};

export default AvatarDropdown;
