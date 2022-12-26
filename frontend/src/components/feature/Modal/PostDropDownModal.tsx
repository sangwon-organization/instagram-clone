import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import DeleteConfirmModal from './DeleteConfirmModal';

const Container = styled.div<{
  ismypost: boolean;
}>`
  width: 400px;
  height: fit-content;
  background: ${({ theme }) => theme.dropDownBgColor};
  border-radius: 10px;
`;

const Button = styled.button<{ first?: boolean; last?: boolean }>`
  width: 100%;
  height: 48px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.textColor};
  &:active {
    border-top-left-radius: ${({ first }) => first && '10px'};
    border-top-right-radius: ${({ first }) => first && '10px'};
    border-bottom-left-radius: ${({ last }) => last && '10px'};
    border-bottom-right-radius: ${({ last }) => last && '10px'};
    background: ${({ theme }) => theme.ultraLightGreyColor};
  }
  &:first-child {
    border-top: none;
    font-weight: 700;
    color: ${({ theme }) => theme.errorColor};
  }
`;

const PostDropDownModal = ({
  isMyPost,
  postId,
  userId,
}: PostDropDownModalType) => {
  const [deleteButtonClicked, setdeleteButtonClicked] = useState(false);
  const navigate = useNavigate();
  const { postId: urlPostId } = useParams();

  if (deleteButtonClicked) {
    return <DeleteConfirmModal postId={postId} userId={userId} />;
  }

  return (
    <Container ismypost={isMyPost}>
      {isMyPost ? (
        <Button first onClick={() => setdeleteButtonClicked(true)}>
          Delete
        </Button>
      ) : (
        <Button first>Report</Button>
      )}
      {isMyPost && <Button>Edit</Button>}
      {isMyPost && <Button>Unhide like count</Button>}
      {isMyPost && <Button>Turn on Commenting</Button>}
      {!urlPostId && (
        <Button onClick={() => navigate(`/post/${postId}`)}>Go to post</Button>
      )}
      <Button>Share to...</Button>
      <Button>Copy link</Button>
      <Button>Embed</Button>
      <Button last>Cancel</Button>
    </Container>
  );
};

export default PostDropDownModal;
