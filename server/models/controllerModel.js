import express from 'express'
import jwt from 'jsonwebtoken'
import Promise from 'promise'

export default class Controller {
	constructor () {
		this.privateRouter = express.Router() // eslint-disable-line babel/new-cap
		this.verifyToken = this.verifyToken.bind(this)
	}

	get router () {
		return this.privateRouter
	}

	get promise () {
		return Promise
	}

	verifyToken (req, res, next) {
		try {
			req.user = jwt.verify(req.headers['access-token'], process.env['GEMBOX_SECRET_KEY'])
			next()
		} catch (error) {
			console.log(error)
			return res.status(401).send('Invalid Token.')
		}
	}
}
