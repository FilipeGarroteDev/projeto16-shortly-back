import { connection } from '../db/db.js';
import bcrypt from 'bcrypt';
import { newUserSchema } from '../schemas/usersSchema.js';

async function createUser(req, res) {
	const { name, email, password, confirmPassword } = req.body;
	const validation = newUserSchema.validate(req.body, {
		abortEarly: false,
	});

	if (validation.error) {
		const messages = validation.error.details
			.map((error) => error.message)
			.join('\n');

		console.log(validation.error);

		return res
			.status(422)
			.send(`Ocorreram os seguintes erros no cadastro:\n${messages}`);
	}

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

	const encryptedPassword = bcrypt.hashSync(password);

	connection.query(
		'INSERT INTO users (name, email, password) VALUES($1, $2, $3)',
		[name, email, encryptedPassword]
	);
	res.sendStatus(201);
}

export { createUser };
