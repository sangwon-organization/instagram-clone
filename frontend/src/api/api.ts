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

interface changePasswordType {
  oldPassword: string;
  newPassword: string;
}

interface addPostType {
  content: string;
  postImage1: File;
  postImage2?: File;
}

interface getPostsListType {
  page: number;
  targetUserId?: number;
}

export const loginUser = async (userInfo: LoginType) => {
  const { data } = await api.post('/signin', userInfo);
  localStorage.setItem('accessToken', data.accessToken);

  setTimeout(() => {
    window.location.reload();
  }, 600);
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
  console.log(data);
  window.location.reload();
  return data;
};

export const emailDuplicationCheck = async ({
  email,
}: EmailDuplicationCheckType) => {
  const { data } = await api.post('/user/checkEmail', { email });
  console.log(data);
  return data;
};

export const usernameDuplicationCheck = async ({
  username,
}: UsernameDuplicationCheckType) => {
  const { data } = await api.post('/user/checkUsername', { username });
  console.log(data);
  return data;
};

export const changePassword = async ({
  oldPassword,
  newPassword,
}: changePasswordType) => {
  const { data } = await api.post('/user/changePassword', {
    oldPassword,
    newPassword,
  });
  console.log(data);
  return data;
};

export const addPost = async (formData: FormData) => {
  const data = await multipartFormDataApi.post('/post', formData);
  return data;
};

export const getPostsList = async (requestParam: getPostsListType) => {
  if (requestParam.targetUserId) {
    const data = await bearerTokenApi.get(
      `/post/list?page=${requestParam.page}&targetUserId=${requestParam.targetUserId}`,
    );
    return data;
  } else {
    const data = await bearerTokenApi.get(
      `/post/list?page=${requestParam.page}`,
    );
    return data;
  }
};

interface modifyPostType {
  content: string;
  postImage1: File;
  postImage2: File;
  deleteImageIds: number[];
  postId: number;
}

export const modifyPost = async (formData: modifyPostType) => {
  const data = await multipartFormDataApi.put('/post', formData);
  return data;
};

export const deletePost = async (postId: number) => {
  const data = await api.delete(`/:${postId}`);
  return data;
};

export const getPost = async (postId: number) => {
  const data = await multipartFormDataApi.get(`/:${postId}`);
  return data;
};

interface likePostType {
  likeYn: string;
  postId: number;
}

export const likePost = async (requestParam: likePostType) => {
  const data = await bearerTokenApi.post('/post/like', requestParam);
  return data;
};

interface bookmarkPostType {
  bookmarkYn: string;
  postId: number;
}

export const bookmarkPost = async (requestParam: bookmarkPostType) => {
  const data = await bearerTokenApi.post('/post/bookmark', requestParam);
  return data;
};

interface commentPostType {
  parentCommentId: string;
  postId: number;
  content: string;
}

export const commentPost = async (requestParam: commentPostType) => {
  const data = await bearerTokenApi.post('/post/comment', requestParam);
  return data;
};

interface modifyCommentType {
  commentId: string;
  content: string;
}

export const modifyComment = async (requestParam: modifyCommentType) => {
  const data = await bearerTokenApi.put('/post/comment', requestParam);
  return data;
};

interface deleteCommentType {
  commentId: string;
}

// export const deleteComment = async (requestParam: deleteCommentType) => {
//   const data = await bearerTokenApi.delete('/post/comment', requestParam);
//   return data;
// };

interface likeCommentType {
  commentId: string;
  likeYn: string;
}

export const likeComment = async (requestParam: likeCommentType) => {
  const data = await bearerTokenApi.post('/post/comment/like', requestParam);
  return data;
};

interface getCommentsListType {
  page: number;
  postId: number;
  parentCommentId?: number;
}

export const getCommentsList = async (requestParam: getCommentsListType) => {
  if (requestParam.parentCommentId) {
    const data = await bearerTokenApi.get(
      `/post/comment/list?page=${requestParam.page}&postId=${requestParam.postId}&parentCommentId=${requestParam.parentCommentId}`,
    );
    return data;
  } else {
    const data = await bearerTokenApi.get(
      `/post/comment/list?page=${requestParam.page}&postId=${requestParam.postId}`,
    );
    return data;
  }
};
