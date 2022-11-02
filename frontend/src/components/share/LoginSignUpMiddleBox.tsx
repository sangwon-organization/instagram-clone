import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { loginComponent, signupComponent } from '../../redux/slices/loginSlice';

const Container = styled.div`
  width: 100%;
  height: 61.6px;
  border-radius: 1px;
  border: solid 1px #dbdbdb;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: #262626;
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

interface MiddleBoxProps {
  question: string;
  linkText: string;
}

const LoginSignUpMiddleBox = ({ question, linkText }: MiddleBoxProps) => {
  const dispatch = useDispatch();

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
