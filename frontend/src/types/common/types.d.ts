// REST API 타입
interface LoginType {
  email: string;
  password: string;
}

interface SignUpType {
  email: string;
  password: string;
  name: string;
  username: string;
}

interface EmailDuplicationCheckType {
  email: string;
}

interface UsernameDuplicationCheckType {
  username: string;
}

interface ChangePasswordType {
  oldPassword: string;
  newPassword: string;
}

interface AddPostType {
  content: string;
  postImage1: File;
}

interface GetPostsListType {
  page: number;
  targetUserId?: number;
}

interface ModifyPostType {
  content: string;
  postImage1: File;
  postImage2: File;
  deleteImageIds: number[];
  postId: number;
}

interface LikePostType {
  likeYn: string;
  postId: number;
}

interface BookmarkPostType {
  bookmarkYn: string;
  postId: number;
}

interface CommentPostType {
  parentCommentId: string;
  postId: number;
  content: string;
}

interface ModifyCommentType {
  commentId: string;
  content: string;
}

interface DeleteCommentType {
  commentId: number;
}

interface LikeCommentType {
  commentId: number;
  likeYn: string;
}

interface GetCommentsListType {
  page: number;
  postId: number;
  parentCommentId?: number;
}

interface SetUserProfileImageType {
  postImage: File;
}

interface SearchUserType {
  page: number;
  keyword: string;
}

interface AddRecentSearchUserType {
  toUserId: number;
}

interface DeleteRecentSearchUserType {
  toUserId: number;
}

interface GetFollowingListType {
  page: number;
}

interface GetFollowerListType {
  page: number;
}

interface GetUserInformationType {
  targetUserId: number;
}

interface FollowingUserType {
  followUserId: number;
  followYn: string;
}

// 컴포넌트 props 타입
interface AppRouterType {
  isLoggedIn: boolean;
}

interface MetaTagType {
  title: string;
  description: string;
  keywords: string;
  imgsrc: string;
  url: string;
}

interface HomePresenterType {
  getPostsData: any;
  scrollRef: any;
}

interface ProfilePresenterType {
  getUserInformationData: any;
  onImageInputButtonClick: (event: React.MouseEvent<HTMLElement>) => void;
  imageInputRef: any;
  postImageRest: any;
  imageRef: any;
  onSubmit: any;
  handleSubmit: any;
  isLoading: any;
  isMyPage: boolean;
  followingUserIsLoading: any;
  userFollowingUnFollowing: any;
}

interface MiddleBoxType {
  question: string;
  linkText: string;
}

interface SearchBarTooltipType {
  showTooltip: boolean;
  setShowTooltip: Function;
  setSearchBarClicked: Function;
  userList: [];
  searchUserIsLoading: boolean;
  searchUserIsSuccess: boolean;
  getRecentSearchUserListData: [];
}

interface AvatarDropdownType {
  showDropdown: boolean;
  setShowDropdown: Function;
}

interface PostType {
  postImageList: string[];
  postId: number;
  likeCount: number;
  commentCount: number;
}

interface PostWrapperType {
  postId: number;
}

interface CommentsListBoxType {
  postId: number;
  getCommentsListData: any;
}

interface CreatePostModalType {
  profileImage: any;
}

interface DeleteConfirmModalType {
  postId: number;
  userId: number;
}

interface CommentItemType {
  profileImage: any;
  username: any;
  content: any;
  likeCount: any;
  commentId: any;
  createdAt: any;
  likeYn: any;
  userId: any;
}

interface PostDropDownModalType {
  isMyPost: boolean;
  postId: number;
  userId: number;
}

interface CommentDropDownModalType {
  commentId: number;
  userId: number;
}

interface FeedCardType {
  postId: number;
  username: string;
  profileImage: string;
  likeYn: string;
  likeCount: number;
  createdAt: Date;
  commentCount: number;
  bookmarkYn: string;
  content: string;
  postImageList: string[];
  userId: number;
}

interface SugesstionItemType {
  list: followerImFollowingListType;
}

// react-hook-form 타입
interface LoginFormValues {
  email: string;
  password: string;
}

interface SignUpFormValues {
  email: string;
  name: string;
  username: string;
  password: string;
}

interface CommentPostFormValues {
  commentInput: string;
}

interface AddPostFormValues {
  content: string;
  postImage1: File;
}

interface PostUserProfileImageFormValues {
  postImage: File;
}

//React-query useMutation 타입
interface LoginResponseData {
  code: number;
  message: string;
  userId: number;
  accessToken: string;
  accessTokenExpiredAt: Date;
  refreshToken: string;
  refreshTokenExpiredAt: Date;
}

interface ResponseData {
  code: number;
  message: string;
}

//React-query useQuery 타입
interface GetUserInformationDataType {
  code: number;
  message: string;
  userId: number;
  profileImage: string;
  name: string;
  username: string;
  bio: any;
  followYn: string;
  postCount: number;
  followingCount: number;
  followerCount: number;
  followerImFollowingList: followerImFollowingListType[];
  postList: PostListType[];
}

interface followerImFollowingListType {
  userId: number;
  username: string;
  name: string;
  profileImage: string;
  followYn: string;
}

interface PostListType extends followerImFollowingListType {
  postId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  bookmarkYn: string;
  likeYn: string;
  likeCount: number;
  commentCount: number;
  postImageList: string[];
}

interface getNotFollowingListType extends ResponseData {
  followingList: followerImFollowingListType[];
}

interface PageType extends ResponseData {
  page: string;
  postList: PostListType[];
}

interface CommentType extends CommentItemType {
  parentCommentId: number;
  updatedAt: Date;
  postId: number;
}

interface GetCommentsListQueryType extends ResponseData {
  page: number;
  commentList: CommentType[];
}

interface GetPostQueryType extends PostListType {
  commentList: CommentType[];
}
