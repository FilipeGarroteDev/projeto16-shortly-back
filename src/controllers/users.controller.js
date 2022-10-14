import { connection } from '../db/db.js';

async function getUserHistoric(req, res) {
	const { user } = res.locals;

	try {
		const historic = await connection.query(
			`
      SELECT 
        users.id,
        users.name,
        SUM(links."visitCount") AS "visitCount",
        json_agg(json_build_object('id', links.id, 'shortUrl', links."shortUrl", 'url', links.url, 'visitCount', links."visitCount")) AS "shortenedUrls"
      FROM users
      JOIN links
        ON users.id = links."userId"
      WHERE users.id = $1
      GROUP BY users.id
    `,
			[user.id]
		);

		return res.status(200).send(historic.rows[0]);
	} catch (error) {
		return res.status(500).sendo(error.message);
	}
}

async function usersRanking(req, res) {
	try {
		const ranking = await connection.query(`
      SELECT
        users.id,
        users.name,
        COUNT(links."userId") AS "linksCount",
        SUM(links."visitCount") AS "visitCount"
      FROM users
      LEFT JOIN links
        ON users.id = links."userId"
      GROUP BY users.id
      ORDER BY "visitCount" DESC
      LIMIT 10; 
    `);

		return res.status(200).send(ranking.rows);
	} catch (error) {}
}

export { getUserHistoric, usersRanking };
