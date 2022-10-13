import express from 'express';
import * as linksController from '../controllers/links.controller.js';
import { tokenValidation } from '../middlewares/tokenValidationMiddleware.js';

const router = express();

router.post('/urls/shorten', tokenValidation, linksController.shortenUrl);

export default router;
