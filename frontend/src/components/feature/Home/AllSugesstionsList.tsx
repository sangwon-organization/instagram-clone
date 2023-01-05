import React, { useState } from 'react';
import styled from 'styled-components';
import Footer from '../Footer/Footer';
import AllSugesstionsListItem from './AllSugesstionsListItem';
import { useQuery } from '@tanstack/react-query';
import { getNotFollowingList } from '../../../api/api';
import { AxiosError } from 'axios';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 20px;
  h4 {
    width: 468px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.borderColor};
  margin-bottom: 30px;
  width: 468px;
  height: fit-content;
  background: ${({ theme }) => theme.searchBarBgColor};
`;

const ItemBox = styled.div`
  width: 100%;
  height: fit-content;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GetStartedButton = styled.button<{ followbuttonclicked?: boolean }>`
  width: 436px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  padding: 7px 16px;
  margin: 16px;
  color: ${({ theme, followbuttonclicked }) =>
    followbuttonclicked ? theme.textColor : theme.whiteColor};
  background-color: ${({ theme, followbuttonclicked }) =>
    followbuttonclicked ? theme.ultraLightGreyColor : theme.buttonColor};
  outline: none;
  border: none;
  border-radius: 8px;
  position: relative;
  &:hover {
    background: ${({ followbuttonclicked }) =>
      followbuttonclicked ? '#dbdbdb' : '#1877f2'};
  }
`;

const AllSugesstionsList = () => {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const { data: getNotFollowingData } = useQuery<
    getNotFollowingListType,
    AxiosError
  >(['getNotFollowing'], () => getNotFollowingList(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return (
    <Container>
      <h4>Suggestions For You</h4>
      <Wrapper>
        <ItemBox>
          {getNotFollowingData?.followingList.map(
            (list: followerImFollowingListType) => (
              <AllSugesstionsListItem
                key={list.userId}
                list={list}
                setShowGetStarted={setShowGetStarted}
              />
            ),
          )}
        </ItemBox>
        {showGetStarted && (
          <GetStartedButton onClick={() => window.location.reload()}>
            Get Started
          </GetStartedButton>
        )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default AllSugesstionsList;
