import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import userAvatar from '../../../assets/image/userAvatar.png';
import userImage from '../../../assets/image/userImage.png';
import userImage2 from '../../../assets/image/userImage2.png';
import userImage3 from '../../../assets/image/userImage3.png';
import { BsHeart } from 'react-icons/bs';
import { BsHeartFill } from 'react-icons/bs';
import { RiChat3Line } from 'react-icons/ri';
import { TbLocation } from 'react-icons/tb';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { FaCircle, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { GoKebabHorizontal } from 'react-icons/go';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';
import theme from '../../../styles/theme';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  bookmarkPost,
  commentPost,
  getCommentsList,
  likePost,
} from '../../../api/api';
import Loader from 'react-loader';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { timeForToday } from '../../../utils/commons';

const FeedCardContainer = styled.div`
  width: 470px;
  height: fit-content;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.searchBarBgColor};
  @media ${({ theme }) => theme.tablet} {
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
  @media ${({ theme }) => theme.mobile} {
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
`;

const UserInformationWrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
`;

const UserInfo = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 10px;
  p {
    width: fit-content;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: ${({ theme }) => theme.textColor};
  }
`;

const ImageBoxWrapper = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  overflow: hidden;
  /* background-image: url('../../../assets/image/userImage.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat; */
  position: relative;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  img {
    width: 100%;
    height: 585px;
    object-fit: cover;
    background: black;
    flex: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-select: none;
  }
`;

const CommentBoxWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;

const UserAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const IconBox = styled.div`
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  /* border: 1px solid red; */
`;

const LeftIconBox = styled.div`
  width: 100px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeartIcon = styled(BsHeart)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const ColoredHeartIcon = styled(BsHeartFill)<{ likebuttonclicked: string }>`
  width: 23px;
  height: 23px;
  color: #ed4956;
  cursor: pointer;
  animation: ${({ likebuttonclicked }) =>
    likebuttonclicked === 'Y' ? 'pop 0.2s linear' : ''};
  @keyframes pop {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
    }
  }
`;

const SmallHeartIcon = styled(BsHeart)`
  width: 10px;
  height: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const ChatIcon = styled(RiChat3Line)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const LocationIcon = styled(TbLocation)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const BookmarkIcon = styled(FaRegBookmark)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const BookmarkFilledIcon = styled(FaBookmark)`
  width: 23px;
  height: 23px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const LikedMemberBox = styled.div`
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  font-weight: 600;
  margin: 0 10px 10px 10px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
`;
const FeedDescriptionBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 14px;
  font-weight: 600;
  margin: 0 10px 10px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 5px;
  div {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
  }
  button {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
    border: none;
    background: transparent;
  }
`;
const ViewAllCommentsBox = styled.div`
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.greyTextColor};
  margin: 0 10px 10px 10px;
  cursor: pointer;
`;
const CommentsListBox = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  font-weight: 400;
  margin: 0 10px 10px 10px;
  /* border: 1px solid red; */
`;

const CommentText = styled.div`
  display: flex;
  gap: 0 5px;
  justify-content: flex-start;
  align-items: center;
  /* border: 1px solid blue; */
  div {
    width: fit-content;
    height: fit-content;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
  p {
    width: 340px;
    height: fit-content;
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
    span {
      width: fit-content;
      height: fit-content;
      margin-right: 5px;
      color: ${({ theme }) => theme.hashTagColor};
      cursor: pointer;
    }
  }
`;
const DateBox = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.greyTextColor};
  padding: 0 10px 10px 10px;
`;

const AddCommentBox = styled.form`
  width: 100%;
  height: fit-content;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  position: relative;
  textarea {
    width: 375px;
    height: 20px;
    border: none;
    resize: none;
    outline: none;
    margin-left: 10px;
    background: transparent;
    font-family: 'RobotoFont';
  }
  button {
    font-size: 14px;
    font-weight: 600;
    color: #0095f6;
    background: transparent;
    border: none;
    &:disabled {
      pointer-events: none;
      opacity: 0.4;
    }
  }
`;

const SmileIcon = styled(HiOutlineEmojiHappy)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
`;

const KebabMenuIcon = styled(GoKebabHorizontal)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
`;

const BigLikedIcon = styled(BsHeartFill)<{ likebuttonclicked: string }>`
  width: 80px;
  height: 80px;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  filter: drop-shadow(5px 5px 30px rgba(0, 0, 0, 0.7));
  opacity: 0.7;
  animation: ${({ likebuttonclicked }) =>
    likebuttonclicked === 'Y ' && 'popIcon 0.2s linear 0s 1 alternate'};
  @keyframes popIcon {
    0% {
      transform: scale(0.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const LeftArrowIcon = styled(IoIosArrowDropleftCircle)<{
  currentslide: number;
}>`
  width: 30px;
  height: 30px;
  color: #fff;
  position: absolute;
  z-index: 200;
  top: 50%;
  left: 15px;
  opacity: 0.6;
  cursor: pointer;
  ${({ currentslide }) => currentslide === 0 && 'display: none'};
`;

const RightArrowIcon = styled(IoIosArrowDroprightCircle)<{
  currentslide: number;
  totalslide: number;
}>`
  width: 30px;
  height: 30px;
  color: #fff;
  position: absolute;
  z-index: 200;
  top: 50%;
  right: 15px;
  opacity: 0.6;
  cursor: pointer;
  ${({ currentslide, totalslide }) =>
    currentslide === totalslide - 1 && 'display: none'};
`;

const MeatballIconBox = styled.div`
  width: fit-content;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 3px;
  padding: 0 10px;
  margin-right: 80px;
`;

const MeatballIcon = styled(FaCircle)<{ index: number; currentslide: number }>`
  width: 6px;
  height: 6px;
  /* color: ${({ theme }) => theme.greyTextColor}; */
  color: ${({ theme, index, currentslide }) =>
    index === currentslide ? '#0095f6' : theme.greyTextColor};
`;

interface FeedCardProps {
  postId: number;
  username: string;
  profileImage: string;
  likeYn: string;
  likeCount: number;
  createdAt: string;
  commentCount: number;
  bookmarkYn: string;
  content: string;
  postImageList: string[];
  userId: number;
}

const FeedCard = ({
  userId,
  postId,
  username,
  profileImage,
  likeYn,
  likeCount,
  createdAt,
  commentCount,
  bookmarkYn,
  content,
  postImageList,
}: FeedCardProps) => {
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);
  const circleRef = useRef(null);
  const textareaRef = useRef(null);
  const postButtonRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();

  const TOTAL_SLIDES = postImageList.length;

  const NextSlide = () => {
    if (currentSlide >= TOTAL_SLIDES) {
      // setCurrentSlide(0);
      return;
      // rightArrowRef.current.style.display = 'none';
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const PrevSlide = () => {
    if (currentSlide === 0) {
      // setCurrentSlide(TOTAL_SLIDES);
      return;
      // leftArrowRef.current.style.display = 'none';
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    slideRef.current.style.transition = 'all 0.5s ease-in-out';
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  }, [currentSlide]);

  const { mutate, data, error, reset, isLoading } = useMutation(commentPost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('댓글 등록 성공!');
      console.log(e);
      textareaRef.current.value = '';
      textareaRef.current.focus();
    },
  });

  const mutateLikePost = useMutation(likePost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('포스트 좋아요 성공!');
    },
  });

  const mutateBookmarkPost = useMutation(bookmarkPost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('북마크 성공!');
    },
  });

  const getCommentsListQuery = useQuery(['getCommentsList'], () =>
    getCommentsList({ page: 1, postId: postId }),
  );

  const registerComment = (e: any) => {
    e.preventDefault();
    mutate({
      postId: postId,
      parentCommentId: '',
      content: textareaRef.current.value,
    });
    if (isLoading) {
      postButtonRef.current.disabled = true;
    }
  };

  const likePostFunction = (e: any) => {
    e.preventDefault();
    if (likeYn === 'Y') {
      mutateLikePost.mutate({ postId: postId, likeYn: 'N' });
    } else {
      mutateLikePost.mutate({ postId: postId, likeYn: 'Y' });
    }
  };

  const bookmarkPostFunction = (e: any) => {
    e.preventDefault();
    if (bookmarkYn === 'Y') {
      mutateBookmarkPost.mutate({ postId: postId, bookmarkYn: 'N' });
    } else {
      mutateBookmarkPost.mutate({ postId: postId, bookmarkYn: 'Y' });
    }
  };

  const isDisabled = (e: any) => {
    if (e.target.value === '') {
      postButtonRef.current.disabled = true;
    } else {
      postButtonRef.current.disabled = false;
    }
  };

  return (
    <FeedCardContainer>
      <UserInformationWrapper>
        <UserInfo>
          <UserAvatar>
            <img src={profileImage} alt="유저아바타" />
          </UserAvatar>
          <p onClick={() => navigate(`/user/${userId}`)}>{username}</p>
        </UserInfo>
        <KebabMenuIcon />
      </UserInformationWrapper>
      <ImageBoxWrapper onDoubleClick={() => setLikeButtonClicked(true)}>
        <LeftArrowIcon currentslide={currentSlide} onClick={PrevSlide} />
        <ImageWrapper ref={slideRef}>
          {postImageList.map((list: any) => (
            <img src={list} key={list} alt="유저이미지" />
          ))}
        </ImageWrapper>
        <RightArrowIcon
          totalslide={TOTAL_SLIDES}
          currentslide={currentSlide}
          onClick={NextSlide}
        />
        <BigLikedIcon likebuttonclicked={likeYn} />
      </ImageBoxWrapper>
      <CommentBoxWrapper>
        <IconBox>
          <LeftIconBox>
            {likeYn === 'Y' ? (
              <ColoredHeartIcon
                likebuttonclicked={likeYn}
                onClick={likePostFunction}
              />
            ) : (
              <HeartIcon onClick={likePostFunction} />
            )}
            <Link to={`/post/${postId}`} state={{ background: location }}>
              <ChatIcon />
              <Outlet />
            </Link>
            <LocationIcon />
          </LeftIconBox>
          <MeatballIconBox ref={circleRef}>
            {postImageList.map((list: any, i) => (
              <MeatballIcon key={list} currentslide={currentSlide} index={i} />
            ))}
          </MeatballIconBox>
          {bookmarkYn === 'Y' ? (
            <BookmarkFilledIcon onClick={bookmarkPostFunction} />
          ) : (
            <BookmarkIcon onClick={bookmarkPostFunction} />
          )}
        </IconBox>
        <LikedMemberBox>{likeCount} likes</LikedMemberBox>
        <FeedDescriptionBox>
          <div>{username}</div>
          <span> {content}</span>
          <button>more</button>
        </FeedDescriptionBox>
        <ViewAllCommentsBox>
          View all {commentCount} comments
        </ViewAllCommentsBox>
        <CommentsListBox>
          <CommentText>
            <div>
              {getCommentsListQuery.data?.data.commentList[0]?.username}
            </div>
            <p>
              <span>@minimal__0</span>
              {getCommentsListQuery.data?.data.commentList[0]?.content}
            </p>
          </CommentText>
          <SmallHeartIcon />
        </CommentsListBox>
        <DateBox>{timeForToday(createdAt)}</DateBox>
      </CommentBoxWrapper>
      <AddCommentBox>
        <SmileIcon />
        <textarea
          name=""
          id=""
          onChange={(e: any) => isDisabled(e)}
          ref={textareaRef}
          placeholder="Add a comment..."></textarea>
        {isLoading && (
          <Loader
            loaded={false}
            color="#8e8e8e"
            scale={0.7}
            top="50%"
            left="50%"
          />
        )}
        <button
          type="submit"
          ref={postButtonRef}
          disabled
          onClick={(e: any) => registerComment(e)}>
          Post
        </button>
      </AddCommentBox>
    </FeedCardContainer>
  );
};

export default FeedCard;
