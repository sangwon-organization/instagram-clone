import React from 'react';
import MetaTag from '../../meta/MetaTag';
import LoginPresenter from './LoginPresenter';
import thumbnail from '../../assets/image/thumbnail.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/configureStore';

const LoginContainer = () => {
  const isLogin = useSelector((state: RootState) => state.login.isLogin);

  return (
    <>
      <MetaTag
        title="Clonestagram"
        description="인스타그램을 클론코딩한 웹사이트입니다."
        keywords="클론코딩, 인스타그램"
        url="https://instagram-clone-sangwon.com"
        imgsrc={thumbnail}
      />
      <LoginPresenter isLogin={isLogin} />
    </>
  );
};

export default LoginContainer;
