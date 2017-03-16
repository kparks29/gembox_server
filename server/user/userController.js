import Controller from '../models/controllerModel'
import UserService from './userService'

export default class UserController extends Controller {
	constructor () {
		super()

		this.UserService = new UserService()

		this.createUser = this.createUser.bind(this)
		this.getUserByUuid = this.getUserByUuid.bind(this)
		this.updateUser = this.updateUser.bind(this)
		this.updatePassword = this.updatePassword.bind(this)
		this.deleteUser = this.deleteUser.bind(this)

		this.router.post('', this.createUser)
		this.router.use(this.verifyToken)
		this.router.get('/:id', this.getUserByUuid)
		this.router.put('/:id', this.updateUser)
		this.router.put('/:id/password', this.updatePassword)
		this.router.delete('/:id', this.deleteUser)
	}

	createUser (req, res) {
		this.UserService.createUser(req.body).then((user) => {
			res.status(200).send(user)
		}).catch((error) => {
			res.status(400).send(error)
		})
	}

	getUserByUuid (req, res) {
		this.UserService.getUserByUuid(req.params.id).then((success) => {
			res.status(200).send(this.filterResponse(req.resources, success))
		}).catch((error) => {
			res.status(400).send(error)
		})
	}

	updateUser (req, res) {
		this.UserService.updateUser(req.params.id, req.body).then((success) => {
			res.status(200).send(success)
		}).catch((error) => {
			res.status(400).send(error)
		})
	}

	updatePassword (req, res) {
		this.UserService.updatePassword(req.params.id, req.body).then((success) => {
			res.status(200).send(success)
		}).catch((error) => {
			res.status(400).send(error)
		})
	}

	deleteUser (req, res) {
		this.UserService.deleteUser(req.params.id).then((success) => {
			res.status(200).send(success)
		}).catch((error) => {
			res.status(400).send(error)
		})
	}
}