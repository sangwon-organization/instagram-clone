import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BiX } from 'react-icons/bi';
import ModalPortal from './ModalPortal';
import ModalContainer from './ModalContainer';
import DiscardPostModal from './DiscardPostModal';

const Container = styled.div`
  position: relative;
  width: 94px;
  height: 94px;
  min-width: 94px;
  min-height: 94px;
  opacity: 1;
  overflow: hidden;
`;

const ImageItem = styled.img<{ previewimageclicked: boolean }>`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.blackColor};
  aspect-ratio: 1/1;
  filter: ${({ previewimageclicked }) =>
    previewimageclicked ? ' brightness(100%)' : ' brightness(50%)'};
  cursor: pointer;
  &:active {
    transform: scale(1.2);
    transition: transform 0.2s linear;
  }
`;

const DeleteImageButton = styled.div<{ previewimageclicked: boolean }>`
  display: ${({ previewimageclicked }) =>
    previewimageclicked ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #121212;
  color: ${({ theme }) => theme.whiteColor};
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const DeleteIcon = styled(BiX)`
  font-size: 18px;
  color: ${({ theme }) => theme.whiteColor};
`;

const PreviewImage = ({
  image,
  setCurrentSlide,
  imageIndex,
  currentSlide,
  imageSrc,
  setImageSrc,
  setShowPreviewImagesModal,
  totalSlide,
}: PreviewImageType) => {
  const [previewImageClicked, setPreviewImageClicked] = useState(false);
  const [showDiscardPhotoModal, setShowDiscardPhotoModal] = useState(false);

  useEffect(() => {
    const onClick = () => {
      if (imageIndex === currentSlide) {
        setPreviewImageClicked(true);
      } else {
        setPreviewImageClicked(false);
      }
    };
    onClick();
  }, [currentSlide, imageIndex]);

  const openModal = () => {
    setShowDiscardPhotoModal(true);
  };

  const closeModal = () => {
    setShowDiscardPhotoModal(false);
  };

  const handleDeleteImage = (id: number) => {
    setImageSrc(imageSrc.filter((_: any, index: number) => index !== id));
    if (id === totalSlide - 1) {
      setCurrentSlide(totalSlide - 2);
    }
    setShowPreviewImagesModal(false);
    setShowDiscardPhotoModal(false);
  };

  return (
    <Container>
      <ImageItem
        previewimageclicked={previewImageClicked}
        src={image}
        onClick={() => {
          setCurrentSlide(imageIndex);
        }}
      />
      <DeleteImageButton
        previewimageclicked={previewImageClicked}
        onClick={openModal}>
        <DeleteIcon />
      </DeleteImageButton>
      {showDiscardPhotoModal && (
        <ModalPortal>
          <ModalContainer closeModal={closeModal}>
            <DiscardPostModal
              title="Discard photo?"
              question="This will remove the photo from your post."
              closeDiscard={setShowDiscardPhotoModal}
              handleDeleteImage={handleDeleteImage}
              imageIndex={imageIndex}
            />
          </ModalContainer>
        </ModalPortal>
      )}
    </Container>
  );
};

export default PreviewImage;
