import userQueries from './userQueries'
import Query from '../models/queryModel'
import bcrypt from 'bcrypt-nodejs'
import Promise from 'promise'

export default class UserRepo {

	constructor () {
		this.userQueries = userQueries
		this.Query = Query
		this.bcrypt = bcrypt
	}

	createUser (user) {
		user.salt = this.bcrypt.genSaltSync()
		user.hashedPassword = this.bcrypt.hashSync(user.password, user.salt)
		delete user.password
		let query = {
			sql: this.userQueries.createUser,
			values: [user]
		}
		return new this.Query(query).then((results) => {
			return results[0]
		})
	}

	getUserByEmail (email) {
		let query = {
			sql: this.userQueries.getUserByEmail,
			values: [email]
		}
		return new this.Query(query).then((results) => {
			return results[0]
		})
	}

	getUserById (id) {
		let query = {
			sql: this.userQueries.getUserById,
			values: [id]
		}
		return new this.Query(query).then((results) => {
			return results[0]
		})
	}

	getUserByUuid (uuid) {
		let query = {
			sql: this.userQueries.getUserByUuid,
			values: [uuid]
		}
		return new this.Query(query).then((results) => {
			return results[0]
		})
	}

	updateUserByUuid (user, userId) {
		let query = {
			sql: this.userQueries.updateUserByUuid,
			values: [user, userId]
		}
		return new this.Query(query).then((results) => {
			return results[0]
		})
	}

	updatePasswordByUuid (user, data) {
		if (user.hashedPassword.toString() === this.bcrypt.hashSync(data.oldPassword, user.salt)) {
			let hashedPassword = this.bcrypt.hashSync(data.newPassword, user.salt),
				query = {
					sql: this.userQueries.updatePasswordByUuid,
					values: [hashedPassword, user.id]
				}
			return new this.Query(query).then((results) => {
				return results[0]
			})
		} else {
			return Promise.reject('Invalid old password')
		}
	}

	deleteUserByUuid (userUuid) {
		let query = {
			sql: this.userQueries.deleteUserByUuid,
			values: [userUuid]
		}
		return new this.Query(query).then((results) => {
			return results[0]
		})
	}
}