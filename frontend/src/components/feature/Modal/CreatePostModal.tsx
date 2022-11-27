import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IoImagesOutline } from 'react-icons/io5';
import { BiArrowBack } from 'react-icons/bi';
import userAvatar from '../../../assets/image/userAvatar.png';
import { addPost } from '../../../api/api';
import { URL } from 'url';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const Container = styled.div<{ nextmodal: boolean }>`
  width: ${({ nextmodal }) => (nextmodal ? '1120px' : '768px')};
  height: 808px;
  border-radius: 10px;
  background: #fff;
`;

const Title = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  font-weight: 600;
`;

const Wrapper = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: 768px;
  height: 768px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px 0;
  p {
    font-size: 22px;
    font-weight: 300;
    color: ${({ theme }) => theme.textColor};
  }

  button {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: #0095f6;
    border-radius: 5px;
    padding: 5px 9px;
    border: none;
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
`;

const NextButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: #0095f6;
  background: transparent;
  border: none;
  position: absolute;
  right: 10px;
`;

const CaptionBox = styled.div`
  width: 352px;
  height: 768px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-top: none;
`;

const UserAccountWrapper = styled.div`
  /* border: 1px solid red; */
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: flex-stert;
  align-items: center;
  padding-left: 15px;
  gap: 0 15px;
  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
`;

const UserInfoWrapper = styled.div`
  width: 280px;
  height: 30px;
  display: flex;
  flex-direction: column;
  gap: 5px 0;
  justify-content: center;
  align-items: flex-start;

  p {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
`;

const TextBox = styled.textarea`
  /* border: 1px solid blue; */
  width: 100%;
  height: 50%;
  font-family: 'RobotoFont';
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  padding: 10px;
  outline: none;
  resize: none;
  border: none;
  &:focus::placeholder {
    color: ${({ theme }) => theme.footerTextColor};
  }
`;

const TextLength = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.footerTextColor};
  display: flex;
  justify-content: flex-end;
  padding-right: 15px;
`;

const LeftArrowIcon = styled(BiArrowBack)`
  font-size: 30px;
  color: ${({ theme }) => theme.textColor};
  position: absolute;
  left: 15px;
  cursor: pointer;
`;

const CreatePostModal = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [nextModal, setNextModal] = useState(false);
  const [textAreaText, setTextAreaText] = useState(0);

  const imageInput = useRef(null);
  const textareaRef = useRef(null);

  const countTextLength = (e: any) => {
    // const textLength = e.target.innerText.length;
    setTextAreaText(e.target.value.length);
  };

  const encodeFileToBase64 = (fileBlob: any) => {
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

  const submitFormData = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', textareaRef.current.value);
    formData.append('postImage1', imageSrc);
    mutate(formData);
  };

  const { mutate, data, error, reset, isLoading } = useMutation(addPost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (userInfo: any) => {
      console.log('포스트 등록 성공!');
      console.log(data);
    },
  });

  const onImageInputButtonClick = (event: any) => {
    event.preventDefault();
    imageInput.current.click();
  };
  return (
    <Container nextmodal={nextModal}>
      <Title>
        {imageSrc && <LeftArrowIcon onClick={() => setNextModal(false)} />}
        Create new Post
        {imageSrc && nextModal === false && (
          <NextButton onClick={() => setNextModal(true)}>Next</NextButton>
        )}
        {imageSrc && nextModal && (
          <NextButton type="submit" onClick={submitFormData}>
            Share
          </NextButton>
        )}
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
            ref={imageInput}
            onChange={(e) => {
              encodeFileToBase64(e.target.files[0]);
            }}
          />
        </Content>
        {nextModal && (
          <CaptionBox>
            <UserAccountWrapper>
              <img src={userAvatar} alt="유저아바타" />
              <UserInfoWrapper>
                <p>_leesangwon</p>
              </UserInfoWrapper>
            </UserAccountWrapper>
            <TextBox
              ref={textareaRef}
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
