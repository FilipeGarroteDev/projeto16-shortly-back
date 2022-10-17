import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository.js';

async function tokenValidation(req, res, next) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	let userId;

	try {
		const session = await authRepository.searchActiveSession(token);

		if (!token || session.rows.length === 0) {
			return res
				.status(401)
				.send('O token de autenticação não é válido.\nFavor, refaça o login.');
		}

		try {
			const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
			userId = verifiedToken.userId;

			console.log(userId);
			console.log(verifiedToken);
		} catch (error) {
			return res
				.status(401)
				.send('O token de autenticação está expirado.\nFavor, refaça o login.');
		}

		const user = await authRepository.searchUserById(userId);

		if (user.rows.length === 0) {
			return res
				.status(404)
				.send('Esse usuário não existe. Por favor, revise os dados.');
		}

		console.log(userId);

		res.locals.userId = userId;
		next();
	} catch (error) {
		res.status(500).send(error.message);
		next();
	}
}

export { tokenValidation };
