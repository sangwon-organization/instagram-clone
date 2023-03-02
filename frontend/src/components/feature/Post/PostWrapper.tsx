import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { bookmarkPost, commentPost, getPost, likePost } from '../../../api/api';
import { GoKebabHorizontal } from 'react-icons/go';
import Loader from 'react-loader';
import { RiChat3Line } from 'react-icons/ri';
import { TbLocation } from 'react-icons/tb';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBookmark, FaCircle, FaRegBookmark } from 'react-icons/fa';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';
import { timeForToday } from '../../../utils/commons';
import { useForm } from 'react-hook-form';
import ModalPortal from '../Modal/ModalPortal';
import ModalContainer from '../Modal/ModalContainer';
import PostDropDownModal from '../Modal/PostDropDownModal';
import CommentItem from './CommentItem';
import { AxiosError } from 'axios';
import { BiPlusCircle } from 'react-icons/bi';
import { getCommentsList } from '../../../api/api';

const Wrapper = styled.div`
  width: 930px;
  height: 598px;
  display: flex;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  background: ${({ theme }) => theme.bgColor};
`;

const ImageBoxWrapper = styled.div`
  width: 598px;
  height: 598px;
  display: flex;
  overflow: hidden;
  position: relative;
  background: black;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  img {
    width: 100%;
    aspect-ratio: 4/5;
    object-fit: cover;
    flex: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-select: none;
  }
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

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid transparent;
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
    width: 25px;
    height: 25px;
    border-radius: 50%;
    z-index: 100;
  }
`;

const PostInfo = styled.div`
  width: 335px;
  height: 598px;
  display: flex;
  flex-direction: column;
`;

const PostHeader = styled.div`
  width: 335px;
  height: 70px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
`;

const CommentsListBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 485px;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MoreCommentIcon = styled(BiPlusCircle)`
  font-size: 25px;
  color: ${({ theme }) => theme.textColor};
  /* margin: 10px; */
  cursor: pointer;
`;

const PostBottom = styled.div`
  width: 100%;
  height: fit-content;
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
    width: 70%;
    height: 20px;
    max-height: 80px;
    margin-left: 10px;
    border: none;
    background: transparent;
    font-family: 'RobotoFont';
    color: ${({ theme }) => theme.textColor};
    resize: none;
    outline: none;
    overflow-y: auto;
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
  opacity: 0;
  animation: ${({ likebuttonclicked }) =>
    likebuttonclicked === 'true' && 'bigPostLike 2s ease-in-out'};
  @keyframes bigPostLike {
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
  ${({ currentslide }) => currentslide === 0 && 'display: none'};
`;

const RightArrowIcon = styled(IoIosArrowDroprightCircle)<{
  currentslide: number;
  totalslides: number;
}>`
  position: absolute;
  top: 50%;
  right: 15px;
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.whiteColor};
  opacity: 0.7;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  cursor: pointer;
  transform: translate3d(0, -50%, 0);
  z-index: 200;
  ${({ currentslide, totalslides }) =>
    currentslide === totalslides - 1 && 'display: none'};
`;

const KebabMenuIcon = styled(GoKebabHorizontal)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
`;

const SmileIcon = styled(HiOutlineEmojiHappy)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
`;

const ColoredHeartIcon = styled(BsHeartFill)<{ likebuttonclicked: string }>`
  width: 23px;
  height: 23px;
  font-size: 12px;
  color: #ed4956;
  cursor: pointer;
  animation: ${({ likebuttonclicked }) =>
    likebuttonclicked === 'Y' ? 'postLike 1s ease-in-out' : ''};
  @keyframes postLike {
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
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 112px;
  /* border: 1px solid red; */
`;

const IconBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 10px;
`;

const MeatballIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 3px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: fit-content;
  height: fit-content;
  padding: 0 10px;
  margin-right: 80px;
  transform: translate3d(-50%, 0, 0);
`;

const MeatballIcon = styled(FaCircle)<{ index: number; currentslide: number }>`
  width: 6px;
  height: 6px;
  color: ${({ theme, index, currentslide }) =>
    index === currentslide ? theme.whiteColor : theme.greyTextColor};
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

const LikeAndDateBox = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px 0;
  p:first-child {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    line-height: 18px;
    margin-left: 10px;
  }
  p:last-child {
    font-size: 10px;
    font-weight: 400;
    color: ${({ theme }) => theme.greyTextColor};
    letter-spacing: 0.2px;
    line-height: 12px;
    margin-left: 10px;
  }
`;

const CommentBox = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0 10px;
  padding: 10px 0;
`;

const AvatarBox = styled.div`
  /* border: 1px solid red; */
`;

const Comment = styled.div`
  width: 80%;
  height: fit-content;
  margin-top: 5px;
  line-height: 18px;
  white-space: pre-wrap;
  word-break: break-all;
  span {
    float: left;
    margin-right: 5px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.greyTextColor};
    }
  }
  p {
    color: ${({ theme }) => theme.textColor};
    font-size: 14px;
    font-weight: 400;
  }
`;

const OptionBox = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 10px;
  button {
    font-size: 12px;
    font-weight: 400;
    padding: 0;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.greyTextColor};
  }
`;

const NextPageIconBox = styled.div<{ hasnextpage: boolean }>`
  margin: 10px;
  display: ${({ hasnextpage }) => (hasnextpage ? 'block' : 'none')};
`;

const PostWrapper = ({ postId, setShowPostModal }: PostWrapperType) => {
  const [likeButtonClicked, setLikeButtonClicked] = useState('false');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPostDropdown, setShowPostDropdown] = useState(false);

  const textareaRef = useRef(null);
  const slideRef = useRef(null);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const location = useLocation().pathname;

  const myUserId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {
    slideRef.current.style.transition = 'all 0.5s ease-in-out';
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  }, [location, currentSlide]);

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<CommentPostFormValues>({ mode: 'onChange' });

  const { ref: commentRef, ...rest } = register('commentInput', {
    required: true,
  });

  const { data: getUserPostData } = useQuery<GetPostQueryType, AxiosError>(
    ['getPost', postId],
    () => getPost(postId),
  );

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: getCommentsListData,
  } = useInfiniteQuery<GetCommentsListQueryType, AxiosError>(
    ['getCommentsList'],
    ({ pageParam = 1 }) =>
      getCommentsList({
        page: pageParam,
        postId: postId,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.commentList.length === 20) {
          return allPages.length + 1;
        } else {
          return false;
        }
      },
    },
  );

  const { mutate: commentPostMutate, isLoading: commentPostIsLoading } =
    useMutation<ResponseData, AxiosError, CommentPostType>(commentPost, {
      onError: (err) => {
        console.log('댓글 등록 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('댓글 등록 성공!');
        Promise.all([
          queryClient.invalidateQueries(['getCommentsList']),
          queryClient.invalidateQueries(['getPosts']),
          queryClient.invalidateQueries(['getUserInformation']),
        ]);
        textareaRef.current.value = '';
        textareaRef.current.focus();
      },
    });

  const mutateLikePost = useMutation<ResponseData, AxiosError, LikePostType>(
    likePost,
    {
      onError: (err) => {
        console.log('포스트 좋아요 실패!', err.response.data);
      },
      onSuccess: () => {
        console.log('포스트 좋아요 성공!');
        Promise.all([
          queryClient.invalidateQueries(['getPost']),
          queryClient.invalidateQueries(['getUserInformation']),
        ]);
      },
    },
  );

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
      Promise.all([
        queryClient.invalidateQueries(['getPost']),
        queryClient.invalidateQueries(['getPosts']),
      ]);
    },
  });

  const totalSlide = getUserPostData?.postImageList.length;

  const doubleClickImage = () => {
    setLikeButtonClicked('true');
    setTimeout(() => {
      setLikeButtonClicked('false');
    }, 1200);
  };

  const nextSlide = () => {
    if (currentSlide >= totalSlide) {
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

  const onSubmit = (dataInput: CommentPostFormValues) => {
    commentPostMutate({
      postId: postId,
      parentCommentId: '',
      content: dataInput.commentInput,
    });
  };

  const likePostFunction = () => {
    if (getUserPostData?.likeYn === 'Y') {
      mutateLikePost.mutate({
        postId: getUserPostData?.postId,
        likeYn: 'N',
      });
    } else {
      mutateLikePost.mutate({
        postId: getUserPostData?.postId,
        likeYn: 'Y',
      });
    }
  };

  const bookmarkPostFunction = () => {
    if (getUserPostData?.bookmarkYn === 'Y') {
      mutateBookmarkPost.mutate({ postId: postId, bookmarkYn: 'N' });
    } else {
      mutateBookmarkPost.mutate({ postId: postId, bookmarkYn: 'Y' });
    }
  };

  const openModal = () => {
    setShowPostDropdown(true);
  };

  const closeModal = () => {
    setShowPostDropdown(false);
  };

  const handleResizeHeight = useCallback(() => {
    textareaRef.current.style.height = '20px';
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  }, []);

  const isMyPost = myUserId === getUserPostData?.userId;

  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <ImageBoxWrapper>
        <LeftArrowIcon currentslide={currentSlide} onClick={prevSlide} />
        <ImageWrapper
          ref={slideRef}
          onDoubleClick={() => {
            doubleClickImage();
            mutateLikePost.mutate({
              postId: getUserPostData?.postId,
              likeYn: 'Y',
            });
          }}>
          {getUserPostData?.postImageList.map((image: string) => (
            <img src={image} key={image} alt="유저이미지" />
          ))}
        </ImageWrapper>
        <MeatballIconBox>
          {getUserPostData?.postImageList.length > 1 &&
            getUserPostData?.postImageList.map((list: string, i: number) => (
              <MeatballIcon key={list} currentslide={currentSlide} index={i} />
            ))}
        </MeatballIconBox>
        <RightArrowIcon
          totalslides={totalSlide}
          currentslide={currentSlide}
          onClick={nextSlide}
        />
        <BigLikedIcon likebuttonclicked={likeButtonClicked} />
      </ImageBoxWrapper>
      <PostInfo>
        <PostHeader>
          <UserInfo>
            <UserAvatar>
              <img
                src={getUserPostData?.profileImage}
                alt="유저아바타"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${getUserPostData?.userId}`);
                  setShowPostModal(false);
                  document.body.style.overflow = 'unset';
                }}
              />
            </UserAvatar>
            <p
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/user/${getUserPostData?.userId}`);
                setShowPostModal(false);
                document.body.style.overflow = 'unset';
              }}>
              {getUserPostData?.username}
            </p>
          </UserInfo>
          <KebabMenuIcon onClick={openModal} />
        </PostHeader>
        <CommentsListBox>
          <CommentBox>
            <AvatarBox>
              <UserAvatar>
                <img
                  src={getUserPostData?.profileImage}
                  alt="유저아바타"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${getUserPostData?.userId}`);
                    setShowPostModal(false);
                    document.body.style.overflow = 'unset';
                  }}
                />
              </UserAvatar>
            </AvatarBox>
            <Comment>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${getUserPostData?.userId}`);
                  setShowPostModal(false);
                  document.body.style.overflow = 'unset';
                }}>
                {getUserPostData?.username}
              </span>
              <p>{getUserPostData?.content}</p>
              <OptionBox>
                <button>{timeForToday(getUserPostData?.createdAt)}</button>
              </OptionBox>
            </Comment>
          </CommentBox>
          {getCommentsListData?.pages.map((page: GetCommentsListQueryType) =>
            page.commentList
              .sort(
                (a: CommentType, b: CommentType) =>
                  +new Date(b.createdAt) - +new Date(a.createdAt),
              )
              .map((comment: CommentType) => (
                <CommentItem
                  key={comment.commentId}
                  commentId={comment.commentId}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  likeYn={comment.likeYn}
                  likeCount={comment.likeCount}
                  profileImage={comment.profileImage}
                  userId={comment.userId}
                  username={comment.username}
                  setShowPostModal={setShowPostModal}
                />
              )),
          )}

          <NextPageIconBox hasnextpage={hasNextPage}>
            {isFetchingNextPage && (
              <Loader
                loaded={!isFetchingNextPage}
                color="#8e8e8e"
                scale={0.5}
                top="50%"
                left="50%"
                position="relative"
              />
            )}
            {hasNextPage && !isFetchingNextPage && (
              <MoreCommentIcon onClick={() => fetchNextPage()} />
            )}
          </NextPageIconBox>
        </CommentsListBox>
        <PostBottom>
          <ButtonBox>
            <IconBox>
              <LeftIconBox>
                {getUserPostData?.likeYn === 'Y' ? (
                  <ColoredHeartIcon
                    likebuttonclicked={getUserPostData?.likeYn}
                    onClick={likePostFunction}
                  />
                ) : (
                  <HeartIcon onClick={likePostFunction} />
                )}
                <ChatIcon onClick={() => textareaRef.current.focus()} />
                <LocationIcon />
              </LeftIconBox>
              {getUserPostData?.bookmarkYn === 'Y' ? (
                <BookmarkFilledIcon onClick={bookmarkPostFunction} />
              ) : (
                <BookmarkIcon onClick={bookmarkPostFunction} />
              )}
            </IconBox>
            <LikeAndDateBox>
              <p>{getUserPostData?.likeCount} likes</p>
              <p>{timeForToday(getUserPostData?.createdAt)}</p>
            </LikeAndDateBox>
          </ButtonBox>
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
            {commentPostIsLoading && (
              <Loader
                loaded={false}
                color="#8e8e8e"
                scale={0.7}
                top="50%"
                left="50%"
              />
            )}
            <button type="submit" disabled={!isValid}>
              Post
            </button>
          </AddCommentBox>
        </PostBottom>
      </PostInfo>
      {showPostDropdown && (
        <ModalPortal>
          <ModalContainer closeModal={closeModal}>
            <PostDropDownModal
              isMyPost={isMyPost}
              postId={getUserPostData?.postId}
              userId={getUserPostData?.userId}
              closeModal={closeModal}
            />
          </ModalContainer>
        </ModalPortal>
      )}
    </Wrapper>
  );
};

export default PostWrapper;
