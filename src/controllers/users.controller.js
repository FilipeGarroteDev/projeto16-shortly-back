import { connection } from '../db/db.js';

async function getUserHistoric(req, res) {
	const { userId } = res.locals;

	try {
		const historic = await connection.query(
			`
      SELECT 
        users.id,
        users.name,
        COALESCE(SUM(links."visitCount"), 0) AS "visitCount",
        CASE
          WHEN "visitCount" IS NULL THEN json_build_array()
          ELSE json_agg(json_build_object('id', links.id, 'shortUrl', links."shortUrl", 'url', links.url, 'visitCount', links."visitCount"))
        END AS "shortenedUrls"
      FROM users
      JOIN links
        ON users.id = links."userId"
      WHERE users.id = $1
      GROUP BY users.id, links."visitCount"
    `,
			[userId]
		);
		historic.rows[0].visitCount = Number(historic.rows[0].visitCount);
		return res.status(200).send(historic.rows[0]);
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

async function usersRanking(req, res) {
	try {
		const ranking = await connection.query(`
      SELECT
        users.id,
        users.name,
        COUNT(links."userId") AS "linksCount",
        COALESCE(SUM(links."visitCount"), 0) AS "visitCount"
      FROM users
      LEFT JOIN links
        ON users.id = links."userId"
      GROUP BY users.id
      ORDER BY "visitCount" DESC, "linksCount" DESC
      LIMIT 10; 
    `);

		return res.status(200).send(ranking.rows);
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

export { getUserHistoric, usersRanking };
