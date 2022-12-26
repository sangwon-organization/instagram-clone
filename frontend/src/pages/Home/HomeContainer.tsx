import React, { useEffect, useState } from 'react';
import MetaTag from '../../meta/MetaTag';
import HomePresenter from './HomePresenter';
import thumbnail from '../../assets/image/thumbnail.png';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getCommentsList,
  getPostsList,
  getUserInformation,
} from '../../api/api';

const HomeContainer = () => {
  const [ref, inView] = useInView();

  const [refetchPageIndex, setRefetchPageIndex] = useState<number | null>(null);
  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    data: getPostsData,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['getPosts'],
    queryFn: ({ pageParam = 1 }) => getPostsList({ page: pageParam }),
    getNextPageParam: (lastPage: any, allPages: any) =>
      Number(lastPage.page) + 1,

    getPreviousPageParam: (firstPage: number, allPages: any) => undefined,
  });

  useEffect(() => {
    if (refetchPageIndex !== null) {
      refetch({ refetchPage: (page, index) => index === refetchPageIndex });
      setRefetchPageIndex(null);
    }
  }, [refetchPageIndex, refetch]);

  // const refetchPage = (pageIndex: number) => setRefetchPageIndex(pageIndex);

  console.log(getPostsData);

  useEffect(() => {
    if (inView) {
      console.log(inView);
      fetchNextPage();
      console.log(getPostsData);
    }
  }, [inView, fetchNextPage, getPostsData]);

  return (
    <>
      <MetaTag
        title="Clonestagram"
        description="인스타그램을 클론코딩한 웹사이트입니다."
        keywords="클론코딩, 인스타그램"
        url="https://instagram-clone-sangwon.com"
        imgsrc={thumbnail}
      />
      <HomePresenter getPostsData={getPostsData} scrollRef={ref} />
    </>
  );
};

export default HomeContainer;
