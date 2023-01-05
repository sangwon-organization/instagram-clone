import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../api/api';
import MetaTag from '../../meta/MetaTag';
import PostPresenter from './PostPresenter';

const PostContainer = () => {
  let params = useParams();

  let postId = parseInt(params.postId);

  const {
    data: getUserPostData,
    error: getPostError,
    isLoading: getPostLoading,
  } = useQuery<GetPostQueryType, AxiosError<Error>>(
    ['getPost', postId],
    () => getPost(postId),
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      <MetaTag
        title={`@${getUserPostData?.username} on Clonestagram: "${getUserPostData?.content}"`}
        description={`${getUserPostData?.likeCount} Likes, ${getUserPostData?.commentCount} Comments - @${getUserPostData?.username} on Clonestagram: "${getUserPostData?.content}"`}
        keywords="클론코딩, 인스타그램, clone coding"
        url={`https://instagram-clone-sangwon.com/post/${postId}`}
        imgsrc={getUserPostData?.postImageList[0]}
      />
      <PostPresenter
        postId={postId}
        getPostError={getPostError}
        getPostLoading={getPostLoading}
      />
    </>
  );
};

export default PostContainer;
