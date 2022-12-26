import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../../api/api';
import clonestagramLogoBlack from '../../../assets/image/clonestagramLogoBlack.png';
import LoginSignUpBottomBox from '../../share/LoginSignUpBottomBox';
import LoginSignUpMiddleBox from '../../share/LoginSignUpMiddleBox';
import { useDispatch } from 'react-redux';
import Loader from 'react-loader';
import { AxiosError } from 'axios';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 342.2px;
  height: 568px;
  margin: 100px 0;
`;

const TopBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 387.1px;
  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: 1px;
  background-color: #fff;

  img {
    width: 171.1px;
    height: 49.9px;
    margin-top: 30px;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5.9px 0;
  width: 340.2px;
  height: 126px;
`;

const LoginButton = styled.button<{ disabled: boolean }>`
  position: relative;
  width: 262px;
  height: 29.3px;
  margin-top: 7.8px;
  border: none;
  border-radius: 3.9px;
  background: ${({ disabled, theme }) =>
    disabled ? '#0095f64c' : theme.buttonColor};
  color: ${({ theme }) => theme.whiteColor};
  font-size: 13.7px;
  font-weight: 600;
  line-height: 1.29;
  text-align: center;
`;

const InputBox = styled.div<{ keyPress: boolean; clicked: boolean }>`
  position: relative;
  width: 262px;
  height: 37.1px;
  border: solid 1px
    ${({ theme, clicked }) => (clicked ? '#a2a1a1' : theme.borderColor)};
  border-radius: 2.9px;
  background-color: ${({ theme }) => theme.bgColor};
  input {
    position: absolute;
    top: ${({ keyPress }) => (keyPress ? '0px' : '-3px')};
    width: 100%;
    height: 100%;
    padding-top: 10px;
    border: none;
    background: transparent;
    font-size: ${({ keyPress }) => (keyPress ? '8px' : '12px')};
    font-weight: 400;
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
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  z-index: 200;
  &:active {
    color: ${({ theme }) => theme.greyTextColor};
  }
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
      content: '';
      display: inline-block;
      width: 103.9px;
      height: 1px;
      background: ${({ theme }) => theme.borderColor};
    }
  }
`;

const ErrorMessageBox = styled.div`
  width: 262px;
  height: 19.6px;
  font-size: 13.7px;
  font-weight: 600;
  color: #ed4956;
  line-height: 1.29;
  text-align: center;
  white-space: pre-line;
`;

const ForgotPasswordBox = styled.div`
  width: 94.1px;
  height: 13.7px;
  font-size: 11.7px;
  line-height: 1.33;
  color: ${({ theme }) => theme.hashTagColor};
`;

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().min(6).required(),
});

const Login = () => {
  const [usernameKeyPress, setUsernameKeyPress] = useState(false);
  const [passwordKeyPress, setPasswordKeyPress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordShowAndHide, setPasswordShowAndHide] = useState(false);
  const [emailInputBoxClicked, setEmailInputBoxClicked] = useState(false);
  const [passwordInputBoxClicked, setPasswordInputBoxClicked] = useState(false);

  const dispatch = useDispatch();

  const userNameInputKeyPress = (e: any) => {
    if (e.target.value === '') {
      setUsernameKeyPress(false);
    } else {
      setUsernameKeyPress(true);
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

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { mutate, data, error, reset, isLoading } = useMutation<
    LoginResponseData,
    AxiosError,
    LoginType
  >(loginUser, {
    onError: (err: AxiosError) => {
      console.log('로그인 실패 ', err.response.data);
    },
    onSuccess: () => {
      console.log('로그인 성공!');
    },
  });

  console.log(error);

  const onSubmit = (dataInput: LoginFormValues) => {
    mutate(dataInput);
  };

  return (
    <LoginContainer>
      <TopBox>
        <img src={clonestagramLogoBlack} alt="인스타그램로고" />
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <InputBox keyPress={usernameKeyPress} clicked={emailInputBoxClicked}>
            <input
              type="text"
              onFocusCapture={() => setEmailInputBoxClicked(true)}
              onBlurCapture={() => setEmailInputBoxClicked(false)}
              onKeyUp={(e) => userNameInputKeyPress(e)}
              {...register('email', { required: true })}
            />
            <span>Phone number, username, or email</span>
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
          <LoginButton type="submit" disabled={!isValid}>
            {isLoading ? (
              <Loader
                loaded={!isLoading}
                color="#fafafa"
                scale={0.4}
                top="50%"
                left="50%"
              />
            ) : (
              'Log In'
            )}
          </LoginButton>
        </LoginForm>
        <OrBox>
          <p>OR</p>
        </OrBox>
        {error && (
          <ErrorMessageBox>
            <p>
              {error.response.status === 401 &&
                `이메일 또는 패스워드가 정확하지 않습니다.\n다시 입력해 주세요.`}
            </p>
          </ErrorMessageBox>
        )}
        <ForgotPasswordBox>
          <p>Forgot password?</p>
        </ForgotPasswordBox>
      </TopBox>
      <LoginSignUpMiddleBox
        question={`Don't have an account?`}
        linkText="Sign up"
      />
      <LoginSignUpBottomBox />
    </LoginContainer>
  );
};

export default Login;
