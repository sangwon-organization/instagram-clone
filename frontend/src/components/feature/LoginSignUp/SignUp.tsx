import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoginSignUpBottomBox from './LoginSignUpBottomBox';
import LoginSignUpMiddleBox from './LoginSignUpMiddleBox';
import clonestagramLogoBlack from '../../../assets/image/clonestagramLogoBlack.png';
import { AiFillFacebook } from 'react-icons/ai';
import Loader from 'react-loader';

import { useMutation } from '@tanstack/react-query';
import {
  emailDuplicationCheck,
  loginUser,
  signUpUser,
  usernameDuplicationCheck,
} from '../../../api/api';
import {
  IoIosCloseCircleOutline,
  IoIosCheckmarkCircleOutline,
} from 'react-icons/io';
import { AxiosError } from 'axios';

const SignUpContainer = styled.div<{ error: AxiosError<Error, any> }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 347px;
  height: ${({ error }) => (error ? ' 855px' : '768px')};
`;

const TopBox = styled.div<{ error: AxiosError<Error, any> }>`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: ${({ error }) => (error ? ' 660px' : '575px')};
  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: 1px;
  background-color: ${({ theme }) => theme.whiteColor};

  img {
    width: 171.1px;
    height: 49.9px;
    margin-top: 30px;
  }

  p {
    width: 262px;
    font-size: 17px;
    font-weight: 700;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const FacebookLoginButton = styled.button`
  width: 262px;
  height: 33px;
  border: none;
  border-radius: 5px;
  background: ${({ theme }) => theme.buttonColor};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.whiteColor};
`;

const FacebookLogo = styled(AiFillFacebook)`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  color: ${({ theme }) => theme.whiteColor};
`;

const OrBox = styled.div`
  width: 262px;
  height: 14.7px;
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0 17px;
    font-size: 12.7px;
    font-weight: 600;
    line-height: 1.15;
    color: ${({ theme }) => theme.greyTextColor};
    &::before,
    &::after {
      display: inline-block;
      width: 103.9px;
      height: 1px;
      background: ${({ theme }) => theme.borderColor};
      content: '';
    }
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5.9px 0;
  width: 340.2px;
  height: fit-content;
`;

const InputBox = styled.div<{ keyPress: boolean; clicked: boolean }>`
  position: relative;
  width: 262px;
  height: 37.1px;
  border: solid 1px
    ${({ clicked, theme }) => (clicked ? '#a2a1a1' : theme.borderColor)};
  border-radius: 2.9px;
  background-color: ${({ theme }) => theme.bgColor};
  input {
    position: absolute;
    top: ${({ keyPress }) => (keyPress ? '0px' : '-3px')};
    padding-top: 10px;
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    font-size: ${({ keyPress }) => (keyPress ? '8px' : '12px')};
    transition: all linear 0.1s;
    z-index: 100;
    &:autofill {
      box-shadow: 0 0 0px 1000px transparent inset;
    }
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      transition: background-color 5000s ease-in-out 0s;
      -webkit-transition: background-color 9999s ease-out;
      -webkit-box-shadow: 0 0 0px 1000px transparent inset;
      box-shadow: 0 0 0px 1000px transparent inset;
      -webkit-text-fill-color: ${({ theme }) => theme.textColor};
    }
  }

  span {
    position: absolute;
    top: ${({ keyPress }) => (keyPress ? '-5px' : '0')};
    padding-left: 10px;
    font-size: ${({ keyPress }) => (keyPress ? '8px' : '12px')};
    color: ${({ theme }) => theme.greyTextColor};
    line-height: 3;
    text-align: left;
    transition: all linear 0.1s;
  }
`;

const ShowHideText = styled.button`
  position: absolute;
  top: 8px;
  right: 5px;
  width: fit-content;
  height: fit-content;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  z-index: 200;
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const SignupButton = styled.button<{ disabled: boolean }>`
  position: relative;
  width: 262px;
  height: 29.3px;
  margin-top: 7.8px;
  border: none;
  border-radius: 3.9px;
  background: ${({ disabled, theme }) =>
    disabled ? '#0095f64c' : theme.buttonColor};
  font-size: 13.7px;
  font-weight: 600;
  color: ${({ theme }) => theme.whiteColor};
  line-height: 1.29;
  text-align: center;
`;

const NoticeBox = styled.div`
  width: 262px;
  height: fit-content;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.greyTextColor};
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.4px;
  span {
    font-weight: 700;
  }
`;

const ValidationTrueIcon = styled(IoIosCheckmarkCircleOutline)`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 25px;
  color: ${({ theme }) => theme.greyTextColor};
`;

const ValidationFalseIcon = styled(IoIosCloseCircleOutline)`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 25px;
  color: ${({ theme }) => theme.errorColor};
`;

const ErrorMessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 262px;
  height: 80px;

  p {
    color: ${({ theme }) => theme.errorColor};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.29;
    text-align: center;
    white-space: pre-line;
  }
`;

const schema = yup.object().shape({
  email: yup.string().required(),
  name: yup.string().required().max(15),
  username: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9_.]*$/),
  password: yup.string().min(8).max(15).required(),
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
  } = useForm<SignUpFormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { mutate: loginMutate } = useMutation<
    LoginResponseData,
    AxiosError,
    LoginType
  >(loginUser, {
    onError: (err: AxiosError) => {
      console.log('로그인 실패 ', err.response.data);
    },
    onSuccess: () => {
      console.log('로그인 성공!');
      window.location.reload();
    },
  });

  const { mutate, error, isLoading } = useMutation<
    ResponseData,
    AxiosError<Error>,
    SignUpType
  >(signUpUser, {
    onError: (err) => {
      console.log('회원가입 실패!', err.response.data);
    },
    onSuccess: (data, variables) => {
      console.log('회원가입 성공!');
      if (variables !== undefined) {
        loginMutate({ email: variables.email, password: variables.password });
      }
    },
  });

  const emailDuplicationChecking = useMutation<
    ResponseData,
    AxiosError,
    EmailDuplicationCheckType
  >(emailDuplicationCheck, {
    onError: (err) => {
      console.log('이메일 중복 체크 실패!', err.response.data);
    },
    onSuccess: () => {
      console.log('이메일 중복 체크 성공!');
    },
  });

  const usernameDuplicationChecking = useMutation<
    ResponseData,
    AxiosError,
    UsernameDuplicationCheckType
  >(usernameDuplicationCheck, {
    onError: (err) => {
      console.log('유저네임 중복 체크 실패!', err.response.data);
    },
    onSuccess: () => {
      console.log('유저네임 중복 체크 성공!');
    },
  });

  const InputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setKeyPress: Dispatch<SetStateAction<boolean>>,
  ) => {
    if (e.currentTarget.value === '') {
      setKeyPress(false);
    } else {
      setKeyPress(true);
    }
  };

  const passwordInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === '') {
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

  const onSubmit = (dataInput: SignUpFormValues) => {
    mutate(dataInput);
  };

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
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputBox keyPress={emailKeyPress} clicked={emailInputBoxClicked}>
            <input
              type="text"
              onFocusCapture={() => setEmailInputBoxClicked(true)}
              onBlurCapture={(
                e: React.FocusEvent<HTMLInputElement, Element>,
              ) => {
                setEmailInputBoxClicked(false);
                emailDuplicationChecking.mutate({
                  email: e.currentTarget.value,
                });
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
              onBlurCapture={(
                e: React.FocusEvent<HTMLInputElement, Element>,
              ) => {
                setUsernameInputBoxClicked(false);
                usernameDuplicationChecking.mutate({
                  username: e.currentTarget.value,
                });
              }}
              onKeyUp={(e) => InputKeyPress(e, setUsernameKeyPress)}
              {...register('username', { required: true })}
              maxLength={20}
            />
            <span>Username</span>
            {!errors?.username && usernameDuplicationChecking.isSuccess && (
              <ValidationTrueIcon />
            )}
            {(usernameDuplicationChecking.error || errors?.username) && (
              <ValidationFalseIcon />
            )}
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
                  `Another account is using the same email.`}
                {error.response.data.message ===
                  '이미 등록된 닉네임입니다. 다시 입력해 주세요.' &&
                  `A user with that username already exists.`}
                {error.response.data.message ===
                  '이메일 형식이 맞지 않습니다. 다시 입력해 주세요.' &&
                  `Enter a valid email address.`}
                {errors?.username?.message}
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
