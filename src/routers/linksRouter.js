import express from 'express';
import * as linksController from '../controllers/links.controller.js';
import { tokenValidation } from '../middlewares/tokenValidationMiddleware.js';

const router = express();

router.post('/urls/shorten', tokenValidation, linksController.shortenUrl);
router.get('/urls/:id', linksController.selectUrl);
router.get('/urls/open/:shortUrl', linksController.linkRedirect);

export default router;
