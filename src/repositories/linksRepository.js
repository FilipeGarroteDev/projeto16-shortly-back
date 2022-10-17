import { connection } from '../db/db.js';

async function searchUrlById(id) {
	return connection.query(
		`SELECT id, "shortUrl", url FROM links WHERE id = $1`,
		[id]
	);
}

async function searchUrlByLink(shortUrl) {
	return connection.query('SELECT id, url FROM links WHERE "shortUrl" = $1', [
		shortUrl,
	]);
}

async function updateVisitCount(id) {
	return connection.query(
		'UPDATE links SET "visitCount" = "visitCount" + 1 WHERE id = $1',
		[id]
	);
}

async function creatShortUrl(userId, url, shortUrl) {
	return connection.query(
		'INSERT INTO links ("userId", url, "shortUrl") VALUES($1, $2, $3)',
		[userId, url, shortUrl]
	);
}

async function deleteLink(id) {
	return connection.query('DELETE FROM links WHERE id = $1', [id]);
}

export {
	searchUrlById,
	creatShortUrl,
	searchUrlByLink,
	updateVisitCount,
	deleteLink,
};
