import React, { useRef } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import useOutsideClick from '../../../hooks/useOutsideClick';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(2, 2, 2, 0.6);
`;

const ModalBlock = styled.div`
  position: fixed;
  width: fit-content;
  height: fit-content;
  overflow: hidden;
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
`;

const CloseIcon = styled(IoClose)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  color: ${({ theme }) => theme.whiteColor};
  cursor: pointer;
`;

type ModalContainerProps = {
  closeModal: Function;
  createPost?: any;
  children: any;
};

function ModalContainer({
  closeModal,
  createPost,
  children,
}: ModalContainerProps) {
  const outsideRef = useRef();

  useOutsideClick(outsideRef, closeModal);
  return (
    <Container>
      <Background />
      {createPost && <CloseIcon />}
      <ModalBlock>
        <Contents ref={outsideRef}>{children}</Contents>
      </ModalBlock>
    </Container>
  );
}

export default ModalContainer;
