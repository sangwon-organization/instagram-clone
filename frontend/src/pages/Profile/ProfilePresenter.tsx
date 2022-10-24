import React from 'react';
import styled from 'styled-components';
import { GoKebabHorizontal } from 'react-icons/go';
import Post from '../../components/feature/Profile/Post';
import NavigationBar from '../../components/layout/NavigationBar/NavigationBar';
import userAvatar from '../../assets/image/userAvatar.png';
import { SlArrowDown } from 'react-icons/sl';
import { FaUserCheck } from 'react-icons/fa';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { BiMoviePlay } from 'react-icons/bi';
import { IoAppsSharp } from 'react-icons/io5';
import Footer from '../../components/layout/footer/Footer';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  padding-top: 60px;
`;

const MainWrapper = styled.main`
  width: 936px;
  height: fit-content;
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const UserInfoHeader = styled.header`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  width: 291px;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid red; */
`;

const UserAvatar = styled.div`
  width: 168px;
  height: 168px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    z-index: 100;
  }
`;
const UserInfo = styled.section`
  width: 613px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  align-items: start;
  /* border: 1px solid blue; */
  padding: 30px 0;
`;

const FirstBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 30px;
  h2 {
    font-size: 28px;
    font-weight: 400;
  }
`;

const ButtonBox = styled.div`
  width: 240px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SecondBox = styled.div`
  width: fit-content;
  height: 24px;
  display: flex;
  gap: 0 30px;
  p {
    font-size: 16px;
    font-weight: 400;
    span {
      font-weight: 600;
    }
  }
`;
const ThirdBox = styled.div`
  width: 100%;
  height: fit-content;
  p {
    line-height: 24px;
  }
`;
const FourthBox = styled.div`
  width: fit-content;
  height: 16px;
  color: #8e8e8e;
  font-size: 12px;
  font-weight: 600;
  span {
    color: #262626;
  }
`;

const KebabMenuIcon = styled(GoKebabHorizontal)`
  width: 27px;
  height: 27px;
  cursor: pointer;
  /* border: 1px solid red; */
`;

const ArrowDownIcon = styled(SlArrowDown)`
  width: 10px;
  height: 10px;
`;

const UserCheckIcon = styled(FaUserCheck)`
  width: 18px;
  height: 18px;
`;

const MessageButton = styled.button`
  width: 80px;
  height: 30px;
  padding: 5px 9px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  background: transparent;
`;
const FollowButton = styled.button`
  width: 72px;
  height: 30px;
  padding: 5px 9px;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  background: transparent;
`;
const SuggestedButton = styled.button`
  width: 34px;
  height: 30px;
  padding: 5px 9px;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  background: transparent;
`;
const TabMenu = styled.div`
  width: 100%;
  height: 53px;
  border-top: 1px solid #dbdbdb;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuWrapper = styled.ul`
  width: 280px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  li {
    width: fit-content;
    height: 100%;
    font-size: 12px;
    color: #8e8e8e;
    font-weight: 600;
    letter-spacing: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:active {
      opacity: 0.7;
    }
  }
`;

const TaggedIcon = styled(RiAccountPinBoxLine)`
  width: 10px;
  height: 10px;
  margin-right: 5px;
`;

const ReelsIcon = styled(BiMoviePlay)`
  width: 10px;
  height: 10px;
  margin-right: 5px;
`;

const PostsIcon = styled(IoAppsSharp)`
  width: 10px;
  height: 10px;
  margin-right: 5px;
`;

const PostsWrapper = styled.article`
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 28px 28px;
`;

const ProfilePresenter = () => {
  return (
    <>
      <NavigationBar />
      <MainContainer>
        <MainWrapper>
          <UserInfoHeader>
            <AvatarWrapper>
              <UserAvatar>
                <img src={userAvatar} alt="" />
              </UserAvatar>
            </AvatarWrapper>
            <UserInfo>
              <FirstBox>
                <h2>insight.co.kr</h2>
                <ButtonBox>
                  <MessageButton>Message</MessageButton>
                  <FollowButton>
                    <UserCheckIcon />
                  </FollowButton>
                  <SuggestedButton>
                    <ArrowDownIcon />
                  </SuggestedButton>
                  <KebabMenuIcon />
                </ButtonBox>
              </FirstBox>
              <SecondBox>
                <p>
                  <span>28,299</span> posts
                </p>
                <p>
                  <span>821K</span> followers
                </p>
                <p>
                  <span>330</span> following
                </p>
              </SecondBox>
              <ThirdBox>
                <p>
                  인사이트 <br />
                  가슴을 울리는 스토리와 통찰력 넘치는 시선으로 독자들과
                  소통하는 인사이트 공식 인스타그램 계정입니다. <br /> 📧 각종
                  제보+비즈니스 문의 DM
                </p>
              </ThirdBox>
              <FourthBox>
                <p>
                  Followed by <span>from_minju</span>, <span>_yooohyun_</span>,
                  <span>_heon</span> + 27 more
                </p>
              </FourthBox>
            </UserInfo>
          </UserInfoHeader>
          <TabMenu>
            <MenuWrapper>
              <li>
                <PostsIcon />
                POSTS
              </li>
              <li>
                <ReelsIcon />
                REELS
              </li>
              <li>
                <TaggedIcon />
                TAGGED
              </li>
            </MenuWrapper>
          </TabMenu>
          <PostsWrapper>
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
          </PostsWrapper>
        </MainWrapper>
      </MainContainer>
      <Footer />
    </>
  );
};

export default ProfilePresenter;
