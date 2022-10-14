import express from 'express';
import * as usersController from '../controllers/auth.controller.js';
import { schemaValidation } from '../middlewares/schemaValidationMiddleware.js';

const router = express();

router.post('/signup', schemaValidation, usersController.createUser);
router.post('/signin', schemaValidation, usersController.signIn);

export default router;
