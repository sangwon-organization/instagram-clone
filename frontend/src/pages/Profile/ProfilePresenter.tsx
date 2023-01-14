import React from 'react';
import styled from 'styled-components';
import { GoKebabHorizontal } from 'react-icons/go';
import { SlArrowDown } from 'react-icons/sl';
import { FaUserCheck } from 'react-icons/fa';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { BiMoviePlay } from 'react-icons/bi';
import { IoAppsSharp } from 'react-icons/io5';
import NavigationBar from '../../components/feature/NavigationBar/NavigationBar';
import Post from '../../components/feature/Profile/Post';
import Footer from '../../components/feature/Footer/Footer';
import Loader from 'react-loader';
import NoPostsBox from '../../components/feature/Post/NoPostsBox';
import SharesPhotosBox from '../../components/feature/Post/SharesPhotosBox';
import { IoIosSettings } from 'react-icons/io';
import NotFound from '../NotFound404';
import LoadingPage from '../../components/share/LoadingPage';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 60px;
  background: ${({ theme }) => theme.bgColor};
`;

const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 936px;
  height: fit-content;
`;

const UserInfoHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
`;

const AvatarWrapper = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 291px;
  height: fit-content;
`;

const UserAvatar = styled.div<{ isloading: boolean; ismypage: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 168px;
  height: 168px;
  border: 2px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: ${({ isloading, ismypage }) =>
    isloading || !ismypage ? 'default' : 'pointer'};
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    opacity: ${({ isloading }) => isloading && 0.4};
    z-index: 100;
  }
  input {
    display: none;
  }
`;
const UserInfo = styled.section`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px 0;
  width: 613px;
  height: fit-content;
  padding: 30px 0;
`;

const FirstBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 30px;
  width: 100%;
  h2 {
    font-size: 28px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 15px;
  width: fit-content;
  height: 100%;
`;

const SecondBox = styled.div`
  display: flex;
  gap: 0 30px;
  width: fit-content;
  height: 24px;
  p {
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
    span {
      font-weight: 600;
    }
  }
`;
const ThirdBox = styled.div`
  width: 100%;
  height: fit-content;
  p {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
`;
const FourthBox = styled.div`
  width: fit-content;
  height: 16px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.greyTextColor};
  span {
    color: ${({ theme }) => theme.textColor};
  }
`;

const KebabMenuIcon = styled(GoKebabHorizontal)`
  width: 27px;
  height: 27px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
`;

const ArrowDownIcon = styled(SlArrowDown)`
  width: 10px;
  height: 10px;
  color: ${({ theme }) => theme.textColor};
`;

const UserCheckIcon = styled(FaUserCheck)`
  width: 18px;
  height: 18px;
`;

const MessageButton = styled.button`
  width: fit-content;
  height: 30px;
  padding: 5px 9px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const UnFollowButton = styled.button`
  position: relative;
  width: 38px;
  height: 30px;
  padding: 5px 9px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  background: transparent;
  color: ${({ theme }) => theme.textColor};
`;

const FollowButon = styled.button`
  position: relative;
  width: 62px;
  height: 30px;
  padding: 5px 9px;
  border: none;
  border-radius: 5px;
  background: ${({ theme }) => theme.buttonColor};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.whiteColor};
  &:active {
    opacity: 0.7;
  }
  &:hover {
    background: #1872f2;
  }
`;

const SuggestedButton = styled.button`
  width: 34px;
  height: 30px;
  padding: 5px 9px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  background: transparent;
  color: ${({ theme }) => theme.textColor};
`;
const TabMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 53px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
`;

const MenuWrapper = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 280px;
  height: 100%;
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: 100%;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.greyTextColor};
    letter-spacing: 1px;
    cursor: pointer;
    &:active {
      opacity: 0.7;
    }
    &:first-child {
      border-top: 1px solid ${({ theme }) => theme.textColor};
      color: ${({ theme }) => theme.textColor};
    }
  }
`;

const SettingsIcon = styled(IoIosSettings)`
  font-size: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 28px 28px;
  width: 100%;
  height: fit-content;
`;

const ProfilePresenter = ({
  getUserInformationData,
  onImageInputButtonClick,
  imageInputRef,
  postImageRest,
  imageRef,
  onSubmit,
  handleSubmit,
  isLoading,
  isMyPage,
  followingUserIsLoading,
  userFollowingUnFollowing,
  followerImFollowingList,
  followerImFollowingRestCount,
  getUserInformationError,
  getUserInformationLoading,
}: ProfilePresenterType) => {
  if (
    getUserInformationError?.response.data.message ===
    `Cannot read property 'userId' of null`
  ) {
    return <NotFound />;
  }

  if (getUserInformationLoading) {
    return <LoadingPage />;
  }
  return (
    <>
      <NavigationBar />
      <MainContainer>
        <MainWrapper>
          <UserInfoHeader>
            <AvatarWrapper>
              <UserAvatar isloading={isLoading} ismypage={isMyPage}>
                <img
                  src={getUserInformationData?.profileImage}
                  alt="기본이미지"
                  onClick={onImageInputButtonClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  disabled={isLoading || !isMyPage}
                  {...postImageRest}
                  ref={(e) => {
                    imageRef(e);
                    imageInputRef.current = e;
                  }}
                  onChange={handleSubmit(onSubmit)}
                />
                {isLoading && (
                  <Loader
                    loaded={!isLoading}
                    color="#fafafa"
                    scale={0.8}
                    top="50%"
                    left="50%"
                  />
                )}
              </UserAvatar>
            </AvatarWrapper>
            <UserInfo>
              <FirstBox>
                <h2>{getUserInformationData?.username}</h2>
                {isMyPage ? (
                  <ButtonBox>
                    <MessageButton>Edit profile</MessageButton>
                    <SettingsIcon />
                  </ButtonBox>
                ) : (
                  <ButtonBox>
                    {getUserInformationData?.followYn === 'Y' ? (
                      <MessageButton>Message</MessageButton>
                    ) : null}
                    {getUserInformationData?.followYn === 'Y' ? (
                      <UnFollowButton onClick={userFollowingUnFollowing}>
                        {followingUserIsLoading ? (
                          <Loader
                            loaded={isLoading}
                            color="#000"
                            scale={0.3}
                            top="50%"
                            left="50%"
                          />
                        ) : (
                          <UserCheckIcon />
                        )}
                      </UnFollowButton>
                    ) : (
                      <FollowButon onClick={userFollowingUnFollowing}>
                        {followingUserIsLoading ? (
                          <Loader
                            loaded={isLoading}
                            color="#fafafa"
                            scale={0.4}
                            top="50%"
                            left="50%"
                          />
                        ) : (
                          'Follow'
                        )}
                      </FollowButon>
                    )}
                    <SuggestedButton>
                      <ArrowDownIcon />
                    </SuggestedButton>
                    <KebabMenuIcon />
                  </ButtonBox>
                )}
              </FirstBox>
              <SecondBox>
                <p>
                  <span>{getUserInformationData?.postCount}</span> posts
                </p>
                <p>
                  <span>{getUserInformationData?.followerCount}</span> followers
                </p>
                <p>
                  <span>{getUserInformationData?.followingCount}</span>{' '}
                  following
                </p>
              </SecondBox>
              <ThirdBox>
                <p>{getUserInformationData?.name}</p>
              </ThirdBox>
              <FourthBox>
                {!isMyPage && followerImFollowingList?.length > 0 && (
                  <p>
                    Followed by{' '}
                    {followerImFollowingList.map(
                      (list: followerImFollowingListType, index: number) => {
                        return (
                          <span key={`list_${index}`}>
                            {(index ? ', ' : '') + list.username}
                          </span>
                        );
                      },
                    )}{' '}
                    {followerImFollowingRestCount > 0 &&
                      `+ ${followerImFollowingRestCount} more`}
                  </p>
                )}
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
          {getUserInformationData?.postList.length > 0 ? (
            <PostsWrapper>
              {getUserInformationData?.postList.map((post: PostListType) => (
                <Post
                  key={post.postId}
                  postImageList={post.postImageList}
                  postId={post.postId}
                  userId={post.userId}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                />
              ))}
            </PostsWrapper>
          ) : isMyPage ? (
            <SharesPhotosBox />
          ) : (
            <NoPostsBox />
          )}
        </MainWrapper>
      </MainContainer>
      <Footer />
    </>
  );
};

export default ProfilePresenter;
