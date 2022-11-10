import axios from 'axios';

const api = axios.create({
  baseURL: 'http://59.187.205.70:3000',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    accept: 'application/json,',
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

export const loginUser = async (userInfo: LoginType) => {
  const data = await api.post('/signin', JSON.stringify(userInfo));
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
