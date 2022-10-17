import { connection } from '../db/db.js';

async function searchEmail(email) {
	return connection.query('SELECT * FROM users WHERE email = $1', [email]);
}

async function createUser(name, email, encryptedPassword) {
	return connection.query(
		'INSERT INTO users (name, email, password) VALUES($1, $2, $3)',
		[name, email, encryptedPassword]
	);
}

async function searchUserByEmail(email) {
	return connection.query('SELECT * FROM users WHERE email = $1', [email]);
}

async function searchUserById(id) {
	return connection.query('SELECT * FROM users WHERE id = $1', [id]);
}

async function login(token, userId) {
	return connection.query(
		'INSERT INTO sessions (token, "userId") VALUES($1, $2)',
		[token, userId]
	);
}

async function searchActiveSession(token) {
	return connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
}

export {
	searchEmail,
	createUser,
	searchUserByEmail,
	login,
	searchActiveSession,
	searchUserById,
};
