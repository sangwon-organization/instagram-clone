import React from 'react';
import MetaTag from '../../meta/MetaTag';
import LoginPresenter from './LoginPresenter';
import thumbnail from '../../assets/image/thumbnail.png';

const LoginContainer = () => {
  return (
    <>
      <MetaTag
        title="Clonestagram"
        description="인스타그램을 클론코딩한 웹사이트입니다."
        keywords="클론코딩, 인스타그램"
        url="https://instagram-clone-sangwon.com"
        imgsrc={thumbnail}
      />
      <LoginPresenter />
    </>
  );
};

export default LoginContainer;
