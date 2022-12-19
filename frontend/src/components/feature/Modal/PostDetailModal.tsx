import React, { useRef } from 'react';
import styled from 'styled-components';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import Loader from 'react-loader';
import { useMutation } from '@tanstack/react-query';
import { commentPost } from '../../../api/api';

const Wrapper = styled.div`
  display: flex;
  width: 930px;
  height: 600px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  img {
    width: 593px;
    height: 598px;
  }
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const PostHeader = styled.div`
  width: 335px;
  height: 70px;
  border-bottom: 1px solid ${({ theme }) => theme.ultraLightGreyColor};
`;

const CommentsListBox = styled.div`
  width: 100%;
  height: 348px;
  border-bottom: 1px solid ${({ theme }) => theme.ultraLightGreyColor};
`;

const PostBottom = styled.div`
  width: 100%;
  height: 182px;
`;

const AddCommentBox = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: fit-content;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  textarea {
    width: 375px;
    height: 20px;
    margin-left: 10px;
    border: none;
    background: transparent;
    font-family: 'RobotoFont';
    resize: none;
    outline: none;
  }
  button {
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.buttonColor};
    &:disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }
`;

const SmileIcon = styled(HiOutlineEmojiHappy)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
`;

const PostDetailModal = () => {
  const textareaRef = useRef(null);
  const postButtonRef = useRef(null);

  const isDisabled = (e: any) => {
    if (e.target.value === '') {
      postButtonRef.current.disabled = true;
    } else {
      postButtonRef.current.disabled = false;
    }
  };

  const registerComment = (e: any) => {
    e.preventDefault();
    if (isLoading) {
      postButtonRef.current.disabled = true;
    }
  };

  const { mutate, data, error, reset, isLoading } = useMutation(commentPost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('댓글 등록 성공!');
      textareaRef.current.value = '';
      textareaRef.current.focus();
    },
  });
  return (
    <div>
      <Wrapper>
        <img src="" alt="" />
        <PostInfo>
          <PostHeader></PostHeader>
          <CommentsListBox></CommentsListBox>
          <PostBottom>
            <AddCommentBox>
              <SmileIcon />
              <textarea
                name=""
                id=""
                onChange={(e: any) => isDisabled(e)}
                ref={textareaRef}
                placeholder="Add a comment..."></textarea>
              {isLoading && (
                <Loader
                  loaded={false}
                  color="#8e8e8e"
                  scale={0.7}
                  top="50%"
                  left="50%"
                />
              )}
              <button
                type="submit"
                ref={postButtonRef}
                disabled
                onClick={(e: any) => registerComment(e)}>
                Post
              </button>
            </AddCommentBox>
          </PostBottom>
        </PostInfo>
      </Wrapper>
    </div>
  );
};

export default PostDetailModal;
