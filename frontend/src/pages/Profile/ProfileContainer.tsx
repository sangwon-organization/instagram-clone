import React, { useRef, useState } from 'react';
import MetaTag from '../../meta/MetaTag';
import ProfilePresenter from '../Profile/ProfilePresenter';
import thumbnail from '../../assets/image/thumbnail.png';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  followingUser,
  getUserInformation,
  setUserProfileImage,
} from '../../api/api';
import { useForm } from 'react-hook-form';

interface postUserProfileImageForm {
  postImage: File;
}

const ProfileContainer = () => {
  const imageInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<postUserProfileImageForm>({ mode: 'onChange' });

  const onSubmit = (dataInput: any) => {
    console.log('유저 프로필 저장 성공!');
    console.log(dataInput);
    const formData = new FormData();
    formData.append('postImage', imageInputRef.current.files[0]);
    console.log(formData);
    postUserProfileImage.mutate(formData);
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const encodeFileToBase64 = (fileBlob: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve: any) => {
      reader.onload = () => {
        const csv: string = reader.result as string;
        setImageSrc(csv);
        resolve();
      };
    });
  };

  const { ref: imageRef, ...postImageRest } = register('postImage', {
    required: true,
  });

  const postUserProfileImage = useMutation(setUserProfileImage, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (userInfo: any) => {
      console.log('유저이미지 등록 성공!');
      refetch();
    },
  });

  const onImageInputButtonClick = (event: any) => {
    event.preventDefault();
    imageInputRef.current.click();
  };

  const { data: getUserInformationData, refetch } = useQuery(
    ['getUserInformation'],
    () => getUserInformation({ targetUserId: parseInt(params.userId) }),
  );

  const myUserId = localStorage.getItem('userId');

  const isMyPage = myUserId === params.userId;

  console.log(getUserInformationData?.data);

  const userFollowingUnFollowing = (e: any) => {
    e.preventDefault();
    if (getUserInformationData.data?.followYn === 'Y') {
      followingUserMutate({
        followUserId: getUserInformationData.data?.userId,
        followYn: 'N',
      });
    } else {
      followingUserMutate({
        followUserId: getUserInformationData.data?.userId,
        followYn: 'Y',
      });
    }
  };

  const { mutate: followingUserMutate, isLoading: followingUserIsLoading } =
    useMutation(followingUser, {
      onError: (err: any) => {
        console.log(err.response.data);
      },
      onSuccess: (e: any) => {
        console.log('유저 팔로우/언팔로우 성공!');
        refetch();
      },
    });
  return (
    <>
      <MetaTag
        title={`@${getUserInformationData?.data.username} ∙ Clonestagram photos and videos`}
        description={`${getUserInformationData?.data.followerCount} Followers, ${getUserInformationData?.data.followingCount} Following, {${getUserInformationData?.data.postCount}} Posts - See Clonestagram photos and videos
        from @${getUserInformationData?.data.username}`}
        keywords="클론코딩, 인스타그램, clone coding"
        url={`https://instagram-clone-sangwon.com/user/${getUserInformationData?.data.userId}`}
        imgsrc={getUserInformationData?.data.profileImage}
      />
      <ProfilePresenter
        getUserInformationData={getUserInformationData}
        onImageInputButtonClick={onImageInputButtonClick}
        imageInputRef={imageInputRef}
        encodeFileToBase64={encodeFileToBase64}
        postImageRest={postImageRest}
        imageRef={imageRef}
        onSubmit={onSubmit}
        onError={onError}
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
