import { connection } from '../db/db.js';
import bcrypt from 'bcrypt';
import { loginSchema, newUserSchema } from '../schemas/usersSchema.js';
import { v4 as uuid } from 'uuid';

async function createUser(req, res) {
	const { name, email, password } = req.body;
	const validation = newUserSchema.validate(req.body, {
		abortEarly: false,
	});

	if (validation.error) {
		const messages = validation.error.details
			.map((error) => error.message)
			.join('\n');

		return res
			.status(422)
			.send(`Ocorreram os seguintes erros no cadastro:\n${messages}`);
	}
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
	const token = uuid();
	const validation = loginSchema.validate(req.body);

	if (validation.error) {
		const messages = validation.error.details
			.map((error) => error.message)
			.join('\n');

		return res
			.status(422)
			.send(`Ocorreram os seguintes erros no login:\n${messages}`);
	}

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
