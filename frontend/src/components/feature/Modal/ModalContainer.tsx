import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import useOutsideClick from '../../../hooks/useOutsideClick';
import CreatePostModal from './CreatePostModal';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  /* border: 1px solid red; */
  /* padding: 10px; */
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
  /* border: 1px solid blue; */
`;

const CloseIcon = styled(IoClose)`
  font-size: 30px;
  color: #fff;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

type ModalContainerProps = {
  closeModal: Function;
};

function ModalContainer({ closeModal }: ModalContainerProps) {
  const outsideRef = useRef();

  useOutsideClick(outsideRef, closeModal);
  return (
    <Container>
      <Background />
      <CloseIcon />
      <ModalBlock>
        <Contents ref={outsideRef}>
          <CreatePostModal />
        </Contents>
      </ModalBlock>
    </Container>
  );
}

export default ModalContainer;
