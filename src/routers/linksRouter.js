import express from 'express';
import * as linksController from '../controllers/links.controller.js';
import { schemaValidation } from '../middlewares/schemaValidationMiddleware.js';
import { tokenValidation } from '../middlewares/tokenValidationMiddleware.js';

const router = express();

router.post(
	'/urls/shorten',
	schemaValidation,
	tokenValidation,
	linksController.shortenUrl
);
router.get('/urls/:id', linksController.selectUrl);
router.get('/urls/open/:shortUrl', linksController.linkRedirect);
router.delete('/urls/:id', tokenValidation, linksController.deleteLink);

export default router;
