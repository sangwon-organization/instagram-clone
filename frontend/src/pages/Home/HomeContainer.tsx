import React, { useEffect } from 'react';
import MetaTag from '../../meta/MetaTag';
import HomePresenter from './HomePresenter';
import thumbnail from '../../assets/image/thumbnail.png';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getPostsList } from '../../api/api';

const HomeContainer = () => {
  const [ref, inView] = useInView();

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: getPostsData,
  } = useInfiniteQuery<PageType, AxiosError>(
    ['getPosts'],
    ({ pageParam = 1 }) => getPostsList({ page: pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.postList.length === 10) {
          return allPages.length + 1;
        } else {
          return false;
        }
      },
    },
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      <MetaTag
        title="Clonestagram"
        description="인스타그램을 클론코딩한 웹사이트입니다."
        keywords="클론코딩, 인스타그램"
        url="https://instagram-clone-sangwon.com"
        imgsrc={thumbnail}
      />
      <HomePresenter
        getPostsData={getPostsData}
        scrollRef={ref}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};

export default HomeContainer;
