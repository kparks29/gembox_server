import Controller from '../models/controllerModel'
import AuthService from './authService'

export default class AuthController extends Controller {
	constructor () {
		super()

		this.AuthService = new AuthService()

		this.login = this.login.bind(this)

		this.router.post('/login', this.login)
	}
	login (req, res) {
		this.AuthService.login(req.body).then((success) => {
			res.status(201).send(success)
		}).catch((error) => {
			res.status(400).send(error)
		})
	}
}