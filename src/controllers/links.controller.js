import { connection } from '../db/db.js';
import { customAlphabet } from 'nanoid';

async function shortenUrl(req, res) {
	try {
		const nanoid = customAlphabet('1234567890abcdef', 8);
		const { url } = req.body;
		const shortUrl = nanoid();
		const { userId } = res.locals;

		await connection.query(
			'INSERT INTO links ("userId", url, "shortUrl") VALUES($1, $2, $3)',
			[userId, url, shortUrl]
		);
		return res.status(201).send({ shortUrl });
	} catch (error) {
		return res.status(500).send(error.message);
	}
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

async function linkRedirect(req, res) {
	const { shortUrl } = req.params;

	try {
		const link = await connection.query(
			'SELECT id, url FROM links WHERE "shortUrl" = $1',
			[shortUrl]
		);

		if (link.rows.length === 0) {
			return res
				.status(404)
				.send(
					'Esse link não existe. Por gentileza, verifique o valor inserido e refaça a operação.'
				);
		}

		connection.query(
			'UPDATE links SET "visitCount" = "visitCount" + 1 WHERE id = $1',
			[link.rows[0].id]
		);

		return res.redirect(link.rows[0].url);
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

async function deleteLink(req, res) {
	const { id } = req.params;
	const { userId } = res.locals;

	if (isNaN(id)) {
		return res.status(404).send('O id informado possui formato inválido.');
	}
	try {
		const link = await connection.query('SELECT * FROM links WHERE id = $1', [
			Number(id),
		]);
		if (link.rows.length === 0) {
			return res
				.status(404)
				.send(
					'Não foi encontrado nenhum link com o id informado. Por gentileza, revise os dados.'
				);
		}
		if (link.rows[0].userId !== userId) {
			return res
				.status(401)
				.send(
					'A url indicada não pertence ao usuário logado e, portanto, não pode ser deletada.'
				);
		}

		connection.query('DELETE FROM links WHERE id = $1', [Number(id)]);
		return res.sendStatus(204);
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

export { shortenUrl, selectUrl, linkRedirect, deleteLink };
