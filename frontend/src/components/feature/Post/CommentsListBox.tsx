import React from 'react';
import styled from 'styled-components';
import { BsHeart } from 'react-icons/bs';
import { useQuery } from '@tanstack/react-query';
import { getCommentsList } from '../../../api/api';

const Container = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  font-weight: 400;
  margin: 0 10px 10px 10px;
  /* border: 1px solid red; */
`;

const Wrapper = styled.div`
  display: flex;
  gap: 0 5px;
  justify-content: flex-start;
  align-items: center;
  /* border: 1px solid blue; */
  div {
    width: fit-content;
    height: fit-content;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
  p {
    width: 340px;
    height: fit-content;
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
    span {
      width: fit-content;
      height: fit-content;
      margin-right: 5px;
      color: ${({ theme }) => theme.hashTagColor};
      cursor: pointer;
    }
  }
`;

const SmallHeartIcon = styled(BsHeart)`
  width: 10px;
  height: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

interface CommentsListBoxType {
  postId: number;
}

const CommentsListBox = ({ postId }: CommentsListBoxType) => {
  const getCommentsListQuery = useQuery(['getCommentsList', postId], () =>
    getCommentsList({ page: 1, postId: postId }),
  );

  // console.log(getCommentsListQuery.data?.data);
  return (
    <>
      {getCommentsListQuery.data?.data.commentList.length > 0 && (
        <Container>
          <Wrapper>
            <div>{getCommentsListQuery.data?.data.commentList[0].username}</div>
            <p>{getCommentsListQuery.data?.data.commentList[0].content}</p>
          </Wrapper>
          <SmallHeartIcon />
        </Container>
      )}
    </>
  );
};

export default CommentsListBox;
