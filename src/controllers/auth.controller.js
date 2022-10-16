import { connection } from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function createUser(req, res) {
	const { name, email, password } = req.body;

	try {
		const hasEmail = await connection.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);

		if (hasEmail.rows.length > 0) {
			return res
				.status(409)
				.send(
					'Já existe um usuário com esse e-mail.\nPor gentileza, revise os campos.'
				);
		}

		const encryptedPassword = bcrypt.hashSync(password, 10);

		connection.query(
			'INSERT INTO users (name, email, password) VALUES($1, $2, $3)',
			[name, email, encryptedPassword]
		);

		res.sendStatus(201);
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

async function signIn(req, res) {
	const { email, password } = req.body;

	try {
		const user = await connection.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);
		const isValidPassword = bcrypt.compareSync(
			password,
			user.rows.length === 0 ? '' : user.rows[0].password
		);

		if (user.rows.length === 0 || !isValidPassword) {
			return res
				.status(401)
				.send(
					'E-mail e/ou senha estão incorretos.\nPor gentileza, revise os dados'
				);
		}

		const token = jwt.sign(
			{
				userId: user.rows[0].id,
			},
			process.env.TOKEN_SECRET,
			{ expiresIn: 60 * 10 }
		);

		connection.query('INSERT INTO sessions (token, "userId") VALUES($1, $2)', [
			token,
			user.rows[0].id,
		]);
		return res.status(200).send({ token });
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

export { createUser, signIn };
