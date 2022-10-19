import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository.js';

async function createUser(req, res) {
	const { name, email, password } = req.body;

	try {
		const hasEmail = await authRepository.searchEmail(email);

		if (hasEmail.rows.length > 0) {
			return res
				.status(409)
				.send(
					'Já existe um usuário com esse e-mail.\nPor gentileza, revise os campos.'
				);
		}

		const encryptedPassword = bcrypt.hashSync(password, 10);

		const teste = authRepository.createUser(name, email, encryptedPassword);

		res.status(201).send(teste);
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

async function signIn(req, res) {
	const { email, password } = req.body;

	try {
		const user = await authRepository.searchUserByEmail(email);
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
			{ expiresIn: 60 * 30 }
		);

		authRepository.login(token, user.rows[0].id);

		return res.status(200).send({ token });
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

export { createUser, signIn };
