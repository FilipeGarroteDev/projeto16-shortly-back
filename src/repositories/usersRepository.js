import { connection } from '../db/db.js';

async function getHistoric(userId) {
	return connection.query(
		`
		SELECT 
			users.id,
			users.name,
			COALESCE(SUM(links."visitCount"), 0) AS "visitCount",
			CASE
				WHEN SUM(links."visitCount") IS NULL THEN json_build_array()                                                                                                                                             WHEN SUM(links."visitCount") IS NULL THEN NULL
				ELSE json_agg(json_build_object('id', links.id, 'shortUrl', links."shortUrl", 'url', links.url, 'visitCount', links."visitCount"))
			END AS "shortenedUrls"
		FROM users
		LEFT JOIN links
			ON users.id = links."userId"
		WHERE users.id = $1
		GROUP BY users.id
	`,
		[userId]
	);
}

async function getRanking() {
	return connection.query(`
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
}

export { getHistoric, getRanking };
