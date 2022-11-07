import React from 'react';
import styled from 'styled-components';
import userAvatar from '../../../assets/image/userAvatar.png';

const HomeAsideContainer = styled.aside`
  width: 319px;
  height: 984px;
  /* border: 1px solid red; */
  margin-top: 55px;
`;

const UserAccountWrapper = styled.div`
  width: 319px;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }
  button {
    width: 40px;
    height: 16px;
    border: none;
    background: transparent;
    color: #0095f6;
    font-size: 12px;
    font-weight: 600;
  }
`;

const UserInfoWrapper = styled.div`
  width: 209px;
  height: 30px;
  display: flex;
  flex-direction: column;
  gap: 5px 0;
  justify-content: center;
  align-items: flex-start;

  p:nth-child(1) {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
  p:nth-child(2) {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const SuggestionsWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;

const SuggestionsHeader = styled.div`
  width: 100%;
  height: 19px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  p {
    color: ${({ theme }) => theme.greyTextColor};
    font-size: 14px;
    font-weight: 600;
  }
  button {
    color: ${({ theme }) => theme.textColor};
    font-size: 12px;
    font-weight: 600;
    border: none;
    background: transparent;
    padding: 0;
  }
`;

const SuggestionsItem = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 8px 3px;
  /* border: 1px solid blue; */
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  button {
    width: 38px;
    height: 16px;
    border: none;
    background: transparent;
    color: #0095f6;
    font-size: 12px;
    font-weight: 600;
  }
`;

const ItemUserInfoWrapper = styled.div`
  width: 209px;
  height: 30px;
  display: flex;
  flex-direction: column;
  gap: 5px 0;
  justify-content: center;
  align-items: flex-start;

  p:nth-child(1) {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
  p:nth-child(2) {
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const AsideFooter = styled.footer`
  width: 250px;
  height: 74.5px;
  /* border: 1px solid pink; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 30px;
`;

const FooterItems = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    line-height: 18px;
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.footerTextColor};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  li::after {
    content: '∙';
  }
  li:last-child::after {
    content: '';
  }
`;

const Copyright = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.footerTextColor};
`;

const HomeAside = () => {
  return (
    <HomeAsideContainer>
      <UserAccountWrapper>
        <img src={userAvatar} alt="유저아바타" />
        <UserInfoWrapper>
          <p>_leesangwon</p>
          <p>이상원</p>
        </UserInfoWrapper>
        <button>Switch</button>
      </UserAccountWrapper>
      <SuggestionsWrapper>
        <SuggestionsHeader>
          <p>Suggestions For You</p>
          <button>See All</button>
        </SuggestionsHeader>
        <SuggestionsItem>
          <img src={userAvatar} alt="유저아바타" />
          <ItemUserInfoWrapper>
            <p>username</p>
            <p>Suggested for you</p>
          </ItemUserInfoWrapper>
          <button>Follow</button>
        </SuggestionsItem>
        <SuggestionsItem>
          <img src={userAvatar} alt="유저아바타" />
          <ItemUserInfoWrapper>
            <p>username</p>
            <p>Suggested for you</p>
          </ItemUserInfoWrapper>
          <button>Follow</button>
        </SuggestionsItem>
        <SuggestionsItem>
          <img src={userAvatar} alt="유저아바타" />
          <ItemUserInfoWrapper>
            <p>username</p>
            <p>Suggested for you</p>
          </ItemUserInfoWrapper>
          <button>Follow</button>
        </SuggestionsItem>
      </SuggestionsWrapper>
      <AsideFooter>
        <FooterItems>
          <li>About</li>
          <li>Help</li>
          <li>Press</li>
          <li>API</li>
          <li>Jobs</li>
          <li>Privacy</li>
          <li>Terms</li>
          <li>Locations</li>
          <li>Language</li>
        </FooterItems>
        <Copyright>© 2022 CLONESTAGRAM</Copyright>
      </AsideFooter>
    </HomeAsideContainer>
  );
};

export default HomeAside;
