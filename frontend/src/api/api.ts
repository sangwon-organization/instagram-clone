import axios from 'axios';

const api = axios.create({
  baseURL: 'http://59.187.205.70:3000',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    accept: 'application/json',
  },
});

const bearerTokenApi = axios.create({
  baseURL: 'http://59.187.205.70:3000',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    accept: 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
  },
});

const multipartFormDataApi = axios.create({
  baseURL: 'http://59.187.205.70:3000',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
  },
});

export const loginUser = async (userInfo: LoginType) => {
  const { data } = await api.post('/signin', userInfo);
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.userId);
  window.location.reload();
  return data;
};

export const signUpUser = async ({
  email,
  password,
  name,
  username,
}: SignUpType) => {
  const { data } = await api.post('/signup', {
    email,
    password,
    name,
    username,
  });
  window.location.reload();
  return data;
};

export const emailDuplicationCheck = async ({
  email,
}: EmailDuplicationCheckType) => {
  const { data } = await api.post('/user/checkEmail', { email });
  return data;
};

export const usernameDuplicationCheck = async ({
  username,
}: UsernameDuplicationCheckType) => {
  const { data } = await api.post('/user/checkUsername', { username });
  return data;
};

export const addPost = async (formData: FormData) => {
  const { data } = await multipartFormDataApi.post('/post', formData);
  return data;
};

export const getPostsList = async (requestParam: GetPostsListType) => {
  if (requestParam.targetUserId) {
    const { data } = await bearerTokenApi.get(
      `/post/list?page=${requestParam.page}&targetUserId=${requestParam.targetUserId}`,
    );
    return data;
  } else {
    const { data } = await bearerTokenApi.get(
      `/post/list?page=${requestParam.page}`,
    );
    return data;
  }
};

export const modifyPost = async (formData: ModifyPostType) => {
  const { data } = await multipartFormDataApi.put('/post', formData);
  return data;
};

export const deletePost = async (postId: number) => {
  const { data } = await bearerTokenApi.delete(`/post/${postId}`);
  return data;
};

export const getPost = async (postId: number) => {
  const { data } = await bearerTokenApi.get(`/post?postId=${postId}`);
  return data;
};

export const likePost = async (requestParam: LikePostType) => {
  const { data } = await bearerTokenApi.post('/post/like', requestParam);
  return data;
};

export const bookmarkPost = async (requestParam: BookmarkPostType) => {
  const { data } = await bearerTokenApi.post('/post/bookmark', requestParam);
  return data;
};

export const commentPost = async (requestParam: CommentPostType) => {
  const { data } = await bearerTokenApi.post('/post/comment', requestParam);
  return data;
};

export const deleteComment = async ({ commentId }: DeleteCommentType) => {
  const { data } = await bearerTokenApi.delete('/post/comment', {
    data: { commentId: commentId },
  });
  return data;
};

export const likeComment = async (requestParam: LikeCommentType) => {
  const { data } = await bearerTokenApi.post(
    '/post/comment/like',
    requestParam,
  );
  return data;
};

export const getCommentsList = async ({
  page,
  postId,
  parentCommentId,
}: GetCommentsListType) => {
  if (parentCommentId) {
    const { data } = await bearerTokenApi.get(
      `/post/comment/list?page=${page}&postId=${postId}&parentCommentId=${parentCommentId}`,
    );
    return data;
  } else {
    const { data } = await bearerTokenApi.get(
      `/post/comment/list?page=${page}&postId=${postId}`,
    );
    return data;
  }
};

export const setUserProfileImage = async (requestParam: FormData) => {
  const { data } = await multipartFormDataApi.post(
    '/user/profileImage',
    requestParam,
  );
  return data;
};

export const searchUser = async ({ page, keyword }: SearchUserType) => {
  const { data } = await bearerTokenApi.get(
    `/user/search?page=${page}&keyword=${keyword}`,
  );
  return data;
};

export const addRecentSearchUser = async (
  requestParam: AddRecentSearchUserType,
) => {
  const { data } = await bearerTokenApi.post('/user/search/log', requestParam);
  return data;
};

export const deleteRecentSearchUser = async ({
  toUserId,
}: DeleteRecentSearchUserType) => {
  const { data } = await bearerTokenApi.delete('/user/search/log', {
    data: { toUserId: toUserId },
  });
  return data;
};

export const getRecentSearchUsersList = async () => {
  const { data } = await bearerTokenApi.get('/user/search/log');
  return data;
};

export const getFollowingList = async ({ page }: GetFollowingListType) => {
  const { data } = await bearerTokenApi.get(`/user/followingList?page=${page}`);
  return data;
};

export const getFollowerList = async ({ page }: GetFollowerListType) => {
  const { data } = await bearerTokenApi.get(`/user/followerList?page=${page}`);
  return data;
};

export const getNotFollowingList = async () => {
  const { data } = await bearerTokenApi.get('/user/notFollowingList');
  return data;
};

export const followingUser = async (requestBody: FollowingUserType) => {
  const { data } = await bearerTokenApi.post(`/user/followUser`, requestBody);
  return data;
};

export const getUserInformation = async ({
  targetUserId,
}: GetUserInformationType) => {
  const { data } = await bearerTokenApi.get(
    `/user/info?targetUserId=${targetUserId}`,
  );
  return data;
};
