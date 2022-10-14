import * as usersController from '../controllers/users.controller.js';
import express from 'express';
import { tokenValidation } from '../middlewares/tokenValidationMiddleware.js';

const router = express();

router.get('/users/me', tokenValidation, usersController.getUserHistoric);

export default router;
