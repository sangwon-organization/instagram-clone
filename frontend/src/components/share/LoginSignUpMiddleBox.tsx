import React from 'react';
import styled from 'styled-components';

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
  return (
    <Container>
      <p>
        {question} <span>{linkText}</span>
      </p>
    </Container>
  );
};

export default LoginSignUpMiddleBox;
