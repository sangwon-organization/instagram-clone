import React from 'react';
import styled from 'styled-components';
import { GrHomeRounded } from 'react-icons/gr';
import { MdOutlineHome, MdHome } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeIconBox = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-content: center;
  &:active {
    color: #8e8e8e;
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
    <HomeIconBox onClick={() => navigate('/home')}>
      {pathName === '/home' ? <HomeFilledIcon /> : <HomeBorderIcon />}
    </HomeIconBox>
  );
};

export default HomeIcon;