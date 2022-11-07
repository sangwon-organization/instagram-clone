import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  height: 131px;
  background-color: ${({ theme }) => theme.bgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11.7px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: ${({ theme }) => theme.greyTextColor};
`;

const FooterWrapper = styled.div`
  width: 1024px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const NavigationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const CopyrightContainer = styled.div``;

const Footer = () => {
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
        <CopyrightContainer>
          <p>© 2022 Clonestagram</p>
        </CopyrightContainer>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;
