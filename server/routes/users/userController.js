import { registerUser, loginUser, verifyEmail } from './userService.js';

export const registerUserController = (req, res) => {
  return registerUser(req, res);
};

export const loginUserController = (req, res) => {
  return loginUser(req, res);
};

export const verifyEmailController = (req, res) => {
  return verifyEmail(req, res);
};
