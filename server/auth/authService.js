import Service from '../models/serviceModel'
import UserRepo from '../user/userRepo'
import bcrypt from 'bcrypt-nodejs'

export default class AuthService extends Service {
	constructor () {
		super()

		this.UserRepo = new UserRepo()
		this.bcrypt = bcrypt
	}

	login (data) {
		let token
		if (data && data.email && data.password) {
			return this.UserRepo.getUserByEmail(data.email).then((user) => {
				if (!user || user.length === 0) {
					return this.promise.reject('Incorrect Email or Password')
				}
				try {
					if (this.bcrypt.compareSync(data.password, user[0].hashedPassword.toString())) {
						let response = user[0]
						delete response.hashedPassword
						token = this.jwt.sign(response, process.env['GEMBOX_SECRET_KEY'], { expiresIn: '24h' })
						return this.UserRepo.getUserByUuid(response.id).then((results) => {
							results[0].token = token
							return this.promise.resolve(results[0])
						})
					} else {
						return this.promise.reject('Incorrect Email or Password')
					}
				} catch (err) {
					return this.promise.reject('Failed to Login')
				}
			}).catch((err) => {
				if (err === 'Incorrect Email or Password') {
					return this.promise.reject(err)
				}
				return this.promise.reject('Failed to Login')
			})
		} else {
			return this.promise.reject('Failed to Login')
		}
	}
}