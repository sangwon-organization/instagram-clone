import React from 'react';
import NotFoundPresenter from './NotFoundPresenter';
import MetaTag from '../../meta/MetaTag';
import thumbnail from '../../assets/image/thumbnail.png';

const NotFoundContainer = () => {
  return (
    <>
      <MetaTag
        title="Page not found ∙ Clonestagram"
        description="인스타그램을 클론코딩한 웹사이트입니다."
        keywords="클론코딩, 인스타그램"
        url="https://instagram-clone-sangwon.com"
        imgsrc={thumbnail}
      />
      <NotFoundPresenter />
    </>
  );
};

export default NotFoundContainer;
