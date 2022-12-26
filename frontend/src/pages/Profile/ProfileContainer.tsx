import React, { useRef, useState } from 'react';
import MetaTag from '../../meta/MetaTag';
import ProfilePresenter from '../Profile/ProfilePresenter';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  followingUser,
  getUserInformation,
  setUserProfileImage,
} from '../../api/api';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

const ProfileContainer = () => {
  const imageInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  const params = useParams();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<PostUserProfileImageFormValues>({ mode: 'onChange' });

  const onSubmit = () => {
    console.log('유저 프로필 저장 성공!');
    const formData = new FormData();
    formData.append('postImage', imageInputRef.current.files[0]);
    postUserProfileImage.mutate(formData);
  };

  const { ref: imageRef, ...postImageRest } = register('postImage', {
    required: true,
  });

  const postUserProfileImage = useMutation<ResponseData, AxiosError, FormData>(
    setUserProfileImage,
    {
      onError: (err) => {
        console.log('유저이미지 등록 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('유저이미지 등록 성공!');
        queryClient.invalidateQueries(['getUserInformation', 'getUserProfile']);
      },
    },
  );

  const onImageInputButtonClick = () => {
    imageInputRef.current.click();
  };

  const { data: getUserInformationData } = useQuery<
    GetUserInformationDataType,
    AxiosError
  >(['getUserInformation'], () =>
    getUserInformation({ targetUserId: parseInt(params.userId) }),
  );

  const myUserId = localStorage.getItem('userId');

  const isMyPage = myUserId === params.userId;

  console.log(getUserInformationData);

  const userFollowingUnFollowing = () => {
    if (getUserInformationData?.followYn === 'Y') {
      followingUserMutate({
        followUserId: getUserInformationData?.userId,
        followYn: 'N',
      });
    } else {
      followingUserMutate({
        followUserId: getUserInformationData?.userId,
        followYn: 'Y',
      });
    }
  };

  const { mutate: followingUserMutate, isLoading: followingUserIsLoading } =
    useMutation<ResponseData, AxiosError, FollowingUserType>(followingUser, {
      onError: (err) => {
        console.log('유저 팔로우/언팔로우 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('유저 팔로우/언팔로우 성공!');
        queryClient.invalidateQueries(['getUserInformation']);
      },
    });
  return (
    <>
      <MetaTag
        title={`@${getUserInformationData?.username} ∙ Clonestagram photos and videos`}
        description={`${getUserInformationData?.followerCount} Followers, ${getUserInformationData?.followingCount} Following, {${getUserInformationData?.postCount}} Posts - See Clonestagram photos and videos
        from @${getUserInformationData?.username}`}
        keywords="클론코딩, 인스타그램, clone coding"
        url={`https://instagram-clone-sangwon.com/user/${getUserInformationData?.userId}`}
        imgsrc={getUserInformationData?.profileImage}
      />
      <ProfilePresenter
        getUserInformationData={getUserInformationData}
        onImageInputButtonClick={onImageInputButtonClick}
        imageInputRef={imageInputRef}
        postImageRest={postImageRest}
        imageRef={imageRef}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        isLoading={postUserProfileImage.isLoading}
        isMyPage={isMyPage}
        userFollowingUnFollowing={userFollowingUnFollowing}
        followingUserIsLoading={followingUserIsLoading}
      />
    </>
  );
};

export default ProfileContainer;
