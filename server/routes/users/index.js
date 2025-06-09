import express from 'express';
import {
  registerUserController,
  loginUserController,
  verifyEmailController,
} from './userController.js';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/verify-email', verifyEmailController);

export default router;
