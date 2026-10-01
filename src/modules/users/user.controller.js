import { Router } from 'express';
import { getProfile, signIn, signUp, signUpWithGmail } from './user.service.js';

const userRouter = Router();

userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.post('/signup/gmail', signUpWithGmail);
userRouter.get('/profile', getProfile);

export default userRouter;