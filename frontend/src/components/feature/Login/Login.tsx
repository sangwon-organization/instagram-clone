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

const LoginContainer = styled.div`
  width: 342.2px;
  height: 568px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopBox = styled.div`
  width: 100%;
  height: 387.1px;
  border-radius: 1px;
  border: solid 1px ${({ theme }) => theme.borderColor};
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  img {
    width: 171.1px;
    height: 49.9px;
    margin-top: 45.9px;
  }
`;

const LoginForm = styled.form`
  width: 340.2px;
  height: 126px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5.9px 0;
`;

const LoginButton = styled.button<{ disabled: boolean }>`
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

const InputBox = styled.div<{ keyPress: boolean; clicked: boolean }>`
  position: relative;
  width: 262px;
  height: 37.1px;
  border-radius: 2.9px;
  border: solid 1px
    ${({ theme, clicked }) => (clicked ? '#a2a1a1' : theme.borderColor)};
  background-color: ${({ theme }) => theme.bgColor};
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
    color: ${({ theme }) => theme.greyTextColor};
  }
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
    color: ${({ theme }) => theme.greyTextColor};
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
      background: ${({ theme }) => theme.borderColor};
    }
  }
`;

const ErrorMessageBox = styled.div`
  width: 262px;
  height: 19.6px;
  font-size: 13.7px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: #ed4956;
  white-space: pre-line;
`;

const ForgotPasswordBox = styled.div`
  width: 94.1px;
  height: 13.7px;
  font-size: 11.7px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: ${({ theme }) => theme.hashTagColor};
`;

type FormValues = {
  email: string;
  password: string;
};

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

  const onError = (err: any) => {
    console.log(err);
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormValues>({ mode: 'onChange', resolver: yupResolver(schema) });

  const { mutate, data, error, reset, isLoading } = useMutation(loginUser, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (userInfo: any) => {
      console.log('로그인 성공!');
      console.log(data);
    },
  });
  console.log(error);
  const onSubmit = (dataInput: any) => {
    mutate(dataInput);
  };

  return (
    <LoginContainer>
      <TopBox>
        <img src={clonestagramLogoBlack} alt="인스타그램로고" />
        <LoginForm onSubmit={handleSubmit(onSubmit, onError)}>
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
        {/* {error && (
          <ErrorMessageBox>
            <p>
              {error.response.code === 401 &&
                `이메일 또는 패스워드가 정확하지 않습니다.\n다시 입력해 주세요.`}
            </p>
          </ErrorMessageBox>
        )} */}

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
