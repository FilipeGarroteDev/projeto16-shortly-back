import express from 'express';
import * as usersController from '../controllers/auth.controller.js';

const router = express();

router.post('/signup', usersController.createUser);
router.post('/signin', usersController.signIn);

export default router;
