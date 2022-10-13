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

		await connection.query(
			'INSERT INTO links ("userId", url, "shortUrl") VALUES($1, $2, $3)',
			[user.rows[0].userId, url, shortUrl]
		);
		return res.status(201).send({ shortUrl });
	} catch (error) {}
}

async function selectUrl(req, res) {
	const { id } = req.params;

	if (isNaN(id)) return res.sendStatus(404);

	try {
		const link = await connection.query(
			`SELECT id, "shortUrl", url FROM links WHERE id = $1`,
			[Number(id)]
		);

		if (link.rows.length === 0 || isNaN(id)) return res.sendStatus(404);

		return res.status(200).send(link.rows[0]);
	} catch (error) {}
}

export { shortenUrl, selectUrl };
