import { connection } from '../db/db.js';
import { customAlphabet } from 'nanoid';
import { bigUrlSchema } from '../schemas/linksSchema.js';

async function shortenUrl(req, res) {
	const validation = bigUrlSchema.validate(req.body);

	if (validation.error) {
		return res
			.status(422)
			.send(
				`Por gentileza, refaça a operação. Aconteceu o seguinte erro:\n\n${validation.error.details[0].message}`
			);
	}

	try {
		const nanoid = customAlphabet('1234567890abcdef', 8);
		const { url } = req.body;
		const shortUrl = nanoid();
		const { user } = res.locals;

		connection.query(
			'INSERT INTO links ("userId", url, "shortUrl") VALUES($1, $2, $3)',
			[user.rows[0].userId, url, shortUrl]
		);
		return res.status(201).send({ shortUrl });
	} catch (error) {}
}

export { shortenUrl };
