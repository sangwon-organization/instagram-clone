import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import instagramLogo from '../../../assets/image/instagram-logo.png'
import AppStoreImage from '../../../assets/image/AppStoreImage.png'
import GooglePlayImage from '../../../assets/image/GooglePlayImage.png'

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
`;

const LoginForm = styled.form`
   width: 340.2px;
  height: 126px;
  display: flex;
  flex-direction:column ;
  justify-content: center;
  align-items: center;
  gap: 5.9px 0;
  
`;

const LoginButton = styled.button<{ disabled: boolean }>`
  width: 262px;
  height: 29.3px;
  border-radius: 3.9px;
  background: ${({disabled}) => (disabled ? 'rgba(0, 149, 246, 0.3)' : '#0095F6')};
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

const InputBox = styled.div<{keyPress:boolean, Clicked:boolean}>`
position: relative;
width: 262px;
  height: 37.1px;
  border-radius: 2.9px;
  border: solid 1px ${({Clicked}) => Clicked ? '#a2a1a1' : '#dbdbdb'};
  background-color: #fafafa;
  input {
    position: absolute;
    width: 262px;
    top: ${({keyPress})=> keyPress ? '10px' : '0'};
  height: ${({keyPress})=> keyPress ? '30px' : '37.1px'};
  /* border: 1px solid red; */
  border: none;
  background: transparent;
  font-size: ${({keyPress})=> keyPress ? '8px' : '14px'};
  /* &:focus {
    border-color: #a2a1a1;
  } */
  
}
span {
  position: absolute;
    top: ${({keyPress})=> keyPress ? '-5px' : '-2px'};
    font-size: ${({keyPress})=> keyPress ? '8px' : '14px'};
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 3;
  letter-spacing: normal;
  text-align: left;
  padding-left: 7.8px;
  color: #8e8e8e;
  transition: all linear 0.2s;
}
`;

const ShowHideText = styled.button`
position: absolute;
top: 8px;
right: 5px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  background:transparent ;
  &:active {
    color: grey;
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
  color: #8e8e8e;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 17px;
 &::before, &::after {
    content: '';
    display: inline-block;
    width: 103.9px;
  height: 1px;
  background: #dbdbdb;
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
  color: #ED4956;

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
  color: #00376b;
`;

const MiddleBox = styled.div`
  width: 100%;
  height: 61.6px;
  border-radius: 1px;
  border: solid 1px #dbdbdb;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color:#262626;
    font-size: 13.7px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
    span {
      color: #0095f6;
      cursor: pointer;
    }
  }
`;

const BottomBox = styled.div`
  width: 100%;
  height: 99.7px;
  display: flex;
  flex-direction:column ;
  justify-content: center;
  align-items: center;
  gap: 20.5px 0;
  p {
    font-size: 13.7px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #262626;
  }
`;

const ButtonWrapper = styled.div`
  width: fit-content;
  height: 43px;
  display: flex;
  gap: 0 7.8px;
  img {
    width: 131.3px;
    height: 39.1px;
  }
`;

type FormValues = {
  usernameInput: string;
  passwordInput: string;
};

const schema = yup.object().shape({
  usernameInput: yup
    .string()
    .required(),
    passwordInput: yup
    .string()
    .min(6)
    .required(),
});


const Login = () => { 
  const [usernameKeyPress, setUsernameKeyPress] = useState(false);
  const [passwordKeyPress, setPasswordKeyPress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordShowAndHide, setPasswordShowAndHide] = useState(false);
  const [inputBoxClicked, setInputBoxClicked] = useState(false);

  const ToggleInputBoxClicked = () => {
    setInputBoxClicked((prev)=> !prev);
  }


  const userNameInputKeyPress = (e:any) => {
    if(e.target.value === '') {
      setUsernameKeyPress(false);
    } else {
      setUsernameKeyPress(true);
    }
  }

  const passwordInputKeyPress = (e:any) => {
    if(e.target.value === '') {
      setPasswordKeyPress(false);
      setShowPassword(false);
    } else {
      setPasswordKeyPress(true);
      setShowPassword(true);
    }
  }

  const TogglePasswordShowAndHide = () => {
    setPasswordShowAndHide((prev: boolean) => !prev);
  };

  const onSubmit = (dataInput: any) => {
    console.log(dataInput);
  };

  const onError = (err: any) => {
    console.log(err);
  };


  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormValues>({mode: 'onChange',resolver: yupResolver(schema),
});

  useEffect(() => {
    console.log(isValid)
  },[isValid]);
  return (
    <LoginContainer>
      <TopBox>
        <img src={instagramLogo} alt="인스타그램로고" />
        <LoginForm onSubmit={handleSubmit(onSubmit, onError)}>
            <InputBox keyPress={usernameKeyPress} Clicked={inputBoxClicked}>
              <input type="text" onClick={()=>ToggleInputBoxClicked()} onKeyDown={(e) => userNameInputKeyPress(e)} {...register("usernameInput",  { required: true })} />
              <span>username</span>
            </InputBox>
            <InputBox keyPress={passwordKeyPress} Clicked={inputBoxClicked}>
              <input type={passwordShowAndHide ? 'text' : 'password'} onFocus={()=>ToggleInputBoxClicked()} onKeyDown={(e) => passwordInputKeyPress(e)} {...register("passwordInput",  { required: true })} />
              <span>Password</span>
              {showPassword && <ShowHideText onClick={() => TogglePasswordShowAndHide()}>{passwordShowAndHide ? 'Hide' : 'Show'}</ShowHideText>}
            </InputBox>
            <LoginButton type="submit" disabled={!isValid}>Log In</LoginButton>
        </LoginForm>
        <OrBox>
            <p>OR</p>
        </OrBox>
        <ErrorMessageBox>
            <p>error message</p>
        </ErrorMessageBox>
        <ForgotPasswordBox>
            <p>Forgot password?</p>
        </ForgotPasswordBox>
      </TopBox>
      <MiddleBox>
        <p>Don't have an account? <span>Sign up</span></p>
      </MiddleBox>
      <BottomBox>
        <p>Get the app.</p>
        <ButtonWrapper>
              <img src={AppStoreImage} alt="앱스토어로고" onClick={() => window.open('https://apps.apple.com/app/instagram/id389801252?vt=lo', '_blank')}/>
              <img src={GooglePlayImage} alt="구글플레이로고" onClick={() => window.open('https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3D1CBCCC9B-D83C-49C9-A8E9-02837255E0EF%26utm_content%3Dlo%26utm_medium%3Dbadge', '_blank')}/>
        </ButtonWrapper>
      </BottomBox>
    </LoginContainer>
  )
}

export default Login
