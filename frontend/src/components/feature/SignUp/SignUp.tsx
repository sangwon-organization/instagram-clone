import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoginSignUpBottomBox from '../../share/LoginSignUpBottomBox';
import LoginSignUpMiddleBox from '../../share/LoginSignUpMiddleBox';
import instagramLogo from '../../../assets/image/instagram-logo.png';
import { AiFillFacebook } from 'react-icons/ai';

const SignUpContainer = styled.div`
  width: 347px;
  height: 768px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopBox = styled.div`
  width: 100%;
  height: 575px;
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
    margin-top: 45.9px;
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
  border: 1px solid red;
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

type FormValues = {
  emailInput: string;
  fullnameInput: string;
  usernameInput: string;
  passwordInput: string;
};

const schema = yup.object().shape({
  emailInput: yup.string().required(),
  fullnameInput: yup.string().required(),
  usernameInput: yup.string().required(),
  passwordInput: yup.string().min(6).required(),
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
  };

  const onError = (err: any) => {
    console.log(err);
  };
  return (
    <SignUpContainer>
      <TopBox>
        <img src={instagramLogo} alt="인스타그램로고" />
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
              onBlurCapture={() => setEmailInputBoxClicked(false)}
              onKeyUp={(e) => InputKeyPress(e, setEmailKeyPress)}
              {...register('emailInput', { required: true })}
            />
            <span>Email</span>
          </InputBox>
          <InputBox
            keyPress={fullnameKeyPress}
            clicked={fullnameInputBoxClicked}>
            <input
              type="text"
              onFocusCapture={() => setFullnameInputBoxClicked(true)}
              onBlurCapture={() => setFullnameInputBoxClicked(false)}
              onKeyUp={(e) => InputKeyPress(e, setFullnameKeyPress)}
              {...register('fullnameInput', { required: true })}
            />
            <span>Full Name</span>
          </InputBox>
          <InputBox
            keyPress={usernameKeyPress}
            clicked={usernameInputBoxClicked}>
            <input
              type="text"
              onFocusCapture={() => setUsernameInputBoxClicked(true)}
              onBlurCapture={() => setUsernameInputBoxClicked(false)}
              onKeyUp={(e) => InputKeyPress(e, setUsernameKeyPress)}
              {...register('usernameInput', { required: true })}
            />
            <span>Username</span>
          </InputBox>
          <InputBox
            keyPress={passwordKeyPress}
            clicked={passwordInputBoxClicked}>
            <input
              type={passwordShowAndHide ? 'text' : 'password'}
              onFocusCapture={() => setPasswordInputBoxClicked(true)}
              onBlurCapture={() => setPasswordInputBoxClicked(false)}
              onKeyUp={(e) => passwordInputKeyPress(e)}
              {...register('passwordInput', { required: true })}
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
            Sign up
          </SignupButton>
        </Form>
      </TopBox>
      <LoginSignUpMiddleBox question="Have an account?" linkText="Log in" />
      <LoginSignUpBottomBox />
    </SignUpContainer>
  );
};

export default SignUp;
