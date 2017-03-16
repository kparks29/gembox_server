import Service from '../models/serviceModel'
import UserRepo from './userRepo'
import _ from 'lodash'

export default class UserService extends Service {

	constructor () {
		super()
		this.UserRepo = new UserRepo()
	}

	createUser (user) {
		let insertId,
			allowedProperties = [
				'email',
				'password',
				'phone',
				'firstName',
				'lastName'
			]

		if (!user) {
			return this.promise.reject('Missing Fields "email" and "password"')
		}
		if (!user.email) {
			return this.promise.reject('Missing Field "email"')
		}
		if (!user.password) {
			return this.promise.reject('Missing Field "password"')
		}

		_.each(Object.keys(user), (key) => {
			if (!allowedProperties.includes(key)) {
				return this.promise.reject(`Property not allowed "${key}"`)
			}
		})

		return this.UserRepo.getUserByEmail(user.email).then((results) => {
			if (results[0]) {
				return this.promise.reject('User already exists.')
			}
			return this.UserRepo.createUser(user)
		}).then((results) => {
			insertId = results.insertId
			return this.UserRepo.getUserById(results.insertId)
		}).then((results) => {
			let response = {
				user: results[0],
				token: this.jwt.sign(results[0], process.env['GEMBOX_SECRET_KEY'], { expiresIn: '7d' })
			}
			return this.promise.resolve(response)
		}).catch((error) => {
			if (error === 'User already exists.') {
				return this.promise.reject('Cannot Create User. ' + error)
			}
			return this.promise.reject('Cannot Create User.')
		})
	}

	getUserbyUuid (userUuid) {
		if (!userUuid) {
			return this.promise.reject('Missing Param User ID')
		}

		return this.UserRepo.getUserByUuid(userUuid).then((results) => {
			return this.promise.resolve(results[0])
		}).catch(() => {
			return this.promise.reject('Cannot Get User By Id: ' + userUuid)
		})
	}

	updateUser (userUuid, user) {
		let emailLookupUser,
			uuidLookupUser,
			allowedProperties = [
				'id',
				'email',
				'password',
				'phone',
				'firstName',
				'lastName'
			]

		if (!userUuid) {
			return this.promise.reject('Missing Param "id"')
		}

		_.each(Object.keys(user), (key) => {
			if (!allowedProperties.includes(key)) {
				return this.promise.reject(`Property not allowed "${key}"`)
			}
		})

		delete user.id

		return this.UserRepo.getUserByEmail(user.email).then((results) => {
			emailLookupUser = results[0]
			return this.UserRepo.getUserByUuid(userUuid)
		}).then((results) => {
			uuidLookupUser = results[0]
			if (!emailLookupUser || emailLookupUser.uuid === uuidLookupUser.uuid) {
				return this.UserRepo.updateUserByUuid(user, uuidLookupUser.id)
			} else {
				return this.promise.reject()
			}
		}).then(() => {
			return this.UserRepo.getUserByUuid(uuidLookupUser.id)
		}).then((results) => {
			return this.promise.resolve(results[0])
		}).catch(() => {
			return this.promise.reject('Cannot Update User.')
		})
	}

	updatePassword (userUuid, data) {
		let allowedProperties = [
			'oldPassword',
			'newPassword'
		]

		if (!data.oldPassword) {
			return this.promise.reject('Missing Field "old password"')
		}
		if (!data.newPassword) {
			return this.promise.reject('Missing Field "new password"')
		}
		if (!userUuid) {
			return this.promise.reject('Missing Param User ID.')
		}

		return this.UserRepo.getUserByUuid(userUuid).then((results) => {
			return this.UserRepo.updatePasswordByUuid(results[0], data)
		}).then(() => {
			return this.promise.resolve('Password Updated Successfully')
		}).catch(() => {
			return this.promise.reject('Cannot Update Password.')
		})
	}

	deleteUser (userUuid) {
		if (!userUuid) {
			return this.promise.reject('Missing Param User ID.')
		}

		return this.UserRepo.deleteUserByUuid(userUuid).then(() => {
			return this.promise.resolve('User Deleted Successfully.')
		}).catch(() => {
			return this.promise.reject('Cannot Delete User.')
		})
	}
}