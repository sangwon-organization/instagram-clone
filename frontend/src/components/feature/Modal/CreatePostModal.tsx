import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IoImagesOutline } from 'react-icons/io5';
import { BiArrowBack } from 'react-icons/bi';
import { addPost } from '../../../api/api';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Loader from 'react-loader';
import { FiCheck } from 'react-icons/fi';

const Container = styled.form<{ nextmodal?: boolean }>`
  width: ${({ nextmodal }) => (nextmodal ? '1120px' : '768px')};
  height: 808px;
  border-radius: 10px;
  background: ${({ theme }) => theme.dropDownBgColor};
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

const LeftArrowIcon = styled(BiArrowBack)`
  position: absolute;
  left: 15px;
  font-size: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
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

const CreatePostModal = ({ profileImage }: CreatePostModalType) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [nextModal, setNextModal] = useState(false);
  const [textAreaText, setTextAreaText] = useState(0);

  const imageInput = useRef(null);
  const textareaRef = useRef(null);

  const countTextLength = (e: any) => {
    setTextAreaText(e.target.value.length);
  };

  const encodeFileToBase64 = (fileBlob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve: any) => {
      reader.onload = () => {
        const csv: string = reader.result as string;
        setImageSrc(csv);
        resolve();
      };
    });
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<AddPostFormValues>({ mode: 'onSubmit' });

  const { ref: contentRef, ...contentRest } = register('content', {
    required: true,
  });

  const { ref: imageRef, ...postImageRest } = register('postImage1', {
    required: true,
  });
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  // const submitFormData = async (e: any) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append('content', textareaRef.current.value);
  //   formData.append('postImage1', imageSrc);
  //   mutate(formData);
  // };

  const { mutate, data, error, reset, isLoading, isSuccess } = useMutation(
    (formData: FormData) => addPost(formData),
    {
      onError: (err: any) => {
        console.log(err.response.data);
      },
      onSuccess: (userInfo: any) => {
        console.log('포스트 등록 성공!');
        console.log(data);
      },
    },
  );

  const onSubmit = (dataInput: any) => {
    console.log('submit clicked');
    console.log(dataInput);
    const formData = new FormData();
    formData.append('content', textareaRef.current.value);
    formData.append('postImage1', imageInput.current.files[0]);
    console.log(formData);
    mutate(formData);
  };

  const onError = (err: any) => {
    console.log(err);
    console.log(error);
    // console.log(imageSrc);
  };

  const onImageInputButtonClick = () => {
    imageInput.current.click();
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
    <Container nextmodal={nextModal} onSubmit={handleSubmit(onSubmit, onError)}>
      <Title>
        {imageSrc && <LeftArrowIcon onClick={() => setNextModal(false)} />}
        Create new Post
        {imageSrc && nextModal === false && (
          <NextButton onClick={() => setNextModal(true)}>Next</NextButton>
        )}
        {imageSrc && nextModal && <NextButton type="submit">Share</NextButton>}
      </Title>
      <Wrapper>
        <Content>
          {imageSrc ? (
            <img src={imageSrc} alt="preview-img" />
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
              imageInput.current = e;
            }}
            onChange={(e) => {
              // setFiles(e.target.files[0]);
              encodeFileToBase64(e.target.files[0]);
            }}
          />
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
              maxLength={450}
              onChange={countTextLength}></TextBox>
            <TextLength>{textAreaText}/2,200</TextLength>
          </CaptionBox>
        )}
      </Wrapper>
    </Container>
  );
};

export default CreatePostModal;
