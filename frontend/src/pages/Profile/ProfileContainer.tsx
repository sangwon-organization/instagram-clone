import React from 'react';
import MetaTag from '../../meta/MetaTag';
import ProfilePresenter from '../Profile/ProfilePresenter';
import thumbnail from '../../assets/image/thumbnail.png';

const ProfileContainer = () => {
  return (
    <>
      <MetaTag
        title="username (@usernickname) ∙ 인스타그램 클론코딩사진 및 동영상"
        description="314k Followers, 612 Following, 470 Posts - See Instagram photos and videos
        from username (@usernickname)"
        keywords="클론코딩, 인스타그램"
        url="https://d317rrnl7xcgph.cloudfront.net/profile"
        imgsrc={thumbnail}
      />
      <ProfilePresenter />
    </>
  );
};

export default ProfileContainer;
