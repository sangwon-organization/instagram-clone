import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loader from 'react-loader';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  bookmarkPost,
  commentPost,
  getCommentsList,
  likePost,
} from '../../../api/api';
import { timeForToday } from '../../../utils/commons';
import PostWrapper from '../Post/PostWrapper';
import ModalPortal from '../Modal/ModalPortal';
import ModalContainer from '../Modal/ModalContainer';
import PostDropDownModal from '../Modal/PostDropDownModal';
import CommentsListBox from '../Post/CommentsListBox';
import { AxiosError } from 'axios';

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
  aspect-ratio: 4/5;
  img {
    flex: none;
    width: 100%;
    /* height: 585px; */
    height: 100%;
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
    likebuttonclicked === 'Y' ? 'feedLike 1s ease-in-out' : ''};
  @keyframes feedLike {
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
  word-break: break-all;
  white-space: pre-wrap;
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
    max-height: 100px;
    margin-left: 10px;
    border: none;
    background: transparent;
    font-family: 'RobotoFont';
    color: ${({ theme }) => theme.textColor};
    outline: none;
    resize: none;
    overflow-y: auto;
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

const BigLikedIcon = styled(BsHeartFill)<{ likebuttonclicked: string }>`
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
    likebuttonclicked === 'true' && 'bigFeedLike 2s ease-in-out'};
  @keyframes bigFeedLike {
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
  opacity: 0.7;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  transform: translate3d(0, -50%, 0);
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
  opacity: 0.7;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  transform: translate3d(0, -50%, 0);
  cursor: pointer;
  z-index: 200;
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
}: FeedCardType) => {
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

  const queryClient = useQueryClient();

  const TOTAL_SLIDES = postImageList.length;

  const handleResizeHeight = useCallback(() => {
    textareaRef.current.style.height = '20px';
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  }, []);

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

  const nextSlide = (e: any) => {
    e.stopPropagation();
    if (currentSlide >= TOTAL_SLIDES) {
      return;
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
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

  const { mutate, isLoading } = useMutation<
    ResponseData,
    AxiosError,
    CommentPostType
  >(commentPost, {
    onError: (err) => {
      console.log('댓글 등록 실패!', err.response.data);
    },
    onSuccess: () => {
      console.log('댓글 등록 성공!');
      queryClient.invalidateQueries(['getPosts']);
      queryClient.invalidateQueries(['getCommentsList']);
      textareaRef.current.value = '';
      textareaRef.current.focus();
    },
  });

  const { data: getCommentsListData } = useQuery<
    GetCommentsListQueryType,
    AxiosError
  >(['getCommentsList', postId], () =>
    getCommentsList({ page: 1, postId: postId }),
  );

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<CommentPostFormValues>({ mode: 'onChange' });

  const { ref: commentRef, ...rest } = register('commentInput', {
    required: true,
  });

  const onSubmit = (dataInput: CommentPostFormValues) => {
    mutate({
      postId: postId,
      parentCommentId: '',
      content: dataInput.commentInput,
    });
  };

  const mutateLikePost = useMutation<ResponseData, AxiosError, LikePostType>(
    likePost,
    {
      onError: (err) => {
        console.log('포스트 좋아요 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('포스트 좋아요 성공!');
        queryClient.invalidateQueries(['getPosts']);
      },
    },
  );

  const likePostFunction = () => {
    if (likeYn === 'Y') {
      mutateLikePost.mutate({ postId: postId, likeYn: 'N' });
    } else {
      mutateLikePost.mutate({ postId: postId, likeYn: 'Y' });
    }
  };

  const mutateBookmarkPost = useMutation<
    ResponseData,
    AxiosError,
    BookmarkPostType
  >(bookmarkPost, {
    onError: (err) => {
      console.log('북마크 실패!', err.response.data);
    },
    onSuccess: () => {
      console.log('북마크 성공!');
      queryClient.invalidateQueries(['getPosts']);
    },
  });

  const bookmarkPostFunction = () => {
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
        onDoubleClick={(e) => {
          e.stopPropagation();
          doubleClickImage();
          mutateLikePost.mutate({ postId: postId, likeYn: 'Y' });
        }}>
        <LeftArrowIcon currentslide={currentSlide} onClick={prevSlide} />
        <ImageWrapper ref={slideRef}>
          {postImageList.map((list: string) => (
            <img src={list} key={list} alt="유저이미지" />
          ))}
        </ImageWrapper>
        <RightArrowIcon
          totalslide={TOTAL_SLIDES}
          currentslide={currentSlide}
          onClick={(e) => {
            nextSlide(e);
          }}
        />
        <BigLikedIcon likebuttonclicked={likeButtonClicked.toString()} />
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
            <ChatIcon
              onClick={() => {
                window.history.pushState('', '', `/post/${postId}`);
                openPost();
              }}
            />
            <LocationIcon />
          </LeftIconBox>
          <MeatballIconBox ref={circleRef}>
            {postImageList.length > 1 &&
              postImageList.map((list: string, i: number) => (
                <MeatballIcon
                  key={list}
                  currentslide={currentSlide}
                  index={i}
                />
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
        <CommentsListBox getCommentsListData={getCommentsListData} />
        <DateBox>{timeForToday(createdAt)}</DateBox>
      </CommentBoxWrapper>
      <AddCommentBox onSubmit={handleSubmit(onSubmit)}>
        <SmileIcon />
        <textarea
          name="commentInput"
          id="commentInput"
          {...rest}
          ref={(e) => {
            commentRef(e);
            textareaRef.current = e;
          }}
          placeholder="Add a comment..."
          onInput={handleResizeHeight}
        />
        {isLoading && (
          <Loader
            loaded={!isLoading}
            color="#8e8e8e"
            scale={0.7}
            top="50%"
            left="50%"
          />
        )}
        <button type="submit" ref={postButtonRef} disabled={!isValid}>
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
              closeModal={closeModal}
            />
          </ModalContainer>
        </ModalPortal>
      )}
      {showPostModal && (
        <ModalPortal>
          <ModalContainer closeIcon closeModal={closePost}>
            <PostWrapper postId={postId} setShowPostModal={setShowPostModal} />
          </ModalContainer>
        </ModalPortal>
      )}
    </FeedCardContainer>
  );
};

export default FeedCard;
