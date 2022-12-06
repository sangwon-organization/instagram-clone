import React, { useEffect, useState } from 'react';
import MetaTag from '../../meta/MetaTag';
import HomePresenter from './HomePresenter';
import thumbnail from '../../assets/image/thumbnail.png';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostsList } from '../../api/api';

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
    data,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['getPosts'],
    queryFn: ({ pageParam = 1 }) => getPostsList({ page: pageParam }),
    getNextPageParam: (lastPage: any, allPages: any) =>
      Number(lastPage.data.page) + 1,

    getPreviousPageParam: (firstPage: any, allPages: any) => undefined,
  });

  useEffect(() => {
    if (refetchPageIndex !== null) {
      refetch({ refetchPage: (page, index) => index === refetchPageIndex });
      setRefetchPageIndex(null);
    }
  }, [refetchPageIndex, refetch]);

  const refetchPage = (pageIndex: number) => setRefetchPageIndex(pageIndex);

  console.log(data);

  useEffect(() => {
    if (inView) {
      console.log(inView);
      fetchNextPage();
      console.log(data);
    }
  }, [inView, fetchNextPage, data]);
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
        data={data}
        refetchPage={refetchPage}
        scrollRef={ref}
        refetch={refetch}
      />
    </>
  );
};

export default HomeContainer;
