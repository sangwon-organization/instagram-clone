import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { GoKebabHorizontal } from 'react-icons/go';
import Post from '../../components/feature/Profile/Post';
import NavigationBar from '../../components/layout/NavigationBar/NavigationBar';
import userProfile from '../../assets/image/userProfile.png';
import { SlArrowDown } from 'react-icons/sl';
import { FaUserCheck } from 'react-icons/fa';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { BiMoviePlay } from 'react-icons/bi';
import { IoAppsSharp } from 'react-icons/io5';
import Footer from '../../components/layout/footer/Footer';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getPostsList,
  getUserInformation,
  setUserProfileImage,
} from '../../api/api';
import { useParams } from 'react-router-dom';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.bgColor};
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
  background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    z-index: 100;
  }
  input {
    display: none;
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
    color: ${({ theme }) => theme.textColor};
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
    line-height: 24px;
    color: ${({ theme }) => theme.textColor};
  }
`;
const FourthBox = styled.div`
  width: fit-content;
  height: 16px;
  color: ${({ theme }) => theme.greyTextColor};
  font-size: 12px;
  font-weight: 600;
  span {
    color: ${({ theme }) => theme.textColor};
  }
`;

const KebabMenuIcon = styled(GoKebabHorizontal)`
  width: 27px;
  height: 27px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  /* border: 1px solid red; */
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
  width: 80px;
  height: 30px;
  padding: 5px 9px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  background: transparent;
  color: ${({ theme }) => theme.textColor};
`;
const FollowButton = styled.button`
  width: 72px;
  height: 30px;
  padding: 5px 9px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  background: transparent;
  color: ${({ theme }) => theme.textColor};
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
  width: 100%;
  height: 53px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
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
    color: ${({ theme }) => theme.greyTextColor};
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
  const imageInput = useRef(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  const params = useParams();

  const setUserImage = () => {};
  const encodeFileToBase64 = (fileBlob: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve: any) => {
      reader.onload = () => {
        const csv: string = reader.result as string;
        setImageSrc(csv);
        const formData = new FormData();
        formData.append('postImage', imageSrc);
        postUserProfileImage.mutate(formData);
        resolve();
      };
    });
  };

  const submitFormData = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('postImage', imageSrc);
    postUserProfileImage.mutate(formData);
  };

  const postUserProfileImage = useMutation(setUserProfileImage, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (userInfo: any) => {
      console.log('유저이미지 등록 성공!');
    },
  });

  const onImageInputButtonClick = (event: any) => {
    event.preventDefault();
    imageInput.current.click();
  };

  const { data } = useQuery(['getUserInformation'], () =>
    getUserInformation({ targetUserId: parseInt(params.userId) }),
  );

  console.log(data?.data);

  return (
    <>
      <NavigationBar />
      <MainContainer>
        <MainWrapper>
          <UserInfoHeader>
            <AvatarWrapper>
              <UserAvatar>
                <img
                  src={data?.data.profileImage}
                  alt="기본이미지"
                  onClick={onImageInputButtonClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInput}
                  onChange={(e) => {
                    encodeFileToBase64(e.target.files[0]);
                  }}
                />
              </UserAvatar>
            </AvatarWrapper>
            <UserInfo>
              <FirstBox>
                <h2>{data?.data.username}</h2>
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
                  <span>{data?.data.postCount}</span> posts
                </p>
                <p>
                  <span>{data?.data.followerCount}</span> followers
                </p>
                <p>
                  <span>{data?.data.followingCount}</span> following
                </p>
              </SecondBox>
              <ThirdBox>
                <p>{data?.data.name}</p>
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
            {data?.data.postList.map((post: any) => (
              <Post
                key={post.postId}
                postImageList={post.postImageList}
                postId={post.postId}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
              />
            ))}
          </PostsWrapper>
        </MainWrapper>
      </MainContainer>
      <Footer />
    </>
  );
};

export default ProfilePresenter;
