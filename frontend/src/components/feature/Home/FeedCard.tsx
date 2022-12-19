import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
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
import { useMutation } from '@tanstack/react-query';
import { bookmarkPost, commentPost, likePost } from '../../../api/api';
import Loader from 'react-loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { timeForToday } from '../../../utils/commons';
import ModalPortal from '../Modal/ModalPortal';
import ModalContainer from '../Modal/ModalContainer';
import PostDropDownModal from '../Modal/PostDropDownModal';
import PostWrapper from '../Post/PostWrapper';
import CommentsListBox from '../Post/CommentsListBox';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';

type FormValues = {
  commentInput: string;
};

const FeedCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 470px;
  height: fit-content;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 10px;
  background: ${({ theme }) => theme.searchBarBgColor};
`;

const UserInformationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 5px 10px;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 10px;
  width: fit-content;
  height: fit-content;
  p {
    width: fit-content;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
`;

const ImageBoxWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: fit-content;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  img {
    flex: none;
    width: 100%;
    height: 585px;
    background: ${({ theme }) => theme.blackColor};
    object-fit: cover;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  border: 2px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(
      ${({ theme }) => theme.searchBarBgColor},
      ${({ theme }) => theme.searchBarBgColor}
    ),
    linear-gradient(to right, red 0%, orange 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const IconBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 46px;
  padding: 0 10px;
`;

const LeftIconBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px;
  height: 100%;
`;

const HeartIcon = styled(BsHeart)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const ColoredHeartIcon = styled(BsHeartFill)<{ likebuttonclicked: string }>`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.errorColor};
  cursor: pointer;
  animation: ${({ likebuttonclicked }) =>
    likebuttonclicked === 'Y' ? 'likeHeart 1s ease-in-out' : ''};
  @keyframes likeHeart {
    0% {
      transform: scale(1);
    }
    15% {
      transform: scale(1.2);
    }
    30% {
      transform: scale(0.95);
    }
    45%,
    80% {
      transform: scale(1);
    }
  }
`;

const ChatIcon = styled(RiChat3Line)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const LocationIcon = styled(TbLocation)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const BookmarkIcon = styled(FaRegBookmark)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const BookmarkFilledIcon = styled(FaBookmark)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const LikedMemberBox = styled.div`
  width: fit-content;
  height: fit-content;
  margin: 0 10px 10px 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
`;
const FeedDescriptionBox = styled.div`
  width: 100%;
  height: fit-content;
  padding: 0 10px 10px 10px;
  line-height: 18px;
  span:first-child {
    float: left;
    margin-right: 5px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
  }
  p {
    display: inline;
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
  }
  button {
    display: inline-block;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
    cursor: pointer;
  }
`;
const ViewAllCommentsBox = styled.div`
  width: fit-content;
  height: fit-content;
  margin: 0 10px 10px 10px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.greyTextColor};
  cursor: pointer;
`;

const DateBox = styled.div`
  width: 100%;
  height: fit-content;
  padding: 0 10px 10px 10px;
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.greyTextColor};
`;

const AddCommentBox = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: fit-content;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  textarea {
    width: 375px;
    height: 20px;
    margin-left: 10px;
    border: none;
    background: transparent;
    font-family: 'RobotoFont';
    outline: none;
    resize: none;
  }
  button {
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.buttonColor};
    &:disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }
`;

const SmileIcon = styled(HiOutlineEmojiHappy)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
`;

const KebabMenuIcon = styled(GoKebabHorizontal)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
`;

const BigLikedIcon = styled(BsHeartFill)<{ likebuttonclicked: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  color: ${({ theme }) => theme.whiteColor};
  transform: translate(-50%, -50%);
  transform-origin: center center;
  filter: drop-shadow(5px 5px 30px rgba(0, 0, 0, 0.7));
  opacity: 0;
  animation: ${({ likebuttonclicked }) =>
    likebuttonclicked && 'likeHeart 2s ease-in-out'};
  @keyframes likeHeart {
    0%,
    to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
    }
    15% {
      opacity: 0.9;
      transform: translate(-50%, -50%) scale(1.2);
    }
    30% {
      transform: translate(-50%, -50%) scale(0.95);
    }
    45%,
    80% {
      opacity: 0.9;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const LeftArrowIcon = styled(IoIosArrowDropleftCircle)<{
  currentslide: number;
}>`
  display: ${({ currentslide }) => currentslide === 0 && 'none'};
  position: absolute;
  top: 50%;
  left: 15px;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.whiteColor};
  opacity: 0.6;
  cursor: pointer;
  z-index: 200;
`;

const RightArrowIcon = styled(IoIosArrowDroprightCircle)<{
  currentslide: number;
  totalslide: number;
}>`
  display: ${({ currentslide, totalslide }) =>
    currentslide === totalslide - 1 && 'none'};
  position: absolute;
  top: 50%;
  right: 15px;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.whiteColor};
  z-index: 200;
  opacity: 0.6;
  cursor: pointer;
`;

const MeatballIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 3px;
  width: fit-content;
  height: 100%;
  margin-right: 80px;
  padding: 0 10px;
`;

const MeatballIcon = styled(FaCircle)<{ index: number; currentslide: number }>`
  width: 6px;
  height: 6px;
  color: ${({ theme, index, currentslide }) =>
    index === currentslide ? theme.buttonColor : theme.greyTextColor};
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
  refetchPage: (pageIndex: number) => void;
  pageIndex: number;
  refetch: any;
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
  refetchPage,
  pageIndex,
  refetch,
}: FeedCardProps) => {
  const [likeButtonClicked, setLikeButtonClicked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPostDropdown, setShowPostDropdown] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showMoreText, setShowMoreText] = useState(false);
  const slideRef = useRef(null);
  const circleRef = useRef(null);
  const textareaRef = useRef(null);
  const postButtonRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();

  const TOTAL_SLIDES = postImageList.length;

  const openModal = () => {
    setShowPostDropdown(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowPostDropdown(false);
    document.body.style.overflow = 'unset';
  };

  const openPost = () => {
    setShowPostModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePost = () => {
    setShowPostModal(false);
    document.body.style.overflow = 'unset';
    navigate(-1);
  };

  const NextSlide = () => {
    if (currentSlide >= TOTAL_SLIDES) {
      return;
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const PrevSlide = () => {
    if (currentSlide === 0) {
      return;
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const doubleClickImage = () => {
    setLikeButtonClicked(true);
    setTimeout(() => {
      setLikeButtonClicked(false);
    }, 1200);
  };

  useEffect(() => {
    slideRef.current.style.transition = 'all 0.5s ease-in-out';
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  }, [currentSlide]);

  const { mutate, data, error, reset, isLoading } = useMutation(commentPost, {
    onError: (err: AxiosError) => {
      console.log(err.response.data);
    },
    onSuccess: (e: AxiosResponse) => {
      console.log('댓글 등록 성공!');
      console.log(e);
      refetch();
      textareaRef.current.value = '';
      textareaRef.current.focus();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<FormValues>({ mode: 'onChange' });

  const { ref: commentRef, ...rest } = register('commentInput', {
    required: true,
  });

  const onSubmit = (dataInput: any) => {
    console.log(dataInput);
    mutate({
      postId: postId,
      parentCommentId: '',
      content: dataInput.commentInput,
    });
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const mutateLikePost = useMutation(likePost, {
    onError: (err: AxiosError) => {
      console.log(err.response.data);
    },
    onSuccess: (e) => {
      console.log('포스트 좋아요 성공!');
      refetch();
    },
  });

  const likePostFunction = (pageIndex: number) => (e: any) => {
    e.preventDefault();
    if (likeYn === 'Y') {
      mutateLikePost.mutate({ postId: postId, likeYn: 'N' });
    } else {
      mutateLikePost.mutate({ postId: postId, likeYn: 'Y' });
    }
  };

  const mutateBookmarkPost = useMutation(bookmarkPost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('북마크 성공!');
      refetch();
    },
  });

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

  const bookmarkPostFunction = (e: any) => {
    e.preventDefault();
    if (bookmarkYn === 'Y') {
      mutateBookmarkPost.mutate({ postId: postId, bookmarkYn: 'N' });
    } else {
      mutateBookmarkPost.mutate({ postId: postId, bookmarkYn: 'Y' });
    }
  };

  const myUserId = parseInt(localStorage.getItem('userId'));

  const isMyPost = myUserId === userId;

  return (
    <FeedCardContainer>
      <UserInformationWrapper>
        <UserInfo>
          <UserAvatar>
            <img src={profileImage} alt="유저아바타" />
          </UserAvatar>
          <p onClick={() => navigate(`/user/${userId}`)}>{username}</p>
        </UserInfo>
        <KebabMenuIcon onClick={openModal} />
      </UserInformationWrapper>
      <ImageBoxWrapper
        onDoubleClick={() => {
          doubleClickImage();
          mutateLikePost.mutate({ postId: postId, likeYn: 'Y' });
        }}>
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
        <BigLikedIcon likebuttonclicked={likeButtonClicked} />
      </ImageBoxWrapper>
      <CommentBoxWrapper>
        <IconBox>
          <LeftIconBox>
            {likeYn === 'Y' ? (
              <ColoredHeartIcon
                likebuttonclicked={likeYn}
                onClick={likePostFunction(pageIndex)}
              />
            ) : (
              <HeartIcon onClick={likePostFunction(pageIndex)} />
            )}
            <ChatIcon
              onClick={() => {
                window.history.pushState('', '', `/post/${postId}`);
                openPost();
              }}
            />
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
          <span>{username}</span>
          <p>{showMoreText ? content : content.substring(0, 30)}</p>
          {content.length > 30 && !showMoreText && (
            <span>
              ...
              <button onClick={() => setShowMoreText(true)}>more</button>
            </span>
          )}
        </FeedDescriptionBox>
        {commentCount > 0 && (
          <ViewAllCommentsBox
            onClick={() => {
              window.history.pushState('', '', `/post/${postId}`);
              openPost();
            }}>
            {commentCount === 1
              ? `View ${commentCount} comment`
              : `View all ${commentCount} comments`}
          </ViewAllCommentsBox>
        )}
        <CommentsListBox postId={postId} />
        <DateBox>{timeForToday(createdAt)}</DateBox>
      </CommentBoxWrapper>
      <AddCommentBox onSubmit={handleSubmit(onSubmit, onError)}>
        <SmileIcon />
        <textarea
          name="commentInput"
          id="commentInput"
          // onChange={(e: any) => isDisabled(e)}
          {...rest}
          ref={(e) => {
            commentRef(e);
            textareaRef.current = e;
          }}
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
          disabled={!isValid}
          onClick={(e: any) => registerComment(e)}>
          Post
        </button>
      </AddCommentBox>
      {showPostDropdown && (
        <ModalPortal>
          <ModalContainer closeModal={closeModal}>
            <PostDropDownModal
              isMyPost={isMyPost}
              postId={postId}
              userId={userId}
            />
          </ModalContainer>
        </ModalPortal>
      )}
      {showPostModal && (
        <ModalPortal>
          <ModalContainer closeModal={closePost}>
            <PostWrapper postId={postId} />
          </ModalContainer>
        </ModalPortal>
      )}
    </FeedCardContainer>
  );
};

export default FeedCard;
