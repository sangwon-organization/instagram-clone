import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 131px;
  background-color: ${({ theme }) => theme.bgColor};
  font-size: 11.7px;
  color: ${({ theme }) => theme.greyTextColor};
  line-height: 1.33;
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 1024px;
  height: 100%;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Footer = () => {
  const today = new Date();

  const todayYear = today.getFullYear();
  return (
    <FooterContainer>
      <FooterWrapper>
        <NavigationContainer>
          <p>Meta</p>
          <p>About</p>
          <p>Blog</p>
          <p>Jobs</p>
          <p>Help</p>
          <p>API</p>
          <p>Privacy</p>
          <p>Terms</p>
          <p>Top Accounts</p>
          <p>Hashtags</p>
          <p>Locations</p>
          <p>Instagram Lite</p>
          <p>Contact Uploading & Non-Users</p>
        </NavigationContainer>
        <p>© {todayYear} Clonestagram</p>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;
