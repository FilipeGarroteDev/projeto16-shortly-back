import { connection } from '../db/db.js';

async function tokenValidation(req, res, next) {
	const token = req.headers.authorization?.replace('Bearer ', '');

	try {
		const session = await connection.query(
			'SELECT * FROM sessions WHERE token = $1',
			[token]
		);

		if (!token || session.rows.length === 0) {
			return res
				.status(401)
				.send(
					'O token de autenticação não é válido ou está expirado.\nFavor, refaça o login.'
				);
		}

		const user = await connection.query('SELECT * FROM users WHERE id = $1', [
			session.rows[0].userId,
		]);

		if (user.rows.length === 0) {
			return res
				.status(404)
				.send('Esse usuário não existe. Por favor, revise os dados.');
		}

		res.locals.user = user.rows[0];
		next();
	} catch (error) {
		res.status(500).send(error.message);
		next();
	}
}

export { tokenValidation };
