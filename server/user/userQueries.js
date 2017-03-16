export default {
	createUser: 'INSERT INTO users SET ?;',
	getUserByEmail: 'SELECT uuid AS id, email, phone, firstName, lastName, hashedPassword FROM users WHERE email=?',
	getUserById: 'SELECT uuid AS id, email, phone, firstName, lastName FROM users WHERE id=?',
	getUserByUuid: 'SELECT uuid AS id, email, phone, firstName, lastName FROM users WHERE uuid=?',
	updateUserByUuid: 'UPDATE users SET ? WHERE uuid=?;',
	updatePasswordByUuid: 'UPDATE users SET hashedPassword=? WHERE uuid=?;',
	deleteUserByUuid: 'DELETE FROM users WHERE uuid=?;'
}