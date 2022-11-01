import React from 'react';
import MetaTag from '../../meta/MetaTag';
import HomePresenter from './HomePresenter';
import thumbnail from '../../assets/image/thumbnail.png';

const HomeContainer = () => {
  return (
    <>
      <MetaTag
        title="인스타그램 클론코딩"
        description="인스타그램을 클론코딩한 웹사이트입니다."
        keywords="클론코딩, 인스타그램"
        url="https://instagram-clone-sangwon.com"
        imgsrc={thumbnail}
      />
      <HomePresenter />
    </>
  );
};

export default HomeContainer;
