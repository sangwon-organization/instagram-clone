import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Footer from '../../components/layout/footer/Footer';
import NavigationBar from '../../components/layout/NavigationBar/NavigationBar';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { useMutation, useQuery } from '@tanstack/react-query';
import userAvatar from '../../assets/image/userAvatar.png';
import { commentPost, getPost } from '../../api/api';
import { GoKebabHorizontal } from 'react-icons/go';
import userImage from '../../assets/image/userImage.png';
import userImage2 from '../../assets/image/userImage2.png';
import userImage3 from '../../assets/image/userImage3.png';
import Loader from 'react-loader';
import { RiChat3Line } from 'react-icons/ri';
import { TbLocation } from 'react-icons/tb';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { FaBookmark, FaCircle, FaRegBookmark } from 'react-icons/fa';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';
import theme from '../../styles/theme';
import { timeForToday } from '../../utils/commons';
import { useForm } from 'react-hook-form';

const Container = styled.div`
  width: 100%;
  height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 60px;
`;

const Wrapper = styled.div`
  width: 930px;
  height: 600px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
`;

const ImageBoxWrapper = styled.div`
  width: 598px;
  height: 598px;
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
    height: fit-content;
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
  border-bottom: 1px solid ${({ theme }) => theme.ultraLightGreyColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
`;

const CommentsListBox = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.ultraLightGreyColor};
  width: 100%;
  height: 485px;
  padding: 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SmallHeartIcon = styled(BsHeart)`
  /* width: 15px; */
  /* height: 15px; */
  font-size: 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  &:hover {
    color: ${({ theme }) => theme.greyTextColor};
  }
  margin-top: 15px;
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
  totalslides: number;
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

const ButtonBox = styled.div`
  width: 100%;
  height: 112px;
  display: flex;
  flex-direction: column;
  /* border: 1px solid red; */
`;

const IconBox = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
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

const MeatballIcon = styled(FaCircle)`
  width: 6px;
  height: 6px;
  color: ${({ theme }) => theme.greyTextColor};
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
  /* border: 1px solid red; */
  span {
    color: ${({ theme }) => theme.textColor};
    font-size: 14px;
    font-weight: 600;
    float: left;
    margin-right: 5px;
    cursor: pointer;
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
  /* border: 1px solid red; */
  display: flex;
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

const ReplyBox = styled.div`
  width: 100%;
  height: fit-content;
  border: 1px solid blue;
  padding: 25px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  p {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.greyTextColor};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0 17px;
    cursor: pointer;
    &::before {
      content: '';
      display: inline-block;
      width: 30px;
      height: 1px;
      background: ${({ theme }) => theme.greyTextColor};
      margin-left: 3px;
    }
  }
`;

type FormValues = {
  // postId: number;
  content: string;
};

const PostPresenter = () => {
  const textareaRef = useRef(null);
  const postButtonRef = useRef(null);
  const circleRef = useRef(null);
  const slideRef = useRef(null);

  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  let params: any = useParams();

  const getUserPost = useQuery(['getPost', params], () =>
    getPost(params.postId),
  );

  const TOTAL_SLIDES = getUserPost.data?.data.postImageList.length;

  console.log(getUserPost.data?.data);

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

  const isDisabled = (e: any) => {
    if (e.target.value === '') {
      postButtonRef.current.disabled = true;
    } else {
      postButtonRef.current.disabled = false;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<FormValues>({ mode: 'onSubmit' });

  const registerComment = (e: any) => {
    e.preventDefault();
    mutate({
      postId: params.postId,
      parentCommentId: '',
      content: textareaRef.current.value,
    });
    if (isLoading) {
      postButtonRef.current.disabled = true;
    }
  };

  const { mutate, data, error, reset, isLoading } = useMutation(commentPost, {
    onError: (err: any) => {
      console.log(err.response.data);
    },
    onSuccess: (e: any) => {
      console.log('댓글 등록 성공!');
      textareaRef.current.value = '';
      textareaRef.current.focus();
    },
  });

  const onSubmit = (dataInput: any) => {
    console.log(dataInput);
    // console.log(data);
    mutate({
      postId: params.postId,
      parentCommentId: '',
      content: dataInput.content,
    });
  };

  const onError = (err: any) => {
    console.log(err);
  };

  useEffect(() => {
    slideRef.current.style.transition = 'all 0.5s ease-in-out';
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  }, [currentSlide]);
  return (
    <>
      <NavigationBar />
      <Container>
        <Wrapper>
          <ImageBoxWrapper>
            <LeftArrowIcon currentslide={currentSlide} onClick={PrevSlide} />
            <ImageWrapper ref={slideRef}>
              {getUserPost.data?.data.postImageList.map((image: any) => (
                <img src={image} key={image} alt="유저이미지" />
              ))}
            </ImageWrapper>
            <RightArrowIcon
              totalslides={TOTAL_SLIDES}
              currentslide={currentSlide}
              onClick={NextSlide}
            />
            <BigLikedIcon likebuttonclicked={'true'} />
          </ImageBoxWrapper>
          <PostInfo>
            <PostHeader>
              <UserInfo>
                <UserAvatar>
                  <img
                    src={getUserPost.data?.data.profileImage}
                    alt="유저아바타"
                  />
                </UserAvatar>
                <p
                  onClick={() =>
                    navigate(`/user/${getUserPost.data?.data.userId}`)
                  }>
                  {getUserPost.data?.data.username}
                </p>
              </UserInfo>
              <KebabMenuIcon />
            </PostHeader>
            <CommentsListBox>
              <CommentBox>
                <AvatarBox>
                  <UserAvatar>
                    <img
                      src={getUserPost.data?.data.profileImage}
                      alt="유저아바타"
                    />
                  </UserAvatar>
                </AvatarBox>
                <Comment>
                  <span
                    onClick={() =>
                      navigate(`/user/${getUserPost.data?.data.userId}`)
                    }>
                    {getUserPost.data?.data.username}
                  </span>
                  <p>{getUserPost.data?.data.content}</p>
                  <OptionBox>
                    <button>
                      {timeForToday(getUserPost.data?.data.createdAt)}
                    </button>
                  </OptionBox>
                </Comment>
                <SmallHeartIcon />
              </CommentBox>
              {getUserPost.data?.data.commentList.map((comment: any) => (
                <CommentBox key={comment.commentId}>
                  <AvatarBox>
                    <UserAvatar>
                      <img src={comment.profileImage} alt="유저아바타" />
                    </UserAvatar>
                  </AvatarBox>
                  <Comment>
                    <span onClick={() => navigate(`/user/${comment.userId}`)}>
                      {comment.username}
                    </span>
                    <p>{comment.content}</p>
                    <OptionBox>
                      <button>{timeForToday(comment.createdAt)}</button>
                      <button>
                        {comment.likeCount > 0
                          ? comment.likeCount + ' like'
                          : ''}
                      </button>
                    </OptionBox>
                  </Comment>
                  <SmallHeartIcon />
                </CommentBox>
              ))}
            </CommentsListBox>
            <PostBottom>
              <ButtonBox>
                <IconBox>
                  <LeftIconBox>
                    {true ? (
                      <ColoredHeartIcon likebuttonclicked={'true'} />
                    ) : (
                      <HeartIcon />
                    )}
                    <ChatIcon onClick={() => textareaRef.current.focus()} />
                    <LocationIcon />
                  </LeftIconBox>
                  {true ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                </IconBox>
                <LikeAndDateBox>
                  <p>{getUserPost.data?.data.likeCount} likes</p>
                  <p>{timeForToday(getUserPost.data?.data.createdAt)}</p>
                </LikeAndDateBox>
              </ButtonBox>
              <AddCommentBox onSubmit={handleSubmit(onSubmit, onError)}>
                <SmileIcon />
                <textarea
                  name="commentInput"
                  id="commentInput"
                  // onChange={(e: any) => isDisabled(e)}
                  ref={textareaRef}
                  {...register('content', { required: true })}
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
                  disabled={isValid}
                  // onClick={(e: any) => registerComment(e)}
                >
                  Post
                </button>
              </AddCommentBox>
            </PostBottom>
          </PostInfo>
        </Wrapper>
      </Container>
      <Footer />
    </>
  );
};

export default PostPresenter;
