import React, { useRef, useState } from 'react';
import MetaTag from '../../meta/MetaTag';
import ProfilePresenter from '../Profile/ProfilePresenter';
import thumbnail from '../../assets/image/thumbnail.png';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserInformation, setUserProfileImage } from '../../api/api';

const ProfileContainer = () => {
  const imageInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  const params = useParams();

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
    imageInputRef.current.click();
  };

  const { data: getUserInformationData } = useQuery(
    ['getUserInformation'],
    () => getUserInformation({ targetUserId: parseInt(params.userId) }),
  );

  console.log(getUserInformationData?.data);
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
      />
    </>
  );
};

export default ProfileContainer;
