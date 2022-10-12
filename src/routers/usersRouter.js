import express from 'express';
import * as usersController from '../controllers/users.controller.js';

const router = express();

router.post('/signup', usersController.createUser);
router.post('/signin', usersController.signIn);

export default router;
