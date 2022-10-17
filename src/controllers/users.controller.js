import * as usersRepository from '../repositories/usersRepository.js';

async function getUserHistoric(req, res) {
	const { userId } = res.locals;

	try {
		const historic = await usersRepository.getHistoric(userId);
		historic.rows[0].visitCount = Number(historic.rows[0].visitCount);
		return res.status(200).send(historic.rows[0]);
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

async function usersRanking(req, res) {
	try {
		const ranking = await usersRepository.getRanking();
		return res.status(200).send(ranking.rows);
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

export { getUserHistoric, usersRanking };
