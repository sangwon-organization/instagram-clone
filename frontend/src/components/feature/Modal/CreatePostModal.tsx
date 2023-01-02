import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IoImagesOutline } from 'react-icons/io5';
import { BiArrowBack } from 'react-icons/bi';
import { addPost } from '../../../api/api';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Loader from 'react-loader';
import { FiCheck } from 'react-icons/fi';
import ModalPortal from './ModalPortal';
import ModalContainer from './ModalContainer';
import DiscardPostModal from './DiscardPostModal';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { FaCircle } from 'react-icons/fa';
import { TbCopy } from 'react-icons/tb';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';
import PreviewImage from './PreviewImage';
import { AxiosError } from 'axios';

const Container = styled.form<{ nextmodal?: boolean }>`
  width: ${({ nextmodal }) => (nextmodal ? '1120px' : '768px')};
  height: 808px;
  border-radius: 10px;
  background: ${({ theme }) => theme.dropDownBgColor};
  transition: width 0.5s ease-in-out;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const Wrapper = styled.div`
  display: flex;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px 0;
  position: relative;
  width: 768px;
  height: 768px;
  overflow: hidden;
  p {
    font-size: 22px;
    font-weight: 300;
    color: ${({ theme }) => theme.textColor};
  }

  button {
    padding: 5px 9px;
    border: none;
    border-radius: 5px;
    background: ${({ theme }) => theme.buttonColor};
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.whiteColor};
    &:active {
      opacity: 0.6;
    }
  }
  input {
    display: none;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageIcon = styled(IoImagesOutline)`
  font-size: 50px;
  color: ${({ theme }) => theme.textColor};
`;

const ImagesIconCircle = styled.div<{ showpreviewimagesmodal: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${({ showpreviewimagesmodal }) =>
    showpreviewimagesmodal === 'true' ? '#fafafa' : '#121212'};
  opacity: 0.8;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
  &:active {
    filter: brightness(0.5);
  }
`;

const PreviewImagesModal = styled.div<{ showpreviewimagesmodal: string }>`
  display: ${({ showpreviewimagesmodal }) =>
    showpreviewimagesmodal === 'true' ? 'flex' : 'none'};
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  position: absolute;
  bottom: 60px;
  right: 15px;
  width: fit-content;
  max-width: 740px;
  height: 115px;
  padding: 10px;
  border-radius: 10px;
  background: #262626;
  opacity: 0.8;
  overflow-x: scroll;
  transition: all 0.5s linear;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ImagesIcon = styled(TbCopy)<{ showpreviewimagesmodal: string }>`
  font-size: 20px;
  color: ${({ theme, showpreviewimagesmodal }) =>
    showpreviewimagesmodal === 'true' ? theme.blackColor : theme.whiteColor};
`;

const NextButton = styled.button`
  position: absolute;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.buttonColor};
`;

const CaptionBox = styled.div`
  width: 352px;
  height: 768px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-top: none;
  border-bottom-right-radius: 10px;
`;

const UserAccountWrapper = styled.div`
  display: flex;
  justify-content: flex-stert;
  align-items: center;
  gap: 0 15px;
  width: 100%;
  height: 56px;
  padding-left: 15px;
  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px 0;
  width: 280px;
  height: 30px;
  p {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
`;

const TextBox = styled.textarea`
  width: 100%;
  height: 50%;
  padding: 10px;
  border: none;
  background: ${({ theme }) => theme.dropDownBgColor};
  font-family: 'RobotoFont';
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  outline: none;
  resize: none;
  &:focus::placeholder {
    color: ${({ theme }) => theme.footerTextColor};
  }
`;

const TextLength = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 15px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.footerTextColor};
`;

const TitleLeftArrowIcon = styled(BiArrowBack)`
  position: absolute;
  left: 15px;
  font-size: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
`;

const MeatballIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 3px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: fit-content;
  height: fit-content;
  padding: 0 10px;
  margin-right: 80px;
  transform: translate3d(-50%, 0, 0);
`;

const MeatballIcon = styled(FaCircle)<{ index: number; currentslide: number }>`
  width: 6px;
  height: 6px;
  color: ${({ theme, index, currentslide }) =>
    index === currentslide ? theme.buttonColor : theme.greyTextColor};
`;

const ImageWrapper = styled.div<{ nextModal: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  aspect-ratio: 4/5;
  img {
    flex: none;
    width: 100%;
    height: 100%;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: ${({ nextModal }) => (nextModal ? '' : '10px')};
    background: ${({ theme }) => theme.blackColor};
    object-fit: cover;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-select: none;
    transition: border-bottom-right-radius 0.5s ease-in-out;
  }
`;

const UserAvatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 90px;
  border: 4px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(
      ${({ theme }) => theme.dropDownBgColor},
      ${({ theme }) => theme.dropDownBgColor}
    ),
    linear-gradient(to right, #ff0000 0%, #ffa500 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    width: 57px;
    height: 57px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const CheckIcon = styled(FiCheck)`
  font-size: 55px;
  color: #f60273;
`;

const LeftArrowIcon = styled(IoIosArrowDropleftCircle)<{
  currentslide: number;
}>`
  display: ${({ currentslide }) => currentslide === 0 && 'none'};
  position: absolute;
  top: 50%;
  left: 15px;
  width: 30px;
  height: 30px;
  color: #121212;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  transform: translate3d(0, -50%, 0);
  cursor: pointer;
  z-index: 200;
`;

const RightArrowIcon = styled(IoIosArrowDroprightCircle)<{
  currentslide: number;
  totalslides: number;
}>`
  display: ${({ currentslide, totalslides }) =>
    currentslide === totalslides - 1 && 'none'};
  position: absolute;
  top: 50%;
  right: 15px;
  width: 30px;
  height: 30px;
  color: #121212;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  transform: translate3d(0, -50%, 0);
  cursor: pointer;
  z-index: 200;
`;

const AddMoreImageButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.blackColor};
  border-radius: 50%;
  background: transparent;
  font-size: 35px;
  font-weight: 200;
  color: ${({ theme }) => theme.greyTextColor};
  cursor: pointer;
`;

const AddMoreImageButtonWrapper = styled.div`
  width: fit-content;
  height: 94px;
`;

const CreatePostModal = ({ profileImage }: CreatePostModalType) => {
  const [imageSrc, setImageSrc] = useState([]);
  const [nextModal, setNextModal] = useState(false);
  const [textAreaText, setTextAreaText] = useState(0);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showPreviewImagesModal, setShowPreviewImagesModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const imageInputRef = useRef(null);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);
  const slideRef = useRef(null);
  const outsideRef = useRef(null);

  const countTextLength = (e: any) => {
    setTextAreaText(e.target.value.length);
  };

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageLists = event.target.files;
    let imageUrlLists = [...imageSrc];

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);
    }

    if (imageUrlLists.length > 10) {
      imageUrlLists = imageUrlLists.slice(0, 10);
    }

    setImageSrc(imageUrlLists);
  };

  const { register, handleSubmit } = useForm<AddPostFormValues>({
    mode: 'onSubmit',
  });

  const { ref: contentRef, ...contentRest } = register('content', {
    required: true,
  });

  const { ref: imageRef, ...postImageRest } = register('postImage1', {
    required: true,
  });

  const { mutate, isLoading, isSuccess } = useMutation<
    ResponseData,
    AxiosError,
    FormData
  >((formData: FormData) => addPost(formData), {
    onError: (err) => {
      console.log('포스트 등록 실패!', err.response.data);
    },
    onSuccess: () => {
      console.log('포스트 등록 성공!');
    },
  });

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('content', textareaRef.current.value);
    for (let i = 0; i < imageSrc.length; i++) {
      formData.append(`postImage${i + 1}`, imageInputRef.current.files[i]);
    }
    mutate(formData);
  };

  const onImageInputButtonClick = () => {
    imageInputRef.current.click();
  };

  const discardModalOpen = () => {
    if (imageSrc && nextModal === false) {
      setShowDiscardModal(true);
      document.body.style.overflow = 'hidden';
    } else {
      setNextModal(false);
    }
  };

  const onClickDiscard = () => {
    setShowDiscardModal(false);
    setShowPreviewImagesModal(false);
    imageInputRef.current.value = '';
    setImageSrc([]);
  };
  useOutsideClick(outsideRef, () => setShowPreviewImagesModal(false));

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
    }
  }, [currentSlide]);

  const totalSlide = imageSrc.length;

  const nextSlide = () => {
    if (currentSlide >= totalSlide) {
      return;
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      return;
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };
  const closeDiscardModal = () => {
    setShowDiscardModal(false);
  };

  if (isLoading || isSuccess) {
    return (
      <Container>
        <Title>{isLoading ? 'Sharing...' : 'Post shared'}</Title>
        <Wrapper>
          <Content>
            {isLoading ? (
              <Loader
                loaded={!isLoading}
                color="#000"
                scale={2.0}
                top="50%"
                left="50%"
              />
            ) : (
              <UserAvatar>
                <CheckIcon />
              </UserAvatar>
            )}
            {isSuccess && <p>Your post has been shared.</p>}
          </Content>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container
      ref={modalRef}
      nextmodal={nextModal}
      onSubmit={handleSubmit(onSubmit)}>
      <Title>
        {imageSrc.length > 0 && (
          <TitleLeftArrowIcon onClick={discardModalOpen} />
        )}
        {imageSrc.length > 0 && nextModal === false
          ? 'Crop'
          : 'Create new Post'}
        {imageSrc.length > 0 && nextModal === false && (
          <NextButton onClick={() => setNextModal(true)}>Next</NextButton>
        )}
        {imageSrc.length > 0 && nextModal && (
          <NextButton type="submit">Share</NextButton>
        )}
      </Title>
      <Wrapper>
        <Content>
          {imageSrc.length > 0 && (
            <LeftArrowIcon currentslide={currentSlide} onClick={prevSlide} />
          )}
          {imageSrc.length > 0 ? (
            <ImageWrapper ref={slideRef} nextModal={nextModal}>
              {imageSrc.map((image, id) => (
                <img src={image} key={id} alt={`${image}-${id}`} />
              ))}
            </ImageWrapper>
          ) : (
            <>
              <ImageIcon />
              <p>Drag photos here</p>
              <button onClick={onImageInputButtonClick}>
                Select from computer
              </button>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            name="postImage1"
            id="postImage1"
            {...postImageRest}
            ref={(e) => {
              imageRef(e);
              imageInputRef.current = e;
            }}
            onChange={(e) => {
              handleAddImages(e);
            }}
          />
          <MeatballIconBox>
            {imageSrc.length > 0 &&
              imageSrc.map((list: string, i: number) => (
                <MeatballIcon
                  key={list}
                  currentslide={currentSlide}
                  index={i}
                />
              ))}
          </MeatballIconBox>
          {imageSrc.length > 0 && (
            <RightArrowIcon
              totalslides={totalSlide}
              currentslide={currentSlide}
              onClick={nextSlide}
            />
          )}
          {imageSrc.length > 0 && (
            <ImagesIconCircle
              showpreviewimagesmodal={showPreviewImagesModal.toString()}
              onClick={() => {
                setShowPreviewImagesModal((prev) => !prev);
              }}>
              <ImagesIcon
                showpreviewimagesmodal={showPreviewImagesModal.toString()}
              />
            </ImagesIconCircle>
          )}
          {imageSrc.length > 0 && (
            <PreviewImagesModal
              ref={outsideRef}
              showpreviewimagesmodal={showPreviewImagesModal.toString()}>
              {imageSrc.map((image, id) => (
                <PreviewImage
                  image={image}
                  key={id}
                  imageIndex={id}
                  setCurrentSlide={setCurrentSlide}
                  currentSlide={currentSlide}
                  imageSrc={imageSrc}
                  setImageSrc={setImageSrc}
                  setShowPreviewImagesModal={setShowPreviewImagesModal}
                  totalSlide={totalSlide}
                />
              ))}
              {imageSrc.length < 10 && (
                <AddMoreImageButtonWrapper>
                  <AddMoreImageButton onClick={onImageInputButtonClick}>
                    +
                  </AddMoreImageButton>
                </AddMoreImageButtonWrapper>
              )}
            </PreviewImagesModal>
          )}
        </Content>
        {nextModal && (
          <CaptionBox>
            <UserAccountWrapper>
              <img src={profileImage} alt="유저아바타" />
              <UserInfoWrapper>
                <p>_leesangwon</p>
              </UserInfoWrapper>
            </UserAccountWrapper>
            <TextBox
              name="content"
              id="content"
              {...contentRest}
              ref={(e) => {
                contentRef(e);
                textareaRef.current = e;
              }}
              placeholder="Write a caption..."
              maxLength={2200}
              onChange={countTextLength}></TextBox>
            <TextLength>
              {textAreaText.toLocaleString('ko-KR')}/2,200
            </TextLength>
          </CaptionBox>
        )}
      </Wrapper>
      {showDiscardModal && (
        <ModalPortal>
          <ModalContainer closeModal={closeDiscardModal}>
            <DiscardPostModal
              title="Discard post?"
              question={`If you leave, your edits won't be saved.`}
              onClickDiscard={onClickDiscard}
              closeDiscard={closeDiscardModal}
            />
          </ModalContainer>
        </ModalPortal>
      )}
    </Container>
  );
};

export default CreatePostModal;
