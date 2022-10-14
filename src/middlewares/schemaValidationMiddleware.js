import { bigUrlSchema } from '../schemas/linksSchema.js';
import { loginSchema, newUserSchema } from '../schemas/usersSchema.js';

async function schemaValidation(req, res, next) {
	const selectedSchema = chooseSchema(req);

	const validation = selectedSchema.validate(req.body, {
		abortEarly: false,
	});

	if (validation.error) {
		const messages = validation.error.details
			.map((error) => error.message)
			.join('\n');

		return res.status(422).send(`Ocorreram os seguintes erros:\n\n${messages}`);
	}

	next();
}

function chooseSchema(req) {
	const path = req.url;

	switch (path) {
		case '/signup':
			return newUserSchema;
		case '/signin':
			return loginSchema;
		case '/urls/shorten':
			return bigUrlSchema;
		default:
			console.log('DEU RUIM NO SCHEMA!!!!');
			return;
	}
}

export { schemaValidation };
