import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoginSignUpBottomBox from '../../share/LoginSignUpBottomBox';
import LoginSignUpMiddleBox from '../../share/LoginSignUpMiddleBox';
import clonestagramLogoBlack from '../../../assets/image/clonestagramLogoBlack.png';
import { AiFillFacebook } from 'react-icons/ai';
import Loader from 'react-loader';

import { useMutation } from '@tanstack/react-query';
import {
  emailDuplicationCheck,
  signUpUser,
  usernameDuplicationCheck,
} from '../../../api/api';
import {
  IoIosCloseCircleOutline,
  IoIosCheckmarkCircleOutline,
} from 'react-icons/io';

const SignUpContainer = styled.div<{ error: any }>`
  width: 347px;
  height: ${({ error }) => (error ? ' 855px' : '768px')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopBox = styled.div<{ error: any }>`
  width: 100%;
  height: ${({ error }) => (error ? ' 660px' : '575px')};
  border-radius: 1px;
  border: solid 1px #dbdbdb;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  img {
    width: 171.1px;
    height: 49.9px;
    margin-top: 30px;
  }

  p {
    color: #8e8e8e;
    font-size: 17px;
    font-weight: 700;
    width: 262px;
  }
`;

const FacebookLoginButton = styled.button`
  width: 262px;
  height: 33px;
  border: none;
  background: #0095f6;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const FacebookLogo = styled(AiFillFacebook)`
  color: #fff;
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const OrBox = styled.div`
  width: 262px;
  height: 14.7px;
  p {
    font-size: 12.7px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: #8e8e8e;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0 17px;
    &::before,
    &::after {
      content: '';
      display: inline-block;
      width: 103.9px;
      height: 1px;
      background: #dbdbdb;
    }
  }
`;
const Form = styled.form`
  width: 340.2px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5.9px 0;
`;

const InputBox = styled.div<{ keyPress: boolean; clicked: boolean }>`
  position: relative;
  width: 262px;
  height: 37.1px;
  border-radius: 2.9px;
  border: solid 1px ${({ clicked }) => (clicked ? '#a2a1a1' : '#dbdbdb')};
  background-color: #fafafa;
  input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: ${({ keyPress }) => (keyPress ? '0px' : '-3px')};
    /* height: ${({ keyPress }) => (keyPress ? '30px' : '37.1px')}; */
    border: none;
    background: transparent;
    font-size: ${({ keyPress }) => (keyPress ? '8px' : '12px')};
    /* &:focus {
    border-color: #a2a1a1;
  } */
    z-index: 100;
    padding-top: 10px;
    transition: all linear 0.1s;
  }
  span {
    position: absolute;
    top: ${({ keyPress }) => (keyPress ? '-5px' : '0')};
    font-size: ${({ keyPress }) => (keyPress ? '8px' : '12px')};
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 3;
    letter-spacing: normal;
    text-align: left;
    padding-left: 10px;
    color: #8e8e8e;
    transition: all linear 0.1s;
  }
`;

const ShowHideText = styled.button`
  position: absolute;
  top: 8px;
  right: 5px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: transparent;
  z-index: 200;
  &:active {
    color: grey;
  }
  width: fit-content;
  height: fit-content;
`;

const SignupButton = styled.button<{ disabled: boolean }>`
  width: 262px;
  height: 29.3px;
  border-radius: 3.9px;
  background: ${({ disabled }) =>
    disabled ? 'rgba(0, 149, 246, 0.3)' : '#0095F6'};
  border: none;
  font-size: 13.7px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  margin-top: 7.8px;
  position: relative;
`;

const NoticeBox = styled.div`
  width: 262px;
  height: fit-content;
  font-size: 12px;
  font-weight: 400;
  color: #8e8e8e;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.4px;
  span {
    font-weight: 700;
  }
`;

const ValidationTrueIcon = styled(IoIosCheckmarkCircleOutline)`
  font-size: 25px;
  color: ${({ theme }) => theme.greyTextColor};
  position: absolute;
  top: 5px;
  right: 5px;
`;

const ValidationFalseIcon = styled(IoIosCloseCircleOutline)`
  font-size: 25px;
  color: #ed4956;
  position: absolute;
  top: 5px;
  right: 5px;
`;

const ErrorMessageBox = styled.div`
  width: 262px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: #ed4956;
    font-size: 14px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    white-space: pre-line;
  }
`;

type FormValues = {
  email: string;
  name: string;
  username: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().required(),
  name: yup.string().required(),
  username: yup.string().required(),
  password: yup.string().min(6).required(),
});

const SignUp = () => {
  const [emailKeyPress, setEmailKeyPress] = useState(false);
  const [fullnameKeyPress, setFullnameKeyPress] = useState(false);
  const [usernameKeyPress, setUsernameKeyPress] = useState(false);
  const [passwordKeyPress, setPasswordKeyPress] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordShowAndHide, setPasswordShowAndHide] = useState(false);

  const [emailInputBoxClicked, setEmailInputBoxClicked] = useState(false);
  const [fullnameInputBoxClicked, setFullnameInputBoxClicked] = useState(false);
  const [usernameInputBoxClicked, setUsernameInputBoxClicked] = useState(false);
  const [passwordInputBoxClicked, setPasswordInputBoxClicked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormValues>({ mode: 'onChange', resolver: yupResolver(schema) });

  const InputKeyPress = (e: any, setKeyPress: Function) => {
    if (e.target.value === '') {
      setKeyPress(false);
    } else {
      setKeyPress(true);
    }
  };

  const passwordInputKeyPress = (e: any) => {
    if (e.target.value === '') {
      setPasswordKeyPress(false);
      setShowPassword(false);
    } else {
      setPasswordKeyPress(true);
      setShowPassword(true);
    }
  };

  const TogglePasswordShowAndHide = () => {
    setPasswordShowAndHide((prev: boolean) => !prev);
  };

  const onSubmit = (dataInput: any) => {
    console.log(dataInput);

    mutate(dataInput);
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const { mutate, data, error, reset, isLoading } = useMutation(signUpUser, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (userInfo: any) => {
      console.log('회원가입 성공!');
      // console.log(userInfo);
      // console.log(data);
    },
  });

  const emailDuplicationChecking = useMutation(emailDuplicationCheck, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (userInfo: any) => {
      console.log('이메일 사용 가능!');
    },
  });

  const usernameDuplicationChecking = useMutation(usernameDuplicationCheck, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (userInfo: any) => {
      console.log('유저네임 사용 가능!');
    },
  });
  return (
    <SignUpContainer error={error}>
      <TopBox error={error}>
        <img src={clonestagramLogoBlack} alt="인스타그램로고" />
        <p>Sign up to see photos and videos from your friends.</p>
        <FacebookLoginButton>
          <FacebookLogo />
          Log in with Facebook
        </FacebookLoginButton>
        <OrBox>
          <p>OR</p>
        </OrBox>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <InputBox keyPress={emailKeyPress} clicked={emailInputBoxClicked}>
            <input
              type="text"
              onFocusCapture={() => setEmailInputBoxClicked(true)}
              onBlurCapture={(e: any) => {
                setEmailInputBoxClicked(false);
                emailDuplicationChecking.mutate({ email: e.target.value });
              }}
              onKeyUp={(e) => InputKeyPress(e, setEmailKeyPress)}
              {...register('email', { required: true })}
            />
            <span>Email</span>
            {emailDuplicationChecking.isSuccess && <ValidationTrueIcon />}
            {emailDuplicationChecking.error && <ValidationFalseIcon />}
          </InputBox>
          <InputBox
            keyPress={fullnameKeyPress}
            clicked={fullnameInputBoxClicked}>
            <input
              type="text"
              onFocusCapture={() => setFullnameInputBoxClicked(true)}
              onBlurCapture={() => setFullnameInputBoxClicked(false)}
              onKeyUp={(e) => InputKeyPress(e, setFullnameKeyPress)}
              {...register('name', { required: true })}
            />
            <span>Full Name</span>
          </InputBox>
          <InputBox
            keyPress={usernameKeyPress}
            clicked={usernameInputBoxClicked}>
            <input
              type="text"
              onFocusCapture={() => setUsernameInputBoxClicked(true)}
              onBlurCapture={(e: any) => {
                setUsernameInputBoxClicked(false);
                usernameDuplicationChecking.mutate({
                  username: e.target.value,
                });
              }}
              onKeyUp={(e) => InputKeyPress(e, setUsernameKeyPress)}
              {...register('username', { required: true })}
            />
            <span>Username</span>
            {usernameDuplicationChecking.isSuccess && <ValidationTrueIcon />}
            {usernameDuplicationChecking.error && <ValidationFalseIcon />}
          </InputBox>
          <InputBox
            keyPress={passwordKeyPress}
            clicked={passwordInputBoxClicked}>
            <input
              type={passwordShowAndHide ? 'text' : 'password'}
              onFocusCapture={() => setPasswordInputBoxClicked(true)}
              onBlurCapture={() => setPasswordInputBoxClicked(false)}
              onKeyUp={(e) => passwordInputKeyPress(e)}
              {...register('password', { required: true })}
            />
            <span>Password</span>
            {showPassword && (
              <ShowHideText
                type="button"
                onClick={() => TogglePasswordShowAndHide()}>
                {passwordShowAndHide ? 'Hide' : 'Show'}
              </ShowHideText>
            )}
          </InputBox>
          <NoticeBox>
            People who use our service may have uploaded your contact
            information to Instagram. <span>Learn More</span>
          </NoticeBox>
          <SignupButton type="submit" disabled={!isValid}>
            {isLoading ? (
              <Loader
                loaded={!isLoading}
                color="#fafafa"
                scale={0.4}
                top="50%"
                left="50%"
              />
            ) : (
              'Sign up'
            )}
          </SignupButton>
          {error && (
            <ErrorMessageBox>
              <p>
                {error.response.data.message ===
                  '유효하지 않은 패스워드입니다. 다시 입력해 주세요. (길이 최소 8자 이상 15자 이하, 대문자, 소문자, 숫자, 특수문자(@,$,!,%,*,?,&) 각각 1개 이상 필수 입력)' &&
                  `This password isn't available. Minimum length of 8 to 15 characters, uppercase, lowercase, number, special characters (@,$,!,%,*,?,&) required.`}
                {error.response.data.message ===
                  '이미 등록된 이메일입니다. 다시 입력해 주세요.' &&
                  `This username isn't available. Please try another.`}
                {error.response.data.message ===
                  '이미 등록된 닉네임입니다. 다시 입력해 주세요.' &&
                  `This username isn't available. Please try another.`}
              </p>
            </ErrorMessageBox>
          )}
        </Form>
      </TopBox>
      <LoginSignUpMiddleBox question="Have an account?" linkText="Log in" />
      <LoginSignUpBottomBox />
    </SignUpContainer>
  );
};

export default SignUp;
