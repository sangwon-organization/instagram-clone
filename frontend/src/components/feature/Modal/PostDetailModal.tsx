import React, { useRef } from 'react';
import styled from 'styled-components';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import Loader from 'react-loader';
import { useMutation } from '@tanstack/react-query';
import { commentPost } from '../../../api/api';

const Wrapper = styled.div`
  width: 930px;
  height: 600px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;

  img {
    width: 593px;
    height: 598px;
  }
`;

const PostInfo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PostHeader = styled.div`
  width: 335px;
  height: 70px;
  border-bottom: 1px solid ${({ theme }) => theme.ultraLightGreyColor};
`;

const CommentsListBox = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.ultraLightGreyColor};
  width: 100%;
  height: 348px;
`;

const PostBottom = styled.div`
  width: 100%;
  height: 182px;
`;

const AddCommentBox = styled.form`
  width: 100%;
  height: fit-content;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  position: relative;
  textarea {
    width: 375px;
    height: 20px;
    border: none;
    resize: none;
    outline: none;
    margin-left: 10px;
    background: transparent;
    font-family: 'RobotoFont';
  }
  button {
    font-size: 14px;
    font-weight: 600;
    color: #0095f6;
    background: transparent;
    border: none;
    &:disabled {
      pointer-events: none;
      opacity: 0.4;
    }
  }
`;

const SmileIcon = styled(HiOutlineEmojiHappy)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
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
    // mutate({
    //   postId: postId,
    //   parentCommentId: '',
    //   content: textareaRef.current.value,
    // });
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
