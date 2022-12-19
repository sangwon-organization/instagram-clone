import React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import { loginComponent, signupComponent } from '../../redux/slices/loginSlice';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 61.6px;
  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: 1px;
  background-color: ${({ theme }) => theme.whiteColor};
  p {
    font-family: 'RobotoFont';
    font-size: 13.7px;
    font-weight: 400;
    line-height: 1.29;
    color: ${({ theme }) => theme.textColor};
    span {
      color: ${({ theme }) => theme.buttonColor};
      cursor: pointer;
    }
  }
`;

interface MiddleBoxProps {
  question: string;
  linkText: string;
}

const LoginSignUpMiddleBox = ({ question, linkText }: MiddleBoxProps) => {
  const dispatch: Dispatch = useDispatch();

  const toggleComponent = (e: any) => {
    if (e.target.textContent === ' Log in') {
      dispatch(loginComponent());
    } else if (e.target.textContent === ' Sign up') {
      dispatch(signupComponent());
    }
  };
  return (
    <Container>
      <p>
        {question}
        <span onClick={(e) => toggleComponent(e)}> {linkText}</span>
      </p>
    </Container>
  );
};

export default LoginSignUpMiddleBox;
