import React from 'react';
import styled from 'styled-components';
import { GrHomeRounded } from 'react-icons/gr';
import { MdOutlineHome, MdHome } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.textColor};
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const HomeBorderIcon = styled(MdOutlineHome)`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const HomeFilledIcon = styled(MdHome)`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const HomeIcon = () => {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  // const result = pathName === '/home';
  return (
    <HomeIconBox onClick={() => navigate('/')}>
      {pathName === '/' ? <HomeFilledIcon /> : <HomeBorderIcon />}
    </HomeIconBox>
  );
};

export default HomeIcon;
