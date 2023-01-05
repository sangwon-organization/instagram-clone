import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 400px;
  height: 201px;
  border-radius: 10px;
  background: ${({ theme }) => theme.dropDownBgColor};
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px 0;
  width: 400px;
  height: 107px;
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;
const Button = styled.button<{ last?: boolean }>`
  width: 100%;
  height: 47px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.textColor};
  &:active {
    border-bottom-left-radius: ${({ last }) => last && '10px'};
    border-bottom-right-radius: ${({ last }) => last && '10px'};
    backdrop-filter: brightness(0.9);
  }
  &:nth-child(2) {
    font-weight: 700;
    color: #ed4956;
  }
`;

const DiscardPostModal = ({
  title,
  question,
  onClickDiscard,
  closeDiscard,
  handleDeleteImage,
  imageIndex,
}: DiscardPostModalType) => {
  const discardImageOrPost = () => {
    if (title === 'Discard photo?') {
      handleDeleteImage(imageIndex);
    } else {
      onClickDiscard();
    }
  };

  return (
    <Container>
      <Title>
        <h3>{title}</h3>
        <p>{question}</p>
      </Title>
      <Button onClick={() => discardImageOrPost()}>Discard</Button>
      <Button last onClick={() => closeDiscard(false)}>
        Cancel
      </Button>
    </Container>
  );
};

export default DiscardPostModal;
