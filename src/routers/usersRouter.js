import express from 'express';
import * as usersController from '../controllers/users.controller.js';

const router = express();

router.post('/signup', usersController.createUser);

export default router;
