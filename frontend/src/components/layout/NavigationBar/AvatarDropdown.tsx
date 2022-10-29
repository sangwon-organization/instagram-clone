import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { CgProfile } from 'react-icons/cg';
import { BiBookmark } from 'react-icons/bi';
import { IoMoonOutline } from 'react-icons/io5';
import { IoIosSettings } from 'react-icons/io';
import { BiMessageAltError } from 'react-icons/bi';
import { CgSync } from 'react-icons/cg';
import useOutsideClick from '../../../hooks/useOutsideClick';

const AvatarDropdownContainer = styled.div<{ showDropdown: boolean; ref: any }>`
  display: ${({ showDropdown }) => (showDropdown ? 'block' : 'none')};
  width: 230px;
  height: fit-content;
  /* border: 1px solid #8e8e8e; */
  border-radius: 5px;
  position: absolute;
  right: -30px;
  top: 57px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
  background: #fff;
  &:after {
    border-color: white transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: '';
    display: block;
    position: absolute;
    top: -8px;
    right: 38px;
    width: 1px;
    z-index: 1;
  }
`;

const AvatarDropdownWrapper = styled.div`
  width: 100%;
  height: fit-content;
  border-bottom: #8e8e8e;
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
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  &:hover {
    background: #fafafa;
    border-top-left-radius: ${({ first }) => first && '5px'};
    border-top-right-radius: ${({ first }) => first && '5px'};
    border-bottom-left-radius: ${({ last }) => last && '5px'};
    border-bottom-right-radius: ${({ last }) => last && '5px'};
  }
  border-top: ${({ last }) => last && '1px solid #dbdbdb'};
  padding: 8px 16px;
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

  useOutsideClick(outsideRef, () => setShowDropdown(false));

  return (
    <AvatarDropdownContainer showDropdown={showDropdown} ref={outsideRef}>
      <AvatarDropdownWrapper>
        <DropdownItem first>
          <ProfileIcon />
          <p>Profile</p>
        </DropdownItem>
        <DropdownItem>
          <SavedIcon />
          <p>Saved</p>
        </DropdownItem>
        <DropdownItem>
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
      <DropdownItem last>
        <p>Log Out</p>
      </DropdownItem>
    </AvatarDropdownContainer>
  );
};

export default AvatarDropdown;
